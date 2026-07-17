"use client";
import { useEffect, useState } from "react";

function linesOf(text) {
  return (text || "").split("\n").map((t) => t.trim()).filter(Boolean);
}
function cols(line, n) {
  const parts = line.split("|").map((s) => s.trim());
  while (parts.length < n) parts.push("");
  return parts;
}

function draftFromTrilha(t) {
  return {
    categoria: t.categoria || "",
    titulo: t.titulo || "",
    subtitulo: t.subtitulo || "",
    publico: t.publico || "",
    duracao: t.duracao || "",
    conteudoText: (t.conteudo || []).join("\n"),
    modulosText: (t.modulos || []).map((m) => `${m.nome} | ${m.carga} | ${m.descricao}`).join("\n"),
    entregavel: t.entregavel || "",
  };
}

function trilhaFromDraft(d) {
  return {
    categoria: d.categoria,
    titulo: d.titulo,
    subtitulo: d.subtitulo,
    publico: d.publico,
    duracao: d.duracao,
    conteudo: linesOf(d.conteudoText),
    modulos: linesOf(d.modulosText).map((line) => {
      const [nome, carga, descricao] = cols(line, 3);
      return { nome, carga, descricao };
    }),
    entregavel: d.entregavel,
  };
}

const BLANK = { categoria: "", titulo: "", subtitulo: "", publico: "", duracao: "", conteudoText: "", modulosText: "", entregavel: "" };

export function TrilhasTab() {
  const [drafts, setDrafts] = useState(null);
  const [expanded, setExpanded] = useState(() => new Set());
  const [msg, setMsg] = useState(null);
  const [saving, setSaving] = useState(false);
  const [hasOverride, setHasOverride] = useState(false);

  async function load() {
    const res = await fetch("/api/trilhas");
    const data = await res.json();
    setDrafts((data.trilhas || []).map(draftFromTrilha));
    setHasOverride(!!data.hasOverride);
  }

  useEffect(() => {
    load();
  }, []);

  if (!drafts) return <p className="center-loading">Carregando…</p>;

  function toggle(i) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }
  function setDraft(i, patch) {
    setDrafts((ds) => ds.map((d, di) => (di === i ? { ...d, ...patch } : d)));
  }
  function addTrilha() {
    setDrafts((ds) => [...ds, { ...BLANK }]);
    setExpanded((prev) => new Set(prev).add(drafts.length));
  }
  function removeTrilha(i) {
    if (!confirm("Remover esta trilha?")) return;
    setDrafts((ds) => ds.filter((_, di) => di !== i));
  }

  async function onSave() {
    setSaving(true);
    setMsg(null);
    try {
      const trilhas = drafts.map(trilhaFromDraft);
      const res = await fetch("/api/trilhas", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trilhas }),
      });
      if (!res.ok) throw new Error();
      await load();
      setMsg({ ok: true, text: "Trilhas salvas — refletem imediatamente nas páginas In-Company e UC by CatólicaSC." });
    } catch {
      setMsg({ ok: false, text: "Não foi possível salvar." });
    } finally {
      setSaving(false);
    }
  }

  async function onReset() {
    if (!confirm("Restaurar as 9 trilhas originais? Isso descarta qualquer edição.")) return;
    await fetch("/api/trilhas", { method: "DELETE" });
    await load();
    setMsg({ ok: true, text: "Trilhas originais restauradas." });
  }

  return (
    <div className="card" style={{ maxWidth: 760 }}>
      <h3 className="card-h">Trilhas</h3>
      <p className="card-s">
        Conteúdo compartilhado entre as páginas <strong>In-Company</strong> e <strong>UC by CatólicaSC</strong> — editar aqui
        atualiza as duas.
      </p>
      {msg && <p className={msg.ok ? "msg-ok" : "msg-err"}>{msg.text}</p>}

      {drafts.map((d, i) => {
        const isOpen = expanded.has(i);
        return (
          <div className="trilha-edit-card" key={i}>
            <button type="button" className="trilha-edit-head" onClick={() => toggle(i)}>
              <span>{d.titulo || `Trilha ${i + 1}`}</span>
              <span>{isOpen ? "▾" : "▸"}</span>
            </button>
            {isOpen && (
              <div className="trilha-edit-body">
                <div className="field">
                  <span className="label">Categoria</span>
                  <input className="input" value={d.categoria} onChange={(e) => setDraft(i, { categoria: e.target.value })} />
                </div>
                <div className="field">
                  <span className="label">Título</span>
                  <input className="input" value={d.titulo} onChange={(e) => setDraft(i, { titulo: e.target.value })} />
                </div>
                <div className="field">
                  <span className="label">Subtítulo</span>
                  <textarea className="input textarea" rows={2} value={d.subtitulo} onChange={(e) => setDraft(i, { subtitulo: e.target.value })} />
                </div>
                <div className="field">
                  <span className="label">Público-alvo</span>
                  <textarea className="input textarea" rows={2} value={d.publico} onChange={(e) => setDraft(i, { publico: e.target.value })} />
                </div>
                <div className="field">
                  <span className="label">Duração</span>
                  <input className="input" value={d.duracao} onChange={(e) => setDraft(i, { duracao: e.target.value })} />
                </div>
                <div className="field">
                  <span className="label">Conteúdo programático — um tópico por linha</span>
                  <textarea className="input textarea" rows={5} value={d.conteudoText} onChange={(e) => setDraft(i, { conteudoText: e.target.value })} />
                </div>
                <div className="field">
                  <span className="label">Módulos — um por linha, formato: Nome | Carga horária | Descrição</span>
                  <textarea className="input textarea" rows={4} value={d.modulosText} onChange={(e) => setDraft(i, { modulosText: e.target.value })} />
                </div>
                <div className="field">
                  <span className="label">Entregável</span>
                  <textarea className="input textarea" rows={2} value={d.entregavel} onChange={(e) => setDraft(i, { entregavel: e.target.value })} />
                </div>
                <button type="button" className="mini-x" onClick={() => removeTrilha(i)}>
                  Excluir esta trilha
                </button>
              </div>
            )}
          </div>
        );
      })}

      <button type="button" className="btn btn-ghost" style={{ marginTop: 8 }} onClick={addTrilha}>
        + Nova trilha
      </button>

      <div className="form-actions" style={{ marginTop: 20 }}>
        <button className="btn btn-brand" style={{ flex: 1, justifyContent: "center" }} onClick={onSave} disabled={saving}>
          {saving ? "Salvando…" : "Salvar trilhas"}
        </button>
      </div>
      {hasOverride && (
        <button className="logout-link" style={{ marginTop: 16 }} onClick={onReset}>
          ↻ Restaurar as 9 trilhas originais
        </button>
      )}
    </div>
  );
}
