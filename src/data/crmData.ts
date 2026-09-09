import { CRMDeal, CRMStage, CRMIntegrationConfig, CRMTag, CRMColumn } from "../types";

export const formatBRL = (val: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(val);
};

export interface TagColorOption {
  key: string;
  name: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  dotClass: string;
}

export const TAG_COLOR_OPTIONS: TagColorOption[] = [
  { key: "emerald", name: "Verde Esmeralda", bgClass: "bg-emerald-50", textClass: "text-emerald-700", borderClass: "border-emerald-200/80", dotClass: "bg-emerald-500" },
  { key: "sky", name: "Azul Céu", bgClass: "bg-sky-50", textClass: "text-sky-700", borderClass: "border-sky-200/80", dotClass: "bg-sky-500" },
  { key: "teal", name: "Verde Petróleo", bgClass: "bg-teal-50", textClass: "text-teal-700", borderClass: "border-teal-200/80", dotClass: "bg-teal-500" },
  { key: "cyan", name: "Ciano", bgClass: "bg-cyan-50", textClass: "text-cyan-700", borderClass: "border-cyan-200/80", dotClass: "bg-cyan-500" },
  { key: "amber", name: "Âmbar / Amarelo", bgClass: "bg-amber-50", textClass: "text-amber-700", borderClass: "border-amber-200/80", dotClass: "bg-amber-500" },
  { key: "orange", name: "Laranja", bgClass: "bg-orange-50", textClass: "text-orange-700", borderClass: "border-orange-200/80", dotClass: "bg-orange-500" },
  { key: "rose", name: "Rosa / Vermelho", bgClass: "bg-rose-50", textClass: "text-rose-700", borderClass: "border-rose-200/80", dotClass: "bg-rose-500" },
  { key: "purple", name: "Roxo", bgClass: "bg-purple-50", textClass: "text-purple-700", borderClass: "border-purple-200/80", dotClass: "bg-purple-500" },
  { key: "indigo", name: "Índigo", bgClass: "bg-indigo-50", textClass: "text-indigo-700", borderClass: "border-indigo-200/80", dotClass: "bg-indigo-500" },
  { key: "slate", name: "Cinza Neutro", bgClass: "bg-slate-100", textClass: "text-slate-700", borderClass: "border-slate-200/80", dotClass: "bg-slate-500" },
];

export interface ColumnColorOption {
  key: string;
  name: string;
  dotColor: string;
  barColor: string;
  badgeBg: string;
  badgeText: string;
}

export const COLUMN_COLOR_OPTIONS: ColumnColorOption[] = [
  { key: "slate", name: "Cinza Neutro", dotColor: "bg-slate-400", barColor: "from-slate-400 to-slate-500", badgeBg: "bg-slate-100", badgeText: "text-slate-700" },
  { key: "sky", name: "Azul Céu", dotColor: "bg-sky-500", barColor: "from-sky-400 to-blue-500", badgeBg: "bg-sky-50", badgeText: "text-sky-700" },
  { key: "cyan", name: "Ciano", dotColor: "bg-cyan-500", barColor: "from-cyan-400 to-teal-500", badgeBg: "bg-cyan-50", badgeText: "text-cyan-700" },
  { key: "amber", name: "Âmbar", dotColor: "bg-amber-500", barColor: "from-amber-400 to-orange-500", badgeBg: "bg-amber-50", badgeText: "text-amber-700" },
  { key: "purple", name: "Roxo", dotColor: "bg-purple-500", barColor: "from-purple-400 to-indigo-500", badgeBg: "bg-purple-50", badgeText: "text-purple-700" },
  { key: "emerald", name: "Verde Agro", dotColor: "bg-[#00a83e]", barColor: "from-emerald-400 to-[#00a83e]", badgeBg: "bg-emerald-50", badgeText: "text-emerald-700" },
  { key: "teal", name: "Verde Petróleo", dotColor: "bg-teal-500", barColor: "from-teal-400 to-emerald-600", badgeBg: "bg-teal-50", badgeText: "text-teal-700" },
  { key: "rose", name: "Rosa / Alerta", dotColor: "bg-rose-500", barColor: "from-rose-400 to-rose-600", badgeBg: "bg-rose-50", badgeText: "text-rose-700" },
  { key: "indigo", name: "Índigo", dotColor: "bg-indigo-500", barColor: "from-indigo-400 to-indigo-600", badgeBg: "bg-indigo-50", badgeText: "text-indigo-700" },
  { key: "zinc", name: "Grafite", dotColor: "bg-zinc-600", barColor: "from-zinc-500 to-zinc-700", badgeBg: "bg-zinc-100", badgeText: "text-zinc-700" },
];

