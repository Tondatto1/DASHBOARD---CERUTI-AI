import React, { useState } from "react";
import {
  Search,
  X,
  Calendar,
  User,
  Tag as TagIcon,
  Flame,
  Kanban as KanbanIcon,
  List,
  CalendarRange,
  Plus,
  SlidersHorizontal,
  RotateCcw,
  Columns3,
  ChevronDown,
} from "lucide-react";
import { CRMTag, CRMDeal } from "../../types";

export type DateFilterPreset = "todas" | "semana" | "mes" | "proximos30" | "personalizado";

interface CRMFilterBarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedSalesperson: string;
  setSelectedSalesperson: (val: string) => void;
  datePreset: DateFilterPreset;
  setDatePreset: (val: DateFilterPreset) => void;
  customStartDate: string;
  setCustomStartDate: (val: string) => void;
  customEndDate: string;
  setCustomEndDate: (val: string) => void;
  selectedPriority: string;
  setSelectedPriority: (val: string) => void;
  selectedTag: string;
  setSelectedTag: (val: string) => void;
  availableTags: CRMTag[];
  dealsCount: number;
  totalDealsCount: number;
  viewMode: "kanban" | "lista" | "gantt";
  setViewMode: (val: "kanban" | "lista" | "gantt") => void;
  onOpenNewDealModal: () => void;
  onOpenTagManagerModal: () => void;
  onOpenColumnManagerModal: () => void;
  onResetFilters: () => void;
  activeFiltersCount: number;
  salespeopleList: string[];
}

