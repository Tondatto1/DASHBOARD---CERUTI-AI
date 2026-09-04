import { Salesperson, ObjectionData, UsagePoint, ConversationSession } from '../types';

export const MOCK_OBJECTIONS_JOAO: ObjectionData[] = [
  {
    id: 'obj-1',
    category: 'Preço & Orçamento',
    description: 'Cliente alega que o valor da solução excede o orçamento anual ou solicita desconto acima da margem.',
    count: 38,
    percentage: 42,
    severity: 'alta',
    bestArgument: 'Ancoragem de ROI de 3.4x em 90 dias e estruturação de carência de fluxo de caixa.',
    successRate: 78,
  },
  {
    id: 'obj-2',
    category: 'Concorrência Direta',
    description: 'Lead cita proposta comercial de competidor com preço inicial 25% menor.',
    count: 26,
    percentage: 28,
    severity: 'media',
    bestArgument: 'Demonstração de custo oculto da concorrência e garantia de SLA com suporte 24/7.',
    successRate: 84,
  },
  {
    id: 'obj-3',
    category: 'Complexidade de Implantação',
    description: 'Lead teme sobrecarga da equipe interna e demora na curva de aprendizado.',
    count: 16,
    percentage: 18,
    severity: 'media',
    bestArgument: 'Onboarding turnkey acompanhado por especialista sem necessidade de equipe técnica interna.',
    successRate: 91,
  },
  {
    id: 'obj-4',
    category: 'Decisão Colegiada / Sócios',
    description: 'Interlocutor aprova a proposta, mas necessita de validação com conselho ou outros sócios.',
    count: 11,
    percentage: 12,
    severity: 'baixa',
    bestArgument: 'Envio de executive summary em 1 página focado em ROI e convite para call decisiva de 15 min.',
    successRate: 72,
  },
];

export const MOCK_OBJECTIONS_MARIA: ObjectionData[] = [
  {
    id: 'obj-m1',
    category: 'Concorrência Direta',
    description: 'Comparações frequentes de funcionalidades com ferramentas legadas de mercado.',
    count: 31,
    percentage: 39,
    severity: 'alta',
    bestArgument: 'Demonstração prática de automação com ganho de 12 horas semanais por vendedor.',
    successRate: 81,
  },
  {
    id: 'obj-m2',
    category: 'Preço & Orçamento',
    description: 'Pedidos de diluição de faturamento e questionamento sobre custo de setup.',
    count: 24,
    percentage: 30,
    severity: 'alta',
    bestArgument: 'Setup bonificado condicionado a contrato semestral sem reajuste.',
    successRate: 75,
  },
  {
    id: 'obj-m3',
    category: 'Prazo de Contrato',
    description: 'Hesitação em assumir fidelidade superior a 3 meses.',
    count: 14,
    percentage: 18,
    severity: 'media',
    bestArgument: 'Cláusula de garantia incondicional de satisfação nos primeiros 30 dias.',
    successRate: 88,
  },
  {
    id: 'obj-m4',
    category: 'Segurança de Dados',
    description: 'Questionamentos sobre compliance com LGPD e armazenamento em nuvem.',
    count: 10,
    percentage: 13,
    severity: 'baixa',
    bestArgument: 'Certificação SOC2 e criptografia de ponta a ponta com servidores no Brasil.',
    successRate: 95,
  },
];

export const MOCK_OBJECTIONS_CARLOS: ObjectionData[] = [
  {
    id: 'obj-c1',
    category: 'Preço & Orçamento',
    description: 'Dificuldade inicial em defender a proposta de valor perante pequenos lojistas.',
    count: 6,
    percentage: 50,
    severity: 'alta',
    bestArgument: 'Apresentação de plano escalonado por faturamento real do cliente.',
    successRate: 60,
  },
  {
    id: 'obj-c2',
    category: 'Momento Econômico',
    description: 'Clientes protelando compras devido a incertezas do setor.',
    count: 4,
    percentage: 33,
    severity: 'media',
    bestArgument: 'Evidenciar que corte de custos operacionais é a resposta correta para o momento.',
    successRate: 50,
  },
  {
    id: 'obj-c3',
    category: 'Tempo de Implementação',
    description: 'Dúvidas sobre o período de transição dos sistemas atuais.',
    count: 2,
    percentage: 17,
    severity: 'baixa',
    bestArgument: 'Migração gradual de dados sem interrupção das operações diárias.',
    successRate: 70,
  },
];

