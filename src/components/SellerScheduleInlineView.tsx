import { useState, useMemo } from "react";
import {
  Calendar as CalendarIcon,
  Clock,
  Sparkles,
  CheckCircle2,
  CalendarDays,
  ChevronRight,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Salesperson } from "../types";
import { CalendarEvent, getSellerEvents } from "../data/calendarData";

interface SellerScheduleInlineViewProps {
  salesperson: Salesperson;
  onClose?: () => void;
  onSync?: () => void;
  isSyncing?: boolean;
}

type TimeWindowPreset = "semana" | "quinzena" | "mes" | "personalizado";

export function SellerScheduleInlineView({
  salesperson,
}: SellerScheduleInlineViewProps) {
  const [events] = useState<CalendarEvent[]>(() =>
    getSellerEvents(salesperson.id, salesperson.name)
  );

  const [preset, setPreset] = useState<TimeWindowPreset>("semana");
  const [customStartDate, setCustomStartDate] = useState("2026-09-08");
  const [customEndDate, setCustomEndDate] = useState("2026-09-22");
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Intervalos definidos
  const range = useMemo(() => {
    switch (preset) {
      case "semana":
        return { start: "2026-09-08", end: "2026-09-14", label: "08/Set a 14/Set (Semana Atual)" };
      case "quinzena":
        return { start: "2026-09-08", end: "2026-09-22", label: "08/Set a 22/Set (Próximos 15 dias)" };
      case "mes":
        return { start: "2026-09-01", end: "2026-09-30", label: "01/Set a 30/Set (Mês de Setembro)" };
      case "personalizado":
      default:
        return {
          start: customStartDate,
          end: customEndDate,
          label: `${customStartDate.split("-").reverse().join("/")} a ${customEndDate.split("-").reverse().join("/")}`,
        };
    }
  }, [preset, customStartDate, customEndDate]);

  // Contagens para os badges
  const countSemana = useMemo(() => {
    return events.filter(
      (e) => (e.dateISO || "2026-09-08") >= "2026-09-08" && (e.dateISO || "2026-09-08") <= "2026-09-14"
    ).length;
  }, [events]);

  const countQuinzena = useMemo(() => {
    return events.filter(
      (e) => (e.dateISO || "2026-09-08") >= "2026-09-08" && (e.dateISO || "2026-09-08") <= "2026-09-22"
    ).length;
  }, [events]);

  const countMes = useMemo(() => {
    return events.filter(
      (e) => (e.dateISO || "2026-09-08") >= "2026-09-01" && (e.dateISO || "2026-09-08") <= "2026-09-30"
    ).length;
  }, [events]);

  // Eventos filtrados pela janela de tempo
  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      const evDate = ev.dateISO || "2026-09-08";
      return evDate >= range.start && evDate <= range.end;
    });
  }, [events, range]);

  const handleSelectPreset = (p: TimeWindowPreset) => {
    setPreset(p);
    if (p !== "personalizado") {
      setShowDatePicker(false);
    }
  };

  const handleToggleCustomCalendar = () => {
    if (preset === "personalizado") {
      setShowDatePicker(!showDatePicker);
    } else {
      setPreset("personalizado");
      setShowDatePicker(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="overflow-hidden bg-slate-100/80 border-t-2 border-emerald-500/40 -mx-4 -mb-4 sm:-mx-5 sm:-mb-5 p-5 sm:p-7 mt-4 rounded-b-2xl shadow-inner"
    >
      <div className="space-y-4">
        {/* Barra de Filtros: Semana, Quinzena, Mês e Ícone de Calendário */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 text-xs max-w-full overflow-x-auto">
            {/* 1. Semana */}
            <button
              type="button"
              onClick={() => handleSelectPreset("semana")}
              className={`py-1.5 px-3.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
                preset === "semana"
                  ? "bg-white text-[#00a83e] shadow-xs font-extrabold border border-emerald-100"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Semana</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-md font-extrabold ${
                  preset === "semana"
                    ? "bg-emerald-100/70 text-[#00a83e]"
                    : "bg-slate-200/70 text-slate-500"
                }`}
              >
                {countSemana}
              </span>
            </button>

            {/* 2. Quinzena */}
            <button
              type="button"
              onClick={() => handleSelectPreset("quinzena")}
              className={`py-1.5 px-3.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
                preset === "quinzena"
                  ? "bg-white text-[#00a83e] shadow-xs font-extrabold border border-emerald-100"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Quinzena</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-md font-extrabold ${
                  preset === "quinzena"
                    ? "bg-emerald-100/70 text-[#00a83e]"
                    : "bg-slate-200/70 text-slate-500"
                }`}
              >
                {countQuinzena}
              </span>
            </button>

            {/* 3. Mês */}
            <button
              type="button"
              onClick={() => handleSelectPreset("mes")}
              className={`py-1.5 px-3.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
                preset === "mes"
                  ? "bg-white text-[#00a83e] shadow-xs font-extrabold border border-emerald-100"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Mês</span>
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-md font-extrabold ${
                  preset === "mes"
                    ? "bg-emerald-100/70 text-[#00a83e]"
                    : "bg-slate-200/70 text-slate-500"
                }`}
              >
                {countMes}
              </span>
            </button>

            {/* 4. Ícone de Calendário para Definir Janela de Tempo */}
            <button
              type="button"
              onClick={handleToggleCustomCalendar}
              title="Definir janela de tempo personalizada"
              className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
                preset === "personalizado"
                  ? "bg-white text-[#00a83e] shadow-xs font-extrabold border border-emerald-100"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <CalendarDays className={`w-4 h-4 ${preset === "personalizado" ? "text-[#00a83e]" : "text-slate-500"}`} />
              <span className="hidden sm:inline">Personalizado</span>
            </button>
          </div>

          {/* Indicador do Intervalo Ativo */}
          <div className="flex items-center space-x-2 text-xs text-slate-500 bg-white/80 border border-slate-200/80 px-3 py-1.5 rounded-xl">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span className="font-semibold text-slate-700">{range.label}</span>
            <span className="text-slate-300">•</span>
            <span className="font-bold text-slate-900">{filteredEvents.length} compromisso(s)</span>
          </div>
        </div>

        {/* Painel Expansível de Seleção de Janela de Tempo (Data Inicial e Final) */}
        <AnimatePresence>
          {(preset === "personalizado" || showDatePicker) && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="bg-white p-4 rounded-2xl border border-emerald-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-800">
                <CalendarIcon className="w-4 h-4 text-[#00a83e]" />
                <span>Definir Janela de Tempo:</span>
              </div>

              <div className="flex items-center space-x-2.5 flex-wrap gap-y-2">
                <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-xl">
                  <span className="text-[11px] font-bold text-slate-500">De:</span>
                  <input
                    type="date"
                    value={customStartDate}
                    onChange={(e) => {
                      setCustomStartDate(e.target.value);
                      setPreset("personalizado");
                    }}
                    className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                  />
                </div>

                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />

                <div className="flex items-center space-x-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-xl">
                  <span className="text-[11px] font-bold text-slate-500">Até:</span>
                  <input
                    type="date"
                    value={customEndDate}
                    onChange={(e) => {
                      setCustomEndDate(e.target.value);
                      setPreset("personalizado");
                    }}
                    className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                  />
                </div>

                {preset === "personalizado" && (
                  <button
                    type="button"
                    onClick={() => handleSelectPreset("semana")}
                    className="text-xs text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
                    title="Voltar para visualização semanal"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Lista Destacada de Compromissos (Apenas Título, Data e Horário) */}
        {filteredEvents.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-slate-200 shadow-sm">
            <CalendarIcon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">Nenhum compromisso marcado para este período</p>
            <p className="text-xs text-slate-400 mt-1">Nenhum evento registrado entre {range.label}.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3.5">
            {filteredEvents.map((ev) => (
              <div
                key={ev.id}
                className="bg-white rounded-2xl border-2 border-slate-200/90 hover:border-emerald-500/80 shadow-md hover:shadow-lg transition-all duration-200 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden"
              >
                {/* Faixa lateral indicativa de destaque */}
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#00a83e]" />

                {/* Bloco 1: Data e Horário em Destaque */}
                <div className="flex items-center space-x-4 pl-1 min-w-[240px]">
                  {/* Badge de Data */}
                  <div className="bg-slate-900 text-white px-3.5 py-2.5 rounded-xl flex flex-col items-center justify-center text-center shadow-xs shrink-0 min-w-[70px]">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                      {ev.dayOfWeek}
                    </span>
                    <span className="text-sm font-black text-white">
                      {ev.dateStr}
                    </span>
                  </div>

                  {/* Horário em Destaque */}
                  <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-200/80 px-3.5 py-2 rounded-xl">
                    <Clock className="w-4 h-4 text-[#00a83e] shrink-0" />
                    <span className="text-sm font-black text-emerald-950">
                      {ev.timeStart} – {ev.timeEnd}
                    </span>
                  </div>
                </div>

                {/* Bloco 2: Título do Evento em Destaque */}
                <div className="flex-1 sm:px-3">
                  <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                    <h4 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                      {ev.title}
                    </h4>
                    {ev.isAiGenerated && (
                      <span className="inline-flex items-center space-x-1 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-[#00a83e] border border-emerald-200 shrink-0">
                        <Sparkles className="w-3 h-3" />
                        <span>Agendado via IA</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Bloco 3: Confirmação Simples */}
                <div className="shrink-0 self-end sm:self-center">
                  <span className="inline-flex items-center space-x-1.5 text-xs font-bold px-3.5 py-1.5 rounded-xl bg-slate-50 text-slate-700 border border-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-[#00a83e]" />
                    <span>Confirmado</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
