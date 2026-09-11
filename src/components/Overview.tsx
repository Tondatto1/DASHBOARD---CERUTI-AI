import React, { useState, useRef, useEffect } from 'react';
import {
  Users,
  Clock,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  UserCheck,
  Sparkles,
  Calendar,
  X,
  CalendarRange,
  Search,
  CheckCircle2,
  Phone,
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Salesperson } from '../types';

interface OverviewProps {
  salespeople: Salesperson[];
  maxAccesses: number;
  onActivateSalesperson?: (id: string) => void;
}

export function Overview({ salespeople, maxAccesses, onActivateSalesperson }: OverviewProps) {
  // Filtro de tempo para o Card 2: Usaram no período
  const [usagePeriod, setUsagePeriod] = useState<string>('7');
  const [usageCustomDays, setUsageCustomDays] = useState<number>(7);
  const [isUsageDatePickerOpen, setIsUsageDatePickerOpen] = useState<boolean>(false);
  const usageDatePickerRef = useRef<HTMLDivElement>(null);
  const [usageStartDate, setUsageStartDate] = useState<string>('2026-08-28');
  const [usageEndDate, setUsageEndDate] = useState<string>('2026-09-03');
  
  // Modal de listagem completa de vendedores ativos no período (para grandes empresas com centenas de vendedores)
  const [isAllActiveModalOpen, setIsAllActiveModalOpen] = useState<boolean>(false);
  const [modalSearchQuery, setModalSearchQuery] = useState<string>('');

  // Filtro de tempo para o Card 3: Planos de argumentos gerados
  const [plansPeriod, setPlansPeriod] = useState<string>('7');
  const [customDays, setCustomDays] = useState<number>(7);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);
  const datePickerRef = useRef<HTMLDivElement>(null);
  const [startDate, setStartDate] = useState<string>('2026-08-28');
  const [endDate, setEndDate] = useState<string>('2026-09-03');

  // Fechar popover ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (usageDatePickerRef.current && !usageDatePickerRef.current.contains(event.target as Node)) {
        setIsUsageDatePickerOpen(false);
      }
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsDatePickerOpen(false);
      }
    }
    if (isUsageDatePickerOpen || isDatePickerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isUsageDatePickerOpen, isDatePickerOpen]);

  // Aplicar intervalo de datas selecionado para Uso
  const applyUsageDateRange = () => {
    const start = new Date(usageStartDate);
    const end = new Date(usageEndDate);
    if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
      const diffMs = end.getTime() - start.getTime();
      const calculatedDays = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)));
      setUsageCustomDays(calculatedDays);
      setUsagePeriod('custom');
      setIsUsageDatePickerOpen(false);
    }
  };

  const applyUsageCustomPreset = (days: number) => {
    setUsageCustomDays(days);
    setUsagePeriod('custom');
    setIsUsageDatePickerOpen(false);
  };

  // Aplicar intervalo de datas selecionado para Planos
  const applyDateRange = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
      const diffMs = end.getTime() - start.getTime();
      const calculatedDays = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)));
      setCustomDays(calculatedDays);
      setPlansPeriod('custom');
      setIsDatePickerOpen(false);
    }
  };

  const applyCustomPreset = (days: number) => {
    setCustomDays(days);
    setPlansPeriod('custom');
    setIsDatePickerOpen(false);
  };

  const totalSalespeople = salespeople.length;
  const activeSalespeople = salespeople.filter((s) => s.status === 'Ativo');
  const activeCount = activeSalespeople.length;

  // Dados dinâmicos por período selecionado para USARAM NO PERÍODO
  const getUsageData = () => {
    let days = 7;
    let label = '7 dias';

    if (usagePeriod === '7') {
      days = 7;
      label = '7 dias';
    } else if (usagePeriod === '15') {
      days = 15;
      label = '15 dias';
    } else if (usagePeriod === '30') {
      days = 30;
      label = '30 dias';
    } else {
      days = usageCustomDays;
      label = `${usageCustomDays} dias`;
    }

    const activeInPeriod = salespeople.filter((s) => {
      if (s.status !== 'Ativo' && s.messageCount === 0) return false;
      if (days <= 7) {
        return s.messageCount > 0 && s.lastConversation !== 'Sem registros';
      }
      return s.messageCount > 0;
    });

    const count = activeInPeriod.length;
    const pct = totalSalespeople > 0 ? Math.round((count / totalSalespeople) * 100) : 0;

    return {
      count,
      label,
      pct,
      users: activeInPeriod,
    };
  };

  const currentUsageData = getUsageData();

  // Dados dinâmicos por período selecionado para PLANOS GERADOS
  const getPlansData = () => {
    if (plansPeriod === '7') return { count: 38, growth: '+14%', rate: '~5 gerados/dia', label: '7 dias' };
    if (plansPeriod === '15') return { count: 76, growth: '+18%', rate: '~5 gerados/dia', label: '15 dias' };
    if (plansPeriod === '30') return { count: 148, growth: '+22%', rate: '~5 gerados/dia', label: '30 dias' };
    
    // Período personalizado
    const count = Math.max(1, Math.round(customDays * 4.93));
    const growth = `+${Math.min(45, Math.max(6, Math.round(customDays * 0.7)))}%`;
    return {
      count,
      growth,
      rate: '~5 gerados/dia',
      label: `${customDays} dias`
    };
  };

  const currentPlansData = getPlansData();

  // Precisam de atenção: inativos ou sem mensagens
  const needAttention = salespeople.filter(
    (s) => s.status === 'Inativo' || s.messageCount === 0
  );

  // Taxas e cálculos
  const capacityRate = Math.round((activeCount / maxAccesses) * 100);
  const remainingSlots = Math.max(0, maxAccesses - activeCount);

  // Animações
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full space-y-6"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ================= CARD 1: COLABORADORES ATIVOS (SUPER DESTAQUE / HERO CARD) ================= */}
        <motion.div
          variants={itemVariants}
          className="relative bg-gradient-to-br from-emerald-500/[0.08] via-white to-white rounded-3xl p-5 sm:p-8 border-2 border-emerald-500/50 shadow-sm hover:shadow-xl hover:scale-[1.01] hover:z-10 hover:border-emerald-500 transition-all duration-300 flex flex-col justify-between group overflow-hidden cursor-default min-h-[290px]"
        >
          {/* Luz de destaque superior sutil */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none -mr-12 -mt-12 group-hover:bg-emerald-400/20 transition-all duration-500" />
          
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <span className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight">Colaboradores ativos</span>
                <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-extrabold bg-[#00a83e] text-white shadow-xs">
                  <Sparkles className="w-3 h-3" />
                  <span>PRINCIPAL</span>
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#00a83e] text-white flex items-center justify-center shadow-md shadow-emerald-500/30 group-hover:scale-105 transition-transform duration-300">
                <Users className="w-6 h-6" />
              </div>
            </div>

            <div className="mt-6 mb-2">
              <div className="flex items-baseline">
                <span className="text-5xl sm:text-7xl font-black text-slate-900 tracking-tight leading-none">
                  {activeCount}
                </span>
                <span className="text-lg sm:text-xl text-slate-500 font-bold ml-3.5">
                  de <span className="text-slate-800 font-black">{maxAccesses}</span> vagas contratadas
                </span>
              </div>
            </div>
          </div>

          {/* Barra de Progresso da Capacidade Visual & Animada */}
          <div className="mt-8 pt-5 border-t border-emerald-500/20">
            <div className="flex items-center justify-between text-sm font-bold text-slate-700 mb-2.5">
              <span className="flex items-center text-[#00a83e] text-sm sm:text-base font-extrabold">
                <span className="relative flex h-2.5 w-2.5 mr-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00a83e] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00a83e]"></span>
                </span>
                {capacityRate}% da capacidade total
              </span>
              <span className="text-sm text-slate-500 font-bold bg-slate-100 px-2.5 py-0.5 rounded-lg">
                {remainingSlots} vaga{remainingSlots === 1 ? '' : 's'} livre{remainingSlots === 1 ? '' : 's'}
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden p-0.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${capacityRate}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="bg-gradient-to-r from-[#00a83e] to-emerald-400 h-full rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* ================= CARD 3: PLANOS DE ARGUMENTOS GERADOS (COM FILTRO DE TEMPO) ================= */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/80 shadow-sm hover:shadow-xl hover:scale-[1.01] relative hover:z-10 transition-all duration-300 flex flex-col justify-between group cursor-default min-h-[290px]"
        >
          <div>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 pr-1">
                <span className="text-lg sm:text-xl font-bold text-slate-800 leading-snug block">
                  Planos de argumentos gerados nos últimos{' '}
                  <span className="text-purple-600 font-black whitespace-nowrap">{currentPlansData.label}</span>
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-2xs">
                <TrendingUp className="w-6 h-6" />
              </div>
            </div>

            {/* Seletor / Filtro pré-configurado por tempo (7 dias / 15 dias / 30 dias) + Ícone de Calendário */}
            <div className="relative mt-5" ref={datePickerRef}>
              <div className="flex items-center bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/60 text-xs sm:text-sm">
                {(['7', '15', '30'] as const).map((period) => (
                  <button
                    key={period}
                    type="button"
                    onClick={() => {
                      setPlansPeriod(period);
                      setIsDatePickerOpen(false);
                    }}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all text-center ${
                      plansPeriod === period
                        ? 'bg-white text-purple-700 shadow-xs scale-100 font-extrabold border border-purple-100/60'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {period} dias
                  </button>
                ))}

                {/* Botão com ícone de calendário para escolha de janela personalizada */}
                <button
                  type="button"
                  onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                  title="Escolher janela de tempo personalizada no calendário"
                  className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 ${
                    plansPeriod === 'custom' || isDatePickerOpen
                      ? 'bg-purple-600 text-white shadow-xs font-extrabold'
                      : 'text-slate-600 hover:text-purple-700 hover:bg-white/80'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  {plansPeriod === 'custom' && (
                    <span className="text-xs hidden sm:inline">{customDays}d</span>
                  )}
                </button>
              </div>

              {/* Popover elegante para escolha da janela de tempo */}
              {isDatePickerOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 z-30 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
                    <div className="flex items-center space-x-1.5 text-slate-800 font-bold">
                      <CalendarRange className="w-4 h-4 text-purple-600" />
                      <span>Janela de tempo personalizada</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsDatePickerOpen(false)}
                      className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Atalhos rápidos */}
                  <div className="mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Janelas pré-definidas
                    </span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[45, 60, 90].map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => applyCustomPreset(d)}
                          className={`py-1.5 px-2.5 rounded-lg text-xs font-bold border transition-all ${
                            plansPeriod === 'custom' && customDays === d
                              ? 'bg-purple-50 border-purple-300 text-purple-700'
                              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {d} dias
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Selecionar intervalo de datas */}
                  <div className="space-y-2 border-t border-slate-100 pt-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Ou selecione o período
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">De</label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:ring-1 focus:ring-purple-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Até</label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:ring-1 focus:ring-purple-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={applyDateRange}
                      className="w-full mt-2 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition-all"
                    >
                      Aplicar período
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 mb-2 flex items-baseline justify-between">
              <div className="flex items-baseline">
                <motion.span
                  key={plansPeriod}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-5xl sm:text-7xl font-black text-slate-900 tracking-tight leading-none"
                >
                  {currentPlansData.count}
                </motion.span>
                <span className="text-lg sm:text-xl text-slate-500 font-bold ml-3.5">planos gerados</span>
              </div>
              <span className="inline-flex items-center text-xs sm:text-sm font-black text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200/80 shadow-2xs">
                <ArrowUpRight className="w-4 h-4 mr-0.5" />
                {currentPlansData.growth}
              </span>
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
            <span className="font-semibold text-slate-600">Ritmo de geração</span>
            <span className="font-bold text-purple-700 bg-purple-50 px-3 py-1 rounded-lg border border-purple-100/80 text-xs sm:text-sm">{currentPlansData.rate}</span>
          </div>
        </motion.div>

        {/* ================= CARD 2: USARAM NO PERÍODO (COM FILTRO DE TEMPO & LISTAGEM ESCALÁVEL) ================= */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/80 shadow-sm hover:shadow-xl hover:scale-[1.01] relative hover:z-10 transition-all duration-300 flex flex-col justify-between group cursor-default min-h-[340px]"
        >
          <div>
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 pr-1">
                <span className="text-lg sm:text-xl font-bold text-slate-800 leading-snug block">
                  Usaram nos últimos{' '}
                  <span className="text-blue-600 font-black whitespace-nowrap">{currentUsageData.label}</span>
                </span>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300 shadow-2xs">
                <Clock className="w-6 h-6" />
              </div>
            </div>

            {/* Seletor / Filtro pré-configurado por tempo (7 dias / 15 dias / 30 dias) + Ícone de Calendário */}
            <div className="relative mt-5" ref={usageDatePickerRef}>
              <div className="flex items-center bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/60 text-xs sm:text-sm">
                {(['7', '15', '30'] as const).map((period) => (
                  <button
                    key={period}
                    type="button"
                    onClick={() => {
                      setUsagePeriod(period);
                      setIsUsageDatePickerOpen(false);
                    }}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-bold transition-all text-center ${
                      usagePeriod === period
                        ? 'bg-white text-blue-700 shadow-xs scale-100 font-extrabold border border-blue-100/60'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {period} dias
                  </button>
                ))}

                {/* Botão com ícone de calendário para escolha de janela personalizada */}
                <button
                  type="button"
                  onClick={() => setIsUsageDatePickerOpen(!isUsageDatePickerOpen)}
                  title="Escolher janela de tempo personalizada no calendário"
                  className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 ${
                    usagePeriod === 'custom' || isUsageDatePickerOpen
                      ? 'bg-blue-600 text-white shadow-xs font-extrabold'
                      : 'text-slate-600 hover:text-blue-700 hover:bg-white/80'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  {usagePeriod === 'custom' && (
                    <span className="text-xs hidden sm:inline">{usageCustomDays}d</span>
                  )}
                </button>
              </div>

              {/* Popover elegante para escolha da janela de tempo */}
              {isUsageDatePickerOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 z-30 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
                    <div className="flex items-center space-x-1.5 text-slate-800 font-bold">
                      <CalendarRange className="w-4 h-4 text-blue-600" />
                      <span>Janela de tempo personalizada</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsUsageDatePickerOpen(false)}
                      className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Atalhos rápidos */}
                  <div className="mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                      Janelas pré-definidas
                    </span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[45, 60, 90].map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => applyUsageCustomPreset(d)}
                          className={`py-1.5 px-2.5 rounded-lg text-xs font-bold border transition-all ${
                            usagePeriod === 'custom' && usageCustomDays === d
                              ? 'bg-blue-50 border-blue-300 text-blue-700'
                              : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          {d} dias
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Selecionar intervalo de datas */}
                  <div className="space-y-2 border-t border-slate-100 pt-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Ou selecione o período
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">De</label>
                        <input
                          type="date"
                          value={usageStartDate}
                          onChange={(e) => setUsageStartDate(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Até</label>
                        <input
                          type="date"
                          value={usageEndDate}
                          onChange={(e) => setUsageEndDate(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={applyUsageDateRange}
                      className="w-full mt-2 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all"
                    >
                      Aplicar período
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Contador Principal + Percentual */}
            <div className="mt-5 mb-4 flex items-baseline justify-between">
              <div className="flex items-baseline">
                <motion.span
                  key={usagePeriod}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tight leading-none"
                >
                  {currentUsageData.count}
                </motion.span>
                <span className="text-base sm:text-lg text-slate-500 font-bold ml-3">colaboradores ativos</span>
              </div>
              
              <button
                type="button"
                onClick={() => {
                  setModalSearchQuery('');
                  setIsAllActiveModalOpen(true);
                }}
                className="inline-flex items-center text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100/80 px-2.5 py-1.5 rounded-xl border border-blue-200/80 transition-all shadow-2xs group/btn"
                title="Ver lista completa de colaboradores ativos"
              >
                <span>Ver lista ({currentUsageData.count})</span>
                <ChevronRight className="w-3.5 h-3.5 ml-0.5 group-hover/btn:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* LISTAGEM ESTRUTURADA DE QUEM SÃO OS COLABORADORES ATIVOS (ESCALÁVEL P/ PEQUENO, MÉDIO E GRANDE) */}
            <div className="space-y-2 mt-2">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1">
                <span>Colaboradores com atividade</span>
                <span className="font-semibold text-slate-400">{currentUsageData.users.length} de {totalSalespeople}</span>
              </div>

              {currentUsageData.users.length > 0 ? (
                <div className="max-h-[140px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                  {currentUsageData.users.map((person) => (
                    <div
                      key={person.id}
                      className="p-3 rounded-2xl border border-blue-100 bg-blue-50/40 hover:bg-blue-50/80 transition-all duration-200 flex items-center justify-between gap-2.5 shadow-2xs"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0 shadow-xs">
                          {person.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-1.5">
                            <span className="text-sm font-bold text-slate-900 truncate">{person.name}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 inline-block animate-pulse" title="Ativo no período" />
                          </div>
                          <span className="text-xs text-slate-500 font-mono block truncate">
                            {person.whatsapp}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[11px] font-bold bg-white text-blue-700 border border-blue-200/60 shadow-2xs">
                          <MessageSquare className="w-3 h-3 mr-1 text-blue-500" />
                          {person.messageCount} interações
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5 px-3 bg-slate-50 border border-slate-200/60 rounded-2xl text-xs text-slate-500 font-medium">
                  Nenhum colaborador registrou atividade neste período.
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center text-sm font-bold text-blue-700">
              <span className="px-3 py-1 rounded-xl bg-blue-50 border border-blue-200/80 mr-2.5 font-black text-xs sm:text-sm">
                {currentUsageData.pct}%
              </span>
              <span className="text-slate-700 font-bold">da equipe ativa</span>
            </div>

            {/* Ação rápida / Avatar stack */}
            <button
              type="button"
              onClick={() => {
                setModalSearchQuery('');
                setIsAllActiveModalOpen(true);
              }}
              className="text-xs font-bold text-slate-600 hover:text-blue-700 flex items-center space-x-1.5 transition-colors p-1"
            >
              <div className="flex -space-x-2 overflow-hidden">
                {currentUsageData.users.slice(0, 4).map((u) => (
                  <div
                    key={u.id}
                    title={u.name}
                    className="inline-block h-7 w-7 rounded-full ring-2 ring-white bg-blue-100 text-blue-800 font-black text-xs flex items-center justify-center shadow-2xs"
                  >
                    {u.name.charAt(0)}
                  </div>
                ))}
              </div>
              {currentUsageData.users.length > 4 && (
                <span className="text-slate-500 text-xs font-bold ml-1">+{currentUsageData.users.length - 4}</span>
              )}
            </button>
          </div>
        </motion.div>

        {/* ================= CARD 4: PRECISAM DE ATENÇÃO (COM LISTA DE COLABORADORES E ALERTA) ================= */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:scale-[1.01] hover:shadow-xl relative hover:z-10 transition-all duration-300 p-5 sm:p-8 flex flex-col justify-between cursor-default min-h-[290px]"
        >
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-2xl bg-red-50 border border-red-200/80 text-red-600 flex items-center justify-center shrink-0 shadow-2xs">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg sm:text-xl">Precisam de atenção</h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Colaboradores inativos ou sem interações registradas
                  </p>
                </div>
              </div>

              {/* Destaque claro do número de pessoas que precisam de atenção */}
              <div className="flex items-center self-start sm:self-center bg-red-50 border border-red-200/90 rounded-2xl px-3.5 py-2 shadow-2xs">
                <span className="text-2xl font-black text-red-700 leading-none">
                  {needAttention.length}
                </span>
                <span className="text-xs sm:text-sm font-bold text-red-800 ml-2">
                  {needAttention.length === 1 ? 'pessoa com alerta' : 'pessoas com alertas'}
                </span>
              </div>
            </div>

            <div className="space-y-3 mt-4">
              {needAttention.length > 0 ? (
                needAttention.map((person) => (
                  <div
                    key={person.id}
                    className="p-4 rounded-2xl border border-red-200/80 bg-red-50/50 hover:bg-red-50/80 transition-all duration-200 flex items-center justify-between gap-3 shadow-2xs"
                  >
                    <div className="flex items-center space-x-3.5 min-w-0">
                      <div className="w-11 h-11 rounded-2xl bg-red-100 border border-red-200 text-red-800 font-black text-sm flex items-center justify-center shrink-0 shadow-2xs">
                        {person.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center space-x-2">
                          <span className="text-base font-bold text-slate-900 truncate">{person.name}</span>
                          <span className="text-xs text-slate-500 font-mono hidden sm:inline">{person.whatsapp}</span>
                        </div>
                        <p className="text-xs sm:text-sm text-red-600 mt-0.5 font-bold flex items-center truncate">
                          <span className="w-2 h-2 rounded-full bg-red-500 mr-2 inline-block shrink-0 animate-pulse"></span>
                          Nenhuma interação registrada nos últimos 7 dias
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 px-4 bg-emerald-50/30 border border-emerald-100/60 rounded-2xl">
                  <UserCheck className="w-10 h-10 text-[#00a83e] mx-auto mb-2" />
                  <p className="text-base font-bold text-slate-800">Tudo em conformidade!</p>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Nenhum colaborador necessita de intervenção no momento.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
            <span className="font-semibold text-slate-600">Status operacional</span>
            <span className={`font-black text-xs sm:text-sm px-2.5 py-1 rounded-lg ${needAttention.length > 0 ? 'bg-amber-50 text-amber-700 border border-amber-200/80' : 'bg-emerald-50 text-[#00a83e] border border-emerald-200/80'}`}>
              {needAttention.length > 0 ? `${needAttention.length} pendência ativa` : '100% ativo'}
            </span>
          </div>
        </motion.div>
      </div>

      {/* ================= MODAL ESCALÁVEL: LISTA COMPLETA DE COLABORADORES ATIVOS (P/ 10, 50, 100+ COLABORADORES) ================= */}
      <AnimatePresence>
        {isAllActiveModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAllActiveModalOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden z-10"
            >
              {/* Cabeçalho do Modal */}
              <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/50">
                <div className="flex items-center space-x-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200/70 shadow-2xs">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                        Colaboradores Ativos no Período
                      </h3>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black bg-blue-100 text-blue-800">
                        {currentUsageData.users.length} ativos
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">
                      Atividade registrada nos últimos <span className="font-bold text-blue-700">{currentUsageData.label}</span> ({currentUsageData.pct}% da equipe total)
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAllActiveModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Barra de Pesquisa Rápida em Tempo Real */}
              <div className="p-4 border-b border-slate-100 bg-white">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={modalSearchQuery}
                    onChange={(e) => setModalSearchQuery(e.target.value)}
                    placeholder="Buscar colaborador por nome ou WhatsApp..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm text-slate-800 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                  {modalSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setModalSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Lista Scrollável Otimizada para Centenas de Colaboradores */}
              <div className="p-6 overflow-y-auto flex-1 space-y-2.5 divide-y divide-slate-100/60 custom-scrollbar">
                {currentUsageData.users
                  .filter((u) => {
                    const q = modalSearchQuery.toLowerCase().trim();
                    if (!q) return true;
                    return (
                      u.name.toLowerCase().includes(q) ||
                      u.whatsapp.toLowerCase().includes(q)
                    );
                  })
                  .map((person) => (
                    <div
                      key={person.id}
                      className="pt-2.5 first:pt-0 flex items-center justify-between gap-4 p-3 rounded-2xl hover:bg-slate-50/80 transition-colors"
                    >
                      <div className="flex items-center space-x-3.5 min-w-0">
                        <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                          {person.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="text-base font-bold text-slate-900 truncate">
                              {person.name}
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse" />
                              Ativo
                            </span>
                          </div>
                          <div className="flex items-center space-x-3 mt-0.5 text-xs text-slate-500">
                            <span className="font-mono flex items-center">
                              <Phone className="w-3 h-3 mr-1 text-slate-400" />
                              {person.whatsapp}
                            </span>
                            {person.lastConversation && person.lastConversation !== 'Sem registros' && (
                              <span className="hidden sm:inline text-slate-400">
                                • Última: {person.lastConversation}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200/70 shadow-2xs">
                          <MessageSquare className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
                          <span>{person.messageCount} interações</span>
                        </div>
                      </div>
                    </div>
                  ))}

                {currentUsageData.users.filter((u) => {
                  const q = modalSearchQuery.toLowerCase().trim();
                  if (!q) return true;
                  return (
                    u.name.toLowerCase().includes(q) ||
                    u.whatsapp.toLowerCase().includes(q)
                  );
                }).length === 0 && (
                  <div className="text-center py-12 px-4">
                    <Search className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-base font-bold text-slate-700">Nenhum colaborador encontrado</p>
                    <p className="text-xs text-slate-500 mt-1">
                      Nenhum resultado corresponde à busca "{modalSearchQuery}".
                    </p>
                  </div>
                )}
              </div>

              {/* Rodapé do Modal */}
              <div className="p-4 px-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Exibindo {currentUsageData.users.length} de {totalSalespeople} colaboradores da equipe</span>
                <button
                  type="button"
                  onClick={() => setIsAllActiveModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs transition-colors"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