export const MOCK_SESSIONS_JOAO: ConversationSession[] = [
  {
    id: 'sess-j1',
    date: '2026-09-04',
    dateLabel: 'Hoje, 04 de Setembro',
    time: '10:30',
    title: 'Negociação Minas Aço • Quebra de Preço',
    objection: 'Preço & Orçamento',
    clientContext: 'Distribuidora com 45 funcionários e potencial de contrato de R$ 7.800/mês.',
    plansGenerated: 1,
    messages: [
      {
        id: 'msg-1',
        sender: 'user',
        text: 'Bom dia, Ceruti! Estou em negociação com o diretor financeiro da Minas Aço. Ele travou dizendo que nosso plano corporativo está 30% acima da proposta do concorrente. Como quebro essa objeção sem dar desconto?',
        timestamp: '10:30',
      },
      {
        id: 'msg-2',
        sender: 'agent',
        text: 'Olá, João! Perfeito, não conceda desconto na primeira rodada. A estratégia ideal aqui é o Custo Total de Propriedade (TCO) combinado com o risco de inação. Preparei seu plano estruturado:',
        timestamp: '10:31',
      },
      {
        id: 'msg-3',
        sender: 'agent',
        text: 'Plano de Argumentação Gerado para Minas Aço:\n\n1. Reconheça a preocupação: "Entendo que o desembolso inicial pareça maior, doutor Paulo. É natural comparar o valor de tabela."\n2. Mude o foco para o custo oculto: "No concorrente, a taxa de integrações, suporte não incluso e horas paradas da equipe custam em média 40% a mais no primeiro trimestre."\n3. Ancoragem de ROI: "Nosso sistema comprovadamente traz um ganho de produtividade de R$ 18.000 já no segundo mês, o que paga o ano inteiro da assinatura."\n4. Fechamento condicional: "Se incluirmos o onboarding assistido sem custo adicional e mantivermos esse valor, podemos formalizar a minuta ainda hoje?"',
        timestamp: '10:32',
        isPlan: true,
        planTitle: 'Plano de Argumentos: Minas Aço • Desmistificação de Preço vs. Retorno',
        objectionTag: 'Preço & Orçamento',
        tactics: [
          'Validação da preocupação com empatia',
          'Comparação por Custo Total de Inação',
          'Apresentação de ROI auditável',
          'Fechamento com bonificação de onboarding',
        ],
      },
      {
        id: 'msg-4',
        sender: 'user',
        text: 'Perfeito! Enviei esse áudio seguindo exatamente os pontos. O cliente respondeu agora dizendo que quer assinar com o onboarding garantido! Valeu demais!',
        timestamp: '10:36',
      },
      {
        id: 'msg-5',
        sender: 'agent',
        text: 'Excelente resultado, João! Uma vitória memorável mantendo a margem cheia da empresa. Conte comigo para a próxima negociação!',
        timestamp: '10:37',
      },
    ],
  },
  {
    id: 'sess-j2',
    date: '2026-09-03',
    dateLabel: 'Ontem, 03 de Setembro',
    time: '18:40',
    title: 'Grupo Vanguarda • Concorrência agressiva',
    objection: 'Concorrência Direta',
    clientContext: 'Rede varejista regional avaliando software concorrente.',
    plansGenerated: 1,
    messages: [
      {
        id: 'msg-6',
        sender: 'user',
        text: 'Ceruti, o gerente de vendas da Vanguarda disse que o software X tem o mesmo módulo de vendas por R$ 400 a menos por licença. O que eu falo?',
        timestamp: '18:40',
      },
      {
        id: 'msg-7',
        sender: 'agent',
        text: 'João, o software X é genérico e não possui nossa inteligência de recomendação preditiva em tempo real pelo WhatsApp. Foque na velocidade de resposta do vendedor e conversão de orçamentos perdidos.',
        timestamp: '18:41',
      },
      {
        id: 'msg-8',
        sender: 'agent',
        text: 'Plano de Argumentos: Grupo Vanguarda\n\n1. Comparativo de Entrega: "O software X é um CRM passivo onde sua equipe apenas cadastra dados. A Ceruti é um agente ativo que cria argumentos e fecha pedidos."\n2. Custo do Vendedor Desperdiçado: "Quantas propostas sua equipe perde por falta de argumento na hora certa? Recuperando apenas 2 orçamentos por mês, a diferença de R$ 400 vira lucro puro."\n3. Desafio dos 14 dias: "Faça o teste por 14 dias com 3 vendedores chave. Se não converterem mais que no software X, cancelamos sem custo."',
        timestamp: '18:43',
        isPlan: true,
        planTitle: 'Plano de Argumentos: Vanguarda • Ativo vs. Passivo',
        objectionTag: 'Concorrência Direta',
        tactics: [
          'Diferenciação qualitativa funcional',
          'Matemática simples de orçamentos recuperados',
          'Desafio de risco zero de 14 dias',
        ],
      },
      {
        id: 'msg-9',
        sender: 'user',
        text: 'Ótimo, vou apresentar o desafio de 14 dias na reunião de amanhã pela manhã.',
        timestamp: '18:45',
      },
    ],
  },
  {
    id: 'sess-j3',
    date: '2026-09-01',
    dateLabel: '01 de Setembro de 2026',
    time: '14:20',
    title: 'Metalúrgica Progresso • Falta de equipe interna',
    objection: 'Complexidade de Implantação',
    clientContext: 'Indústria tradicional com equipe operacional enxuta.',
    plansGenerated: 1,
    messages: [
      {
        id: 'msg-10',
        sender: 'user',
        text: 'O cliente adorou a ferramenta mas disse que a equipe de TI deles não tem tempo para configurar integrações agora. Dá pra fechar mesmo assim?',
        timestamp: '14:20',
      },
      {
        id: 'msg-11',
        sender: 'agent',
        text: 'Com certeza, João! Nossa solução não depende da TI do cliente. O setup é via API plug & play e nosso time técnico cuida de 100% da homologação.',
        timestamp: '14:21',
        isPlan: true,
        planTitle: 'Plano de Argumentos: Metalúrgica Progresso • TI Zero Touch',
        objectionTag: 'Complexidade de Implantação',
        tactics: [
          'Isenção total da TI do cliente',
          'Cronograma de 48 horas para ativação',
          'Treinamento operacional direto no WhatsApp',
        ],
      },
    ],
  },
  {
    id: 'sess-j4',
    date: '2026-08-28',
    dateLabel: '28 de Agosto de 2026',
    time: '11:15',
    title: 'LogSul Transportes • Decisão Colegiada',
    objection: 'Decisão Colegiada / Sócios',
    clientContext: 'Empresa familiar com 3 sócios decisores.',
    plansGenerated: 1,
    messages: [
      {
        id: 'msg-12',
        sender: 'user',
        text: 'O comprador quer fechar, mas disse que os outros dois sócios são resistentes a inovações digitais. O que posso enviar pra ele mostrar pra eles?',
        timestamp: '11:15',
      },
      {
        id: 'msg-13',
        sender: 'agent',
        text: 'Envie um comparativo visual em 3 tópicos: 1) Redução de tempo de resposta aos clientes de 4h para 4min; 2) Aumento de faturamento em 18% no 1º trimestre; 3) Acesso seguro sem precisar mudar o número de WhatsApp atual da empresa.',
        timestamp: '11:17',
        isPlan: true,
        planTitle: 'Plano de Argumentos: LogSul • Briefing para Diretoria',
        objectionTag: 'Decisão Colegiada / Sócios',
        tactics: [
          'One-page executivo de impacto financeiro',
          'Segurança de preservação dos números existentes',
          'Retorno rápido e sem atrito',
        ],
      },
    ],
  },
];

