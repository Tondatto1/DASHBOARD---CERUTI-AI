import { CRMDeal, CRMColumn, CRMTag, CRMStage } from "../types";

export type CRMFieldKey =
  | "title"
  | "clientName"
  | "farmName"
  | "cityState"
  | "stage"
  | "value"
  | "salespersonName"
  | "productCategory"
  | "tags"
  | "areaHectares"
  | "startDate"
  | "expectedCloseDate"
  | "priority"
  | "probability"
  | "phone"
  | "lastContact"
  | "id"
  | "ignore";

export interface CRMFieldDef {
  key: CRMFieldKey;
  label: string;
  description: string;
  required: boolean;
  example: string;
}

export const CRM_FIELDS: CRMFieldDef[] = [
  { key: "title", label: "Título da Oportunidade", description: "Nome do negócio, cultura ou contrato", required: true, example: "Barter Soja 26/27" },
  { key: "clientName", label: "Produtor / Cliente", description: "Nome do produtor rural, empresa ou grupo", required: true, example: "Fazenda Santa Maria" },
  { key: "farmName", label: "Nome da Fazenda", description: "Propriedade rural ou unidade produtiva", required: false, example: "Sede Fazenda Primavera" },
  { key: "cityState", label: "Cidade / Estado", description: "Município e UF da operação", required: false, example: "Sorriso/MT" },
  { key: "stage", label: "Etapa da Pipeline (Funil)", description: "Coluna onde o card será posicionado no funil", required: true, example: "Negociação" },
  { key: "value", label: "Valor Estimado (R$)", description: "Montante financeiro ou faturamento previsto", required: true, example: "R$ 450.000,00" },
  { key: "salespersonName", label: "Responsável / Vendedor", description: "Consultor, RTV ou vendedor encarregado", required: false, example: "João Silva" },
  { key: "productCategory", label: "Produto / Categoria", description: "Insumo, semente, grão, barter ou defensivo", required: false, example: "Barter Soja, Defensivos" },
  { key: "tags", label: "Tags / Classificações", description: "Marcadores separados por vírgula ou ponto-e-vírgula", required: false, example: "Urgente, Safra 26/27" },
  { key: "areaHectares", label: "Área (Hectares)", description: "Tamanho da lavoura ou área plantada", required: false, example: "1.200 ha" },
  { key: "startDate", label: "Data de Início", description: "Data de entrada da oportunidade", required: false, example: "2026-08-15 ou 15/08/2026" },
  { key: "expectedCloseDate", label: "Previsão de Fechamento", description: "Prazo previsto para conclusão da negociação", required: false, example: "2026-10-30 ou 30/10/2026" },
  { key: "priority", label: "Prioridade", description: "Nível de urgência (alta, média ou baixa)", required: false, example: "alta" },
  { key: "probability", label: "Probabilidade (%)", description: "Chance estimada de fechamento (0 a 100%)", required: false, example: "75%" },
  { key: "phone", label: "Telefone / WhatsApp", description: "Contato direto do produtor ou consultor", required: false, example: "+55 66 99988-7711" },
  { key: "lastContact", label: "Último Contato / Observação", description: "Registro da última interação ou notas", required: false, example: "Hoje às 14:00" },
  { key: "id", label: "ID do Negócio", description: "Identificador único (gerado se não informado)", required: false, example: "deal-101" },
  { key: "ignore", label: "Ignorar esta coluna", description: "Esta coluna não será importada para o CRM", required: false, example: "-" },
];

export interface DetectedColumn {
  fileColumnIndex: number;
  fileColumnName: string;
  suggestedField: CRMFieldKey;
  confidence: "alta" | "media" | "baixa";
  confidenceScore: number;
  sampleValues: string[];
}

export interface StageMapping {
  rawStageName: string;
  mappedStageKey: string;
  isNewColumn: boolean;
  count: number;
}

export interface SpreadsheetAnalysis {
  rawHeaders: string[];
  totalRows: number;
  detectedColumns: DetectedColumn[];
  stagesDetected: StageMapping[];
  allRows: string[][];
  delimiter: string;
}

export interface ImportResult {
  deals: CRMDeal[];
  newColumns: CRMColumn[];
  newTags: CRMTag[];
  stats: {
    totalRows: number;
    validDeals: number;
    newStagesCreated: string[];
    newTagsCreated: string[];
  };
  errors: string[];
}

/**
 * Cabeçalhos padrão oficiais
 */
export const STANDARD_HEADERS = [
  "ID",
  "Titulo",
  "Cliente",
  "Fazenda",
  "Cidade_UF",
  "Etapa_Funil",
  "Valor",
  "Responsavel",
  "Produto",
  "Tags",
  "Area_Hectares",
  "Data_Inicio",
  "Previsao_Fechamento",
  "Prioridade",
  "Probabilidade",
  "Telefone_WhatsApp",
  "Ultimo_Contato",
];

