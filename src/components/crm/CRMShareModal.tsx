import React, { useState } from "react";
import {
  X,
  Share2,
  Copy,
  Check,
  Phone,
  ExternalLink,
  MessageSquare,
  User,
  Layers,
  Building2,
} from "lucide-react";
import { motion } from "motion/react";
import { CRMDeal, Salesperson } from "../../types";
import { formatBRL } from "../../data/crmData";
import {
  getDealShareUrl,
  buildDealWhatsAppMessage,
  getCollaboratorWhatsApp,
  openDealInWhatsApp,
  copyDealShareLink,
} from "../../utils/crmShare";

interface CRMShareModalProps {
  deal: CRMDeal | null;
  isOpen: boolean;
  onClose: () => void;
  salespeople?: Salesperson[];
  onShowToast: (msg: string) => void;
}

export function CRMShareModal({
  deal,
  isOpen,
  onClose,
  salespeople,
  onShowToast,
}: CRMShareModalProps) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  if (!isOpen || !deal) return null;

  const shareUrl = getDealShareUrl(deal.id);
  const collaborator = getCollaboratorWhatsApp(deal, salespeople);
  const whatsappMessage = buildDealWhatsAppMessage(deal, shareUrl);

  const handleCopyLink = async () => {
    const ok = await copyDealShareLink(deal);
    if (ok) {
      setCopiedLink(true);
      onShowToast("Link do card copiado!");
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const handleCopyMessage = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(whatsappMessage);
        setCopiedMessage(true);
        onShowToast("Mensagem copiada para a área de transferência!");
        setTimeout(() => setCopiedMessage(false), 2500);
      }
    } catch {
      onShowToast("Não foi possível copiar a mensagem.");
    }
  };

  const handleOpenWhatsApp = () => {
    openDealInWhatsApp(deal, salespeople, onShowToast);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Oportunidade Ceruti: ${deal.title}`,
          text: whatsappMessage,
          url: shareUrl,
        });
      } catch (e) {
        // Ignora cancelamento pelo usuário
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
        onClick={onClose}
      />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-lg overflow-hidden relative z-10 font-sans"
      >
        {/* Topo do Modal */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-[#00a83e] flex items-center justify-center shadow-xs">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                Compartilhar Oportunidade
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Envie o link direto e acompanhe no WhatsApp
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-white rounded-xl transition-colors cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Card Resumo da Oportunidade */}
          <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-lg">
                {deal.productCategory || "Agro"}
              </span>
              <span className="text-xs font-bold text-slate-700 font-mono">
                {formatBRL(deal.value)}
              </span>
            </div>

            <h4 className="text-sm sm:text-base font-black text-slate-900 leading-snug">
              {deal.title}
            </h4>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
              <div className="flex items-center space-x-1.5 truncate">
                <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate font-semibold">{deal.clientName}</span>
              </div>
              <div className="flex items-center space-x-1.5 truncate">
                <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">Fase: <strong>{deal.stage}</strong></span>
              </div>
              {deal.farmName && (
                <div className="flex items-center space-x-1.5 truncate col-span-2 text-slate-500">
                  <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{deal.farmName} {deal.cityState ? `• ${deal.cityState}` : ""}</span>
                </div>
              )}
            </div>
          </div>

          {/* Seção 1: Link Direto do Card */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Link Direto do Card
            </label>
            <div className="flex items-center space-x-2">
              <div className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-600 truncate select-all">
                {shareUrl}
              </div>
              <button
                type="button"
                onClick={handleCopyLink}
                className={`py-2 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shrink-0 ${
                  copiedLink
                    ? "bg-emerald-600 text-white shadow-xs"
                    : "bg-slate-100 hover:bg-slate-200 text-slate-700"
                }`}
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copiado</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar</span>
                  </>
                )}
              </button>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Quem acessar este link abrirá diretamente este card no funil do CRM.
            </p>
          </div>

          {/* Seção 2: Falar no WhatsApp com o Colaborador */}
          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block">
                  Acompanhamento com Colaborador
                </span>
                <span className="text-sm font-bold text-slate-900 block mt-0.5">
                  {collaborator.name}
                </span>
                {collaborator.phone && (
                  <span className="text-xs text-slate-500 font-mono">
                    {collaborator.phone}
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={handleOpenWhatsApp}
                className="py-2.5 px-4 bg-[#00a83e] hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center space-x-2 cursor-pointer active:scale-95 shrink-0"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Falar no WhatsApp</span>
                <ExternalLink className="w-3 h-3 text-emerald-200" />
              </button>
            </div>

            {/* Pré-visualização da mensagem */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-slate-600">
                  Mensagem pré-definida estruturada:
                </span>
                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="text-[10px] font-bold text-[#00a83e] hover:text-emerald-800 flex items-center space-x-1 cursor-pointer"
                >
                  {copiedMessage ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedMessage ? "Copiado" : "Copiar texto"}</span>
                </button>
              </div>

              <div className="bg-white p-3 rounded-xl border border-emerald-100/90 text-xs font-mono text-slate-700 whitespace-pre-wrap leading-relaxed select-all">
                {whatsappMessage}
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          {typeof navigator !== "undefined" && "share" in navigator ? (
            <button
              type="button"
              onClick={handleNativeShare}
              className="py-2 px-3 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors flex items-center space-x-1.5 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Outros Apps</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
