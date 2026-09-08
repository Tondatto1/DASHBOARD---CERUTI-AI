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
  CalendarRange
} from 'lucide-react';
import { motion } from 'motion/react';
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
      className="space-y-6 sm:space-y-8 flex-1 flex flex-col justify-start pb-4"
    >
      {/* ================= DOBRA 1: INDICADORES PRINCIPAIS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* CARD 1: VENDEDORES ATIVOS (SUPER DESTAQUE / HERO CARD) */}
        <motion.div
          variants={itemVariants}
          className="relative bg-gradient-to-br from-emerald-500/[0.08] via-white to-white rounded-2xl p-5 sm:p-6 border-2 border-emerald-500/50 shadow-lg shadow-emerald-500/10 hover:shadow-xl hover:shadow-emerald-500/20 hover:scale-105 hover:z-10 hover:border-emerald-500 transition-all duration-300 flex flex-col justify-between group overflow-hidden cursor-default"
        >
          {/* Luz de destaque superior sutil */}
          <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none -mr-10 -mt-10 group-hover:bg-emerald-400/20 transition-all duration-500" />
          
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-slate-800 tracking-tight">Vendedores ativos</span>
                <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-[#00a83e] text-white shadow-xs">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>PRINCIPAL</span>
                </span>
              </div>
              <div className="w-11 h-11 rounded-xl bg-[#00a83e] text-white flex items-center justify-center shadow-md shadow-emerald-500/30 group-hover:scale-105 transition-transform duration-300">
                <Users className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                  {activeCount}
                </span>
                <span className="text-sm text-slate-500 font-semibold">
                  de <span className="text-slate-700 font-bold">{maxAccesses}</span> vagas
                </span>
              </div>
            </div>
          </div>

          {/* Barra de Progresso da Capacidade Visual & Animada */}
          <div className="mt-5 pt-3 border-t border-emerald-500/15">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
              <span className="flex items-center text-[#00a83e]">
                <span className="relative flex h-2 w-2 mr-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00a83e] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00a83e]"></span>
                </span>
                {capacityRate}% da capacidade
              </span>
              <span className="text-[11px] text-slate-400 font-medium">
                {remainingSlots} livre{remainingSlots === 1 ? '' : 's'}
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${capacityRate}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="bg-gradient-to-r from-[#00a83e] to-emerald-400 h-full rounded-full"
              />
            </div>
          </div>
        </motion.div>

        {/* CARD 2: USARAM NO PERÍODO (COM O MESMO FILTRO DE TEMPO) */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-sm hover:shadow-xl hover:scale-105 relative hover:z-10 transition-all duration-300 flex flex-col justify-between group cursor-default"
        >
          <div>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 pr-1">
                <span className="text-sm font-semibold text-slate-700 leading-snug block">
                  Usaram nos últimos{' '}
                  <span className="text-blue-600 font-bold whitespace-nowrap">{currentUsageData.label}</span>
                </span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                <Clock className="w-4 h-4" />
              </div>
            </div>

            {/* Seletor / Filtro pré-configurado por tempo (7 dias / 15 dias / 30 dias) + Ícone de Calendário */}
            <div className="relative mt-3" ref={usageDatePickerRef}>
              <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/60 text-xs">
                {(['7', '15', '30'] as const).map((period) => (
                  <button
                    key={period}
                    type="button"
                    onClick={() => {
                      setUsagePeriod(period);
                      setIsUsageDatePickerOpen(false);
                    }}
                    className={`flex-1 py-1 px-1.5 rounded-lg text-[11px] font-bold transition-all text-center ${
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
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 shrink-0 ${
                    usagePeriod === 'custom' || isUsageDatePickerOpen
                      ? 'bg-blue-600 text-white shadow-xs font-extrabold'
                      : 'text-slate-600 hover:text-blue-700 hover:bg-white/80'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  {usagePeriod === 'custom' && (
                    <span className="text-[10px] hidden sm:inline">{usageCustomDays}d</span>
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
                          className={`py-1 px-2 rounded-lg text-xs font-bold border transition-all ${
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
                          className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-700 font-medium focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Até</label>
                        <input
                          type="date"
                          value={usageEndDate}
                          onChange={(e) => setUsageEndDate(e.target.value)}
                          className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-700 font-medium focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={applyUsageDateRange}
                      className="w-full mt-2 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all"
                    >
                      Aplicar período
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4">
              <div className="flex items-baseline space-x-2">
                <motion.span
                  key={usagePeriod}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
                >
                  {currentUsageData.count}
                </motion.span>
                <span className="text-xs text-slate-500 font-medium">vendedores</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center text-xs font-semibold text-blue-600">
              <span className="px-2 py-0.5 rounded-md bg-blue-50 border border-blue-100 mr-1.5 font-bold">
                {currentUsageData.pct}%
              </span>
              <span>equipe ativa recente</span>
            </div>
            {/* Avatares dos membros que interagiram recentemente */}
            <div className="flex -space-x-1.5 overflow-hidden">
              {currentUsageData.users.slice(0, 3).map((u) => (
                <div
                  key={u.id}
                  title={u.name}
                  className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-slate-100 text-slate-700 font-bold text-[10px] flex items-center justify-center"
                >
                  {u.name.charAt(0)}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* CARD 3: PLANOS DE ARGUMENTOS GERADOS (COM FILTRO DE TEMPO) */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-sm hover:shadow-xl hover:scale-105 relative hover:z-10 transition-all duration-300 flex flex-col justify-between group cursor-default"
        >
          <div>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 pr-1">
                <span className="text-sm font-semibold text-slate-700 leading-snug block">
                  Planos de argumentos gerados nos últimos{' '}
                  <span className="text-purple-600 font-bold whitespace-nowrap">{currentPlansData.label}</span>
                </span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>

            {/* Seletor / Filtro pré-configurado por tempo (7 dias / 15 dias / 30 dias) + Ícone de Calendário */}
            <div className="relative mt-3" ref={datePickerRef}>
              <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/60 text-xs">
                {(['7', '15', '30'] as const).map((period) => (
                  <button
                    key={period}
                    type="button"
                    onClick={() => {
                      setPlansPeriod(period);
                      setIsDatePickerOpen(false);
                    }}
                    className={`flex-1 py-1 px-1.5 rounded-lg text-[11px] font-bold transition-all text-center ${
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
                  className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 shrink-0 ${
                    plansPeriod === 'custom' || isDatePickerOpen
                      ? 'bg-purple-600 text-white shadow-xs font-extrabold'
                      : 'text-slate-600 hover:text-purple-700 hover:bg-white/80'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  {plansPeriod === 'custom' && (
                    <span className="text-[10px] hidden sm:inline">{customDays}d</span>
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
                          className={`py-1 px-2 rounded-lg text-xs font-bold border transition-all ${
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
                          className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-700 font-medium focus:ring-1 focus:ring-purple-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Até</label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-700 font-medium focus:ring-1 focus:ring-purple-500 focus:outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={applyDateRange}
                      className="w-full mt-2 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition-all"
                    >
                      Aplicar período
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-4 flex items-baseline justify-between">
              <div className="flex items-baseline space-x-2">
                <motion.span
                  key={plansPeriod}
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight"
                >
                  {currentPlansData.count}
                </motion.span>
                <span className="text-xs text-slate-500 font-medium">gerados</span>
              </div>
              <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100/60">
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                {currentPlansData.growth}
              </span>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Ritmo acelerado</span>
            <span className="font-semibold text-purple-700">{currentPlansData.rate}</span>
          </div>
        </motion.div>
      </div>

      {/* ================= DOBRA 2: DIAGNÓSTICO E ATENÇÃO ================= */}
      <div className="grid grid-cols-1 gap-6">
        {/* Card: Precisam de atenção (Com destaque claro, alertas e lista de vendedores) */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:scale-[1.01] hover:shadow-xl relative hover:z-10 transition-all duration-300 p-6 sm:p-7 flex flex-col justify-between cursor-default"
        >
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 border border-red-200 text-red-600 flex items-center justify-center shrink-0 shadow-xs">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">Precisam de atenção</h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                    Vendedores inativos ou sem interações registradas
                  </p>
                </div>
              </div>

              {/* Destaque claro do número de pessoas que precisam de atenção */}
              <div className="flex items-center self-start sm:self-center bg-red-50 border border-red-200/90 rounded-xl px-3.5 py-1.5 shadow-xs">
                <span className="text-2xl font-black text-red-700 leading-none">
                  {needAttention.length}
                </span>
                <span className="text-xs font-bold text-red-800 ml-2">
                  {needAttention.length === 1 ? 'pessoa precisando de atenção' : 'pessoas precisando de atenção'}
                </span>
              </div>
            </div>

            <div className="space-y-3.5 flex-1 flex flex-col justify-center">
              {needAttention.length > 0 ? (
                needAttention.map((person) => (
                  <div
                    key={person.id}
                    className="p-4 rounded-xl border border-red-200/80 bg-red-50/40 hover:bg-red-50/70 transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="w-9 h-9 rounded-full bg-red-200 text-red-800 font-black text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                        {person.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-bold text-slate-900">{person.name}</span>
                        </div>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">{person.whatsapp}</p>
                        <p className="text-xs text-red-600 mt-1 font-semibold flex items-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5 inline-block"></span>
                          Nenhuma interação registrada nos últimos 7 dias
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 px-4 bg-emerald-50/30 border border-emerald-100/60 rounded-xl">
                  <UserCheck className="w-10 h-10 text-[#00a83e] mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-800">Tudo em conformidade!</p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Nenhum vendedor necessita de intervenção no momento.
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