export const HEADER_DESCRIPTIONS: Record<string, { label: string; required: boolean; example: string }> = {
  ID: { label: "Identificador Único", required: false, example: "deal-101 (opcional, gerado automaticamente)" },
  Titulo: { label: "Título da Oportunidade", required: true, example: "Barter Soja Safra 26/27" },
  Cliente: { label: "Nome do Produtor / Cliente", required: true, example: "Grupo Agrícola Bom Futuro" },
  Fazenda: { label: "Nome da Fazenda", required: false, example: "Fazenda Santa Maria" },
  Cidade_UF: { label: "Cidade / Estado", required: false, example: "Sorriso/MT" },
  Etapa_Funil: { label: "Etapa / Coluna na Pipeline", required: true, example: "Negociação (cria a coluna se não existir)" },
  Valor: { label: "Valor Estimado (R$)", required: true, example: "450000 ou 450.000,00" },
  Responsavel: { label: "Colaborador Responsável", required: true, example: "João Silva" },
  Produto: { label: "Categoria / Produto", required: false, example: "Barter Soja, Defensivos, Fertilizantes" },
  Tags: { label: "Tags do Negócio", required: false, example: "Urgente, Safra 26/27 (separadas por vírgula)" },
  Area_Hectares: { label: "Área (Hectares)", required: false, example: "1500" },
  Data_Inicio: { label: "Data de Início", required: false, example: "2026-08-15 ou 15/08/2026" },
  Previsao_Fechamento: { label: "Previsão de Fechamento", required: false, example: "2026-10-30 ou 30/10/2026" },
  Prioridade: { label: "Prioridade", required: false, example: "alta, média ou baixa" },
  Probabilidade: { label: "Probabilidade (%)", required: false, example: "75" },
  Telefone_WhatsApp: { label: "Telefone / WhatsApp", required: false, example: "+55 66 99988-7711" },
  Ultimo_Contato: { label: "Último Contato", required: false, example: "Hoje às 14:00" },
};

/**
 * Escapa uma célula para formato CSV (RFC 4180)
 */
