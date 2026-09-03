import React, { useState } from "react";
import {
  LogOut,
  Plus,
  Trash2,
  Bot,
  Activity,
  Users,
  X,
  CreditCard,
  Smartphone,
  MessageSquare,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Salesperson, PlanInfo, ChatMessage } from "../types";
import { Logo } from "./Logo";
import Prism from "./Prism";

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
  maxAccesses: 10,
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
    history24h: MOCK_HISTORY_1,
  },
  {
    id: "2",
    name: "Maria Oliveira",
    whatsapp: "+55 11 91234-5678",
    status: "Ativo",
    messageCount: 89,
    lastConversation: "Ontem, 18:45",
    history24h: MOCK_HISTORY_2,
  },
  {
    id: "3",
    name: "Carlos Sousa",
    whatsapp: "+55 21 99999-8888",
    status: "Inativo",
    messageCount: 0,
    lastConversation: "Sem registros",
    history24h: [],
  },
];

interface DashboardProps {
  onLogout: () => void;
}

export function Dashboard({ onLogout }: DashboardProps) {
  const [salespeople, setSalespeople] = useState<Salesperson[]>(INITIAL_SALESPEOPLE);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDDIDropdownOpen, setIsDDIDropdownOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDDI, setNewDDI] = useState("+55");
  const [newWhatsapp, setNewWhatsapp] = useState("");
  const [activeTab, setActiveTab] = useState<'equipe' | 'monitoramento'>('equipe');
  const [historyModalPerson, setHistoryModalPerson] = useState<Salesperson | null>(null);

  const activeCount = salespeople.filter((s) => s.status === "Ativo").length;
  const usagePercentage = (activeCount / MOCK_PLAN.maxAccesses) * 100;

  const handleDelete = (id: string) => {
    setSalespeople(salespeople.filter((s) => s.id !== id));
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
      history24h: [],
    };

    setSalespeople([...salespeople, newSalesperson]);
    setNewName("");
    setNewWhatsapp("");
    setNewDDI("+55");
    setIsModalOpen(false);
    setIsDDIDropdownOpen(false);
  };

  return (
    <div className="bg-gray-50 flex h-screen w-full overflow-hidden text-slate-800 font-sans">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col hidden md:flex">
        <div className="p-6 flex items-center space-x-2">
          <Logo className="w-8 h-8 shrink-0" />
          <span className="text-xl font-bold tracking-tight text-slate-900">Ceruti</span>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          <button 
            onClick={() => setActiveTab('equipe')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 active:scale-95 ${activeTab === 'equipe' ? 'bg-emerald-50 text-[#00a83e]' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900/80'}`}
          >
            <Users className="w-5 h-5" />
            <span>Equipe</span>
          </button>
          <button 
            onClick={() => setActiveTab('monitoramento')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 active:scale-95 ${activeTab === 'monitoramento' ? 'bg-emerald-50 text-[#00a83e]' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900/80'}`}
          >
            <Activity className="w-5 h-5" />
            <span>Monitoramento</span>
          </button>
        </nav>
        <div className="p-6 border-t border-slate-100 items-center flex justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white shadow-sm overflow-hidden flex items-center justify-center">
              <div className="bg-slate-400 w-full h-full flex items-center justify-center text-white text-xs">A</div>
            </div>
            <div className="flex flex-col text-left">
              <span className="text-sm font-semibold text-slate-900">Admin</span>
              <span className="text-xs text-slate-500">Ceruti</span>
            </div>
          </div>
          <button onClick={onLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
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
          <h1 className="text-lg font-bold text-slate-900 hidden md:block">
            {activeTab === 'equipe' ? 'Gestão de Acessos' : 'Monitoramento de Conversas'}
          </h1>
          <div className="flex items-center space-x-2 sm:space-x-4 ml-auto">
            {activeTab === 'equipe' && (
              <button
                onClick={() => setIsModalOpen(true)}
                disabled={activeCount >= MOCK_PLAN.maxAccesses}
                className="px-3 sm:px-4 py-2 bg-[#00a83e] text-white rounded-lg text-sm font-semibold shadow-md shadow-emerald-500/20 hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5 disabled:bg-slate-300 disabled:shadow-none disabled:transform-none disabled:cursor-not-allowed transition-all duration-200 active:scale-95 flex items-center space-x-1 sm:space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Adicionar Vendedor</span>
                <span className="inline sm:hidden">Adicionar</span>
              </button>
            )}
            <button onClick={onLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors md:hidden ml-1">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Mobile Tabs */}
        <div className="flex md:hidden border-b border-slate-200 bg-white/90 backdrop-blur-md shrink-0 relative z-10">
          <button 
            onClick={() => setActiveTab('equipe')}
            className={`flex-1 py-3 text-sm font-semibold text-center border-b-2 ${activeTab === 'equipe' ? 'border-[#00a83e] text-[#00a83e]' : 'border-transparent text-slate-500'}`}
          >
            Equipe
          </button>
          <button 
            onClick={() => setActiveTab('monitoramento')}
            className={`flex-1 py-3 text-sm font-semibold text-center border-b-2 ${activeTab === 'monitoramento' ? 'border-[#00a83e] text-[#00a83e]' : 'border-transparent text-slate-500'}`}
          >
            Monitoramento
          </button>
        </div>

        <div className="p-4 sm:p-8 space-y-6 sm:space-y-8 flex-1 overflow-auto flex flex-col relative z-10">
          {activeTab === 'equipe' ? (
            <>
              {/* Top Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 shrink-0">
                {/* Plan Card */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-emerald-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Plano Atual</p>
                    <h3 className="text-2xl font-bold text-slate-900">{MOCK_PLAN.name}</h3>
                    <p className="text-xs text-[#0070f3] font-medium">Renovação: 01/Dez/2026</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-[#0070f3]">
                    <CreditCard className="w-6 h-6" />
                  </div>
                </motion.div>

                {/* Quota Card */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-200 hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cota de Uso</p>
                    <span className="text-xs font-bold text-slate-900">{activeCount} de {MOCK_PLAN.maxAccesses} acessos</span>
                  </div>
                  
                  <div className="w-full bg-slate-100 h-2.5 rounded-full mb-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${usagePercentage}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full rounded-full ${usagePercentage >= 100 ? 'bg-red-500' : 'bg-[#00a83e]'}`}
                    ></motion.div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    Você pode adicionar mais {MOCK_PLAN.maxAccesses - activeCount} vendedores.
                  </p>
                </motion.div>
              </div>

              {/* WhatsApp Management */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col flex-1 overflow-hidden min-h-0">
                <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gray-50/50 shrink-0">
                  <h4 className="font-bold text-slate-900">Vendedores Cadastrados</h4>
                </div>

                <div className="overflow-x-auto flex-1">
                  <table className="w-full text-left border-collapse min-w-[500px]">
                    <thead className="bg-gray-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100 sticky top-0 z-10">
                      <tr>
                        <th className="px-5 sm:px-6 py-3 whitespace-nowrap">Nome do Vendedor</th>
                        <th className="px-5 sm:px-6 py-3 whitespace-nowrap">Número WhatsApp</th>
                        <th className="px-5 sm:px-6 py-3 whitespace-nowrap">Status</th>
                        <th className="px-5 sm:px-6 py-3 text-right whitespace-nowrap">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      <AnimatePresence>
                        {salespeople.length === 0 && (
                          <tr>
                            <td colSpan={4} className="px-6 py-8 text-center text-slate-500 text-sm">
                              Nenhum vendedor cadastrado ainda.
                            </td>
                          </tr>
                        )}
                        {salespeople.map((person) => (
                          <motion.tr
                            key={person.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                            className="hover:bg-emerald-50/50 transition-colors group cursor-default"
                          >
                            <td className="px-5 sm:px-6 py-4 font-semibold text-slate-900 whitespace-nowrap group-hover:text-emerald-800 transition-colors">
                              {person.name}
                            </td>
                            <td className="px-5 sm:px-6 py-4 text-slate-600 font-mono whitespace-nowrap group-hover:text-emerald-700 transition-colors">
                              {person.whatsapp}
                            </td>
                            <td className="px-5 sm:px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 py-1 text-[10px] font-bold rounded-md uppercase ${
                                person.status === "Ativo"
                                  ? "bg-emerald-100 text-[#00a83e]"
                                  : "bg-slate-100 text-slate-400"
                              }`}>
                                {person.status}
                              </span>
                            </td>
                            <td className="px-5 sm:px-6 py-4 text-right whitespace-nowrap">
                              <button
                                onClick={() => handleDelete(person.id)}
                                className="text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 inline-flex items-center justify-center p-1.5"
                                title="Remover acesso"
                              >
                                <Trash2 className="w-5 h-5 transition-transform group-hover:scale-110" />
                              </button>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col flex-1 overflow-hidden min-h-0">
              <div className="px-5 sm:px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gray-50/50 shrink-0">
                <h4 className="font-bold text-slate-900">Monitoramento de Conversas</h4>
              </div>

              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead className="bg-gray-50 text-slate-400 text-[10px] font-bold uppercase tracking-widest border-b border-slate-100 sticky top-0 z-10">
                    <tr>
                      <th className="px-5 sm:px-6 py-3 whitespace-nowrap">Vendedor</th>
                      <th className="px-5 sm:px-6 py-3 whitespace-nowrap text-center">Mensagens Trocadas</th>
                      <th className="px-5 sm:px-6 py-3 whitespace-nowrap">Última Conversa</th>
                      <th className="px-5 sm:px-6 py-3 text-right whitespace-nowrap">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm">
                    {salespeople.map((person) => (
                      <motion.tr
                        key={person.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-emerald-50/50 transition-colors group cursor-default"
                      >
                        <td className="px-5 sm:px-6 py-4 whitespace-nowrap">
                          <p className="font-semibold text-slate-900 group-hover:text-emerald-800 transition-colors">{person.name}</p>
                          <p className="text-xs text-slate-500 font-mono mt-0.5 group-hover:text-emerald-700 transition-colors">{person.whatsapp}</p>
                        </td>
                        <td className="px-5 sm:px-6 py-4 text-center whitespace-nowrap font-medium text-slate-700">
                          {person.messageCount}
                        </td>
                        <td className="px-5 sm:px-6 py-4 whitespace-nowrap text-slate-600">
                          {person.lastConversation}
                        </td>
                        <td className="px-5 sm:px-6 py-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => setHistoryModalPerson(person)}
                            className="bg-emerald-50 text-[#00a83e] hover:bg-emerald-600 hover:text-white hover:shadow-md hover:-translate-y-0.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 inline-flex items-center"
                          >
                            <MessageSquare className="w-4 h-4 mr-1.5" />
                            Ver Histórico
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>

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
                      Nome do Vendedor
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