export const MOCK_SESSIONS_MARIA: ConversationSession[] = [
  {
    id: 'sess-m1',
    date: '2026-09-03',
    dateLabel: 'Ontem, 03 de Setembro',
    time: '18:40',
    title: 'Consultoria Prisma • Comparativo concorrente',
    objection: 'Concorrência Direta',
    clientContext: 'Empresa de serviços avaliando 3 opções de mercado.',
    plansGenerated: 1,
    messages: [
      {
        id: 'm-msg-1',
        sender: 'user',
        text: 'Olá Ceruti! O cliente perguntou exatamente quais são os 3 diferenciais técnicos da nossa solução frente à solução de prateleira da concorrência.',
        timestamp: '18:40',
      },
      {
        id: 'm-msg-2',
        sender: 'agent',
        text: 'Olá, Maria! Os três pilares fundamentais são: 1. Modelos de linguagem afinados especificamente para fechamento comercial B2B; 2. Integração nativa no WhatsApp comercial da equipe; 3. Telemetria gerencial completa em tempo real para o gestor.',
        timestamp: '18:42',
        isPlan: true,
        planTitle: 'Plano de Diferenciação Técnica • Consultoria Prisma',
        objectionTag: 'Concorrência Direta',
        tactics: [
          'Foco em especialização B2B vs. robôs genéricos',
          'Usabilidade nativa sem troca de app',
          'Controle gerencial em tempo real',
        ],
      },
      {
        id: 'm-msg-3',
        sender: 'user',
        text: 'Ok, vou verificar e retorno.',
        timestamp: '18:44',
      },
      {
        id: 'm-msg-4',
        sender: 'agent',
        text: 'Fico à disposição! Se precisar de uma simulação de ROI para anexar na proposta, é só me pedir.',
        timestamp: '18:45',
      },
    ],
  },
  {
    id: 'sess-m2',
    date: '2026-08-30',
    dateLabel: '30 de Agosto de 2026',
    time: '09:20',
    title: 'Rede FarmaMais • Dúvida sobre fidelidade contratual',
    objection: 'Prazo de Contrato',
    clientContext: 'Rede com 12 filiais querendo contrato flexível.',
    plansGenerated: 1,
    messages: [
      {
        id: 'm-msg-5',
        sender: 'user',
        text: 'O diretor de expansão não quer assinar contrato de 12 meses. Como flexibilizo sem perder o negócio?',
        timestamp: '09:20',
      },
      {
        id: 'm-msg-6',
        sender: 'agent',
        text: 'Ofereça o modelo trimestral renovável com bônus de 15% de desconto caso ele converta para anual ao fim do 3º mês.',
        timestamp: '09:22',
        isPlan: true,
        planTitle: 'Plano Comercial: FarmaMais • Flexibilidade Progressiva',
        objectionTag: 'Prazo de Contrato',
        tactics: [
          'Quebra da trava de 12 meses',
          'Incentivo de conversão futura',
          'Preservação do relacionamento de longo prazo',
        ],
      },
    ],
  },
];

