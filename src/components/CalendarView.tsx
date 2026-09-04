import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  CalendarCheck,
  CalendarClock,
  CheckCircle2,
  RefreshCw,
  Unlink,
  ExternalLink,
  Search,
  Mail,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  X,
  Clock,
  Smartphone,
  Check,
  Copy,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Salesperson } from "../types";

interface CalendarViewProps {
  salespeople: Salesperson[];
  onUpdateSalespersonCalendar: (
    salespersonId: string,
    integration: Salesperson["calendarIntegration"]
  ) => void;
}

export function CalendarView({
  salespeople,
  onUpdateSalespersonCalendar,
}: CalendarViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"todos" | "conectados" | "pendentes">("todos");
  const [selectedPersonForModal, setSelectedPersonForModal] = useState<Salesperson | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<"google" | "outlook" | "apple">("google");
  const [calendarEmail, setCalendarEmail] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [syncingPersonId, setSyncingPersonId] = useState<string | null>(null);
  const [copiedLinkPersonId, setCopiedLinkPersonId] = useState<string | null>(null);
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setFeedbackToast(message);
    setTimeout(() => {
      setFeedbackToast(null);
    }, 3500);
  };

  const filteredList = salespeople.filter((person) => {
    const matchesSearch =
      person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      person.whatsapp.toLowerCase().includes(searchQuery.toLowerCase());

    const isConnected = person.calendarIntegration?.status === "connected";
    if (filterStatus === "conectados") return matchesSearch && isConnected;
    if (filterStatus === "pendentes") return matchesSearch && !isConnected;
    return matchesSearch;
  });

  const totalConnected = salespeople.filter(
    (s) => s.calendarIntegration?.status === "connected"
  ).length;

  const handleOpenModal = (person: Salesperson) => {
    setSelectedPersonForModal(person);
    setSelectedProvider(person.calendarIntegration?.provider || "google");
    const suggestedEmail =
      person.calendarIntegration?.email ||
      `${person.name.toLowerCase().replace(/\s+/g, ".")}@ceruti.com.br`;
    setCalendarEmail(suggestedEmail);
  };

  const handleConnectCalendar = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPersonForModal) return;

    setIsConnecting(true);
    setTimeout(() => {
      onUpdateSalespersonCalendar(selectedPersonForModal.id, {
        status: "connected",
        provider: selectedProvider,
        email: calendarEmail.trim() || `${selectedPersonForModal.name.toLowerCase().replace(/\s+/g, ".")}@gmail.com`,
        connectedAt: "Hoje, " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        lastSync: "Agora mesmo",
      });
      setIsConnecting(false);
      showToast(`Calendário integrado com sucesso para ${selectedPersonForModal.name}!`);
      setSelectedPersonForModal(null);
    }, 900);
  };

  const handleDisconnect = (person: Salesperson) => {
    onUpdateSalespersonCalendar(person.id, {
      status: "disconnected",
    });
    showToast(`Integração de calendário removida para ${person.name}.`);
  };

  const handleSyncNow = (person: Salesperson) => {
    setSyncingPersonId(person.id);
    setTimeout(() => {
      onUpdateSalespersonCalendar(person.id, {
        ...person.calendarIntegration,
        status: "connected",
        lastSync: "Agora mesmo",
      });
      setSyncingPersonId(null);
      showToast(`Agenda de ${person.name} sincronizada com sucesso!`);
    }, 1000);
  };

  const handleCopyInviteLink = (person: Salesperson) => {
    const inviteUrl = `${window.location.origin}/integrar-calendario?user=${encodeURIComponent(person.id)}`;
    navigator.clipboard?.writeText(inviteUrl);
    setCopiedLinkPersonId(person.id);
    showToast(`Link de integração copiado para enviar ao vendedor ${person.name}!`);
    setTimeout(() => {
      setCopiedLinkPersonId(null);
    }, 3000);
  };

  return (
    <div className="space-y-6 sm:space-y-8 flex-1">
      {/* Toast Notification */}
      <AnimatePresence>
        {feedbackToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center space-x-3 text-sm border border-slate-700/80"
          >
            <div className="w-6 h-6 rounded-full bg-[#00a83e] flex items-center justify-center text-white shrink-0">
              <Check className="w-3.5 h-3.5" />
            </div>
            <span className="font-medium">{feedbackToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Cards & Context Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {/* Card 1: Total Integrados */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-sm hover:scale-105 hover:shadow-xl relative hover:z-10 transition-all duration-300 flex flex-col justify-between cursor-default"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Status das Integrações
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#00a83e] border border-emerald-200/60 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                {totalConnected}
              </span>
              <span className="text-base font-bold text-slate-400">
                / {salespeople.length} usuários
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              {totalConnected === salespeople.length
                ? "100% da equipe com calendário conectado"
                : `${salespeople.length - totalConnected} usuário(s) aguardando conexão`}
            </p>
          </div>
        </motion.div>

        {/* Card 2: Provedores Compatíveis */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/90 shadow-sm hover:scale-105 hover:shadow-xl relative hover:z-10 transition-all duration-300 flex flex-col justify-between cursor-default"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Provedores Suportados
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-200/60 flex items-center justify-center">
              <CalendarIcon className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center space-x-2 text-sm font-bold text-slate-800">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs">
                Google Agenda
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs">
                Outlook 365
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-2 font-medium">
              Sincronização bidirecional de reuniões e compromissos
            </p>
          </div>
        </motion.div>

        {/* Card 3: Assistente Ceruti IA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-emerald-500/[0.08] via-white to-emerald-50/40 rounded-2xl p-5 sm:p-6 border-2 border-emerald-500/40 shadow-sm hover:scale-105 hover:shadow-xl relative hover:z-10 transition-all duration-300 flex flex-col justify-between cursor-default"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#00a83e] uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Automação Comercial
            </span>
            <div className="w-10 h-10 rounded-xl bg-[#00a83e] text-white shadow-sm flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-sm font-bold text-slate-800 block">
              Agendamentos pelo WhatsApp
            </span>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              O bot Ceruti consulta horários livres e reserva reuniões diretamente na agenda do vendedor.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Main List Section */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-7 space-y-6">
        {/* Title, Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
              <CalendarClock className="w-5 h-5 text-[#00a83e]" />
              <span>Vendedores e Integração de Calendário</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Habilite a sincronização da agenda para cada membro cadastrado no painel
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Buscar vendedor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-56 pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00a83e]/30 focus:border-[#00a83e]"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 text-xs">
              <button
                type="button"
                onClick={() => setFilterStatus("todos")}
                className={`py-1 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterStatus === "todos"
                    ? "bg-white text-[#00a83e] shadow-xs font-extrabold border border-emerald-100"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Todos ({salespeople.length})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus("conectados")}
                className={`py-1 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterStatus === "conectados"
                    ? "bg-white text-[#00a83e] shadow-xs font-extrabold border border-emerald-100"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Conectados ({totalConnected})
              </button>
              <button
                type="button"
                onClick={() => setFilterStatus("pendentes")}
                className={`py-1 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterStatus === "pendentes"
                    ? "bg-white text-[#00a83e] shadow-xs font-extrabold border border-emerald-100"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Pendentes ({salespeople.length - totalConnected})
              </button>
            </div>
          </div>
        </div>

        {/* Salespeople Calendar List */}
        {filteredList.length === 0 ? (
          <div className="py-12 text-center">
            <CalendarIcon className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-700">Nenhum vendedor encontrado</p>
            <p className="text-xs text-slate-400 mt-1">Tente ajustar os termos da busca ou os filtros acima.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredList.map((person) => {
              const isConnected = person.calendarIntegration?.status === "connected";
              const isSyncing = syncingPersonId === person.id;
              const hasCopied = copiedLinkPersonId === person.id;

              return (
                <div
                  key={person.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isConnected
                      ? "bg-emerald-500/[0.03] border-emerald-200/80 hover:border-emerald-300 shadow-xs"
                      : "bg-white border-slate-200/90 hover:border-slate-300 shadow-xs"
                  }`}
                >
                  {/* Left: User Info & Avatar */}
                  <div className="flex items-center space-x-3.5 min-w-[240px]">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-slate-200 to-slate-100 border-2 border-white shadow-xs flex items-center justify-center font-bold text-slate-700 text-sm">
                        {person.name
                          .split(" ")
                          .slice(0, 2)
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()}
                      </div>
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                          isConnected ? "bg-[#00a83e]" : "bg-amber-400"
                        }`}
                        title={isConnected ? "Calendário Ativo" : "Pendente de Conexão"}
                      />
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="text-base font-bold text-slate-900">{person.name}</h4>
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                            person.status === "Ativo"
                              ? "bg-emerald-100/70 text-emerald-800"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {person.status}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-xs text-slate-500 mt-0.5">
                        <Smartphone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{person.whatsapp}</span>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Integration Details or Status Callout */}
                  <div className="flex-1 md:px-6">
                    {isConnected ? (
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-xs">
                        <div className="flex items-center space-x-2">
                          <span className="w-2 h-2 rounded-full bg-[#00a83e] animate-pulse" />
                          <span className="font-extrabold text-[#00a83e] flex items-center space-x-1">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-0.5" />
                            <span>Conectado ao {person.calendarIntegration?.provider === "outlook" ? "Outlook" : "Google Agenda"}</span>
                          </span>
                        </div>

                        {person.calendarIntegration?.email && (
                          <div className="flex items-center space-x-1.5 text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200/80">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span className="font-medium text-slate-700 truncate max-w-[200px]">
                              {person.calendarIntegration.email}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center space-x-1 text-slate-400">
                          <Clock className="w-3 h-3" />
                          <span>Último sync: {person.calendarIntegration?.lastSync || "Hoje"}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 text-xs text-amber-700 bg-amber-50/70 border border-amber-200/60 px-3 py-1.5 rounded-xl w-fit">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Calendário não vinculado. Reuniões agendadas não constarão na agenda pessoal deste vendedor.</span>
                      </div>
                    )}
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center space-x-2 shrink-0 self-end md:self-center">
                    {isConnected ? (
                      <>
                        <button
                          type="button"
                          onClick={() => handleSyncNow(person)}
                          disabled={isSyncing}
                          className="px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 shadow-2xs hover:shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
                          title="Sincronizar compromissos agora"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isSyncing ? "animate-spin text-[#00a83e]" : ""}`} />
                          <span>{isSyncing ? "Sincronizando..." : "Sincronizar"}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDisconnect(person)}
                          className="px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:text-red-700 bg-red-50/60 hover:bg-red-50 border border-red-200/60 transition-all flex items-center space-x-1.5 cursor-pointer"
                          title="Desconectar calendário"
                        >
                          <Unlink className="w-3.5 h-3.5" />
                          <span>Desconectar</span>
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => handleCopyInviteLink(person)}
                          className="px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 transition-all flex items-center space-x-1.5 cursor-pointer"
                          title="Copiar link para enviar ao vendedor"
                        >
                          {hasCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-[#00a83e]" />
                              <span className="text-[#00a83e]">Copiado!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-slate-400" />
                              <span>Link de convite</span>
                            </>
                          )}
                        </button>

                        {/* O BOTÃO SOLICITADO PELO USUÁRIO: Joao Silva [Integrar ao calendário] */}
                        <button
                          type="button"
                          onClick={() => handleOpenModal(person)}
                          className="px-4 py-2 bg-[#00a83e] hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 flex items-center space-x-1.5 cursor-pointer"
                        >
                          <CalendarIcon className="w-3.5 h-3.5" />
                          <span>Integrar ao calendário</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal de Integração de Calendário */}
      <AnimatePresence>
        {selectedPersonForModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm"
              onClick={() => setSelectedPersonForModal(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative z-10 border border-slate-100 overflow-hidden font-sans"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center space-x-2">
                    <CalendarIcon className="w-5 h-5 text-[#00a83e]" />
                    <span>Integrar ao Calendário</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Vendedor: <span className="font-bold text-slate-800">{selectedPersonForModal.name}</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedPersonForModal(null)}
                  className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body / Form */}
              <form onSubmit={handleConnectCalendar} className="p-6 space-y-5">
                {/* Provedor de Agenda */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Selecione o Serviço de Calendário
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedProvider("google")}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        selectedProvider === "google"
                          ? "border-[#00a83e] bg-emerald-50/50 ring-2 ring-[#00a83e]/20"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">Google Agenda</span>
                        {selectedProvider === "google" && (
                          <div className="w-4 h-4 rounded-full bg-[#00a83e] text-white flex items-center justify-center">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 mt-1">Google Workspace & Gmail</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedProvider("outlook")}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        selectedProvider === "outlook"
                          ? "border-[#00a83e] bg-emerald-50/50 ring-2 ring-[#00a83e]/20"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">Outlook 365</span>
                        {selectedProvider === "outlook" && (
                          <div className="w-4 h-4 rounded-full bg-[#00a83e] text-white flex items-center justify-center">
                            <Check className="w-2.5 h-2.5" />
                          </div>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 mt-1">Microsoft Office 365</span>
                    </button>
                  </div>
                </div>

                {/* E-mail da Conta de Calendário */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    E-mail da Agenda do Vendedor
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="email"
                      required
                      placeholder="ex: vendedor@empresa.com.br"
                      value={calendarEmail}
                      onChange={(e) => setCalendarEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00a83e]/30 focus:border-[#00a83e]"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    O convite de autorização e os eventos comerciais serão vinculados a este e-mail.
                  </p>
                </div>

                {/* Recursos habilitados */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <span className="text-xs font-bold text-slate-800 block">O que esta integração ativa:</span>
                  <ul className="text-xs text-slate-600 space-y-1.5">
                    <li className="flex items-center space-x-2">
                      <Check className="w-3.5 h-3.5 text-[#00a83e] shrink-0" />
                      <span>Agendamento automático de reuniões pelo WhatsApp</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-3.5 h-3.5 text-[#00a83e] shrink-0" />
                      <span>Consulta de disponibilidade sem conflitos de horário</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-3.5 h-3.5 text-[#00a83e] shrink-0" />
                      <span>Lembretes e follow-ups de propostas sincronizados</span>
                    </li>
                  </ul>
                </div>

                {/* Submit Action */}
                <div className="pt-2 flex items-center justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setSelectedPersonForModal(null)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isConnecting}
                    className="px-5 py-2.5 bg-[#00a83e] hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center space-x-2 cursor-pointer disabled:opacity-60"
                  >
                    {isConnecting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Conectando...</span>
                      </>
                    ) : (
                      <>
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Conectar Calendário Agora</span>
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