export const DEFAULT_TAGS: CRMTag[] = [
  { id: "tag-1", name: "Sementes Soja", color: "emerald", bgClass: "bg-emerald-50", textClass: "text-emerald-700", borderClass: "border-emerald-200/80" },
  { id: "tag-2", name: "Defensivos", color: "sky", bgClass: "bg-sky-50", textClass: "text-sky-700", borderClass: "border-sky-200/80" },
  { id: "tag-3", name: "Biológicos", color: "teal", bgClass: "bg-teal-50", textClass: "text-teal-700", borderClass: "border-teal-200/80" },
  { id: "tag-4", name: "Nutrição Foliar", color: "cyan", bgClass: "bg-cyan-50", textClass: "text-cyan-700", borderClass: "border-cyan-200/80" },
  { id: "tag-5", name: "Barter Grãos", color: "amber", bgClass: "bg-amber-50", textClass: "text-amber-700", borderClass: "border-amber-200/80" },
  { id: "tag-6", name: "Prioridade Safra", color: "rose", bgClass: "bg-rose-50", textClass: "text-rose-700", borderClass: "border-rose-200/80" },
  { id: "tag-7", name: "Fertilizantes NPK", color: "indigo", bgClass: "bg-indigo-50", textClass: "text-indigo-700", borderClass: "border-indigo-200/80" },
  { id: "tag-8", name: "Produtor VIP", color: "purple", bgClass: "bg-purple-50", textClass: "text-purple-700", borderClass: "border-purple-200/80" },
];

export const DEFAULT_COLUMNS: CRMColumn[] = [
  { id: "col-1", key: "Clientes", label: "Clientes", dotColor: "bg-slate-400", barColor: "from-slate-400 to-slate-500", badgeBg: "bg-slate-100", badgeText: "text-slate-700" },
  { id: "col-2", key: "Pré-Qualificados", label: "Pré-Qualificados", dotColor: "bg-sky-500", barColor: "from-sky-400 to-blue-500", badgeBg: "bg-sky-50", badgeText: "text-sky-700" },
  { id: "col-3", key: "Qualificados", label: "Qualificados", dotColor: "bg-cyan-500", barColor: "from-cyan-400 to-teal-500", badgeBg: "bg-cyan-50", badgeText: "text-cyan-700" },
  { id: "col-4", key: "Negociação", label: "Negociação", dotColor: "bg-amber-500", barColor: "from-amber-400 to-orange-500", badgeBg: "bg-amber-50", badgeText: "text-amber-700" },
  { id: "col-5", key: "Resgates", label: "Resgates", dotColor: "bg-purple-500", barColor: "from-purple-400 to-indigo-500", badgeBg: "bg-purple-50", badgeText: "text-purple-700" },
  { id: "col-6", key: "Vendas", label: "Vendas", dotColor: "bg-[#00a83e]", barColor: "from-emerald-400 to-[#00a83e]", badgeBg: "bg-emerald-50", badgeText: "text-emerald-700" },
  { id: "col-7", key: "Recorrência", label: "Recorrência", dotColor: "bg-teal-500", barColor: "from-teal-400 to-emerald-600", badgeBg: "bg-teal-50", badgeText: "text-teal-700" },
  { id: "col-8", key: "Finalizados", label: "Finalizados", dotColor: "bg-zinc-600", barColor: "from-zinc-500 to-zinc-700", badgeBg: "bg-zinc-100", badgeText: "text-zinc-700" },
];