function escapeCsvCell(val: unknown, delimiter = ";"): string {
  if (val === null || val === undefined) return "";
  const str = String(val).trim();
  if (str.includes(delimiter) || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Gera a planilha modelo oficial
 */
export function generateTemplateCsv(): string {
  const delimiter = ";";
  const headerLine = STANDARD_HEADERS.map((h) => escapeCsvCell(h, delimiter)).join(delimiter);

  const sampleRows: Array<Record<string, string>> = [
    {
      ID: "",
      Titulo: "Barter Soja Safra 2026/27",
      Cliente: "Fazenda Primavera - Grupo Silva",
      Fazenda: "Fazenda Primavera",
      Cidade_UF: "Sorriso/MT",
      Etapa_Funil: "Negociação",
      Valor: "450000",
      Responsavel: "João Silva",
      Produto: "Barter Soja",
      Tags: "Urgente, Barter, Safra 26/27",
      Area_Hectares: "1800",
      Data_Inicio: "2026-08-10",
      Previsao_Fechamento: "2026-09-30",
      Prioridade: "alta",
      Probabilidade: "80",
      Telefone_WhatsApp: "+55 66 99988-7711",
      Ultimo_Contato: "Hoje às 10:30",
    },
    {
      ID: "",
      Titulo: "Pacote Defensivos e Fungicidas",
      Cliente: "Agropecuária Santa Luzia",
      Fazenda: "Sede Fazenda Santa Luzia",
      Cidade_UF: "Rio Verde/GO",
      Etapa_Funil: "Qualificados",
      Valor: "280000",
      Responsavel: "Maria Oliveira",
      Produto: "Defensivos",
      Tags: "Alto Potencial, Defensivos",
      Area_Hectares: "950",
      Data_Inicio: "2026-08-18",
      Previsao_Fechamento: "2026-10-15",
      Prioridade: "média",
      Probabilidade: "60",
      Telefone_WhatsApp: "+55 64 99922-3344",
      Ultimo_Contato: "Ontem às 15:00",
    },
    {
      ID: "",
      Titulo: "Contrato Fertilizantes NPK Especial",
      Cliente: "Fazenda Esperança Agrícola",
      Fazenda: "Fazenda Esperança",
      Cidade_UF: "Luís Eduardo Magalhães/BA",
      Etapa_Funil: "Clientes",
      Valor: "620000",
      Responsavel: "Carlos Eduardo",
      Produto: "Fertilizantes",
      Tags: "Prioritário, Nutrição de Solo",
      Area_Hectares: "3200",
      Data_Inicio: "2026-08-25",
      Previsao_Fechamento: "2026-11-20",
      Prioridade: "alta",
      Probabilidade: "40",
      Telefone_WhatsApp: "+55 77 99955-6677",
      Ultimo_Contato: "28/08 às 09:15",
    },
    {
      ID: "",
      Titulo: "Fechamento Barter Milho Safrinha",
      Cliente: "Estância Vale Verde",
      Fazenda: "Vale Verde 1 e 2",
      Cidade_UF: "Rondonópolis/MT",
      Etapa_Funil: "Vendas",
      Valor: "510000",
      Responsavel: "Ana Beatriz",
      Produto: "Sementes",
      Tags: "Fechado, Milho Safrinha",
      Area_Hectares: "1400",
      Data_Inicio: "2026-07-15",
      Previsao_Fechamento: "2026-09-05",
      Prioridade: "baixa",
      Probabilidade: "100",
      Telefone_WhatsApp: "+55 66 99811-2233",
      Ultimo_Contato: "Ontem às 17:40",
    },
  ];

  const lines = [headerLine];
  sampleRows.forEach((row) => {
    const line = STANDARD_HEADERS.map((h) => escapeCsvCell(row[h] || "", delimiter)).join(delimiter);
    lines.push(line);
  });

  return "\uFEFF" + lines.join("\r\n");
}

export interface SmartCsvExportOptions {
  delimiter?: ";" | ",";
  filterStage?: string;
  filterSalesperson?: string;
}

export const SMART_EXPORT_HEADERS: Array<{ key: CRMFieldKey; header: string }> = [
  { key: "title", header: "Título da Oportunidade" },
  { key: "clientName", header: "Produtor / Cliente" },
  { key: "farmName", header: "Fazenda / Propriedade" },
  { key: "cityState", header: "Município / UF" },
  { key: "stage", header: "Etapa da Pipeline" },
  { key: "value", header: "Valor Estimado (R$)" },
  { key: "salespersonName", header: "Consultor Responsável" },
  { key: "productCategory", header: "Cultura / Categoria" },
  { key: "tags", header: "Tags / Classificações" },
  { key: "areaHectares", header: "Área (Hectares)" },
  { key: "startDate", header: "Data de Entrada" },
  { key: "expectedCloseDate", header: "Previsão de Fechamento" },
  { key: "priority", header: "Prioridade" },
  { key: "probability", header: "Probabilidade (%)" },
  { key: "phone", header: "Telefone / WhatsApp" },
  { key: "lastContact", header: "Último Contato / Observações" },
  { key: "id", header: "ID Oportunidade" },
];

/**
 * Exportação Inteligente de Negócios para CSV
 * Gera colunas em português legíveis no Excel/Sheets, codificação UTF-8 e valores somáveis
 */
export function exportSmartCsv(deals: CRMDeal[], options?: SmartCsvExportOptions): string {
  const delimiter = options?.delimiter || ";";
  let targetDeals = [...deals];

  if (options?.filterStage && options.filterStage !== "all") {
    targetDeals = targetDeals.filter(
      (d) => (d.stage || "").toLowerCase().trim() === options.filterStage!.toLowerCase().trim()
    );
  }
  if (options?.filterSalesperson && options.filterSalesperson !== "all") {
    targetDeals = targetDeals.filter(
      (d) => (d.salespersonName || "").toLowerCase().trim() === options.filterSalesperson!.toLowerCase().trim()
    );
  }

  const headerRow = SMART_EXPORT_HEADERS.map((h) => escapeCsvCell(h.header, delimiter)).join(delimiter);
  const rows: string[] = [headerRow];

  targetDeals.forEach((deal) => {
    const rowValues = SMART_EXPORT_HEADERS.map(({ key }) => {
      let cellValue = "";
      switch (key) {
        case "title":
          cellValue = deal.title || "";
          break;
        case "clientName":
          cellValue = deal.clientName || "";
          break;
        case "farmName":
          cellValue = deal.farmName || "";
          break;
        case "cityState":
          cellValue = deal.cityState || "";
          break;
        case "stage":
          cellValue = deal.stage || "";
          break;
        case "value":
          cellValue = String(deal.value || 0);
          break;
        case "salespersonName":
          cellValue = deal.salespersonName || "";
          break;
        case "productCategory":
          cellValue = deal.productCategory || "";
          break;
        case "tags":
          cellValue = Array.isArray(deal.tags) ? deal.tags.join(", ") : "";
          break;
        case "areaHectares":
          cellValue = deal.areaHectares ? String(deal.areaHectares) : "";
          break;
        case "startDate":
          cellValue = deal.startDate || "";
          break;
        case "expectedCloseDate":
          cellValue = deal.expectedCloseDate || "";
          break;
        case "priority":
          cellValue = deal.priority || "";
          break;
        case "probability":
          cellValue = deal.probability !== undefined && deal.probability !== null ? String(deal.probability) : "";
          break;
        case "phone":
          cellValue = deal.phone || "";
          break;
        case "lastContact":
          cellValue = deal.lastContact || "";
          break;
        case "id":
          cellValue = deal.id || "";
          break;
        default:
          cellValue = "";
      }
      return escapeCsvCell(cellValue, delimiter);
    });
    rows.push(rowValues.join(delimiter));
  });

  return "\uFEFF" + rows.join("\r\n");
}

/**
 * Exporta todos os negócios atuais para CSV com inteligência semântica
 */
export function exportDealsToCsv(deals: CRMDeal[], delimiter: ";" | "," = ";"): string {
  return exportSmartCsv(deals, { delimiter });
}

/**
 * Parser robusto de CSV/TSV
 */
export function parseCsvContent(rawContent: string): { rows: string[][]; delimiter: string } {
  let content = rawContent.replace(/^\uFEFF/, "").trim();
  if (!content) return { rows: [], delimiter: ";" };

  const firstLine = content.split(/\r?\n/)[0] || "";
  let delimiter = ";";
  const semicolonCount = (firstLine.match(/;/g) || []).length;
  const commaCount = (firstLine.match(/,/g) || []).length;
  const tabCount = (firstLine.match(/\t/g) || []).length;

  if (tabCount > semicolonCount && tabCount > commaCount) {
    delimiter = "\t";
  } else if (commaCount > semicolonCount) {
    delimiter = ",";
  }

  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentCell = "";
  let inQuotes = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          currentCell += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        currentCell += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === delimiter) {
        currentRow.push(currentCell.trim());
        currentCell = "";
      } else if (char === "\r") {
        if (nextChar === "\n") {
          i++;
        }
        currentRow.push(currentCell.trim());
        rows.push(currentRow);
        currentRow = [];
        currentCell = "";
      } else if (char === "\n") {
        currentRow.push(currentCell.trim());
        rows.push(currentRow);
        currentRow = [];
        currentCell = "";
      } else {
        currentCell += char;
      }
    }
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    rows.push(currentRow);
  }

  return {
    rows: rows.filter((r) => r.some((cell) => cell.trim().length > 0)),
    delimiter,
  };
}

