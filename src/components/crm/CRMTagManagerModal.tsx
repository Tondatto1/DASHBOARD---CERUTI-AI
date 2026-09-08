import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Tag as TagIcon, Plus, Pencil, Trash2, X, Check, Sparkles } from "lucide-react";
import { CRMTag, CRMDeal } from "../../types";
import { TAG_COLOR_OPTIONS } from "../../data/crmData";

interface CRMTagManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  tags: CRMTag[];
  deals: CRMDeal[];
  onAddTag: (newTag: Omit<CRMTag, "id">) => void;
  onEditTag: (tagId: string, updated: Partial<CRMTag>) => void;
  onDeleteTag: (tagId: string) => void;
}

export const CRMTagManagerModal: React.FC<CRMTagManagerModalProps> = ({
  isOpen,
  onClose,
  tags,
  deals,
  onAddTag,
  onEditTag,
  onDeleteTag,
}) => {
  const [newTagName, setNewTagName] = useState("");
  const [newTagColor, setNewTagColor] = useState("emerald");
  const [editingTagId, setEditingTagId] = useState<string | null>(null);
  const [editTagName, setEditTagName] = useState("");
  const [editTagColor, setEditTagColor] = useState("");

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;

    const colorConfig = TAG_COLOR_OPTIONS.find((c) => c.key === newTagColor) || TAG_COLOR_OPTIONS[0];

    onAddTag({
      name: newTagName.trim(),
      color: colorConfig.key,
      bgClass: colorConfig.bgClass,
      textClass: colorConfig.textClass,
      borderClass: colorConfig.borderClass,
    });

    setNewTagName("");
    setNewTagColor("emerald");
  };

  const handleStartEdit = (tag: CRMTag) => {
    setEditingTagId(tag.id);
    setEditTagName(tag.name);
    setEditTagColor(tag.color);
  };

  const handleSaveEdit = (tagId: string) => {
    if (!editTagName.trim()) return;
    const colorConfig = TAG_COLOR_OPTIONS.find((c) => c.key === editTagColor) || TAG_COLOR_OPTIONS[0];

    onEditTag(tagId, {
      name: editTagName.trim(),
      color: colorConfig.key,
      bgClass: colorConfig.bgClass,
      textClass: colorConfig.textClass,
      borderClass: colorConfig.borderClass,
    });

    setEditingTagId(null);
  };

  // Usage count calculator
  const getTagUsageCount = (tagName: string) => {
    return deals.filter((d) => d.tags && d.tags.includes(tagName)).length;
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
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-10 border border-slate-100 overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Topo do Modal */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100/80 text-[#00a83e] flex items-center justify-center font-bold">
              <TagIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">Gerenciar Tags do CRM</h3>
              <p className="text-xs text-slate-500 font-medium">
                Crie, edite ou remova marcadores para classificar os negócios
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

        {/* Conteúdo: Criar Tag + Lista de Tags */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs">
          {/* Formulário de Criação Rápida */}
          <form onSubmit={handleCreate} className="p-4 bg-slate-50/90 rounded-2xl border border-slate-200/80 space-y-3">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
              + Criar Nova Tag
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <input
                type="text"
                required
                placeholder="Ex: Barter Soja, Urgente, Biológicos..."
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00a83e]/20"
              />

              <select
                value={newTagColor}
                onChange={(e) => setNewTagColor(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#00a83e]/20 cursor-pointer"
              >
                {TAG_COLOR_OPTIONS.map((c) => (
                  <option key={c.key} value={c.key}>
                    Cor: {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Preview da Nova Tag */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase">Prévia:</span>
                {newTagName ? (
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-lg border ${
                      TAG_COLOR_OPTIONS.find((c) => c.key === newTagColor)?.bgClass
                    } ${TAG_COLOR_OPTIONS.find((c) => c.key === newTagColor)?.textClass} ${
                      TAG_COLOR_OPTIONS.find((c) => c.key === newTagColor)?.borderClass
                    }`}
                  >
                    {newTagName}
                  </span>
                ) : (
                  <span className="text-xs text-slate-400 italic">Digite um nome para visualizar</span>
                )}
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-[#00a83e] hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-2xs transition-all flex items-center space-x-1.5 cursor-pointer active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Criar Tag</span>
              </button>
            </div>
          </form>

          {/* Lista de Tags Cadastradas */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Tags Existentes ({tags.length})
            </span>

            <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-2xl overflow-hidden bg-white">
              {tags.length === 0 ? (
                <div className="p-6 text-center text-slate-400 font-medium">
                  Nenhuma tag cadastrada ainda.
                </div>
              ) : (
                tags.map((tag) => {
                  const usage = getTagUsageCount(tag.name);
                  const isEditing = editingTagId === tag.id;

                  return (
                    <div
                      key={tag.id}
                      className="p-3 sm:p-3.5 flex items-center justify-between hover:bg-slate-50/80 transition-colors"
                    >
                      {isEditing ? (
                        <div className="flex-1 flex items-center space-x-2 mr-2">
                          <input
                            type="text"
                            value={editTagName}
                            onChange={(e) => setEditTagName(e.target.value)}
                            className="flex-1 px-2.5 py-1 bg-white border border-slate-300 rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#00a83e]"
                          />
                          <select
                            value={editTagColor}
                            onChange={(e) => setEditTagColor(e.target.value)}
                            className="px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                          >
                            {TAG_COLOR_OPTIONS.map((c) => (
                              <option key={c.key} value={c.key}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(tag.id)}
                            className="p-1.5 bg-[#00a83e] text-white rounded-lg hover:bg-emerald-700 cursor-pointer"
                            title="Salvar"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingTagId(null)}
                            className="p-1.5 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 cursor-pointer"
                            title="Cancelar"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-3">
                          <span
                            className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${tag.bgClass} ${tag.textClass} ${tag.borderClass} shadow-2xs`}
                          >
                            {tag.name}
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium">
                            {usage} {usage === 1 ? "oportunidade" : "oportunidades"}
                          </span>
                        </div>
                      )}

                      {!isEditing && (
                        <div className="flex items-center space-x-1">
                          <button
                            type="button"
                            onClick={() => handleStartEdit(tag)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                            title="Editar nome ou cor"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteTag(tag.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Excluir tag"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
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
