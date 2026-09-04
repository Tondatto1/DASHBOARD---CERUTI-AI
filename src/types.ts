export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  isPlan?: boolean;
  planTitle?: string;
  objectionTag?: string;
  tactics?: string[];
}

export interface ObjectionData {
  id: string;
  category: string;
  description: string;
  count: number;
  percentage: number;
  severity: 'alta' | 'media' | 'baixa';
  bestArgument: string;
  successRate: number;
}

export interface UsagePoint {
  date: string; // 'YYYY-MM-DD'
  label: string; // '04/Set'
  dayOfWeek: string; // 'Sex'
  interactionsCount: number; // frequência de uso (quantas vezes utilizou o agente)
  plansCount: number; // quantidade de planos gerados
  activeHours: string[]; // ex: ['09:15', '11:30', '14:20', '16:45']
}

export interface ConversationSession {
  id: string;
  date: string; // '2026-09-04'
  dateLabel: string; // 'Hoje, 04 de Setembro'
  time: string; // '10:30'
  title: string;
  objection: string;
  clientContext: string;
  messages: ChatMessage[];
  plansGenerated: number;
}

export interface Salesperson {
  id: string;
  name: string;
  whatsapp: string;
  status: 'Ativo' | 'Inativo';
  messageCount: number;
  lastConversation: string;
  plansGeneratedMonth?: number;
  history24h: ChatMessage[];
  // Enhanced monitoring fields
  totalPlansGenerated?: number;
  plansGrowthRate?: number;
  conversionRate?: number;
  objections?: ObjectionData[];
  usageTimeline?: UsagePoint[];
  sessions?: ConversationSession[];
  calendarIntegration?: {
    status: 'connected' | 'disconnected';
    provider?: 'google' | 'outlook' | 'apple' | 'ical';
    email?: string;
    connectedAt?: string;
    lastSync?: string;
  };
}

export interface PlanInfo {
  name: string;
  maxAccesses: number;
}

export type CRMStage =
  | 'Clientes'
  | 'Pré-Qualificados'
  | 'Qualificados'
  | 'Negociação'
  | 'Resgates'
  | 'Vendas'
  | 'Recorrência'
  | 'Finalizados';

export interface CRMDeal {
  id: string;
  title: string;
  clientName: string;
  farmName?: string;
  cityState?: string;
  stage: CRMStage;
  value: number;
  salespersonName: string;
  productCategory: string;
  areaHectares?: number;
  startDate: string; // YYYY-MM-DD
  expectedCloseDate: string; // YYYY-MM-DD
  priority: 'alta' | 'média' | 'baixa';
  lastContact: string;
  probability: number;
  phone: string;
}

export interface CRMIntegrationConfig {
  id: string;
  name: string;
  providerCode: 'clover' | 'siagri' | 'salesforce' | 'totvs' | 'agendor';
  badge: string;
  popularInAgro: string;
  description: string;
  status: 'connected' | 'disconnected' | 'syncing';
  connectedAccount?: string;
  apiUrl?: string;
  apiKey?: string;
  lastSync?: string;
  syncedDealsCount?: number;
  syncFrequency?: string;
}
