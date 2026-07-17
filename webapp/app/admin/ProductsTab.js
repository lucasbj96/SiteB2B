"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "../providers";
import { PRODUCTS } from "../../lib/products";

function linesOf(text) {
  return (text || "").split("\n").map((t) => t.trim()).filter(Boolean);
}
function cols(line, n) {
  const parts = line.split("|").map((s) => s.trim());
  while (parts.length < n) parts.push("");
  return parts;
}

function blockToText(b) {
  if (b.isList) return (b.items || []).join("\n");
  if (b.isSteps) return (b.items || []).map((s) => `${s.t} | ${s.d}`).join("\n");
  if (b.isTable) return (b.rows || []).map((r) => `${r.a} | ${r.b} | ${r.c}`).join("\n");
  if (b.isChapters) return (b.items || []).map((c) => `${c.num} | ${c.title} | ${c.quote} | ${c.partner || ""}`).join("\n");
  return "";
}

function draftBlockFrom(b) {
  return {
    isList: !!b.isList, isSteps: !!b.isSteps, isTable: !!b.isTable,
    isChapters: !!b.isChapters, isNote: !!b.isNote, isTrilhas: !!b.isTrilhas,
    heading: b.heading || "",
    bodyText: blockToText(b),
    text: b.isNote ? b.text || "" : undefined,
  };
}

function blockFromDraft(d) {
  if (d.isTrilhas) return { isTrilhas: true, heading: d.heading };
  if (d.isList) return { isList: true, heading: d.heading, items: linesOf(d.bodyText) };
  if (d.isSteps)
    return {
      isSteps: true, heading: d.heading,
      items: linesOf(d.bodyText).map((line, i) => {
        const [t, dsc] = cols(line, 2);
        return { n: String(i + 1).padStart(2, "0"), t, d: dsc };
      }),
    };
  if (d.isTable)
    return {
      isTable: true, heading: d.heading,
      rows: linesOf(d.bodyText).map((line) => {
        const [a, b, c] = cols(line, 3);
        return { a, b, c };
      }),
    };
  if (d.isChapters)
    return {
      isChapters: true, heading: d.heading,
      items: linesOf(d.bodyText).map((line) => {
        const [num, title, quote, partner] = cols(line, 4);
        return { num, title, quote, partner };
      }),
    };
  if (d.isNote) return { isNote: true, heading: d.heading, text: d.text || "" };
  return d;
}

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
    statsText: (p.stats || []).map((s) => `${s.v} | ${s.l}`).join("\n"),
    blocks: (p.blocks || []).map(draftBlockFrom),
  };
}

const BLOCK_LABELS = {
  isList: "Itens da lista — um por linha",
  isSteps: "Passos — um por linha, formato: Título | Descrição",
  isTable: "Linhas da tabela — uma por linha, formato: Coluna 1 | Coluna 2 | Coluna 3",
  isChapters: "Capítulos — um por linha, formato: Número | Título | Citação | Parceiro (opcional)",
};

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
  const base = PRODUCTS.find((p) => p.id === selectedId);
  const isStd = current && !current.isDiag;
  const hasStats = base && Array.isArray(base.stats);

  function setD(patch) {
    setDraft((d) => ({ ...d, ...patch }));
  }
  function setBlock(i, patch) {
    setDraft((d) => ({ ...d, blocks: d.blocks.map((b, bi) => (bi === i ? { ...b, ...patch } : b)) }));
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
        stats: linesOf(draft.statsText).map((line) => {
          const [v, l] = cols(line, 2);
          return { v, l };
        }),
        blocks: draft.blocks.map(blockFromDraft),
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
        {!current?.premium && (
          <p className="card-s">
            Dica: digite <strong>{"{{empresa}}"}</strong> em qualquer campo de texto abaixo (título, frase de destaque, textos,
            listas, chamada final…) para inserir automaticamente o nome do cliente ativo — ou "sua empresa" quando nenhum
            cliente estiver ativo.
          </p>
        )}
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
        {hasStats && (
          <div className="field">
            <span className="label">Estatísticas — uma por linha, formato: Valor | Rótulo</span>
            <textarea className="input textarea" rows={4} value={draft.statsText} onChange={(e) => setD({ statsText: e.target.value })} />
          </div>
        )}

        {draft.blocks.map((b, i) => (
          <div className="field block-editor" key={i}>
            {b.isTrilhas ? (
              <>
                <span className="label">Bloco de trilhas</span>
                <p className="card-s" style={{ margin: 0 }}>
                  As 9 trilhas são editadas na aba <strong>Trilhas</strong> (o conteúdo é compartilhado entre In-Company e UC by CatólicaSC).
                </p>
              </>
            ) : b.isNote ? (
              <>
                <span className="label">Título da nota</span>
                <input className="input" style={{ marginBottom: 10 }} value={b.heading} onChange={(e) => setBlock(i, { heading: e.target.value })} />
                <span className="label">Texto da nota</span>
                <textarea className="input textarea" rows={4} value={b.text} onChange={(e) => setBlock(i, { text: e.target.value })} />
              </>
            ) : (
              <>
                <span className="label">Título do bloco</span>
                <input className="input" style={{ marginBottom: 10 }} value={b.heading} onChange={(e) => setBlock(i, { heading: e.target.value })} />
                <span className="label">{BLOCK_LABELS[Object.keys(BLOCK_LABELS).find((k) => b[k])]}</span>
                <textarea className="input textarea" rows={5} value={b.bodyText} onChange={(e) => setBlock(i, { bodyText: e.target.value })} />
              </>
            )}
          </div>
        ))}

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
