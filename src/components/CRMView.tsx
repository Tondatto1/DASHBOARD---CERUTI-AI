import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Kanban as KanbanIcon,
  List,
  CalendarRange,
  Search,
  Plus,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Briefcase,
  User,
  MapPin,
  Clock,
  Phone,
  CheckCircle2,
  RefreshCw,
  X,
  Layers,
  Sparkles,
  ShieldCheck,
  Building2,
  Calendar,
  Check,
  Link2,
  Unlink,
  ChevronRight,
  ChevronLeft,
  Filter,
  ArrowUpRight,
  Flame,
  Wheat,
  Share2,
  Activity,
  Zap,
  Database,
  Settings2,
  ExternalLink,
  Lock,
  Server,
  Sliders,
  Cpu,
  GripVertical,
  Move,
  ArrowDown,
  Pencil,
  Edit3,
  Trash2,
  Save,
  Tag,
  Percent,
  UserCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CRMDeal, CRMStage, CRMIntegrationConfig } from "../types";

const STAGES: {
  key: CRMStage;
  label: string;
  dotColor: string;
  barColor: string;
  badgeBg: string;
  badgeText: string;
}[] = [
  { key: "Clientes", label: "Clientes", dotColor: "bg-slate-400", barColor: "from-slate-400 to-slate-500", badgeBg: "bg-slate-100", badgeText: "text-slate-700" },
  { key: "Pré-Qualificados", label: "Pré-Qualificados", dotColor: "bg-sky-500", barColor: "from-sky-400 to-blue-500", badgeBg: "bg-sky-50", badgeText: "text-sky-700" },
  { key: "Qualificados", label: "Qualificados", dotColor: "bg-cyan-500", barColor: "from-cyan-400 to-teal-500", badgeBg: "bg-cyan-50", badgeText: "text-cyan-700" },
  { key: "Negociação", label: "Negociação", dotColor: "bg-amber-500", barColor: "from-amber-400 to-orange-500", badgeBg: "bg-amber-50", badgeText: "text-amber-700" },
  { key: "Resgates", label: "Resgates", dotColor: "bg-purple-500", barColor: "from-purple-400 to-indigo-500", badgeBg: "bg-purple-50", badgeText: "text-purple-700" },
  { key: "Vendas", label: "Vendas", dotColor: "bg-[#00a83e]", barColor: "from-emerald-400 to-[#00a83e]", badgeBg: "bg-emerald-50", badgeText: "text-emerald-700" },
  { key: "Recorrência", label: "Recorrência", dotColor: "bg-teal-500", barColor: "from-teal-400 to-emerald-600", badgeBg: "bg-teal-50", badgeText: "text-teal-700" },
  { key: "Finalizados", label: "Finalizados", dotColor: "bg-zinc-600", barColor: "from-zinc-500 to-zinc-700", badgeBg: "bg-zinc-100", badgeText: "text-zinc-700" },
];

interface ProviderMeta {
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

const PROVIDER_METADATA: Record<string, ProviderMeta> = {
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
      "Follow-ups Automáticos de Vendedores",
      "Alertas Imediatos de Safra e Plantio",
    ],
    protocol: "Webhooks REST v3 • Push Notifications",
    latency: "22ms",
  },
};

const containerMotionVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardItemMotionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
};

const INITIAL_DEALS: CRMDeal[] = [
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
    areaHectares: 850,
    startDate: "2026-07-25",
    expectedCloseDate: "2026-09-15",
    priority: "média",
    lastContact: "Ontem, 11:20",
    probability: 90,
    phone: "+55 (45) 99882-9988",
  },
  {
    id: "deal-5",
    title: "Recuperação de Produtor Inativo",
    clientName: "José Alberto Rezende",
    farmName: "Fazenda Morrinhos",
    cityState: "Jataí - GO",
    stage: "Resgates",
    value: 140000,
    salespersonName: "Maria Oliveira",
    productCategory: "Inoculantes & Adjuvantes",
    areaHectares: 900,
    startDate: "2026-08-12",
    expectedCloseDate: "2026-09-30",
    priority: "alta",
    lastContact: "Hoje, 11:15",
    probability: 45,
    phone: "+55 (64) 99654-7890",
  },
  {
    id: "deal-6",
    title: "Lead WhatsApp - Defensivos Algodão",
    clientName: "Lucas Siqueira Lima",
    farmName: "Sítio Vista Alegre",
    cityState: "Cristalina - GO",
    stage: "Pré-Qualificados",
    value: 68000,
    salespersonName: "Carlos Eduardo",
    productCategory: "Inseticidas",
    areaHectares: 400,
    startDate: "2026-08-25",
    expectedCloseDate: "2026-10-25",
    priority: "média",
    lastContact: "Há 3 horas",
    probability: 30,
    phone: "+55 (61) 98711-2233",
  },
  {
    id: "deal-7",
    title: "Produtor Cadastrado na Base",
    clientName: "Antônio Carlos Diniz",
    farmName: "Fazenda Esperança",
    cityState: "L.E.M. - BA",
    stage: "Clientes",
    value: 320000,
    salespersonName: "João Silva",
    productCategory: "Sementes Algodão",
    areaHectares: 1800,
    startDate: "2026-08-28",
    expectedCloseDate: "2026-11-15",
    priority: "baixa",
    lastContact: "Sem contato recente",
    probability: 20,
    phone: "+55 (77) 99933-4455",
  },
  {
    id: "deal-8",
    title: "Contrato Barter Entregue e Faturado",
    clientName: "Cláudio Mendonça",
    farmName: "Agropecuária Paineiras",
    cityState: "Dourados - MS",
    stage: "Finalizados",
    value: 520000,
    salespersonName: "Maria Oliveira",
    productCategory: "Pacote Completo Soja",
    areaHectares: 3100,
    startDate: "2026-06-15",
    expectedCloseDate: "2026-08-20",
    priority: "alta",
    lastContact: "Concluído",
    probability: 100,
    phone: "+55 (67) 99912-8877",
  },
];

const INITIAL_INTEGRATIONS: CRMIntegrationConfig[] = [
  {
    id: "integ-clover",
    name: "Clover CRM (Aliare)",
    providerCode: "clover",
    badge: "Aliare Agro",
    popularInAgro: "Mais utilizado em revendas e distribuidoras agrícolas do Brasil",
    description: "Gestão comercial de insumos, pedidos de venda, operações de barter e crédito rural integrado diretamente ao ERP Aliare.",
    status: "connected",
    connectedAccount: "revenda_ceruti_agro@clovercrm.com.br",
    apiUrl: "https://api.clovercrm.aliare.com.br/v2",
    lastSync: "Há 8 minutos",
    syncedDealsCount: 148,
    syncFrequency: "A cada 15 min",
  },
  {
    id: "integ-siagri",
    name: "CRM Siagri (Agrointelli)",
    providerCode: "siagri",
    badge: "Siagri / Agrointelli",
    popularInAgro: "Forte aderência em cooperativas e revendedores de grãos e químicos",
    description: "Sincronização de visitas técnicas de campo de RTVs, mapeamento de talhões e propostas comerciais integradas.",
    status: "disconnected",
    apiUrl: "https://agrointelli.siagri.com.br/api/integrations",
    syncFrequency: "A cada 30 min",
  },
  {
    id: "integ-salesforce",
    name: "Salesforce (Sales Cloud Agro)",
    providerCode: "salesforce",
    badge: "Salesforce Enterprise",
    popularInAgro: "Utilizado por multinacionais de sementes, maquinários e trading",
    description: "Sincronização bidirecional de Contas Agrícolas, Oportunidades por safra e disparo de automações de vendas para WhatsApp.",
    status: "disconnected",
    apiUrl: "https://ceruti-agro.my.salesforce.com/services/data/v58.0",
    syncFrequency: "Tempo Real (Webhook)",
  },
  {
    id: "integ-totvs",
    name: "TOTVS CRM (Agrotitan - Viasoft)",
    providerCode: "totvs",
    badge: "TOTVS Agro & Viasoft",
    popularInAgro: "Presente nas maiores cerealistas, armazéns e revendas do país",
    description: "Conexão com gestão de saldos de grãos, cotações de balcão e pedidos de defensivos diretamente integrados ao ecossistema Agrotitan.",
    status: "disconnected",
    apiUrl: "https://api.agrotitan.viasoft.com.br/crm",
    syncFrequency: "A cada 1 hora",
  },
  {
    id: "integ-agendor",
    name: "Agendor (Hubspot)",
    providerCode: "agendor",
    badge: "Agendor / HubSpot Agro",
    popularInAgro: "Ideal para equipes comerciais ágeis e consultores de campo",
    description: "Gestão simples de funil comercial com gravação de contatos do WhatsApp, histórico de conversas e lembretes automáticos para vendedores.",
    status: "connected",
    connectedAccount: "comercial@ceruti.com.br",
    apiUrl: "https://api.agendor.com.br/v3",
    lastSync: "Hoje, 13:10",
    syncedDealsCount: 72,
    syncFrequency: "A cada 5 min",
  },
];

