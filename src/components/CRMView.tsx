import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  TrendingUp,
  DollarSign,
  Briefcase,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Share2,
  BarChart3,
} from "lucide-react";
import { CRMDeal, CRMStage, CRMIntegrationConfig, CRMColumn, CRMTag, Salesperson } from "../types";
import {
  DEFAULT_COLUMNS,
  DEFAULT_TAGS,
  INITIAL_DEALS,
  INITIAL_INTEGRATIONS,
  formatBRL,
} from "../data/crmData";
import { CRMFilterBar, DateFilterPreset } from "./crm/CRMFilterBar";
import { CRMKanbanView } from "./crm/CRMKanbanView";
import { CRMListView } from "./crm/CRMListView";
import { CRMGanttView } from "./crm/CRMGanttView";
import { CRMTagManagerModal } from "./crm/CRMTagManagerModal";
import { CRMColumnManagerModal } from "./crm/CRMColumnManagerModal";
import { CRMDealDetailModal } from "./crm/CRMDealDetailModal";
import { CRMNewDealModal } from "./crm/CRMNewDealModal";
import { CRMIntegrationsTab } from "./crm/CRMIntegrationsTab";
import { CRMMetricsTab } from "./crm/CRMMetricsTab";
import { CRMShareModal } from "./crm/CRMShareModal";
import { CRMImportExportModal } from "./crm/CRMImportExportModal";

interface CRMViewProps {
  salespeople?: Salesperson[];
}