export const CRMFilterBar: React.FC<CRMFilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedSalesperson,
  setSelectedSalesperson,
  datePreset,
  setDatePreset,
  customStartDate,
  setCustomStartDate,
  customEndDate,
  setCustomEndDate,
  selectedPriority,
  setSelectedPriority,
  selectedTag,
  setSelectedTag,
  availableTags,
  dealsCount,
  totalDealsCount,
  viewMode,
  setViewMode,
  onOpenNewDealModal,
  onOpenTagManagerModal,
  onOpenColumnManagerModal,
  onResetFilters,
  activeFiltersCount,
  salespeopleList,
}) => {
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 shadow-xs space-y-3">
      {/* Linha 1: Busca Geral + Modos de Visualização + Botões de Gestão (Tags, Colunas, Novo Negócio) */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Campo de Busca Rápida */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por produtor, fazenda, produto, cidade, tag ou colaborador..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-9 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200/90 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 transition-all focus:outline-none focus:ring-2 focus:ring-[#00a83e]/20 focus:border-[#00a83e]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Grupo da Direita: Modos de Visualização & Botões de Configuração */}
        <div className="flex flex-wrap items-center justify-between lg:justify-end gap-2 shrink-0">
          {/* Seletor Visual Kanban / Lista / Gantt */}
          <div className="inline-flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/70 text-xs">
            <button
              type="button"
              onClick={() => setViewMode("kanban")}
              className={`py-1.5 px-3 rounded-lg font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                viewMode === "kanban"
                  ? "bg-white text-[#00a83e] shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              title="Quadro Kanban"
            >
              <KanbanIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kanban</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode("lista")}
              className={`py-1.5 px-3 rounded-lg font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                viewMode === "lista"
                  ? "bg-white text-[#00a83e] shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              title="Tabela em Lista"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Lista</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode("gantt")}
              className={`py-1.5 px-3 rounded-lg font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                viewMode === "gantt"
                  ? "bg-white text-[#00a83e] shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              title="Cronograma Gantt"
            >
              <CalendarRange className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Gantt</span>
            </button>
          </div>

          <div className="h-5 w-px bg-slate-200 hidden sm:block" />

          {/* Botão Gerenciar Tags */}
          <button
            type="button"
            onClick={onOpenTagManagerModal}
            className="py-1.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-2xs hover:border-slate-300 active:scale-95"
            title="Adicionar, editar e remover tags"
          >
            <TagIcon className="w-3.5 h-3.5 text-emerald-600" />
            <span>Tags ({availableTags.length})</span>
          </button>

          {/* Botão Gerenciar Colunas */}
          <button
            type="button"
            onClick={onOpenColumnManagerModal}
            className="py-1.5 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-2xs hover:border-slate-300 active:scale-95"
            title="Adicionar, editar e organizar colunas do funil"
          >
            <Columns3 className="w-3.5 h-3.5 text-sky-600" />
            <span>Colunas</span>
          </button>

          {/* Botão Novo Negócio */}
          <button
            type="button"
            onClick={onOpenNewDealModal}
            className="py-2 px-3.5 bg-[#00a83e] hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm shadow-emerald-600/20 hover:shadow-md transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Novo Negócio</span>
          </button>
        </div>
      </div>

      {/* Linha 2: Barra de Filtros Específicos (Data, Vendedor, Prioridade, Tag) */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2">
          {/* 1. Filtro de Data */}
          <div className="relative">
            <div className="inline-flex items-center bg-slate-50 border border-slate-200 rounded-xl p-0.5 text-xs">
              <button
                type="button"
                onClick={() => {
                  setDatePreset("todas");
                  setIsDatePickerOpen(false);
                }}
                className={`px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  datePreset === "todas"
                    ? "bg-white text-slate-900 shadow-2xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Todas as Datas
              </button>

              <button
                type="button"
                onClick={() => {
                  setDatePreset("semana");
                  setIsDatePickerOpen(false);
                }}
                className={`px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  datePreset === "semana"
                    ? "bg-white text-[#00a83e] shadow-2xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Semana
              </button>

              <button
                type="button"
                onClick={() => {
                  setDatePreset("mes");
                  setIsDatePickerOpen(false);
                }}
                className={`px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer ${
                  datePreset === "mes"
                    ? "bg-white text-[#00a83e] shadow-2xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Mês
              </button>

              <button
                type="button"
                onClick={() => {
                  setDatePreset("proximos30");
                  setIsDatePickerOpen(false);
                }}
                className={`px-2.5 py-1.5 rounded-lg font-bold transition-all cursor-pointer hidden sm:block ${
                  datePreset === "proximos30"
                    ? "bg-white text-[#00a83e] shadow-2xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                30 Dias
              </button>

              <button
                type="button"
                onClick={() => {
                  setDatePreset("personalizado");
                  setIsDatePickerOpen(!isDatePickerOpen);
                }}
                className={`px-2.5 py-1.5 rounded-lg font-bold transition-all flex items-center space-x-1 cursor-pointer ${
                  datePreset === "personalizado"
                    ? "bg-[#00a83e] text-white shadow-2xs"
                    : "text-slate-500 hover:text-slate-800"
                }`}
                title="Definir período personalizado"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Período</span>
              </button>
            </div>

            {/* Popover de Data Personalizada */}
            {isDatePickerOpen && datePreset === "personalizado" && (
              <div className="absolute top-full left-0 mt-2 z-30 bg-white border border-slate-200 rounded-2xl shadow-xl p-3.5 w-72 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#00a83e]" />
                    <span>Intervalo de Datas</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsDatePickerOpen(false)}
                    className="text-slate-400 hover:text-slate-600 p-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      De (Data Início)
                    </label>
                    <input
                      type="date"
                      value={customStartDate}
                      onChange={(e) => setCustomStartDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#00a83e]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">
                      Até (Data Fim)
                    </label>
                    <input
                      type="date"
                      value={customEndDate}
                      onChange={(e) => setCustomEndDate(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#00a83e]"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setCustomStartDate("");
                      setCustomEndDate("");
                      setDatePreset("todas");
                      setIsDatePickerOpen(false);
                    }}
                    className="px-2.5 py-1 text-[11px] font-semibold text-slate-500 hover:text-slate-700"
                  >
                    Limpar
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsDatePickerOpen(false)}
                    className="px-3 py-1 bg-[#00a83e] text-white text-[11px] font-bold rounded-lg shadow-2xs"
                  >
                    Aplicar
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 2. Filtro por Vendedor / Consultor */}
          <div className="relative">
            <select
              value={selectedSalesperson}
              onChange={(e) => setSelectedSalesperson(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#00a83e]/20 transition-all cursor-pointer"
            >
              <option value="todos">👤 Toda a Equipe</option>
              {salespeopleList.map((sp) => (
                <option key={sp} value={sp}>
                  {sp}
                </option>
              ))}
            </select>
          </div>

          {/* 3. Filtro por Prioridade */}
          <div className="relative">
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#00a83e]/20 transition-all cursor-pointer"
            >
              <option value="todas">🎯 Todas as Prioridades</option>
              <option value="alta">🔥 Alta Prioridade</option>
              <option value="média">⚡ Média Prioridade</option>
              <option value="baixa">🌱 Baixa Prioridade</option>
            </select>
          </div>

          {/* 4. Filtro por Tag */}
          <div className="relative">
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#00a83e]/20 transition-all cursor-pointer"
            >
              <option value="todas">🏷️ Todas as Tags ({availableTags.length})</option>
              {availableTags.map((tag) => (
                <option key={tag.id} value={tag.name}>
                  {tag.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Resumo de Resultados e Reset */}
        <div className="flex items-center space-x-2 shrink-0 text-xs">
          <span className="font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
            {dealsCount} de {totalDealsCount} oportunidades
          </span>

          {activeFiltersCount > 0 && (
            <button
              type="button"
              onClick={onResetFilters}
              className="py-1 px-2 text-rose-600 hover:bg-rose-50 rounded-lg font-bold flex items-center space-x-1 transition-colors cursor-pointer"
              title="Limpar todos os filtros aplicados"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Limpar ({activeFiltersCount})</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
