"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    nome: "",
    celular: "",
    senha: "",
    giraPertencente: "",
    guiaResponsavel: "",
    isCapitao: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    // Em HTMLInputElement, checked existe se for checkbox
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/cadastro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Ocorreu um erro ao realizar o cadastro.");
      } else {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    } catch (err) {
      setError("Falha na conexão com o servidor. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 relative">
        <div className="glass-panel w-full max-w-md p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-500">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-white">Cadastro Realizado!</h2>
          <p className="text-slate-400">Sua conta foi criada com sucesso. Redirecionando para as opções de login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative py-12">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-600/20 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="glass-panel w-full max-w-lg p-8 z-10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Cadastre-se</h1>
          <p className="text-slate-400 text-sm">Registre-se como membro da corrente da nossa casa.</p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/50 text-rose-400 p-4 rounded-lg flex items-start gap-3 mb-6">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Nome Completo (ou de Santo)</label>
            <input name="nome" type="text" className="input-field" required value={formData.nome} onChange={handleChange} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Celular com DDD</label>
              <input name="celular" type="tel" placeholder="(11) 99999-9999" className="input-field" required value={formData.celular} onChange={handleChange} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1.5">Senha de Login</label>
              <input name="senha" type="password" className="input-field" required value={formData.senha} onChange={handleChange} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">De qual gira você é?</label>
            <input name="giraPertencente" type="text" placeholder="Ex: Sábado à tarde..." className="input-field" required value={formData.giraPertencente} onChange={handleChange} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Guia Responsável</label>
            <select name="guiaResponsavel" className="input-field appearance-none bg-slate-900 focus:bg-slate-800" required value={formData.guiaResponsavel} onChange={handleChange}>
              <option value="" disabled>Selecione um Guia</option>
              <option value="Pai Érick">Pai Érick</option>
              <option value="Pai Fábio">Pai Fábio</option>
              <option value="Pai Rafael">Pai Rafael</option>
              <option value="Mãe Ju">Mãe Ju</option>
              <option value="Mãe Izabel">Mãe Izabel</option>
            </select>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input 
              name="isCapitao" 
              type="checkbox" 
              id="isCapitao" 
              className="w-5 h-5 rounded border-slate-700 bg-slate-900 text-brand-500 focus:ring-brand-500 focus:ring-offset-slate-900 cursor-pointer"
              checked={formData.isCapitao} 
              onChange={handleChange}
            />
            <label htmlFor="isCapitao" className="text-sm font-medium text-slate-300 cursor-pointer select-none">
              Sou Capitão / Capitã da Gira
            </label>
          </div>

          <button type="submit" disabled={loading} className="btn-primary mt-6">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Criar minha conta"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-400">
          <p>Já possui cadastro ou é dirigente/ogã?</p>
          <Link href="/login" className="text-brand-500 hover:text-brand-400 font-medium transition-colors mt-1 inline-block">
            Entrar agora
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