export const INITIAL_DEALS: CRMDeal[] = [
  {
    id: "deal-1",
    title: "Insumos Soja Safra 24/25",
    clientName: "Marcos Antônio Fagundes",
    farmName: "Fazenda Santa Fé",
    cityState: "Rio Verde - GO",
    stage: "Negociação",
    value: 285000,
    salespersonName: "João Silva",
    productCategory: "Fungicidas & Adubos",
    tags: ["Defensivos", "Prioridade Safra", "Produtor VIP"],
    areaHectares: 1200,
    startDate: "2026-08-10",
    expectedCloseDate: "2026-09-20",
    priority: "alta",
    lastContact: "Hoje, 09:30",
    probability: 75,
    phone: "+55 (64) 99244-1234",
  },
  {
    id: "deal-2",
    title: "Sementes Milho Safrinha",
    clientName: "Renato Silveira Costa",
    farmName: "Agropecuária Alvorada",
    cityState: "Sorriso - MT",
    stage: "Vendas",
    value: 410000,
    salespersonName: "Maria Oliveira",
    productCategory: "Sementes Híbridas",
    tags: ["Sementes Soja", "Barter Grãos"],
    areaHectares: 2400,
    startDate: "2026-08-01",
    expectedCloseDate: "2026-09-08",
    priority: "alta",
    lastContact: "Ontem, 16:40",
    probability: 100,
    phone: "+55 (66) 99877-3321",
  },
  {
    id: "deal-3",
    title: "Nutrição Foliar & Bioestimulantes",
    clientName: "Guilherme Tondatto",
    farmName: "Fazenda Três Irmãos",
    cityState: "Uberaba - MG",
    stage: "Qualificados",
    value: 95000,
    salespersonName: "Carlos Eduardo",
    productCategory: "Biológicos & Nutrição",
    tags: ["Biológicos", "Nutrição Foliar"],
    areaHectares: 650,
    startDate: "2026-08-18",
    expectedCloseDate: "2026-10-10",
    priority: "média",
    lastContact: "Há 2 dias",
    probability: 55,
    phone: "+55 (34) 99123-4567",
  },
  {
    id: "deal-4",
    title: "Renovação Pacote Químico Safra",
    clientName: "Fernando Guimarães",
    farmName: "Estância Primavera",
    cityState: "Cascavel - PR",
    stage: "Recorrência",
    value: 175000,
    salespersonName: "João Silva",
    productCategory: "Herbicidas Seletivos",
    tags: ["Defensivos", "Fertilizantes NPK"],
    areaHectares: 850,
    startDate: "2026-07-25",
    expectedCloseDate: "2026-09-15",
    priority: "baixa",
    lastContact: "Há 4 dias",
    probability: 90,
    phone: "+55 (45) 99988-1122",
  },
  {
    id: "deal-5",
    title: "Programa Barter de Fertilizantes",
    clientName: "Valdomiro Bressan",
    farmName: "Agropecuária Bressan",
    cityState: "Luís Eduardo Magalhães - BA",
    stage: "Pré-Qualificados",
    value: 520000,
    salespersonName: "Maria Oliveira",
    productCategory: "NPK & Micronutrientes",
    tags: ["Barter Grãos", "Fertilizantes NPK", "Produtor VIP"],
    areaHectares: 3100,
    startDate: "2026-08-22",
    expectedCloseDate: "2026-10-30",
    priority: "alta",
    lastContact: "Hoje, 11:15",
    probability: 30,
    phone: "+55 (77) 99811-9988",
  },
  {
    id: "deal-6",
    title: "Tratamento de Sementes Industrial (TSI)",
    clientName: "Luciano Zampieri",
    farmName: "Fazenda Planalto",
    cityState: "Dourados - MS",
    stage: "Clientes",
    value: 68000,
    salespersonName: "Carlos Eduardo",
    productCategory: "Inoculantes & Fungicidas",
    tags: ["Sementes Soja", "Biológicos"],
    areaHectares: 420,
    startDate: "2026-08-28",
    expectedCloseDate: "2026-11-05",
    priority: "média",
    lastContact: "Há 1 semana",
    probability: 15,
    phone: "+55 (67) 99122-3344",
  },
  {
    id: "deal-7",
    title: "Contrato Fornecimento Algodão Safra",
    clientName: "Augusto Cézar Dalmolin",
    farmName: "Fazenda Progresso",
    cityState: "Sapezal - MT",
    stage: "Negociação",
    value: 630000,
    salespersonName: "Lucas Santos",
    productCategory: "Defensivos & Reguladores",
    tags: ["Defensivos", "Prioridade Safra", "Produtor VIP"],
    areaHectares: 4500,
    startDate: "2026-08-12",
    expectedCloseDate: "2026-09-28",
    priority: "alta",
    lastContact: "Hoje, 08:20",
    probability: 80,
    phone: "+55 (65) 99933-7711",
  },
  {
    id: "deal-8",
    title: "Adubação Foliar Alta Produtividade",
    clientName: "Patrícia Vilela",
    farmName: "Sítio Bela Vista",
    cityState: "Patos de Minas - MG",
    stage: "Resgates",
    value: 82000,
    salespersonName: "Ana Paula",
    productCategory: "Nutrição Especial",
    tags: ["Nutrição Foliar"],
    areaHectares: 320,
    startDate: "2026-07-10",
    expectedCloseDate: "2026-09-18",
    priority: "média",
    lastContact: "Ontem, 14:10",
    probability: 60,
    phone: "+55 (34) 99881-2244",
  },
  {
    id: "deal-9",
    title: "Entrega Técnica e Fechamento de Safra",
    clientName: "Antônio Carlos Zanetti",
    farmName: "Fazenda Zanetti",
    cityState: "Jataí - GO",
    stage: "Finalizados",
    value: 310000,
    salespersonName: "João Silva",
    productCategory: "Pacote Completo",
    tags: ["Defensivos", "Sementes Soja", "Fertilizantes NPK"],
    areaHectares: 1800,
    startDate: "2026-06-15",
    expectedCloseDate: "2026-08-30",
    priority: "baixa",
    lastContact: "28 de Ago",
    probability: 100,
    phone: "+55 (64) 99112-9988",
  },
];

