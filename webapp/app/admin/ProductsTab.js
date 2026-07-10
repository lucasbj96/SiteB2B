"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "../providers";

function draftFromProduct(p) {
  return {
    name: p.name,
    tag: p.tag,
    pitch: p.pitch,
    manifesto: p.manifesto,
    bodyText: (p.body || []).join("\n\n"),
    pointsText: (p.points || []).join("\n"),
    ctaTitle: p.cta ? p.cta[0] : "",
    ctaSub: p.cta ? p.cta[1] : "",
  };
}

export function ProductsTab() {
  const { products, refreshProducts } = useApp();
  const router = useRouter();
  const [selectedId, setSelectedId] = useState(null);
  const [draft, setDraft] = useState(null);
  const [msg, setMsg] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!selectedId && products.length > 0) {
      setSelectedId(products[0].id);
      setDraft(draftFromProduct(products[0]));
    }
  }, [products, selectedId]);

  function selectProduct(id) {
    const p = products.find((x) => x.id === id);
    setSelectedId(id);
    setDraft(draftFromProduct(p));
    setMsg(null);
  }

  if (!draft || !selectedId) return null;
  const current = products.find((p) => p.id === selectedId);
  const isStd = current && !current.isDiag;

  function setD(patch) {
    setDraft((d) => ({ ...d, ...patch }));
  }

  async function onSave() {
    setSaving(true);
    setMsg(null);
    try {
      const payload = {
        name: draft.name,
        tag: draft.tag,
        pitch: draft.pitch,
        manifesto: draft.manifesto,
        body: draft.bodyText.split(/\n\s*\n/).map((t) => t.trim()).filter(Boolean),
        points: draft.pointsText.split("\n").map((t) => t.trim()).filter(Boolean),
        ctaTitle: draft.ctaTitle,
        ctaSub: draft.ctaSub,
      };
      const res = await fetch(`/api/products/${selectedId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      await refreshProducts();
      setMsg({ ok: true, text: "Conteúdo salvo." });
    } catch {
      setMsg({ ok: false, text: "Não foi possível salvar." });
    } finally {
      setSaving(false);
    }
  }

  async function onReset() {
    if (!confirm("Restaurar o texto original deste programa?")) return;
    await fetch(`/api/products/${selectedId}`, { method: "DELETE" });
    const updated = await refreshProducts();
    const p = updated.find((x) => x.id === selectedId);
    setDraft(draftFromProduct(p));
    setMsg({ ok: true, text: "Texto original restaurado." });
  }

  return (
    <div className="pc-wrap">
      <div className="pc-list">
        {products.map((p) => (
          <button
            key={p.id}
            className={p.id === selectedId ? "pc-item on" : "pc-item"}
            onClick={() => selectProduct(p.id)}
          >
            <span>{p.name}</span>
            {p.hasOverride && <span className="pc-dot" title="Conteúdo personalizado"></span>}
          </button>
        ))}
      </div>
      <div className="card">
        <h3 className="card-h">Editar conteúdo público</h3>
        <p className="card-s">Alterações aqui refletem imediatamente na página pública do programa.</p>
        {msg && <p className={msg.ok ? "msg-ok" : "msg-err"}>{msg.text}</p>}

        <div className="field">
          <span className="label">Nome do programa</span>
          <input className="input" value={draft.name} onChange={(e) => setD({ name: e.target.value })} />
        </div>
        <div className="field">
          <span className="label">Selo / categoria</span>
          <input className="input" value={draft.tag} onChange={(e) => setD({ tag: e.target.value })} />
        </div>
        <div className="field">
          <span className="label">Frase de destaque (cards e topo da página)</span>
          <textarea className="input textarea" rows={2} value={draft.pitch} onChange={(e) => setD({ pitch: e.target.value })} />
        </div>
        <div className="field">
          <span className="label">Manifesto (frase grande na página do programa)</span>
          <textarea className="input textarea" rows={2} value={draft.manifesto} onChange={(e) => setD({ manifesto: e.target.value })} />
        </div>
        {isStd && (
          <>
            <div className="field">
              <span className="label">Texto do programa (um parágrafo por linha em branco)</span>
              <textarea className="input textarea" rows={7} value={draft.bodyText} onChange={(e) => setD({ bodyText: e.target.value })} />
            </div>
            <div className="field">
              <span className="label">Pontos-chave (um por linha)</span>
              <textarea className="input textarea" rows={4} value={draft.pointsText} onChange={(e) => setD({ pointsText: e.target.value })} />
            </div>
          </>
        )}
        <div className="field">
          <span className="label">Chamada final — título</span>
          <input className="input" value={draft.ctaTitle} onChange={(e) => setD({ ctaTitle: e.target.value })} />
        </div>
        <div className="field">
          <span className="label">Chamada final — subtítulo</span>
          <input className="input" value={draft.ctaSub} onChange={(e) => setD({ ctaSub: e.target.value })} />
        </div>

        <div className="form-actions">
          <button className="btn btn-brand" style={{ flex: 1, justifyContent: "center" }} onClick={onSave} disabled={saving}>
            {saving ? "Salvando…" : "Salvar conteúdo"}
          </button>
          <button className="btn btn-ghost" onClick={() => router.push(`/produtos/${selectedId}`)}>
            Ver página →
          </button>
        </div>
        {current && current.hasOverride && (
          <button className="logout-link" style={{ marginTop: 16 }} onClick={onReset}>
            ↻ Restaurar texto original deste programa
          </button>
        )}
      </div>
    </div>
  );
}