export const MOCK_SESSIONS_CARLOS: ConversationSession[] = [
  {
    id: 'sess-c1',
    date: '2026-09-02',
    dateLabel: '02 de Setembro de 2026',
    time: '11:10',
    title: 'Comercial Santana • Primeira abordagem',
    objection: 'Preço & Orçamento',
    clientContext: 'Pequena distribuidora buscando modernização.',
    plansGenerated: 1,
    messages: [
      {
        id: 'c-msg-1',
        sender: 'user',
        text: 'Ceruti, como apresento a proposta inicial para um cliente que nunca usou IA antes e tem medo de custos altos?',
        timestamp: '11:10',
      },
      {
        id: 'c-msg-2',
        sender: 'agent',
        text: 'Apresente como um assistente de vendas dedicado que custa menos que um almoço por dia por vendedor, com teste assistido.',
        timestamp: '11:12',
        isPlan: true,
        planTitle: 'Roteiro de Sensibilização: Comercial Santana',
        objectionTag: 'Preço & Orçamento',
        tactics: [
          'Analogia de custo diário acessível',
          'Desmistificação de complexidade técnica',
          'Demonstração prática em 5 minutos',
        ],
      },
    ],
  },
];

// Gerador de dados de linha do tempo dos últimos 30 dias para análise gráfica precisa
export function generateUsageTimeline(baseInteractions: number, basePlans: number): UsagePoint[] {
  const result: UsagePoint[] = [];
  const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const today = new Date(2026, 8, 4); // 04/Set/2026

  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);

    const dayName = daysOfWeek[d.getDay()];
    const isWeekend = d.getDay() === 0 || d.getDay() === 6;
    
    // Variações realistas com picos em dias úteis
    const multiplier = isWeekend ? 0.2 : 0.8 + ((i % 5) * 0.15);
    const dayInteractions = Math.max(0, Math.round((baseInteractions / 25) * multiplier));
    const dayPlans = Math.max(0, Math.round((basePlans / 25) * multiplier));

    const dayStr = String(d.getDate()).padStart(2, '0');
    const monthStr = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'][d.getMonth()];
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');

    // Horários ativos simulados
    const activeHours: string[] = [];
    if (dayInteractions > 0) {
      activeHours.push('09:20', '11:45');
    }
    if (dayInteractions > 3) {
      activeHours.push('14:30', '16:15');
    }
    if (dayInteractions > 6) {
      activeHours.push('17:50', '18:40');
    }

    result.push({
      date: `${yyyy}-${mm}-${dayStr}`,
      label: `${dayStr}/${monthStr}`,
      dayOfWeek: dayName,
      interactionsCount: dayInteractions,
      plansCount: dayPlans,
      activeHours,
    });
  }

  return result;
}

