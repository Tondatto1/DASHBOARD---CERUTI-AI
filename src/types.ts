export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
}

export interface Salesperson {
  id: string;
  name: string;
  whatsapp: string;
  status: 'Ativo' | 'Inativo';
  messageCount: number;
  lastConversation: string;
  history24h: ChatMessage[];
}

export interface PlanInfo {
  name: string;
  maxAccesses: number;
}