/**
 * Normaliza datas para YYYY-MM-DD
 */
export function normalizeDate(raw: string): string {
  if (!raw) return new Date().toISOString().split("T")[0];
  const cleaned = raw.trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(cleaned)) {
    return cleaned;
  }

  const brMatch = cleaned.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
  if (brMatch) {
    const day = brMatch[1].padStart(2, "0");
    const month = brMatch[2].padStart(2, "0");
    let year = brMatch[3];
    if (year.length === 2) {
      year = "20" + year;
    }
    return `${year}-${month}-${day}`;
  }

  return new Date().toISOString().split("T")[0];
}

/**
 * Normaliza números e valores monetários
 */
export function parseNumeric(val: unknown, fallback = 0): number {
  if (typeof val === "number" && !isNaN(val)) return val;
  if (!val) return fallback;
  const str = String(val).replace(/R\$/gi, "").replace(/\s/g, "").trim();

  if (str.includes(",") && str.includes(".")) {
    const cleaned = str.replace(/\./g, "").replace(",", ".");
    const num = parseFloat(cleaned);
    return isNaN(num) ? fallback : num;
  }
  if (str.includes(",")) {
    const num = parseFloat(str.replace(",", "."));
    return isNaN(num) ? fallback : num;
  }
  const num = parseFloat(str);
  return isNaN(num) ? fallback : num;
}

/**
 * Dicionário Semântico Inteligente com Sinônimos e Padrões de Conteúdo
 */
