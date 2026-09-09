import React, { useState } from "react";
import {
  LogOut,
  Plus,
  Trash2,
  Bot,
  Activity,
  Users,
  X,
  Smartphone,
  MessageSquare,
  LayoutDashboard,
  MoreVertical,
  Pencil,
  Clock,
  Phone,
  Search,
  Calendar,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  CreditCard,
  MessageCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Salesperson, PlanInfo, ChatMessage } from "../types";
import { Logo } from "./Logo";
import Prism from "./Prism";
import { Overview } from "./Overview";
import { SellerMonitoring } from "./SellerMonitoring";
import { CalendarView } from "./CalendarView";
import { CRMView } from "./CRMView";
import { PlansView } from "./PlansView";

const COUNTRIES = [
  { code: "+55", flag: "br", name: "Brasil" },
  { code: "+1", flag: "us", name: "Estados Unidos" },
  { code: "+351", flag: "pt", name: "Portugal" },
  { code: "+44", flag: "gb", name: "Reino Unido" },
  { code: "+34", flag: "es", name: "Espanha" },
  { code: "+54", flag: "ar", name: "Argentina" },
  { code: "+56", flag: "cl", name: "Chile" },
  { code: "+52", flag: "mx", name: "México" },
  { code: "+57", flag: "co", name: "Colômbia" },
  { code: "+49", flag: "de", name: "Alemanha" },
  { code: "+33", flag: "fr", name: "França" },
  { code: "+39", flag: "it", name: "Itália" },
  { code: "+81", flag: "jp", name: "Japão" },
  { code: "+86", flag: "cn", name: "China" },
  { code: "+91", flag: "in", name: "Índia" },
  { code: "+7", flag: "ru", name: "Rússia" },
  { code: "+27", flag: "za", name: "África do Sul" },
  { code: "+61", flag: "au", name: "Austrália" },
  { code: "+64", flag: "nz", name: "Nova Zelândia" },
];

const MOCK_PLAN: PlanInfo = {
  name: "Plano Semestral",
  maxAccesses: 30,
};

const MOCK_HISTORY_1: ChatMessage[] = [
  { id: '1', sender: 'user', text: 'Bom dia! Gostaria de uma cotação.', timestamp: '10:30' },
  { id: '2', sender: 'agent', text: 'Olá! Bom dia. Claro, sobre qual produto?', timestamp: '10:31' },
  { id: '3', sender: 'user', text: 'Do plano anual.', timestamp: '10:35' },
  { id: '4', sender: 'agent', text: 'O plano anual fica por R$ 999 à vista.', timestamp: '10:36' },
];

const MOCK_HISTORY_2: ChatMessage[] = [
  { id: '1', sender: 'user', text: 'Ok, vou verificar e retorno.', timestamp: '18:40' },
  { id: '2', sender: 'agent', text: 'Fico à disposição!', timestamp: '18:45' }
];

