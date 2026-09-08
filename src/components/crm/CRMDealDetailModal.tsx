import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Pencil,
  Trash2,
  Save,
  Phone,
  User,
  MapPin,
  DollarSign,
  UserCheck,
  Calendar,
  Flame,
  Tag as TagIcon,
  Plus,
  Check,
} from "lucide-react";
import { CRMDeal, CRMColumn, CRMTag, CRMStage } from "../../types";
import { formatBRL } from "../../data/crmData";

interface CRMDealDetailModalProps {
  deal: CRMDeal | null;
  isOpen: boolean;
  onClose: () => void;
  columns: CRMColumn[];
  availableTags: CRMTag[];
  onSaveDeal: (updatedDeal: CRMDeal) => void;
  onDeleteDeal: (dealId: string) => void;
  onAdvanceStage: (dealId: string) => void;
  onSetStage: (dealId: string, stage: CRMStage) => void;
  onShowToast: (msg: string) => void;
  salespeopleList: string[];
}

export const CRMDealDetailModal: React.FC<CRMDealDetailModalProps> = ({
  deal,
  isOpen,
  onClose,
  columns,
  availableTags,
  onSaveDeal,
  onDeleteDeal,
  onAdvanceStage,
  onSetStage,
  onShowToast,
  salespeopleList,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  // Edit form state
  const [editTitle, setEditTitle] = useState("");
  const [editClientName, setEditClientName] = useState("");
  const [editFarmName, setEditFarmName] = useState("");
  const [editCityState, setEditCityState] = useState("");
  const [editAreaHectares, setEditAreaHectares] = useState<string | number>("");
  const [editValue, setEditValue] = useState<string | number>("");
  const [editSalespersonName, setEditSalespersonName] = useState("");
  const [editProductCategory, setEditProductCategory] = useState("");
  const [editTags, setEditTags] = useState<string[]>([]);
  const [editExpectedCloseDate, setEditExpectedCloseDate] = useState("");
  const [editPriority, setEditPriority] = useState<"baixa" | "média" | "alta">("média");
  const [editProbability, setEditProbability] = useState<number>(50);
  const [editPhone, setEditPhone] = useState("");
  const [editStage, setEditStage] = useState<CRMStage>("");

  useEffect(() => {
    if (deal) {
      setEditTitle(deal.title || "");
      setEditClientName(deal.clientName || "");
      setEditFarmName(deal.farmName || "");
      setEditCityState(deal.cityState || "");
      setEditAreaHectares(deal.areaHectares || "");
      setEditValue(deal.value || 0);
      setEditSalespersonName(deal.salespersonName || salespeopleList[0] || "João Silva");
      setEditProductCategory(deal.productCategory || "");
      setEditTags(deal.tags || []);
      setEditExpectedCloseDate(deal.expectedCloseDate || "");
      setEditPriority(deal.priority || "média");
      setEditProbability(deal.probability || 50);
      setEditPhone(deal.phone || "");
      setEditStage(deal.stage);
      setIsEditing(false);
    }
  }, [deal, salespeopleList]);

  if (!isOpen || !deal) return null;

  const currentColumn = columns.find((c) => c.key === deal.stage);

  const handleToggleTag = (tagName: string) => {
    if (editTags.includes(tagName)) {
      setEditTags(editTags.filter((t) => t !== tagName));
    } else {
      setEditTags([...editTags, tagName]);
    }
  };

  const handleQuickAddTagInViewMode = (tagName: string) => {
    const updatedTags = deal.tags ? [...deal.tags] : [];
    if (!updatedTags.includes(tagName)) {
      updatedTags.push(tagName);
      onSaveDeal({ ...deal, tags: updatedTags });
      onShowToast(`Tag "${tagName}" adicionada!`);
    }
  };

  const handleQuickRemoveTagInViewMode = (tagName: string) => {
    const updatedTags = (deal.tags || []).filter((t) => t !== tagName);
    onSaveDeal({ ...deal, tags: updatedTags });
    onShowToast(`Tag "${tagName}" removida!`);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deal) return;

    const numericValue = typeof editValue === "number" ? editValue : parseFloat(String(editValue).replace(/\D/g, "")) || 0;
    const numericArea = editAreaHectares ? Number(editAreaHectares) : undefined;

    const updated: CRMDeal = {
      ...deal,
      title: editTitle.trim(),
      clientName: editClientName.trim(),
      farmName: editFarmName.trim() || undefined,
      cityState: editCityState.trim() || undefined,
      areaHectares: numericArea,
      value: numericValue,
      salespersonName: editSalespersonName,
      productCategory: editProductCategory.trim() || "Insumos Gerais",
      tags: editTags,
      expectedCloseDate: editExpectedCloseDate || deal.expectedCloseDate,
      priority: editPriority,
      probability: editProbability,
      phone: editPhone.trim(),
      stage: editStage,
    };

    onSaveDeal(updated);
    setIsEditing(false);
    onShowToast("Alterações salvas com sucesso!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
        onClick={() => {
          onClose();
          setIsEditing(false);
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 16 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col relative z-10 border border-slate-100 overflow-hidden"
      >
        {/* Header do Modal */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="pr-2">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                {isEditing ? "Modo de Edição" : deal.productCategory}
              </span>
              {!isEditing && (
                <span className="text-[10px] font-bold text-slate-600 bg-slate-200/60 px-2 py-0.5 rounded-md">
                  {deal.stage}
                </span>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1 truncate max-w-md">
              {isEditing ? "Editar Informações da Oportunidade" : deal.title}
            </h3>
          </div>

          <div className="flex items-center space-x-1.5 shrink-0">
            {!isEditing ? (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#00a83e] rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer"
                  title="Editar dados"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  <span>Editar</span>
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteDeal(deal.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                  title="Excluir Oportunidade"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Cancelar Edição
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                onClose();
                setIsEditing(false);
              }}
              className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4 text-xs">
          {!isEditing ? (
            /* ================= MODO VISUALIZAÇÃO ================= */
            <>
              {/* Seção de Tags do Negócio */}
              <div className="p-3 bg-slate-50/90 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center space-x-1">
                    <TagIcon className="w-3 h-3 text-emerald-600" />
                    <span>Tags Associadas</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Clique no &quot;x&quot; para remover ou adicione abaixo</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {deal.tags && deal.tags.length > 0 ? (
                    deal.tags.map((tName) => {
                      const tagDef = availableTags.find((t) => t.name === tName);
                      return (
                        <span
                          key={tName}
                          className={`inline-flex items-center space-x-1 text-xs font-bold px-2.5 py-1 rounded-lg border ${
                            tagDef?.bgClass || "bg-emerald-50"
                          } ${tagDef?.textClass || "text-emerald-700"} ${
                            tagDef?.borderClass || "border-emerald-200"
                          } shadow-2xs`}
                        >
                          <span>{tName}</span>
                          <button
                            type="button"
                            onClick={() => handleQuickRemoveTagInViewMode(tName)}
                            className="hover:opacity-75 p-0.5 rounded cursor-pointer"
                            title="Remover tag deste card"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-xs text-slate-400 italic">Nenhuma tag vinculada a este negócio.</span>
                  )}
                </div>

                {/* Adicionar Tags Rápidas */}
                <div className="pt-2 border-t border-slate-200/60 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">+ Adicionar tag:</span>
                  {availableTags
                    .filter((t) => !(deal.tags || []).includes(t.name))
                    .map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => handleQuickAddTagInViewMode(t.name)}
                        className="px-2 py-0.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-md text-[11px] font-semibold text-slate-600 transition-colors cursor-pointer"
                      >
                        + {t.name}
                      </button>
                    ))}
                </div>
              </div>

              {/* Informações do Produtor e Fazenda */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block flex items-center space-x-1">
                    <User className="w-3 h-3 text-slate-400" />
                    <span>Produtor / Cliente</span>
                  </span>
                  <span className="font-extrabold text-slate-900 text-sm mt-1 block">
                    {deal.clientName}
                  </span>
                  <span className="text-slate-500 text-xs block mt-0.5 flex items-center space-x-1">
                    <Phone className="w-3 h-3 text-emerald-600" />
                    <span>{deal.phone || "Não informado"}</span>
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block flex items-center space-x-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>Propriedade Rural</span>
                  </span>
                  <span className="font-extrabold text-slate-900 text-sm mt-1 block">
                    {deal.farmName || "Fazenda não informada"}
                  </span>
                  <span className="text-slate-500 text-xs block mt-0.5">
                    {deal.cityState || "Região não informada"}
                    {deal.areaHectares ? ` • ${deal.areaHectares} ha` : ""}
                  </span>
                </div>
              </div>

              {/* Valores e Responsável */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block flex items-center space-x-1">
                    <DollarSign className="w-3 h-3 text-[#00a83e]" />
                    <span>Valor Previsto</span>
                  </span>
                  <span className="font-black text-slate-900 text-base mt-1 block">
                    {formatBRL(deal.value)}
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block flex items-center space-x-1">
                    <UserCheck className="w-3 h-3 text-slate-400" />
                    <span>Consultor / Vendedor</span>
                  </span>
                  <span className="font-bold text-slate-800 text-xs mt-1 block">
                    {deal.salespersonName}
                  </span>
                </div>

                <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block flex items-center space-x-1">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    <span>Previsão de Fechamento</span>
                  </span>
                  <span className="font-semibold text-slate-800 text-xs mt-1 block">
                    {new Date(deal.expectedCloseDate + "T12:00:00").toLocaleDateString("pt-BR")}
                  </span>
                </div>
              </div>

              {/* Probabilidade e Prioridade */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Probabilidade
                    </span>
                    <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                      {deal.probability || 50}%
                    </span>
                  </div>
                  <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#00a83e] rounded-full"
                      style={{ width: `${deal.probability || 50}%` }}
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">
                      Prioridade
                    </span>
                    <span className="font-bold text-slate-800 text-sm mt-0.5 capitalize block">
                      {deal.priority || "Média"}
                    </span>
                  </div>
                  {deal.priority === "alta" && (
                    <span className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
                      <Flame className="w-4 h-4" />
                    </span>
                  )}
                </div>
              </div>

              {/* Mudar Estágio do Funil */}
              <div className="pt-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                  Mudar Estágio do Funil (Pipeline)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {columns.map((col) => (
                    <button
                      key={col.key}
                      type="button"
                      onClick={() => onSetStage(deal.id, col.key)}
                      className={`py-2 px-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer truncate ${
                        deal.stage === col.key
                          ? "bg-[#00a83e] text-white shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {col.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rodapé Visualização */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    onShowToast(`Iniciando contato via WhatsApp com ${deal.clientName}`);
                  }}
                  className="py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-[#00a83e] font-bold rounded-xl transition-colors flex items-center space-x-2 cursor-pointer active:scale-95"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Falar no WhatsApp</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="py-2.5 px-4 bg-[#00a83e] hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors flex items-center space-x-1.5 cursor-pointer active:scale-95 shadow-xs"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Editar Oportunidade</span>
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* ================= MODO DE EDIÇÃO ================= */
            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Linha 1: Título e Categoria */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Título da Oportunidade *
                  </label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#00a83e] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Categoria do Produto
                  </label>
                  <input
                    type="text"
                    value={editProductCategory}
                    onChange={(e) => setEditProductCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#00a83e] focus:bg-white"
                  />
                </div>
              </div>

              {/* Tags Selector */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                  Tags / Marcadores (Selecione as que se aplicam)
                </label>
                <div className="flex flex-wrap gap-1.5 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                  {availableTags.map((tag) => {
                    const isSelected = editTags.includes(tag.name);
                    return (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() => handleToggleTag(tag.name)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer border ${
                          isSelected
                            ? `${tag.bgClass} ${tag.textClass} ${tag.borderClass} shadow-xs`
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

              {/* Linha 2: Produtor e Telefone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Nome do Produtor / Cliente *
                  </label>
                  <input
                    type="text"
                    required
                    value={editClientName}
                    onChange={(e) => setEditClientName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#00a83e] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Telefone / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#00a83e] focus:bg-white"
                  />
                </div>
              </div>

              {/* Linha 3: Fazenda, Localização e Área */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Nome da Fazenda
                  </label>
                  <input
                    type="text"
                    value={editFarmName}
                    onChange={(e) => setEditFarmName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#00a83e] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Cidade - UF
                  </label>
                  <input
                    type="text"
                    value={editCityState}
                    onChange={(e) => setEditCityState(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#00a83e] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Área (ha)
                  </label>
                  <input
                    type="number"
                    value={editAreaHectares}
                    onChange={(e) => setEditAreaHectares(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#00a83e] focus:bg-white"
                  />
                </div>
              </div>

              {/* Linha 4: Valor, Vendedor e Data */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Valor Estimado (R$)
                  </label>
                  <input
                    type="number"
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#00a83e] focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Consultor / RTV
                  </label>
                  <select
                    value={editSalespersonName}
                    onChange={(e) => setEditSalespersonName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#00a83e] focus:bg-white cursor-pointer"
                  >
                    {salespeopleList.map((sp) => (
                      <option key={sp} value={sp}>
                        {sp}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Previsão Fechamento
                  </label>
                  <input
                    type="date"
                    value={editExpectedCloseDate}
                    onChange={(e) => setEditExpectedCloseDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#00a83e] focus:bg-white cursor-pointer"
                  />
                </div>
              </div>

              {/* Linha 5: Estágio, Probabilidade e Prioridade */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Fase do Pipeline
                  </label>
                  <select
                    value={editStage}
                    onChange={(e) => setEditStage(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#00a83e] focus:bg-white cursor-pointer"
                  >
                    {columns.map((col) => (
                      <option key={col.key} value={col.key}>
                        {col.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Probabilidade ({editProbability}%)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={editProbability}
                    onChange={(e) => setEditProbability(Number(e.target.value))}
                    className="w-full accent-[#00a83e] cursor-pointer mt-2"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Prioridade
                  </label>
                  <select
                    value={editPriority}
                    onChange={(e) => setEditPriority(e.target.value as "baixa" | "média" | "alta")}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-[#00a83e] focus:bg-white cursor-pointer"
                  >
                    <option value="baixa">Baixa 🌱</option>
                    <option value="média">Média ⚡</option>
                    <option value="alta">Alta (Quente 🔥)</option>
                  </select>
                </div>
              </div>

              {/* Ações */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onDeleteDeal(deal.id)}
                  className="py-2.5 px-3.5 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Excluir Card</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="py-2.5 px-5 bg-[#00a83e] hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-sm shadow-emerald-600/30 flex items-center space-x-2 cursor-pointer active:scale-95"
                  >
                    <Save className="w-4 h-4" />
                    <span>Salvar Alterações</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
};