export function enrichSalespersonWithMonitoring(person: Salesperson): Salesperson {
  if (person.id === '1') {
    return {
      ...person,
      totalPlansGenerated: 142,
      plansGeneratedMonth: 82,
      plansGrowthRate: 24,
      conversionRate: 78,
      objections: MOCK_OBJECTIONS_JOAO,
      usageTimeline: generateUsageTimeline(145, 82),
      sessions: MOCK_SESSIONS_JOAO,
    };
  }

  if (person.id === '2') {
    return {
      ...person,
      totalPlansGenerated: 98,
      plansGeneratedMonth: 66,
      plansGrowthRate: 18,
      conversionRate: 81,
      objections: MOCK_OBJECTIONS_MARIA,
      usageTimeline: generateUsageTimeline(89, 66),
      sessions: MOCK_SESSIONS_MARIA,
    };
  }

  if (person.id === '3') {
    return {
      ...person,
      totalPlansGenerated: 15,
      plansGeneratedMonth: 8,
      plansGrowthRate: 5,
      conversionRate: 62,
      objections: MOCK_OBJECTIONS_CARLOS,
      usageTimeline: generateUsageTimeline(22, 8),
      sessions: MOCK_SESSIONS_CARLOS,
    };
  }

  // Fallback para novo vendedor adicionado dinamicamente
  return {
    ...person,
    totalPlansGenerated: person.plansGeneratedMonth || 10,
    plansGeneratedMonth: person.plansGeneratedMonth || 10,
    plansGrowthRate: 10,
    conversionRate: 70,
    objections: MOCK_OBJECTIONS_CARLOS,
    usageTimeline: generateUsageTimeline(30, 10),
    sessions: [
      {
        id: `sess-custom-${person.id}`,
        date: '2026-09-04',
        dateLabel: 'Hoje, 04 de Setembro',
        time: '10:00',
        title: 'Atendimento inicial com suporte do Agente',
        objection: 'Preço & Orçamento',
        clientContext: 'Contato recém iniciado para apresentação da proposta.',
        plansGenerated: 1,
        messages: [
          {
            id: 'm1',
            sender: 'user',
            text: 'Olá Ceruti, gostaria de dicas para iniciar a abordagem com clientes da minha carteira.',
            timestamp: '10:00',
          },
          {
            id: 'm2',
            sender: 'agent',
            text: 'Olá! Recomendo começar mapeando os desafios atuais do cliente antes de falar de preço. Faça perguntas abertas sobre volume e perdas operacionais.',
            timestamp: '10:02',
            isPlan: true,
            planTitle: 'Roteiro de Descoberta Consultiva',
            objectionTag: 'Qualificação Inicial',
            tactics: ['Perguntas abertas de dor', 'Mapeamento de decisores', 'Definição de próximos passos'],
          },
        ],
      },
    ],
  };
}
