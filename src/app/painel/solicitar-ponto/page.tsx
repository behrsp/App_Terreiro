"use client";

import { useState } from "react";
import { solicitarPontoCorrente } from "@/app/actions/pontos";
import { Loader2, Music, CheckCircle2 } from "lucide-react";

export default function SolicitarPontoPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const [form, setForm] = useState({
    nomePonto: "",
    linha: "Direita",
    letra: "",
    linkYoutube: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const res = await solicitarPontoCorrente(form);
    if (res.success) {
      setSuccess(true);
      setForm({ nomePonto: "", linha: "Direita", letra: "", linkYoutube: "" });
    } else {
      alert("Houve um erro ao enviar sua sugestão. Tente novamente.");
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center glass-panel w-full max-w-2xl mx-auto mt-8">
        <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center text-purple-400 mb-6">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Solicitação Enviada!</h2>
        <p className="text-slate-400 max-w-md">
          Seu ponto foi encaminhado para os Ogãs da casa. Você receberá um aviso no WhatsApp (se aprovado).
        </p>
        <button onClick={() => setSuccess(false)} className="btn-secondary mt-8 max-w-xs">
          Enviar outro ponto
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Music className="text-purple-500 w-6 h-6" /> Solicitar Ponto
        </h1>
        <p className="text-slate-400 text-sm">Aprendeu um novo ponto e quer que os Ogãs cantem na próxima gira? Mande aqui!</p>
      </div>

      <div className="glass-panel p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Qual o nome do Ponto?</label>
            <input required type="text" className="input-field" value={form.nomePonto} onChange={(e) => setForm({...form, nomePonto: e.target.value})} />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Linha / Trabalha na Esquerda ou Direita?</label>
            <select className="input-field" value={form.linha} onChange={(e) => setForm({...form, linha: e.target.value})}>
              <option value="Direita">Toca na Direita</option>
              <option value="Esquerda">Toca na Esquerda</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Letra Completa</label>
            <textarea required className="input-field min-h-[150px]" value={form.letra} onChange={(e) => setForm({...form, letra: e.target.value})} placeholder="Escreva a letra completa para os ogãs aprenderem..." />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Link do YouTube (Opcional, mas ajuda muito!)</label>
            <input type="url" placeholder="https://youtube.com/..." className="input-field" value={form.linkYoutube} onChange={(e) => setForm({...form, linkYoutube: e.target.value})} />
          </div>

          <button type="submit" disabled={loading} className="btn-primary mt-4 bg-purple-600 hover:bg-purple-500 ring-purple-500">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Enviar Ponto para Análise"}
          </button>
        </form>
      </div>
    </div>
  );
}
