import React, { useState, useRef, useEffect } from "react";
import {
  CreditCard,
  Users,
  Plus,
  Minus,
  Sparkles,
  Zap,
  ArrowRight,
  Info,
  ExternalLink,
} from "lucide-react";
import { motion } from "motion/react";
import { usePressAndHold } from "../hooks/usePressAndHold";

interface PlansViewProps {
  currentCollaboratorCount?: number;
}

export function PlansView({
  currentCollaboratorCount = 5,
}: PlansViewProps) {
  // Estado do plano ativo e quantidade de colaboradores
  const [selectedPlanId, setSelectedPlanId] = useState<"mensal" | "semestral" | "anual">("anual");
  const [collaboratorsCount, setCollaboratorsCount] = useState<number>(currentCollaboratorCount);
  const [inputValue, setInputValue] = useState<string>(String(currentCollaboratorCount));
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // Sincroniza o valor exibido no input sempre que a quantidade numérica mudar
  useEffect(() => {
    setInputValue(String(collaboratorsCount));
  }, [collaboratorsCount]);

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

  // Aceleração contínua ao manter pressionado o botão de diminuir (-)
  const decrementHold = usePressAndHold({
    onStep: (step) => {
      setCollaboratorsCount((prev) => Math.max(1, prev - step));
    },
    disabled: collaboratorsCount <= 1,
  });

  // Aceleração contínua ao manter pressionado o botão de aumentar (+)
  const incrementHold = usePressAndHold({
    onStep: (step) => {
      setCollaboratorsCount((prev) => Math.min(5000, prev + step));
    },
  });

  // Edição direta pelo campo de input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Permite apenas caracteres numéricos
    const clean = raw.replace(/\D/g, "");
    setInputValue(clean);

    if (clean !== "") {
      const num = parseInt(clean, 10);
      if (!isNaN(num) && num >= 1) {
        setCollaboratorsCount(Math.min(5000, num));
      }
    }
  };

  const handleInputBlur = () => {
    if (inputValue === "" || parseInt(inputValue, 10) < 1 || isNaN(parseInt(inputValue, 10))) {
      setCollaboratorsCount(1);
      setInputValue("1");
    } else {
      const num = Math.min(Math.max(1, parseInt(inputValue, 10)), 5000);
      setCollaboratorsCount(num);
      setInputValue(String(num));
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      (e.target as HTMLInputElement).blur();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCollaboratorsCount((prev) => Math.min(5000, prev + 1));
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setCollaboratorsCount((prev) => Math.max(1, prev - 1));
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
                </div>
              </div>

              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                Mesmo Plano Contratado
              </span>
            </div>

            {/* Informação Mais Importante em Destaque */}
            <div className="mb-6 p-4 rounded-2xl bg-amber-50/90 border border-amber-200/90 text-slate-800 flex items-start gap-3.5 shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                <Info className="w-4 h-4" />
              </div>
              <div className="text-xs leading-relaxed">
                <span className="inline-block text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-200/70 px-2 py-0.5 rounded-md mb-1.5">
                  Informação Importante
                </span>
                <p className="font-bold text-slate-900 text-xs sm:text-[13px] leading-snug">
                  Será cobrado apenas o período restante da assinatura referente aos colaboradores adicionados. Na renovação seguinte, será cobrado o valor integral correspondente a todos os colaboradores ativos.
                </p>
              </div>
            </div>

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

              <div className="flex items-center justify-between gap-3 sm:gap-4">
                <button
                  type="button"
                  {...decrementHold.buttonProps}
                  disabled={collaboratorsCount <= 1}
                  className="w-12 h-12 rounded-2xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-xs active:scale-95 select-none touch-manipulation"
                  title="Diminuir vagas (clique ou segure pressionado para acelerar)"
                >
                  <Minus className="w-5 h-5 pointer-events-none" />
                </button>

                {/* Input direto editável e com auto-seleção */}
                <div
                  onClick={() => inputRef.current?.focus()}
                  className="flex-1 text-center bg-white py-2 px-4 rounded-2xl border border-slate-200 hover:border-slate-300 focus-within:border-[#00a83e] focus-within:ring-2 focus-within:ring-emerald-500/20 shadow-xs transition-all flex flex-col items-center justify-center cursor-text group"
                  title="Clique para digitar o número diretamente"
                >
                  <div className="w-full flex items-center justify-center">
                    <input
                      ref={inputRef}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={inputValue}
                      onChange={handleInputChange}
                      onBlur={handleInputBlur}
                      onKeyDown={handleInputKeyDown}
                      onFocus={(e) => e.target.select()}
                      className="w-full text-center text-2xl sm:text-3xl font-black text-slate-900 bg-transparent border-0 focus:outline-none focus:ring-0 p-0 m-0 tracking-tight select-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none cursor-text"
                      aria-label="Quantidade de Colaboradores"
                    />
                  </div>
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mt-0.5 pointer-events-none select-none">
                    {collaboratorsCount === 1 ? "Colaborador" : "Colaboradores"}
                  </span>
                </div>

                <button
                  type="button"
                  {...incrementHold.buttonProps}
                  className="w-12 h-12 rounded-2xl bg-[#00a83e] hover:bg-emerald-700 text-white font-bold flex items-center justify-center transition-colors shadow-xs cursor-pointer active:scale-95 select-none touch-manipulation"
                  title="Aumentar vagas (clique ou segure pressionado para acelerar)"
                >
                  <Plus className="w-5 h-5 pointer-events-none" />
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
            className={`bg-white rounded-3xl p-6 sm:p-7 border-2 transition-all flex flex-col justify-between relative ${
              selectedPlanId === "mensal"
                ? "border-[#00a83e] shadow-xl ring-2 ring-emerald-100"
                : "border-slate-200/90 shadow-md hover:border-emerald-300"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-black text-slate-900">Mensal</h3>
                <span className="text-xs font-black text-emerald-800 bg-emerald-100 border border-emerald-300/80 px-2.5 py-1 rounded-lg">
                  60% OFF
                </span>
              </div>

              <p className="text-xs text-slate-500 min-h-[32px] mb-4 leading-relaxed">
                Assinatura mensal sem fidelidade. Cancele ou altere a qualquer momento.
              </p>

              <div className="my-4 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <span className="text-xs text-slate-400 font-semibold line-through">
                    De R$ 147,50
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-md">
                    Economize 60%
                  </span>
                </div>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900">R$ 57</span>
                </div>
                <span className="text-xs text-slate-500 font-semibold block mt-1">
                  / mês por colaborador
                </span>
              </div>
            </div>

            <a
              href="https://lp.ceruti.ia.br/checkout?agent=campo"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleSelectPlan("mensal")}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center space-x-2 cursor-pointer bg-slate-900 hover:bg-slate-800 text-white shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              <span>Escolher Mensal</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>

          {/* Card 2: Semestral (47) */}
          <motion.div
            whileHover={{ y: -4 }}
            className={`bg-white rounded-3xl p-6 sm:p-7 border-2 transition-all flex flex-col justify-between relative ${
              selectedPlanId === "semestral"
                ? "border-[#00a83e] shadow-xl ring-2 ring-emerald-100"
                : "border-slate-200/90 shadow-md hover:border-emerald-300"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-black text-slate-900">Semestral</h3>
                <span className="text-xs font-black text-emerald-900 bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-lg">
                  67% OFF
                </span>
              </div>

              <p className="text-xs text-slate-500 min-h-[32px] mb-4 leading-relaxed">
                Compromisso semestral com desconto garantido por vaga.
              </p>

              <div className="my-4 p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200 text-center">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <span className="text-xs text-slate-400 font-semibold line-through">
                    De R$ 147,50
                  </span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                    Economize 67%
                  </span>
                </div>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900">R$ 47</span>
                </div>
                <span className="text-xs text-emerald-900 font-semibold block mt-1">
                  / mês por colaborador
                </span>
              </div>
            </div>

            <a
              href="https://lp.ceruti.ia.br/checkout?agent=campo"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleSelectPlan("semestral")}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center space-x-2 cursor-pointer bg-emerald-700 hover:bg-emerald-800 text-white shadow-md hover:shadow-lg active:scale-[0.98]"
            >
              <span>Escolher Semestral</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>

          {/* Card 3: Anual (37) - Destaque Pulsando Slow */}
          <motion.div
            whileHover={{ y: -4 }}
            animate={{
              boxShadow: [
                "0 0 0 0px rgba(0, 168, 62, 0.45), 0 12px 30px -4px rgba(0, 168, 62, 0.2)",
                "0 0 0 10px rgba(0, 168, 62, 0.15), 0 24px 45px -4px rgba(0, 168, 62, 0.38)",
                "0 0 0 0px rgba(0, 168, 62, 0.45), 0 12px 30px -4px rgba(0, 168, 62, 0.2)",
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="bg-gradient-to-b from-emerald-50/50 via-white to-white rounded-3xl p-6 sm:p-7 border-2 border-[#00a83e] transition-all flex flex-col justify-between relative shadow-xl ring-2 ring-emerald-500/30"
          >
            {/* Tag Destaque - Melhor Custo-Benefício Bem Destacado */}
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-600 via-[#00a83e] to-emerald-500 text-white text-[11px] font-black uppercase tracking-wider px-4 py-1.5 rounded-full shadow-lg shadow-emerald-600/40 flex items-center gap-1.5 ring-2 ring-white z-20">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
              <span className="drop-shadow-xs">Melhor Custo-Benefício</span>
            </div>

            <div className="pt-2">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-black text-slate-900">Anual</h3>
                <span className="text-xs font-black text-white bg-emerald-600 px-3 py-1 rounded-lg shadow-xs">
                  74% OFF
                </span>
              </div>

              <p className="text-xs text-slate-600 min-h-[32px] mb-4 leading-relaxed font-medium">
                Maior economia para o seu agronegócio com compromisso anual.
              </p>

              <div className="my-4 p-4 bg-emerald-100/90 rounded-2xl border-2 border-emerald-300 text-center shadow-xs">
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <span className="text-xs text-slate-500 font-bold line-through">
                    De R$ 147,50
                  </span>
                  <span className="text-[10px] font-black text-emerald-950 bg-emerald-200/90 px-2 py-0.5 rounded-md">
                    Economize 74%
                  </span>
                </div>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-black text-[#00a83e] tracking-tight">R$ 37</span>
                </div>
                <span className="text-xs text-emerald-950 font-black block mt-1">
                  / mês por colaborador
                </span>
              </div>
            </div>

            <a
              href="https://lp.ceruti.ia.br/checkout?agent=campo"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => handleSelectPlan("anual")}
              className="w-full py-3.5 px-4 rounded-xl font-black text-xs transition-all flex items-center justify-center space-x-2 cursor-pointer bg-[#00a83e] hover:bg-emerald-700 hover:shadow-lg hover:shadow-emerald-500/30 text-white shadow-md active:scale-[0.98]"
            >
              <span>Escolher Anual</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
