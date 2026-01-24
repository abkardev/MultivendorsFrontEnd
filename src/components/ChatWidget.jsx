import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import api from "../api";
import { useAuth } from "../AuthProvider";
import { useTranslation } from "react-i18next";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:8000";

export default function ChatWidget() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [messages, setMessages] = useState([]); // all messages for the user (history)
  const [input, setInput] = useState("");
  const socketRef = useRef(null);
  const [threads, setThreads] = useState([]); // conversation threads
  const [activeThreadId, setActiveThreadId] = useState(null); // selected vendor/otherId
  const [vendors, setVendors] = useState([]); // vendor list for starting new chats
  const [showVendorList, setShowVendorList] = useState(false);

  useEffect(() => {
    if (!user) return;

    socketRef.current = io(SOCKET_URL, {
      auth: { token: localStorage.getItem("token") },
      transports: ["websocket"]
    });

    socketRef.current.emit("join", { userId: user._id });

    socketRef.current.on("chat:message", (msg) => {
      setMessages((m) => [...m, msg]);
    });

    (async () => {
      try {
        const [threadsRes, historyRes] = await Promise.all([api.get("/chat/threads/me"), api.get("/chat/history/me")]);
        setThreads(threadsRes.data.data || []);
        setMessages(historyRes.data.data || []);
        const defaultThread = (threadsRes.data.data || [])[0];
        if (defaultThread) setActiveThreadId(defaultThread.id);
      } catch (err) {
      }
    })();

    return () => {
      try {
        socketRef.current.disconnect();
      } catch (e) {}
    };
  }, [user]);

  function sendMessage() {
    if (!input.trim() || !user) return;

    if (!activeThreadId) {
      alert("Select a conversation to send a message");
      return;
    }
    const toVendor = activeThreadId;
    const payload = { toVendor, message: input };

    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit("chat:send", payload);
    }

    setMessages((m) => [
      ...m,
      { from: user._id, to: toVendor, text: input, type: "user", createdAt: new Date() }
    ]);
    setInput("");
  }

  if (!user) {
    return (
      <div>
        <h2>{t("nav.chat")}</h2>
        <div className="p-4 bg-white rounded shadow">Please log in to use chat with vendors.</div>
      </div>
    );
  }

  const displayedMessages = activeThreadId
    ? messages.filter((m) => {
        const from = m.from?.toString?.() || m.from;
        const to = m.to?.toString?.() || m.to;
        return from === activeThreadId || to === activeThreadId;
      })
    : [];

  async function openVendorList() {
    setShowVendorList(true);
    if (vendors.length > 0) return;
    try {
      const res = await api.get("/vendor/list");
      setVendors(res.data.data || []);
    } catch (err) {
      console.error("Failed to load vendors", err);
      setVendors([]);
    }
  }

  function startChatWithVendor(vendor) {
    const vid = vendor._id || vendor.id || vendor;
    if (!threads.find((t) => t.id === vid)) {
      const newThread = { id: vid, lastMessage: null, vendor: { _id: vid, name: vendor.name, slug: vendor.slug } };
      setThreads((prev) => [newThread, ...prev]);
    }
    setActiveThreadId(vid);
    setShowVendorList(false);
  }

  return (
    <div className="flex gap-4">
      <aside className="w-64 bg-white p-2 border rounded">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">Conversations</h3>
          <button onClick={openVendorList} className="text-xs px-2 py-1 bg-green-100 rounded">New Chat</button>
        </div>
        <div className="flex flex-col gap-2">
          {threads.length === 0 && <div className="text-sm text-gray-500">No conversations yet</div>}
          {threads.map((th) => (
            <button
              key={th.id}
              onClick={() => setActiveThreadId(th.id)}
              className={`text-left p-2 rounded ${activeThreadId === th.id ? "bg-blue-100" : "hover:bg-gray-100"}`}
            >
              <div className="font-medium">{th.vendor?.name || th.id}</div>
              <div className="text-xs text-gray-500">{th.lastMessage?.text?.slice(0, 60)}</div>
            </button>
          ))}
        </div>

        {showVendorList && (
          <div className="mt-4 border-t pt-2">
            <h4 className="text-sm font-medium mb-2">Start chat with</h4>
            {vendors.length === 0 && <div className="text-sm text-gray-500">Loading vendors...</div>}
            <div className="flex flex-col gap-2 max-h-64 overflow-auto">
              {vendors.map((v) => (
                <div key={v._id} className="flex items-center justify-between p-2 rounded hover:bg-gray-50">
                  <div>
                    <div className="font-medium">{v.name}</div>
                    <div className="text-xs text-gray-500">{v.slug}</div>
                  </div>
                  <div>
                    <button onClick={() => startChatWithVendor(v)} className="px-2 py-1 bg-blue-600 text-white rounded text-xs">Chat</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2">
              <button onClick={() => setShowVendorList(false)} className="text-xs text-gray-600">Close</button>
            </div>
          </div>
        )}
      </aside>

      <section className="flex-1">
        <h2 className="mb-2">{t("nav.chat")}</h2>
        <div className="p-2 border rounded h-72 overflow-auto bg-white">
          {displayedMessages.map((m, i) => (
            <div key={i} className={m.type === "vendor" ? "text-left" : "text-right"}>
              <small className="text-gray-500">{m.type}</small>
              <div className="inline-block bg-white p-2 rounded m-1">{m.text}</div>
            </div>
          ))}
        </div>
        <div className="flex mt-2">
          <input
            className="flex-1 border rounded p-2"
            placeholder={t("chat.messagePlaceholder")}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage} className="ml-2 px-3 py-2 bg-blue-600 text-white">
            {t("chat.start")}
          </button>
        </div>
      </section>
    </div>
  );
}
