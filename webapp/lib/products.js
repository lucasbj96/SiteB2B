export const TRILHAS = [
  { num: "01", name: "Integração — Onboarding Estruturado", tag: "Porque o primeiro dia decide os próximos quatro anos.", audience: "Novos colaboradores", duration: "12 semanas" },
  { num: "02", name: "Cultura — Gerações", tag: "Quando o estagiário ensina o diretor, a empresa aprende duas vezes.", audience: "Todos os níveis", duration: "8 semanas" },
  { num: "03", name: "Diversidade — Inclusão & Equidade", tag: "Diversidade se declara no press release. Inclusão se pratica na reunião de segunda.", audience: "Lideranças e equipes", duration: "8 semanas" },
  { num: "04", name: "Carreira — Acelerador de Transição", tag: "Mudar de área não deveria parecer recomeçar do zero.", audience: "Profissionais em transição", duration: "10 semanas" },
  { num: "05", name: "Gestão — Escritório de Projetos", tag: "O projeto que nunca termina começa na reunião que nunca deveria ter acontecido.", audience: "Analistas e gestores", duration: "12 semanas" },
  { num: "06", name: "Desenvolvimento — Liderança", tag: "Ninguém nasce líder. Mas alguns aprendem antes dos outros.", audience: "Coordenadores a diretores", duration: "16 semanas" },
  { num: "07", name: "Bem-estar — Saúde Mental no Trabalho", tag: "O colaborador que pede demissão raramente estava bem há semanas.", audience: "Todos + líderes", duration: "8 semanas" },
];