export function CRMView({ salespeople }: CRMViewProps) {
  // Main Tab: Pipeline vs Integrations vs Metrics
  const [activeTab, setActiveTab] = useState<"pipeline" | "integrations" | "metrics">("pipeline");

  // View Mode: Kanban, List, Gantt
  const [viewMode, setViewMode] = useState<"kanban" | "lista" | "gantt">("kanban");

  // CRM Data State
  const [deals, setDeals] = useState<CRMDeal[]>(INITIAL_DEALS);
  const [columns, setColumns] = useState<CRMColumn[]>(DEFAULT_COLUMNS);
  const [tags, setTags] = useState<CRMTag[]>(DEFAULT_TAGS);
  const [integrations, setIntegrations] = useState<CRMIntegrationConfig[]>(INITIAL_INTEGRATIONS);

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSalesperson, setSelectedSalesperson] = useState("todos");
  const [datePreset, setDatePreset] = useState<DateFilterPreset>("todas");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("todas");
  const [selectedTag, setSelectedTag] = useState("todas");

  // Modals State
  const [selectedDealForDetail, setSelectedDealForDetail] = useState<CRMDeal | null>(null);
  const [dealToShare, setDealToShare] = useState<CRMDeal | null>(null);
  const [isNewDealModalOpen, setIsNewDealModalOpen] = useState(false);
  const [newDealDefaultStage, setNewDealDefaultStage] = useState<string | null>(null);
  const [isTagManagerOpen, setIsTagManagerOpen] = useState(false);
  const [isColumnManagerOpen, setIsColumnManagerOpen] = useState(false);
  const [isImportExportModalOpen, setIsImportExportModalOpen] = useState(false);

  // Abertura automática de card via link direto (?tab=crm&deal=...)
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const params = new URLSearchParams(window.location.search);
      const dealIdFromUrl = params.get("deal");
      if (dealIdFromUrl) {
        const found = deals.find((d) => d.id === dealIdFromUrl);
        if (found) {
          setSelectedDealForDetail(found);
        }
      }
    } catch {
      // ignore
    }
  }, [deals]);

  // Atualiza query param na URL quando card for aberto/fechado
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const currentParams = new URLSearchParams(window.location.search);
      if (selectedDealForDetail) {
        currentParams.set("tab", "crm");
        currentParams.set("deal", selectedDealForDetail.id);
        window.history.replaceState(null, "", `?${currentParams.toString()}`);
      } else if (currentParams.has("deal")) {
        currentParams.delete("deal");
        const newSearch = currentParams.toString();
        window.history.replaceState(
          null,
          "",
          newSearch ? `?${newSearch}` : window.location.pathname
        );
      }
    } catch {
      // ignore
    }
  }, [selectedDealForDetail]);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Salespeople dynamic list
  const salespeopleList = useMemo(() => {
    const set = new Set<string>();
    deals.forEach((d) => {
      if (d.salespersonName) set.add(d.salespersonName);
    });
    // Add default fallbacks if empty
    ["João Silva", "Maria Oliveira", "Carlos Eduardo", "Ana Beatriz"].forEach((s) => set.add(s));
    return Array.from(set);
  }, [deals]);

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchQuery.trim()) count++;
    if (selectedSalesperson !== "todos") count++;
    if (datePreset !== "todas") count++;
    if (selectedPriority !== "todas") count++;
    if (selectedTag !== "todas") count++;
    return count;
  }, [searchQuery, selectedSalesperson, datePreset, selectedPriority, selectedTag]);

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedSalesperson("todos");
    setDatePreset("todas");
    setCustomStartDate("");
    setCustomEndDate("");
    setSelectedPriority("todas");
    setSelectedTag("todas");
    showToast("Filtros limpos!");
  };

  // Filtered Deals calculation
  const filteredDeals = useMemo(() => {
    const now = new Date();

    return deals.filter((deal) => {
      // 1. Text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = deal.title.toLowerCase().includes(q);
        const matchClient = deal.clientName.toLowerCase().includes(q);
        const matchFarm = (deal.farmName || "").toLowerCase().includes(q);
        const matchCity = (deal.cityState || "").toLowerCase().includes(q);
        const matchCategory = deal.productCategory.toLowerCase().includes(q);
        const matchSeller = deal.salespersonName.toLowerCase().includes(q);
        const matchTags = deal.tags?.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchClient && !matchFarm && !matchCity && !matchCategory && !matchSeller && !matchTags) {
          return false;
        }
      }

      // 2. Salesperson
      if (selectedSalesperson !== "todos" && deal.salespersonName !== selectedSalesperson) {
        return false;
      }

      // 3. Priority
      if (selectedPriority !== "todas" && deal.priority !== selectedPriority) {
        return false;
      }

      // 4. Tag
      if (selectedTag !== "todas") {
        if (!deal.tags || !deal.tags.includes(selectedTag)) {
          return false;
        }
      }

      // 5. Date Filter Preset
      if (datePreset === "semana") {
        const dealDate = new Date(deal.expectedCloseDate + "T12:00:00");
        const oneWeekAhead = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        if (dealDate < now || dealDate > oneWeekAhead) {
          return false;
        }
      } else if (datePreset === "mes") {
        const dealDate = new Date(deal.expectedCloseDate + "T12:00:00");
        const oneMonthAhead = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        if (dealDate < now || dealDate > oneMonthAhead) {
          return false;
        }
      } else if (datePreset === "proximos30") {
        const dealDate = new Date(deal.expectedCloseDate + "T12:00:00");
        const thirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        if (dealDate < now || dealDate > thirtyDays) {
          return false;
        }
      } else if (datePreset === "personalizado") {
        const dealDateStr = deal.expectedCloseDate;
        if (customStartDate && dealDateStr < customStartDate) return false;
        if (customEndDate && dealDateStr > customEndDate) return false;
      }

      return true;
    });
  }, [deals, searchQuery, selectedSalesperson, selectedPriority, selectedTag, datePreset, customStartDate, customEndDate]);

  // Overall KPI Metrics
  const metrics = useMemo(() => {
    const totalPipelineValue = deals.reduce((acc, d) => acc + d.value, 0);
    const totalDeals = deals.length;
    const closedWon = deals.filter((d) => d.stage === "Vendas" || d.stage === "Finalizados").length;
    const winRate = totalDeals > 0 ? Math.round((closedWon / totalDeals) * 100) : 0;
    const avgTicket = totalDeals > 0 ? Math.round(totalPipelineValue / totalDeals) : 0;
    const activeIntegrationsCount = integrations.filter((i) => i.status === "connected").length;

    // Faturamento: Valores somados da coluna "Vendas"
    const salesDeals = deals.filter(
      (d) => d.stage?.trim().toLowerCase() === "vendas" || d.stage === "Vendas"
    );
    const totalSalesValue = salesDeals.reduce((acc, d) => acc + (d.value || 0), 0);
    const salesCount = salesDeals.length;

    return {
      totalPipelineValue,
      totalDeals,
      winRate,
      avgTicket,
      activeIntegrationsCount,
      totalSalesValue,
      salesCount,
    };
  }, [deals, integrations]);

  // Deal Management Handlers
  const handleSaveDeal = (updatedDeal: CRMDeal) => {
    setDeals((prev) => prev.map((d) => (d.id === updatedDeal.id ? updatedDeal : d)));
    if (selectedDealForDetail?.id === updatedDeal.id) {
      setSelectedDealForDetail(updatedDeal);
    }
  };

  const handleDeleteDeal = (dealId: string) => {
    setDeals((prev) => prev.filter((d) => d.id !== dealId));
    if (selectedDealForDetail?.id === dealId) {
      setSelectedDealForDetail(null);
    }
    showToast("Oportunidade excluída!");
  };

  const handleAdvanceStage = (dealId: string) => {
    setDeals((prev) =>
      prev.map((deal) => {
        if (deal.id !== dealId) return deal;
        const currentIndex = columns.findIndex((c) => c.key === deal.stage);
        if (currentIndex >= 0 && currentIndex < columns.length - 1) {
          const nextStage = columns[currentIndex + 1].key;
          showToast(`Negócio movido para "${columns[currentIndex + 1].label}"!`);
          return {
            ...deal,
            stage: nextStage,
            probability: nextStage === "Vendas" || nextStage === "Finalizados" ? 100 : Math.min(deal.probability + 20, 95),
          };
        }
        return deal;
      })
    );
  };

  const handleSetStage = (dealId: string, stage: CRMStage) => {
    setDeals((prev) =>
      prev.map((deal) => {
        if (deal.id !== dealId) return deal;
        return {
          ...deal,
          stage,
          probability: stage === "Vendas" || stage === "Finalizados" ? 100 : deal.probability,
        };
      })
    );
    showToast(`Oportunidade movida para ${stage}`);
  };

  const handleCreateDeal = (newDealData: Omit<CRMDeal, "id">) => {
    const newDeal: CRMDeal = {
      ...newDealData,
      id: `deal-${Date.now()}`,
    };
    setDeals((prev) => [newDeal, ...prev]);
    showToast("Nova oportunidade criada com sucesso!");
  };

  // Tag Management Handlers
  const handleAddTag = (newTag: Omit<CRMTag, "id">) => {
    const tagObj: CRMTag = {
      ...newTag,
      id: `tag-${Date.now()}`,
    };
    setTags((prev) => [...prev, tagObj]);
    showToast(`Tag "${newTag.name}" criada com sucesso!`);
  };

  const handleEditTag = (tagId: string, updated: Partial<CRMTag>) => {
    const oldTag = tags.find((t) => t.id === tagId);
    setTags((prev) => prev.map((t) => (t.id === tagId ? { ...t, ...updated } : t)));

    // If tag name changed, update deals
    if (oldTag && updated.name && oldTag.name !== updated.name) {
      setDeals((prev) =>
        prev.map((d) => ({
          ...d,
          tags: d.tags ? d.tags.map((t) => (t === oldTag.name ? updated.name! : t)) : [],
        }))
      );
    }
    showToast("Tag atualizada!");
  };

  const handleDeleteTag = (tagId: string) => {
    const tagToDelete = tags.find((t) => t.id === tagId);
    if (!tagToDelete) return;

    setTags((prev) => prev.filter((t) => t.id !== tagId));

    // Remove from deals
    setDeals((prev) =>
      prev.map((d) => ({
        ...d,
        tags: d.tags ? d.tags.filter((t) => t !== tagToDelete.name) : [],
      }))
    );

    if (selectedTag === tagToDelete.name) {
      setSelectedTag("todas");
    }

    showToast(`Tag "${tagToDelete.name}" excluída!`);
  };

  // Column Management Handlers
  const handleAddColumn = (newCol: Omit<CRMColumn, "id">) => {
    const colObj: CRMColumn = {
      ...newCol,
      id: `col-${Date.now()}`,
    };
    setColumns((prev) => [...prev, colObj]);
    showToast(`Coluna "${newCol.label}" adicionada ao funil!`);
  };

  const handleEditColumn = (colId: string, updated: Partial<CRMColumn>) => {
    const oldCol = columns.find((c) => c.id === colId);
    setColumns((prev) => prev.map((c) => (c.id === colId ? { ...c, ...updated } : c)));

    if (oldCol && updated.key && oldCol.key !== updated.key) {
      setDeals((prev) =>
        prev.map((d) => (d.stage === oldCol.key ? { ...d, stage: updated.key! } : d))
      );
    }
    showToast("Coluna atualizada!");
  };

  const handleDeleteColumn = (colId: string, targetColKeyForMigration?: string) => {
    const colToDelete = columns.find((c) => c.id === colId);
    if (!colToDelete) return;

    if (targetColKeyForMigration) {
      setDeals((prev) =>
        prev.map((d) => (d.stage === colToDelete.key ? { ...d, stage: targetColKeyForMigration } : d))
      );
    }

    setColumns((prev) => prev.filter((c) => c.id !== colId));
    showToast(`Coluna "${colToDelete.label}" removida.`);
  };

  const handleReorderColumns = (newCols: CRMColumn[]) => {
    setColumns(newCols);
  };

  // Import / Export Handler
  const handleImportSuccess = ({
    deals: importedDeals,
    columns: importedCols,
    tags: importedTags,
  }: {
    deals: CRMDeal[];
    columns: CRMColumn[];
    tags: CRMTag[];
    mode: "merge" | "replace";
  }) => {
    setDeals(importedDeals);
    setColumns(importedCols);
    setTags(importedTags);
  };

  // Integration Handlers
  const handleToggleIntegration = (integId: string) => {
    setIntegrations((prev) =>
      prev.map((item) => {
        if (item.id !== integId) return item;
        const nextStatus = item.status === "connected" ? "disconnected" : "connected";
        showToast(
          nextStatus === "connected"
            ? `${item.name} conectado com sucesso!`
            : `${item.name} desconectado.`
        );
        return {
          ...item,
          status: nextStatus,
          lastSync: nextStatus === "connected" ? "Agora mesmo" : item.lastSync,
        };
      })
    );
  };

  const handleSyncIntegration = (integId: string) => {
    setIntegrations((prev) =>
      prev.map((item) => (item.id === integId ? { ...item, lastSync: "Agora mesmo" } : item))
    );
    showToast("Sincronização executada com sucesso!");
  };

  const handleSaveIntegrationSettings = (integId: string, account: string, apiKey: string) => {
    setIntegrations((prev) =>
      prev.map((item) =>
        item.id === integId
          ? {
              ...item,
              accountEmail: account,
              apiKey: apiKey,
              status: "connected",
              lastSync: "Agora mesmo",
            }
          : item
      )
    );
    showToast("Configuração salva e conexão estabelecida!");
  };

  return (
    <div className="space-y-5 font-sans pb-12">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center space-x-2 text-xs font-bold border border-slate-700"
          >
            <CheckCircle2 className="w-4 h-4 text-[#00a83e]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alternador Principal: Funil Comercial vs Integração CRM vs Métricas */}
      <div className="flex items-center space-x-2 border-b border-slate-200/80 pb-1 overflow-x-auto scrollbar-none shrink-0">
        <button
          type="button"
          onClick={() => setActiveTab("pipeline")}
          className={`py-2 px-3.5 sm:px-4 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center space-x-1.5 sm:space-x-2 shrink-0 ${
            activeTab === "pipeline"
              ? "bg-[#00a83e] text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Funil & Pipeline</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("integrations")}
          className={`py-2 px-3.5 sm:px-4 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center space-x-1.5 sm:space-x-2 shrink-0 ${
            activeTab === "integrations"
              ? "bg-[#00a83e] text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Integração CRM</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("metrics")}
          className={`py-2 px-3.5 sm:px-4 rounded-xl font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center space-x-1.5 sm:space-x-2 shrink-0 ${
            activeTab === "metrics"
              ? "bg-[#00a83e] text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Painel</span>
        </button>
      </div>

      {/* Conteúdo da Aba */}
      {activeTab === "pipeline" && (
        <div className="space-y-4">
          {/* Barra de Filtros Completa */}
          <CRMFilterBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedSalesperson={selectedSalesperson}
            setSelectedSalesperson={setSelectedSalesperson}
            datePreset={datePreset}
            setDatePreset={setDatePreset}
            customStartDate={customStartDate}
            setCustomStartDate={setCustomStartDate}
            customEndDate={customEndDate}
            setCustomEndDate={setCustomEndDate}
            selectedPriority={selectedPriority}
            setSelectedPriority={setSelectedPriority}
            selectedTag={selectedTag}
            setSelectedTag={setSelectedTag}
            availableTags={tags}
            dealsCount={filteredDeals.length}
            totalDealsCount={deals.length}
            viewMode={viewMode}
            setViewMode={setViewMode}
            onOpenNewDealModal={() => {
              setNewDealDefaultStage(columns[0]?.key || "Clientes");
              setIsNewDealModalOpen(true);
            }}
            onOpenTagManagerModal={() => setIsTagManagerOpen(true)}
            onOpenColumnManagerModal={() => setIsColumnManagerOpen(true)}
            onOpenImportExportModal={() => setIsImportExportModalOpen(true)}
            onResetFilters={handleResetFilters}
            activeFiltersCount={activeFiltersCount}
            salespeopleList={salespeopleList}
          />

          {/* Visualizações Dinâmicas */}
          {viewMode === "kanban" && (
            <CRMKanbanView
              columns={columns}
              deals={filteredDeals}
              availableTags={tags}
              salespeople={salespeople}
              onOpenDealDetail={(deal) => setSelectedDealForDetail(deal)}
              onAdvanceStage={handleAdvanceStage}
              onSetStage={handleSetStage}
              onOpenAddColumnModal={() => setIsColumnManagerOpen(true)}
              onOpenNewDealModalWithStage={(stageKey) => {
                setNewDealDefaultStage(stageKey);
                setIsNewDealModalOpen(true);
              }}
              onOpenShareModal={(deal) => setDealToShare(deal)}
              onShowToast={showToast}
            />
          )}

          {viewMode === "lista" && (
            <CRMListView
              deals={filteredDeals}
              columns={columns}
              availableTags={tags}
              salespeople={salespeople}
              onOpenDealDetail={(deal) => setSelectedDealForDetail(deal)}
              onSetStage={handleSetStage}
              onOpenShareModal={(deal) => setDealToShare(deal)}
              onShowToast={showToast}
            />
          )}

          {viewMode === "gantt" && (
            <CRMGanttView
              deals={filteredDeals}
              columns={columns}
              availableTags={tags}
              onOpenDealDetail={(deal) => setSelectedDealForDetail(deal)}
            />
          )}
        </div>
      )}

      {activeTab === "integrations" && (
        <CRMIntegrationsTab
          integrations={integrations}
          onToggleIntegration={handleToggleIntegration}
          onSyncIntegration={handleSyncIntegration}
          onSaveIntegrationSettings={handleSaveIntegrationSettings}
        />
      )}

      {activeTab === "metrics" && (
        <CRMMetricsTab
          deals={deals}
          columns={columns}
          metrics={metrics}
          salespeople={salespeople || []}
        />
      )}

      {/* ================= MODAIS ================= */}

      {/* Modal: Detalhes do Negócio */}
      <AnimatePresence>
        {selectedDealForDetail && (
          <CRMDealDetailModal
            deal={selectedDealForDetail}
            isOpen={Boolean(selectedDealForDetail)}
            onClose={() => setSelectedDealForDetail(null)}
            columns={columns}
            availableTags={tags}
            onSaveDeal={handleSaveDeal}
            onDeleteDeal={handleDeleteDeal}
            onAdvanceStage={handleAdvanceStage}
            onSetStage={handleSetStage}
            onShowToast={showToast}
            salespeopleList={salespeopleList}
            salespeople={salespeople}
            onOpenShareModal={(deal) => setDealToShare(deal)}
          />
        )}
      </AnimatePresence>

      {/* Modal: Compartilhar Negócio / WhatsApp */}
      <AnimatePresence>
        {dealToShare && (
          <CRMShareModal
            deal={dealToShare}
            isOpen={Boolean(dealToShare)}
            onClose={() => setDealToShare(null)}
            salespeople={salespeople}
            onShowToast={showToast}
          />
        )}
      </AnimatePresence>

      {/* Modal: Novo Negócio */}
      <AnimatePresence>
        {isNewDealModalOpen && (
          <CRMNewDealModal
            isOpen={isNewDealModalOpen}
            onClose={() => setIsNewDealModalOpen(false)}
            columns={columns}
            availableTags={tags}
            onCreateDeal={handleCreateDeal}
            salespeopleList={salespeopleList}
          />
        )}
      </AnimatePresence>

      {/* Modal: Gerenciamento de Tags */}
      <AnimatePresence>
        {isTagManagerOpen && (
          <CRMTagManagerModal
            isOpen={isTagManagerOpen}
            onClose={() => setIsTagManagerOpen(false)}
            tags={tags}
            deals={deals}
            onAddTag={handleAddTag}
            onEditTag={handleEditTag}
            onDeleteTag={handleDeleteTag}
          />
        )}
      </AnimatePresence>

      {/* Modal: Gerenciamento de Colunas */}
      <AnimatePresence>
        {isColumnManagerOpen && (
          <CRMColumnManagerModal
            isOpen={isColumnManagerOpen}
            onClose={() => setIsColumnManagerOpen(false)}
            columns={columns}
            deals={deals}
            onAddColumn={handleAddColumn}
            onEditColumn={handleEditColumn}
            onDeleteColumn={handleDeleteColumn}
            onReorderColumns={handleReorderColumns}
          />
        )}
      </AnimatePresence>

      {/* Modal: Importação & Exportação / Modelo de Planilha */}
      <AnimatePresence>
        {isImportExportModalOpen && (
          <CRMImportExportModal
            isOpen={isImportExportModalOpen}
            onClose={() => setIsImportExportModalOpen(false)}
            deals={deals}
            columns={columns}
            tags={tags}
            onImportSuccess={handleImportSuccess}
            onShowToast={showToast}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