const SEMANTIC_PATTERNS: Record<CRMFieldKey, { keywords: string[]; contentRegex?: RegExp }> = {
  title: {
    keywords: [
      "titulo",
      "oportunidade",
      "deal",
      "negocio",
      "assunto",
      "nome_oportunidade",
      "descricao",
      "projeto",
      "contrato",
      "proposta",
      "objeto",
      "item",
      "demanda",
    ],
  },
  clientName: {
    keywords: [
      "cliente",
      "produtor",
      "lead",
      "nome",
      "contato",
      "empresa",
      "razaosocial",
      "pessoa",
      "agricultor",
      "proprietario",
      "fazendeiro",
      "comprador",
      "titular",
      "parceiro",
    ],
  },
  farmName: {
    keywords: ["fazenda", "propriedade", "gleba", "sitio", "estancia", "talhao", "imovel", "sede", "unidade"],
  },
  cityState: {
    keywords: ["cidade", "uf", "municipio", "estado", "cidadeuf", "polo", "regiao", "local", "localizacao", "praca"],
  },
  stage: {
    keywords: [
      "etapa",
      "funil",
      "pipeline",
      "fase",
      "status",
      "situacao",
      "estagio",
      "coluna",
      "posicao",
      "estado",
      "passo",
      "fluxo",
    ],
  },
  value: {
    keywords: [
      "valor",
      "preco",
      "total",
      "montante",
      "faturamento",
      "receita",
      "r$",
      "orcamento",
      "vlr",
      "quantia",
      "estimativa",
      "potencial",
    ],
    contentRegex: /^(R\$|\$|BRL)?\s*[\d\.,]{3,}/i,
  },
  salespersonName: {
    keywords: [
      "responsavel",
      "vendedor",
      "consultor",
      "atendente",
      "comercial",
      "rtv",
      "agronomo",
      "representante",
      "usuario",
      "owner",
      "dono",
      "gestor",
      "tecnico",
    ],
  },
  productCategory: {
    keywords: [
      "produto",
      "categoria",
      "cultura",
      "insumo",
      "servico",
      "tipo",
      "variedade",
      "safra",
      "segmento",
      "linha",
      "mercadoria",
    ],
  },
  tags: {
    keywords: ["tags", "tag", "marcadores", "etiquetas", "rotulos", "classificacao", "categorias", "segmentos"],
  },
  areaHectares: {
    keywords: ["area", "hectares", "ha", "tamanho", "hectare", "dimensao", "area_plantio", "areatotal"],
  },
  startDate: {
    keywords: ["datainicio", "inicio", "abertura", "data_abertura", "criado", "data_criacao", "cadastro", "entrada"],
    contentRegex: /^\d{1,4}[\/\-]\d{1,2}[\/\-]\d{2,4}/,
  },
  expectedCloseDate: {
    keywords: [
      "previsao",
      "fechamento",
      "previsao_fechamento",
      "prazo",
      "vencimento",
      "datafechamento",
      "encerramento",
      "fim",
    ],
    contentRegex: /^\d{1,4}[\/\-]\d{1,2}[\/\-]\d{2,4}/,
  },
  priority: {
    keywords: ["prioridade", "urgencia", "relevancia", "importancia", "temperatura", "nivel"],
  },
  probability: {
    keywords: ["probabilidade", "chance", "percentual", "sucesso", "prob", "prob_fechamento"],
    contentRegex: /^\d{1,3}%?$/,
  },
  phone: {
    keywords: ["telefone", "whatsapp", "celular", "whats", "fone", "tel", "numero", "zap", "contato_tel"],
    contentRegex: /^(\+?55\s?)?(\(?\d{2}\)?\s?)?9?\d{4}[-\s]?\d{4}$/,
  },
  lastContact: {
    keywords: ["ultimocontato", "contato", "obs", "observacoes", "observacao", "detalhes", "historico", "notas"],
  },
  id: {
    keywords: ["id", "codigo", "identificador", "uuid", "chave"],
  },
  ignore: {
    keywords: ["ignorar", "descartar"],
  },
};

/**
 * Normalizador de strings para matching semântico
 */