export const PRODUCTS = [
  {
    id: "legado", name: "Católica Legado", tag: "Talentos & Pipeline",
    pitch: "Um pipeline de talentos formado sob medida — e 10 profissionais curados desde o primeiro dia.",
    manifesto: "Um programa de troca real. Não de treinamento.",
    stats: [
      { v: "10", l: "Talentos curados imediatamente" },
      { v: "4 anos", l: "Ciclo de formação e pipeline" },
      { v: "30 dias", l: "SLA de substituição" },
    ],
    body: [
      "O mercado de talentos é um leilão. Toda empresa compete pelas mesmas pessoas, nos mesmos portais, com os mesmos benefícios. O Católica Legado existe para quem entendeu que isso não é sustentável.",
      "No programa, a empresa investe na formação de pessoas desde o início da graduação. Em troca, recebe imediatamente 10 profissionais curados pelo Católica Carreiras — avaliados por competência, não apenas por currículo.",
      "Ao longo de 4 anos, você constrói um pipeline de talentos que já conhece sua cultura antes de assinar a carteira. Não é filantropia: é investimento estratégico em infraestrutura humana, com retorno duplo — talento hoje e talento formado para você amanhã.",
    ],
    points: ["10 profissionais curados imediatamente", "Curadoria por competência, não por currículo", "Pipeline construído ao longo de 4 anos", "Retorno duplo: talento hoje e amanhã"],
    blocks: [
      { isList: true, heading: "Para a sua empresa", items: ["10 profissionais curados e disponíveis imediatamente", "Pipeline alinhado à cultura antes mesmo da contratação", "Custo de recrutamento reduzido", "Redução de turnover e marca empregadora mais forte na região"] },
      { isList: true, heading: "Para o talento", items: ["Bolsa integral ou parcial garantida desde o início da graduação", "Inclusão no processo seletivo da empresa parceira", "Projetos reais aplicados durante o curso", "Acompanhamento de carreira do primeiro ano à contratação"] },
      { isList: true, heading: "Para a Católica", items: ["Contrato de longo prazo, renovável", "Vínculo profundo com empresas âncora da região", "Prova viva de relevância: formação que vira emprego"] },
    ],
    cta: ["Quer começar a formar o seu pipeline?", "Vamos desenhar o Católica Legado para a sua operação."],
  },
  {
    id: "posco", name: "Pós Co. MBA", tag: "Pós-graduação",
    pitch: "Uma pós-graduação co-desenhada para as necessidades reais da sua empresa.",
    manifesto: "A empresa entra com o problema. A Católica entra com a ciência. O diploma sai com os dois.",
    stats: [
      { v: "18 meses", l: "Duração média" },
      { v: "360h", l: "Carga horária" },
      { v: "Turma fechada", l: "Exclusiva para o seu time" },
      { v: "Diploma co-assinado", l: "Certificação MEC" },
    ],
    body: [
      "Uma pós-graduação realizada em cooperação, desenhada a partir das necessidades reais da sua empresa.",
      "O currículo é construído em conjunto — combinando o rigor acadêmico da Católica SC com os desafios concretos do seu negócio, em uma turma dedicada ao seu time, com diploma co-assinado.",
    ],
    points: ["Currículo co-desenhado com a empresa", "Turma dedicada ao seu time", "Rigor acadêmico reconhecido", "Aplicação direta ao negócio"],
    blocks: [
      { isSteps: true, heading: "Como funciona", items: [
        { n: "01", t: "Diagnóstico", d: "Mapeamento dos gaps estratégicos para escolher a pós de maior impacto." },
        { n: "02", t: "Co-construção", d: "Currículo desenvolvido com professores selecionados por fit técnico e setorial, com cases reais da sua operação." },
        { n: "03", t: "Certificação", d: "Turma fechada, cronograma adaptado à rotina da empresa, diploma co-assinado com certificação MEC." },
      ] },
      { isList: true, heading: "Áreas disponíveis para co-assinatura", items: ["Liderança Avançada & Gestão de Pessoas", "Gestão Industrial & Operações", "Tecnologia, Inovação & Dados", "Supply Chain & Sustentabilidade", "Direito Empresarial & Compliance", "Desenvolvimento Organizacional"] },
    ],
    cta: ["Uma pós com a cara da sua empresa.", "Vamos montar a turma e o currículo em cooperação."],
  },
  {
    id: "incompany", name: "In-Company", tag: "Formação sob medida",
    pitch: "Formação sob medida em que cada módulo entrega algo aplicável já no próximo dia.",
    manifesto: "O que foi aprendido na quinta, aplica na segunda.",
    stats: [
      { v: "7 trilhas", l: "Programas ativos" },
      { v: "8–12", l: "Pessoas por squad" },
      { v: "30 dias", l: "Follow-up de impacto" },
    ],
    body: [
      "Formação in-company desenhada para a realidade do cliente. Cada módulo termina com um entregável concreto — algo aplicável já no próximo dia de trabalho.",
      "Porque treinamento sem continuidade não forma, apenas entretém. Aqui, aprendizado e execução andam sempre juntos, com o método Fator Dia Seguinte™.",
    ],
    points: ["Conteúdo desenhado para a sua realidade", "Entregável concreto a cada módulo", "Aplicação imediata no trabalho", "Continuidade que forma, não entretém"],
    blocks: [
      { isList: true, heading: "O método Fator Dia Seguinte™", items: ["Entregável concreto por módulo — o conhecimento vira ação antes do fim do dia", "Squads de 8 a 12 pessoas do mesmo contexto, sem mistura de hierarquias", "Follow-up estruturado de 30 dias para medir impacto real — não entusiasmo passageiro"] },
      { isTrilhas: true, heading: "As 7 trilhas", items: TRILHAS },
      { isList: true, heading: "O que vem junto em todas as trilhas", items: ["Diagnóstico inicial da necessidade específica antes de qualquer módulo iniciar", "Material desenvolvido para a realidade da empresa — nada de conteúdo genérico de prateleira", "Certificação MEC para todos os participantes que concluírem", "Relatório de impacto entregue à liderança ao final de cada programa"] },
    ],
    cta: ["Formação que sua equipe usa amanhã.", "Vamos desenhar os módulos a partir dos seus desafios."],
  },
  {
    id: "uc", name: "UC by CatólicaSC", tag: "Universidade corporativa",
    pitch: "A universidade corporativa da sua empresa — sem custar milhões nem levar anos.",
    manifesto: "Décadas de infraestrutura acadêmica. Centenas de professores. Só falta o seu nome.",
    stats: [
      { v: "500+", l: "Professores especializados" },
      { v: "18", l: "Áreas de conhecimento" },
      { v: "90 dias", l: "Para estar no ar" },
      { v: "MEC", l: "Certificação nacional" },
    ],
    body: [
      "Montar uma universidade corporativa do zero custa milhões e leva anos.",
      "A UC by CatólicaSC é a universidade corporativa da sua empresa — com a identidade da empresa, os programas que ela precisa e o rigor acadêmico que o mercado reconhece.",
    ],
    points: ["Identidade visual da sua empresa", "Programas sob medida", "Rigor acadêmico reconhecido", "Estrutura pronta, sem anos de espera"],
    blocks: [
      { isTable: true, heading: "Por que adotar, não construir", rows: [
        { a: "Construir uma UC própria", b: "Anos de projeto, CAPEX alto e infraestrutura ociosa — enquanto isso o talento não para de sair.", c: "Ativa em 90 dias, sem CAPEX — a estrutura já existe." },
        { a: "Plataformas genéricas de e-learning", b: "Conteúdo de prateleira, sem contexto da empresa.", c: "Programas customizados, desenhados para a realidade do cliente." },
        { a: "Treinamentos pontuais", b: "O efeito se dissolve em semanas — não forma cultura.", c: "Trilhas estruturadas com certificação e SLA de impacto." },
      ] },
      { isList: true, heading: "Os 6 pilares", items: ["Professores — mais de 500 especialistas em 18 áreas", "Áreas — cobertura completa da jornada do colaborador", "Método — squads & sprints com entregável concreto", "LMS — plataforma white-label com a marca da empresa", "SLA — relatório executivo mensal de indicadores", "MEC — certificação nacional reconhecida pelo mercado"] },
      { isTrilhas: true, heading: "As 7 trilhas permanentes", items: TRILHAS },
      { isSteps: true, heading: "Implantação em 90 dias", items: [
        { n: "01", t: "Diagnóstico", d: "Mapeamento de gaps, perfis e prioridades." },
        { n: "02", t: "Arquitetura da UC", d: "Definição de trilhas, identidade e roadmap anual." },
        { n: "03", t: "Ativação", d: "LMS no ar, primeiras trilhas lançadas, líderes treinados." },
        { n: "04", t: "Gestão contínua", d: "SLA mensal, revisão semestral, expansão conforme resultado." },
      ] },
    ],
    cta: ["Sua universidade corporativa, pronta para operar.", "Vamos estruturar a UC da sua empresa."],
  },
  {
    id: "diagnostico", name: "Diagnóstico Personalizado", tag: "Ferramenta", isDiag: true,
    pitch: "4 perguntas. 3 minutos. As trilhas certas para o seu momento.",
    manifesto: "Antes de criar um programa, precisamos entender o seu problema de verdade.",
    body: [], points: [],
    cta: ["Prefere conversar direto?", "Nosso time comercial interpreta o diagnóstico com você."],
  },
  {
    id: "exclusive", name: "Católica Exclusive", tag: "Alta liderança", premium: true,
    pitch: "Uma jornada de transformação para 100 líderes por ano. O que vem depois de todos os cursos.",
    manifesto: "Alguns chegam ao topo. Poucos chegam a si mesmos.",
    stats: [
      { v: "100", l: "Líderes por ano" },
      { v: "4", l: "Turmas anuais" },
      { v: "7", l: "Experiências" },
      { v: "Seleção", l: "Entrada por convite e conversa" },
    ],
    body: [
      '"Você construiu uma carreira brilhante. E agora?" Existe um momento na vida de todo líder de verdade em que os prêmios, os cargos e os números não respondem mais à pergunta que importa.',
      "Você chegou onde planejou. Mas ainda sente que falta algo — e não é mais um projeto, mais uma promoção, mais uma conquista. É uma virada. Uma transformação que nenhum MBA foi projetado para entregar.",
      "Acompanhamos 100 líderes por ano em uma jornada completa de transformação — física, mental, criativa e espiritual. Intensa, condensada e acompanhada do começo ao fim. Não é um curso. É o que vem depois de todos os cursos.",
    ],
    points: ["100 líderes por ano, 4 turmas anuais", "7 experiências de transformação completa", "Acompanhamento contínuo do início ao fim", "Entrada por seleção — não é só pagar"],
    blocks: [
      { isChapters: true, heading: "Os sete capítulos", items: [
        { num: "I", title: "Check-up Completo", quote: "Saúde não é ausência de doença. É a base de tudo que vem depois.", partner: "Em parceria com Hospital Marcelino Champagnat" },
        { num: "II", title: "Comer, Rezar, Amar", quote: "Três dias fora do mapa.", partner: "" },
        { num: "III", title: "Escreva seu Capítulo", quote: "Você tem algo a dizer. É hora de dizer.", partner: "" },
        { num: "IV", title: "Grife", quote: "A identidade que você carregou. Agora com a sua assinatura.", partner: "Em parceria com Evelyn · Páprica Stilist" },
        { num: "V", title: "Origens", quote: "Antes de saber para onde vai, entenda de onde veio.", partner: "Com Clóvis de Barros Filho e Michel Alcoforado" },
        { num: "VI", title: "Roma e o Papa", quote: "Uma audiência com o que é maior que você.", partner: "Exclusivo do pacote Exclusive + Roma" },
        { num: "VII", title: "Surpresas", quote: "Se contássemos tudo, não teria graça.", partner: "" },
      ] },
      { isNote: true, heading: "Sobre o que não está aqui", text: "O programa é desenhado para surpreender. Não revelamos tudo porque parte do valor está em chegar sem expectativa e sair sem palavras. Cada turma é diferente. Cada jornada, única. O que descrevemos acima é o mínimo do que você vai viver." },
      { isTable: true, heading: "Dois caminhos, uma transformação", rows: [
        { a: "Exclusive", b: "Check-up completo, imersão Comer Rezar Amar, mentoria individual, grife assinada, conteúdo com Clóvis de Barros Filho e Michel Alcoforado, comunidade vitalícia com os 100 líderes do ano.", c: "A jornada completa de transformação." },
        { a: "Exclusive + Roma", b: "Tudo o que está incluso no pacote Exclusive.", c: "Mais viagem a Roma, visita ao Vaticano, audiência papal e encontro com líderes europeus na agenda." },
      ] },
    ],
    ctaButtonLabel: "Pedir participação →",
    cta: ["Esteja onde você sempre soube que deveria estar.", "A entrada não é pela carteira. É pela conversa. 4 turmas por ano · 25 líderes por turma · Vagas abertas para 2027."],
  },
];

