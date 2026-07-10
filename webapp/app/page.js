"use client";
import Link from "next/link";
import { useApp } from "./providers";

export default function HomePage() {
  const { activeClient, homeContent, products, loading } = useApp();

  if (loading || !homeContent) {
    return <div className="wrap"><p className="center-loading">Carregando…</p></div>;
  }

  const personalized = !!activeClient && !activeClient.isDefault;
  const heroLead = personalized
    ? `Um portfólio de programas de educação corporativa — de formação de talentos a transformação de lideranças — desenhado para os desafios da ${activeClient.name}.`
    : homeContent.lead;

  return (
    <div>
      <div className="wrap">
        <div className="hero">
          {personalized ? (
            <>
              <div className="forco">Proposta preparada para {activeClient.name}</div>
              <h1 className="h1">
                Desenvolvimento de pessoas, desenhado para a <span className="accent">{activeClient.name}</span>.
              </h1>
            </>
          ) : (
            <>
              <div className="forco">{homeContent.eyebrow}</div>
              <h1 className="h1">
                {homeContent.headingPre}
                <span className="accent">{homeContent.headingAccent}</span>
                {homeContent.headingPost}
              </h1>
            </>
          )}
          <p className="lead">{heroLead}</p>
          <div className="hero-actions">
            <a className="btn btn-brand btn-lg" href="#programas">
              Ver os programas →
            </a>
            <Link className="btn btn-ghost btn-lg" href="/produtos/diagnostico">
              Fazer o diagnóstico
            </Link>
          </div>
        </div>

        <div className="sec-head" id="programas">
          <div>
            <div className="eyebrow">{homeContent.sectionEyebrow}</div>
            <h2 className="sec-title">{homeContent.sectionTitle}</h2>
          </div>
        </div>

        <div className="prod-grid">
          {products.map((p, i) => (
            <Link
              key={p.id}
              href={`/produtos/${p.id}`}
              className={p.premium ? "prod-card premium" : "prod-card"}
            >
              <div className="prod-top">
                <span className="prod-num">{"0" + (i + 1)}</span>
                <span className="prod-tag">{p.tag}</span>
              </div>
              <div className="prod-name">{p.name}</div>
              <p className="prod-pitch">{p.pitch}</p>
              <div className="prod-go">
                Ver programa <span className="arw">→</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="foot">
          <div className="foot-l">
            <img className="blk" style={{ width: 26, height: 26, borderRadius: 6 }} src="/assets/catolica-logo.png" alt="Católica SC" />
            Católica SC · Educação Corporativa
          </div>
          <div className="foot-links">
            <span>Jaraguá do Sul</span>
            <span>Joinville</span>
            <span>0800 600 0005</span>
          </div>
        </div>
      </div>
    </div>
  );
}
