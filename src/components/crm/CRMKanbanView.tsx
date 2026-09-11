import React, { useRef, useState } from "react";
import { motion } from "motion/react";
import {
  GripVertical,
  Flame,
  User,
  MapPin,
  ChevronRight,
  ChevronLeft,
  Move,
  ArrowDown,
  Plus,
  Pencil,
  Trash2,
  Tag as TagIcon,
  Phone,
  Share2,
} from "lucide-react";
import { CRMDeal, CRMColumn, CRMTag, CRMStage, Salesperson } from "../../types";
import { formatBRL } from "../../data/crmData";
import { openDealInWhatsApp, copyDealShareLink } from "../../utils/crmShare";

interface CRMKanbanViewProps {
  columns: CRMColumn[];
  deals: CRMDeal[];
  availableTags: CRMTag[];
  salespeople?: Salesperson[];
  onOpenDealDetail: (deal: CRMDeal) => void;
  onAdvanceStage: (dealId: string) => void;
  onSetStage: (dealId: string, stage: CRMStage) => void;
  onOpenAddColumnModal: () => void;
  onOpenNewDealModalWithStage?: (stageKey: string) => void;
  onOpenShareModal?: (deal: CRMDeal) => void;
  onShowToast?: (msg: string) => void;
}

export const CRMKanbanView: React.FC<CRMKanbanViewProps> = ({
  columns,
  deals,
  availableTags,
  salespeople,
  onOpenDealDetail,
  onAdvanceStage,
  onSetStage,
  onOpenAddColumnModal,
  onOpenNewDealModalWithStage,
  onOpenShareModal,
  onShowToast,
}) => {
  const kanbanScrollRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  // Drag & drop state
  const [draggedDealId, setDraggedDealId] = useState<string | null>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);
  const dragJustEndedRef = useRef(false);

  // Mouse pan navigation
  const handleKanbanMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (
      target.closest("button") ||
      target.closest("input") ||
      target.closest("select") ||
      target.closest("[data-card-item='true']") ||
      target.closest("[data-no-pan='true']")
    ) {
      return;
    }

    setIsPanning(true);
    if (kanbanScrollRef.current) {
      setStartX(e.pageX - kanbanScrollRef.current.offsetLeft);
      setStartY(e.pageY - kanbanScrollRef.current.offsetTop);
      setScrollLeft(kanbanScrollRef.current.scrollLeft);
      setScrollTop(kanbanScrollRef.current.scrollTop);
    }
  };

  const handleKanbanMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPanning || !kanbanScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - kanbanScrollRef.current.offsetLeft;
    const y = e.pageY - kanbanScrollRef.current.offsetTop;
    const walkX = (x - startX) * 1.5;
    const walkY = (y - startY) * 1.5;
    kanbanScrollRef.current.scrollLeft = scrollLeft - walkX;
    kanbanScrollRef.current.scrollTop = scrollTop - walkY;
  };

  const handleKanbanMouseUp = () => {
    setIsPanning(false);
  };

  const handleScrollKanban = (direction: "left" | "right") => {
    if (kanbanScrollRef.current) {
      const scrollAmount = 400;
      kanbanScrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Drag Handlers
  const handleCardDragStart = (e: React.DragEvent, deal: CRMDeal) => {
    e.stopPropagation();
    setDraggedDealId(deal.id);
    e.dataTransfer.setData("text/plain", deal.id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleCardDragEnd = () => {
    dragJustEndedRef.current = true;
    setTimeout(() => {
      dragJustEndedRef.current = false;
    }, 200);
    setDraggedDealId(null);
    setDragOverStage(null);
  };

  const handleColumnDragOver = (e: React.DragEvent, stageKey: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverStage !== stageKey) {
      setDragOverStage(stageKey);
    }
  };

  const handleColumnDrop = (e: React.DragEvent, stageKey: string) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData("text/plain") || draggedDealId;
    if (dealId) {
      onSetStage(dealId, stageKey);
    }
    setDraggedDealId(null);
    setDragOverStage(null);
  };

  return (
    <div className="space-y-2.5 font-sans">
      {/* Barra de Auxílio à Navegação Ampla */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-1 text-xs text-slate-500">
        <div className="flex items-center space-x-2 bg-slate-100/90 px-3.5 py-1.5 rounded-xl border border-slate-200/70 font-medium">
          <Move className="w-3.5 h-3.5 text-[#00a83e] shrink-0" />
          <span>
            <strong>Navegação Ampla:</strong> Clique e segure no fundo da tela para arrastar o quadro lateralmente.
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
            Arraste os cards para mover entre as fases
          </span>
          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={() => handleScrollKanban("left")}
              className="p-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors shadow-2xs cursor-pointer"
              title="Rolar para a esquerda"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => handleScrollKanban("right")}
              className="p-1.5 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors shadow-2xs cursor-pointer"
              title="Rolar para a direita"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Seletor Rápido de Colunas no Mobile */}
      <div className="sm:hidden flex items-center space-x-1.5 overflow-x-auto pb-1.5 px-0.5 scrollbar-none">
        {columns.map((col, idx) => {
          const colDeals = deals.filter((d) => d.stage === col.key);
          return (
            <button
              key={col.id || col.key}
              type="button"
              onClick={() => {
                if (kanbanScrollRef.current) {
                  kanbanScrollRef.current.scrollTo({
                    left: idx * 320,
                    behavior: 'smooth',
                  });
                }
              }}
              className="shrink-0 px-2.5 py-1.5 rounded-xl bg-white border border-slate-200/90 shadow-2xs text-xs font-bold text-slate-700 flex items-center space-x-1.5 active:scale-95 transition-transform"
            >
              <span className={`w-2 h-2 rounded-full ${col.dotColor}`} />
              <span className="truncate max-w-[100px]">{col.label}</span>
              <span className="text-[10px] font-black bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded-full">
                {colDeals.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Canvas Scroll com Panning */}
      <div
        ref={kanbanScrollRef}
        onMouseDown={handleKanbanMouseDown}
        onMouseMove={handleKanbanMouseMove}
        onMouseUp={handleKanbanMouseUp}
        onMouseLeave={handleKanbanMouseUp}
        className={`overflow-x-auto pb-8 pt-1 select-none transition-colors ${
          isPanning ? "cursor-grabbing" : "cursor-grab"
        }`}
        style={{ scrollBehavior: isPanning ? "auto" : "smooth" }}
      >
        <div
          className="flex items-start space-x-3.5 sm:space-x-5 px-1"
          style={{ minWidth: `${Math.max(columns.length * 320 + 200, 1000)}px` }}
        >
          {columns.map((column, colIndex) => {
            const colDeals = deals.filter((d) => d.stage === column.key);
            const colSum = colDeals.reduce((acc, cur) => acc + cur.value, 0);
            const isColumnOver = dragOverStage === column.key && draggedDealId !== null;

            return (
              <div
                key={column.id || column.key}
                onDragOver={(e) => handleColumnDragOver(e, column.key)}
                onDrop={(e) => handleColumnDrop(e, column.key)}
                className={`w-[295px] xs:w-[325px] sm:w-[380px] shrink-0 rounded-3xl border transition-all flex flex-col max-h-[820px] ${
                  isColumnOver
                    ? "bg-emerald-50/70 border-[#00a83e] ring-2 ring-[#00a83e]/30 shadow-lg scale-[1.01]"
                    : "bg-slate-100/70 border-slate-200/80 shadow-2xs"
                }`}
              >
                {/* Topo da Coluna */}
                <div className="p-4 sm:p-4.5 border-b border-slate-200/80 bg-white rounded-t-3xl flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <span className={`w-3 h-3 rounded-full ${column.dotColor} shrink-0 ring-4 ring-slate-50`} />
                    <h4 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                      {column.label}
                    </h4>
                    <span className="text-xs font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
                      {colDeals.length}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-xs sm:text-sm font-black text-slate-700 font-mono">
                      {formatBRL(colSum)}
                    </span>
                    {onOpenNewDealModalWithStage && (
                      <button
                        type="button"
                        data-no-pan="true"
                        onClick={() => onOpenNewDealModalWithStage(column.key)}
                        className="p-1 hover:bg-slate-100 text-slate-400 hover:text-[#00a83e] rounded-lg transition-colors cursor-pointer"
                        title={`Adicionar negócio em ${column.label}`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Drop Placeholder */}
                {isColumnOver && (
                  <div className="m-3 p-3.5 border-2 border-dashed border-[#00a83e] bg-emerald-50 rounded-2xl text-center text-xs font-black text-[#00a83e] flex items-center justify-center space-x-2 animate-pulse shadow-xs">
                    <ArrowDown className="w-4 h-4 animate-bounce" />
                    <span>Soltar oportunidade em {column.label}</span>
                  </div>
                )}

                {/* Lista de Cards da Coluna */}
                <div className="p-3.5 sm:p-4 space-y-3.5 overflow-y-auto flex-1 min-h-[440px]">
                  {colDeals.length === 0 && !isColumnOver ? (
                    <div className="py-16 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-2xl font-medium bg-white/40">
                      Nenhum negócio nesta fase.
                      <div className="text-[11px] text-slate-400 mt-1">
                        Arraste uma oportunidade para cá
                      </div>
                    </div>
                  ) : (
                    colDeals.map((deal) => (
                      <motion.div
                        key={deal.id}
                        layout
                        data-card-item="true"
                        className={`bg-white rounded-2xl border transition-all overflow-hidden flex flex-col group relative select-none shadow-xs hover:shadow-xl hover:border-emerald-300 ${
                          draggedDealId === deal.id
                            ? "opacity-35 scale-[0.98] border-dashed border-[#00a83e] ring-2 ring-[#00a83e]/20"
                            : "border-slate-200/90"
                        }`}
                      >
                        {/* TOPO DO CARD: ÁREA DE ARRASTE COM DESTAQUE VISUAL */}
                        <div
                          draggable
                          onDragStart={(e) => handleCardDragStart(e as unknown as React.DragEvent, deal)}
                          onDragEnd={handleCardDragEnd}
                          onClick={() => {
                            if (!dragJustEndedRef.current) {
                              onOpenDealDetail(deal);
                            }
                          }}
                          className="bg-slate-100/95 hover:bg-slate-200/80 border-b border-slate-200/90 p-3.5 sm:p-4 transition-colors cursor-grab active:cursor-grabbing"
                          title="Clique e segure para arrastar para outra fase"
                        >
                          {/* Badges e Pegador */}
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs font-bold text-emerald-800 bg-emerald-50/95 px-2 py-0.5 rounded-lg border border-emerald-200/70 truncate max-w-[180px] shadow-2xs">
                              {deal.productCategory}
                            </span>

                            <div className="flex items-center space-x-1.5 shrink-0">
                              {deal.priority === "alta" && (
                                <span className="text-[10px] font-extrabold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200/60 flex items-center space-x-1 shadow-2xs">
                                  <Flame className="w-3 h-3 text-rose-600" />
                                  <span>Alta</span>
                                </span>
                              )}
                              <span
                                className="flex items-center space-x-1 text-slate-500 group-hover:text-slate-700 bg-white/95 px-2 py-0.5 rounded-md border border-slate-200/80 shadow-2xs text-[10px] font-bold uppercase tracking-wider"
                                title="Arraste para mover para outra fase"
                              >
                                <GripVertical className="w-3.5 h-3.5 text-slate-500" />
                                <span>Arrastar</span>
                              </span>
                            </div>
                          </div>

                          {/* Título do Negócio */}
                          <h5 className="text-sm sm:text-base font-black text-slate-900 mt-2 line-clamp-2 leading-snug group-hover:text-[#00a83e] transition-colors tracking-tight">
                            {deal.title}
                          </h5>

                          {/* Tags do Negócio */}
                          {deal.tags && deal.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {deal.tags.map((tName) => {
                                const tagDef = availableTags.find((t) => t.name === tName);
                                return (
                                  <span
                                    key={tName}
                                    className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border ${
                                      tagDef?.bgClass || "bg-emerald-50"
                                    } ${tagDef?.textClass || "text-emerald-700"} ${
                                      tagDef?.borderClass || "border-emerald-200"
                                    }`}
                                  >
                                    {tName}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* CORPO DO CARD: INFORMAÇÕES DETALHADAS & VALOR */}
                        <div
                          onClick={() => {
                            if (!dragJustEndedRef.current) {
                              onOpenDealDetail(deal);
                            }
                          }}
                          className="p-3.5 sm:p-4 bg-white hover:bg-slate-50/80 transition-colors cursor-pointer flex-1 flex flex-col justify-between"
                          title="Clique para abrir detalhes"
                        >
                          {/* Cliente & Fazenda */}
                          <div className="text-xs text-slate-600 space-y-1">
                            <div className="font-extrabold text-slate-800 text-xs sm:text-sm flex items-center space-x-1.5 truncate">
                              <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate">{deal.clientName}</span>
                            </div>
                            {deal.farmName && (
                              <div className="text-slate-500 font-medium text-xs flex items-center space-x-1.5 truncate">
                                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                                <span className="truncate">
                                  {deal.farmName} {deal.cityState ? `• ${deal.cityState}` : ""}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Valor e Consultor */}
                          <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between">
                            <div>
                              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                                Valor Estimado
                              </span>
                              <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
                                {formatBRL(deal.value)}
                              </span>
                            </div>

                            <div className="text-right">
                              <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                                Consultor
                              </span>
                              <span className="text-xs font-bold text-slate-800 bg-slate-50 border border-slate-200/70 px-2 py-0.5 rounded-lg inline-block">
                                {deal.salespersonName}
                              </span>
                            </div>
                          </div>

                          {/* Barra de Progresso & Avanço Rápido */}
                          <div className="mt-3 pt-2 flex items-center justify-between">
                            <div className="flex items-center space-x-2 flex-1 pr-3">
                              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className={`h-full bg-gradient-to-r ${column.barColor} rounded-full`}
                                  style={{ width: `${deal.probability}%` }}
                                />
                              </div>
                              <span className="text-xs font-bold text-slate-500 shrink-0">
                                {deal.probability}%
                              </span>
                            </div>

                            {colIndex < columns.length - 1 && (
                              <button
                                type="button"
                                data-no-pan="true"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onAdvanceStage(deal.id);
                                }}
                                className="p-1.5 text-slate-400 hover:text-[#00a83e] hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer shrink-0"
                                title={`Avançar para ${columns[colIndex + 1].label}`}
                              >
                                <ChevronRight className="w-4 h-4" />
                              </button>
                            )}
                          </div>

                          {/* Ações Rápidas: WhatsApp e Compartilhar */}
                          <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-1.5">
                            <div className="flex items-center space-x-1.5">
                              <button
                                type="button"
                                data-no-pan="true"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openDealInWhatsApp(deal, salespeople, onShowToast);
                                }}
                                className="py-1 px-2.5 bg-emerald-50 hover:bg-emerald-100 text-[#00a83e] font-bold text-[11px] rounded-lg transition-colors flex items-center space-x-1 cursor-pointer active:scale-95"
                                title="Abrir WhatsApp com mensagem pré-definida e link do card"
                              >
                                <Phone className="w-3 h-3" />
                                <span>WhatsApp</span>
                              </button>

                              <button
                                type="button"
                                data-no-pan="true"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (onOpenShareModal) onOpenShareModal(deal);
                                  else copyDealShareLink(deal, onShowToast);
                                }}
                                className="py-1 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-lg transition-colors flex items-center space-x-1 cursor-pointer active:scale-95"
                                title="Compartilhar link deste card"
                              >
                                <Share2 className="w-3 h-3 text-slate-500" />
                                <span>Compartilhar</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            );
          })}

          {/* Card Final: Adicionar Nova Coluna */}
          <div
            onClick={onOpenAddColumnModal}
            className="w-[280px] shrink-0 rounded-3xl border-2 border-dashed border-slate-300 hover:border-[#00a83e] bg-slate-50/50 hover:bg-emerald-50/30 transition-all p-6 flex flex-col items-center justify-center text-center cursor-pointer min-h-[400px] group"
          >
            <div className="w-12 h-12 rounded-2xl bg-white group-hover:bg-[#00a83e] text-slate-400 group-hover:text-white flex items-center justify-center transition-all shadow-xs mb-3">
              <Plus className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-black text-slate-700 group-hover:text-[#00a83e]">
              Adicionar Nova Coluna
            </h4>
            <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
              Insira uma nova fase customizada no seu pipeline
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
