"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, CheckCircle2, AlertCircle, BookOpen } from "lucide-react";

export default function AssistenciaPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    nome: "",
    celular: "",
    email: "",
    linhaSolicitada: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/assistencia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Ocorreu um erro ao agendar a consulta.");
      } else {
        setSuccess(true);
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
          <h2 className="text-2xl font-bold text-white">Consulta Solicitada!</h2>
          <p className="text-slate-400">Seu pedido foi enviado para os Dirigentes da casa. Aguarde a confirmação ou compareça no dia da Gira solicitada.</p>
          <Link href="/" className="btn-secondary mt-6">
            Voltar para o Início
          </Link>
        </div>
      </div>
    );
  }

  const girasDisponiveis = [
    "Preto velhos",
    "Caboclos",
    "Baianos",
    "Boiadeiros",
    "Exus e Pombo Giras",
    "Malandros",
    "Marinheiros"
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative py-12">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-600/20 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="glass-panel w-full max-w-lg p-8 z-10">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto text-emerald-500 mb-4">
            <BookOpen className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Marcar Consulta</h1>
          <p className="text-slate-400 text-sm">Seja bem vindo(a)! Preencha os campos abaixo para solicitar o seu atendimento (Assistência).</p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/50 text-rose-400 p-4 rounded-lg flex items-start gap-3 mb-6">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Nome Completo</label>
            <input name="nome" type="text" className="input-field" required value={formData.nome} onChange={handleChange} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Celular com DDD (Obrigatório)</label>
            <input name="celular" type="tel" placeholder="(11) 99999-9999" className="input-field" required value={formData.celular} onChange={handleChange} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">E-mail (Opcional)</label>
            <input name="email" type="email" placeholder="seuemail@exemplo.com" className="input-field" value={formData.email} onChange={handleChange} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Com qual linha deseja atendimento?</label>
            <select name="linhaSolicitada" className="input-field appearance-none bg-slate-900 focus:bg-slate-800" required value={formData.linhaSolicitada} onChange={handleChange}>
              <option value="" disabled>Selecione a Linha da Gira</option>
              {girasDisponiveis.map((gira) => (
                <option key={gira} value={gira}>{gira}</option>
              ))}
            </select>
          </div>

          <button type="submit" disabled={loading} className="btn-primary mt-8">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Agendar Consulta"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-400">
          <Link href="/" className="text-slate-500 hover:text-slate-300 transition-colors inline-block font-medium">
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    </div>
  );
}
