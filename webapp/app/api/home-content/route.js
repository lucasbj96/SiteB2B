import { NextResponse } from "next/server";
import { db } from "../../../lib/db";

const DEFAULTS = {
  eyebrow: "Portfólio de Educação Corporativa",
  headingPre: "Formação que vira ",
  headingAccent: "resultado",
  headingPost: " no próximo dia de trabalho.",
  lead: "Programas de educação corporativa que unem o rigor acadêmico da Católica SC à realidade do seu negócio. Cada iniciativa nasce de um problema real e termina em resultado aplicável.",
  sectionEyebrow: "Portfólio",
  sectionTitle: "Seis caminhos para o mesmo objetivo",
  reasonsTitle: "O diagnóstico que ninguém quer ouvir",
  reasonsSubtitle: "Quatro razões pelas quais o desenvolvimento de pessoas para de funcionar antes de começar.",
  reasons: [
    {
      title: "O talento qualificado não aparece no mercado pronto.",
      text: "A {{empresa}} compete pelos mesmos engenheiros e gestores que todas as outras empresas da região. Quem não forma o próprio talento sempre chega em segundo lugar no processo seletivo — ou paga caro demais para chegar em primeiro.",
    },
    {
      title: "Treinamentos terminam na sexta. A rotina recomeça na segunda.",
      text: "Sem acompanhamento, sem indicadores e sem entregável concreto, o investimento em formação se dissolve em duas semanas. Não é problema de engajamento. É problema de método. Formação sem continuidade não forma — entretém.",
    },
    {
      title: "Aprenda com quem pesquisa. Não com quem posta.",
      text: "O mercado está saturado de conteúdo raso vendido como transformação. Frameworks de slide, cases de empresa americana, inspiração sem contexto. A {{empresa}} merece formação com lastro acadêmico real — de quem publicou, pesquisou e conhece o chão de fábrica catarinense.",
    },
    {
      title: "Certificados sem critério viram ruído.",
      text: "O colaborador que coleciona certificados mas não muda de comportamento é um sintoma — não um problema individual. Formação que não tem critério de conclusão real não tem valor para quem recebe nem para quem paga. A Católica emite. O mercado reconhece.",
    },
  ],
};

function rowToContent(r) {
  if (!r) return { ...DEFAULTS };
  let reasons = DEFAULTS.reasons;
  if (r.reasons) {
    try {
      const parsed = JSON.parse(r.reasons);
      if (Array.isArray(parsed) && parsed.length) reasons = parsed;
    } catch {}
  }
  return {
    eyebrow: r.eyebrow ?? DEFAULTS.eyebrow,
    headingPre: r.heading_pre ?? DEFAULTS.headingPre,
    headingAccent: r.heading_accent ?? DEFAULTS.headingAccent,
    headingPost: r.heading_post ?? DEFAULTS.headingPost,
    lead: r.lead ?? DEFAULTS.lead,
    sectionEyebrow: r.section_eyebrow ?? DEFAULTS.sectionEyebrow,
    sectionTitle: r.section_title ?? DEFAULTS.sectionTitle,
    reasonsTitle: r.reasons_title ?? DEFAULTS.reasonsTitle,
    reasonsSubtitle: r.reasons_subtitle ?? DEFAULTS.reasonsSubtitle,
    reasons,
  };
}

export async function GET() {
  const conn = await db();
  const { rows } = await conn.execute("SELECT * FROM home_content WHERE id = 1");
  return NextResponse.json({ content: rowToContent(rows[0]) });
}

export async function PUT(req) {
  const body = await req.json();
  const c = { ...DEFAULTS, ...body };
  const conn = await db();
  await conn.execute({
    sql: `INSERT INTO home_content (id, eyebrow, heading_pre, heading_accent, heading_post, lead, section_eyebrow, section_title, reasons_title, reasons_subtitle, reasons, updated_at)
          VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            eyebrow=excluded.eyebrow, heading_pre=excluded.heading_pre, heading_accent=excluded.heading_accent,
            heading_post=excluded.heading_post, lead=excluded.lead, section_eyebrow=excluded.section_eyebrow,
            section_title=excluded.section_title, reasons_title=excluded.reasons_title,
            reasons_subtitle=excluded.reasons_subtitle, reasons=excluded.reasons,
            updated_at=excluded.updated_at`,
    args: [
      c.eyebrow,
      c.headingPre,
      c.headingAccent,
      c.headingPost,
      c.lead,
      c.sectionEyebrow,
      c.sectionTitle,
      c.reasonsTitle,
      c.reasonsSubtitle,
      JSON.stringify(Array.isArray(c.reasons) ? c.reasons : []),
      new Date().toISOString(),
    ],
  });
  return NextResponse.json({ ok: true });
}