const INITIAL_SALESPEOPLE: Salesperson[] = [
  {
    id: "1",
    name: "João Silva",
    whatsapp: "+55 11 98765-4321",
    status: "Ativo",
    messageCount: 145,
    lastConversation: "Hoje, 10:36",
    plansGeneratedMonth: 82,
    history24h: MOCK_HISTORY_1,
    calendarIntegration: { status: "disconnected" },
  },
  {
    id: "2",
    name: "Maria Oliveira",
    whatsapp: "+55 11 91234-5678",
    status: "Ativo",
    messageCount: 118,
    lastConversation: "Hoje, 11:20",
    plansGeneratedMonth: 66,
    history24h: MOCK_HISTORY_2,
    calendarIntegration: {
      status: "connected",
      provider: "google",
      email: "maria.oliveira@ceruti.com.br",
      connectedAt: "Ontem, 14:20",
      lastSync: "Há 15 min",
    },
  },
  {
    id: "3",
    name: "Carlos Sousa",
    whatsapp: "+55 21 99999-8888",
    status: "Ativo",
    messageCount: 0,
    lastConversation: "Sem registros",
    plansGeneratedMonth: 0,
    history24h: [],
    calendarIntegration: { status: "disconnected" },
  },
  {
    id: "4",
    name: "Beatriz Santos",
    whatsapp: "+55 11 97654-3210",
    status: "Ativo",
    messageCount: 94,
    lastConversation: "Hoje, 09:45",
    plansGeneratedMonth: 54,
    history24h: MOCK_HISTORY_1,
    calendarIntegration: { status: "connected", provider: "google", email: "beatriz.santos@ceruti.com.br" },
  },
  {
    id: "5",
    name: "Lucas Ferreira",
    whatsapp: "+55 31 98877-6655",
    status: "Ativo",
    messageCount: 132,
    lastConversation: "Hoje, 12:15",
    plansGeneratedMonth: 71,
    history24h: MOCK_HISTORY_2,
    calendarIntegration: { status: "disconnected" },
  },
  {
    id: "6",
    name: "Juliana Costa",
    whatsapp: "+55 41 99123-4567",
    status: "Ativo",
    messageCount: 87,
    lastConversation: "Ontem, 16:30",
    plansGeneratedMonth: 48,
    history24h: MOCK_HISTORY_1,
    calendarIntegration: { status: "disconnected" },
  },
  {
    id: "7",
    name: "Rodrigo Almeida",
    whatsapp: "+55 51 98456-7890",
    status: "Ativo",
    messageCount: 105,
    lastConversation: "Hoje, 08:50",
    plansGeneratedMonth: 62,
    history24h: MOCK_HISTORY_2,
    calendarIntegration: { status: "connected", provider: "google", email: "rodrigo.almeida@ceruti.com.br" },
  },
  {
    id: "8",
    name: "Fernanda Lima",
    whatsapp: "+55 61 99876-5432",
    status: "Ativo",
    messageCount: 0,
    lastConversation: "Sem registros",
    plansGeneratedMonth: 0,
    history24h: [],
    calendarIntegration: { status: "disconnected" },
  },
  {
    id: "9",
    name: "Gabriel Martins",
    whatsapp: "+55 19 98111-2233",
    status: "Ativo",
    messageCount: 76,
    lastConversation: "Ontem, 17:40",
    plansGeneratedMonth: 39,
    history24h: MOCK_HISTORY_1,
    calendarIntegration: { status: "disconnected" },
  },
  {
    id: "10",
    name: "Larissa Rocha",
    whatsapp: "+55 81 99222-3344",
    status: "Ativo",
    messageCount: 120,
    lastConversation: "Hoje, 11:55",
    plansGeneratedMonth: 68,
    history24h: MOCK_HISTORY_2,
    calendarIntegration: { status: "disconnected" },
  },
  {
    id: "11",
    name: "Matheus Ribeiro",
    whatsapp: "+55 71 98333-4455",
    status: "Ativo",
    messageCount: 64,
    lastConversation: "Ontem, 14:10",
    plansGeneratedMonth: 32,
    history24h: MOCK_HISTORY_1,
    calendarIntegration: { status: "disconnected" },
  },
  {
    id: "12",
    name: "Camila Carvalho",
    whatsapp: "+55 48 99444-5566",
    status: "Ativo",
    messageCount: 98,
    lastConversation: "Hoje, 10:12",
    plansGeneratedMonth: 58,
    history24h: MOCK_HISTORY_2,
    calendarIntegration: { status: "connected", provider: "google", email: "camila.carvalho@ceruti.com.br" },
  },
  {
    id: "13",
    name: "Bruno Henrique",
    whatsapp: "+55 85 98555-6677",
    status: "Ativo",
    messageCount: 112,
    lastConversation: "Hoje, 09:30",
    plansGeneratedMonth: 64,
    history24h: MOCK_HISTORY_1,
    calendarIntegration: { status: "disconnected" },
  },
  {
    id: "14",
    name: "Amanda Duarte",
    whatsapp: "+55 27 99666-7788",
    status: "Ativo",
    messageCount: 83,
    lastConversation: "Ontem, 19:20",
    plansGeneratedMonth: 45,
    history24h: MOCK_HISTORY_2,
    calendarIntegration: { status: "disconnected" },
  },
  {
    id: "15",
    name: "Thiago Mendes",
    whatsapp: "+55 62 98777-8899",
    status: "Ativo",
    messageCount: 0,
    lastConversation: "Sem registros",
    plansGeneratedMonth: 0,
    history24h: [],
    calendarIntegration: { status: "disconnected" },
  },
  {
    id: "16",
    name: "Letícia Ramos",
    whatsapp: "+55 11 97888-9900",
    status: "Ativo",
    messageCount: 150,
    lastConversation: "Hoje, 12:05",
    plansGeneratedMonth: 88,
    history24h: MOCK_HISTORY_1,
    calendarIntegration: { status: "connected", provider: "google", email: "leticia.ramos@ceruti.com.br" },
  },
  {
    id: "17",
    name: "Rafael Barbosa",
    whatsapp: "+55 21 98999-0011",
    status: "Ativo",
    messageCount: 91,
    lastConversation: "Ontem, 18:15",
    plansGeneratedMonth: 52,
    history24h: MOCK_HISTORY_2,
    calendarIntegration: { status: "disconnected" },
  },
  {
    id: "18",
    name: "Patrícia Gomes",
    whatsapp: "+55 31 99000-1122",
    status: "Ativo",
    messageCount: 78,
    lastConversation: "Ontem, 15:40",
    plansGeneratedMonth: 41,
    history24h: MOCK_HISTORY_1,
    calendarIntegration: { status: "disconnected" },
  },
  {
    id: "19",
    name: "Diego Farias",
    whatsapp: "+55 41 98112-2334",
    status: "Ativo",
    messageCount: 109,
    lastConversation: "Hoje, 11:10",
    plansGeneratedMonth: 60,
    history24h: MOCK_HISTORY_2,
    calendarIntegration: { status: "disconnected" },
  },
  {
    id: "20",
    name: "Vanessa Pires",
    whatsapp: "+55 51 99223-3445",
    status: "Ativo",
    messageCount: 68,
    lastConversation: "Ontem, 13:50",
    plansGeneratedMonth: 35,
    history24h: MOCK_HISTORY_1,
    calendarIntegration: { status: "disconnected" },
  },
  {
    id: "21",
    name: "Eduardo Moreira",
    whatsapp: "+55 61 98334-4556",
    status: "Ativo",
    messageCount: 125,
    lastConversation: "Hoje, 10:50",
    plansGeneratedMonth: 74,
    history24h: MOCK_HISTORY_2,
    calendarIntegration: { status: "connected", provider: "google", email: "eduardo.moreira@ceruti.com.br" },
  },
  {
    id: "22",
    name: "Priscila Nogueira",
    whatsapp: "+55 19 99445-5667",
    status: "Ativo",
    messageCount: 0,
    lastConversation: "Sem registros",
    plansGeneratedMonth: 0,
    history24h: [],
    calendarIntegration: { status: "disconnected" },
  },
  {
    id: "23",
    name: "Felipe Castro",
    whatsapp: "+55 81 98556-6778",
    status: "Ativo",
    messageCount: 95,
    lastConversation: "Hoje, 09:15",
    plansGeneratedMonth: 55,
    history24h: MOCK_HISTORY_1,
    calendarIntegration: { status: "disconnected" },
  },
  {
    id: "24",
    name: "Tatiana Azevedo",
    whatsapp: "+55 71 99667-7889",
    status: "Ativo",
    messageCount: 102,
    lastConversation: "Hoje, 11:40",
    plansGeneratedMonth: 61,
    history24h: MOCK_HISTORY_2,
    calendarIntegration: { status: "disconnected" },
  },
  {
    id: "25",
    name: "Vinícius Cardoso",
    whatsapp: "+55 48 98778-8990",
    status: "Ativo",
    messageCount: 88,
    lastConversation: "Ontem, 17:05",
    plansGeneratedMonth: 49,
    history24h: MOCK_HISTORY_1,
    calendarIntegration: { status: "connected", provider: "google", email: "vinicius.cardoso@ceruti.com.br" },
  },
];