function cleanString(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

/**
 * Analisa a planilha adaptativamente:
 * Compreende colunas fora do padrão, detecta amostras, sugere o mapeamento semântico
 * e identifica todas as etapas de pipeline existentes no arquivo.
 */
export function analyzeSpreadsheetStructure(
  csvContent: string,
  existingColumns: CRMColumn[]
): SpreadsheetAnalysis | null {
  const { rows, delimiter } = parseCsvContent(csvContent);
  if (rows.length < 2) return null;

  const rawHeaders = rows[0];
  const dataRows = rows.slice(1);
  const totalRows = dataRows.length;

  const detectedColumns: DetectedColumn[] = [];
  const assignedFields = new Set<CRMFieldKey>();

  // Etapa 1: Calcular score para cada coluna da planilha do usuário
  rawHeaders.forEach((colName, colIdx) => {
    const normalizedHeader = cleanString(colName);

    // Amostras reais de dados das primeiras 5 linhas
    const sampleValues: string[] = [];
    for (let r = 0; r < Math.min(5, dataRows.length); r++) {
      const val = dataRows[r][colIdx];
      if (val && val.trim().length > 0) {
        sampleValues.push(val.trim());
      }
    }

    let bestField: CRMFieldKey = "ignore";
    let bestScore = 0;

    // Avalia cada campo do CRM
    (Object.keys(SEMANTIC_PATTERNS) as CRMFieldKey[]).forEach((fieldKey) => {
      if (fieldKey === "ignore") return;
      const pattern = SEMANTIC_PATTERNS[fieldKey];
      let score = 0;

      // 1. Match pelo cabeçalho
      pattern.keywords.forEach((keyword) => {
        const cleanKw = cleanString(keyword);
        if (normalizedHeader === cleanKw) {
          score += 100;
        } else if (normalizedHeader.startsWith(cleanKw) || normalizedHeader.endsWith(cleanKw)) {
          score += 70;
        } else if (normalizedHeader.includes(cleanKw)) {
          score += 40;
        }
      });

      // 2. Heurística de conteúdo (se houver amostras)
      if (pattern.contentRegex && sampleValues.length > 0) {
        let regexMatches = 0;
        sampleValues.forEach((sample) => {
          if (pattern.contentRegex!.test(sample)) {
            regexMatches++;
          }
        });
        const matchRatio = regexMatches / sampleValues.length;
        if (matchRatio >= 0.5) {
          score += 35 * matchRatio;
        }
      }

      // Casos específicos de conteúdo
      if (fieldKey === "value" && sampleValues.some((s) => /R\$|\$|reais/i.test(s))) {
        score += 30;
      }
      if (fieldKey === "phone" && sampleValues.some((s) => s.replace(/\D/g, "").length >= 10)) {
        score += 30;
      }

      // Penalidade se já foi atribuído com pontuação alta para outro campo
      if (assignedFields.has(fieldKey)) {
        score -= 20;
      }

      if (score > bestScore) {
        bestScore = score;
        bestField = fieldKey;
      }
    });

    let confidence: "alta" | "media" | "baixa" = "baixa";
    if (bestScore >= 80) confidence = "alta";
    else if (bestScore >= 40) confidence = "media";

    // Se o score for muito baixo e já tivermos os campos essenciais, deixa como ignore
    if (bestScore < 25) {
      bestField = "ignore";
    } else {
      assignedFields.add(bestField);
    }

    detectedColumns.push({
      fileColumnIndex: colIdx,
      fileColumnName: colName || `Coluna ${colIdx + 1}`,
      suggestedField: bestField,
      confidence,
      confidenceScore: bestScore,
      sampleValues,
    });
  });

  // Garantir que temos ao menos Título ou Cliente
  const hasTitle = detectedColumns.some((c) => c.suggestedField === "title");
  const hasClient = detectedColumns.some((c) => c.suggestedField === "clientName");
  if (!hasTitle && !hasClient && detectedColumns.length > 0) {
    // Atribui a primeira coluna textual como cliente/título
    detectedColumns[0].suggestedField = "title";
    detectedColumns[0].confidence = "media";
  }

  // Etapa 2: Identificar Etapas da Pipeline na planilha
  const stageCol = detectedColumns.find((c) => c.suggestedField === "stage");
  const stagesCountMap = new Map<string, number>();

  if (stageCol !== undefined) {
    dataRows.forEach((row) => {
      const val = row[stageCol.fileColumnIndex]?.trim();
      if (val) {
        stagesCountMap.set(val, (stagesCountMap.get(val) || 0) + 1);
      }
    });
  }

  // Mapear cada etapa encontrada para colunas existentes ou novas
  const stagesDetected: StageMapping[] = [];
  const existingKeysSet = new Set(existingColumns.map((c) => cleanString(c.key)));
  const existingLabelsSet = new Set(existingColumns.map((c) => cleanString(c.label)));

  stagesCountMap.forEach((count, rawStageName) => {
    const cleanRaw = cleanString(rawStageName);
    let matchedKey: string | null = null;

    // Busca exata ou aproximada
    const matchedCol = existingColumns.find(
      (c) => cleanString(c.key) === cleanRaw || cleanString(c.label) === cleanRaw
    );

    if (matchedCol) {
      matchedKey = matchedCol.key;
    } else {
      // Dicionário de equivalências comuns
      if (/novo|prospect|aberto|lead/i.test(rawStageName)) {
        const found = existingColumns.find((c) => /cliente|novo|lead/i.test(c.key));
        if (found) matchedKey = found.key;
      } else if (/ganho|vend|fechado|faturad|aprovad/i.test(rawStageName)) {
        const found = existingColumns.find((c) => /venda|ganho/i.test(c.key));
        if (found) matchedKey = found.key;
      } else if (/perdid|cancelad|concluido|arquivad/i.test(rawStageName)) {
        const found = existingColumns.find((c) => /finalizado|perdid/i.test(c.key));
        if (found) matchedKey = found.key;
      }
    }

    stagesDetected.push({
      rawStageName,
      mappedStageKey: matchedKey || rawStageName,
      isNewColumn: !matchedCol,
      count,
    });
  });

  return {
    rawHeaders,
    totalRows,
    detectedColumns,
    stagesDetected,
    allRows: rows,
    delimiter,
  };
}

/**
 * Cores automáticas para criação de novas colunas
 */
export const PALETTE_OPTIONS = [
  { dot: "bg-emerald-500", bar: "bg-emerald-500", badgeBg: "bg-emerald-50", badgeText: "text-emerald-700" },
  { dot: "bg-blue-500", bar: "bg-blue-500", badgeBg: "bg-blue-50", badgeText: "text-blue-700" },
  { dot: "bg-violet-500", bar: "bg-violet-500", badgeBg: "bg-violet-50", badgeText: "text-violet-700" },
  { dot: "bg-amber-500", bar: "bg-amber-500", badgeBg: "bg-amber-50", badgeText: "text-amber-700" },
  { dot: "bg-rose-500", bar: "bg-rose-500", badgeBg: "bg-rose-50", badgeText: "text-rose-700" },
  { dot: "bg-cyan-500", bar: "bg-cyan-500", badgeBg: "bg-cyan-50", badgeText: "text-cyan-700" },
  { dot: "bg-teal-500", bar: "bg-teal-500", badgeBg: "bg-teal-50", badgeText: "text-teal-700" },
  { dot: "bg-indigo-500", bar: "bg-indigo-500", badgeBg: "bg-indigo-50", badgeText: "text-indigo-700" },
];

/**
 * Executa a importação adaptativa com base no mapeamento confirmado pelo usuário:
 * Cria colunas na pipeline se necessário, cataloga tags e seta todas as informações.
 */
export function executeAdaptiveImport(
  analysis: SpreadsheetAnalysis,
  userFieldMapping: Record<number, CRMFieldKey>,
  userStageMapping: Record<string, string>,
  existingColumns: CRMColumn[],
  existingTags: CRMTag[]
): ImportResult {
  const dataRows = analysis.allRows.slice(1);
  const importedDeals: CRMDeal[] = [];
  const newColumnsMap = new Map<string, CRMColumn>();
  const newTagsMap = new Map<string, CRMTag>();

  const existingColKeys = new Set(existingColumns.map((c) => c.key.toLowerCase().trim()));
  const existingTagNames = new Set(existingTags.map((t) => t.name.toLowerCase().trim()));

  dataRows.forEach((row, rowIndex) => {
    if (!row.some((cell) => cell.trim().length > 0)) return;

    // Extrai valores pelos índices mapeados
    const getMappedVal = (targetField: CRMFieldKey): string => {
      for (const [colIdxStr, field] of Object.entries(userFieldMapping)) {
        if (field === targetField) {
          const idx = parseInt(colIdxStr, 10);
          if (row[idx] !== undefined) {
            return row[idx].trim();
          }
        }
      }
      return "";
    };

    const title =
      getMappedVal("title") ||
      getMappedVal("clientName") ||
      `Oportunidade ${rowIndex + 1}`;
    const clientName = getMappedVal("clientName") || title;
    const farmName = getMappedVal("farmName") || (clientName.toLowerCase().includes("fazenda") ? clientName : "");
    const cityState = getMappedVal("cityState") || "Região Produtora";

    // Resolução da Etapa na Pipeline
    const rawStage = getMappedVal("stage");
    let resolvedStage = existingColumns[0]?.key || "Clientes";

    if (rawStage) {
      // Verifica mapeamento customizado do usuário
      const customMapped = userStageMapping[rawStage];
      const targetStage = customMapped || rawStage;

      // Se a etapa corresponde a uma existente
      const matchedExisting = existingColumns.find(
        (c) => c.key.toLowerCase().trim() === targetStage.toLowerCase().trim() ||
               c.label.toLowerCase().trim() === targetStage.toLowerCase().trim()
      );

      if (matchedExisting) {
        resolvedStage = matchedExisting.key;
      } else {
        // Cria nova coluna na pipeline de forma adaptativa
        const lowerTarget = targetStage.toLowerCase().trim();
        if (!newColumnsMap.has(lowerTarget)) {
          const palette =
            PALETTE_OPTIONS[
              (existingColumns.length + newColumnsMap.size) % PALETTE_OPTIONS.length
            ];
          const newCol: CRMColumn = {
            id: `col-adapt-${Date.now()}-${newColumnsMap.size}`,
            key: targetStage,
            label: targetStage,
            dotColor: palette.dot,
            barColor: palette.bar,
            badgeBg: palette.badgeBg,
            badgeText: palette.badgeText,
          };
          newColumnsMap.set(lowerTarget, newCol);
        }
        resolvedStage = targetStage;
      }
    }

    // Processamento Inteligente de Tags
    const tagsRaw = getMappedVal("tags");
    const itemTags: string[] = [];

    if (tagsRaw) {
      const splitTags = tagsRaw.split(/[,;|]/).map((t) => t.trim()).filter(Boolean);
      splitTags.forEach((tagName) => {
        itemTags.push(tagName);
        const lowerTag = tagName.toLowerCase();
        if (!existingTagNames.has(lowerTag) && !newTagsMap.has(lowerTag)) {
          const colors = ["emerald", "sky", "amber", "purple", "rose", "indigo", "teal"];
          const selectedColor = colors[(existingTags.length + newTagsMap.size) % colors.length];
          const newTag: CRMTag = {
            id: `tag-adapt-${Date.now()}-${newTagsMap.size}`,
            name: tagName,
            color: selectedColor,
            bgClass: `bg-${selectedColor}-50`,
            textClass: `text-${selectedColor}-700`,
            borderClass: `border-${selectedColor}-200`,
          };
          newTagsMap.set(lowerTag, newTag);
        }
      });
    }

    if (itemTags.length === 0) {
      itemTags.push("Importado");
    }

    const value = parseNumeric(getMappedVal("value"), 150000);
    const areaHectares = parseNumeric(getMappedVal("areaHectares"), 500);
    const probability = Math.min(100, Math.max(0, parseNumeric(getMappedVal("probability"), 50)));

    const rawPriority = getMappedVal("priority").toLowerCase();
    let priority: "alta" | "média" | "baixa" = "média";
    if (rawPriority.includes("alt") || rawPriority.includes("urg")) priority = "alta";
    else if (rawPriority.includes("baix")) priority = "baixa";
    else priority = "média";

    const startDate = normalizeDate(getMappedVal("startDate"));
    const expectedCloseDate = normalizeDate(getMappedVal("expectedCloseDate"));
    const id = getMappedVal("id") || `deal-adapt-${Date.now()}-${rowIndex + 1}`;

    const deal: CRMDeal = {
      id,
      title,
      clientName,
      farmName,
      cityState,
      stage: resolvedStage,
      value,
      salespersonName: getMappedVal("salespersonName") || "Equipe Comercial",
      productCategory: getMappedVal("productCategory") || "Barter & Insumos",
      tags: itemTags,
      areaHectares,
      startDate,
      expectedCloseDate,
      priority,
      probability,
      phone: getMappedVal("phone") || "+55 66 99988-7711",
      lastContact: getMappedVal("lastContact") || "Importado via planilha",
    };

    importedDeals.push(deal);
  });

  return {
    deals: importedDeals,
    newColumns: Array.from(newColumnsMap.values()),
    newTags: Array.from(newTagsMap.values()),
    stats: {
      totalRows: dataRows.length,
      validDeals: importedDeals.length,
      newStagesCreated: Array.from(newColumnsMap.values()).map((c) => c.label),
      newTagsCreated: Array.from(newTagsMap.values()).map((t) => t.name),
    },
    errors: [],
  };
}

/**
 * Legado compatível: processa CSV com detecção automática direta
 */
export function processImportCsv(
  csvContent: string,
  existingColumns: CRMColumn[],
  existingTags: CRMTag[]
): ImportResult {
  const analysis = analyzeSpreadsheetStructure(csvContent, existingColumns);
  if (!analysis) {
    return {
      deals: [],
      newColumns: [],
      newTags: [],
      stats: { totalRows: 0, validDeals: 0, newStagesCreated: [], newTagsCreated: [] },
      errors: ["Planilha vazia ou com formato não suportado."],
    };
  }

  const fieldMapping: Record<number, CRMFieldKey> = {};
  analysis.detectedColumns.forEach((c) => {
    fieldMapping[c.fileColumnIndex] = c.suggestedField;
  });

  const stageMapping: Record<string, string> = {};
  analysis.stagesDetected.forEach((s) => {
    stageMapping[s.rawStageName] = s.mappedStageKey;
  });

  return executeAdaptiveImport(analysis, fieldMapping, stageMapping, existingColumns, existingTags);
}

/**
 * Gera arquivo de backup JSON estruturado
 */
export function exportFullBackupJson(
  deals: CRMDeal[],
  columns: CRMColumn[],
  tags: CRMTag[]
): string {
  const payload = {
    version: "1.0.0",
    exportedAt: new Date().toISOString(),
    system: "Ceruti Agro CRM",
    columns,
    tags,
    deals,
  };
  return JSON.stringify(payload, null, 2);
}

/**
 * Dispara o download no navegador
 */
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
