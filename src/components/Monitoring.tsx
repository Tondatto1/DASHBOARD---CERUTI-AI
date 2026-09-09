import { useState, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Users,
  Calendar,
  Sparkles,
  TrendingUp,
  MessageSquare,
  ShieldAlert,
  Clock,
  Filter,
  CheckCircle2,
  ChevronRight,
  Activity,
  Flame,
  Zap,
  Tablet,
  Search,
  ArrowUpRight,
  Target,
  BarChart3,
  CalendarRange,
  X,
  AlertTriangle,
  Lightbulb,
  Award,
  ChevronDown,
  Phone,
  Check
} from 'lucide-react';
import { Salesperson, UsagePoint, ObjectionData, ConversationSession } from '../types';
import { enrichSalespersonWithMonitoring } from '../data/monitoringData';
import { TabletChatModal } from './TabletChatModal';

interface MonitoringProps {
  salespeople: Salesperson[];
}

export function Monitoring({ salespeople }: MonitoringProps) {
  // Enriquecer vendedores com telemetria analítica individual
  const enrichedSalespeople = useMemo(() => {
    return salespeople.map((p) => enrichSalespersonWithMonitoring(p));
  }, [salespeople]);

  // Vendedor selecionado atualmente
  const [selectedSalespersonId, setSelectedSalespersonId] = useState<string>(
    enrichedSalespeople[0]?.id || '1'
  );

  // Estados para o Seletor Moderno de Vendedor com Busca (Lupa)
  const [isSellerDropdownOpen, setIsSellerDropdownOpen] = useState<boolean>(false);
  const [sellerSearchTerm, setSellerSearchTerm] = useState<string>('');
  const sellerDropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Fechar seletor ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sellerDropdownRef.current && !sellerDropdownRef.current.contains(event.target as Node)) {
        setIsSellerDropdownOpen(false);
      }
    }
    if (isSellerDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Focar automaticamente no campo de pesquisa
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSellerDropdownOpen]);

  // Lista de vendedores filtrados pela barra de busca
  const filteredSalespeople = useMemo(() => {
    const q = sellerSearchTerm.toLowerCase().trim();
    if (!q) return enrichedSalespeople;
    return enrichedSalespeople.filter(
      (person) =>
        person.name.toLowerCase().includes(q) ||
        person.whatsapp.toLowerCase().includes(q)
    );
  }, [enrichedSalespeople, sellerSearchTerm]);

  const currentSalesperson = useMemo(() => {
    return (
      enrichedSalespeople.find((p) => p.id === selectedSalespersonId) ||
      enrichedSalespeople[0]
    );
  }, [enrichedSalespeople, selectedSalespersonId]);

  // Filtro de período para os gráficos de atividade (7 dias, 15 dias, 30 dias, personalizado)
  const [periodFilter, setPeriodFilter] = useState<'7' | '15' | '30' | 'custom'>('7');
  const [customDays, setCustomDays] = useState<number>(14);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<string>('2026-08-20');
  const [endDate, setEndDate] = useState<string>('2026-09-04');

  // Filtro de período para o card de Quantidade de Planos
  const [plansPeriodFilter, setPlansPeriodFilter] = useState<'7' | '15' | '30' | 'custom'>('30');
  const [plansCustomDays, setPlansCustomDays] = useState<number>(14);
  const [isPlansDatePickerOpen, setIsPlansDatePickerOpen] = useState<boolean>(false);
  const [plansStartDate, setPlansStartDate] = useState<string>('2026-08-20');
  const [plansEndDate, setPlansEndDate] = useState<string>('2026-09-04');

  // Aplicar intervalo customizado para Planos
  const handleApplyPlansCustomDates = () => {
    if (plansStartDate && plansEndDate) {
      const start = new Date(plansStartDate);
      const end = new Date(plansEndDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setPlansCustomDays(Math.min(30, Math.max(1, diffDays)));
      setPlansPeriodFilter('custom');
      setIsPlansDatePickerOpen(false);
    }
  };

  // Cálculo dinâmico de planos gerados conforme o período
  const currentPlansData = useMemo(() => {
    const monthlyBase = currentSalesperson.plansGeneratedMonth || 82;
    if (plansPeriodFilter === '7') {
      return {
        count: Math.round((monthlyBase / 30) * 7) || 19,
        label: 'nos últimos 7 dias',
      };
    }
    if (plansPeriodFilter === '15') {
      return {
        count: Math.round((monthlyBase / 30) * 15) || 41,
        label: 'nos últimos 15 dias',
      };
    }
    if (plansPeriodFilter === '30') {
      return {
        count: monthlyBase,
        label: 'neste mês (30 dias)',
      };
    }
    return {
      count: Math.max(1, Math.round((monthlyBase / 30) * plansCustomDays)),
      label: `em ${plansCustomDays} dias`,
    };
  }, [currentSalesperson.plansGeneratedMonth, plansPeriodFilter, plansCustomDays]);

  // Estado para o Tablet Modal
  const [isTabletModalOpen, setIsTabletModalOpen] = useState<boolean>(false);
  const [targetSessionId, setTargetSessionId] = useState<string | undefined>(undefined);

  // Estado para filtro de severidade no mapa de objeções (Todas, Alta, Média, Baixa)
  const [objectionSeverityFilter, setObjectionSeverityFilter] = useState<'all' | 'alta' | 'media' | 'baixa'>('all');

  // Contadores e lista filtrada de objeções por severidade
  const severityCounts = useMemo(() => {
    const list = currentSalesperson.objections || [];
    return {
      all: list.length,
      alta: list.filter((o) => o.severity === 'alta').length,
      media: list.filter((o) => o.severity === 'media').length,
      baixa: list.filter((o) => o.severity === 'baixa').length,
    };
  }, [currentSalesperson.objections]);

  const filteredObjections = useMemo(() => {
    const list = currentSalesperson.objections || [];
    if (objectionSeverityFilter === 'all') return list;
    return list.filter((o) => o.severity === objectionSeverityFilter);
  }, [currentSalesperson.objections, objectionSeverityFilter]);

  // Filtrar os pontos de dados da linha do tempo conforme o período selecionado
  const timelineData = useMemo(() => {
    const fullTimeline = currentSalesperson.usageTimeline || [];
    let sliceCount = 7;
    if (periodFilter === '15') sliceCount = 15;
    if (periodFilter === '30') sliceCount = 30;
    if (periodFilter === 'custom') sliceCount = Math.min(fullTimeline.length, Math.max(3, customDays));

    return fullTimeline.slice(-sliceCount);
  }, [currentSalesperson.usageTimeline, periodFilter, customDays]);

  // Métricas agregadas do período selecionado
  const periodMetrics = useMemo(() => {
    const totalInteractions = timelineData.reduce((acc, curr) => acc + curr.interactionsCount, 0);
    const totalPlans = timelineData.reduce((acc, curr) => acc + curr.plansCount, 0);
    const avgInteractions = timelineData.length > 0 ? (totalInteractions / timelineData.length).toFixed(1) : '0';
    const avgPlans = timelineData.length > 0 ? (totalPlans / timelineData.length).toFixed(1) : '0';
    const maxInteractions = Math.max(...timelineData.map((d) => d.interactionsCount), 1);
    const daysActive = timelineData.filter((d) => d.interactionsCount > 0).length;

    // Horários de maior uso no período
    const allHours = timelineData.flatMap((d) => d.activeHours);
    const morningCount = allHours.filter((h) => {
      const hour = parseInt(h.split(':')[0], 10);
      return hour >= 8 && hour < 12;
    }).length;
    const afternoonCount = allHours.filter((h) => {
      const hour = parseInt(h.split(':')[0], 10);
      return hour >= 12 && hour < 18;
    }).length;
    const nightCount = allHours.filter((h) => {
      const hour = parseInt(h.split(':')[0], 10);
      return hour >= 18;
    }).length;

    return {
      totalInteractions,
      totalPlans,
      avgInteractions,
      avgPlans,
      maxInteractions,
      daysActive,
      morningCount,
      afternoonCount,
      nightCount,
    };
  }, [timelineData]);

  // Aplicar intervalo customizado
  const handleApplyCustomDates = () => {
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      setCustomDays(Math.min(30, Math.max(3, diffDays)));
      setPeriodFilter('custom');
      setIsDatePickerOpen(false);
    }
  };

  const handleOpenTablet = (sessionId?: string) => {
    setTargetSessionId(sessionId);
    setIsTabletModalOpen(true);
  };

  // Animações para a página
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.07 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 sm:space-y-8 flex-1 flex flex-col pb-8"
    >
      {/* ================= BARRA SUPERIOR: SELETOR DE VENDEDOR & AÇÕES RÁPIDAS ================= */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
      >
        {/* Lado Esquerdo: Identificação do Colaborador e Switcher Moderno */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3.5">
          <div className="relative" ref={sellerDropdownRef}>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Colaborador em Análise Individual:
            </span>
            
            <div className="flex items-center space-x-2">
              {/* Botão Gatilho Moderno */}
              <button
                type="button"
                onClick={() => {
                  setIsSellerDropdownOpen(!isSellerDropdownOpen);
                  setSellerSearchTerm('');
                }}
                className={`min-w-[270px] sm:min-w-[310px] px-3.5 py-2 bg-slate-50 hover:bg-white border rounded-2xl flex items-center justify-between gap-3 text-left transition-all shadow-2xs group cursor-pointer ${
                  isSellerDropdownOpen
                    ? 'border-[#00a83e] ring-2 ring-[#00a83e]/15 bg-white'
                    : 'border-slate-200 hover:border-[#00a83e]/70'
                }`}
              >
                <div className="flex items-center space-x-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#00a83e] to-emerald-700 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-2xs">
                    {currentSalesperson.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <span className="text-sm font-bold text-slate-900 group-hover:text-[#00a83e] transition-colors truncate block">
                      {currentSalesperson.name}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono block truncate">
                      {currentSalesperson.whatsapp}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 shrink-0">
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isSellerDropdownOpen ? 'rotate-180 text-[#00a83e]' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                </div>
              </button>

              <div className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-emerald-50 text-[#00a83e] border border-emerald-200/70 text-xs font-bold shrink-0">
                <span className="w-2 h-2 rounded-full bg-[#00a83e] animate-pulse" />
                <span>{currentSalesperson.status}</span>
              </div>
            </div>

            {/* Menu Popover Flutuante com Lupa de Pesquisa */}
            <AnimatePresence>
              {isSellerDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.15, ease: 'easeOut' }}
                  className="absolute top-full left-0 mt-2 z-50 w-full sm:w-[360px] bg-white rounded-2xl shadow-2xl border border-slate-200 p-2.5 flex flex-col overflow-hidden"
                >
                  {/* Campo de Pesquisa com Lupa */}
                  <div className="relative mb-2">
                    <Search className="w-4 h-4 text-[#00a83e] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={sellerSearchTerm}
                      onChange={(e) => setSellerSearchTerm(e.target.value)}
                      placeholder="Pesquisar por nome ou telefone..."
                      className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00a83e]/20 focus:border-[#00a83e] focus:bg-white transition-all"
                    />
                    {sellerSearchTerm && (
                      <button
                        type="button"
                        onClick={() => setSellerSearchTerm('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Cabeçalho informativo */}
                  <div className="px-2 py-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5 mb-1">
                    <span>Equipe</span>
                    <span className="text-slate-500 font-semibold">
                      {filteredSalespeople.length} {filteredSalespeople.length === 1 ? 'colaborador' : 'colaboradores'}
                    </span>
                  </div>

                  {/* Lista com Rolagem Suave */}
                  <div className="max-h-64 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                    {filteredSalespeople.map((person) => {
                      const isSelected = person.id === selectedSalespersonId;
                      return (
                        <button
                          key={person.id}
                          type="button"
                          onClick={() => {
                            setSelectedSalespersonId(person.id);
                            setIsSellerDropdownOpen(false);
                          }}
                          className={`w-full p-2.5 rounded-xl flex items-center justify-between gap-2.5 text-left transition-all ${
                            isSelected
                              ? 'bg-emerald-50 text-[#00a83e] border border-emerald-200/80 font-bold shadow-2xs'
                              : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5 min-w-0">
                            <div
                              className={`w-7 h-7 rounded-lg font-black text-xs flex items-center justify-center shrink-0 shadow-2xs ${
                                isSelected
                                  ? 'bg-[#00a83e] text-white'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {person.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <span
                                className={`text-xs block truncate ${
                                  isSelected ? 'font-black text-[#00a83e]' : 'font-bold text-slate-800'
                                }`}
                              >
                                {person.name}
                              </span>
                              <span className="text-[11px] text-slate-400 font-mono block truncate">
                                {person.whatsapp}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center space-x-1.5 shrink-0">
                            {person.plansGeneratedMonth !== undefined && person.plansGeneratedMonth > 0 && (
                              <span className="hidden sm:inline-block text-[10px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-md">
                                {person.plansGeneratedMonth} planos
                              </span>
                            )}
                            {isSelected && (
                              <Check className="w-4 h-4 text-[#00a83e] shrink-0" />
                            )}
                          </div>
                        </button>
                      );
                    })}

                    {filteredSalespeople.length === 0 && (
                      <div className="py-6 text-center text-xs text-slate-400 font-medium">
                        <Search className="w-6 h-6 text-slate-300 mx-auto mb-1.5" />
                        <p className="text-slate-600 font-bold">Nenhum colaborador encontrado</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          Não encontramos resultados para "{sellerSearchTerm}"
                        </p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="h-8 w-px bg-slate-200 hidden sm:block mx-1" />

          {/* Resumo Rápido do Colaborador */}
          <div className="flex items-center gap-3 text-xs text-slate-600">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase font-bold">Última Conversa</span>
              <span className="font-semibold text-slate-700">{currentSalesperson.lastConversation}</span>
            </div>
          </div>
        </div>

        {/* Lado Direito: BOTÃO DESTAQUE DO POP-UP TABLET */}
        <div className="flex items-center space-x-3 shrink-0">
          <button
            type="button"
            onClick={() => handleOpenTablet()}
            className="w-full sm:w-auto px-4 py-3 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 hover:from-slate-800 hover:to-slate-700 text-white font-bold text-sm sm:text-base flex items-center justify-center space-x-2.5 shadow-md shadow-slate-900/10 hover:shadow-lg transition-all cursor-pointer group"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform shrink-0">
              <Tablet className="w-4 h-4" />
            </div>
            <span className="leading-tight font-bold">Abrir histórico de conversas</span>
          </button>
        </div>
      </motion.div>

      {/* ================= DOBRA 1: KPI DE QUANTIDADE DE PLANOS & FILTRO TEMPORAL ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* KPI 1: QUANTIDADE DE PLANOS DE ARGUMENTOS GERADOS (COM FILTRO PADRÃO) */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-5 bg-gradient-to-br from-emerald-500/[0.08] via-white to-emerald-50/40 rounded-2xl p-6 sm:p-7 border-2 border-emerald-500/40 shadow-md shadow-emerald-500/5 hover:border-emerald-500 hover:scale-105 hover:shadow-xl relative hover:z-10 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-default"
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-400/15 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10" />

          {/* Cabeçalho com Título, Ícone e Filtro de Período Padrão */}
          <div>
            <div className="flex items-start justify-between gap-3 mb-3">
              <h3 className="text-base sm:text-lg font-extrabold text-slate-800 leading-snug">
                Quantidade de Planos de Argumentos Gerados
              </h3>
              <div className="w-11 h-11 rounded-xl bg-[#00a83e] text-white flex items-center justify-center shadow-md shadow-emerald-500/30 shrink-0">
                <Target className="w-5 h-5" />
              </div>
            </div>

            {/* Filtro Padrão de Período */}
            <div className="flex items-center space-x-1.5 bg-slate-100/90 backdrop-blur-xs p-1 rounded-xl border border-slate-200/80 text-xs w-fit">
              {(['7', '15', '30'] as const).map((period) => (
                <button
                  key={period}
                  type="button"
                  onClick={() => {
                    setPlansPeriodFilter(period);
                    setIsPlansDatePickerOpen(false);
                  }}
                  className={`py-1 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    plansPeriodFilter === period
                      ? 'bg-white text-[#00a83e] shadow-xs font-extrabold border border-emerald-100'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {period} dias
                </button>
              ))}

              {/* Botão de Data Personalizada com Popover */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsPlansDatePickerOpen(!isPlansDatePickerOpen)}
                  className={`py-1 px-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer ${
                    plansPeriodFilter === 'custom'
                      ? 'bg-white text-[#00a83e] shadow-xs font-extrabold border border-emerald-100'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{plansPeriodFilter === 'custom' ? `${plansCustomDays}d` : 'Personalizado'}</span>
                </button>

                {/* Popover de Data Personalizada */}
                {isPlansDatePickerOpen && (
                  <div className="absolute left-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-40 text-xs">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                      <span className="font-bold text-slate-900 flex items-center space-x-1.5">
                        <CalendarRange className="w-3.5 h-3.5 text-[#00a83e]" />
                        <span>Janela Personalizada</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsPlansDatePickerOpen(false)}
                        className="text-slate-400 hover:text-slate-600 p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">De:</label>
                        <input
                          type="date"
                          value={plansStartDate}
                          onChange={(e) => setPlansStartDate(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Até:</label>
                        <input
                          type="date"
                          value={plansEndDate}
                          onChange={(e) => setPlansEndDate(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleApplyPlansCustomDates}
                        className="w-full py-2 rounded-xl bg-[#00a83e] hover:bg-emerald-600 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                      >
                        Aplicar Intervalo
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Área Central com Número e Rótulo Dinâmico */}
          <div className="my-auto py-5 sm:py-6 flex flex-col justify-center">
            <span className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight text-slate-900 leading-none">
              {currentPlansData.count}
            </span>
            <span className="text-sm sm:text-base font-bold text-slate-500 mt-2 sm:mt-3 leading-normal">
              planos gerados {currentPlansData.label}
            </span>
          </div>
        </motion.div>

        {/* CONTROLES DE FILTRO DE DATA E CARDS COMPLEMENTARES DIDÁTICOS */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:scale-105 hover:shadow-xl relative hover:z-10 transition-all duration-300 p-6 flex flex-col justify-between cursor-default"
        >
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100">
              <div>
                <h4 className="font-bold text-slate-900 text-base">
                  Atividade no Período
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Escolha quantos dias deseja ver para entender a rotina de uso do colaborador
                </p>
              </div>

              {/* Botões de Seleção de Janela */}
              <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200/80 text-xs">
                {(['7', '15', '30'] as const).map((period) => (
                  <button
                    key={period}
                    type="button"
                    onClick={() => {
                      setPeriodFilter(period);
                      setIsDatePickerOpen(false);
                    }}
                    className={`py-1 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      periodFilter === period
                        ? 'bg-white text-[#00a83e] shadow-xs font-extrabold border border-emerald-100'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {period} dias
                  </button>
                ))}

                {/* Botão de Data Personalizada com Popover */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                    className={`py-1 px-2.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer ${
                      periodFilter === 'custom'
                        ? 'bg-white text-[#00a83e] shadow-xs font-extrabold border border-emerald-100'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{periodFilter === 'custom' ? `${customDays}d` : 'Personalizado'}</span>
                  </button>

                  {/* Popover de Data Personalizada */}
                  {isDatePickerOpen && (
                    <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-40 text-xs">
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                        <span className="font-bold text-slate-900 flex items-center space-x-1.5">
                          <CalendarRange className="w-3.5 h-3.5 text-[#00a83e]" />
                          <span>Janela Personalizada</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsDatePickerOpen(false)}
                          className="text-slate-400 hover:text-slate-600 p-1"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="space-y-2.5">
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">De:</label>
                          <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Até:</label>
                          <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleApplyCustomDates}
                          className="w-full py-2 rounded-xl bg-[#00a83e] hover:bg-emerald-600 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                        >
                          Aplicar Intervalo
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Diagnóstico Rápido e Didático da Utilização do Vendedor no Período */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mt-4">
              {/* Card 1: Dias que trabalhou */}
              <div className="p-3.5 rounded-xl bg-blue-50/40 border border-blue-100 flex flex-col justify-between">
                <div className="flex items-center space-x-2.5 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-700">Dias com atividade</span>
                </div>
                <div>
                  <span className="text-2xl font-black text-slate-900 block">{periodMetrics.daysActive} de {timelineData.length} dias</span>
                  <span className="text-[11px] text-blue-700 font-medium mt-0.5 block">
                    {periodMetrics.daysActive === timelineData.length
                      ? 'Entrou todos os dias'
                      : `${Math.round((periodMetrics.daysActive / timelineData.length) * 100)}% dos dias do período`}
                  </span>
                </div>
              </div>

              {/* Card 2: Média por dia */}
              <div className="p-3.5 rounded-xl bg-amber-50/40 border border-amber-100 flex flex-col justify-between">
                <div className="flex items-center space-x-2.5 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-700">Média por dia</span>
                </div>
                <div>
                  <span className="text-2xl font-black text-slate-900 block">{periodMetrics.avgInteractions} / dia</span>
                  <span className="text-[11px] text-slate-500 mt-0.5 block">Média de conversas diárias</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span className="text-slate-400 font-medium">Resumo do colaborador</span>
            <span className="font-bold text-slate-700">Mostrando os últimos {timelineData.length} dias de uso</span>
          </div>
        </motion.div>
      </div>

      {/* ================= DOBRA 2: MAPA DE OBJEÇÕES ================= */}
      <div className="w-full">

        {/* KPI 2: MAPA DE OBJEÇÕES (QUAIS AS OBJEÇÕES OS COLABORADORES ESTÃO TRAZENDO?) */}
        <motion.div
          variants={itemVariants}
          className="w-full bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:scale-105 hover:shadow-xl relative hover:z-10 transition-all duration-300 p-6 flex flex-col justify-between cursor-default"
        >
          <div>
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-6 border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-2.5">
                <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0" />
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    Mapa de Objeções Trazidas pelo Colaborador
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Filtre por nível de severidade para identificar pontos críticos
                  </p>
                </div>
              </div>

              {/* 3 Filtros de Severidade (Alta, Média, Baixa) + Todas */}
              <div className="flex items-center flex-wrap gap-1.5 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80">
                <button
                  type="button"
                  onClick={() => setObjectionSeverityFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                    objectionSeverityFilter === 'all'
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                  title="Ver todas as categorias de objeções"
                >
                  <span>Todas</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                      objectionSeverityFilter === 'all'
                        ? 'bg-slate-100 text-slate-700'
                        : 'bg-slate-200/70 text-slate-500'
                    }`}
                  >
                    {severityCounts.all}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setObjectionSeverityFilter(
                      objectionSeverityFilter === 'alta' ? 'all' : 'alta'
                    )
                  }
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                    objectionSeverityFilter === 'alta'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-rose-700 hover:bg-rose-50'
                  }`}
                  title="Filtrar por Severidade Alta"
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      objectionSeverityFilter === 'alta' ? 'bg-white' : 'bg-rose-500'
                    }`}
                  />
                  <span>Alta</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                      objectionSeverityFilter === 'alta'
                        ? 'bg-rose-700 text-white'
                        : 'bg-rose-100 text-rose-700'
                    }`}
                  >
                    {severityCounts.alta}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setObjectionSeverityFilter(
                      objectionSeverityFilter === 'media' ? 'all' : 'media'
                    )
                  }
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                    objectionSeverityFilter === 'media'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'text-amber-800 hover:bg-amber-50'
                  }`}
                  title="Filtrar por Severidade Média"
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      objectionSeverityFilter === 'media' ? 'bg-white' : 'bg-amber-500'
                    }`}
                  />
                  <span>Média</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                      objectionSeverityFilter === 'media'
                        ? 'bg-amber-600 text-white'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {severityCounts.media}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setObjectionSeverityFilter(
                      objectionSeverityFilter === 'baixa' ? 'all' : 'baixa'
                    )
                  }
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                    objectionSeverityFilter === 'baixa'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-blue-700 hover:bg-blue-50'
                  }`}
                  title="Filtrar por Severidade Baixa"
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      objectionSeverityFilter === 'baixa' ? 'bg-white' : 'bg-blue-500'
                    }`}
                  />
                  <span>Baixa</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                      objectionSeverityFilter === 'baixa'
                        ? 'bg-blue-700 text-white'
                        : 'bg-blue-100 text-blue-700'
                    }`}
                  >
                    {severityCounts.baixa}
                  </span>
                </button>
              </div>
            </div>

            {/* Lista Visual de Objeções com Barras Didáticas & Melhor Argumento */}
            <div className="space-y-4">
              {filteredObjections.length === 0 ? (
                <div className="py-10 px-4 text-center bg-slate-50/80 rounded-2xl border border-slate-200/80">
                  <ShieldAlert className="w-9 h-9 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-800">
                    Nenhuma objeção encontrada com severidade "{objectionSeverityFilter}"
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Não há ocorrências mapeadas para esta classificação no momento.
                  </p>
                  <button
                    type="button"
                    onClick={() => setObjectionSeverityFilter('all')}
                    className="mt-3 px-3.5 py-1.5 text-xs font-bold text-[#00a83e] bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 rounded-xl transition-colors"
                  >
                    Ver todas as objeções
                  </button>
                </div>
              ) : (
                filteredObjections.map((obj) => {
                  const severityColor =
                    obj.severity === 'alta'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : obj.severity === 'media'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-blue-50 text-blue-700 border-blue-200';

                  const severityLabel =
                    obj.severity === 'alta'
                      ? 'SEVERIDADE ALTA'
                      : obj.severity === 'media'
                      ? 'SEVERIDADE MÉDIA'
                      : 'SEVERIDADE BAIXA';

                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2 }}
                      key={obj.id}
                      className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition-all"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-slate-900">{obj.category}</span>
                          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${severityColor}`}>
                            {severityLabel}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-slate-900">{obj.count} ocorrências</span>
                          <span className="text-xs font-black text-[#00a83e]">({obj.percentage}%)</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 mb-2.5">
                        {obj.description}
                      </p>

                      {/* Barra de Progresso da Objeção */}
                      <div className="w-full bg-slate-200/70 h-2 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${obj.percentage}%` }}
                          className="h-full bg-gradient-to-r from-amber-500 to-[#00a83e] rounded-full transition-all duration-500"
                        />
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>
        </motion.div>
      </div>

      {/* ================= MODAL DO TABLET DE CONVERSAS ================= */}
      <TabletChatModal
        salesperson={currentSalesperson}
        isOpen={isTabletModalOpen}
        onClose={() => setIsTabletModalOpen(false)}
        initialSessionId={targetSessionId}
      />
    </motion.div>
  );
}
