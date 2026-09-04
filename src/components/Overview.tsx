import React, { useState, useRef, useEffect } from 'react';
import {
  Users,
  Clock,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  UserCheck,
  CheckCircle2,
  Sparkles,
  Zap,
  Activity,
  Calendar,
  MessageSquare,
  Filter,
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
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);
  const [plansPeriod, setPlansPeriod] = useState<string>('30');
  const [customDays, setCustomDays] = useState<number>(30);
  const [customDaysInput, setCustomDaysInput] = useState<string>('30');
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);
  const datePickerRef = useRef<HTMLDivElement>(null);

  // Intervalo de datas personalizado
  const [startDate, setStartDate] = useState<string>('2026-08-04');
  const [endDate, setEndDate] = useState<string>('2026-09-03');

  // Estado para a janela de tempo do gráfico inferior (Ritmo Semanal)
  const [chartPeriod, setChartPeriod] = useState<string>('7');
  const [chartCustomDays, setChartCustomDays] = useState<number>(7);
  const [isChartDatePickerOpen, setIsChartDatePickerOpen] = useState<boolean>(false);
  const chartDatePickerRef = useRef<HTMLDivElement>(null);

  // Intervalo de datas personalizado para o gráfico
  const [chartStartDate, setChartStartDate] = useState<string>('2026-08-28');
  const [chartEndDate, setChartEndDate] = useState<string>('2026-09-03');

  // Fechar popover ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
        setIsDatePickerOpen(false);
      }
      if (chartDatePickerRef.current && !chartDatePickerRef.current.contains(event.target as Node)) {
        setIsChartDatePickerOpen(false);
      }
    }
    if (isDatePickerOpen || isChartDatePickerOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isDatePickerOpen, isChartDatePickerOpen]);

  // Aplicar intervalo de datas selecionado para o gráfico
  const applyChartDateRange = () => {
    const start = new Date(chartStartDate);
    const end = new Date(chartEndDate);
    if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
      const diffMs = end.getTime() - start.getTime();
      const calculatedDays = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)));
      setChartCustomDays(calculatedDays);
      setChartPeriod('custom');
      setIsChartDatePickerOpen(false);
    }
  };

  const applyChartCustomPreset = (days: number) => {
    setChartCustomDays(days);
    setChartPeriod('custom');
    setIsChartDatePickerOpen(false);
  };

  // Aplicar intervalo de datas selecionado
  const applyDateRange = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
      const diffMs = end.getTime() - start.getTime();
      const calculatedDays = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)));
      setCustomDays(calculatedDays);
      setCustomDaysInput(String(calculatedDays));
      setPlansPeriod('custom');
      setIsDatePickerOpen(false);
    }
  };

  const applyCustomPreset = (days: number) => {
    setCustomDays(days);
    setCustomDaysInput(String(days));
    setPlansPeriod('custom');
    setIsDatePickerOpen(false);
  };

  const totalSalespeople = salespeople.length;
  const activeSalespeople = salespeople.filter((s) => s.status === 'Ativo');
  const activeCount = activeSalespeople.length;
  
  // Usaram nos últimos 7 dias: salespeople with messageCount > 0 and recent activity
  const usedLast7Days = salespeople.filter(
    (s) => s.messageCount > 0 && s.lastConversation !== 'Sem registros'
  );
  const usedLast7DaysCount = usedLast7Days.length;

  // Dados dinâmicos por período selecionado
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
  const needAttentionCount = needAttention.length;

  // Taxas e cálculos
  const capacityRate = Math.round((activeCount / maxAccesses) * 100);
  const adoptionRate = totalSalespeople > 0 ? Math.round((activeCount / totalSalespeople) * 100) : 0;
  const inactiveRate = 100 - adoptionRate;
  const remainingSlots = Math.max(0, maxAccesses - activeCount);

  // SVG circular chart math
  const radius = 62;
  const circumference = 2 * Math.PI * radius;
  const activeStrokeDashoffset = circumference - (adoptionRate / 100) * circumference;

  // Dados dinâmicos para visualização do ritmo de geração de planos de argumentos
  const getChartData = () => {
    if (chartPeriod === '15') {
      return [
        { day: 'D-14', count: 14, height: 35 },
        { day: 'D-12', count: 20, height: 50 },
        { day: 'D-10', count: 25, height: 62 },
        { day: 'D-8', count: 19, height: 48 },
        { day: 'D-6', count: 28, height: 70 },
        { day: 'D-4', count: 32, height: 80 },
        { day: 'D-2', count: 36, height: 90 },
        { day: 'Hoje', count: 30, height: 75 },
      ];
    }
    if (chartPeriod === '30') {
      return [
        { day: 'Sem 1', count: 32, height: 55 },
        { day: 'Sem 2', count: 38, height: 65 },
        { day: 'Sem 3', count: 46, height: 78 },
        { day: 'Sem 4', count: 58, height: 98 },
      ];
    }
    if (chartPeriod === 'custom') {
      return [
        { day: 'P1', count: Math.round(chartCustomDays * 1.2), height: 45 },
        { day: 'P2', count: Math.round(chartCustomDays * 1.8), height: 65 },
        { day: 'P3', count: Math.round(chartCustomDays * 2.4), height: 85 },
        { day: 'P4', count: Math.round(chartCustomDays * 2.1), height: 75 },
      ];
    }
    // Padrão: 7 dias (Seg a Dom)
    return [
      { day: 'Seg', count: 18, height: 45 },
      { day: 'Ter', count: 26, height: 65 },
      { day: 'Qua', count: 22, height: 55 },
      { day: 'Qui', count: 34, height: 85 },
      { day: 'Sex', count: 29, height: 72 },
      { day: 'Sáb', count: 12, height: 30 },
      { day: 'Dom', count: 7, height: 18 },
    ];
  };

  const chartData = getChartData();
  const maxChartCount = Math.max(...chartData.map((d) => d.count));
  const chartPeriodLabel = chartPeriod === '7' ? '7 dias' : chartPeriod === '15' ? '15 dias' : chartPeriod === '30' ? '30 dias' : `${chartCustomDays} dias`;

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
      className="space-y-6 sm:space-y-8 flex-1 flex flex-col justify-between pb-4"
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

        {/* CARD 2: USARAM NOS ÚLTIMOS 7 DIAS */}
        <motion.div
          variants={itemVariants}
          className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-sm hover:shadow-xl hover:scale-105 relative hover:z-10 transition-all duration-300 flex flex-col justify-between group cursor-default"
        >
          <div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-600">Usaram nos últimos 7 dias</span>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <Clock className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  {usedLast7DaysCount}
                </span>
                <span className="text-xs text-slate-500 font-medium">vendedores</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center text-xs font-semibold text-blue-600">
              <span className="px-2 py-0.5 rounded-md bg-blue-50 border border-blue-100 mr-1.5 font-bold">
                {totalSalespeople > 0 ? Math.round((usedLast7DaysCount / totalSalespeople) * 100) : 0}%
              </span>
              <span>equipe ativa recente</span>
            </div>
            {/* Avatares dos membros que interagiram recentemente */}
            <div className="flex -space-x-1.5 overflow-hidden">
              {usedLast7Days.slice(0, 3).map((u) => (
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

      {/* ================= DOBRA 2: DIAGNÓSTICO E AÇÃO (EXPANDIDOS) ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Card 1: Adoção da equipe (Gráfico circular interativo com dados complementares) */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:scale-105 hover:shadow-xl relative hover:z-10 transition-all duration-300 p-6 sm:p-7 flex flex-col justify-between cursor-default"
        >
          <div>
            <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">Adoção da equipe</h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Distribuição percentual de engajamento dos vendedores
                </p>
              </div>
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-[#00a83e] border border-emerald-100/60">
                Visão 360°
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-around py-4 gap-6 sm:gap-8">
              {/* Circular Chart SVG Animado */}
              <div className="relative w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90 drop-shadow-xs" viewBox="0 0 160 160">
                  {/* Base Track circle */}
                  <circle
                    cx="80"
                    cy="80"
                    r={radius}
                    stroke="#f1f5f9"
                    strokeWidth="16"
                    fill="transparent"
                  />
                  {/* Inactive segment background */}
                  {inactiveRate > 0 && (
                    <circle
                      cx="80"
                      cy="80"
                      r={radius}
                      stroke="#f43f5e"
                      strokeWidth="16"
                      fill="transparent"
                      strokeDasharray={circumference}
                      strokeDashoffset={0}
                      className="opacity-90"
                    />
                  )}
                  {/* Active segment with spring motion */}
                  <motion.circle
                    cx="80"
                    cy="80"
                    r={radius}
                    stroke="#00a83e"
                    strokeWidth="16"
                    strokeLinecap="round"
                    fill="transparent"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: activeStrokeDashoffset }}
                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                  />
                </svg>

                {/* Center text */}
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <motion.span
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight"
                  >
                    {adoptionRate}%
                  </motion.span>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                    Adoção
                  </span>
                </div>
              </div>

              {/* Legend & Breakdown */}
              <div className="space-y-3.5 w-full sm:w-60">
                <div className="flex items-center justify-between space-x-4 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-[#00a83e] shadow-xs shadow-emerald-500/40"></span>
                    <span className="text-xs font-semibold text-slate-700">Ativos no sistema</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                    {activeCount} ({adoptionRate}%)
                  </span>
                </div>

                <div className="flex items-center justify-between space-x-4 bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                  <div className="flex items-center space-x-2.5">
                    <span className="w-3.5 h-3.5 rounded-full bg-rose-500 shadow-xs shadow-rose-500/40"></span>
                    <span className="text-xs font-semibold text-slate-700">Inativos / Sem uso</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900 bg-white px-2.5 py-0.5 rounded-md border border-slate-200">
                    {needAttentionCount} ({inactiveRate}%)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Card 2: Precisam de ação (Com ícone de perigo vermelho, ações diretas e barra de status) */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-6 bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:scale-105 hover:shadow-xl relative hover:z-10 transition-all duration-300 p-6 sm:p-7 flex flex-col justify-between cursor-default"
        >
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 border border-red-200 text-red-600 flex items-center justify-center shrink-0 shadow-xs">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-slate-900 text-lg">Precisam de atenção</h3>
                  </div>
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

      {/* ================= SEÇÃO COMPLEMENTAR: RITMO SEMANAL DE PROPOSTAS ================= */}
      {/* Esta seção preenche o espaço inferior com dados comerciais refinados e visual executivo */}
      <motion.div
        variants={itemVariants}
        className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:scale-105 hover:shadow-xl relative hover:z-10 transition-all duration-300 p-6 sm:p-7 flex flex-col justify-between cursor-default"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <Activity className="w-4 h-4 text-[#00a83e]" />
              <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                Ritmo de geração de planos
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Volume diário de propostas emitidas via inteligência comercial Ceruti
            </p>
          </div>

          {/* Seletor / Filtro pré-configurado por tempo (7 dias / 15 dias / 30 dias) + Ícone de Calendário */}
          <div className="relative" ref={chartDatePickerRef}>
            <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/60 text-xs">
              {(['7', '15', '30'] as const).map((period) => (
                <button
                  key={period}
                  type="button"
                  onClick={() => {
                    setChartPeriod(period);
                    setIsChartDatePickerOpen(false);
                  }}
                  className={`py-1 px-2 sm:px-2.5 rounded-lg text-[11px] font-bold transition-all text-center ${
                    chartPeriod === period
                      ? 'bg-white text-[#00a83e] shadow-xs scale-100 font-extrabold border border-emerald-100/60'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {period} dias
                </button>
              ))}

              {/* Botão com ícone de calendário para escolha de janela personalizada */}
              <button
                type="button"
                onClick={() => setIsChartDatePickerOpen(!isChartDatePickerOpen)}
                title="Escolher janela de tempo personalizada no calendário"
                className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 shrink-0 ${
                  chartPeriod === 'custom' || isChartDatePickerOpen
                    ? 'bg-[#00a83e] text-white shadow-xs font-extrabold'
                    : 'text-slate-600 hover:text-[#00a83e] hover:bg-white/80'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                {chartPeriod === 'custom' && (
                  <span className="text-[10px] hidden sm:inline">{chartCustomDays}d</span>
                )}
              </button>
            </div>

            {/* Popover elegante para escolha da janela de tempo */}
            {isChartDatePickerOpen && (
              <div className="absolute top-full right-0 mt-2 z-30 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 text-xs w-72">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3">
                  <div className="flex items-center space-x-1.5 text-slate-800 font-bold">
                    <CalendarRange className="w-4 h-4 text-[#00a83e]" />
                    <span>Janela de tempo personalizada</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsChartDatePickerOpen(false)}
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
                        onClick={() => applyChartCustomPreset(d)}
                        className={`py-1 px-2 rounded-lg text-xs font-bold border transition-all ${
                          chartPeriod === 'custom' && chartCustomDays === d
                            ? 'bg-emerald-50 border-emerald-300 text-[#00a83e]'
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
                        value={chartStartDate}
                        onChange={(e) => setChartStartDate(e.target.value)}
                        className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-700 font-medium focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Até</label>
                      <input
                        type="date"
                        value={chartEndDate}
                        onChange={(e) => setChartEndDate(e.target.value)}
                        className="w-full px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-700 font-medium focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={applyChartDateRange}
                    className="w-full mt-2 py-1.5 rounded-lg bg-[#00a83e] hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all"
                  >
                    Aplicar período
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Gráfico de Barras Minimalista com Micro-interações */}
        <div className="flex items-end h-36 pt-4 pb-2 justify-around gap-2 sm:gap-4">
          {chartData.map((item, index) => {
            const isHighest = item.count === maxChartCount;
            const isHovered = hoveredBarIndex === index;

            return (
              <div
                key={item.day}
                onMouseEnter={() => setHoveredBarIndex(index)}
                onMouseLeave={() => setHoveredBarIndex(null)}
                className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer max-w-[56px]"
              >
                {/* Tooltip com contagem */}
                <div
                  className={`mb-2 px-2 py-0.5 rounded text-[11px] font-bold transition-all duration-200 ${
                    isHovered || isHighest
                      ? 'bg-slate-900 text-white shadow-md -translate-y-0.5'
                      : 'text-slate-400 opacity-60'
                  }`}
                >
                  {item.count}
                </div>

                {/* Coluna da barra animada */}
                <div className="w-full max-w-[42px] bg-slate-100 rounded-lg h-24 flex items-end p-1 overflow-hidden">
                  <motion.div
                    key={`${chartPeriod}-${item.day}`}
                    initial={{ height: 0 }}
                    animate={{ height: `${item.height}%` }}
                    transition={{ duration: 0.8, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
                    className={`w-full rounded-md transition-colors duration-300 ${
                      isHighest
                        ? 'bg-gradient-to-t from-[#00a83e] to-emerald-400 shadow-xs'
                        : isHovered
                        ? 'bg-emerald-600'
                        : 'bg-emerald-500/80 group-hover:bg-emerald-600'
                    }`}
                  />
                </div>

                {/* Dia / Período */}
                <span
                  className={`text-xs mt-2 font-semibold transition-colors ${
                    isHovered || isHighest ? 'text-[#00a83e] font-bold' : 'text-slate-500'
                  }`}
                >
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}