interface DashboardProps {
  onLogout: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {
  const [salespeople, setSalespeople] = useState<Salesperson[]>(INITIAL_SALESPEOPLE);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem('ceruti_sidebar_collapsed') === 'true';
    } catch {
      return false;
    }
  });

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('ceruti_sidebar_collapsed', String(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDDIDropdownOpen, setIsDDIDropdownOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDDI, setNewDDI] = useState("+55");
  const [newWhatsapp, setNewWhatsapp] = useState("");
  const [activeTab, setActiveTab] = useState<'visao-geral' | 'equipe' | 'monitoramento' | 'calendario' | 'crm' | 'planos'>(() => {
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        if (params.get('deal') || params.get('tab') === 'crm') return 'crm';
        if (params.get('tab') === 'planos') return 'planos';
        if (params.get('tab') === 'monitoramento') return 'monitoramento';
        if (params.get('tab') === 'calendario') return 'calendario';
        if (params.get('tab') === 'equipe') return 'equipe';
      } catch {
        // ignore
      }
    }
    return 'visao-geral';
  });
  const [historyModalPerson, setHistoryModalPerson] = useState<Salesperson | null>(null);
  const [openActionDropdownId, setOpenActionDropdownId] = useState<string | null>(null);
  const [editingWhatsappPerson, setEditingWhatsappPerson] = useState<Salesperson | null>(null);
  const [deletingPerson, setDeletingPerson] = useState<Salesperson | null>(null);
  const [editDDI, setEditDDI] = useState("+55");
  const [editWhatsapp, setEditWhatsapp] = useState("");
  const [isEditDDIDropdownOpen, setIsEditDDIDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSalespeople = salespeople.filter((s) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return s.name.toLowerCase().includes(q) || s.whatsapp.toLowerCase().includes(q);
  });

  const activeCount = salespeople.filter((s) => s.status === "Ativo").length;
  const usagePercentage = (activeCount / MOCK_PLAN.maxAccesses) * 100;

  const handleDelete = (id: string) => {
    setSalespeople(salespeople.filter((s) => s.id !== id));
    if (openActionDropdownId === id) {
      setOpenActionDropdownId(null);
    }
    if (deletingPerson?.id === id) {
      setDeletingPerson(null);
    }
  };

  const handleOpenEditWhatsapp = (person: Salesperson) => {
    setOpenActionDropdownId(null);
    setEditingWhatsappPerson(person);
    const match = person.whatsapp.match(/^(\+\d{1,4})\s*(.*)$/);
    if (match) {
      setEditDDI(match[1]);
      setEditWhatsapp(match[2]);
    } else {
      setEditDDI("+55");
      setEditWhatsapp(person.whatsapp);
    }
  };

  const handleEditPhoneChange = (val: string) => {
    const raw = val.replace(/\D/g, "");
    if (editDDI === "+55") {
      const ddd = raw.slice(0, 2);
      const p1 = raw.slice(2, 7);
      const p2 = raw.slice(7, 11);
      let res = "";
      if (ddd) res += ddd;
      if (p1) res += ` ${p1}`;
      if (p2) res += `-${p2}`;
      setEditWhatsapp(res);
    } else {
      setEditWhatsapp(raw);
    }
  };

  const handleSaveEditWhatsapp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingWhatsappPerson || !editWhatsapp.trim()) return;
    const fullPhone = `${editDDI} ${editWhatsapp.trim()}`;
    setSalespeople(
      salespeople.map((s) =>
        s.id === editingWhatsappPerson.id ? { ...s, whatsapp: fullPhone } : s
      )
    );
    setEditingWhatsappPerson(null);
    setIsEditDDIDropdownOpen(false);
  };

  const handlePhoneChange = (val: string) => {
    const raw = val.replace(/\D/g, "");
    if (newDDI === "+55") {
      const ddd = raw.slice(0, 2);
      const p1 = raw.slice(2, 7);
      const p2 = raw.slice(7, 11);
      let res = "";
      if (ddd) res += ddd;
      if (p1) res += ` ${p1}`;
      if (p2) res += `-${p2}`;
      setNewWhatsapp(res);
    } else {
      setNewWhatsapp(raw);
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newWhatsapp) return;

    if (activeCount >= MOCK_PLAN.maxAccesses) {
      alert("Limite de acessos do plano atingido.");
      return;
    }

    const newSalesperson: Salesperson = {
      id: Math.random().toString(36).substr(2, 9),
      name: newName,
      whatsapp: `${newDDI} ${newWhatsapp}`,
      status: "Ativo",
      messageCount: 0,
      lastConversation: "Sem registros",
      plansGeneratedMonth: 0,
      history24h: [],
    };

    setSalespeople([...salespeople, newSalesperson]);
    setNewName("");
    setNewWhatsapp("");
    setNewDDI("+55");
    setIsModalOpen(false);
    setIsDDIDropdownOpen(false);
  };

  const navItems = [
    { id: 'visao-geral' as const, label: 'Visão geral', icon: LayoutDashboard },
    { id: 'equipe' as const, label: 'Equipe', icon: Users },
    { id: 'monitoramento' as const, label: 'Monitoramento', icon: Activity },
    { id: 'calendario' as const, label: 'Calendário', icon: Calendar },
    { id: 'crm' as const, label: 'CRM', icon: Briefcase },
    { id: 'planos' as const, label: 'Planos', icon: CreditCard },
  ];

  return (
    <div className="bg-gray-50 flex h-screen w-full overflow-hidden text-slate-800 font-sans">
      <aside
        className={`${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        } bg-white border-r border-slate-200 flex flex-col hidden md:flex transition-[width] duration-300 ease-in-out shrink-0 select-none`}
      >
        {/* Top Header of Sidebar */}
        {isSidebarCollapsed ? (
          <div className="py-4 px-2 flex flex-col items-center space-y-2 border-b border-slate-100">
            <Logo className="w-8 h-8 shrink-0" />
            <button
              type="button"
              onClick={toggleSidebar}
              className="p-1.5 text-slate-400 hover:text-[#00a83e] hover:bg-emerald-50 rounded-lg transition-colors"
              title="Expandir menu lateral"
              aria-label="Expandir menu lateral"
            >
              <PanelLeftOpen className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="p-5 flex items-center justify-between border-b border-slate-100">
            <div className="flex items-center space-x-2.5">
              <Logo className="w-8 h-8 shrink-0" />
              <span className="text-xl font-bold tracking-tight text-slate-900">Ceruti</span>
            </div>
            <button
              type="button"
              onClick={toggleSidebar}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Recolher menu lateral"
              aria-label="Recolher menu lateral"
            >
              <PanelLeftClose className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Navigation Items */}
        <nav className={`flex-1 ${isSidebarCollapsed ? 'px-2 py-4 space-y-2' : 'px-3 py-4 space-y-1'} overflow-y-auto`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            if (isSidebarCollapsed) {
              return (
                <div key={item.id} className="relative group flex justify-center">
                  <button
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    className={`w-11 h-11 flex items-center justify-center rounded-xl transition-all duration-200 active:scale-95 ${
                      isActive
                        ? 'bg-emerald-50 text-[#00a83e] shadow-xs ring-1 ring-emerald-200/60'
                        : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                    aria-label={item.label}
                  >
                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#00a83e]' : 'text-slate-500'}`} />
                  </button>

                  {/* Tooltip on hover */}
                  <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-50 whitespace-nowrap top-1/2 -translate-y-1/2 flex items-center">
                    {item.label}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
                  </div>
                </div>
              );
            }

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium transition-all duration-200 active:scale-95 ${
                  isActive
                    ? 'bg-emerald-50 text-[#00a83e] font-semibold ring-1 ring-emerald-200/50'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${isActive ? 'text-[#00a83e]' : 'text-slate-500'}`} />
                <span className="text-sm truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User Profile and Logout */}
        {isSidebarCollapsed ? (
          <div className="p-3 border-t border-slate-100 flex flex-col items-center space-y-3">
            <div className="relative group">
              <div className="w-9 h-9 rounded-full bg-slate-200 border-2 border-white shadow-xs overflow-hidden flex items-center justify-center shrink-0 cursor-default">
                <div className="bg-slate-400 w-full h-full flex items-center justify-center text-white text-xs font-bold">A</div>
              </div>
              <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-50 whitespace-nowrap top-1/2 -translate-y-1/2 flex items-center">
                Admin &bull; Ceruti
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
              </div>
            </div>
            <div className="relative group">
              <button
                type="button"
                onClick={onLogout}
                className="p-2 text-slate-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                aria-label="Sair"
              >
                <LogOut className="w-4 h-4" />
              </button>
              <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 z-50 whitespace-nowrap top-1/2 -translate-y-1/2 flex items-center">
                Sair
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
              </div>
            </div>
          </div>
        ) : (
          <div className="p-4 border-t border-slate-100 items-center flex justify-between">
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-slate-200 border-2 border-white shadow-xs overflow-hidden flex items-center justify-center shrink-0">
                <div className="bg-slate-400 w-full h-full flex items-center justify-center text-white text-xs font-bold">A</div>
              </div>
              <div className="flex flex-col text-left min-w-0">
                <span className="text-sm font-semibold text-slate-900 truncate">Admin</span>
                <span className="text-xs text-slate-500 truncate">Ceruti</span>
              </div>
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors shrink-0"
              title="Sair do sistema"
              aria-label="Sair"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-[300px] z-0 pointer-events-auto" style={{ maskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 0%, transparent 100%)' }}>
          <Prism
            animationType="rotate"
            timeScale={0.5}
            height={3.5}
            baseWidth={5.5}
            scale={3.6}
            hueShift={0}
            colorFrequency={1}
            noise={0}
            glow={1}
          />
        </div>

        <header className="h-16 bg-white/90 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between shadow-sm shrink-0 relative z-10 transition-colors">
          <div className="flex items-center space-x-2 md:hidden">
            <Logo className="w-8 h-8 shrink-0" />
            <span className="text-lg font-bold tracking-tight text-slate-900 hidden sm:block">Ceruti</span>
          </div>
          <div className="hidden md:flex items-center space-x-3">
            <button
              type="button"
              onClick={toggleSidebar}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              title={isSidebarCollapsed ? "Expandir menu lateral" : "Recolher menu lateral"}
              aria-label={isSidebarCollapsed ? "Expandir menu lateral" : "Recolher menu lateral"}
            >
              {isSidebarCollapsed ? (
                <PanelLeftOpen className="w-5 h-5 text-slate-600" />
              ) : (
                <PanelLeftClose className="w-5 h-5 text-slate-400" />
              )}
            </button>
            <h1 className="text-lg font-bold text-slate-900">
              {activeTab === 'visao-geral'
                ? 'Visão Geral'
                : activeTab === 'equipe'
                ? 'Gestão de Acessos'
                : activeTab === 'monitoramento'
                ? 'Monitoramento Individual dos Colaboradores'
                : activeTab === 'calendario'
                ? 'Integração de Calendário'
                : activeTab === 'planos'
                ? 'Planos e Assinatura'
                : 'Gestão de CRM e Pipeline Agro'}
            </h1>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4 ml-auto">
            {activeTab === 'equipe' && (
              <button
                onClick={() => setIsModalOpen(true)}
                disabled={activeCount >= MOCK_PLAN.maxAccesses}
                className="px-3 sm:px-4 py-2 bg-[#00a83e] text-white rounded-lg text-sm font-semibold shadow-md shadow-emerald-500/20 hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5 disabled:bg-slate-300 disabled:shadow-none disabled:transform-none disabled:cursor-not-allowed transition-all duration-200 active:scale-95 flex items-center space-x-1 sm:space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Adicionar Colaborador</span>
                <span className="inline sm:hidden">Adicionar</span>
              </button>
            )}
            <button onClick={onLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors md:hidden ml-1">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Mobile Tabs */}
        <div className="flex md:hidden border-b border-slate-200 bg-white/90 backdrop-blur-md shrink-0 relative z-10 overflow-x-auto">
          <button 
            onClick={() => setActiveTab('visao-geral')}
            className={`flex-1 min-w-[90px] py-3 text-xs sm:text-sm font-semibold text-center border-b-2 ${activeTab === 'visao-geral' ? 'border-[#00a83e] text-[#00a83e]' : 'border-transparent text-slate-500'}`}
          >
            Visão geral
          </button>
          <button 
            onClick={() => setActiveTab('equipe')}
            className={`flex-1 min-w-[70px] py-3 text-xs sm:text-sm font-semibold text-center border-b-2 ${activeTab === 'equipe' ? 'border-[#00a83e] text-[#00a83e]' : 'border-transparent text-slate-500'}`}
          >
            Equipe
          </button>
          <button 
            onClick={() => setActiveTab('monitoramento')}
            className={`flex-1 min-w-[110px] py-3 text-xs sm:text-sm font-semibold text-center border-b-2 ${activeTab === 'monitoramento' ? 'border-[#00a83e] text-[#00a83e]' : 'border-transparent text-slate-500'}`}
          >
            Monitoramento
          </button>
          <button 
            onClick={() => setActiveTab('calendario')}
            className={`flex-1 min-w-[90px] py-3 text-xs sm:text-sm font-semibold text-center border-b-2 ${activeTab === 'calendario' ? 'border-[#00a83e] text-[#00a83e]' : 'border-transparent text-slate-500'}`}
          >
            Calendário
          </button>
          <button 
            onClick={() => setActiveTab('crm')}
            className={`flex-1 min-w-[70px] py-3 text-xs sm:text-sm font-semibold text-center border-b-2 ${activeTab === 'crm' ? 'border-[#00a83e] text-[#00a83e]' : 'border-transparent text-slate-500'}`}
          >
            CRM
          </button>
          <button 
            onClick={() => setActiveTab('planos')}
            className={`flex-1 min-w-[70px] py-3 text-xs sm:text-sm font-semibold text-center border-b-2 ${activeTab === 'planos' ? 'border-[#00a83e] text-[#00a83e]' : 'border-transparent text-slate-500'}`}
          >
            Planos
          </button>
        </div>

        <div className="p-4 sm:p-8 space-y-6 sm:space-y-8 flex-1 overflow-auto flex flex-col relative z-10">
          {activeTab === 'visao-geral' ? (
            <Overview
              salespeople={salespeople}
              maxAccesses={MOCK_PLAN.maxAccesses}
              onActivateSalesperson={(id) => {
                setSalespeople(
                  salespeople.map((s) => (s.id === id ? { ...s, status: 'Ativo' } : s))
                );
              }}
            />
          ) : activeTab === 'equipe' ? (
            <>
              {/* Highlighted Quota Card (Cota de Uso) */}
              <motion.div 
                initial={{ opacity: 0, y: 12 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="relative overflow-hidden bg-white p-6 sm:p-7 rounded-2xl border border-emerald-100/90 shadow-sm hover:scale-105 hover:shadow-xl hover:z-10 transition-all duration-300 shrink-0 group cursor-default"
              >
                {/* Subtle decorative background glow */}
                <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-emerald-50/70 via-transparent to-transparent pointer-events-none" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  {/* Left Column: Title & active count */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-[#00a83e] border border-emerald-200/60">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#00a83e] mr-1.5 animate-pulse" />
                        Cota de Uso dos Acessos
                      </span>
                    </div>

                    <div className="flex flex-wrap items-baseline gap-3">
                      <h3 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                        {activeCount}
                        <span className="text-lg sm:text-xl font-bold text-slate-400 ml-1">/ {MOCK_PLAN.maxAccesses}</span>
                      </h3>
                      <span className="text-sm font-semibold text-slate-600">
                        colaboradores ativos
                      </span>
                    </div>
                  </div>

                  {/* Right Column: Quick stat chip */}
                  <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
                    <div className="bg-emerald-50/60 border border-emerald-200/70 rounded-xl px-4 py-2.5 text-center min-w-[90px] shadow-2xs">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-700 block mb-0.5">Disponíveis</span>
                      <span className="text-lg font-black text-[#00a83e]">{MOCK_PLAN.maxAccesses - activeCount}</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* WhatsApp Management */}
              <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col flex-1 overflow-visible min-h-0">
                <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gray-50/50 shrink-0">
                  <div className="flex items-center space-x-2.5">
                    <h4 className="font-bold text-slate-900 text-base">Colaboradores Cadastrados</h4>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-[#00a83e] border border-emerald-200/60">
                      {filteredSalespeople.length}
                      {searchQuery.trim() && (
                        <span className="text-slate-400 font-normal ml-1">de {salespeople.length}</span>
                      )}
                    </span>
                  </div>

                  {/* Lupa de busca por colaborador */}
                  <div className="flex items-center space-x-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-72">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar por colaborador ou telefone..."
                        className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00a83e] focus:border-transparent text-slate-900 placeholder:text-slate-400 transition-all shadow-xs"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery("")}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-100 transition-colors"
                          title="Limpar busca"
                          aria-label="Limpar busca"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto flex-1 pb-16">
                  <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead className="bg-gray-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100 sticky top-0 z-10">
                      <tr>
                        <th className="px-5 sm:px-6 py-3.5 whitespace-nowrap">Colaborador</th>
                        <th className="px-5 sm:px-6 py-3.5 whitespace-nowrap">WhatsApp</th>
                        <th className="px-5 sm:px-6 py-3.5 whitespace-nowrap">Último Uso</th>
                        <th className="px-5 sm:px-6 py-3.5 text-right whitespace-nowrap">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      <AnimatePresence>
                        {filteredSalespeople.length === 0 && (
                          <tr>
                            <td colSpan={4} className="px-6 py-12 text-center text-slate-500 text-sm">
                              {searchQuery.trim() ? (
                                <div className="flex flex-col items-center justify-center space-y-2">
                                  <Search className="w-8 h-8 text-slate-300" />
                                  <p className="text-slate-700 font-medium">
                                    Nenhum colaborador encontrado para "{searchQuery}"
                                  </p>
                                  <button
                                    type="button"
                                    onClick={() => setSearchQuery("")}
                                    className="text-xs text-[#00a83e] font-semibold hover:underline"
                                  >
                                    Limpar filtro de busca
                                  </button>
                                </div>
                              ) : (
                                "Nenhum colaborador cadastrado no momento."
                              )}
                            </td>
                          </tr>
                        )}
                        {filteredSalespeople.map((person, index) => {
                          const isNearBottom = index >= filteredSalespeople.length - 1 && filteredSalespeople.length > 1;
                          return (
                            <motion.tr
                              key={person.id}
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              transition={{ duration: 0.2, delay: index * 0.04 }}
                              className="hover:bg-emerald-50/40 transition-colors group cursor-default"
                            >
                              {/* 1. COLABORADOR */}
                              <td className="px-5 sm:px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center space-x-3">
                                  <div className="w-9 h-9 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center border border-slate-200 shrink-0 shadow-xs group-hover:border-emerald-300 group-hover:bg-emerald-50 transition-colors">
                                    {person.name.charAt(0)}
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span className="font-semibold text-slate-900 group-hover:text-emerald-800 transition-colors">
                                      {person.name}
                                    </span>
                                    <span
                                      className={`px-2 py-0.5 text-[10px] font-bold rounded-md uppercase tracking-wider ${
                                        person.status === "Ativo"
                                          ? "bg-emerald-100 text-[#00a83e]"
                                          : "bg-slate-100 text-slate-400"
                                      }`}
                                    >
                                      {person.status}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              {/* 2. WHATSAPP */}
                              <td className="px-5 sm:px-6 py-4 text-slate-600 font-mono text-xs font-medium whitespace-nowrap group-hover:text-emerald-700 transition-colors">
                                <div className="flex items-center space-x-1.5">
                                  <Phone className="w-3 h-3 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                                  <span>{person.whatsapp}</span>
                                </div>
                              </td>

                              {/* 3. ÚLTIMO USO */}
                              <td className="px-5 sm:px-6 py-4 text-slate-600 whitespace-nowrap">
                                <div className="flex items-center space-x-1.5 text-xs font-medium">
                                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                  <span>{person.lastConversation}</span>
                                </div>
                              </td>

                              {/* 4. AÇÃO "3 PONTINHOS" (COM OPÇÕES: ALTERAR WHATSAPP E LIXEIRA EXCLUIR) */}
                              <td className="px-5 sm:px-6 py-4 text-right whitespace-nowrap relative">
                                <div className="inline-block text-left relative">
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setOpenActionDropdownId(
                                        openActionDropdownId === person.id ? null : person.id
                                      );
                                    }}
                                    className={`p-2 rounded-xl transition-all inline-flex items-center justify-center ${
                                      openActionDropdownId === person.id
                                        ? "bg-slate-200 text-slate-900 shadow-xs"
                                        : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                                    }`}
                                    title="Opções do colaborador"
                                    aria-label="Ações do colaborador"
                                  >
                                    <MoreVertical className="w-4 h-4" />
                                  </button>

                                  <AnimatePresence>
                                    {openActionDropdownId === person.id && (
                                      <>
                                        <div
                                          className="fixed inset-0 z-30"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setOpenActionDropdownId(null);
                                          }}
                                        />
                                        <motion.div
                                          initial={{ opacity: 0, scale: 0.95, y: isNearBottom ? 4 : -4 }}
                                          animate={{ opacity: 1, scale: 1, y: 0 }}
                                          exit={{ opacity: 0, scale: 0.95, y: isNearBottom ? 4 : -4 }}
                                          transition={{ duration: 0.12 }}
                                          className={`absolute right-0 w-52 bg-white rounded-2xl shadow-xl shadow-slate-900/15 border border-slate-100 z-40 py-1.5 overflow-hidden text-left ${
                                            isNearBottom ? "bottom-full mb-1 origin-bottom-right" : "top-full mt-1 origin-top-right"
                                          }`}
                                        >
                                          {/* OPÇÃO 1: ALTERAR WHATSAPP */}
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleOpenEditWhatsapp(person);
                                            }}
                                            className="w-full px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-emerald-50/70 hover:text-emerald-700 flex items-center space-x-2.5 transition-colors group"
                                          >
                                            <Pencil className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 transition-colors" />
                                            <span>Alterar WhatsApp</span>
                                          </button>

                                          <div className="my-1 border-t border-slate-100" />

                                          {/* OPÇÃO 2: LIXEIRA DE REMOVER/EXCLUIR */}
                                          <button
                                            type="button"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setOpenActionDropdownId(null);
                                              setDeletingPerson(person);
                                            }}
                                            className="w-full px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center space-x-2.5 transition-colors group"
                                          >
                                            <Trash2 className="w-3.5 h-3.5 text-red-500 group-hover:scale-110 transition-transform" />
                                            <span>Excluir colaborador</span>
                                          </button>
                                        </motion.div>
                                      </>
                                    )}
                                  </AnimatePresence>
                                </div>
                              </td>
                            </motion.tr>
                          );
                        })}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : activeTab === 'monitoramento' ? (
            <SellerMonitoring salespeople={salespeople} />
          ) : activeTab === 'calendario' ? (
            <CalendarView
              salespeople={salespeople}
              onUpdateSalespersonCalendar={(salespersonId, integration) => {
                setSalespeople(
                  salespeople.map((s) =>
                    s.id === salespersonId
                      ? { ...s, calendarIntegration: integration }
                      : s
                  )
                );
              }}
            />
          ) : activeTab === 'planos' ? (
            <PlansView currentCollaboratorCount={salespeople.length} />
          ) : (
            <CRMView salespeople={salespeople} />
          )}

          {/* Versão (1.0.0) no centro inferior do dashboard */}
          <div className="pt-6 pb-2 text-center text-xs font-medium text-slate-400 select-none">
            Versão (1.0.0)
          </div>
        </div>
      </main>

      {/* Botão Flutuante de WhatsApp (67 99819-0294) com mensagem 'Olá, tenho uma dúvida!' */}
      <div className="fixed bottom-5 right-5 z-40 flex items-center group">
        <a
          href="https://api.whatsapp.com/send?phone=5567998190294&text=Ol%C3%A1%2C%20tenho%20uma%20d%C3%BAvida%21"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 bg-[#25D366] hover:bg-[#20ba5a] text-white px-4 py-3 rounded-full shadow-lg shadow-emerald-600/30 hover:shadow-xl hover:shadow-emerald-600/40 hover:-translate-y-0.5 transition-all duration-200 active:scale-95 font-semibold text-sm"
          title="Falar no WhatsApp: (67) 99819-0294"
          aria-label="Falar no WhatsApp com suporte Ceruti"
        >
          <MessageCircle className="w-5 h-5 fill-current" />
          <span className="hidden sm:inline">Suporte Ceruti</span>
        </a>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md relative z-10 border border-slate-100 font-sans"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-900">Novo Acesso</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAdd} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Nome do Colaborador
                    </label>
                    <input
                      type="text"
                      required
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 hover:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-[#00a83e] focus:border-transparent transition-all duration-200 text-slate-900 text-sm"
                      placeholder="Ex: Ana Souza"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                      Número do WhatsApp
                    </label>
                    <div className="flex space-x-2 relative">
                      <div className="relative shrink-0">
                        <button
                          type="button"
                          onClick={() => setIsDDIDropdownOpen(!isDDIDropdownOpen)}
                          className="w-[104px] px-3 py-2.5 rounded-xl border border-slate-200 hover:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-[#00a83e] focus:border-transparent transition-all duration-200 text-slate-900 text-sm bg-white flex items-center justify-between"
                        >
                          <div className="flex items-center space-x-2">
                            <img src={`https://flagcdn.com/w20/${COUNTRIES.find(c => c.code === newDDI)?.flag}.png`} alt="" className="w-5 h-auto object-cover rounded-sm border border-slate-100" />
                            <span className="font-semibold">{newDDI}</span>
                          </div>
                        </button>
                        
                        <AnimatePresence>
                          {isDDIDropdownOpen && (
                            <>
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 z-40"
                                onClick={() => setIsDDIDropdownOpen(false)}
                              />
                              <motion.div
                                initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: 0.15 }}
                                className="absolute top-full left-0 mt-2 w-56 max-h-60 overflow-y-auto bg-white rounded-xl shadow-xl shadow-slate-900/10 border border-slate-100 z-50 py-1"
                              >
                                {COUNTRIES.map(c => (
                                  <button
                                    key={c.code}
                                    type="button"
                                    onClick={() => {
                                      setNewDDI(c.code);
                                      setNewWhatsapp("");
                                      setIsDDIDropdownOpen(false);
                                    }}
                                    className={`w-full px-4 py-2.5 flex items-center space-x-3 hover:bg-slate-50 transition-colors text-sm text-left ${newDDI === c.code ? 'bg-emerald-50/50' : ''}`}
                                  >
                                    <img src={`https://flagcdn.com/w20/${c.flag}.png`} alt={c.name} className="w-5 h-auto object-cover rounded-sm border border-slate-100" />
                                    <div className="flex flex-col">
                                      <span className="font-semibold text-slate-700 leading-tight">{c.code}</span>
                                      <span className="text-[10px] text-slate-500 leading-tight">{c.name}</span>
                                    </div>
                                  </button>
                                ))}
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>
                      <input
                        type="tel"
                        required
                        value={newWhatsapp}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-[#00a83e] focus:border-transparent transition-all duration-200 text-slate-900 text-sm font-mono placeholder:font-sans"
                        placeholder={newDDI === "+55" ? "11 9XXXX-XXXX" : "Número"}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 font-semibold transition-colors text-sm"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#00a83e] hover:bg-emerald-700 hover:shadow-lg hover:-translate-y-0.5 text-white font-semibold shadow-md shadow-emerald-500/20 transition-all duration-200 text-sm"
                  >
                    Salvar Acesso
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit WhatsApp Modal */}
      <AnimatePresence>
        {editingWhatsappPerson && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
              onClick={() => {
                setEditingWhatsappPerson(null);
                setIsEditDDIDropdownOpen(false);
              }}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative z-10 border border-slate-100"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#00a83e] flex items-center justify-center">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Alterar WhatsApp</h3>
                    <p className="text-xs text-slate-500">{editingWhatsappPerson.name}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingWhatsappPerson(null);
                    setIsEditDDIDropdownOpen(false);
                  }}
                  className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-50 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEditWhatsapp}>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Novo Número de WhatsApp
                  </label>
                  <div className="flex space-x-2 relative">
                    <div className="relative shrink-0">
                      <button
                        type="button"
                        onClick={() => setIsEditDDIDropdownOpen(!isEditDDIDropdownOpen)}
                        className="w-[104px] px-3 py-2.5 rounded-xl border border-slate-200 hover:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-[#00a83e] focus:border-transparent transition-all duration-200 text-slate-900 text-sm bg-white flex items-center justify-between"
                      >
                        <div className="flex items-center space-x-2">
                          <img
                            src={`https://flagcdn.com/w20/${COUNTRIES.find(c => c.code === editDDI)?.flag || 'br'}.png`}
                            alt=""
                            className="w-5 h-auto object-cover rounded-sm border border-slate-100"
                          />
                          <span className="font-semibold">{editDDI}</span>
                        </div>
                      </button>

                      <AnimatePresence>
                        {isEditDDIDropdownOpen && (
                          <>
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              className="fixed inset-0 z-40"
                              onClick={() => setIsEditDDIDropdownOpen(false)}
                            />
                            <motion.div
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -5 }}
                              transition={{ duration: 0.15 }}
                              className="absolute top-full left-0 mt-2 w-56 max-h-60 overflow-y-auto bg-white rounded-xl shadow-xl shadow-slate-900/10 border border-slate-100 z-50 py-1"
                            >
                              {COUNTRIES.map((c) => (
                                <button
                                  key={c.code}
                                  type="button"
                                  onClick={() => {
                                    setEditDDI(c.code);
                                    setEditWhatsapp("");
                                    setIsEditDDIDropdownOpen(false);
                                  }}
                                  className={`w-full px-4 py-2.5 flex items-center space-x-3 hover:bg-slate-50 transition-colors text-sm text-left ${
                                    editDDI === c.code ? "bg-emerald-50/50" : ""
                                  }`}
                                >
                                  <img
                                    src={`https://flagcdn.com/w20/${c.flag}.png`}
                                    alt={c.name}
                                    className="w-5 h-auto object-cover rounded-sm border border-slate-100"
                                  />
                                  <div className="flex flex-col">
                                    <span className="font-semibold text-slate-700 leading-tight">
                                      {c.code}
                                    </span>
                                    <span className="text-[10px] text-slate-500 leading-tight">
                                      {c.name}
                                    </span>
                                  </div>
                                </button>
                              ))}
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                    <input
                      type="tel"
                      required
                      value={editWhatsapp}
                      onChange={(e) => handleEditPhoneChange(e.target.value)}
                      className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-[#00a83e] focus:border-transparent transition-all duration-200 text-slate-900 text-sm font-mono placeholder:font-sans"
                      placeholder={editDDI === "+55" ? "11 9XXXX-XXXX" : "Número"}
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingWhatsappPerson(null);
                      setIsEditDDIDropdownOpen(false);
                    }}
                    className="px-5 py-2.5 rounded-xl hover:bg-slate-50 text-slate-700 font-semibold transition-colors text-sm"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-[#00a83e] hover:bg-emerald-700 hover:shadow-lg hover:-translate-y-0.5 text-white font-semibold shadow-md shadow-emerald-500/20 transition-all duration-200 text-sm"
                  >
                    Salvar Alteração
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deletingPerson && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
              onClick={() => setDeletingPerson(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl relative z-10 border border-slate-100 text-center"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Excluir Colaborador</h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-2">
                Tem certeza que deseja remover o acesso de <strong className="text-slate-800">{deletingPerson.name}</strong> ({deletingPerson.whatsapp})?
              </p>
              <div className="mt-6 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setDeletingPerson(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl hover:bg-slate-100 text-slate-700 font-semibold transition-colors text-sm"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(deletingPerson.id)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold shadow-md shadow-red-500/20 transition-all text-sm"
                >
                  Confirmar Exclusão
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* History Modal */}
      <AnimatePresence>
        {historyModalPerson && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
              onClick={() => setHistoryModalPerson(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative z-10 w-full max-w-sm flex flex-col rounded-[2.5rem] sm:rounded-[3rem] border-[6px] sm:border-[8px] border-slate-900 shadow-2xl bg-[#e5ddd5] h-[80vh] sm:h-[600px] overflow-hidden"
              style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")', backgroundSize: '100px' }}
            >
              <div className="absolute top-0 inset-x-0 h-6 bg-slate-900 rounded-b-2xl w-32 mx-auto z-20"></div>

              {/* WhatsApp Header Mockup */}
              <div className="bg-[#075e54] pt-8 pb-3 px-4 flex items-center text-white shrink-0 shadow-md relative z-10">
                <button onClick={() => setHistoryModalPerson(null)} className="mr-2 hover:bg-white/10 rounded-full p-1 transition-colors">
                  <X className="w-5 h-5" />
                </button>
                <div className="w-9 h-9 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold mr-3 overflow-hidden shadow-sm">
                   {historyModalPerson.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                   <h4 className="font-semibold text-sm leading-tight text-white truncate">{historyModalPerson.name}</h4>
                   <span className="text-[10px] text-emerald-100 truncate block">{historyModalPerson.whatsapp}</span>
                </div>
              </div>

              {/* Chat Area Mockup */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 relative z-0">
                 {historyModalPerson.history24h.length === 0 ? (
                   <div className="bg-[#fff5c4] text-slate-700 text-xs text-center p-2 rounded-lg mx-auto w-3/4 shadow-sm mt-4">
                     Nenhuma mensagem nas últimas 24h
                   </div>
                 ) : (
                   historyModalPerson.history24h.map((msg) => (
                     <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}>
                       <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm shadow-sm relative ${
                         msg.sender === 'user' 
                           ? 'bg-white text-slate-800 rounded-tl-none' 
                           : 'bg-[#dcf8c6] text-slate-800 rounded-tr-none'
                       }`}>
                         <p className="pr-10 leading-snug">{msg.text}</p>
                         <span className="text-[9px] text-slate-500 absolute bottom-1 right-2">{msg.timestamp}</span>
                       </div>
                     </div>
                   ))
                 )}
              </div>
              
              <div className="p-2 shrink-0 bg-[#f0f0f0] flex items-center justify-center shadow-inner relative z-10">
                <div className="bg-white rounded-full w-full py-2 px-4 shadow-sm text-xs text-slate-400">
                  Mensagem
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
