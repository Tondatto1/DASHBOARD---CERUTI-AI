import React, { useState } from "react";
import {
  CreditCard,
  CheckCircle2,
  Users,
  Plus,
  Minus,
  Sparkles,
  ShieldCheck,
  Zap,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";

interface PlansViewProps {
  currentCollaboratorCount?: number;
}

export function PlansView({
  currentCollaboratorCount = 5,
}: PlansViewProps) {
  // Estado do plano ativo e quantidade de colaboradores
  const [selectedPlanId, setSelectedPlanId] = useState<"mensal" | "semestral" | "anual">("anual");
  const [collaboratorsCount, setCollaboratorsCount] = useState<number>(currentCollaboratorCount);
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const showFeedback = (msg: string) => {
    setNotificationMsg(msg);
    setTimeout(() => setNotificationMsg(null), 3500);
  };

  // Preços unitários mensais por colaborador solicitados: Mensal 57, Semestral 47, Anual 37
  const planPrices = {
    mensal: 57,
    semestral: 47,
    anual: 37,
  };

  const currentPrice = planPrices[selectedPlanId];
  const totalMonthlyPrice = currentPrice * collaboratorsCount;

  const handleIncrement = () => {
    setCollaboratorsCount((prev) => prev + 1);
  };

  const handleDecrement = () => {
    if (collaboratorsCount > 1) {
      setCollaboratorsCount((prev) => prev - 1);
    }
  };

  const handleSaveCollaborators = () => {
    showFeedback(
      `Capacidade atualizada para ${collaboratorsCount} colaboradores no Plano ${
        selectedPlanId === "anual" ? "Anual" : selectedPlanId === "semestral" ? "Semestral" : "Mensal"
      } (Total: R$ ${totalMonthlyPrice}/mês)!`
    );
  };

  const handleSelectPlan = (planKey: "mensal" | "semestral" | "anual") => {
    setSelectedPlanId(planKey);
    const planNames = {
      mensal: "Mensal",
      semestral: "Semestral",
      anual: "Anual",
    };
    showFeedback(`Plano ${planNames[planKey]} selecionado com sucesso!`);
  };

  return (
    <div className="space-y-8 pb-12 font-sans">
      {/* Toast Notification */}
      {notificationMsg && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 text-sm font-semibold border border-slate-700"
        >
          <span className="w-2 h-2 rounded-full bg-[#00a83e]" />
          <span>{notificationMsg}</span>
        </motion.div>
      )}

      {/* Cabeçalho da Página */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 bg-emerald-100 text-[#00a83e] rounded-xl">
              <CreditCard className="w-5 h-5" />
            </span>
            <span className="text-xs font-bold tracking-wider text-emerald-800 uppercase bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
              Assinatura & Licenças
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 tracking-tight">
            Planos
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Gerencie sua assinatura, consulte o plano contratado e dimensione os acessos da sua equipe.
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60 self-start md:self-auto">
          <div className="flex items-center space-x-2 px-3.5 py-1.5 bg-white rounded-xl shadow-xs border border-slate-200">
            <ShieldCheck className="w-4 h-4 text-[#00a83e]" />
            <span className="text-xs font-bold text-slate-800">
              Ambiente Seguro Ceruti
            </span>
          </div>
        </div>
      </div>

      {/* Seção 1: 1 Card de Plano Atual Contratado + 1 Card de Aumentar Quantidade de Colaboradores */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* CARD 1: Plano Atual Contratado */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-6 bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-7 shadow-xl relative overflow-hidden flex flex-col justify-between"
        >
          {/* Luzes decorativas de fundo */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-emerald-600/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex items-center justify-between gap-2 mb-4">
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-xs font-extrabold tracking-wide uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                Plano Atual Contratado
              </span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-900/60 border border-emerald-700/50 px-2.5 py-1 rounded-lg">
                Ativo
              </span>
            </div>

            <div className="mt-2">
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                Plano {selectedPlanId === "anual" ? "Anual" : selectedPlanId === "semestral" ? "Semestral" : "Mensal"}
              </h3>
              <p className="text-xs text-slate-300 font-medium mt-1">
                Acesso completo ao CRM Agro, Monitoramento de Conversas e Gestão da Equipe Comercial.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 my-6 pt-4 border-t border-slate-700/60">
              <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/80">
                <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
                  Colaboradores Contratados
                </span>
                <span className="text-2xl font-black text-white mt-0.5 block">
                  {collaboratorsCount} <span className="text-xs font-medium text-slate-400">vagas</span>
                </span>
              </div>
              <div className="bg-slate-800/80 p-3.5 rounded-2xl border border-slate-700/80">
                <span className="text-[11px] font-bold text-slate-400 block uppercase tracking-wider">
                  Total Mensal Atual
                </span>
                <span className="text-2xl font-black text-emerald-400 mt-0.5 block">
                  R$ {totalMonthlyPrice} <span className="text-xs text-slate-400 font-normal">/mês</span>
                </span>
              </div>
            </div>

            <ul className="space-y-2 text-xs text-slate-200">
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Gestão ilimitada de produtores, lavouras e negócios</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Integração de WhatsApp com acompanhamento em tempo real</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Suporte prioritário Ceruti dedicado</span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400 relative z-10">
            <span>Renovação automática</span>
            <span className="text-emerald-400 font-semibold">Sem taxa de adesão</span>
          </div>
        </motion.div>

        {/* CARD 2: Aumentar Quantidade de Colaboradores */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-7 shadow-sm border border-slate-200/80 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 text-[#00a83e] flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">
                    Aumentar Colaboradores
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">
                    Expanda os acessos dentro do mesmo plano contratado
                  </p>
                </div>
              </div>

              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                Mesmo Plano Contratado
              </span>
            </div>

            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              Adicione mais vagas para seus consultores e vendedores. O valor por colaborador segue a taxa do seu plano contratado (<strong>R$ {currentPrice}/mês por vaga</strong>).
            </p>

            {/* Contador Interativo */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">
                  Quantidade de Colaboradores:
                </span>
                <span className="text-xs font-extrabold text-[#00a83e] bg-emerald-100/80 px-2.5 py-0.5 rounded-md">
                  R$ {currentPrice}/vaga
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={handleDecrement}
                  disabled={collaboratorsCount <= 1}
                  className="w-12 h-12 rounded-2xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs active:scale-95"
                  title="Diminuir vagas"
                >
                  <Minus className="w-5 h-5" />
                </button>

                <div className="flex-1 text-center bg-white py-2.5 px-4 rounded-2xl border border-slate-200 shadow-xs">
                  <span className="text-2xl font-black text-slate-900 block">
                    {collaboratorsCount}
                  </span>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    {collaboratorsCount === 1 ? "Colaborador" : "Colaboradores"}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleIncrement}
                  className="w-12 h-12 rounded-2xl bg-[#00a83e] hover:bg-emerald-700 text-white font-bold flex items-center justify-center transition-colors shadow-xs cursor-pointer active:scale-95"
                  title="Aumentar vagas"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              {/* Detalhamento do Cálculo */}
              <div className="pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <span className="text-slate-600 font-medium">
                  {collaboratorsCount} colaboradores × R$ {currentPrice}/mês
                </span>
                <span className="text-sm font-black text-slate-900">
                  Total R$ {totalMonthlyPrice} /mês
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={handleSaveCollaborators}
              className="w-full py-3.5 px-5 bg-[#00a83e] hover:bg-emerald-700 text-white font-bold text-sm rounded-2xl shadow-sm transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-[0.98]"
            >
              <Users className="w-4 h-4" />
              <span>Confirmar Quantidade de Colaboradores</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Seção 2: 3 Cards com 3 Planos (Mensal 57, Semestral 47, Anual 37) */}
      <div className="space-y-4 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              Tabela de Planos
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Selecione ou altere o plano que melhor atende às metas comerciais da sua equipe
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full self-start sm:self-auto">
            Valores por colaborador / mês
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Mensal (57) */}
          <motion.div
            whileHover={{ y: -4 }}
            className={`bg-white rounded-3xl p-6 border transition-all flex flex-col justify-between relative ${
              selectedPlanId === "mensal"
                ? "border-2 border-[#00a83e] shadow-lg ring-2 ring-emerald-100"
                : "border-slate-200/80 shadow-sm hover:border-slate-300"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-black text-slate-900">Mensal</h3>
                <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
                  Flexível
                </span>
              </div>

              <p className="text-xs text-slate-500 min-h-[32px] mb-4">
                Assinatura mensal sem fidelidade. Cancele ou altere a qualquer momento.
              </p>

              <div className="my-4 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <span className="text-3xl font-black text-slate-900">R$ 57</span>
                <span className="text-xs text-slate-500 font-medium block mt-0.5">
                  / mês por colaborador
                </span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-600 mb-6">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Acesso completo ao CRM Agro</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Monitoramento de conversas e visitas</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Faturamento mensal recorrente</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => handleSelectPlan("mensal")}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                selectedPlanId === "mensal"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-800"
              }`}
            >
              {selectedPlanId === "mensal" ? "Plano Selecionado" : "Escolher Mensal"}
            </button>
          </motion.div>

          {/* Card 2: Semestral (47) */}
          <motion.div
            whileHover={{ y: -4 }}
            className={`bg-white rounded-3xl p-6 border transition-all flex flex-col justify-between relative ${
              selectedPlanId === "semestral"
                ? "border-2 border-[#00a83e] shadow-lg ring-2 ring-emerald-100"
                : "border-slate-200/80 shadow-sm hover:border-slate-300"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-black text-slate-900">Semestral</h3>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-md">
                  Economia de ~17%
                </span>
              </div>

              <p className="text-xs text-slate-500 min-h-[32px] mb-4">
                Compromisso semestral com desconto garantido por vaga.
              </p>

              <div className="my-4 p-4 bg-emerald-50/60 rounded-2xl border border-emerald-100 text-center">
                <span className="text-3xl font-black text-slate-900">R$ 47</span>
                <span className="text-xs text-slate-600 font-medium block mt-0.5">
                  / mês por colaborador
                </span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-600 mb-6">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Todos os recursos do CRM & Equipe</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Suporte via WhatsApp prioritário</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Desconto semestral aplicado</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => handleSelectPlan("semestral")}
              className={`w-full py-3 px-4 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                selectedPlanId === "semestral"
                  ? "bg-[#00a83e] text-white shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-800"
              }`}
            >
              {selectedPlanId === "semestral" ? "Plano Selecionado" : "Escolher Semestral"}
            </button>
          </motion.div>

          {/* Card 3: Anual (37) */}
          <motion.div
            whileHover={{ y: -4 }}
            className={`bg-white rounded-3xl p-6 border transition-all flex flex-col justify-between relative ${
              selectedPlanId === "anual"
                ? "border-2 border-[#00a83e] shadow-xl ring-4 ring-emerald-100/80"
                : "border-slate-200/80 shadow-md hover:border-slate-300"
            }`}
          >
            {/* Tag Destaque */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00a83e] text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-xs flex items-center gap-1">
              <Zap className="w-3 h-3" />
              Melhor Custo-Benefício
            </div>

            <div className="pt-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-black text-slate-900">Anual</h3>
                <span className="text-[11px] font-extrabold text-white bg-emerald-700 px-2.5 py-0.5 rounded-md">
                  Economia de ~35%
                </span>
              </div>

              <p className="text-xs text-slate-500 min-h-[32px] mb-4">
                Maior economia para o seu agronegócio com compromisso anual.
              </p>

              <div className="my-4 p-4 bg-emerald-100/70 rounded-2xl border border-emerald-200 text-center">
                <span className="text-3xl font-black text-[#00a83e]">R$ 37</span>
                <span className="text-xs text-emerald-950 font-bold block mt-0.5">
                  / mês por colaborador
                </span>
              </div>

              <ul className="space-y-2.5 text-xs text-slate-700 mb-6 font-medium">
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Todos os módulos ilimitados</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Atendimento prioritário via WhatsApp</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Máxima economia por licença</span>
                </li>
              </ul>
            </div>

            <button
              type="button"
              onClick={() => handleSelectPlan("anual")}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs transition-all cursor-pointer shadow-xs ${
                selectedPlanId === "anual"
                  ? "bg-[#00a83e] hover:bg-emerald-700 text-white"
                  : "bg-slate-900 hover:bg-slate-800 text-white"
              }`}
            >
              {selectedPlanId === "anual" ? "Plano Selecionado" : "Escolher Anual"}
            </button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
