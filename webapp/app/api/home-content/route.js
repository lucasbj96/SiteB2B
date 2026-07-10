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
};

function rowToContent(r) {
  if (!r) return { ...DEFAULTS };
  return {
    eyebrow: r.eyebrow ?? DEFAULTS.eyebrow,
    headingPre: r.heading_pre ?? DEFAULTS.headingPre,
    headingAccent: r.heading_accent ?? DEFAULTS.headingAccent,
    headingPost: r.heading_post ?? DEFAULTS.headingPost,
    lead: r.lead ?? DEFAULTS.lead,
    sectionEyebrow: r.section_eyebrow ?? DEFAULTS.sectionEyebrow,
    sectionTitle: r.section_title ?? DEFAULTS.sectionTitle,
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
    sql: `INSERT INTO home_content (id, eyebrow, heading_pre, heading_accent, heading_post, lead, section_eyebrow, section_title, updated_at)
          VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            eyebrow=excluded.eyebrow, heading_pre=excluded.heading_pre, heading_accent=excluded.heading_accent,
            heading_post=excluded.heading_post, lead=excluded.lead, section_eyebrow=excluded.section_eyebrow,
            section_title=excluded.section_title, updated_at=excluded.updated_at`,
    args: [c.eyebrow, c.headingPre, c.headingAccent, c.headingPost, c.lead, c.sectionEyebrow, c.sectionTitle, new Date().toISOString()],
  });
  return NextResponse.json({ ok: true });
}
