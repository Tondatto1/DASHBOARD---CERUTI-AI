import React, { useState } from "react";
import { Lock, Mail } from "lucide-react";
import { motion } from "motion/react";
import GradientWaves from "./GradientWaves";
import { Logo } from "./Logo";

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      onLogin(); // Simulate successful login for any input
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-[#03170d] to-slate-950 py-12 px-4 sm:px-6 lg:px-8 text-slate-800 font-sans relative overflow-hidden">
      {/* Background Interativo 3D Gradient Waves com Paleta do Dashboard Ceruti */}
      <div className="absolute inset-0 w-full h-full z-0 pointer-events-auto">
        <GradientWaves
          horizonColor="#022013"
          waveColor="#00a83e"
          crestColor="#d1fae5"
          speed={0.35}
          amplitude={2.5}
          waveScale={0.6}
          waveRatio={0.9}
          swell={35}
          turbulence={20}
          tilt={1.11}
          zoom={1.0}
          height={5.5}
          fogDepth={15}
          detail="medium"
          brightness={1.0}
          opacity={1.0}
          mouseInteraction={true}
          parallaxStrength={0.5}
          grain={true}
          grainIntensity={0.04}
        />
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full relative z-10 space-y-8 bg-white/95 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-2xl border border-emerald-500/20 ring-1 ring-white/20"
      >
        <div className="text-center">
          <div className="mx-auto h-24 w-24 flex items-center justify-center mb-4 drop-shadow-md">
            <Logo className="w-full h-full" />
          </div>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
            Ceruti
          </h2>
          <p className="mt-2 text-sm text-slate-500 font-medium">
            Acesse para gerenciar sua equipe
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="email-address"
                className="block text-sm font-semibold text-slate-700 mb-1.5"
              >
                Endereço de E-mail
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 hover:border-emerald-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#00a83e] focus:border-transparent transition-all duration-200"
                  placeholder="seu@email.com"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-slate-700 mb-1.5"
              >
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 hover:border-emerald-300 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#00a83e] focus:border-transparent transition-all duration-200"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 rounded-xl text-white bg-[#00a83e] text-sm font-semibold shadow-md shadow-emerald-500/20 hover:bg-emerald-700 hover:shadow-lg hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#00a83e] transition-all duration-200 active:scale-95"
            >
              Entrar no Dashboard
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
