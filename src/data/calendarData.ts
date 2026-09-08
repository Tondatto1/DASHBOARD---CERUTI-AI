export interface CalendarEvent {
  id: string;
  title: string;
  clientName: string;
  farmName?: string;
  timeStart: string;
  timeEnd: string;
  dayOfWeek: 'Segunda' | 'Terça' | 'Quarta' | 'Quinta' | 'Sexta' | 'Sábado' | 'Domingo';
  dateStr: string;
  dateISO: string; // 'YYYY-MM-DD'
  type: 'visita' | 'proposta' | 'call' | 'revisao' | 'fechamento';
  status: 'confirmado' | 'em_andamento' | 'pendente' | 'concluido';
  isAiGenerated?: boolean;
  notes?: string;
  location?: string;
  phone?: string;
}

export interface SellerScheduleData {
  salespersonId: string;
  provider: 'google' | 'outlook';
  calendarEmail: string;
  lastSync: string;
  events: CalendarEvent[];
}

export const MOCK_SELLER_SCHEDULES: Record<string, CalendarEvent[]> = {
  // 1: João Silva
  '1': [
    // Semana 1 (08/09 a 12/09)
    {
      id: 'e1-1',
      title: 'Visita Comercial & Levantamento de Safra',
      clientName: 'Roberto Mendes',
      farmName: 'Fazenda Bela Vista (1.400 ha)',
      timeStart: '08:30',
      timeEnd: '10:00',
      dayOfWeek: 'Segunda',
      dateStr: '08/Set',
      dateISO: '2026-09-08',
      type: 'visita',
      status: 'confirmado',
      isAiGenerated: true,
      notes: 'Cliente solicitou cotação urgente de fungicidas sistêmicos após conversa com o bot no WhatsApp.',
      location: 'Rodovia MT-242, km 45, Sorriso - MT',
      phone: '+55 66 99876-1234'
    },
    {
      id: 'e1-2',
      title: 'Apresentação de Linha de Nutrição Foliar',
      clientName: 'Carlos Eduardo Barreto',
      farmName: 'Agropecuária São José',
      timeStart: '14:00',
      timeEnd: '15:30',
      dayOfWeek: 'Segunda',
      dateStr: '08/Set',
      dateISO: '2026-09-08',
      type: 'proposta',
      status: 'confirmado',
      isAiGenerated: false,
      notes: 'Demonstração dos bioestimulantes e condições de pagamento em Barter.',
      location: 'Escritório Central - Lucas do Rio Verde',
      phone: '+55 66 98123-4567'
    },
    {
      id: 'e1-3',
      title: 'Vistoria Técnica de Stand de Plantio',
      clientName: 'Guilherme Tondatto',
      farmName: 'Fazenda União',
      timeStart: '09:00',
      timeEnd: '10:30',
      dayOfWeek: 'Terça',
      dateStr: '09/Set',
      dateISO: '2026-09-09',
      type: 'visita',
      status: 'confirmado',
      isAiGenerated: true,
      notes: 'Agendado automaticamente pelo bot após simulação de cálculo de sementes.',
      location: 'Sinop - MT',
      phone: '+55 66 99654-7890'
    },
    {
      id: 'e1-4',
      title: 'Follow-up de Proposta & Fechamento',
      clientName: 'Henrique Vilela',
      farmName: 'Grupo Agrovale',
      timeStart: '15:30',
      timeEnd: '16:30',
      dayOfWeek: 'Terça',
      dateStr: '09/Set',
      dateISO: '2026-09-09',
      type: 'fechamento',
      status: 'confirmado',
      isAiGenerated: true,
      notes: 'Alinhamento final sobre preço do pacote de adubação.',
      location: 'Call Remoto via Google Meet',
      phone: '+55 66 99111-2233'
    },
    {
      id: 'e1-5',
      title: 'Demonstração Prática de Adjuvantes',
      clientName: 'Marcelo Pavan',
      farmName: 'Fazenda Recanto',
      timeStart: '10:00',
      timeEnd: '11:45',
      dayOfWeek: 'Quarta',
      dateStr: '10/Set',
      dateISO: '2026-09-10',
      type: 'visita',
      status: 'confirmado',
      isAiGenerated: false,
      notes: 'Teste de bancada e compatibilidade de calda.',
      location: 'Campo Verde - MT',
      phone: '+55 65 99234-8765'
    },
    {
      id: 'e1-6',
      title: 'Reunião de Fechamento de Contrato de Grãos',
      clientName: 'Otávio Silveira',
      farmName: 'Fazenda Buriti',
      timeStart: '09:00',
      timeEnd: '10:30',
      dayOfWeek: 'Quinta',
      dateStr: '11/Set',
      dateISO: '2026-09-11',
      type: 'fechamento',
      status: 'confirmado',
      isAiGenerated: true,
      notes: 'Contrato gerado a partir do plano de vendas com entrega em 15 dias.',
      location: 'Primavera do Leste - MT',
      phone: '+55 66 98456-1122'
    },
    {
      id: 'e1-7',
      title: 'Revisão Semanal de Metas & Carteira',
      clientName: 'Equipe Interna Ceruti',
      farmName: 'Filial Sorriso',
      timeStart: '14:30',
      timeEnd: '16:00',
      dayOfWeek: 'Sexta',
      dateStr: '12/Set',
      dateISO: '2026-09-12',
      type: 'revisao',
      status: 'confirmado',
      isAiGenerated: false,
      notes: 'Alinhamento com o Gestor Comercial sobre o pipeline da safra.',
      location: 'Sala de Reuniões 02'
    },

    // Semana 2 (Quinzena: 15/09 a 22/09)
    {
      id: 'e1-8',
      title: 'Alinhamento de Entrega de Fertilizantes Especiais',
      clientName: 'Rodrigo Zancanaro',
      farmName: 'Fazenda Três Palmeiras',
      timeStart: '08:30',
      timeEnd: '10:00',
      dayOfWeek: 'Segunda',
      dateStr: '15/Set',
      dateISO: '2026-09-15',
      type: 'visita',
      status: 'confirmado',
      isAiGenerated: true,
      notes: 'Agendado pelo bot. Produtor confirmou recebimento da primeira remessa.',
      location: 'Sorriso - MT',
      phone: '+55 66 99777-8899'
    },
    {
      id: 'e1-9',
      title: 'Diagnóstico de Pragas e Nematoides',
      clientName: 'Fernando Alcantara',
      farmName: 'Grupo Sol Nascente',
      timeStart: '14:00',
      timeEnd: '16:00',
      dayOfWeek: 'Quarta',
      dateStr: '17/Set',
      dateISO: '2026-09-17',
      type: 'visita',
      status: 'confirmado',
      isAiGenerated: false,
      notes: 'Coleta de solo e raízes em talhões com histórico de reboleira.',
      location: 'Lucas do Rio Verde - MT'
    },
    {
      id: 'e1-10',
      title: 'Fechamento de Pacote de Biológicos Safrinha',
      clientName: 'Juliana Costa',
      farmName: 'Fazenda Santa Luzia',
      timeStart: '10:00',
      timeEnd: '11:30',
      dayOfWeek: 'Sexta',
      dateStr: '19/Set',
      dateISO: '2026-09-19',
      type: 'fechamento',
      status: 'confirmado',
      isAiGenerated: true,
      notes: 'Assinatura eletrônica de proposta aprovada via WhatsApp.',
      location: 'Sinop - MT'
    },

    // Semana 3 e 4 (Mês: 23/09 a 30/09)
    {
      id: 'e1-11',
      title: 'Dia de Campo: Tecnologias Ceruti para Soja',
      clientName: 'Cooperativa Regional',
      farmName: 'Campo Experimental Ceruti',
      timeStart: '08:00',
      timeEnd: '12:00',
      dayOfWeek: 'Terça',
      dateStr: '23/Set',
      dateISO: '2026-09-23',
      type: 'visita',
      status: 'confirmado',
      isAiGenerated: false,
      notes: 'Apresentação de resultados aos 20 maiores clientes da carteira.',
      location: 'Sorriso - MT'
    },
    {
      id: 'e1-12',
      title: 'Reunião de Fechamento de Vendas Mensal',
      clientName: 'Diretoria Comercial',
      farmName: 'Sede Ceruti',
      timeStart: '15:00',
      timeEnd: '17:00',
      dayOfWeek: 'Sexta',
      dateStr: '26/Set',
      dateISO: '2026-09-26',
      type: 'revisao',
      status: 'confirmado',
      isAiGenerated: false,
      notes: 'Consolidação dos pedidos fechados no mês de Setembro.'
    },
    {
      id: 'e1-13',
      title: 'Planejamento de Pré-Plantio de Safrinha',
      clientName: 'Guilherme Tondatto',
      farmName: 'Fazenda União',
      timeStart: '09:00',
      timeEnd: '10:30',
      dayOfWeek: 'Terça',
      dateStr: '30/Set',
      dateISO: '2026-09-30',
      type: 'proposta',
      status: 'confirmado',
      isAiGenerated: true,
      notes: 'Reunião agendada via IA para dimensionamento do milho safrinha.'
    }
  ],

  // 2: Maria Oliveira
  '2': [
    {
      id: 'e2-1',
      title: 'Visita Técnica: Fazenda Santa Fé',
      clientName: 'Marcos Silveira',
      farmName: 'Fazenda Santa Fé (2.200 ha)',
      timeStart: '08:30',
      timeEnd: '10:00',
      dayOfWeek: 'Segunda',
      dateStr: '08/Set',
      dateISO: '2026-09-08',
      type: 'visita',
      status: 'confirmado',
      isAiGenerated: true,
      notes: '🤖 Reunião agendada pelo WhatsApp Ceruti.',
      location: 'Nova Mutum - MT',
      phone: '+55 65 99988-7766'
    },
    {
      id: 'e2-2',
      title: 'Apresentação de Proposta de Fertilizantes',
      clientName: 'Juliana Costa',
      farmName: 'Grupo Terra Boa',
      timeStart: '10:30',
      timeEnd: '11:45',
      dayOfWeek: 'Segunda',
      dateStr: '08/Set',
      dateISO: '2026-09-08',
      type: 'proposta',
      status: 'confirmado',
      isAiGenerated: false,
      notes: 'Apresentação dos comparativos de rentabilidade.',
      location: 'Lucas do Rio Verde - MT'
    },
    {
      id: 'e2-3',
      title: 'Demonstração de Inoculantes Biológicos',
      clientName: 'Renato Faria',
      farmName: 'Fazenda Primavera',
      timeStart: '14:00',
      timeEnd: '15:30',
      dayOfWeek: 'Quarta',
      dateStr: '10/Set',
      dateISO: '2026-09-10',
      type: 'visita',
      status: 'confirmado',
      isAiGenerated: true,
      notes: '🤖 Agendamento via IA.',
      location: 'Sorriso - MT'
    },
    {
      id: 'e2-4',
      title: 'Visita de Diagnóstico de Doenças em Soja',
      clientName: 'Antônio Prado',
      farmName: 'Fazenda Vale Verde',
      timeStart: '11:00',
      timeEnd: '12:30',
      dayOfWeek: 'Sexta',
      dateStr: '12/Set',
      dateISO: '2026-09-12',
      type: 'visita',
      status: 'confirmado',
      isAiGenerated: true,
      location: 'Ipiranga do Norte - MT'
    },
    {
      id: 'e2-5',
      title: 'Negociação de Barter & Fixação de Grãos',
      clientName: 'Fernando Alcantara',
      farmName: 'Grupo Sol Nascente',
      timeStart: '15:00',
      timeEnd: '16:30',
      dayOfWeek: 'Quarta',
      dateStr: '17/Set',
      dateISO: '2026-09-17',
      type: 'fechamento',
      status: 'confirmado',
      isAiGenerated: false,
      location: 'Sorriso - MT'
    },
    {
      id: 'e2-6',
      title: 'Circuito Técnico de Campo - Região Norte',
      clientName: 'Cooperativa de Produtores',
      farmName: 'Polo Agrícola Norte',
      timeStart: '08:30',
      timeEnd: '11:30',
      dayOfWeek: 'Quinta',
      dateStr: '25/Set',
      dateISO: '2026-09-25',
      type: 'visita',
      status: 'confirmado',
      isAiGenerated: true,
      notes: 'Lavouras demonstrativas de alta produtividade.'
    }
  ],

  // 3: Carlos Sousa
  '3': [
    {
      id: 'e3-1',
      title: 'Visita de Prospecção & Apresentação Institucional',
      clientName: 'André Zanatta',
      farmName: 'Fazenda Novo Horizonte',
      timeStart: '09:30',
      timeEnd: '11:00',
      dayOfWeek: 'Segunda',
      dateStr: '08/Set',
      dateISO: '2026-09-08',
      type: 'visita',
      status: 'confirmado',
      isAiGenerated: true,
      location: 'Rondonópolis - MT'
    },
    {
      id: 'e3-2',
      title: 'Call de Levantamento de Demanda de Fertilizantes',
      clientName: 'José Guimarães',
      farmName: 'Fazenda Estrela do Sul',
      timeStart: '15:00',
      timeEnd: '16:00',
      dayOfWeek: 'Quarta',
      dateStr: '10/Set',
      dateISO: '2026-09-10',
      type: 'call',
      status: 'confirmado',
      isAiGenerated: true,
      location: 'WhatsApp Call'
    },
    {
      id: 'e3-3',
      title: 'Apresentação de Linha de Fungicidas Protetores',
      clientName: 'Geraldo Becker',
      farmName: 'Fazenda Planalto',
      timeStart: '08:30',
      timeEnd: '10:30',
      dayOfWeek: 'Sexta',
      dateStr: '12/Set',
      dateISO: '2026-09-12',
      type: 'proposta',
      status: 'confirmado',
      isAiGenerated: false,
      location: 'Jaciara - MT'
    },
    {
      id: 'e3-4',
      title: 'Negociação de Condições Comerciais',
      clientName: 'Sérgio Nogueira',
      farmName: 'Agropecuária Rio Vermelho',
      timeStart: '14:00',
      timeEnd: '15:30',
      dayOfWeek: 'Quarta',
      dateStr: '17/Set',
      dateISO: '2026-09-17',
      type: 'fechamento',
      status: 'confirmado',
      isAiGenerated: true
    }
  ]
};