export const DIAG = [
  { type: "single", q: "Qual é o principal foco de desenvolvimento da sua empresa agora?", opts: [
    { label: "Desenvolver lideranças e times de gestão", w: { exclusive: 2, uc: 2 } },
    { label: "Atrair e formar talentos do zero", w: { legado: 3 } },
    { label: "Fortalecer cultura e clima organizacional", w: { incompany: 2, uc: 1 } },
    { label: "Capacitação técnica e reskilling", w: { posco: 2, incompany: 1 } },
    { label: "Bem-estar, saúde mental e retenção", w: { incompany: 2 } },
    { label: "Gestão de projetos e entrega de resultados", w: { incompany: 2, posco: 1 } },
  ] },
  { type: "multi", q: "Quais dessas dores você reconhece no seu time hoje?", sub: "Pode selecionar mais de uma.", opts: [
    { label: "Dificuldade em atrair talentos qualificados na região", w: { legado: 2 } },
    { label: "Lideranças sem preparo para gerir equipes sob pressão", w: { exclusive: 2, uc: 1 } },
    { label: "Alta rotatividade em cargos estratégicos", w: { legado: 1, exclusive: 1 } },
    { label: "Treinamentos que não geram resultado real no dia a dia", w: { incompany: 2 } },
    { label: "Conflitos entre gerações e perfis diferentes", w: { incompany: 1 } },
    { label: "Projetos que iniciam mas raramente entregam no prazo", w: { incompany: 1, posco: 1 } },
    { label: "Sinais de esgotamento ou desmotivação no time", w: { incompany: 1, exclusive: 1 } },
    { label: "Formação técnica que não acompanha a evolução do negócio", w: { posco: 2, uc: 1 } },
  ] },
  { type: "single", q: "Qual é a urgência?", sub: "Isso ajuda a definir o formato e o cronograma mais adequados.", opts: [
    { label: "Preciso de solução nos próximos 90 dias", w: { incompany: 2 } },
    { label: "Quero estruturar para o próximo semestre", w: { posco: 1, uc: 1 } },
    { label: "Pensando estrategicamente, a longo prazo", w: { uc: 2, legado: 1 } },
  ] },
];

export function getBaseProduct(id) {
  return PRODUCTS.find((p) => p.id === id) || null;
}
