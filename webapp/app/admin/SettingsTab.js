"use client";
import { useEffect, useState } from "react";
import { useApp } from "../providers";

export function SettingsTab() {
  const { settings, refreshSettings } = useApp();
  const [whatsapp, setWhatsapp] = useState(settings.whatsappNumber || "");
  const [msg, setMsg] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setWhatsapp(settings.whatsappNumber || "");
  }, [settings.whatsappNumber]);

  async function onSave() {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ whatsappNumber: whatsapp.replace(/\D/g, "") }),
      });
      if (!res.ok) throw new Error();
      await refreshSettings();
      setMsg({ ok: true, text: "Configurações salvas." });
    } catch {
      setMsg({ ok: false, text: "Não foi possível salvar." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card" style={{ maxWidth: 480 }}>
      <h3 className="card-h">Configurações</h3>
      <p className="card-s">Número de WhatsApp usado nos botões de contato de todas as páginas de programa.</p>
      {msg && <p className={msg.ok ? "msg-ok" : "msg-err"}>{msg.text}</p>}
      <div className="field">
        <span className="label">Número do WhatsApp (com DDI e DDD)</span>
        <input className="input" placeholder="5547999999999" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
      </div>
      <div className="form-actions">
        <button className="btn btn-brand" style={{ flex: 1, justifyContent: "center" }} onClick={onSave} disabled={saving}>
          {saving ? "Salvando…" : "Salvar configurações"}
        </button>
      </div>
    </div>
  );
}
