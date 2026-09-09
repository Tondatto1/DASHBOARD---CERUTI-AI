import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, X, Tag as TagIcon, Check } from "lucide-react";
import { CRMDeal, CRMColumn, CRMTag, CRMStage } from "../../types";

interface CRMNewDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  columns: CRMColumn[];
  availableTags: CRMTag[];
  onCreateDeal: (deal: Omit<CRMDeal, "id">) => void;
  salespeopleList: string[];
}

export const CRMNewDealModal: React.FC<CRMNewDealModalProps> = ({
  isOpen,
  onClose,
  columns,
  availableTags,
  onCreateDeal,
  salespeopleList,
}) => {
  const [title, setTitle] = useState("");
  const [clientName, setClientName] = useState("");
  const [farmName, setFarmName] = useState("");
  const [cityState, setCityState] = useState("");
  const [value, setValue] = useState("");
  const [stage, setStage] = useState<CRMStage>(columns[0]?.key || "Clientes");
  const [salespersonName, setSalespersonName] = useState(salespeopleList[0] || "João Silva");
  const [productCategory, setProductCategory] = useState("Insumos Soja & Milho");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [priority, setPriority] = useState<"baixa" | "média" | "alta">("alta");
  const [phone, setPhone] = useState("");
  const [expectedCloseDate, setExpectedCloseDate] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );

  if (!isOpen) return null;

  const handleToggleTag = (tagName: string) => {
    if (selectedTags.includes(tagName)) {
      setSelectedTags(selectedTags.filter((t) => t !== tagName));
    } else {
      setSelectedTags([...selectedTags, tagName]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !clientName.trim()) return;

    const numericValue = parseFloat(value.replace(/\D/g, "")) || 0;

    onCreateDeal({
      title: title.trim(),
      clientName: clientName.trim(),
      farmName: farmName.trim() || undefined,
      cityState: cityState.trim() || "Rio Verde - GO",
      stage,
      value: numericValue,
      salespersonName,
      productCategory: productCategory.trim() || "Insumos Gerais",
      tags: selectedTags,
      startDate: new Date().toISOString().split("T")[0],
      expectedCloseDate,
      priority,
      lastContact: "Hoje, agora",
      probability: stage === "Vendas" || stage === "Finalizados" ? 100 : 60,
      phone: phone.trim() || "+55 (64) 99999-0000",
    });

    onClose();
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
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-10 border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h3 className="text-base font-black text-slate-900 flex items-center space-x-1.5">
              <Plus className="w-4 h-4 text-[#00a83e]" />
              <span>Registrar Nova Oportunidade</span>
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Adicione um negócio comercial no pipeline com tags e estimativa de valor
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-3.5 text-xs">
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1 text-[10px]">
              Título da Oportunidade *
            </label>
            <input
              type="text"
              required
              placeholder="ex: Insumos Soja Safra 2025/26"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#00a83e]/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1 text-[10px]">
                Nome do Produtor / Cliente *
              </label>
              <input
                type="text"
                required
                placeholder="ex: Marcos Fagundes"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#00a83e]/20"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1 text-[10px]">
                Fazenda / Cidade
              </label>
              <input
                type="text"
                placeholder="ex: Fazenda Santa Fé"
                value={farmName}
                onChange={(e) => setFarmName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#00a83e]/20"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block font-bold text-slate-700 uppercase mb-1 text-[10px] flex items-center space-x-1">
              <TagIcon className="w-3 h-3 text-emerald-600" />
              <span>Tags / Marcadores do Negócio</span>
            </label>
            <div className="flex flex-wrap gap-1.5 p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
              {availableTags.map((tag) => {
                const isSelected = selectedTags.includes(tag.name);
                return (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleToggleTag(tag.name)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer border ${
                      isSelected
                        ? `${tag.bgClass} ${tag.textClass} ${tag.borderClass} shadow-2xs`
                        : "bg-white text-slate-500 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    <span>{tag.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1 text-[10px]">
                Valor Previsto (R$) *
              </label>
              <input
                type="text"
                required
                placeholder="ex: 285000"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-[#00a83e]/20"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1 text-[10px]">
                Fase Inicial no Pipeline
              </label>
              <select
                value={stage}
                onChange={(e) => setStage(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-[#00a83e]/20 cursor-pointer"
              >
                {columns.map((col) => (
                  <option key={col.key} value={col.key}>
                    {col.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1 text-[10px]">
                Colaborador Responsável
              </label>
              <select
                value={salespersonName}
                onChange={(e) => setSalespersonName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold cursor-pointer"
              >
                {salespeopleList.map((sp) => (
                  <option key={sp} value={sp}>
                    {sp}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1 text-[10px]">
                Prioridade
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as "baixa" | "média" | "alta")}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-semibold cursor-pointer"
              >
                <option value="alta">Alta (Quente 🔥)</option>
                <option value="média">Média ⚡</option>
                <option value="baixa">Baixa 🌱</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1 text-[10px]">
                Telefone / WhatsApp
              </label>
              <input
                type="text"
                placeholder="+55 (64) 99999-1122"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 uppercase mb-1 text-[10px]">
                Previsão de Fechamento
              </label>
              <input
                type="date"
                value={expectedCloseDate}
                onChange={(e) => setExpectedCloseDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium cursor-pointer"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end space-x-2.5 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#00a83e] hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs cursor-pointer active:scale-95"
            >
              Salvar Oportunidade
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