export interface ProviderMeta {
  brandColor: string;
  gradient: string;
  lightBg: string;
  borderHover: string;
  monogram: string;
  tagline: string;
  features: string[];
  protocol: string;
  latency: string;
}

export const PROVIDER_METADATA: Record<string, ProviderMeta> = {
  clover: {
    brandColor: "#00a83e",
    gradient: "from-emerald-600 to-teal-700",
    lightBg: "bg-emerald-50",
    borderHover: "hover:border-emerald-500/50 hover:shadow-emerald-500/10",
    monogram: "CL",
    tagline: "Aliare Agro • ERP de Revendas",
    features: [
      "Contratos de Barter & Grãos",
      "Pedidos Faturados no ERP",
      "Mapeamento de Fazendas & RTVs",
    ],
    protocol: "REST API v2 • Webhooks Bi-direcionais",
    latency: "32ms",
  },
  siagri: {
    brandColor: "#0284c7",
    gradient: "from-teal-600 to-cyan-700",
    lightBg: "bg-cyan-50",
    borderHover: "hover:border-cyan-500/50 hover:shadow-cyan-500/10",
    monogram: "SG",
    tagline: "Siagri Agrointelli • Cooperativas",
    features: [
      "Visitas Técnicas de Campo de RTV",
      "Mapeamento Geoespacial de Talhões",
      "Saldos em Armazém & Cotações",
    ],
    protocol: "OpenAPI Siagri • JSON Sync",
    latency: "44ms",
  },
  salesforce: {
    brandColor: "#2563eb",
    gradient: "from-sky-600 to-blue-700",
    lightBg: "bg-sky-50",
    borderHover: "hover:border-sky-500/50 hover:shadow-sky-500/10",
    monogram: "SF",
    tagline: "Sales Cloud • Multinacionais & Trading",
    features: [
      "Contas de Grupos Econômicos Rurais",
      "Oportunidades de Safra Multimoeda",
      "Disparo Automático de Campanhas",
    ],
    protocol: "OAuth 2.0 • Streaming API v58",
    latency: "28ms",
  },
  totvs: {
    brandColor: "#7c3aed",
    gradient: "from-purple-600 to-indigo-800",
    lightBg: "bg-purple-50",
    borderHover: "hover:border-purple-500/50 hover:shadow-purple-500/10",
    monogram: "TT",
    tagline: "Agrotitan Viasoft • Armazéns & Sementes",
    features: [
      "Cotações de Balcão e Fixação Grãos",
      "Romaneios e Entregas em Armazém",
      "Liberação Ágil de Crédito Rural",
    ],
    protocol: "Agrotitan Gateway • Realtime Webhooks",
    latency: "36ms",
  },
  agendor: {
    brandColor: "#ea580c",
    gradient: "from-amber-500 to-emerald-600",
    lightBg: "bg-amber-50",
    borderHover: "hover:border-amber-500/50 hover:shadow-amber-500/10",
    monogram: "AG",
    tagline: "HubSpot Agro • Funil Ágil & WhatsApp",
    features: [
      "Histórico de Mensagens WhatsApp",
      "Follow-ups Automáticos de Colaboradores",
      "Alertas Imediatos de Safra e Plantio",
    ],
    protocol: "Webhooks REST v3 • Push Notifications",
    latency: "22ms",
  },
};

