"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useApp } from "../../providers";
import { DIAG } from "../../../lib/products";

function emptyDiag() {
  return { i: 0, scores: {}, multi: [], done: false, lead: { name: "", email: "", area: "" }, leadError: false };
}

function recProducts(products, scores) {
  const ranked = products
    .filter((p) => !p.isDiag)
    .map((p) => ({ p, score: scores[p.id] || 0 }))
    .sort((a, b) => b.score - a.score);
  let top = ranked.filter((r) => r.score > 0);
  if (top.length < 2) {
    const extra = ranked.filter((r) => r.score === 0);
    top = top.concat(extra);
  }
  return { primary: top[0].p, secondary: (top[1] || top[0]).p };
}

function Block({ blk }) {
  if (blk.isList) {
    return (
      <div className="extra-block">
        <h4 className="extra-h">{blk.heading}</h4>
        <ul className="extra-list">
          {blk.items.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ul>
      </div>
    );
  }
  if (blk.isSteps) {
    return (
      <div className="extra-block">
        <h4 className="extra-h">{blk.heading}</h4>
        <div className="steps">
          {blk.items.map((stp, i) => (
            <div className="step" key={i}>
              <span className="step-n">{stp.n}</span>
              <div>
                <p className="step-t">{stp.t}</p>
                <p className="step-d">{stp.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (blk.isTable) {
    return (
      <div className="extra-block">
        <h4 className="extra-h">{blk.heading}</h4>
        <div className="cmp-table">
          {blk.rows.map((r, i) => (
            <div className="cmp-row" key={i}>
              <div className="cmp-a">{r.a}</div>
              <div className="cmp-b">{r.b}</div>
              <div className="cmp-c">{r.c}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (blk.isTrilhas) {
    return (
      <div className="extra-block">
        <h4 className="extra-h">{blk.heading}</h4>
        <div className="trilhas-grid">
          {blk.items.map((tr, i) => (
            <div className="trilha-card" key={i}>
              <div className="trilha-top">
                <span className="trilha-num">{tr.num}</span>
                <span className="trilha-name">{tr.name}</span>
              </div>
              <p className="trilha-tag">"{tr.tag}"</p>
              <div className="trilha-meta">
                <span>{tr.audience}</span>
                <span>{tr.duration}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (blk.isChapters) {
    return (
      <div className="extra-block">
        <h4 className="extra-h">{blk.heading}</h4>
        <div className="chapters-grid">
          {blk.items.map((ch, i) => (
            <div className="chapter-card" key={i}>
              <div className="chapter-top">
                <span className="chapter-num">{ch.num}</span>
                <span className="chapter-title">{ch.title}</span>
              </div>
              <p className="chapter-quote">"{ch.quote}"</p>
              {ch.partner && <p className="chapter-partner">{ch.partner}</p>}
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (blk.isNote) {
    return (
      <div className="note-block">
        <p className="note-h">{blk.heading}</p>
        <p className="note-text">{blk.text}</p>
      </div>
    );
  }
  return null;
}

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { products, activeClient, settings, loading } = useApp();
  const [diag, setDiag] = useState(emptyDiag());

  const product = useMemo(() => products.find((p) => p.id === id), [products, id]);

  if (loading) return <div className="wrap"><p className="center-loading">Carregando…</p></div>;
  if (!product) return <div className="wrap"><p className="center-loading">Programa não encontrado.</p></div>;

  const pvClass = product.premium ? "pv premium" : "pv";

  const waNumber = (settings.whatsappNumber || "5547999340133").replace(/\D/g, "");
  const waMsg =
    activeClient && !activeClient.isDefault
      ? `Olá! Sou da ${activeClient.name} e gostaria de saber mais sobre o ${product.name}.`
      : `Olá! Gostaria de saber mais sobre o ${product.name}.`;
  const waHref = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMsg)}`;

  const otherProducts = products.filter((p) => p.id !== product.id);

  function answerDiag(w) {
    setDiag((st) => {
      const scores = { ...st.scores };
      Object.keys(w).forEach((k) => (scores[k] = (scores[k] || 0) + w[k]));
      return { ...st, i: st.i + 1, scores };
    });
  }
  function toggleMulti(idx) {
    setDiag((st) => {
      const has = st.multi.includes(idx);
      const multi = has ? st.multi.filter((x) => x !== idx) : [...st.multi, idx];
      return { ...st, multi };
    });
  }
  function confirmMulti(opts) {
    setDiag((st) => {
      const scores = { ...st.scores };
      st.multi.forEach((idx) => {
        const w = opts[idx].w;
        Object.keys(w).forEach((k) => (scores[k] = (scores[k] || 0) + w[k]));
      });
      return { ...st, i: st.i + 1, scores, multi: [] };
    });
  }
  function submitLead(e) {
    e.preventDefault();
    const email = (diag.lead.email || "").trim();
    if (!email || !email.includes("@")) {
      setDiag((st) => ({ ...st, leadError: true }));
      return;
    }
    setDiag((st) => ({ ...st, done: true }));
  }

  const di = diag.i;
  const totalSteps = DIAG.length + 1;
  const isQuestionStep = di < DIAG.length;
  const dq = isQuestionStep ? DIAG[di] : null;
  const diagIsSingle = isQuestionStep && dq.type === "single";
  const diagIsMulti = isQuestionStep && dq.type === "multi";
  const diagIsLead = !isQuestionStep && !diag.done;
  const diagStepLabel = `${Math.min(di + 1, totalSteps)} de ${totalSteps}`;
  const diagFillStyle = { width: `${Math.round((di / totalSteps) * 100)}%` };
  const rec = diag.done ? recProducts(products, diag.scores) : null;

  return (
    <div className="wrap">
      <div className={pvClass}>
        <button className="back" onClick={() => router.push("/#programas")}>
          ← Todos os programas
        </button>

        <div className="pv-hero">
          <div className="pv-tag">{product.tag}</div>
          <h1 className="pv-title">{product.name}</h1>
          <p className="pv-manifesto">{product.manifesto}</p>
        </div>

        {product.isDiag ? (
          <div className="diag">
            {isQuestionStep && (
              <>
                <div className="diag-bar">
                  <div className="diag-fill" style={diagFillStyle}></div>
                </div>
                <div className="diag-step">Etapa {diagStepLabel}</div>
                <h3 className="diag-q">{dq.q}</h3>
                {dq.sub && <p className="diag-sub">{dq.sub}</p>}
                {diagIsSingle && (
                  <div className="diag-opts">
                    {dq.opts.map((o, i) => (
                      <button key={i} className="diag-opt" onClick={() => answerDiag(o.w)}>
                        {o.label}
                        <span className="oarw">→</span>
                      </button>
                    ))}
                  </div>
                )}
                {diagIsMulti && (
                  <>
                    <div className="diag-opts">
                      {dq.opts.map((o, i) => {
                        const sel = diag.multi.includes(i);
                        return (
                          <button
                            key={i}
                            className={sel ? "diag-opt diag-multi sel" : "diag-opt diag-multi"}
                            onClick={() => toggleMulti(i)}
                          >
                            <span className="diag-check">✓</span>
                            {o.label}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      className="btn btn-brand"
                      style={{ marginTop: 18 }}
                      disabled={diag.multi.length === 0}
                      onClick={() => confirmMulti(dq.opts)}
                    >
                      Continuar →
                    </button>
                  </>
                )}
              </>
            )}

            {diagIsLead && (
              <>
                <div className="diag-bar">
                  <div className="diag-fill" style={diagFillStyle}></div>
                </div>
                <div className="diag-step">Etapa {diagStepLabel}</div>
                <h3 className="diag-q">Quase lá — para onde enviamos o diagnóstico?</h3>
                <form onSubmit={submitLead}>
                  <div className="field">
                    <span className="label">Nome (opcional)</span>
                    <input
                      className="input"
                      value={diag.lead.name}
                      onChange={(e) => setDiag((st) => ({ ...st, lead: { ...st.lead, name: e.target.value }, leadError: false }))}
                    />
                  </div>
                  <div className="field">
                    <span className="label">E-mail corporativo</span>
                    <input
                      className="input"
                      type="email"
                      placeholder="voce@empresa.com"
                      value={diag.lead.email}
                      onChange={(e) => setDiag((st) => ({ ...st, lead: { ...st.lead, email: e.target.value }, leadError: false }))}
                    />
                  </div>
                  {diag.leadError && <p className="login-err">Informe um e-mail válido.</p>}
                  <div className="field">
                    <span className="label">Área / departamento (opcional)</span>
                    <input
                      className="input"
                      value={diag.lead.area}
                      onChange={(e) => setDiag((st) => ({ ...st, lead: { ...st.lead, area: e.target.value }, leadError: false }))}
                    />
                  </div>
                  <button type="submit" className="btn btn-brand btn-lg" style={{ width: "100%", justifyContent: "center" }}>
                    Ver diagnóstico →
                  </button>
                </form>
              </>
            )}

            {diag.done && rec && (
              <>
                <div className="diag-res-lbl">◆ Diagnóstico concluído</div>
                <h3 className="diag-res-h">Com base nas suas respostas, recomendamos:</h3>
                <button className="diag-rec" onClick={() => router.push(`/produtos/${rec.primary.id}`)}>
                  <p className="rn">{rec.primary.name} →</p>
                  <p className="rp">{rec.primary.pitch}</p>
                </button>
                <div className="diag-sec">
                  Também vale conhecer:{" "}
                  <a
                    onClick={() => router.push(`/produtos/${rec.secondary.id}`)}
                    style={{ color: "var(--brand)", fontWeight: 600, cursor: "pointer" }}
                  >
                    {rec.secondary.name}
                  </a>
                </div>
                <p className="diag-insight">
                  "Treinamento sem entregável é entretenimento." Empresas que investem em formação de lideranças têm 20% menos
                  rotatividade (Deloitte, 2024).
                </p>
                <button className="diag-restart" onClick={() => setDiag(emptyDiag())}>
                  ↻ Refazer diagnóstico
                </button>
              </>
            )}
          </div>
        ) : (
          <>
            {product.stats && product.stats.length > 0 && (
              <div className="stat-row">
                {product.stats.map((s, i) => (
                  <div className="stat" key={i}>
                    <div className="stat-v">{s.v}</div>
                    <div className="stat-l">{s.l}</div>
                  </div>
                ))}
              </div>
            )}
            <div className="pv-grid">
              <div className="pv-body">
                {(product.body || []).map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              <div className="pv-points">
                <p className="pv-points-h">Em resumo</p>
                {(product.points || []).map((t, i) => (
                  <div className="point" key={i}>
                    <span className="pn">{"0" + (i + 1)}</span>
                    <span>{t}</span>
                  </div>
                ))}
              </div>
            </div>
            {(product.blocks || []).map((blk, i) => (
              <Block blk={blk} key={i} />
            ))}
          </>
        )}

        <div className="pv-cta">
          <div>
            <h3 className="pv-cta-h">{product.cta ? product.cta[0] : ""}</h3>
            <p className="pv-cta-s">{product.cta ? product.cta[1] : ""}</p>
          </div>
          <a className="btn btn-brand btn-lg" href={waHref} target="_blank" rel="noopener noreferrer">
            {product.ctaButtonLabel || "Falar com o time comercial →"}
          </a>
        </div>

        <div className="other-progs">
          <p className="other-progs-h">Outros programas</p>
          <div className="other-progs-row">
            {otherProducts.map((op) => (
              <Link className="other-prog-item" href={`/produtos/${op.id}`} key={op.id}>
                <span className="op-tag">{op.tag}</span>
                <span className="op-name">{op.name}</span>
                <span className="op-arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
