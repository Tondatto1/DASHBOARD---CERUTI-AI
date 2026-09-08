import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { CRMDeal, CRMColumn, CRMTag } from "../../types";
import { formatBRL } from "../../data/crmData";

interface CRMGanttViewProps {
  deals: CRMDeal[];
  columns: CRMColumn[];
  availableTags: CRMTag[];
  onOpenDealDetail: (deal: CRMDeal) => void;
}

export const CRMGanttView: React.FC<CRMGanttViewProps> = ({
  deals,
  columns,
  availableTags,
  onOpenDealDetail,
}) => {
  const [ganttOffset, setGanttOffset] = useState(0);

  const months = [
    { name: "Janeiro 2025", days: 31 },
    { name: "Fevereiro 2025", days: 28 },
    { name: "Março 2025", days: 31 },
    { name: "Abril 2025", days: 30 },
    { name: "Maio 2025", days: 31 },
    { name: "Junho 2025", days: 30 },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden font-sans space-y-4 p-4">
      {/* Topo do Gantt */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-black text-slate-900 text-sm">Cronograma e Janela de Fechamento</h4>
          <p className="text-xs text-slate-500">
            Acompanhamento temporal dos negócios e previsão de encerramento por safra
          </p>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            type="button"
            onClick={() => setGanttOffset((prev) => Math.max(prev - 1, 0))}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-slate-700 px-2">Safra 2024/25</span>
          <button
            type="button"
            onClick={() => setGanttOffset((prev) => prev + 1)}
            className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabela Gantt */}
      <div className="border border-slate-200 rounded-xl overflow-x-auto">
        <div className="min-w-[900px]">
          {/* Header Meses */}
          <div className="grid grid-cols-12 bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-600 text-center py-2.5">
            <div className="col-span-4 text-left px-4">Oportunidade & Cliente</div>
            <div className="col-span-8 grid grid-cols-4 divide-x divide-slate-200 text-center">
              <div>Jan/25</div>
              <div>Fev/25</div>
              <div>Mar/25</div>
              <div>Abr/25</div>
            </div>
          </div>

          {/* Linhas */}
          <div className="divide-y divide-slate-100">
            {deals.map((deal, idx) => {
              const currentColumn = columns.find((c) => c.key === deal.stage);
              // Calculate rough bar position
              const leftPercent = Math.min(Math.max((idx * 14) % 65, 5), 60);
              const widthPercent = Math.min(Math.max(25 + ((deal.value % 30) || 10), 20), 45);

              return (
                <div
                  key={deal.id}
                  onClick={() => onOpenDealDetail(deal)}
                  className="grid grid-cols-12 items-center hover:bg-slate-50/80 transition-colors py-3 cursor-pointer"
                >
                  <div className="col-span-4 px-4 pr-2">
                    <span className="font-bold text-slate-900 text-xs truncate block">
                      {deal.title}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {deal.clientName} • {formatBRL(deal.value)}
                    </span>
                  </div>

                  <div className="col-span-8 px-4 relative h-7 flex items-center">
                    <div className="absolute inset-0 grid grid-cols-4 divide-x divide-slate-100/60 pointer-events-none" />
                    <div
                      className={`h-5 rounded-lg bg-gradient-to-r ${
                        currentColumn?.barColor || "from-emerald-400 to-[#00a83e]"
                      } shadow-2xs flex items-center justify-between px-2 text-[10px] font-bold text-white relative z-10 transition-all hover:scale-y-110`}
                      style={{
                        marginLeft: `${leftPercent}%`,
                        width: `${widthPercent}%`,
                      }}
                    >
                      <span className="truncate">{deal.stage}</span>
                      <span>{deal.probability}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
