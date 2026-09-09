import React from "react";
import { Phone, Pencil, User, MapPin, Share2 } from "lucide-react";
import { CRMDeal, CRMColumn, CRMTag, CRMStage, Salesperson } from "../../types";
import { formatBRL } from "../../data/crmData";
import { openDealInWhatsApp, copyDealShareLink } from "../../utils/crmShare";

interface CRMListViewProps {
  deals: CRMDeal[];
  columns: CRMColumn[];
  availableTags: CRMTag[];
  salespeople?: Salesperson[];
  onOpenDealDetail: (deal: CRMDeal) => void;
  onSetStage: (dealId: string, stage: CRMStage) => void;
  onOpenShareModal?: (deal: CRMDeal) => void;
  onShowToast: (msg: string) => void;
}

export const CRMListView: React.FC<CRMListViewProps> = ({
  deals,
  columns,
  availableTags,
  salespeople,
  onOpenDealDetail,
  onSetStage,
  onOpenShareModal,
  onShowToast,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden font-sans">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
            <tr>
              <th className="py-3.5 px-4">Oportunidade & Tags</th>
              <th className="py-3.5 px-4">Produtor / Fazenda</th>
              <th className="py-3.5 px-4">Fase do Pipeline</th>
              <th className="py-3.5 px-4">Consultor</th>
              <th className="py-3.5 px-4">Valor Estimado</th>
              <th className="py-3.5 px-4">Fechamento</th>
              <th className="py-3.5 px-4">Probabilidade</th>
              <th className="py-3.5 px-4 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {deals.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-400 font-medium">
                  Nenhuma oportunidade encontrada com os filtros atuais.
                </td>
              </tr>
            ) : (
              deals.map((deal) => {
                const currentColumn = columns.find((c) => c.key === deal.stage);
                return (
                  <tr
                    key={deal.id}
                    onClick={() => onOpenDealDetail(deal)}
                    className="hover:bg-slate-50/90 transition-colors cursor-pointer group"
                  >
                    {/* Oportunidade & Tags */}
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block group-hover:text-[#00a83e] transition-colors">
                        {deal.title}
                      </span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded-md">
                          {deal.productCategory}
                        </span>
                        {deal.tags?.map((tName) => {
                          const tagDef = availableTags.find((t) => t.name === tName);
                          return (
                            <span
                              key={tName}
                              className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md border ${
                                tagDef?.bgClass || "bg-slate-100"
                              } ${tagDef?.textClass || "text-slate-700"} ${
                                tagDef?.borderClass || "border-slate-200"
                              }`}
                            >
                              {tName}
                            </span>
                          );
                        })}
                      </div>
                    </td>

                    {/* Produtor / Fazenda */}
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-slate-800 block">{deal.clientName}</span>
                      <span className="text-[10px] text-slate-400">
                        {deal.farmName || "Fazenda não informada"} {deal.cityState ? `• ${deal.cityState}` : ""}
                      </span>
                    </td>

                    {/* Fase */}
                    <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={deal.stage}
                        onChange={(e) => onSetStage(deal.id, e.target.value as CRMStage)}
                        className="text-[11px] font-bold px-2.5 py-1 rounded-lg border border-slate-200 bg-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#00a83e]"
                      >
                        {columns.map((c) => (
                          <option key={c.key} value={c.key}>
                            {c.label}
                          </option>
                        ))}
                      </select>
                    </td>

                    {/* Vendedor */}
                    <td className="py-3.5 px-4 font-semibold text-slate-700">
                      {deal.salespersonName}
                    </td>

                    {/* Valor */}
                    <td className="py-3.5 px-4 font-black text-slate-900 font-mono">
                      {formatBRL(deal.value)}
                    </td>

                    {/* Data Fechamento */}
                    <td className="py-3.5 px-4 text-slate-600 text-[11px]">
                      {new Date(deal.expectedCloseDate + "T12:00:00").toLocaleDateString("pt-BR")}
                    </td>

                    {/* Probabilidade */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full bg-gradient-to-r ${
                              currentColumn?.barColor || "from-emerald-400 to-[#00a83e]"
                            } rounded-full`}
                            style={{ width: `${deal.probability}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-bold text-slate-600">
                          {deal.probability}%
                        </span>
                      </div>
                    </td>

                    {/* Ações */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            if (onOpenShareModal) onOpenShareModal(deal);
                            else copyDealShareLink(deal, onShowToast);
                          }}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                          title="Compartilhar card específico"
                        >
                          <Share2 className="w-3.5 h-3.5 text-slate-500" />
                        </button>
                        <button
                          type="button"
                          onClick={() => openDealInWhatsApp(deal, salespeople, onShowToast)}
                          className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#00a83e] rounded-lg transition-colors cursor-pointer"
                          title="Falar no WhatsApp com mensagem estruturada"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenDealDetail(deal)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors cursor-pointer"
                          title="Ver / Editar detalhes"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
