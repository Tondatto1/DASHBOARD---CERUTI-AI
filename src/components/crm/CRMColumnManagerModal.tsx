import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Columns3, Plus, Pencil, Trash2, X, Check, ArrowUp, ArrowDown } from "lucide-react";
import { CRMColumn, CRMDeal } from "../../types";
import { COLUMN_COLOR_OPTIONS } from "../../data/crmData";

interface CRMColumnManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  columns: CRMColumn[];
  deals: CRMDeal[];
  onAddColumn: (newCol: Omit<CRMColumn, "id">) => void;
  onEditColumn: (colId: string, updated: Partial<CRMColumn>) => void;
  onDeleteColumn: (colId: string, targetColKeyForMigration?: string) => void;
  onReorderColumns: (newColumns: CRMColumn[]) => void;
}

export const CRMColumnManagerModal: React.FC<CRMColumnManagerModalProps> = ({
  isOpen,
  onClose,
  columns,
  deals,
  onAddColumn,
  onEditColumn,
  onDeleteColumn,
  onReorderColumns,
}) => {
  const [newColLabel, setNewColLabel] = useState("");
  const [newColColor, setNewColColor] = useState("emerald");
  const [editingColId, setEditingColId] = useState<string | null>(null);
  const [editColLabel, setEditColLabel] = useState("");
  const [editColColor, setEditColColor] = useState("");

  const [deletingCol, setDeletingCol] = useState<CRMColumn | null>(null);
  const [migrationTargetKey, setMigrationTargetKey] = useState<string>("");

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColLabel.trim()) return;

    const colorConfig = COLUMN_COLOR_OPTIONS.find((c) => c.key === newColColor) || COLUMN_COLOR_OPTIONS[0];

    onAddColumn({
      key: newColLabel.trim(),
      label: newColLabel.trim(),
      dotColor: colorConfig.dotColor,
      barColor: colorConfig.barColor,
      badgeBg: colorConfig.badgeBg,
      badgeText: colorConfig.badgeText,
    });

    setNewColLabel("");
    setNewColColor("emerald");
  };

  const handleStartEdit = (col: CRMColumn) => {
    setEditingColId(col.id);
    setEditColLabel(col.label);
    const foundColor = COLUMN_COLOR_OPTIONS.find((c) => c.dotColor === col.dotColor);
    setEditColColor(foundColor ? foundColor.key : "emerald");
  };

  const handleSaveEdit = (colId: string) => {
    if (!editColLabel.trim()) return;
    const colorConfig = COLUMN_COLOR_OPTIONS.find((c) => c.key === editColColor) || COLUMN_COLOR_OPTIONS[0];

    onEditColumn(colId, {
      key: editColLabel.trim(),
      label: editColLabel.trim(),
      dotColor: colorConfig.dotColor,
      barColor: colorConfig.barColor,
      badgeBg: colorConfig.badgeBg,
      badgeText: colorConfig.badgeText,
    });

    setEditingColId(null);
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const newCols = [...columns];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newCols.length) return;

    const temp = newCols[index];
    newCols[index] = newCols[targetIndex];
    newCols[targetIndex] = temp;

    onReorderColumns(newCols);
  };

  const handlePromptDelete = (col: CRMColumn) => {
    const dealsInCol = deals.filter((d) => d.stage === col.key);
    if (dealsInCol.length > 0) {
      setDeletingCol(col);
      const otherCol = columns.find((c) => c.id !== col.id);
      setMigrationTargetKey(otherCol ? otherCol.key : "");
    } else {
      onDeleteColumn(col.id);
    }
  };

  const handleConfirmDeleteWithMigration = () => {
    if (!deletingCol) return;
    onDeleteColumn(deletingCol.id, migrationTargetKey);
    setDeletingCol(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-xl relative z-10 border border-slate-100 overflow-hidden flex flex-col max-h-[88vh]"
      >
        {/* Topo do Modal */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-sky-100/80 text-sky-700 flex items-center justify-center font-bold">
              <Columns3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Gerenciar Colunas do Funil</h3>
              <p className="text-xs text-slate-500 font-medium">
                Adicione novas fases, altere cores, renomeie ou reordene seu pipeline
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-200/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs">
          {/* Confirmação de Exclusão com Migração de Cards */}
          {deletingCol && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-3">
              <h4 className="font-bold text-rose-900 text-xs">
                A coluna &quot;{deletingCol.label}&quot; possui oportunidades vinculadas!
              </h4>
              <p className="text-[11px] text-rose-700">
                Selecione para qual coluna deseja mover os negócios antes de excluir:
              </p>
              <select
                value={migrationTargetKey}
                onChange={(e) => setMigrationTargetKey(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-rose-300 rounded-xl font-bold text-slate-800"
              >
                {columns
                  .filter((c) => c.id !== deletingCol.id)
                  .map((c) => (
                    <option key={c.id} value={c.key}>
                      Mover para: {c.label}
                    </option>
                  ))}
              </select>
              <div className="flex justify-end space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => setDeletingCol(null)}
                  className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDeleteWithMigration}
                  className="px-3.5 py-1.5 bg-rose-600 text-white font-bold rounded-xl shadow-xs hover:bg-rose-700"
                >
                  Mover e Excluir Coluna
                </button>
              </div>
            </div>
          )}

          {/* Criar Nova Coluna */}
          <form onSubmit={handleCreate} className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200/80 space-y-3">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
              + Adicionar Nova Coluna / Fase
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <input
                type="text"
                required
                placeholder="Ex: Proposta Enviada, Visita Técnica..."
                value={newColLabel}
                onChange={(e) => setNewColLabel(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00a83e]/20"
              />

              <select
                value={newColColor}
                onChange={(e) => setNewColColor(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#00a83e]/20 cursor-pointer"
              >
                {COLUMN_COLOR_OPTIONS.map((c) => (
                  <option key={c.key} value={c.key}>
                    Tema: {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="px-4 py-2 bg-[#00a83e] hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-2xs transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Coluna</span>
              </button>
            </div>
          </form>

          {/* Lista de Colunas */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Fases Atuais do Pipeline ({columns.length})
            </span>

            <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-2xl overflow-hidden bg-white">
              {columns.map((col, index) => {
                const dealsCount = deals.filter((d) => d.stage === col.key).length;
                const isEditing = editingColId === col.id;

                return (
                  <div
                    key={col.id}
                    className="p-3 sm:p-3.5 flex items-center justify-between hover:bg-slate-50/80 transition-colors"
                  >
                    {isEditing ? (
                      <div className="flex-1 flex items-center space-x-2 mr-2">
                        <input
                          type="text"
                          value={editColLabel}
                          onChange={(e) => setEditColLabel(e.target.value)}
                          className="flex-1 px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold focus:outline-none focus:ring-1 focus:ring-[#00a83e]"
                        />
                        <select
                          value={editColColor}
                          onChange={(e) => setEditColColor(e.target.value)}
                          className="px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                        >
                          {COLUMN_COLOR_OPTIONS.map((c) => (
                            <option key={c.key} value={c.key}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(col.id)}
                          className="p-1.5 bg-[#00a83e] text-white rounded-lg hover:bg-emerald-700 cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingColId(null)}
                          className="p-1.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-3">
                        <span className={`w-3 h-3 rounded-full ${col.dotColor} shrink-0 ring-2 ring-slate-100`} />
                        <span className="text-xs font-bold text-slate-900">{col.label}</span>
                        <span className="text-[11px] text-slate-400 font-medium">
                          ({dealsCount} {dealsCount === 1 ? "negócio" : "negócios"})
                        </span>
                      </div>
                    )}

                    {!isEditing && (
                      <div className="flex items-center space-x-1">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => handleMove(index, "up")}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded cursor-pointer"
                          title="Mover para esquerda/cima"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={index === columns.length - 1}
                          onClick={() => handleMove(index, "down")}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded cursor-pointer"
                          title="Mover para direita/baixo"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleStartEdit(col)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Renomear coluna ou mudar cor"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={columns.length <= 1}
                          onClick={() => handlePromptDelete(col)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer disabled:opacity-30"
                          title="Excluir coluna"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="p-4 border-t border-slate-100 flex justify-end bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs cursor-pointer shadow-xs"
          >
            Concluir
          </button>
        </div>
      </motion.div>
    </div>
  );
};
