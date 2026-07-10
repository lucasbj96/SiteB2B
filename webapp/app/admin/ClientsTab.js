"use client";
import { useState } from "react";
import { useApp, initial } from "../providers";
import { extractColors } from "../../lib/colors";

const EMPTY_DRAFT = { name: "", logo: null, primary: "#3B6EF6", secondary: "#10245E", sector: "", palette: [], isDefault: false };

export function ClientsTab() {
  const { clients, refreshClients, activeId, activate } = useApp();
  const [draft, setDraft] = useState(EMPTY_DRAFT);
  const [editingId, setEditingId] = useState(null);
  const [msg, setMsg] = useState(null);
  const [saving, setSaving] = useState(false);

  function setD(patch) {
    setDraft((d) => ({ ...d, ...patch }));
  }

  async function onLogo(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const url = ev.target.result;
      setD({ logo: url });
      const pal = await extractColors(url);
      if (pal) setD({ primary: pal.primary, secondary: pal.secondary, palette: pal.palette });
    };
    reader.readAsDataURL(f);
  }

  async function onSave() {
    const name = (draft.name || "").trim();
    if (!name) return;
    setSaving(true);
    setMsg(null);
    try {
      const payload = {
        name,
        sector: draft.sector,
        logo: draft.logo,
        primary: draft.primary,
        secondary: draft.secondary,
        isDefault: draft.isDefault,
      };
      const res = editingId
        ? await fetch(`/api/clients/${editingId}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
        : await fetch("/api/clients", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error("Falha ao salvar.");
      const data = await res.json();
      await refreshClients();
      if (!editingId) activate(data.client.id);
      setDraft(EMPTY_DRAFT);
      setEditingId(null);
      setMsg({ ok: true, text: "Cliente salvo." });
    } catch (e) {
      setMsg({ ok: false, text: "Não foi possível salvar o cliente." });
    } finally {
      setSaving(false);
    }
  }

  function onEdit(c) {
    setEditingId(c.id);
    setDraft({ name: c.name, logo: c.logo, primary: c.primary, secondary: c.secondary, sector: c.sector || "", isDefault: !!c.isDefault, palette: [] });
    setMsg(null);
    window.scrollTo(0, 0);
  }

  function onCancel() {
    setEditingId(null);
    setDraft(EMPTY_DRAFT);
  }

  async function onDelete(id) {
    if (!confirm("Excluir este cliente?")) return;
    await fetch(`/api/clients/${id}`, { method: "DELETE" });
    if (activeId === id) activate(id);
    await refreshClients();
    if (editingId === id) onCancel();
  }

  return (
    <div className="cl-wrap">
      <div className="card">
        <h3 className="card-h">{editingId ? "Editar cliente" : "Novo cliente"}</h3>
        <p className="card-s">Suba o logo para detectar as cores automaticamente, ou ajuste manualmente.</p>
        {msg && <p className={msg.ok ? "msg-ok" : "msg-err"}>{msg.text}</p>}

        <div className="field">
          <span className="label">Nome da empresa</span>
          <input className="input" placeholder="Ex.: Malwee, WEG, Marisol…" value={draft.name} onChange={(e) => setD({ name: e.target.value })} />
        </div>
        <div className="field">
          <span className="label">Setor (opcional)</span>
          <input className="input" placeholder="Ex.: Indústria têxtil" value={draft.sector} onChange={(e) => setD({ sector: e.target.value })} />
        </div>
        <label className="chk-row">
          <input type="checkbox" checked={draft.isDefault} onChange={(e) => setD({ isDefault: e.target.checked })} />
          <span>Usar como opção geral — aplica cores/logo sem personalizar textos com o nome</span>
        </label>

        <div className="field">
          <span className="label">Logo da empresa</span>
          {draft.logo ? (
            <div className="logo-prev">
              <img src={draft.logo} alt="" />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Logo carregado</div>
                <label className="lp-swap">
                  Trocar imagem
                  <input type="file" accept="image/*" style={{ display: "none" }} onChange={onLogo} />
                </label>
              </div>
            </div>
          ) : (
            <label className="drop">
              <input type="file" accept="image/*" onChange={onLogo} />
              <div className="drop-ico">↑</div>
              <div className="drop-t">Clique para enviar o logo</div>
              <div className="drop-s">PNG, JPG ou SVG · as cores são extraídas automaticamente</div>
            </label>
          )}
        </div>

        {draft.palette && draft.palette.length > 0 && (
          <div className="field">
            <p className="detected">Cores detectadas no logo — clique para usar como primária:</p>
            <div className="sw-row">
              {draft.palette.map((hex, i) => (
                <div key={i} className="sw" style={{ background: hex }} onClick={() => setD({ primary: hex })} title={hex}></div>
              ))}
            </div>
          </div>
        )}

        <div className="field">
          <span className="label">Cores da marca</span>
          <div className="colors">
            <label className="cc">
              <input type="color" value={draft.primary} onChange={(e) => setD({ primary: e.target.value })} />
              <div className="cc-meta">
                <div className="cc-l">Primária</div>
                <div className="cc-v">{draft.primary}</div>
              </div>
            </label>
            <label className="cc">
              <input type="color" value={draft.secondary} onChange={(e) => setD({ secondary: e.target.value })} />
              <div className="cc-meta">
                <div className="cc-l">Secundária</div>
                <div className="cc-v">{draft.secondary}</div>
              </div>
            </label>
          </div>
        </div>

        <div className="field">
          <span className="label">Prévia do tema</span>
          <div className="prev-box">
            <div className="prev-bar" style={{ background: draft.primary }}>
              <span style={{ fontFamily: "'Space Grotesk'", fontWeight: 600, fontSize: 13 }}>{draft.name || "Nome da empresa"}</span>
              <span style={{ fontSize: 11, opacity: 0.8 }}>Educação Corporativa</span>
            </div>
            <div className="prev-body">
              <span className="prev-btn" style={{ background: draft.primary }}>Ver programas</span>
              <span className="prev-pill" style={{ background: draft.secondary + "22", color: draft.secondary }}>Diagnóstico</span>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button className="btn btn-brand" style={{ flex: 1, justifyContent: "center" }} onClick={onSave} disabled={saving}>
            {saving ? "Salvando…" : editingId ? "Salvar alterações" : "Salvar e ativar"}
          </button>
          {editingId && (
            <button className="btn btn-ghost" onClick={onCancel}>
              Cancelar
            </button>
          )}
        </div>
      </div>

      <div>
        <div className="cl-list-h">
          <h3 className="cl-list-t">Clientes cadastrados</h3>
          <span className="cl-count">{clients.length === 1 ? "1 cliente" : `${clients.length} clientes`}</span>
        </div>
        {clients.length > 0 ? (
          <div className="cl-grid">
            {clients.map((c) => {
              const active = c.id === activeId;
              return (
                <div key={c.id} className={active ? "cl-item active" : "cl-item"} style={active ? { "--ci": c.primary } : undefined}>
                  <div className="cl-item-top">
                    {c.logo ? (
                      <img className="cl-item-logo" src={c.logo} alt="" />
                    ) : (
                      <div className="cl-item-dot" style={{ background: c.primary }}>{initial(c.name)}</div>
                    )}
                    <div>
                      <p className="cl-item-name">
                        {c.name}
                        {c.isDefault && <span className="cl-badge">Padrão</span>}
                      </p>
                      <p className="cl-item-sector">{c.sector || "—"}</p>
                    </div>
                  </div>
                  <div className="cl-swatch">
                    <span style={{ background: c.primary }}></span>
                    <span style={{ background: c.secondary }}></span>
                  </div>
                  <div className="cl-item-acts">
                    <button className={active ? "mini solid is" : "mini solid"} onClick={() => activate(c.id)}>
                      {active ? "✓ Ativo" : "Ativar"}
                    </button>
                    <button className="mini" onClick={() => onEdit(c)}>Editar</button>
                    <button className="mini-x" onClick={() => onDelete(c.id)}>Excluir</button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty">
            <div style={{ fontSize: 34, opacity: 0.3 }}>◷</div>
            <p className="empty-h">Nenhum cliente ainda</p>
            <p style={{ fontSize: 14, margin: 0 }}>Cadastre a primeira empresa ao lado para começar.</p>
          </div>
        )}
      </div>
    </div>
  );
}
