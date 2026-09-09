import React, { useState, useMemo } from "react";
import {
  DollarSign,
  Briefcase,
  TrendingUp,
  CheckCircle2,
  Filter,
  Users,
  Layers,
  ArrowUpRight,
  Sparkles,
  ChevronRight,
  PieChart as PieChartIcon,
  BarChart2,
} from "lucide-react";
import { motion } from "motion/react";
import { CRMDeal, CRMColumn, Salesperson } from "../../types";
import { formatBRL } from "../../data/crmData";

interface CRMMetricsTabProps {
  deals: CRMDeal[];
  columns: CRMColumn[];
  metrics: {
    totalPipelineValue: number;
    totalDeals: number;
    winRate: number;
    avgTicket: number;
    totalSalesValue: number;
    salesCount: number;
  };
  salespeople: Salesperson[];
}

export const CRMMetricsTab: React.FC<CRMMetricsTabProps> = ({
  deals,
  columns,
  metrics,
  salespeople,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<"todos" | "alta" | "media">("todos");
  const [hoveredPoint, setHoveredPoint] = useState<{
    label: string;
    value: number;
    count: number;
  } | null>(null);

  // Deals filtrados se o usuário selecionar filtro rápido
  const currentDeals = useMemo(() => {
    if (selectedFilter === "alta") return deals.filter((d) => d.priority === "alta");
    if (selectedFilter === "media") return deals.filter((d) => d.priority === "média");
    return deals;
  }, [deals, selectedFilter]);

  // Agrupamento por Coluna / Etapa
  const stageStats = useMemo(() => {
    return columns.map((col) => {
      const colDeals = currentDeals.filter((d) => d.stage === col.key || d.stage === col.label);
      const val = colDeals.reduce((acc, d) => acc + (d.value || 0), 0);
      return {
        key: col.key,
        label: col.label,
        count: colDeals.length,
        value: val,
        color: col.barColor || "#00a83e",
        dotColor: col.dotColor || "#00a83e",
        pct: metrics.totalPipelineValue > 0 ? (val / metrics.totalPipelineValue) * 100 : 0,
      };
    });
  }, [columns, currentDeals, metrics.totalPipelineValue]);

  // Agrupamento por Prioridade
  const priorityStats = useMemo(() => {
    const high = currentDeals.filter((d) => d.priority === "alta");
    const med = currentDeals.filter((d) => d.priority === "média");
    const low = currentDeals.filter((d) => d.priority === "baixa");

    const total = currentDeals.length || 1;
    return {
      high: { count: high.length, pct: Math.round((high.length / total) * 100), val: high.reduce((a, b) => a + b.value, 0) },
      med: { count: med.length, pct: Math.round((med.length / total) * 100), val: med.reduce((a, b) => a + b.value, 0) },
      low: { count: low.length, pct: Math.round((low.length / total) * 100), val: low.reduce((a, b) => a + b.value, 0) },
    };
  }, [currentDeals]);

  // Performance por Consultor
  const consultantStats = useMemo(() => {
    const map = new Map<string, { totalVal: number; dealsCount: number; salesVal: number }>();
    currentDeals.forEach((deal) => {
      const name = deal.salespersonName || "Não Atribuído";
      const curr = map.get(name) || { totalVal: 0, dealsCount: 0, salesVal: 0 };
      curr.totalVal += deal.value || 0;
      curr.dealsCount += 1;
      if (deal.stage === "Vendas" || deal.stage === "Finalizados") {
        curr.salesVal += deal.value || 0;
      }
      map.set(name, curr);
    });

    return Array.from(map.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.totalVal - a.totalVal);
  }, [currentDeals]);

  // SVG Area Sparkline calculation for Volume no Funil
  const sparklineData = useMemo(() => {
    const nonZeroStages = stageStats.filter((s) => s.value > 0);
    const dataPoints = nonZeroStages.length > 0 ? nonZeroStages : stageStats.slice(0, 5);
    const maxVal = Math.max(...dataPoints.map((d) => d.value), 1);
    const width = 320;
    const height = 90;
    const padding = 12;

    const points = dataPoints.map((d, index) => {
      const x = padding + (index / Math.max(dataPoints.length - 1, 1)) * (width - 2 * padding);
      const y = height - padding - (d.value / maxVal) * (height - 2 * padding);
      return { x, y, label: d.label, value: d.value, count: d.count };
    });

    const pathD = points.reduce((acc, p, i) => {
      if (i === 0) return `M ${p.x} ${p.y}`;
      // Smooth curve
      const prev = points[i - 1];
      const cx = (prev.x + p.x) / 2;
      return `${acc} C ${cx} ${prev.y}, ${cx} ${p.y}, ${p.x} ${p.y}`;
    }, "");

    const areaD = points.length > 0
      ? `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`
      : "";

    return { points, pathD, areaD, width, height };
  }, [stageStats]);

  // Donut SVG Calculations for Opportunities
  const donutData = useMemo(() => {
    const highPct = priorityStats.high.pct;
    const medPct = priorityStats.med.pct;
    const lowPct = priorityStats.low.pct;

    const radius = 38;
    const circumference = 2 * Math.PI * radius;

    const highStroke = (highPct / 100) * circumference;
    const medStroke = (medPct / 100) * circumference;
    const lowStroke = (lowPct / 100) * circumference;

    const highOffset = 0;
    const medOffset = -highStroke;
    const lowOffset = -(highStroke + medStroke);

    return {
      radius,
      circumference,
      highStroke,
      medStroke,
      lowStroke,
      highOffset,
      medOffset,
      lowOffset,
    };
  }, [priorityStats]);

  return (
    <div className="space-y-6">
      {/* Top Header com Filtro Rápido e Resumo de Performance */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00a83e] animate-pulse" />
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Painel Executivo de Métricas Agro
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Análise em tempo real do funil, volume financeiro, oportunidades e faturamento de safra.
          </p>
        </div>

        <div className="flex items-center space-x-1.5 self-start sm:self-auto bg-slate-100 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => setSelectedFilter("todos")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedFilter === "todos"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Todos os Negócios
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter("alta")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedFilter === "alta"
                ? "bg-white text-rose-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Prioridade Alta
          </button>
          <button
            type="button"
            onClick={() => setSelectedFilter("media")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              selectedFilter === "media"
                ? "bg-white text-amber-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Prioridade Média
          </button>
        </div>
      </div>

      {/* Grid Principal: Os 4 Cards de Métricas Reconstruídos com Gráficos Modernos e Minimalistas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* CARD 1: VOLUME NO FUNIL */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Volume no Funil
                </span>
                <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5 block">
                  {formatBRL(metrics.totalPipelineValue)}
                </span>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#00a83e] flex items-center justify-center font-black">
                <DollarSign className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-2 flex items-center space-x-1 text-[11px] font-bold text-emerald-700">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Pipeline Ativo em Negociação</span>
            </div>

            {/* Gráfico Minimalista: Curva de Densidade de Volume por Etapa */}
            <div className="mt-4 relative pt-1">
              <svg
                viewBox={`0 0 ${sparklineData.width} ${sparklineData.height}`}
                className="w-full h-20 overflow-visible"
              >
                <defs>
                  <linearGradient id="metricGreenGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00a83e" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#00a83e" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Área Gradiente Suave */}
                <path d={sparklineData.areaD} fill="url(#metricGreenGrad)" />

                {/* Linha Minimalista */}
                <path
                  d={sparklineData.pathD}
                  fill="none"
                  stroke="#00a83e"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />

                {/* Pontos Interativos */}
                {sparklineData.points.map((pt, idx) => (
                  <circle
                    key={idx}
                    cx={pt.x}
                    cy={pt.y}
                    r={hoveredPoint?.label === pt.label ? 5 : 3.5}
                    className="fill-white stroke-[#00a83e] stroke-2 cursor-pointer transition-all hover:r-5"
                    onMouseEnter={() => setHoveredPoint(pt)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                ))}
              </svg>

              {/* Tooltip Dinâmico ao passar o mouse */}
              {hoveredPoint && (
                <div className="absolute top-0 right-0 bg-slate-900 text-white text-[10px] py-1 px-2 rounded-lg shadow-lg pointer-events-none transition-all">
                  <p className="font-bold">{hoveredPoint.label}</p>
                  <p className="text-emerald-400 font-black">{formatBRL(hoveredPoint.value)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Mini Barra de Distribuição Segmentada */}
          <div className="mt-3 pt-3 border-t border-slate-100">
            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1.5">
              <span>Etapas com maior peso</span>
              <span className="font-bold text-slate-800">
                {stageStats.filter((s) => s.value > 0).length} ativas
              </span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full flex overflow-hidden gap-0.5">
              {stageStats.map((st, i) => (
                st.pct > 0 && (
                  <div
                    key={i}
                    style={{ width: `${st.pct}%`, backgroundColor: st.color }}
                    title={`${st.label}: ${formatBRL(st.value)} (${Math.round(st.pct)}%)`}
                    className="h-full rounded-full transition-all"
                  />
                )
              ))}
            </div>
          </div>
        </div>

        {/* CARD 2: OPORTUNIDADES */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Oportunidades
                </span>
                <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5 block">
                  {metrics.totalDeals} negócios
                </span>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center font-black">
                <Briefcase className="w-5 h-5" />
              </div>
            </div>

            <p className="text-[11px] text-slate-500 mt-2">
              Distribuição estratégica por prioridade de atendimento
            </p>

            {/* Gráfico Minimalista: Donut Moderno com Traçado Geométrico */}
            <div className="mt-3 flex items-center justify-center py-2">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  {/* Fundo do Anel */}
                  <circle
                    cx="50"
                    cy="50"
                    r={donutData.radius}
                    fill="none"
                    stroke="#f1f5f9"
                    strokeWidth="9"
                  />
                  {/* Prioridade Alta */}
                  <circle
                    cx="50"
                    cy="50"
                    r={donutData.radius}
                    fill="none"
                    stroke="#e11d48"
                    strokeWidth="9"
                    strokeDasharray={`${donutData.highStroke} ${donutData.circumference}`}
                    strokeDashoffset={donutData.highOffset}
                    strokeLinecap="round"
                    className="transition-all duration-700"
                  />
                  {/* Prioridade Média */}
                  <circle
                    cx="50"
                    cy="50"
                    r={donutData.radius}
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="9"
                    strokeDasharray={`${donutData.medStroke} ${donutData.circumference}`}
                    strokeDashoffset={donutData.medOffset}
                    strokeLinecap="round"
                    className="transition-all duration-700"
                  />
                  {/* Prioridade Baixa */}
                  <circle
                    cx="50"
                    cy="50"
                    r={donutData.radius}
                    fill="none"
                    stroke="#0ea5e9"
                    strokeWidth="9"
                    strokeDasharray={`${donutData.lowStroke} ${donutData.circumference}`}
                    strokeDashoffset={donutData.lowOffset}
                    strokeLinecap="round"
                    className="transition-all duration-700"
                  />
                </svg>

                {/* Número Central */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  <span className="text-base font-black text-slate-900 leading-none">
                    {metrics.totalDeals}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">
                    Deals
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Legenda Minimalista */}
          <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-3 gap-1 text-[10px]">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-600" />
              <span className="text-slate-600 font-medium">Alta ({priorityStats.high.count})</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-slate-600 font-medium">Média ({priorityStats.med.count})</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-sky-500" />
              <span className="text-slate-600 font-medium">Baixa ({priorityStats.low.count})</span>
            </div>
          </div>
        </div>

        {/* CARD 3: TICKET MÉDIO */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Ticket Médio
                </span>
                <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-0.5 block">
                  {formatBRL(metrics.avgTicket)}
                </span>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-black">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>

            <p className="text-[11px] text-slate-500 mt-2">
              Comparativo de valor entre as oportunidades abertas
            </p>

            {/* Gráfico Minimalista: Colunas com Linha de Benchmark da Média */}
            <div className="mt-4 relative h-24 flex items-end justify-between gap-1 px-1">
              {/* Linha tracejada da média */}
              <div
                className="absolute left-0 right-0 border-t border-dashed border-amber-400 z-10 flex items-center justify-end pr-1 pointer-events-none"
                style={{ bottom: "50%" }}
              >
                <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1 rounded">
                  Média
                </span>
              </div>

              {/* Barras de Oportunidades com alturas proporcionais */}
              {deals.slice(0, 7).map((deal, idx) => {
                const maxDealVal = Math.max(...deals.map((d) => d.value), 1);
                const heightPct = Math.max(15, Math.round((deal.value / maxDealVal) * 85));
                const isAboveAvg = deal.value >= metrics.avgTicket;

                return (
                  <div
                    key={idx}
                    className="flex-1 flex flex-col items-center group relative cursor-pointer"
                  >
                    <div
                      className={`w-full rounded-t-lg transition-all duration-300 group-hover:opacity-80 ${
                        isAboveAvg ? "bg-amber-500" : "bg-slate-200"
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                    {/* Tooltip ao passar o mouse */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full mb-1 bg-slate-900 text-white text-[9px] py-1 px-1.5 rounded whitespace-nowrap z-20 pointer-events-none">
                      <p className="font-bold truncate max-w-[120px]">{deal.clientName}</p>
                      <p className="text-amber-400 font-black">{formatBRL(deal.value)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Faixa de Contratos:</span>
            <span className="font-bold text-slate-800">
              {formatBRL(Math.min(...deals.map((d) => d.value), 0))} a{" "}
              {formatBRL(Math.max(...deals.map((d) => d.value), 0))}
            </span>
          </div>
        </div>

        {/* CARD 4: FATURAMENTO */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Faturamento
                </span>
                <span className="text-xl sm:text-2xl font-black text-[#00a83e] tracking-tight mt-0.5 block">
                  {formatBRL(metrics.totalSalesValue)}
                </span>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-[#00a83e] flex items-center justify-center font-black">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between text-[11px]">
              <span className="text-slate-500">Conversão de Vendas</span>
              <span className="font-bold text-emerald-700">
                {metrics.winRate > 0 ? `${metrics.winRate}%` : `${metrics.salesCount} vendas`}
              </span>
            </div>

            {/* Gráfico Minimalista: Medidor de Ritmo e Progresso de Safra */}
            <div className="mt-3 py-2 flex flex-col items-center justify-center">
              <div className="w-full bg-slate-100 rounded-2xl p-3 border border-slate-100">
                <div className="flex justify-between items-center text-[10px] font-bold text-slate-600 mb-1.5">
                  <span>Progresso do Período</span>
                  <span className="text-[#00a83e]">
                    {metrics.totalSalesValue > 0 ? "Em expansão" : "Sem fechamentos"}
                  </span>
                </div>
                {/* Barra de Progresso com Gradiente */}
                <div className="w-full h-3 bg-slate-200/80 rounded-full overflow-hidden p-0.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min(
                        100,
                        metrics.totalPipelineValue > 0
                          ? Math.round((metrics.totalSalesValue / metrics.totalPipelineValue) * 100) + 15
                          : 25
                      )}%`,
                    }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-[#00a83e] rounded-full"
                  />
                </div>
                <div className="flex justify-between items-center text-[9px] text-slate-400 mt-1">
                  <span>R$ 0</span>
                  <span>Meta: R$ 500k</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Contratos Finalizados:</span>
            <span className="font-black text-emerald-700">
              {metrics.salesCount} fechados
            </span>
          </div>
        </div>

      </div>

      {/* Seção Inferior: Detalhamento Estrutural por Etapas do Funil & Consultores */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Distribuição por Etapas do Funil */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Volume Alocado por Etapa</h3>
                <span className="text-[11px] text-slate-400">
                  Visão consolidada das oportunidades em cada fase
                </span>
              </div>
            </div>
            <span className="text-xs font-bold text-slate-500">
              {stageStats.length} etapas no funil
            </span>
          </div>

          <div className="space-y-3">
            {stageStats.map((st) => (
              <div
                key={st.key}
                className="p-3 rounded-2xl bg-slate-50/70 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-slate-50 transition-all"
              >
                <div className="flex items-center space-x-2.5">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: st.color }}
                  />
                  <div>
                    <h4 className="font-bold text-xs text-slate-900">{st.label}</h4>
                    <span className="text-[10px] text-slate-400">
                      {st.count} {st.count === 1 ? "oportunidade" : "oportunidades"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="w-28 sm:w-36 bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.max(2, st.pct)}%`,
                        backgroundColor: st.color,
                      }}
                    />
                  </div>
                  <div className="text-right min-w-[90px]">
                    <span className="font-black text-xs text-slate-900 block">
                      {formatBRL(st.value)}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-medium">
                      {Math.round(st.pct)}% do total
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Produtividade por Consultor Técnico / RTV */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
              <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Consultores em Atividade</h3>
                <span className="text-[11px] text-slate-400">
                  Carteira e volume gerenciado por RTV
                </span>
              </div>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {consultantStats.map((consultant, i) => (
                <div key={i} className="py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-full bg-emerald-50 text-[#00a83e] font-black text-xs flex items-center justify-center">
                      {consultant.name.charAt(0)}
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-slate-900">{consultant.name}</h5>
                      <span className="text-[10px] text-slate-400">
                        {consultant.dealsCount} {consultant.dealsCount === 1 ? "negócio" : "negócios"}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-black text-xs text-slate-900 block">
                      {formatBRL(consultant.totalVal)}
                    </span>
                    <span className="text-[10px] text-[#00a83e] font-bold">
                      {consultant.salesVal > 0 ? `${formatBRL(consultant.salesVal)} fechados` : "Em negociação"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-emerald-50/60 rounded-2xl border border-emerald-100 text-[11px] text-emerald-800 flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-[#00a83e] shrink-0" />
            <span>
              Métricas atualizadas automaticamente a cada movimentação nos cards do Kanban.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
