import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  RefreshCw,
  X,
  Check,
} from "lucide-react";
import { CRMIntegrationConfig } from "../../types";

interface ProviderMeta {
  brandColor: string;
  gradient: string;
  lightBg: string;
  borderHover: string;
  monogram: string;
  tagline: string;
  features: string[];
  protocol: string;
  latency: string;
}

const PROVIDER_METADATA: Record<string, ProviderMeta> = {
  clover: {
    brandColor: "#00a83e",
    gradient: "from-emerald-600 to-teal-700",
    lightBg: "bg-emerald-50",
    borderHover: "hover:border-emerald-500/50 hover:shadow-emerald-500/10",
    monogram: "CL",
    tagline: "Aliare Agro • ERP de Revendas",
    features: [
      "Contratos de Barter & Grãos",
      "Pedidos Faturados no ERP",
      "Mapeamento de Fazendas & RTVs",
    ],
    protocol: "REST API v2 • Webhooks Bi-direcionais",
    latency: "32ms",
  },
  siagri: {
    brandColor: "#0284c7",
    gradient: "from-teal-600 to-cyan-700",
    lightBg: "bg-cyan-50",
    borderHover: "hover:border-cyan-500/50 hover:shadow-cyan-500/10",
    monogram: "SG",
    tagline: "Siagri Agrointelli • Cooperativas",
    features: [
      "Visitas Técnicas de Campo de RTV",
      "Mapeamento Geoespacial de Talhões",
      "Saldos em Armazém & Cotações",
    ],
    protocol: "OpenAPI Siagri • JSON Sync",
    latency: "44ms",
  },
  salesforce: {
    brandColor: "#2563eb",
    gradient: "from-sky-600 to-blue-700",
    lightBg: "bg-sky-50",
    borderHover: "hover:border-sky-500/50 hover:shadow-sky-500/10",
    monogram: "SF",
    tagline: "Sales Cloud • Multinacionais & Trading",
    features: [
      "Contas de Grupos Econômicos Rurais",
      "Oportunidades de Safra Multimoeda",
      "Disparo Automático de Campanhas",
    ],
    protocol: "OAuth 2.0 • Streaming API v58",
    latency: "28ms",
  },
  totvs: {
    brandColor: "#7c3aed",
    gradient: "from-purple-600 to-indigo-800",
    lightBg: "bg-purple-50",
    borderHover: "hover:border-purple-500/50 hover:shadow-purple-500/10",
    monogram: "TT",
    tagline: "Agrotitan Viasoft • Armazéns & Sementes",
    features: [
      "Cotações de Balcão e Fixação Grãos",
      "Romaneios e Entregas em Armazém",
      "Liberação Ágil de Crédito Rural",
    ],
    protocol: "Agrotitan Gateway • Realtime Webhooks",
    latency: "36ms",
  },
  agendor: {
    brandColor: "#ea580c",
    gradient: "from-amber-500 to-emerald-600",
    lightBg: "bg-amber-50",
    borderHover: "hover:border-amber-500/50 hover:shadow-amber-500/10",
    monogram: "AG",
    tagline: "HubSpot Agro • Funil Ágil & WhatsApp",
    features: [
      "Histórico de Mensagens WhatsApp",
      "Follow-ups Automáticos de Colaboradores",
      "Alertas Imediatos de Safra e Plantio",
    ],
    protocol: "Webhooks REST v3 • Push Notifications",
    latency: "22ms",
  },
};

interface CRMIntegrationsTabProps {
  integrations: CRMIntegrationConfig[];
  onToggleIntegration: (id: string) => void;
  onSyncIntegration: (id: string) => void;
  onSaveIntegrationSettings: (integId: string, account: string, apiKey: string) => void;
}

export const CRMIntegrationsTab: React.FC<CRMIntegrationsTabProps> = ({
  integrations,
  onToggleIntegration,
  onSyncIntegration,
  onSaveIntegrationSettings,
}) => {
  const [selectedIntegForModal, setSelectedIntegForModal] = useState<CRMIntegrationConfig | null>(null);
  const [integAccount, setIntegAccount] = useState("");
  const [integApiKey, setIntegApiKey] = useState("");
  const [isTestingInteg, setIsTestingInteg] = useState(false);

  const handleOpenModal = (integ: CRMIntegrationConfig) => {
    setSelectedIntegForModal(integ);
    setIntegAccount(integ.accountEmail || "");
    setIntegApiKey(integ.apiKey ? "••••••••••••••••" : "");
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIntegForModal) return;

    setIsTestingInteg(true);
    setTimeout(() => {
      onSaveIntegrationSettings(selectedIntegForModal.id, integAccount, integApiKey);
      setIsTestingInteg(false);
      setSelectedIntegForModal(null);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Grid de Integrações */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {integrations.map((integ) => {
          const meta = PROVIDER_METADATA[integ.providerCode] || PROVIDER_METADATA.clover;

          return (
            <div
              key={integ.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${meta.gradient} text-white font-black text-sm flex items-center justify-center shadow-xs`}
                  >
                    {meta.monogram}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{integ.name}</h4>
                    <span className="text-[11px] text-slate-400 block">{meta.tagline}</span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                    integ.status === "connected"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-slate-100 text-slate-500 border-slate-200"
                  }`}
                >
                  {integ.status === "connected" ? "Ativo" : "Desconectado"}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleOpenModal(integ)}
                  className="text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Configurar
                </button>

                <div className="flex items-center space-x-2">
                  {integ.status === "connected" && (
                    <button
                      type="button"
                      onClick={() => onSyncIntegration(integ.id)}
                      className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer"
                      title="Sincronizar agora"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => onToggleIntegration(integ.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      integ.status === "connected"
                        ? "bg-rose-50 text-rose-700 hover:bg-rose-100"
                        : "bg-[#00a83e] text-white hover:bg-emerald-700"
                    }`}
                  >
                    {integ.status === "connected" ? "Desconectar" : "Conectar"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de Configuração */}
      <AnimatePresence>
        {selectedIntegForModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
              onClick={() => setSelectedIntegForModal(null)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative z-10 border border-slate-100 overflow-hidden"
            >
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-base font-black text-slate-900">
                  Configurar {selectedIntegForModal.name}
                </h3>
                <button
                  type="button"
                  onClick={() => setSelectedIntegForModal(null)}
                  className="text-slate-400 hover:text-slate-600 p-1.5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveModal} className="p-5 space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1 text-[10px]">
                    Identificador / E-mail de Acesso
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="revenda.comercial@agro.com.br"
                    value={integAccount}
                    onChange={(e) => setIntegAccount(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase mb-1 text-[10px]">
                    Token de Autenticação / API Key
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="sk_live_agro_..."
                    value={integApiKey}
                    onChange={(e) => setIntegApiKey(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>

                <div className="pt-3 flex items-center justify-end space-x-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedIntegForModal(null)}
                    className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isTestingInteg}
                    className="px-4 py-2 bg-[#00a83e] hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs flex items-center space-x-1.5"
                  >
                    {isTestingInteg ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Validando...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Salvar Conexão</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
