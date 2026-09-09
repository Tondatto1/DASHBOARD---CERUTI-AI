import { CRMDeal, Salesperson } from "../types";
import { formatBRL } from "../data/crmData";

/**
 * Retorna a URL direta para visualização de um card específico no CRM.
 */
export function getDealShareUrl(dealId: string): string {
  if (typeof window === "undefined") return "";
  const origin = window.location.origin;
  const pathname = window.location.pathname;
  return `${origin}${pathname}?tab=crm&deal=${encodeURIComponent(dealId)}`;
}

/**
 * Localiza o número de WhatsApp do colaborador responsável pelo negócio.
 * Dá prioridade ao cadastro da equipe (Salesperson) e fallback para o telefone do deal.
 */
export function getCollaboratorWhatsApp(
  deal: CRMDeal,
  salespeople?: Salesperson[]
): { phone: string; name: string; foundInTeam: boolean } {
  const sellerName = deal.salespersonName?.trim() || "";

  if (salespeople && salespeople.length > 0) {
    const found = salespeople.find(
      (s) => s.name.trim().toLowerCase() === sellerName.toLowerCase()
    );
    if (found && found.whatsapp) {
      return {
        phone: found.whatsapp,
        name: found.name,
        foundInTeam: true,
      };
    }
  }

  // Fallback para deal.phone se não encontrou o colaborador na lista
  return {
    phone: deal.phone || "",
    name: sellerName || "Colaborador",
    foundInTeam: false,
  };
}

/**
 * Monta a mensagem pré-definida de acompanhamento para o WhatsApp.
 * Regras estritas:
 * - Mensagem limpa, objetiva e bem estruturada
 * - Com quebras de linha
 * - SEM emojis
 * - Início: [Nome do colaborador], como está a situação do [Nome do produtor/cliente/lead]?
 * - Contém link direto da atividade/card
 */
export function buildDealWhatsAppMessage(deal: CRMDeal, cardUrl?: string): string {
  const url = cardUrl || getDealShareUrl(deal.id);
  const collaboratorName = deal.salespersonName?.trim() || "Colaborador";
  const clientName = deal.clientName?.trim() || "cliente";

  return `${collaboratorName}, como está a situação do ${clientName}?\n\nLink direto do card: ${url}`;
}

/**
 * Converte um número para dígitos limpos para uso na API do WhatsApp.
 * Se for número brasileiro com 10 ou 11 dígitos sem DDI, adiciona 55.
 */
export function formatPhoneForWhatsApp(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (!digits) return "";
  if (digits.length === 10 || digits.length === 11) {
    return `55${digits}`;
  }
  return digits;
}

/**
 * Gera o link universal do WhatsApp com o texto pré-definido e telefone (se houver).
 */
export function buildWhatsAppUniversalLink(phone: string, message: string): string {
  const cleanDigits = formatPhoneForWhatsApp(phone);
  const encodedText = encodeURIComponent(message);

  if (cleanDigits) {
    return `https://api.whatsapp.com/send?phone=${cleanDigits}&text=${encodedText}`;
  }
  return `https://api.whatsapp.com/send?text=${encodedText}`;
}

/**
 * Abre uma nova guia direcionando para o WhatsApp com a mensagem e link estruturados.
 */
export function openDealInWhatsApp(
  deal: CRMDeal,
  salespeople?: Salesperson[],
  onNotify?: (msg: string) => void
): void {
  const collaborator = getCollaboratorWhatsApp(deal, salespeople);
  const shareUrl = getDealShareUrl(deal.id);
  const message = buildDealWhatsAppMessage(deal, shareUrl);
  const whatsappUrl = buildWhatsAppUniversalLink(collaborator.phone, message);

  if (onNotify) {
    if (collaborator.phone) {
      onNotify(`Abrindo WhatsApp de ${collaborator.name}...`);
    } else {
      onNotify(`Abrindo WhatsApp para acompanhamento de ${deal.clientName}...`);
    }
  }

  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
}

/**
 * Copia o link direto do card para a área de transferência.
 */
export async function copyDealShareLink(
  deal: CRMDeal,
  onNotify?: (msg: string) => void
): Promise<boolean> {
  const url = getDealShareUrl(deal.id);
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(url);
      if (onNotify) onNotify("Link direto do card copiado com sucesso!");
      return true;
    }
  } catch (err) {
    console.error("Falha ao copiar link:", err);
  }

  // Fallback caso navigator.clipboard falhe
  try {
    const input = document.createElement("input");
    input.value = url;
    document.body.appendChild(input);
    input.select();
    document.execCommand("copy");
    document.body.removeChild(input);
    if (onNotify) onNotify("Link direto do card copiado!");
    return true;
  } catch (fallbackErr) {
    console.error("Fallback de cópia falhou:", fallbackErr);
    if (onNotify) onNotify("Não foi possível copiar automaticamente.");
    return false;
  }
}
