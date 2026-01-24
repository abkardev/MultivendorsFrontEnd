import React, { useState } from "react";
import api from "../api";
import { useTranslation } from "react-i18next";

export default function AIHelper() {
  const { t } = useTranslation();
  const [prompt, setPrompt] = useState("");
  const [reply, setReply] = useState("");

  async function askAI() {
    try {
      const res = await api.post("/ai", { prompt });
      setReply(res.data.data || JSON.stringify(res.data));
    } catch (err) {
      setReply("Error calling AI: " + (err.response?.data?.error || err.message));
    }
  }

  return (
    <div>
      <h2>{t("nav.ai")}</h2>
      <textarea className="w-full p-2" value={prompt} onChange={(e)=>setPrompt(e.target.value)} rows={6} />
      <div className="mt-2">
        <button onClick={askAI} className="px-3 py-2 bg-green-600 text-white">Ask</button>
      </div>
      <pre className="mt-4 bg-white p-3 rounded">{reply}</pre>
    </div>
  );
}
