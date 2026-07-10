"use client";
import { useEffect, useState } from "react";
import { useApp } from "../providers";

export function HomeTab() {
  const { homeContent, refreshHomeContent } = useApp();
  const [draft, setDraft] = useState(homeContent);
  const [msg, setMsg] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (homeContent) setDraft(homeContent);
  }, [homeContent]);

  if (!draft) return null;

  function setD(patch) {
    setDraft((d) => ({ ...d, ...patch }));
  }

  async function onSave() {
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch("/api/home-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (!res.ok) throw new Error();
      await refreshHomeContent();
      setMsg({ ok: true, text: "Conteúdo da página inicial salvo." });
    } catch {
      setMsg({ ok: false, text: "Não foi possível salvar." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="card" style={{ maxWidth: 640 }}>
      <h3 className="card-h">Página inicial</h3>
      <p className="card-s">
        Este é o texto genérico exibido quando nenhum cliente específico está ativo (ou quando o cliente ativo é marcado como
        "opção geral"). Ao ativar um cliente real, o título e a chamada mudam automaticamente para o nome dele.
      </p>
      {msg && <p className={msg.ok ? "msg-ok" : "msg-err"}>{msg.text}</p>}

      <div className="field">
        <span className="label">Selo acima do título (eyebrow)</span>
        <input className="input" value={draft.eyebrow} onChange={(e) => setD({ eyebrow: e.target.value })} />
      </div>
      <div className="field">
        <span className="label">Título — início</span>
        <input className="input" value={draft.headingPre} onChange={(e) => setD({ headingPre: e.target.value })} />
      </div>
      <div className="field">
        <span className="label">Título — palavra em destaque</span>
        <input className="input" value={draft.headingAccent} onChange={(e) => setD({ headingAccent: e.target.value })} />
      </div>
      <div className="field">
        <span className="label">Título — final</span>
        <input className="input" value={draft.headingPost} onChange={(e) => setD({ headingPost: e.target.value })} />
      </div>
      <div className="field">
        <span className="label">Texto de apoio (lead)</span>
        <textarea className="input textarea" rows={4} value={draft.lead} onChange={(e) => setD({ lead: e.target.value })} />
      </div>
      <div className="field">
        <span className="label">Selo da seção de programas</span>
        <input className="input" value={draft.sectionEyebrow} onChange={(e) => setD({ sectionEyebrow: e.target.value })} />
      </div>
      <div className="field">
        <span className="label">Título da seção de programas</span>
        <input className="input" value={draft.sectionTitle} onChange={(e) => setD({ sectionTitle: e.target.value })} />
      </div>

      <div className="form-actions">
        <button className="btn btn-brand" style={{ flex: 1, justifyContent: "center" }} onClick={onSave} disabled={saving}>
          {saving ? "Salvando…" : "Salvar conteúdo"}
        </button>
      </div>
    </div>
  );
}
