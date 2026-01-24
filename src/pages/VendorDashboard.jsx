import React, { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../AuthProvider";
import { useTranslation } from "react-i18next";

export default function VendorDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [vendor, setVendor] = useState({ autoResponse: "", autoResponseEnabled: false });

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/vendor/me");
        setVendor(res.data.data || {});
      } catch (err) {
      }
    }
    load();
  }, []);

  async function save() {
    try {
      await api.put(`/vendor/${vendor._id}`, { autoResponse: vendor.autoResponse, autoResponseEnabled: vendor.autoResponseEnabled });
      alert("Saved");
    } catch (err) {
      alert("Error saving");
    }
  }

  return (
    <div>
      <h2>{t("nav.profile")}</h2>
      <label>{t("vendor.autoResponse")}</label>
      <textarea value={vendor.autoResponse || ""} onChange={(e)=>setVendor({...vendor, autoResponse: e.target.value})} rows={4} className="block w-full" />
      <div>
        <label><input type="checkbox" checked={vendor.autoResponseEnabled} onChange={(e)=>setVendor({...vendor, autoResponseEnabled: e.target.checked})} /> Enabled</label>
      </div>
      <button onClick={save} className="mt-2 px-3 py-1 bg-blue-500 text-white">{t("vendor.save")}</button>
    </div>
  );
}
