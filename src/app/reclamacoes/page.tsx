"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, CheckCircle2, AlertCircle, MessageSquareWarning } from "lucide-react";

export default function ReclamacoesPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [mensagem, setMensagem] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mensagem.trim()) return;
    
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/reclamacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mensagem }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Ocorreu um erro ao enviar sua mensagem.");
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
          <h2 className="text-2xl font-bold text-white">Mensagem Enviada!</h2>
          <p className="text-slate-400">Agradecemos sua comunicação. Ela foi enviada de forma anônima para a gestão da casa.</p>
          <Link href="/" className="btn-secondary mt-6">
            Voltar para o Início
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative py-12">
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-600/20 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="glass-panel w-full max-w-lg p-8 z-10">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-rose-500/20 rounded-full flex items-center justify-center mx-auto text-rose-500 mb-4">
            <MessageSquareWarning className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Ouvidoria</h1>
          <p className="text-slate-400 text-sm">Este espaço é totalmente anônimo. Use-o para sugestões construtivas ou relatar incômodos importantes da casa.</p>
        </div>

        {error && (
          <div className="bg-rose-500/10 border border-rose-500/50 text-rose-400 p-4 rounded-lg flex items-start gap-3 mb-6">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Sua Mensagem</label>
            <textarea
              className="input-field min-h-[150px] resize-y"
              placeholder="Escreva aqui tudo o que precisar. Ninguém saberá quem enviou..."
              required
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
            />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-rose-600 hover:bg-rose-500 text-white font-medium py-3 px-4 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-rose-500 flex justify-center items-center gap-2 mt-4 disabled:opacity-50">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Enviar de forma anônima"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-400">
          <Link href="/" className="text-slate-500 hover:text-slate-300 transition-colors inline-block font-medium">
            Cancelar e voltar
          </Link>
        </div>
      </div>
    </div>
  );
}
