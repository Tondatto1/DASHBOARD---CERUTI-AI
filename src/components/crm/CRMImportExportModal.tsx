import React, { useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Download,
  Upload,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  Layers,
  Sparkles,
  ArrowRight,
  Database,
  Info,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Eye,
  Check,
  Filter,
  DollarSign,
  TrendingUp,
  Users,
} from "lucide-react";
import { CRMDeal, CRMColumn, CRMTag } from "../../types";
import {
  CRMFieldKey,
  CRM_FIELDS,
  exportSmartCsv,
  exportFullBackupJson,
  analyzeSpreadsheetStructure,
  executeAdaptiveImport,
  downloadFile,
  SpreadsheetAnalysis,
  ImportResult,
} from "../../utils/crmImportExport";

interface CRMImportExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  deals: CRMDeal[];
  columns: CRMColumn[];
  tags: CRMTag[];
  onImportSuccess: (result: {
    deals: CRMDeal[];
    columns: CRMColumn[];
    tags: CRMTag[];
    mode: "merge" | "replace";
  }) => void;
  onShowToast: (msg: string) => void;
}

export const CRMImportExportModal: React.FC<CRMImportExportModalProps> = ({
  isOpen,
  onClose,
  deals,
  columns,
  tags,
  onImportSuccess,
  onShowToast,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<"import" | "export">("import");

  // Import State
  const [dragActive, setDragActive] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<SpreadsheetAnalysis | null>(null);
  const [userFieldMapping, setUserFieldMapping] = useState<Record<number, CRMFieldKey>>({});
  const [userStageMapping, setUserStageMapping] = useState<Record<string, string>>({});
  const [importMode, setImportMode] = useState<"merge" | "replace">("merge");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAdvancedMapping, setShowAdvancedMapping] = useState(false);
  const [showAdvancedPreview, setShowAdvancedPreview] = useState(false);
  const [rawJsonData, setRawJsonData] = useState<{
    deals: CRMDeal[];
    columns?: CRMColumn[];
    tags?: CRMTag[];
  } | null>(null);

  // Export State
  const [exportStageFilter, setExportStageFilter] = useState<string>("all");
  const [exportSalespersonFilter, setExportSalespersonFilter] = useState<string>("all");
  const [exportDelimiter, setExportDelimiter] = useState<";" | ",">(";");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Vendedores disponíveis para filtro de exportação
  const availableSalespersons = useMemo(() => {
    const list = deals
      .map((d) => d.salespersonName)
      .filter((name): name is string => Boolean(name && name.trim()));
    return Array.from(new Set(list));
  }, [deals]);

  // Negócios filtrados para a exportação
  const exportFilteredDeals = useMemo(() => {
    return deals.filter((d) => {
      if (
        exportStageFilter !== "all" &&
        (d.stage || "").toLowerCase().trim() !== exportStageFilter.toLowerCase().trim()
      ) {
        return false;
      }
      if (
        exportSalespersonFilter !== "all" &&
        (d.salespersonName || "").toLowerCase().trim() !== exportSalespersonFilter.toLowerCase().trim()
      ) {
        return false;
      }
      return true;
    });
  }, [deals, exportStageFilter, exportSalespersonFilter]);

  // Métricas calculadas para exportação
  const exportTotalValue = useMemo(() => {
    return exportFilteredDeals.reduce((sum, d) => sum + (Number(d.value) || 0), 0);
  }, [exportFilteredDeals]);

  const exportTicketAverage = useMemo(() => {
    if (exportFilteredDeals.length === 0) return 0;
    return exportTotalValue / exportFilteredDeals.length;
  }, [exportFilteredDeals, exportTotalValue]);

  if (!isOpen) return null;

  // Handler: Exportação Inteligente para CSV (Excel / Sheets)
  const handleExportSmartCsv = () => {
    const csvContent = exportSmartCsv(deals, {
      delimiter: exportDelimiter,
      filterStage: exportStageFilter,
      filterSalesperson: exportSalespersonFilter,
    });
    const dateStr = new Date().toISOString().split("T")[0];
    const stageSuffix =
      exportStageFilter !== "all" ? `_${exportStageFilter.toLowerCase().replace(/\s+/g, "_")}` : "";
    downloadFile(csvContent, `crm_agro_leads_inteligente_${dateStr}${stageSuffix}.csv`, "text/csv");
    onShowToast(
      `${exportFilteredDeals.length} oportunidades exportadas com formatação inteligente!`
    );
  };

  // Handler: Exportar Backup Integral (.json)
  const handleExportJson = () => {
    const jsonContent = exportFullBackupJson(deals, columns, tags);
    const dateStr = new Date().toISOString().split("T")[0];
    downloadFile(jsonContent, `crm_agro_backup_completo_${dateStr}.json`, "application/json");
    onShowToast("Backup estrutural completo exportado com sucesso!");
  };

  // Handler: Processar arquivo de forma adaptativa e inteligente
  const handleFileChange = (file: File) => {
    setSelectedFileName(file.name);
    setIsProcessing(true);
    setRawJsonData(null);
    setShowAdvancedMapping(false);
    setShowAdvancedPreview(false);

    const reader = new FileReader();

    if (file.name.endsWith(".json")) {
      reader.onload = (e) => {
        try {
          const raw = e.target?.result as string;
          const parsed = JSON.parse(raw);

          if (parsed && Array.isArray(parsed.deals)) {
            setRawJsonData(parsed);
            setAnalysis(null);
            onShowToast("Backup JSON reconhecido com sucesso!");
          } else {
            onShowToast("O arquivo JSON não possui a estrutura válida de negócios.");
          }
        } catch {
          onShowToast("Erro ao ler arquivo JSON.");
        } finally {
          setIsProcessing(false);
        }
      };
      reader.readAsText(file, "UTF-8");
    } else {
      // Arquivo tabular (CSV, TSV, TXT, etc.)
      reader.onload = (e) => {
        try {
          const raw = e.target?.result as string;
          const detectedAnalysis = analyzeSpreadsheetStructure(raw, columns);

          if (detectedAnalysis && detectedAnalysis.detectedColumns.length > 0) {
            setAnalysis(detectedAnalysis);

            // Pré-popula os mapeamentos com a inferência inteligente
            const initialFieldMap: Record<number, CRMFieldKey> = {};
            detectedAnalysis.detectedColumns.forEach((c) => {
              initialFieldMap[c.fileColumnIndex] = c.suggestedField;
            });
            setUserFieldMapping(initialFieldMap);

            const initialStageMap: Record<string, string> = {};
            detectedAnalysis.stagesDetected.forEach((s) => {
              initialStageMap[s.rawStageName] = s.mappedStageKey;
            });
            setUserStageMapping(initialStageMap);

            onShowToast(
              `Planilha compreendida: ${detectedAnalysis.totalRows} oportunidades identificadas!`
            );
          } else {
            onShowToast("Não foi possível identificar linhas ou colunas no arquivo.");
          }
        } catch {
          onShowToast("Falha ao analisar a estrutura da planilha.");
        } finally {
          setIsProcessing(false);
        }
      };
      reader.readAsText(file, "UTF-8");
    }
  };

  // Prévia gerada adaptativamente em tempo real
  const computedPreview = useMemo<ImportResult | null>(() => {
    if (rawJsonData) {
      return {
        deals: rawJsonData.deals,
        newColumns: rawJsonData.columns || [],
        newTags: rawJsonData.tags || [],
        stats: {
          totalRows: rawJsonData.deals.length,
          validDeals: rawJsonData.deals.length,
          newStagesCreated: (rawJsonData.columns || []).map((c) => c.label),
          newTagsCreated: (rawJsonData.tags || []).map((t) => t.name),
        },
        errors: [],
      };
    }

    if (!analysis) return null;

    return executeAdaptiveImport(
      analysis,
      userFieldMapping,
      userStageMapping,
      columns,
      tags
    );
  }, [analysis, userFieldMapping, userStageMapping, rawJsonData, columns, tags]);

  // Volume financeiro total dos leads identificados na importação
  const importedTotalValue = useMemo(() => {
    if (!computedPreview) return 0;
    return computedPreview.deals.reduce((sum, d) => sum + (Number(d.value) || 0), 0);
  }, [computedPreview]);

  // Handler: Confirmar Importação
  const handleConfirmImport = () => {
    if (!computedPreview || computedPreview.deals.length === 0) {
      onShowToast("Nenhuma oportunidade pronta para importação.");
      return;
    }

    let finalDeals: CRMDeal[] = [];

    if (importMode === "replace") {
      finalDeals = computedPreview.deals;
    } else {
      const existingMap = new Map<string, CRMDeal>(deals.map((d) => [d.id, d]));
      computedPreview.deals.forEach((deal) => {
        existingMap.set(deal.id, deal);
      });
      finalDeals = Array.from(existingMap.values());
    }

    // Colunas da pipeline (cria novas etapas detectadas para manter o funil perfeitamente configurado)
    const existingColKeys = new Set(columns.map((c) => c.key.toLowerCase().trim()));
    const finalColumns = [...columns];
    computedPreview.newColumns.forEach((col) => {
      if (!existingColKeys.has(col.key.toLowerCase().trim())) {
        finalColumns.push(col);
        existingColKeys.add(col.key.toLowerCase().trim());
      }
    });

    // Tags
    const existingTagNames = new Set(tags.map((t) => t.name.toLowerCase().trim()));
    const finalTags = [...tags];
    computedPreview.newTags.forEach((tag) => {
      if (!existingTagNames.has(tag.name.toLowerCase().trim())) {
        finalTags.push(tag);
        existingTagNames.add(tag.name.toLowerCase().trim());
      }
    });

    onImportSuccess({
      deals: finalDeals,
      columns: finalColumns,
      tags: finalTags,
      mode: importMode,
    });

    const newColsCount = computedPreview.newColumns.length;
    const msg =
      newColsCount > 0
        ? `${computedPreview.deals.length} oportunidades integradas à pipeline (${newColsCount} novas colunas criadas no funil)!`
        : `${computedPreview.deals.length} oportunidades integradas à pipeline com sucesso!`;

    onShowToast(msg);
    onClose();
  };

  const handleResetFile = () => {
    setSelectedFileName(null);
    setAnalysis(null);
    setRawJsonData(null);
    setUserFieldMapping({});
    setUserStageMapping({});
    setShowAdvancedMapping(false);
    setShowAdvancedPreview(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
        onClick={onClose}
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.97, y: 15 }}
        className="relative z-10 bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden"
      >
        {/* Header Superior Minimalista */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-[#00a83e] flex items-center justify-center shadow-2xs">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Central Inteligente de Dados
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                Importação adaptativa de qualquer planilha e exportação inteligente pronta para relatórios e Excel.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra de Navegação: 2 Abas Diretas e Intuitivas */}
        <div className="px-6 pt-3 border-b border-slate-100 bg-white flex items-center space-x-4">
          <button
            type="button"
            onClick={() => setActiveSubTab("import")}
            className={`pb-3 px-3 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center space-x-2 cursor-pointer ${
              activeSubTab === "import"
                ? "border-[#00a83e] text-[#00a83e]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>Importação Inteligente</span>
            {analysis && (
              <span className="w-2 h-2 rounded-full bg-[#00a83e] animate-pulse" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab("export")}
            className={`pb-3 px-3 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center space-x-2 cursor-pointer ${
              activeSubTab === "export"
                ? "border-[#00a83e] text-[#00a83e]"
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Exportação Inteligente ({deals.length})</span>
          </button>
        </div>

        {/* Conteúdo com Scroll */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* ================= ABA 1: IMPORTAÇÃO INTELIGENTE ================= */}
          {activeSubTab === "import" && (
            <div className="space-y-6">
              {/* Etapa 1: Sem arquivo selecionado -> Área de Upload Sem Fricção */}
              {!analysis && !rawJsonData && (
                <div className="space-y-4">
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragActive(true);
                    }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragActive(false);
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        handleFileChange(e.dataTransfer.files[0]);
                      }
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all cursor-pointer ${
                      dragActive
                        ? "border-[#00a83e] bg-emerald-50/70 scale-[0.99]"
                        : "border-slate-300 hover:border-emerald-400 bg-slate-50/50 hover:bg-slate-50"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv,.tsv,.json,.txt,text/csv,text/tab-separated-values,application/json"
                      className="hidden"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileChange(e.target.files[0]);
                        }
                      }}
                    />

                    <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 text-[#00a83e] flex items-center justify-center mx-auto mb-4 shadow-2xs">
                      <Upload className="w-7 h-7" />
                    </div>

                    <h4 className="text-base sm:text-lg font-black text-slate-900">
                      Arraste qualquer planilha aqui ou clique para selecionar
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-500 mt-1.5 max-w-lg mx-auto leading-relaxed">
                      Não é preciso seguir nenhum modelo pré-definido. Suporta arquivos do seu <strong>ERP, Excel, Google Sheets ou outros CRMs</strong> (.csv, .tsv, .txt, .json).
                    </p>

                    <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/90 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
                        <Sparkles className="w-3.5 h-3.5 text-[#00a83e]" />
                        Mapeamento Semântico Automático
                      </span>
                      <span className="text-[11px] font-bold text-sky-800 bg-sky-100/90 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs">
                        <Layers className="w-3.5 h-3.5 text-sky-600" />
                        Criação Automática de Etapas
                      </span>
                      <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
                        Sem Formatações Manuais
                      </span>
                    </div>
                  </div>

                  {isProcessing && (
                    <div className="p-4 bg-emerald-50 text-[#00a83e] border border-emerald-200 rounded-2xl text-center text-xs font-bold animate-pulse flex items-center justify-center space-x-2">
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>Analisando semântica das colunas e valores da planilha...</span>
                    </div>
                  )}

                  {/* Informações da Facilidade */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-start space-x-3 text-xs text-slate-600">
                    <Info className="w-4 h-4 text-[#00a83e] shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="font-bold text-slate-900 block">
                        Como a importação inteligente facilita sua rotina:
                      </span>
                      <p className="leading-relaxed">
                        Nosso sistema identifica automaticamente o que cada coluna representa (Produtor, Fazenda, Faturamento, Etapa do Funil, Telefone/WhatsApp, Vendedor e Tags). Se sua planilha tiver fases que ainda não existem no funil, nós as criamos na hora para que nenhum card fique desorganizado.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Etapa 2: Arquivo Carregado -> Resumo Direto e Ação Imediata */}
              {(analysis || rawJsonData) && (
                <div className="space-y-5">
                  {/* Card Principal de Sucesso e Ação com 1 Clique */}
                  <div className="bg-gradient-to-br from-emerald-50/90 via-emerald-50/40 to-slate-50 border border-emerald-200/90 rounded-3xl p-5 sm:p-6 shadow-2xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-11 h-11 rounded-2xl bg-white text-[#00a83e] border border-emerald-200 flex items-center justify-center shadow-xs">
                          <CheckCircle2 className="w-6 h-6 text-[#00a83e]" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-black text-base text-slate-900 truncate max-w-xs sm:max-w-md">
                              {selectedFileName}
                            </h3>
                            <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                              Pronto para Integrar
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 mt-0.5">
                            Planilha compreendida e estruturada sem erros de formatação.
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleResetFile}
                        className="py-1.5 px-3 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 self-start sm:self-auto shadow-2xs"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                        <span>Trocar Arquivo</span>
                      </button>
                    </div>

                    {/* Resumo Numérico dos Dados Encontrados */}
                    {computedPreview && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                        <div className="p-3.5 bg-white border border-slate-200/80 rounded-2xl shadow-2xs">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                            Oportunidades
                          </span>
                          <span className="text-xl font-black text-slate-900 mt-0.5 block">
                            {computedPreview.deals.length}
                          </span>
                        </div>

                        <div className="p-3.5 bg-white border border-slate-200/80 rounded-2xl shadow-2xs">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                            Volume Total
                          </span>
                          <span className="text-xl font-black text-[#00a83e] mt-0.5 block truncate">
                            R$ {importedTotalValue.toLocaleString("pt-BR")}
                          </span>
                        </div>

                        <div className="p-3.5 bg-white border border-slate-200/80 rounded-2xl shadow-2xs">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                            Etapas Mapeadas
                          </span>
                          <span className="text-xl font-black text-slate-900 mt-0.5 block">
                            {new Set(computedPreview.deals.map((d) => d.stage)).size} fases
                          </span>
                        </div>

                        <div className="p-3.5 bg-white border border-slate-200/80 rounded-2xl shadow-2xs">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                            Novas Colunas Funil
                          </span>
                          <span className="text-xl font-black text-sky-600 mt-0.5 block">
                            +{computedPreview.newColumns.length}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Destaque de Novas Colunas Criadas se houver */}
                    {computedPreview && computedPreview.newColumns.length > 0 && (
                      <div className="p-3 bg-sky-50 border border-sky-200/80 rounded-2xl text-xs text-sky-900 flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center space-x-2">
                          <Layers className="w-4 h-4 text-sky-600 shrink-0" />
                          <span>
                            <strong>{computedPreview.newColumns.length} novas etapas</strong> serão adicionadas ao seu funil automaticamente:
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {computedPreview.newColumns.map((col) => (
                            <span
                              key={col.key}
                              className="px-2 py-0.5 bg-white border border-sky-300 rounded-lg text-xs font-bold text-sky-900 shadow-2xs"
                            >
                              {col.label}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Modo de Aplicação na Pipeline */}
                    <div className="p-4 bg-white rounded-2xl border border-slate-200/80 space-y-2">
                      <span className="text-xs font-bold text-slate-800 block">
                        Como você deseja aplicar no seu CRM?
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <label
                          className={`p-3 rounded-xl border flex items-center space-x-3 cursor-pointer transition-all ${
                            importMode === "merge"
                              ? "border-[#00a83e] bg-emerald-50/50 text-[#00a83e] font-bold shadow-2xs"
                              : "border-slate-200 bg-white text-slate-700"
                          }`}
                        >
                          <input
                            type="radio"
                            name="importMode"
                            checked={importMode === "merge"}
                            onChange={() => setImportMode("merge")}
                            className="text-[#00a83e] focus:ring-[#00a83e]"
                          />
                          <div className="text-xs">
                            <span className="block font-bold">Mesclar com os Leads Atuais (Recomendado)</span>
                            <span className="text-[11px] text-slate-500 font-normal">
                              Mantém os negócios existentes e adiciona/atualiza os da planilha.
                            </span>
                          </div>
                        </label>

                        <label
                          className={`p-3 rounded-xl border flex items-center space-x-3 cursor-pointer transition-all ${
                            importMode === "replace"
                              ? "border-red-500 bg-red-50/40 text-red-700 font-bold shadow-2xs"
                              : "border-slate-200 bg-white text-slate-700"
                          }`}
                        >
                          <input
                            type="radio"
                            name="importMode"
                            checked={importMode === "replace"}
                            onChange={() => setImportMode("replace")}
                            className="text-red-600 focus:ring-red-500"
                          />
                          <div className="text-xs">
                            <span className="block font-bold">Substituir Base Completa</span>
                            <span className="text-[11px] text-slate-500 font-normal">
                              Limpa o funil e carrega exclusivamente os negócios desta planilha.
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Botão de Integração Imediata (1 Clique) */}
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
                      <div className="text-xs text-slate-500 flex items-center space-x-1.5">
                        <Check className="w-4 h-4 text-[#00a83e]" />
                        <span>Mapeamento inteligente pré-configurado e validado.</span>
                      </div>

                      <button
                        type="button"
                        onClick={handleConfirmImport}
                        className="w-full sm:w-auto px-7 py-3.5 bg-[#00a83e] hover:bg-emerald-700 text-white rounded-2xl text-sm font-black shadow-md shadow-emerald-700/20 hover:shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Integrar {computedPreview?.deals.length || 0} Oportunidades Agora</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </button>
                    </div>
                  </div>

                  {/* Seção Expansível Opcional: Ajustes Avançados de Mapeamento */}
                  {analysis && (
                    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
                      <button
                        type="button"
                        onClick={() => setShowAdvancedMapping(!showAdvancedMapping)}
                        className="w-full px-5 py-3.5 bg-slate-50/70 hover:bg-slate-100 flex items-center justify-between text-left transition-colors cursor-pointer"
                      >
                        <div className="flex items-center space-x-2">
                          <SlidersHorizontal className="w-4 h-4 text-[#00a83e]" />
                          <span className="text-xs font-bold text-slate-800">
                            Ajustar Mapeamento de Colunas e Etapas (Opcional)
                          </span>
                          <span className="text-[10px] bg-slate-200/80 text-slate-600 px-2 py-0.5 rounded-md font-bold">
                            {analysis.detectedColumns.length} colunas
                          </span>
                        </div>
                        {showAdvancedMapping ? (
                          <ChevronUp className="w-4 h-4 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        )}
                      </button>

                      {showAdvancedMapping && (
                        <div className="p-5 space-y-5 border-t border-slate-200">
                          {/* Mapeamento de Colunas */}
                          <div>
                            <span className="text-xs font-bold text-slate-700 block mb-2">
                              Colunas Identificadas na Planilha vs Campos do CRM:
                            </span>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                              {analysis.detectedColumns.map((col) => {
                                const selectedKey =
                                  userFieldMapping[col.fileColumnIndex] || col.suggestedField;
                                return (
                                  <div
                                    key={col.fileColumnIndex}
                                    className="p-3 bg-slate-50/60 border border-slate-200/90 rounded-xl flex items-center justify-between gap-3 text-xs"
                                  >
                                    <div className="truncate flex-1">
                                      <span className="font-bold text-slate-900 block truncate">
                                        {col.fileColumnName || `Coluna ${col.fileColumnIndex + 1}`}
                                      </span>
                                      <span className="text-[10px] text-slate-400 block truncate mt-0.5">
                                        Ex: {col.sampleValues.slice(0, 2).join(", ") || "-"}
                                      </span>
                                    </div>

                                    <div className="shrink-0 flex items-center space-x-1.5">
                                      <span className="text-slate-400 text-xs font-bold">→</span>
                                      <select
                                        value={selectedKey}
                                        onChange={(e) => {
                                          setUserFieldMapping((prev) => ({
                                            ...prev,
                                            [col.fileColumnIndex]: e.target.value as CRMFieldKey,
                                          }));
                                        }}
                                        className="py-1 px-2.5 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#00a83e]"
                                      >
                                        {CRM_FIELDS.map((f) => (
                                          <option key={f.key} value={f.key}>
                                            {f.label}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Mapeamento de Etapas */}
                          {analysis.stagesDetected.length > 0 && (
                            <div className="pt-2 border-t border-slate-100">
                              <span className="text-xs font-bold text-slate-700 block mb-2">
                                Etapas Encontradas vs Colunas do Funil:
                              </span>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                {analysis.stagesDetected.map((stage) => {
                                  const currentMapped =
                                    userStageMapping[stage.rawStageName] || stage.mappedStageKey;
                                  const isCreatingNew = !columns.some(
                                    (c) =>
                                      c.key.toLowerCase().trim() === currentMapped.toLowerCase().trim() ||
                                      c.label.toLowerCase().trim() === currentMapped.toLowerCase().trim()
                                  );

                                  return (
                                    <div
                                      key={stage.rawStageName}
                                      className="p-3 bg-slate-50/60 border border-slate-200/90 rounded-xl flex items-center justify-between gap-2 text-xs"
                                    >
                                      <div className="truncate">
                                        <span className="font-bold text-slate-900 block truncate">
                                          {stage.rawStageName}
                                        </span>
                                        <span className="text-[10px] text-slate-500">
                                          {stage.count} {stage.count === 1 ? "oportunidade" : "oportunidades"}
                                        </span>
                                      </div>

                                      <div className="shrink-0 flex items-center space-x-1.5">
                                        <span className="text-slate-400 text-xs font-bold">→</span>
                                        <select
                                          value={currentMapped}
                                          onChange={(e) => {
                                            setUserStageMapping((prev) => ({
                                              ...prev,
                                              [stage.rawStageName]: e.target.value,
                                            }));
                                          }}
                                          className="py-1 px-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 cursor-pointer focus:outline-none"
                                        >
                                          <option value={stage.rawStageName}>
                                            {isCreatingNew
                                              ? `Criar Coluna "${stage.rawStageName}"`
                                              : stage.rawStageName}
                                          </option>
                                          {columns.map((c) => (
                                            <option key={c.key} value={c.key}>
                                              Coluna existente: {c.label}
                                            </option>
                                          ))}
                                        </select>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Seção Expansível Opcional: Prévia dos Primeiros Cards */}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setShowAdvancedPreview(!showAdvancedPreview)}
                      className="w-full px-5 py-3.5 bg-slate-50/70 hover:bg-slate-100 flex items-center justify-between text-left transition-colors cursor-pointer"
                    >
                      <div className="flex items-center space-x-2">
                        <Eye className="w-4 h-4 text-[#00a83e]" />
                        <span className="text-xs font-bold text-slate-800">
                          Visualizar Amostra dos Registros Formatados
                        </span>
                      </div>
                      {showAdvancedPreview ? (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      )}
                    </button>

                    {showAdvancedPreview && computedPreview && (
                      <div className="p-4 border-t border-slate-200 overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                            <tr>
                              <th className="py-2.5 px-3">Título</th>
                              <th className="py-2.5 px-3">Produtor / Fazenda</th>
                              <th className="py-2.5 px-3">Etapa da Pipeline</th>
                              <th className="py-2.5 px-3">Valor Estimado</th>
                              <th className="py-2.5 px-3">Responsável</th>
                              <th className="py-2.5 px-3">Tags</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {computedPreview.deals.slice(0, 5).map((deal, idx) => (
                              <tr key={idx} className="hover:bg-slate-50/60">
                                <td className="py-2 px-3 font-semibold text-slate-900 truncate max-w-[160px]">
                                  {deal.title}
                                </td>
                                <td className="py-2 px-3 text-slate-600 truncate max-w-[140px]">
                                  {deal.clientName}
                                </td>
                                <td className="py-2 px-3">
                                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md font-bold text-[10px]">
                                    {deal.stage}
                                  </span>
                                </td>
                                <td className="py-2 px-3 font-mono font-bold text-slate-800">
                                  R$ {deal.value.toLocaleString("pt-BR")}
                                </td>
                                <td className="py-2 px-3 text-slate-600">{deal.salespersonName}</td>
                                <td className="py-2 px-3">
                                  <div className="flex flex-wrap gap-1">
                                    {(deal.tags || []).slice(0, 2).map((t, i) => (
                                      <span
                                        key={i}
                                        className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600"
                                      >
                                        {t}
                                      </span>
                                    ))}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================= ABA 2: EXPORTAÇÃO INTELIGENTE ================= */}
          {activeSubTab === "export" && (
            <div className="space-y-6">
              {/* Barra de Filtros Rápidos da Exportação */}
              <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-2xl space-y-3">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-800">
                  <Filter className="w-3.5 h-3.5 text-[#00a83e]" />
                  <span>Personalizar Escopo da Exportação:</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  {/* Filtro por Etapa */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">
                      Etapa do Funil:
                    </label>
                    <select
                      value={exportStageFilter}
                      onChange={(e) => setExportStageFilter(e.target.value)}
                      className="w-full py-2 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#00a83e]"
                    >
                      <option value="all">Todas as Etapas ({deals.length} leads)</option>
                      {columns.map((col) => {
                        const count = deals.filter(
                          (d) => (d.stage || "").toLowerCase() === col.key.toLowerCase()
                        ).length;
                        return (
                          <option key={col.key} value={col.key}>
                            {col.label} ({count} leads)
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {/* Filtro por Consultor */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">
                      Consultor / RTV:
                    </label>
                    <select
                      value={exportSalespersonFilter}
                      onChange={(e) => setExportSalespersonFilter(e.target.value)}
                      className="w-full py-2 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#00a83e]"
                    >
                      <option value="all">Todos os Consultores</option>
                      {availableSalespersons.map((seller) => (
                        <option key={seller} value={seller}>
                          {seller}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Separador CSV */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">
                      Formato do Arquivo CSV:
                    </label>
                    <select
                      value={exportDelimiter}
                      onChange={(e) => setExportDelimiter(e.target.value as ";" | ",")}
                      className="w-full py-2 px-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#00a83e]"
                    >
                      <option value=";">Ponto e vírgula [ ; ] (Excel Brasil / Sheets)</option>
                      <option value=",">Vírgula [ , ] (Padrão Internacional)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Indicadores Dinâmicos do que será Exportado */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-2xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Oportunidades no Filtro
                  </span>
                  <span className="text-2xl font-black text-slate-900 mt-1 block">
                    {exportFilteredDeals.length}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    de um total de {deals.length} no CRM
                  </span>
                </div>

                <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-2xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Volume em Pipeline
                  </span>
                  <span className="text-2xl font-black text-[#00a83e] mt-1 block truncate">
                    R$ {exportTotalValue.toLocaleString("pt-BR")}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    soma financeira dos leads filtrados
                  </span>
                </div>

                <div className="p-4 bg-white border border-slate-200/90 rounded-2xl shadow-2xs">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Ticket Médio
                  </span>
                  <span className="text-2xl font-black text-slate-900 mt-1 block truncate">
                    R$ {Math.round(exportTicketAverage).toLocaleString("pt-BR")}
                  </span>
                  <span className="text-[11px] text-slate-500">por oportunidade</span>
                </div>
              </div>

              {/* Opções de Exportação Inteligente */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Opção 1: Planilha Inteligente Formatada para Relatórios (.csv) */}
                <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-[#00a83e] border border-emerald-100 flex items-center justify-center font-bold shadow-2xs">
                      <FileSpreadsheet className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900">
                        Planilha Inteligente (.csv)
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Exporta as <strong>{exportFilteredDeals.length} oportunidades selecionadas</strong> com cabeçalhos descritivos em português, valores numéricos somáveis e codificação UTF-8 compatível com Excel e Google Sheets.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleExportSmartCsv}
                    disabled={exportFilteredDeals.length === 0}
                    className={`w-full py-3 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-2 shadow-xs ${
                      exportFilteredDeals.length > 0
                        ? "bg-[#00a83e] hover:bg-emerald-700 text-white cursor-pointer active:scale-95"
                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    <Download className="w-4 h-4" />
                    <span>Baixar Planilha Inteligente ({exportFilteredDeals.length})</span>
                  </button>
                </div>

                {/* Opção 2: Backup Integral Estruturado (JSON) */}
                <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <div className="w-11 h-11 rounded-2xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center font-bold shadow-2xs">
                      <Database className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900">
                        Backup Integral Estrutural (.json)
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Exporta um snapshot completo do CRM para restauração instantânea: colunas personalizadas do funil, paletas de cores, catálogo de tags e todos os negócios.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleExportJson}
                    className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95 shadow-xs"
                  >
                    <Download className="w-4 h-4" />
                    <span>Exportar Backup Estrutural (.json)</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Rodapé Fixo */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/60 flex items-center justify-end text-xs text-slate-500">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-bold text-slate-700 hover:text-slate-900 cursor-pointer"
          >
            Fechar
          </button>
        </div>
      </motion.div>
    </div>
  );
};
