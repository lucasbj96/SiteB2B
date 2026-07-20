"use client";
import Link from "next/link";
import { useApp } from "./providers";
import { personalize } from "../lib/personalize";

export default function HomePage() {
  const { activeClient, homeContent, products, settings, loading } = useApp();

  if (loading || !homeContent) {
    return <div className="wrap"><p className="center-loading">Carregando…</p></div>;
  }

  const personalized = !!activeClient && !activeClient.isDefault;
  const clientNameForCopy = personalized ? activeClient.name : null;
  const heroLead = personalized
    ? `Um portfólio de programas de educação corporativa — de formação de talentos a transformação de lideranças — desenhado para os desafios da ${activeClient.name}.`
    : homeContent.lead;
  const showWatermark = personalized && !!activeClient.logo;

  const waNumber = (settings.whatsappNumber || "5547999340133").replace(/\D/g, "");
  const waMsg = personalized
    ? `Olá! Sou da ${activeClient.name} e gostaria de falar com um consultor da Católica SC.`
    : "Olá! Gostaria de falar com um consultor da Católica SC.";
  const waHref = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMsg)}`;

  return (
    <div>
      <div className="wrap">
        <div className="hero">
          {showWatermark && <img className="home-watermark" src={activeClient.logo} alt="" />}
          <div className="hero-content">
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
        </div>

        <div className="reasons-sec">
          <div className="sec-head" style={{ margin: "0 0 8px" }}>
            <div>
              <div className="eyebrow">O diagnóstico</div>
              <h2 className="sec-title">{personalize(homeContent.reasonsTitle, clientNameForCopy)}</h2>
            </div>
          </div>
          <p className="reasons-sub">{personalize(homeContent.reasonsSubtitle, clientNameForCopy)}</p>
          <div className="reasons-grid">
            {(homeContent.reasons || []).map((r, i) => (
              <div className="reason-card" key={i}>
                <span className="reason-n">{"0" + (i + 1)}</span>
                <h3 className="reason-t">{personalize(r.title, clientNameForCopy)}</h3>
                <p className="reason-d">{personalize(r.text, clientNameForCopy)}</p>
              </div>
            ))}
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
              <p className="prod-pitch">{p.premium ? p.pitch : personalize(p.pitch, clientNameForCopy)}</p>
              <div className="prod-go">
                Ver programa <span className="arw">→</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="bottom-band">
          <div className="pv-cta" style={{ margin: "0 0 44px" }}>
            <div>
              <h3 className="pv-cta-h">{personalize(homeContent.consultorTitle, clientNameForCopy)}</h3>
              <p className="pv-cta-s">{personalize(homeContent.consultorSubtitle, clientNameForCopy)}</p>
            </div>
            <a className="btn btn-brand btn-lg" href={waHref} target="_blank" rel="noopener noreferrer">
              Falar com um consultor →
            </a>
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
    </div>
  );
}
