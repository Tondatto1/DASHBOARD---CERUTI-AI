import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Calendar,
  Search,
  MessageSquare,
  Sparkles,
  Copy,
  Check,
  Clock,
  ShieldAlert,
  ChevronRight,
  Wifi,
  BatteryMedium,
  CheckCircle2,
  ExternalLink,
  Filter,
  User,
  Bot
} from 'lucide-react';
import { Salesperson, ConversationSession, ChatMessage } from '../types';

interface TabletChatModalProps {
  salesperson: Salesperson;
  isOpen: boolean;
  onClose: () => void;
  initialSessionId?: string;
}

export function TabletChatModal({
  salesperson,
  isOpen,
  onClose,
  initialSessionId,
}: TabletChatModalProps) {
  const sessions = salesperson.sessions || [];
  
  // Filtro de data
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('todas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSessionId, setSelectedSessionId] = useState<string>(
    initialSessionId || (sessions[0]?.id ?? '')
  );
  const [copiedPlanId, setCopiedPlanId] = useState<string | null>(null);

  // Extrair datas disponíveis
  const availableDates = useMemo(() => {
    const dates = new Map<string, string>();
    sessions.forEach((s) => {
      dates.set(s.date, s.dateLabel);
    });
    return Array.from(dates.entries()).map(([date, label]) => ({ date, label }));
  }, [sessions]);

  // Filtrar sessões
  const filteredSessions = useMemo(() => {
    return sessions.filter((s) => {
      const matchDate = selectedDateFilter === 'todas' || s.date === selectedDateFilter;
      const matchQuery =
        searchQuery.trim() === '' ||
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.objection.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.clientContext.toLowerCase().includes(searchQuery.toLowerCase());
      return matchDate && matchQuery;
    });
  }, [sessions, selectedDateFilter, searchQuery]);

  // Sessão ativa
  const currentSession = useMemo(() => {
    const found = filteredSessions.find((s) => s.id === selectedSessionId);
    return found || filteredSessions[0] || sessions[0] || null;
  }, [filteredSessions, selectedSessionId, sessions]);

  // Copiar plano gerado
  const handleCopyPlan = (msg: ChatMessage) => {
    navigator.clipboard.writeText(msg.text);
    setCopiedPlanId(msg.id);
    setTimeout(() => {
      setCopiedPlanId(null);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
        {/* Backdrop escuro com blur cinematográfico */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-slate-950/75 backdrop-blur-md transition-opacity"
          onClick={onClose}
        />

        {/* ================= CORPO DO TABLET ================= */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 30 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 w-full max-w-5xl h-[90vh] max-h-[820px] rounded-[2.5rem] border-[10px] border-slate-900 bg-slate-900 shadow-[0_25px_70px_rgba(0,0,0,0.55)] flex flex-col overflow-hidden select-none"
        >
          {/* Reflexo metálico no topo da moldura do Tablet */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-slate-700/40 to-transparent pointer-events-none z-30" />

          {/* Câmera frontal e sensor central do Tablet */}
          <div className="absolute top-1.5 left-1/2 -translate-x-1/2 flex items-center space-x-2 z-30 pointer-events-none">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-800 border border-slate-700/70 shadow-inner" />
            <span className="w-1.5 h-1.5 rounded-full bg-slate-800/80" />
          </div>

          {/* Barra de Status do Sistema Tablet (iPad / Android Tablet style) */}
          <div className="h-7 bg-slate-900 px-6 flex items-center justify-between text-[11px] font-semibold text-slate-400 shrink-0 z-20">
            <div className="flex items-center space-x-3">
              <span className="text-white font-bold">10:54</span>
            </div>
            <div className="flex items-center space-x-3 text-slate-300">
              <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 hidden sm:inline">
                {salesperson.name}
              </span>
              <Wifi className="w-3.5 h-3.5" />
              <div className="flex items-center space-x-1">
                <span className="text-[10px]">96%</span>
                <BatteryMedium className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          {/* ================= TELA INTERNA DO TABLET ================= */}
          <div className="flex-1 bg-white rounded-b-[1.9rem] flex flex-col overflow-hidden text-slate-900 relative">
            {/* Barra de cabeçalho do App dentro do Tablet */}
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shadow-xs">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-bold tracking-tight text-white">
                      Histórico Ampliado de Conversas & Planos
                    </h3>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Registros completos das consultas de <strong className="text-slate-200">{salesperson.name}</strong> com a IA Ceruti
                  </p>
                </div>
              </div>

              {/* Botão de Fechar o Tablet */}
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                title="Fechar visualizador"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Layout em 2 Colunas do Tablet: Lista de Sessões / Conversas (Esquerda) + Chat Aberto (Direita) */}
            <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
              
              {/* ================= COLUNA ESQUERDA: LISTA DE SESSÕES & FILTRO DE DATA ================= */}
              <div className="w-full md:w-80 lg:w-92 border-r border-slate-200 bg-slate-50/80 flex flex-col shrink-0 min-h-0">
                {/* Cabeçalho do Vendedor & Filtros */}
                <div className="p-4 border-b border-slate-200/80 space-y-3 bg-white shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                      <div className="w-9 h-9 rounded-full bg-[#00a83e] text-white font-black text-sm flex items-center justify-center shadow-xs">
                        {salesperson.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900 leading-snug">{salesperson.name}</h4>
                        <p className="text-[11px] text-slate-500 font-mono">{salesperson.whatsapp}</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-[#00a83e] border border-emerald-200/80">
                      {sessions.length} sessões
                    </span>
                  </div>

                  {/* Filtro de Data Interativo */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
                      <span className="flex items-center space-x-1">
                        <Calendar className="w-3 h-3 text-[#00a83e]" />
                        <span>Filtro de Data</span>
                      </span>
                      {selectedDateFilter !== 'todas' && (
                        <button
                          type="button"
                          onClick={() => setSelectedDateFilter('todas')}
                          className="text-[10px] text-[#00a83e] hover:underline cursor-pointer"
                        >
                          Limpar filtro
                        </button>
                      )}
                    </label>
                    <div className="relative">
                      <select
                        value={selectedDateFilter}
                        onChange={(e) => setSelectedDateFilter(e.target.value)}
                        className="w-full pl-3 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:ring-2 focus:ring-[#00a83e] focus:border-transparent outline-none cursor-pointer appearance-none shadow-2xs"
                      >
                        <option value="todas">Todas as datas disponíveis ({sessions.length})</option>
                        {availableDates.map((item) => (
                          <option key={item.date} value={item.date}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                      <Filter className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Busca textual de conversas */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Buscar por cliente ou objeção..."
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-[#00a83e] focus:border-transparent outline-none shadow-2xs"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Lista de Sessões Gravadas */}
                <div className="flex-1 overflow-y-auto p-2.5 space-y-2">
                  {filteredSessions.length === 0 ? (
                    <div className="p-6 text-center text-slate-400">
                      <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
                      <p className="text-xs font-semibold text-slate-600">Nenhuma conversa encontrada</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Tente alterar o filtro de data ou busca.</p>
                    </div>
                  ) : (
                    filteredSessions.map((session) => {
                      const isSelected = currentSession?.id === session.id;
                      return (
                        <button
                          key={session.id}
                          type="button"
                          onClick={() => setSelectedSessionId(session.id)}
                          className={`w-full text-left p-3 rounded-xl transition-all border cursor-pointer ${
                            isSelected
                              ? 'bg-white border-[#00a83e] shadow-sm shadow-emerald-500/10 ring-1 ring-[#00a83e]'
                              : 'bg-white/70 border-slate-200/80 hover:bg-white hover:border-slate-300'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="text-[10px] font-bold text-slate-400 flex items-center space-x-1">
                              <Clock className="w-2.5 h-2.5 text-slate-400" />
                              <span>{session.time} • {session.date.split('-').slice(1).reverse().join('/')}</span>
                            </span>
                            {session.plansGenerated > 0 && (
                              <span className="inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-md text-[9px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200">
                                <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                                <span>{session.plansGenerated} Plano</span>
                              </span>
                            )}
                          </div>

                          <h5 className="text-xs font-bold text-slate-900 leading-snug line-clamp-1">
                            {session.title}
                          </h5>

                          <div className="mt-1.5 flex items-center justify-between gap-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-600 truncate max-w-[170px]">
                              {session.objection}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-400 shrink-0">
                              {session.messages.length} msgs
                            </span>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* ================= COLUNA DIREITA: VISUALIZADOR AMPLO DE CHAT ================= */}
              <div className="flex-1 flex flex-col bg-[#efeae2] min-h-0 relative overflow-hidden"
                style={{
                  backgroundImage: 'radial-gradient(#0000000d 1px, transparent 1px)',
                  backgroundSize: '16px 16px',
                }}
              >
                {currentSession ? (
                  /* Área de Mensagens com Visualização de Tablet Ampla */
                  <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                    {/* Marcador de Data no Chat */}
                    <div className="flex justify-center">
                      <span className="bg-white/80 backdrop-blur-xs text-slate-600 border border-slate-200/80 text-[11px] font-bold px-3 py-1 rounded-full shadow-2xs">
                        {currentSession.dateLabel}
                      </span>
                    </div>

                    {/* Balões de Mensagem */}
                    {currentSession.messages.map((msg) => {
                        const isUser = msg.sender === 'user';
                        return (
                          <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className={`flex ${isUser ? 'justify-start' : 'justify-end'}`}
                          >
                            <div
                              className={`max-w-[88%] sm:max-w-[78%] rounded-2xl p-4 shadow-sm relative transition-all ${
                                isUser
                                  ? 'bg-white text-slate-900 rounded-tl-xs border border-slate-200/80'
                                  : msg.isPlan
                                  ? 'bg-gradient-to-br from-emerald-50 via-white to-emerald-50/70 border-2 border-[#00a83e]/50 text-slate-900 rounded-tr-xs shadow-md shadow-emerald-500/10'
                                  : 'bg-[#dcf8c6] text-slate-900 rounded-tr-xs border border-emerald-200/60'
                              }`}
                            >
                              {/* Rótulo de Remetente */}
                              <div className="flex items-center justify-between gap-3 mb-1.5">
                                <div className="flex items-center space-x-1.5">
                                  {isUser ? (
                                    <span className="text-[11px] font-bold text-slate-700 flex items-center space-x-1">
                                      <User className="w-3 h-3 text-slate-400" />
                                      <span>{salesperson.name}</span>
                                    </span>
                                  ) : (
                                    <span className="text-[11px] font-extrabold text-[#00a83e] flex items-center space-x-1">
                                      <Sparkles className="w-3 h-3 text-[#00a83e]" />
                                      <span>Agente de Inteligência Comercial Ceruti</span>
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-slate-400 font-medium">
                                  {msg.timestamp}
                                </span>
                              </div>

                              {/* Conteúdo da Mensagem */}
                              {msg.isPlan ? (
                                <div className="space-y-3 mt-2">
                                  <div className="bg-white p-3 rounded-xl border border-emerald-200/90 shadow-2xs">
                                    <div className="flex items-center justify-between mb-2">
                                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#00a83e] text-white">
                                        <Sparkles className="w-2.5 h-2.5 mr-1" />
                                        Plano de Argumentação Gerado
                                      </span>
                                      {msg.objectionTag && (
                                        <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                                          Objeção: {msg.objectionTag}
                                        </span>
                                      )}
                                    </div>
                                    <h5 className="font-extrabold text-sm text-slate-900 mb-2">
                                      {msg.planTitle || 'Estratégia Recomendada'}
                                    </h5>
                                    <p className="text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                                      {msg.text}
                                    </p>

                                    {/* Táticas Chave */}
                                    {msg.tactics && msg.tactics.length > 0 && (
                                      <div className="mt-3 pt-3 border-t border-slate-100">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                                          Pilares Táticos:
                                        </span>
                                        <div className="flex flex-wrap gap-1.5">
                                          {msg.tactics.map((tactic, i) => (
                                            <span
                                              key={i}
                                              className="text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md"
                                            >
                                              ✓ {tactic}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </div>

                                  {/* Botão de Copiar Argumento */}
                                  <button
                                    type="button"
                                    onClick={() => handleCopyPlan(msg)}
                                    className="w-full py-2 px-3 rounded-xl bg-[#00a83e] hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-sm transition-all cursor-pointer"
                                  >
                                    {copiedPlanId === msg.id ? (
                                      <>
                                        <Check className="w-4 h-4" />
                                        <span>Plano de Argumentos Copiado com Sucesso!</span>
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="w-4 h-4" />
                                        <span>Copiar Plano de Argumentos</span>
                                      </>
                                    )}
                                  </button>
                                </div>
                              ) : (
                                <p className="text-xs sm:text-sm text-slate-800 whitespace-pre-line leading-relaxed">
                                  {msg.text}
                                </p>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500">
                    <MessageSquare className="w-12 h-12 text-slate-400 mb-3 opacity-40" />
                    <h4 className="font-bold text-slate-700 text-sm">Selecione uma sessão ao lado</h4>
                    <p className="text-xs text-slate-400 max-w-sm mt-1">
                      Escolha uma das conversas no menu lateral para visualizar todos os diálogos e planos gerados.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Barra inferior de navegação do Tablet (Home Bar) */}
            <div className="h-4 bg-slate-900 flex items-center justify-center shrink-0">
              <div className="w-36 h-1 bg-slate-600/70 rounded-full" />
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