export function getSellerEvents(salespersonId: string, salespersonName: string): CalendarEvent[] {
  if (MOCK_SELLER_SCHEDULES[salespersonId]) {
    return MOCK_SELLER_SCHEDULES[salespersonId];
  }

  // Gera eventos padrão distribuídos no mês para vendedores novos
  return [
    {
      id: `e-new-1`,
      title: 'Visita de Prospecção Comercial',
      clientName: 'Produtor Rural Local',
      farmName: 'Fazenda Progresso (1.100 ha)',
      timeStart: '09:00',
      timeEnd: '10:30',
      dayOfWeek: 'Segunda',
      dateStr: '08/Set',
      dateISO: '2026-09-08',
      type: 'visita',
      status: 'confirmado',
      isAiGenerated: true,
      notes: `Reunião agendada via WhatsApp para o consultor ${salespersonName}.`,
      location: 'Região Polo Agro'
    },
    {
      id: `e-new-2`,
      title: 'Apresentação de Proposta de Insumos',
      clientName: 'Grupo Agrícola',
      farmName: 'Fazenda Santa Maria',
      timeStart: '14:00',
      timeEnd: '15:30',
      dayOfWeek: 'Terça',
      dateStr: '09/Set',
      dateISO: '2026-09-09',
      type: 'proposta',
      status: 'confirmado',
      isAiGenerated: false,
      notes: 'Alinhamento sobre prazos e volume de defensivos.'
    },
    {
      id: `e-new-3`,
      title: 'Follow-up de Fechamento de Venda',
      clientName: 'Marcos Vinicius',
      farmName: 'Fazenda Boa Vista',
      timeStart: '10:00',
      timeEnd: '11:00',
      dayOfWeek: 'Quinta',
      dateStr: '11/Set',
      dateISO: '2026-09-11',
      type: 'fechamento',
      status: 'confirmado',
      isAiGenerated: true,
      notes: 'Confirmação do pedido enviado pela IA.'
    },
    {
      id: `e-new-4`,
      title: 'Visita Técnica de Avaliação de Safra',
      clientName: 'Produtor Associado',
      farmName: 'Fazenda Alvorada',
      timeStart: '09:00',
      timeEnd: '11:00',
      dayOfWeek: 'Quarta',
      dateStr: '17/Set',
      dateISO: '2026-09-17',
      type: 'visita',
      status: 'confirmado',
      isAiGenerated: true
    },
    {
      id: `e-new-5`,
      title: 'Alinhamento de Fechamento Mensal',
      clientName: 'Coordenação Comercial',
      farmName: 'Filial Ceruti',
      timeStart: '15:00',
      timeEnd: '16:30',
      dayOfWeek: 'Sexta',
      dateStr: '26/Set',
      dateISO: '2026-09-26',
      type: 'revisao',
      status: 'confirmado',
      isAiGenerated: false
    }
  ];
}