export const DEFAULT_INTEGRATIONS: CRMIntegrationConfig[] = [
  {
    id: "integ-1",
    name: "Aliare Clover CRM",
    providerCode: "clover",
    badge: "Oficial ERP Agro",
    popularInAgro: "Mais usado em revendas e cooperativas de grãos do Centro-Oeste e Sul",
    description: "Sincroniza pedidos faturados no ERP, contas de barter e limite de crédito com dados em tempo real.",
    status: "connected",
    connectedAccount: "revenda.matriz@ceruti.com.br",
    apiUrl: "https://api.aliarerest.com.br/v2/crm-webhook",
    apiKey: "clover_live_89a7fbc29104",
    lastSync: "Hoje, às 08:42",
    syncedDealsCount: 42,
    syncFrequency: "A cada 15 min",
  },
  {
    id: "integ-2",
    name: "Siagri Agrointelli CRM",
    providerCode: "siagri",
    badge: "Líder Cooperativas",
    popularInAgro: "Integrador padrão para cooperativas agropecuárias e armazéns gerais",
    description: "Conecta os diários de bordo dos RTVs a campo, visitas agronômicas e pedidos de insumos.",
    status: "connected",
    connectedAccount: "coop.integracao@agrointelli.com.br",
    apiUrl: "https://openapi.siagri.com.br/gateway/deals",
    apiKey: "siagri_prod_4398fd11029e",
    lastSync: "Hoje, às 08:15",
    syncedDealsCount: 28,
    syncFrequency: "A cada 30 min",
  },
  {
    id: "integ-3",
    name: "Salesforce Agriculture Cloud",
    providerCode: "salesforce",
    badge: "Enterprise Multinacional",
    popularInAgro: "Grandes multinacionais químicas, de sementes e tradings de commodities",
    description: "Gestão completa de grandes contas, limites de exposição de crédito de safra e pipeline global.",
    status: "disconnected",
    apiUrl: "https://login.salesforce.com/services/oauth2/token",
    syncFrequency: "A cada 1 hora",
  },
  {
    id: "integ-4",
    name: "Agrotitan Viasoft CRM",
    providerCode: "totvs",
    badge: "Cerealistas & Sementeiras",
    popularInAgro: "Especialista em revendas de insumos agrícolas, sementeiras e silos",
    description: "Espelha cotações de balcão de grãos, autorizações de carregamento e negociações de insumos.",
    status: "disconnected",
    apiUrl: "https://api.viasoftagrotitan.com.br/v1/sync",
    syncFrequency: "A cada 2 horas",
  },
  {
    id: "integ-5",
    name: "Agendor / Agrosmart CRM",
    providerCode: "agendor",
    badge: "Funil Comercial Ágil",
    popularInAgro: "Pequenas e médias distribuidoras com foco em atendimento consultivo e WhatsApp",
    description: "Sincronização de conversas comerciais, propostas rápidas enviadas por WhatsApp e tarefas do dia.",
    status: "disconnected",
    apiUrl: "https://api.agendor.com.br/v3/integrations/deals",
    syncFrequency: "Tempo Real",
  },
];

export const INITIAL_INTEGRATIONS = DEFAULT_INTEGRATIONS;
