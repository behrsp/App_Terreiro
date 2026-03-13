"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldAlert, Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [celular, setCelular] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        celular,
        senha,
      });

      if (res?.error) {
        setError("Celular ou senha inválidos. Verifique se digitou corretamente.");
      } else {
        router.push("/painel");
        router.refresh();
      }
    } catch (err) {
      setError("Ocorreu um erro ao tentar fazer login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="glass-panel w-full max-w-md p-8 z-10">
        <div className="text-center mb-8 flex flex-col items-center">
          <div className="w-24 h-24 bg-slate-900 rounded-full border border-slate-700 flex items-center justify-center mb-4 overflow-hidden relative shadow-lg">
             <img src="/logo.png" alt="Terreiro Pai Congo" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Entrar</h1>
          <p className="text-slate-400 text-sm">Insira suas credenciais para acessar a área restrita do Terreiro.</p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/50 text-rose-400 p-4 rounded-lg flex items-start gap-3 mb-6">
            <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Número de Celular</label>
            <input
              type="text"
              placeholder="Ex: 11999999999"
              className="input-field"
              value={celular}
              onChange={(e) => setCelular(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Senha</label>
            <input
              type="password"
              placeholder="••••••••"
              className="input-field"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary mt-4"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Fazer Login"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-400">
          <p>Membro da corrente e ainda não tem acesso?</p>
          <Link href="/cadastro" className="text-brand-500 hover:text-brand-400 font-medium transition-colors mt-1 inline-block">
            Criar minha conta
          </Link>
          <br /><br />
          <Link href="/" className="text-slate-500 hover:text-slate-300 transition-colors inline-block text-xs">
            Voltar para o início
          </Link>
        </div>
      </div>
    </div>
  );
}