export function CRMView() {
  const [activeSubPage, setActiveSubPage] = useState<"dashboard" | "integrar">("dashboard");
  const [viewMode, setViewMode] = useState<"kanban" | "lista" | "gantt">("kanban");
  const [deals, setDeals] = useState<CRMDeal[]>(INITIAL_DEALS);
  const [integrations, setIntegrations] = useState<CRMIntegrationConfig[]>(INITIAL_INTEGRATIONS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSalesperson, setSelectedSalesperson] = useState("todos");

  // Drag and Drop de Cards entre colunas
  const [draggedDealId, setDraggedDealId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<CRMStage | null>(null);

  // Pan / Drag to scroll da tela (correr em diagonal e laterais segurando na tela)
  const kanbanScrollRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const panStateRef = useRef<{
    isDown: boolean;
    startX: number;
    startY: number;
    scrollLeft: number;
    scrollTop: number;
    hasMoved: boolean;
  }>({
    isDown: false,
    startX: 0,
    startY: 0,
    scrollLeft: 0,
    scrollTop: 0,
    hasMoved: false,
  });

  // Listener global para liberação suave do Pan
  useEffect(() => {
    const handleGlobalMouseUp = () => {
      if (panStateRef.current.isDown) {
        panStateRef.current.isDown = false;
        setIsPanning(false);
      }
    };
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, []);

  // Modais e Detalhes
  const [isNewDealModalOpen, setIsNewDealModalOpen] = useState(false);
  const [selectedDealForDetail, setSelectedDealForDetail] = useState<CRMDeal | null>(null);
  const [selectedIntegForModal, setSelectedIntegForModal] = useState<CRMIntegrationConfig | null>(null);
  const [integApiKey, setIntegApiKey] = useState("");
  const [integAccount, setIntegAccount] = useState("");
  const [isTestingInteg, setIsTestingInteg] = useState(false);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  // Estados complementares de Integração Agro
  const [integFilter, setIntegFilter] = useState<"todos" | "conectados" | "disponiveis">("todos");
  const [isSyncingAll, setIsSyncingAll] = useState(false);

  // Estado de Edição de Oportunidades / Cards
  const [isEditingDeal, setIsEditingDeal] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editClientName, setEditClientName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editFarmName, setEditFarmName] = useState("");
  const [editCityState, setEditCityState] = useState("");
  const [editAreaHectares, setEditAreaHectares] = useState("");
  const [editValue, setEditValue] = useState("");
  const [editSalespersonName, setEditSalespersonName] = useState("João Silva");
  const [editExpectedCloseDate, setEditExpectedCloseDate] = useState("");
  const [editStage, setEditStage] = useState<CRMStage>("Clientes");
  const [editProbability, setEditProbability] = useState(50);
  const [editPriority, setEditPriority] = useState<"alta" | "média" | "baixa">("média");

  // Form novo negócio
  const [newTitle, setNewTitle] = useState("");
  const [newClient, setNewClient] = useState("");
  const [newFarm, setNewFarm] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newStage, setNewStage] = useState<CRMStage>("Clientes");
  const [newSalesperson, setNewSalesperson] = useState("João Silva");
  const [newCategory, setNewCategory] = useState("Fungicidas & Adubos");
  const [newExpectedDate, setNewExpectedDate] = useState("2026-10-15");

  const showToast = (msg: string) => {
    setFeedbackToast(msg);
    setTimeout(() => setFeedbackToast(null), 3000);
  };

  // Filtragem dos negócios
  const filteredDeals = useMemo(() => {
    return deals.filter((deal) => {
      const matchesSearch =
        deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        deal.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (deal.farmName && deal.farmName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        deal.productCategory.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSalesperson =
        selectedSalesperson === "todos" || deal.salespersonName === selectedSalesperson;

      return matchesSearch && matchesSalesperson;
    });
  }, [deals, searchQuery, selectedSalesperson]);

  const totalPipeline = useMemo(() => {
    return filteredDeals.reduce((acc, cur) => acc + cur.value, 0);
  }, [filteredDeals]);

  const totalWon = useMemo(() => {
    return deals
      .filter((d) => d.stage === "Vendas" || d.stage === "Finalizados")
      .reduce((acc, cur) => acc + cur.value, 0);
  }, [deals]);

  const formatBRL = (val: number) => {
    return val.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });
  };

  // Pan / Arrastar a tela para correr em diagonal e lados
  const handleKanbanMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; // apenas clique esquerdo
    const target = e.target as HTMLElement;

    // Não iniciar pan se clicar em botões, inputs ou no próprio card arrastável
    if (
      target.closest("button, input, select, textarea, a, [data-no-pan='true'], [data-card-item='true']")
    ) {
      return;
    }

    if (kanbanScrollRef.current) {
      panStateRef.current = {
        isDown: true,
        startX: e.clientX,
        startY: e.clientY,
        scrollLeft: kanbanScrollRef.current.scrollLeft,
        scrollTop: kanbanScrollRef.current.scrollTop,
        hasMoved: false,
      };
      setIsPanning(true);
    }
  };

  const handleKanbanMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!panStateRef.current.isDown || !kanbanScrollRef.current) return;

    const dx = e.clientX - panStateRef.current.startX;
    const dy = e.clientY - panStateRef.current.startY;

    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      panStateRef.current.hasMoved = true;
      kanbanScrollRef.current.scrollLeft = panStateRef.current.scrollLeft - dx;
      kanbanScrollRef.current.scrollTop = panStateRef.current.scrollTop - dy;
    }
  };

  const handleKanbanMouseUp = () => {
    if (panStateRef.current.isDown) {
      panStateRef.current.isDown = false;
      setIsPanning(false);
    }
  };

  const handleScrollKanban = (direction: "left" | "right") => {
    if (kanbanScrollRef.current) {
      const scrollAmount = 450;
      kanbanScrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const dragJustEndedRef = useRef(false);

  // Drag and Drop de Cards para onde desejar
  const handleCardDragStart = (e: React.DragEvent, deal: CRMDeal) => {
    dragJustEndedRef.current = false;
    panStateRef.current.isDown = false;
    setIsPanning(false);
    e.dataTransfer.setData("text/plain", deal.id);
    e.dataTransfer.effectAllowed = "move";
    setDraggedDealId(deal.id);
  };

  const handleCardDragEnd = () => {
    setDraggedDealId(null);
    setDragOverStage(null);
    dragJustEndedRef.current = true;
    setTimeout(() => {
      dragJustEndedRef.current = false;
    }, 150);
  };

  const handleColumnDragOver = (e: React.DragEvent, stageKey: CRMStage) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverStage !== stageKey) {
      setDragOverStage(stageKey);
    }
  };

  const handleColumnDrop = (e: React.DragEvent, targetStage: CRMStage) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData("text/plain") || draggedDealId;
    if (dealId) {
      const targetDeal = deals.find((d) => d.id === dealId);
      if (targetDeal) {
        if (targetDeal.stage !== targetStage) {
          setDeals((prev) =>
            prev.map((d) => (d.id === dealId ? { ...d, stage: targetStage } : d))
          );
          if (selectedDealForDetail && selectedDealForDetail.id === dealId) {
            setSelectedDealForDetail({ ...selectedDealForDetail, stage: targetStage });
          }
          showToast(`"${targetDeal.title}" movido para ${targetStage}`);
        }
      }
    }
    setDraggedDealId(null);
    setDragOverStage(null);
  };

  // Avançar estágio rápido
  const handleAdvanceStage = (dealId: string) => {
    const current = deals.find((d) => d.id === dealId);
    if (!current) return;
    const currentIndex = STAGES.findIndex((s) => s.key === current.stage);
    if (currentIndex < STAGES.length - 1) {
      const nextStage = STAGES[currentIndex + 1].key;
      setDeals(deals.map((d) => (d.id === dealId ? { ...d, stage: nextStage } : d)));
      showToast(`Avançado para: ${nextStage}`);
    }
  };

  const handleSetStage = (dealId: string, stage: CRMStage) => {
    setDeals(deals.map((d) => (d.id === dealId ? { ...d, stage } : d)));
    if (selectedDealForDetail && selectedDealForDetail.id === dealId) {
      setSelectedDealForDetail({ ...selectedDealForDetail, stage });
    }
    showToast(`Oportunidade movida para: ${stage}`);
  };

  const openDealDetail = (deal: CRMDeal) => {
    setSelectedDealForDetail(deal);
    setEditTitle(deal.title);
    setEditCategory(deal.productCategory || "Insumos Agrícolas");
    setEditClientName(deal.clientName);
    setEditPhone(deal.phone || "+55 (64) 99999-1122");
    setEditFarmName(deal.farmName || "");
    setEditCityState(deal.cityState || "");
    setEditAreaHectares(deal.areaHectares !== undefined ? String(deal.areaHectares) : "");
    setEditValue(String(deal.value));
    setEditSalespersonName(deal.salespersonName);
    setEditExpectedCloseDate(deal.expectedCloseDate || new Date().toISOString().split("T")[0]);
    setEditStage(deal.stage);
    setEditProbability(deal.probability || 50);
    setEditPriority(deal.priority || "média");
    setIsEditingDeal(false);
  };

  const handleStartEditDeal = () => {
    if (!selectedDealForDetail) return;
    setEditTitle(selectedDealForDetail.title);
    setEditCategory(selectedDealForDetail.productCategory || "Insumos Agrícolas");
    setEditClientName(selectedDealForDetail.clientName);
    setEditPhone(selectedDealForDetail.phone || "+55 (64) 99999-1122");
    setEditFarmName(selectedDealForDetail.farmName || "");
    setEditCityState(selectedDealForDetail.cityState || "");
    setEditAreaHectares(selectedDealForDetail.areaHectares !== undefined ? String(selectedDealForDetail.areaHectares) : "");
    setEditValue(String(selectedDealForDetail.value));
    setEditSalespersonName(selectedDealForDetail.salespersonName);
    setEditExpectedCloseDate(selectedDealForDetail.expectedCloseDate || new Date().toISOString().split("T")[0]);
    setEditStage(selectedDealForDetail.stage);
    setEditProbability(selectedDealForDetail.probability || 50);
    setEditPriority(selectedDealForDetail.priority || "média");
    setIsEditingDeal(true);
  };

  const handleSaveEditDeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDealForDetail) return;
    if (!editTitle.trim() || !editClientName.trim()) {
      showToast("Título e Nome do Produtor são obrigatórios.");
      return;
    }

    const parsedValue = Number(String(editValue).replace(/\D/g, "")) || selectedDealForDetail.value;
    const parsedArea = editAreaHectares ? Number(String(editAreaHectares).replace(/\D/g, "")) : undefined;

    const updatedDeal: CRMDeal = {
      ...selectedDealForDetail,
      title: editTitle.trim(),
      clientName: editClientName.trim(),
      farmName: editFarmName.trim() || undefined,
      cityState: editCityState.trim() || undefined,
      areaHectares: parsedArea,
      stage: editStage,
      value: parsedValue,
      salespersonName: editSalespersonName,
      productCategory: editCategory.trim() || "Insumos Agrícolas",
      expectedCloseDate: editExpectedCloseDate || selectedDealForDetail.expectedCloseDate,
      priority: editPriority,
      probability: Math.min(100, Math.max(0, Number(editProbability) || 50)),
      phone: editPhone.trim() || "+55 (64) 99999-1122",
    };

    setDeals((prev) => prev.map((d) => (d.id === updatedDeal.id ? updatedDeal : d)));
    setSelectedDealForDetail(updatedDeal);
    setIsEditingDeal(false);
    showToast(`Oportunidade "${updatedDeal.title}" atualizada com sucesso!`);
  };

  const handleDeleteDeal = (dealId: string) => {
    setDeals((prev) => prev.filter((d) => d.id !== dealId));
    setSelectedDealForDetail(null);
    setIsEditingDeal(false);
    showToast("Oportunidade removida do CRM com sucesso.");
  };

  const handleCreateDealSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newClient.trim()) return;

    const deal: CRMDeal = {
      id: `deal-${Date.now()}`,
      title: newTitle,
      clientName: newClient,
      farmName: newFarm || "Fazenda Modelo",
      cityState: newCity || "Região Produtora",
      stage: newStage,
      value: Number(newValue.replace(/\D/g, "")) || 100000,
      salespersonName: newSalesperson,
      productCategory: newCategory,
      startDate: new Date().toISOString().split("T")[0],
      expectedCloseDate: newExpectedDate,
      priority: "média",
      lastContact: "Hoje, " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      probability: 50,
      phone: "+55 (64) 99999-1122",
    };

    setDeals([deal, ...deals]);
    setIsNewDealModalOpen(false);
    showToast(`Negócio "${newTitle}" registrado!`);
    setNewTitle("");
    setNewClient("");
    setNewFarm("");
    setNewCity("");
    setNewValue("");
  };

  const handleSaveIntegration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIntegForModal) return;

    setIsTestingInteg(true);
    setTimeout(() => {
      setIntegrations(
        integrations.map((item) =>
          item.id === selectedIntegForModal.id
            ? {
                ...item,
                status: "connected",
                connectedAccount: integAccount || `${item.providerCode}_agro@empresa.com.br`,
                lastSync: "Agora mesmo",
                syncedDealsCount: (item.syncedDealsCount || 45) + 8,
              }
            : item
        )
      );
      setIsTestingInteg(false);
      showToast(`Conexão com ${selectedIntegForModal.name} ativada!`);
      setSelectedIntegForModal(null);
    }, 1100);
  };

  const handleToggleIntegration = (integ: CRMIntegrationConfig) => {
    if (integ.status === "connected") {
      setIntegrations(
        integrations.map((i) =>
          i.id === integ.id ? { ...i, status: "disconnected", connectedAccount: undefined } : i
        )
      );
      showToast(`${integ.name} desconectado.`);
    } else {
      setSelectedIntegForModal(integ);
      setIntegAccount(integ.connectedAccount || "");
      setIntegApiKey("");
    }
  };

  const handleOpenConfigModal = (integ: CRMIntegrationConfig) => {
    setSelectedIntegForModal(integ);
    setIntegAccount(integ.connectedAccount || "");
    setIntegApiKey("••••••••••••••••••••");
  };

  const handleSyncIntegration = (integ: CRMIntegrationConfig) => {
    setIntegrations(
      integrations.map((i) => (i.id === integ.id ? { ...i, status: "syncing" } : i))
    );
    setTimeout(() => {
      setIntegrations(
        integrations.map((i) =>
          i.id === integ.id
            ? {
                ...i,
                status: "connected",
                lastSync: "Agora mesmo",
                syncedDealsCount: (i.syncedDealsCount || 50) + 3,
              }
            : i
        )
      );
      showToast(`Sincronização com ${integ.name} concluída!`);
    }, 900);
  };

  const connectedIntegrations = useMemo(() => {
    return integrations.filter((i) => i.status === "connected");
  }, [integrations]);

  const totalSyncedDeals = useMemo(() => {
    return integrations.reduce((acc, cur) => acc + (cur.syncedDealsCount || 0), 0);
  }, [integrations]);

  const filteredIntegrations = useMemo(() => {
    if (integFilter === "conectados") {
      return integrations.filter((i) => i.status === "connected");
    }
    if (integFilter === "disponiveis") {
      return integrations.filter((i) => i.status !== "connected");
    }
    return integrations;
  }, [integrations, integFilter]);

  const handleSyncAll = () => {
    setIsSyncingAll(true);
    showToast("Iniciando sincronização global em todos os CRMs...");
    setTimeout(() => {
      setIntegrations((prev) =>
        prev.map((item) =>
          item.status === "connected"
            ? {
                ...item,
                lastSync: "Agora mesmo",
                syncedDealsCount: (item.syncedDealsCount || 45) + 6,
              }
            : item
        )
      );
      setIsSyncingAll(false);
      showToast("Hub Agro sincronizado! Oportunidades e contratos atualizados.");
    }, 1200);
  };

  return (
    <div className="space-y-5 sm:space-y-6 flex-1 font-sans">
      {/* Toast Notificação */}
      <AnimatePresence>
        {feedbackToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 bg-slate-900/95 backdrop-blur-md text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 text-xs sm:text-sm border border-slate-700/60"
          >
            <div className="w-5 h-5 rounded-full bg-[#00a83e] flex items-center justify-center text-white shrink-0">
              <Check className="w-3 h-3" />
            </div>
            <span className="font-semibold">{feedbackToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =========================================================================
          BARRA DE NAVEGAÇÃO SUPERIOR MINIMALISTA
         ========================================================================= */}
      <div className="bg-white/80 backdrop-blur-md rounded-2xl p-2 sm:p-2.5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Toggle das 2 Páginas (Página 1: CRM Dashboard / Página 2: Integrar CRM) */}
        <div className="inline-flex bg-slate-100/90 p-1 rounded-xl border border-slate-200/60 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveSubPage("dashboard")}
            className={`flex items-center space-x-2 py-2 px-4 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeSubPage === "dashboard"
                ? "bg-white text-[#00a83e] shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>CRM no Dashboard</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubPage("integrar")}
            className={`flex items-center space-x-2 py-2 px-4 rounded-lg text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeSubPage === "integrar"
                ? "bg-white text-[#00a83e] shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Link2 className="w-4 h-4" />
            <span>Integrar CRM</span>
            <span className="px-1.5 py-0.2 rounded-md bg-emerald-100 text-[#00a83e] text-[10px] font-extrabold tracking-tight">
              5 Agro
            </span>
          </button>
        </div>

        {/* Lado Direito: Modos de visualização (Kanban / Lista / Gantt) e Ação Nova Oportunidade */}
        {activeSubPage === "dashboard" ? (
          <div className="flex items-center justify-between md:justify-end space-x-2.5">
            {/* Seletor Minimalista dos 3 Modelos */}
            <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/60 text-xs">
              <button
                type="button"
                onClick={() => setViewMode("kanban")}
                className={`py-1.5 px-3 rounded-lg font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                  viewMode === "kanban"
                    ? "bg-white text-[#00a83e] shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
                title="Quadro Kanban"
              >
                <KanbanIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Kanban</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode("lista")}
                className={`py-1.5 px-3 rounded-lg font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                  viewMode === "lista"
                    ? "bg-white text-[#00a83e] shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
                title="Tabela em Lista"
              >
                <List className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Lista</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode("gantt")}
                className={`py-1.5 px-3 rounded-lg font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                  viewMode === "gantt"
                    ? "bg-white text-[#00a83e] shadow-xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
                title="Cronograma Gantt"
              >
                <CalendarRange className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Gantt</span>
              </button>
            </div>

            {/* Botão Novo Negócio */}
            <button
              type="button"
              onClick={() => setIsNewDealModalOpen(true)}
              className="py-2 px-3.5 bg-[#00a83e] hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-emerald-600/20 hover:shadow-md transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Novo Negócio</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between md:justify-end space-x-2.5">
            <div className="flex items-center space-x-2 bg-emerald-50/80 border border-emerald-200/80 px-3 py-1.5 rounded-xl text-xs text-emerald-800 font-bold">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00a83e] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00a83e]"></span>
              </span>
              <span>{connectedIntegrations.length} de 5 Ativos</span>
              <span className="text-emerald-400">•</span>
              <span className="text-[11px] font-semibold text-emerald-700">99.9% Uptime</span>
            </div>

            <button
              type="button"
              onClick={handleSyncAll}
              disabled={isSyncingAll}
              className="py-2 px-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95 disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncingAll ? "animate-spin text-[#00a83e]" : ""}`} />
              <span>{isSyncingAll ? "Sincronizando..." : "Sincronizar Todos"}</span>
            </button>
          </div>
        )}
      </div>

      {/* =========================================================================
          SUB-PÁGINA 1: CRM NO DASHBOARD
         ========================================================================= */}
      {activeSubPage === "dashboard" && (
        <div className="space-y-5">
          {/* Faixa de Métricas Ultra-Clean */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-colors">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Total em Pipeline
              </span>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {formatBRL(totalPipeline)}
                </span>
              </div>
              <span className="text-[11px] font-semibold text-[#00a83e] flex items-center space-x-1 mt-1">
                <TrendingUp className="w-3 h-3" />
                <span>+18.4% nesta safra</span>
              </span>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-colors">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Negócios Ativos
              </span>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {filteredDeals.length}
                </span>
                <span className="text-xs text-slate-400 font-medium">oportunidades</span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium mt-1 block">
                Em 8 colunas de pipeline
              </span>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-colors">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Vendas & Finalizados
              </span>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-xl sm:text-2xl font-black text-[#00a83e] tracking-tight">
                  {formatBRL(totalWon)}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium mt-1 block">
                Volume já convertido
              </span>
            </div>

            <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-colors">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Ticket Médio
              </span>
              <div className="flex items-baseline space-x-2 mt-1">
                <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  {filteredDeals.length > 0 ? formatBRL(totalPipeline / filteredDeals.length) : "R$ 0"}
                </span>
              </div>
              <span className="text-[11px] text-slate-500 font-medium mt-1 block">
                Por produtor rural
              </span>
            </div>
          </div>

          {/* Barra de Busca + Filtros Rápidos Minimalistas */}
          <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Campo de Busca */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Filtrar por produtor, fazenda, produto ou cidade..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200/80 rounded-xl text-xs text-slate-800 placeholder-slate-400 transition-all focus:outline-none focus:ring-2 focus:ring-[#00a83e]/20 focus:border-[#00a83e]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Seletor Todos & Equipe */}
            <div className="flex items-center space-x-2 shrink-0">
              <span className="px-3.5 py-2 rounded-xl font-bold bg-slate-900 text-white text-xs shadow-xs">
                Todos ({filteredDeals.length})
              </span>

              <div className="h-5 w-px bg-slate-200 mx-1 shrink-0" />

              <select
                value={selectedSalesperson}
                onChange={(e) => setSelectedSalesperson(e.target.value)}
                className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#00a83e]/20 transition-all cursor-pointer"
              >
                <option value="todos">Toda a Equipe</option>
                <option value="João Silva">João Silva</option>
                <option value="Maria Oliveira">Maria Oliveira</option>
                <option value="Carlos Eduardo">Carlos Eduardo</option>
              </select>
            </div>
          </div>

          {/* ======================= MODELO 1: KANBAN AMPLO ======================= */}
          {viewMode === "kanban" && (
            <div className="space-y-2.5">
              {/* Barra de Auxílio à Navegação Ampla */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-1 text-xs text-slate-500">
                <div className="flex items-center space-x-2 bg-slate-100/90 px-3.5 py-1.5 rounded-xl border border-slate-200/70 font-medium">
                  <Move className="w-3.5 h-3.5 text-[#00a83e] shrink-0" />
                  <span>
                    <strong>Navegação Livre:</strong> Clique e segure na tela para arrastar em qualquer direção (diagonal ou lateral).
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[11px] text-slate-400 font-medium">
                    Arraste os cards para mover de fase
                  </span>
                  <div className="flex items-center space-x-1">
                    <button
                      type="button"
                      onClick={() => handleScrollKanban("left")}
                      className="p-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors shadow-2xs cursor-pointer"
                      title="Rolar para a esquerda"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleScrollKanban("right")}
                      className="p-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors shadow-2xs cursor-pointer"
                      title="Rolar para a direita"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Canvas Scroll com Panning em Diagonal */}
              <div
                ref={kanbanScrollRef}
                onMouseDown={handleKanbanMouseDown}
                onMouseMove={handleKanbanMouseMove}
                onMouseUp={handleKanbanMouseUp}
                onMouseLeave={handleKanbanMouseUp}
                className={`overflow-x-auto pb-8 pt-1 select-none transition-colors ${
                  isPanning ? "cursor-grabbing" : "cursor-grab"
                }`}
                style={{ scrollBehavior: isPanning ? "auto" : "smooth" }}
              >
                <div className="flex items-start space-x-5 min-w-[3100px] px-1">
                  {STAGES.map((stage, sIndex) => {
                    const stageDeals = filteredDeals.filter((d) => d.stage === stage.key);
                    const stageSum = stageDeals.reduce((acc, cur) => acc + cur.value, 0);
                    const isColumnOver = dragOverStage === stage.key && draggedDealId !== null;

                    return (
                      <div
                        key={stage.key}
                        onDragOver={(e) => handleColumnDragOver(e, stage.key)}
                        onDrop={(e) => handleColumnDrop(e, stage.key)}
                        className={`w-[360px] sm:w-[380px] shrink-0 rounded-3xl border transition-all flex flex-col max-h-[820px] ${
                          isColumnOver
                            ? "bg-emerald-50/70 border-[#00a83e] ring-2 ring-[#00a83e]/30 shadow-lg scale-[1.01]"
                            : "bg-slate-100/70 border-slate-200/80 shadow-2xs"
                        }`}
                      >
                        {/* Topo da Coluna Ampliado */}
                        <div className="p-4 sm:p-4.5 border-b border-slate-200/80 bg-white rounded-t-3xl flex items-center justify-between">
                          <div className="flex items-center space-x-2.5">
                            <span className={`w-3 h-3 rounded-full ${stage.dotColor} shrink-0 ring-4 ring-slate-50`} />
                            <h4 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                              {stage.label}
                            </h4>
                            <span className="text-xs font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
                              {stageDeals.length}
                            </span>
                          </div>
                          <span className="text-xs sm:text-sm font-black text-slate-700 font-mono">
                            {formatBRL(stageSum)}
                          </span>
                        </div>

                        {/* Drop Placeholder quando arrasta sobre a coluna */}
                        {isColumnOver && (
                          <div className="m-3 p-3.5 border-2 border-dashed border-[#00a83e] bg-emerald-50 rounded-2xl text-center text-xs font-black text-[#00a83e] flex items-center justify-center space-x-2 animate-pulse shadow-xs">
                            <ArrowDown className="w-4 h-4 animate-bounce" />
                            <span>Soltar negócio em {stage.label}</span>
                          </div>
                        )}

                        {/* Lista de Cards da Coluna Ampliados */}
                        <div className="p-3.5 sm:p-4 space-y-4 overflow-y-auto flex-1 min-h-[440px]">
                          {stageDeals.length === 0 && !isColumnOver ? (
                            <div className="py-16 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-2xl font-medium bg-white/40">
                              Nenhum negócio nesta fase.
                              <div className="text-[11px] text-slate-400 mt-1">
                                Arraste uma oportunidade para cá
                              </div>
                            </div>
                          ) : (
                            stageDeals.map((deal) => (
                              <motion.div
                                key={deal.id}
                                layout
                                data-card-item="true"
                                className={`bg-white rounded-2xl border transition-all overflow-hidden flex flex-col group relative select-none shadow-xs hover:shadow-xl hover:border-emerald-300 ${
                                  draggedDealId === deal.id
                                    ? "opacity-35 scale-[0.98] border-dashed border-[#00a83e] ring-2 ring-[#00a83e]/20"
                                    : "border-slate-200/90"
                                }`}
                              >
                                {/* PARTE SUPERIOR (DO TOPO ATÉ O TÍTULO): ÁREA DE ARRASTE COM COR DIFERENCIADA */}
                                <div
                                  draggable
                                  onDragStart={(e) => handleCardDragStart(e as unknown as React.DragEvent, deal)}
                                  onDragEnd={handleCardDragEnd}
                                  onClick={() => {
                                    if (!dragJustEndedRef.current) {
                                      setSelectedDealForDetail(deal);
                                    }
                                  }}
                                  className="bg-slate-100/95 hover:bg-slate-200/80 border-b border-slate-200/90 p-4 sm:p-4.5 transition-colors cursor-grab active:cursor-grabbing"
                                  title="Clique e segure nesta área para arrastar para outra fase"
                                >
                                  {/* Badges e Pegador */}
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50/95 px-2.5 py-1 rounded-lg border border-emerald-200/70 truncate max-w-[190px] shadow-2xs">
                                      {deal.productCategory}
                                    </span>

                                    <div className="flex items-center space-x-1.5 shrink-0">
                                      {deal.priority === "alta" && (
                                        <span className="text-[10px] font-extrabold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200/60 flex items-center space-x-1 shadow-2xs">
                                          <Flame className="w-3 h-3 text-rose-600" />
                                          <span>Alta</span>
                                        </span>
                                      )}
                                      <span
                                        className="flex items-center space-x-1 text-slate-500 group-hover:text-slate-700 bg-white/95 px-2 py-0.5 rounded-md border border-slate-200/80 shadow-2xs text-[10px] font-bold uppercase tracking-wider"
                                        title="Arraste para mover para outra fase"
                                      >
                                        <GripVertical className="w-3.5 h-3.5 text-slate-500" />
                                        <span>Arrastar</span>
                                      </span>
                                    </div>
                                  </div>

                                  {/* Título do Negócio */}
                                  <h5 className="text-sm sm:text-base font-extrabold text-slate-900 mt-2.5 line-clamp-2 leading-snug group-hover:text-[#00a83e] transition-colors tracking-tight">
                                    {deal.title}
                                  </h5>
                                </div>

                                {/* PARTE INFERIOR (ABAIXO DO TÍTULO): ÁREA CLICÁVEL PARA ABRIR O CARD */}
                                <div
                                  onClick={() => {
                                    if (!dragJustEndedRef.current) {
                                      openDealDetail(deal);
                                    }
                                  }}
                                  className="p-4 sm:p-4.5 bg-white hover:bg-slate-50/80 transition-colors cursor-pointer flex-1 flex flex-col justify-between"
                                  title="Clique para abrir, ver detalhes ou editar esta oportunidade"
                                >
                                  {/* Cliente & Fazenda com Ícones */}
                                  <div className="text-xs text-slate-600 space-y-1.5">
                                    <div className="font-extrabold text-slate-800 text-xs sm:text-sm flex items-center space-x-1.5 truncate">
                                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                      <span className="truncate">{deal.clientName}</span>
                                    </div>
                                    {deal.farmName && (
                                      <div className="text-slate-500 font-medium text-xs flex items-center space-x-1.5 truncate">
                                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                        <span className="truncate">
                                          {deal.farmName} • {deal.cityState}
                                        </span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Valor & Vendedor em Destaque */}
                                  <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                                    <div>
                                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                                        Valor Estimado
                                      </span>
                                      <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                                        {formatBRL(deal.value)}
                                      </span>
                                    </div>

                                    <div className="text-right">
                                      <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                                        Consultor / RTV
                                      </span>
                                      <span className="text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200/70 px-2.5 py-1 rounded-lg inline-block">
                                        {deal.salespersonName}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Barra de Progresso & Ação Rápida */}
                                  <div className="mt-3.5 pt-2 flex items-center justify-between">
                                    <div className="flex items-center space-x-2.5 flex-1 pr-3">
                                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                          className={`h-full bg-gradient-to-r ${stage.barColor} rounded-full`}
                                          style={{ width: `${deal.probability}%` }}
                                        />
                                      </div>
                                      <span className="text-xs font-bold text-slate-500 shrink-0">
                                        {deal.probability}%
                                      </span>
                                    </div>

                                    {sIndex < STAGES.length - 1 && (
                                      <button
                                        type="button"
                                        data-no-pan="true"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleAdvanceStage(deal.id);
                                        }}
                                        className="p-1.5 text-slate-400 hover:text-[#00a83e] hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer shrink-0"
                                        title={`Avançar para ${STAGES[sIndex + 1].label}`}
                                      >
                                        <ChevronRight className="w-4 h-4" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ======================= MODELO 2: LISTA ======================= */}
          {viewMode === "lista" && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Oportunidade & Produto</th>
                      <th className="py-3.5 px-4">Produtor / Fazenda</th>
                      <th className="py-3.5 px-4">Estágio</th>
                      <th className="py-3.5 px-4">Vendedor</th>
                      <th className="py-3.5 px-4">Valor Estimado</th>
                      <th className="py-3.5 px-4">Fechamento</th>
                      <th className="py-3.5 px-4">Probabilidade</th>
                      <th className="py-3.5 px-4 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredDeals.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-slate-400 font-medium">
                          Nenhuma oportunidade encontrada.
                        </td>
                      </tr>
                    ) : (
                      filteredDeals.map((deal) => {
                        const currentStage = STAGES.find((s) => s.key === deal.stage);
                        return (
                          <tr
                            key={deal.id}
                            onClick={() => openDealDetail(deal)}
                            className="hover:bg-slate-50/90 transition-colors cursor-pointer group"
                          >
                            <td className="py-3.5 px-4">
                              <span className="font-bold text-slate-900 block group-hover:text-[#00a83e] transition-colors">
                                {deal.title}
                              </span>
                              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-md inline-block mt-0.5">
                                {deal.productCategory}
                              </span>
                            </td>

                            <td className="py-3.5 px-4">
                              <span className="font-semibold text-slate-800 block">{deal.clientName}</span>
                              <span className="text-[10px] text-slate-400">
                                {deal.farmName} • {deal.cityState}
                              </span>
                            </td>

                            <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                              <select
                                value={deal.stage}
                                onChange={(e) => handleSetStage(deal.id, e.target.value as CRMStage)}
                                className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border border-slate-200 bg-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#00a83e]`}
                              >
                                {STAGES.map((s) => (
                                  <option key={s.key} value={s.key}>
                                    {s.label}
                                  </option>
                                ))}
                              </select>
                            </td>

                            <td className="py-3.5 px-4 font-semibold text-slate-700">
                              {deal.salespersonName}
                            </td>

                            <td className="py-3.5 px-4 font-black text-slate-900">
                              {formatBRL(deal.value)}
                            </td>

                            <td className="py-3.5 px-4 text-slate-600 text-[11px]">
                              {new Date(deal.expectedCloseDate + "T12:00:00").toLocaleDateString("pt-BR")}
                            </td>

                            <td className="py-3.5 px-4">
                              <div className="flex items-center space-x-2">
                                <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full bg-gradient-to-r ${currentStage?.barColor || "from-emerald-400 to-[#00a83e]"} rounded-full`}
                                    style={{ width: `${deal.probability}%` }}
                                  />
                                </div>
                                <span className="text-[10px] font-bold text-slate-600">
                                  {deal.probability}%
                                </span>
                              </div>
                            </td>

                            <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-end space-x-1.5">
                                <button
                                  type="button"
                                  onClick={() => {
                                    openDealDetail(deal);
                                    handleStartEditDeal();
                                  }}
                                  className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                                  title="Editar Informações"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => showToast(`Iniciando WhatsApp para ${deal.clientName}`)}
                                  className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#00a83e] rounded-lg transition-colors cursor-pointer"
                                  title="Falar no WhatsApp"
                                >
                                  <Phone className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ======================= MODELO 3: GANTT ======================= */}
          {viewMode === "gantt" && (
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs p-5 sm:p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center space-x-2">
                    <CalendarRange className="w-4 h-4 text-[#00a83e]" />
                    <span>Linha do Tempo de Maturação e Fechamento de Safra</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Previsão cronológica de fechamento para planejamento de expedição e faturamento
                  </p>
                </div>
                <div className="flex items-center space-x-3 text-xs font-semibold text-slate-500">
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#00a83e]" />
                    <span>Venda</span>
                  </span>
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span>Negociação</span>
                  </span>
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                    <span>Qualificação</span>
                  </span>
                </div>
              </div>

              {/* Régua de Tempo */}
              <div className="space-y-3">
                <div className="grid grid-cols-12 gap-2 text-[11px] font-bold text-slate-400 border-b border-slate-100 pb-2">
                  <div className="col-span-4 pl-2">Produtor & Oportunidade</div>
                  <div className="col-span-2 text-center">Agosto</div>
                  <div className="col-span-2 text-center">Setembro</div>
                  <div className="col-span-2 text-center">Outubro</div>
                  <div className="col-span-2 text-center">Novembro</div>
                </div>

                {filteredDeals.map((deal) => {
                  const stageDef = STAGES.find((s) => s.key === deal.stage);
                  
                  let colSpan = "col-span-3";
                  let offset = "col-start-4";

                  if (deal.stage === "Clientes") {
                    offset = "col-start-7";
                    colSpan = "col-span-4";
                  } else if (deal.stage === "Pré-Qualificados") {
                    offset = "col-start-6";
                    colSpan = "col-span-4";
                  } else if (deal.stage === "Qualificados") {
                    offset = "col-start-5";
                    colSpan = "col-span-3";
                  } else if (deal.stage === "Negociação") {
                    offset = "col-start-4";
                    colSpan = "col-span-3";
                  } else if (deal.stage === "Vendas" || deal.stage === "Finalizados") {
                    offset = "col-start-3";
                    colSpan = "col-span-3";
                  }

                  return (
                    <div
                      key={deal.id}
                      onClick={() => openDealDetail(deal)}
                      className="grid grid-cols-12 gap-2 items-center py-2 px-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
                    >
                      <div className="col-span-4 pr-3">
                        <div className="text-xs font-bold text-slate-900 truncate group-hover:text-[#00a83e] transition-colors">
                          {deal.title}
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center space-x-2">
                          <span className="truncate">{deal.clientName}</span>
                          <span>•</span>
                          <span className="font-bold text-slate-900">{formatBRL(deal.value)}</span>
                        </div>
                      </div>

                      <div className="col-span-8 grid grid-cols-8 relative h-7 items-center bg-slate-100/50 rounded-lg p-1">
                        <div
                          className={`${colSpan} ${offset} h-5 rounded-md px-2 flex items-center justify-between text-[10px] font-extrabold text-white shadow-xs bg-gradient-to-r ${stageDef?.barColor || "from-emerald-400 to-[#00a83e]"} transition-all`}
                        >
                          <span className="truncate">{deal.stage}</span>
                          <span>{deal.probability}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          SUB-PÁGINA 2: INTEGRAR CRM (OPÇÃO 2)
         ========================================================================= */}
      {activeSubPage === "integrar" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="space-y-6"
        >
          {/* Barra de Filtros e Busca Rápida de Integrações */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-2.5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="inline-flex bg-slate-100/90 p-1 rounded-xl border border-slate-200/60 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => setIntegFilter("todos")}
                className={`flex-1 sm:flex-none py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  integFilter === "todos"
                    ? "bg-white text-[#00a83e] shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Todos os CRMs ({integrations.length})
              </button>
              <button
                type="button"
                onClick={() => setIntegFilter("conectados")}
                className={`flex-1 sm:flex-none py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  integFilter === "conectados"
                    ? "bg-white text-[#00a83e] shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Conectados ({connectedIntegrations.length})
              </button>
              <button
                type="button"
                onClick={() => setIntegFilter("disponiveis")}
                className={`flex-1 sm:flex-none py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  integFilter === "disponiveis"
                    ? "bg-white text-[#00a83e] shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Disponíveis ({integrations.length - connectedIntegrations.length})
              </button>
            </div>

            <div className="flex items-center space-x-2 text-xs text-slate-500 font-semibold px-2">
              <span className="w-2 h-2 rounded-full bg-[#00a83e] animate-pulse" />
              <span>Sincronização Ativa com RTVs e Balcão de Vendas</span>
            </div>
          </div>

          {/* Grid dos 5 CRMs Nativos mais usados no Agro */}
          <motion.div
            variants={containerMotionVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5"
          >
            {filteredIntegrations.map((integ) => {
              const isConnected = integ.status === "connected";
              const isSyncing = integ.status === "syncing";
              const meta = PROVIDER_METADATA[integ.providerCode] || PROVIDER_METADATA.clover;

              return (
                <motion.div
                  key={integ.id}
                  variants={cardItemMotionVariants}
                  className={`relative bg-white rounded-2xl p-5 sm:p-6 border transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:shadow-xl hover:-translate-y-1 ${
                    isConnected
                      ? "border-emerald-500/40 shadow-xs ring-1 ring-emerald-500/10"
                      : "border-slate-200/80 hover:border-slate-300"
                  }`}
                >
                  {/* Linha Superior Gradiente para Conectados */}
                  {isConnected && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 via-[#00a83e] to-teal-500" />
                  )}

                  <div>
                    {/* Topo do Card */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center space-x-3.5">
                        <div
                          className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${meta.gradient} text-white font-black text-base flex items-center justify-center shadow-md shadow-slate-900/10 group-hover:scale-105 transition-transform duration-300 shrink-0`}
                        >
                          <span>{meta.monogram}</span>
                        </div>
                        <div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-0.5">
                            {meta.tagline}
                          </span>
                          <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-[#00a83e] transition-colors">
                            {integ.name}
                          </h3>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="flex items-center space-x-1.5 shrink-0">
                        {isConnected ? (
                          <>
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-[#00a83e] border border-emerald-200/70 shadow-2xs">
                              <span className="relative flex h-2 w-2 mr-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00a83e] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00a83e]"></span>
                              </span>
                              Ativo
                            </span>
                            <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-bold font-mono">
                              {meta.latency}
                            </span>
                          </>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200/60">
                            <Link2 className="w-3 h-3 text-slate-400" />
                            <span>Disponível</span>
                          </span>
                        )}
                      </div>
                    </div>

                    </div>

                  {/* Ações Inferiores */}
                  <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-1.5 text-[11px] text-slate-500 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Freq: <strong className="text-slate-700 font-semibold">{integ.syncFrequency}</strong></span>
                    </div>

                    <div className="flex items-center space-x-2">
                      {isConnected ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleSyncIntegration(integ)}
                            disabled={isSyncing}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50 active:scale-95"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-[#00a83e]" : "text-slate-500"}`} />
                            <span>{isSyncing ? "Sincronizando..." : "Sincronizar"}</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenConfigModal(integ)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 rounded-xl transition-all cursor-pointer"
                            title="Configurar Integração"
                          >
                            <Settings2 className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleIntegration(integ)}
                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold transition-all cursor-pointer active:scale-95"
                          >
                            Desconectar
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleToggleIntegration(integ)}
                          className="px-4 py-2 bg-[#00a83e] hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-emerald-600/20 hover:shadow-md transition-all flex items-center space-x-2 cursor-pointer active:scale-95 group/btn"
                        >
                          <Link2 className="w-3.5 h-3.5" />
                          <span>Conectar CRM</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      )}

      {/* ================= MODAL: DETALHES E EDIÇÃO DO NEGÓCIO ================= */}
      <AnimatePresence>
        {selectedDealForDetail && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
              onClick={() => {
                setSelectedDealForDetail(null);
                setIsEditingDeal(false);
              }}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col relative z-10 border border-slate-100 overflow-hidden"
            >
              {/* Header do Modal */}
              <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="pr-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                      {isEditingDeal ? "Modo de Edição" : selectedDealForDetail.productCategory}
                    </span>
                    {!isEditingDeal && (
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-200/60 px-2 py-0.5 rounded-md">
                        {selectedDealForDetail.stage}
                      </span>
                    )}
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1 truncate max-w-md">
                    {isEditingDeal ? "Editar Dados da Oportunidade" : selectedDealForDetail.title}
                  </h3>
                </div>

                <div className="flex items-center space-x-1.5 shrink-0">
                  {!isEditingDeal ? (
                    <>
                      <button
                        type="button"
                        onClick={handleStartEditDeal}
                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#00a83e] rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
                        title="Editar todas as informações do card"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Editar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteDeal(selectedDealForDetail.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                        title="Excluir Oportunidade"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsEditingDeal(false)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      Cancelar Edição
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedDealForDetail(null);
                      setIsEditingDeal(false);
                    }}
                    className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Conteúdo do Modal (Visualização ou Edição) */}
              <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
                {!isEditingDeal ? (
                  /* ================= MODO VISUALIZAÇÃO ================= */
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block flex items-center space-x-1">
                          <User className="w-3 h-3 text-slate-400" />
                          <span>Produtor / Cliente</span>
                        </span>
                        <span className="font-bold text-slate-900 text-sm mt-1 block">
                          {selectedDealForDetail.clientName}
                        </span>
                        <span className="text-slate-500 text-xs block mt-0.5 flex items-center space-x-1">
                          <Phone className="w-3 h-3 text-emerald-600" />
                          <span>{selectedDealForDetail.phone || "Não informado"}</span>
                        </span>
                      </div>

                      <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block flex items-center space-x-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>Propriedade Rural</span>
                        </span>
                        <span className="font-bold text-slate-900 text-sm mt-1 block">
                          {selectedDealForDetail.farmName || "Fazenda não informada"}
                        </span>
                        <span className="text-slate-500 text-xs block mt-0.5">
                          {selectedDealForDetail.cityState || "Região não informada"}
                          {selectedDealForDetail.areaHectares ? ` • ${selectedDealForDetail.areaHectares} ha` : ""}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block flex items-center space-x-1">
                          <DollarSign className="w-3 h-3 text-[#00a83e]" />
                          <span>Valor Previsto</span>
                        </span>
                        <span className="font-black text-slate-900 text-base mt-1 block">
                          {formatBRL(selectedDealForDetail.value)}
                        </span>
                      </div>

                      <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block flex items-center space-x-1">
                          <UserCheck className="w-3 h-3 text-slate-400" />
                          <span>Vendedor Responsável</span>
                        </span>
                        <span className="font-bold text-slate-800 text-xs mt-1 block">
                          {selectedDealForDetail.salespersonName}
                        </span>
                      </div>

                      <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block flex items-center space-x-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          <span>Previsão de Fechamento</span>
                        </span>
                        <span className="font-semibold text-slate-800 text-xs mt-1 block">
                          {new Date(selectedDealForDetail.expectedCloseDate + "T12:00:00").toLocaleDateString("pt-BR")}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">
                            Probabilidade
                          </span>
                          <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                            {selectedDealForDetail.probability || 50}%
                          </span>
                        </div>
                        <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#00a83e] rounded-full"
                            style={{ width: `${selectedDealForDetail.probability || 50}%` }}
                          />
                        </div>
                      </div>

                      <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase font-bold block">
                            Prioridade
                          </span>
                          <span className="font-bold text-slate-800 text-sm mt-0.5 capitalize block">
                            {selectedDealForDetail.priority || "Média"}
                          </span>
                        </div>
                        {selectedDealForDetail.priority === "alta" && (
                          <span className="p-1 bg-rose-50 text-rose-600 rounded-lg">
                            <Flame className="w-4 h-4" />
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Progressão de Estágios Clicável */}
                    <div className="pt-2">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                        Mudar Estágio do Funil
                      </label>
                      <div className="grid grid-cols-4 gap-1.5">
                        {STAGES.map((st) => (
                          <button
                            key={st.key}
                            type="button"
                            onClick={() => handleSetStage(selectedDealForDetail.id, st.key)}
                            className={`py-2 px-2 rounded-xl text-[10px] font-bold transition-all cursor-pointer truncate ${
                              selectedDealForDetail.stage === st.key
                                ? "bg-[#00a83e] text-white shadow-xs"
                                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                            }`}
                          >
                            {st.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Rodapé do Modo Visualização */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          showToast(`Iniciando contato via WhatsApp com ${selectedDealForDetail.clientName}`);
                        }}
                        className="py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-[#00a83e] font-bold rounded-xl transition-colors flex items-center space-x-2 cursor-pointer active:scale-95"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>Falar no WhatsApp</span>
                      </button>

                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={handleStartEditDeal}
                          className="py-2.5 px-4 bg-[#00a83e] hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors flex items-center space-x-1.5 cursor-pointer active:scale-95 shadow-xs"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          <span>Editar Informações</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedDealForDetail(null);
                            setIsEditingDeal(false);
                          }}
                          className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
                        >
                          Fechar
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  /* ================= MODO DE EDIÇÃO ================= */
                  <form onSubmit={handleSaveEditDeal} className="space-y-4">
                    {/* Linha 1: Título e Categoria */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Título da Oportunidade *
                        </label>
                        <input
                          type="text"
                          required
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#00a83e] focus:bg-white"
                          placeholder="Ex: Fornecimento Fertilizantes Soja"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Categoria do Produto / Insumo
                        </label>
                        <input
                          type="text"
                          list="product-categories"
                          value={editCategory}
                          onChange={(e) => setEditCategory(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#00a83e] focus:bg-white"
                          placeholder="Ex: Sementes Soja, Fungicidas"
                        />
                        <datalist id="product-categories">
                          <option value="Sementes Algodão" />
                          <option value="Sementes Soja" />
                          <option value="Fungicidas & Defensivos" />
                          <option value="Fertilizantes & NPK" />
                          <option value="Barter de Grãos" />
                          <option value="Nutrição Foliar" />
                          <option value="Herbicidas" />
                          <option value="Biológicos & Bioinsumos" />
                        </datalist>
                      </div>
                    </div>

                    {/* Linha 2: Produtor e Telefone */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Nome do Produtor / Cliente *
                        </label>
                        <input
                          type="text"
                          required
                          value={editClientName}
                          onChange={(e) => setEditClientName(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#00a83e] focus:bg-white"
                          placeholder="Ex: Agropecuária Santa Helena"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Telefone / WhatsApp
                        </label>
                        <input
                          type="text"
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#00a83e] focus:bg-white"
                          placeholder="+55 (64) 99999-1122"
                        />
                      </div>
                    </div>

                    {/* Linha 3: Fazenda, Localização e Área */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Nome da Fazenda
                        </label>
                        <input
                          type="text"
                          value={editFarmName}
                          onChange={(e) => setEditFarmName(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#00a83e] focus:bg-white"
                          placeholder="Ex: Fazenda Boa Esperança"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Cidade - UF
                        </label>
                        <input
                          type="text"
                          value={editCityState}
                          onChange={(e) => setEditCityState(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#00a83e] focus:bg-white"
                          placeholder="Ex: Rio Verde - GO"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Área (ha)
                        </label>
                        <input
                          type="number"
                          value={editAreaHectares}
                          onChange={(e) => setEditAreaHectares(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#00a83e] focus:bg-white"
                          placeholder="Ex: 1200"
                        />
                      </div>
                    </div>

                    {/* Linha 4: Valor, Vendedor e Data */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Valor Estimado (R$)
                        </label>
                        <input
                          type="text"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00a83e] focus:bg-white"
                          placeholder="Ex: 450000"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Consultor / RTV
                        </label>
                        <select
                          value={editSalespersonName}
                          onChange={(e) => setEditSalespersonName(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#00a83e] focus:bg-white cursor-pointer"
                        >
                          <option value="João Silva">João Silva</option>
                          <option value="Maria Oliveira">Maria Oliveira</option>
                          <option value="Carlos Eduardo">Carlos Eduardo</option>
                          <option value="Lucas Santos">Lucas Santos</option>
                          <option value="Ana Paula">Ana Paula</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Previsão Fechamento
                        </label>
                        <input
                          type="date"
                          value={editExpectedCloseDate}
                          onChange={(e) => setEditExpectedCloseDate(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#00a83e] focus:bg-white cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Linha 5: Estágio, Probabilidade e Prioridade */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Estágio no Pipeline
                        </label>
                        <select
                          value={editStage}
                          onChange={(e) => setEditStage(e.target.value as CRMStage)}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00a83e] focus:bg-white cursor-pointer"
                        >
                          {STAGES.map((s) => (
                            <option key={s.key} value={s.key}>
                              {s.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Probabilidade ({editProbability}%)
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="5"
                          value={editProbability}
                          onChange={(e) => setEditProbability(Number(e.target.value))}
                          className="w-full accent-[#00a83e] cursor-pointer mt-2"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">
                          Prioridade
                        </label>
                        <select
                          value={editPriority}
                          onChange={(e) => setEditPriority(e.target.value as "baixa" | "média" | "alta")}
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#00a83e] focus:bg-white cursor-pointer"
                        >
                          <option value="baixa">Baixa</option>
                          <option value="média">Média</option>
                          <option value="alta">Alta (Quente 🔥)</option>
                        </select>
                      </div>
                    </div>

                    {/* Ações do Formulário de Edição */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => handleDeleteDeal(selectedDealForDetail.id)}
                        className="py-2.5 px-3.5 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Excluir Card</span>
                      </button>

                      <div className="flex items-center space-x-2">
                        <button
                          type="button"
                          onClick={() => setIsEditingDeal(false)}
                          className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
                        >
                          Cancelar
                        </button>
                        <button
                          type="submit"
                          className="py-2.5 px-5 bg-[#00a83e] hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-sm shadow-emerald-600/30 flex items-center space-x-2 cursor-pointer active:scale-95"
                        >
                          <Save className="w-4 h-4" />
                          <span>Salvar Alterações</span>
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= MODAL: NOVO NEGÓCIO ================= */}
      <AnimatePresence>
        {isNewDealModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
              onClick={() => setIsNewDealModalOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 border border-slate-100 overflow-hidden"
            >
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 flex items-center space-x-1.5">
                    <Plus className="w-4 h-4 text-[#00a83e]" />
                    <span>Registrar Nova Oportunidade</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Adicione um negócio para acompanhamento no CRM Ceruti
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsNewDealModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateDealSubmit} className="p-5 space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1 text-[10px]">
                    Título da Oportunidade
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ex: Insumos Soja Safra 2025"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00a83e]/20"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1 text-[10px]">
                      Nome do Produtor
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ex: Marcos Fagundes"
                      value={newClient}
                      onChange={(e) => setNewClient(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00a83e]/20"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1 text-[10px]">
                      Fazenda / Cidade
                    </label>
                    <input
                      type="text"
                      placeholder="ex: Fazenda Santa Fé"
                      value={newFarm}
                      onChange={(e) => setNewFarm(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00a83e]/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1 text-[10px]">
                      Valor Previsto (R$)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ex: 250000"
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00a83e]/20"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1 text-[10px]">
                      Coluna Inicial
                    </label>
                    <select
                      value={newStage}
                      onChange={(e) => setNewStage(e.target.value as CRMStage)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-[#00a83e]/20"
                    >
                      {STAGES.map((s) => (
                        <option key={s.key} value={s.key}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1 text-[10px]">
                      Vendedor Responsável
                    </label>
                    <select
                      value={newSalesperson}
                      onChange={(e) => setNewSalesperson(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold"
                    >
                      <option value="João Silva">João Silva</option>
                      <option value="Maria Oliveira">Maria Oliveira</option>
                      <option value="Carlos Eduardo">Carlos Eduardo</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1 text-[10px]">
                      Categoria do Produto
                    </label>
                    <input
                      type="text"
                      placeholder="ex: Fungicidas & Adubos"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800"
                    />
                  </div>
                </div>

                <div className="pt-3 flex items-center justify-end space-x-2.5">
                  <button
                    type="button"
                    onClick={() => setIsNewDealModalOpen(false)}
                    className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#00a83e] hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
                  >
                    Salvar Negócio
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ================= MODAL: CONFIGURAÇÃO DE INTEGRAÇÃO ================= */}
      <AnimatePresence>
        {selectedIntegForModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
              onClick={() => setSelectedIntegForModal(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-10 border border-slate-100 overflow-hidden"
            >
              {/* Topo do Modal com Identidade da Marca */}
              <div className="p-5 sm:p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
                <div className="flex items-center space-x-3.5">
                  <div
                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${
                      PROVIDER_METADATA[selectedIntegForModal.providerCode]?.gradient || "from-emerald-600 to-teal-700"
                    } text-white font-black text-sm flex items-center justify-center shadow-sm shrink-0`}
                  >
                    <span>{PROVIDER_METADATA[selectedIntegForModal.providerCode]?.monogram || "CRM"}</span>
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center space-x-2">
                      <span>{selectedIntegForModal.name}</span>
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {PROVIDER_METADATA[selectedIntegForModal.providerCode]?.tagline || "Conector Oficial Agro"}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedIntegForModal(null)}
                  className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-200/60 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveIntegration} className="p-5 sm:p-6 space-y-4 text-xs">
                <div className="space-y-3.5">
                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1 text-[10px]">
                      Identificador / E-mail de Acesso
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="ex: revenda.comercial@agro.com.br"
                      value={integAccount}
                      onChange={(e) => setIntegAccount(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00a83e]/20"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1 text-[10px]">
                      API Token / Chave Secreta
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="ex: sk_live_agro_..."
                      value={integApiKey}
                      onChange={(e) => setIntegApiKey(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00a83e]/20"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 uppercase mb-1 text-[10px]">
                      Endpoint do Servidor (Webhook URL)
                    </label>
                    <input
                      type="text"
                      readOnly
                      value={selectedIntegForModal.apiUrl || "https://api.agroservice.com.br/v2/webhook"}
                      className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-slate-500 font-mono text-[11px]"
                    />
                  </div>
                </div>

                {/* Ações do Modal */}
                <div className="pt-2 flex items-center justify-end space-x-2.5 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedIntegForModal(null)}
                    className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isTestingInteg}
                    className="px-4 py-2 bg-[#00a83e] hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs flex items-center space-x-1.5 cursor-pointer disabled:opacity-60 active:scale-95"
                  >
                    {isTestingInteg ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Validando Conexão...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Ativar Integração</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
