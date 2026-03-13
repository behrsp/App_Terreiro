"use client";

import { useState, useEffect } from "react";
import { getSolicitacoesPontos, avaliarPonto } from "@/app/actions/pontos";
import { Loader2, Music, Check, X, AlertCircle } from "lucide-react";
import { useSession } from "next-auth/react";

export default function AprovarPontosPage() {
  const { data: session } = useSession();
  const [solicitacoes, setSolicitacoes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pendente");
  
  // Modal de Rejeição
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [motivo, setMotivo] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchSolicitacoes = async () => {
    setLoading(true);
    const res = await getSolicitacoesPontos(filter);
    if (res.success) setSolicitacoes(res.solicitacoes || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchSolicitacoes();
  }, [filter]);

  const handleAprovar = async (id: string, celular: string, nomeSolicitante: string) => {
    if (!session?.user?.name) return;
    setActionLoading(id);
    
    // 1. Atualiza no Banco
    await avaliarPonto(id, "aceito");
    
    // 2. Monta a Mensagem Dinâmica do Whatsapp
    const oganNome = session.user.name;
    const msg = `Olá ${nomeSolicitante}! O Ogã ${oganNome} aceitou seu pedido de ponto no Terreiro Portal. Ele será cantado na próxima gira! Axé!`;
    const whatsappLink = `https://wa.me/55${celular.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`;
    
    // 3. Abre API do Whatsapp numa nova aba e depois recarrega
    window.open(whatsappLink, "_blank");
    await fetchSolicitacoes();
    setActionLoading(null);
  };

  const handleRejeitar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingId || !session?.user?.name) return;
    
    setActionLoading(rejectingId);
    await avaliarPonto(rejectingId, "rejeitado", motivo);
    
    // Localizar solicitante para mandar msg no Whatsapp (opcional para rejeições)
    const req = solicitacoes.find(s => s.id === rejectingId);
    if (req) {
       const msg = `Olá ${req.solicitante.nome}. O Ogã ${session.user.name} não aceitou seu pedido de ponto. Motivo: ${motivo}`;
       const whatsappLink = `https://wa.me/55${req.solicitante.celular.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`;
       window.open(whatsappLink, "_blank");
    }

    setRejectingId(null);
    setMotivo("");
    await fetchSolicitacoes();
    setActionLoading(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Music className="text-purple-500 w-6 h-6" /> Aprovar Pontos
          </h1>
          <p className="text-slate-400 text-sm">Gerencie os pontos solicitados pela corrente e mande feedback no WhatsApp.</p>
        </div>

        <select 
          className="input-field py-2 text-sm max-w-[200px]"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="todas">Todas as Requisições</option>
          <option value="pendente">Pendentes</option>
          <option value="aceito">Aprovadas</option>
          <option value="rejeitado">Rejeitadas</option>
        </select>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-purple-500" /></div>
        ) : solicitacoes.length === 0 ? (
          <div className="col-span-full glass-panel p-8 text-center text-slate-400">Nenhuma solicitação encontrada no momento.</div>
        ) : (
          solicitacoes.map((s) => (
            <div key={s.id} className="glass-panel overflow-hidden border border-slate-700/50 flex flex-col">
              <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-white">{s.nomePonto}</h3>
                  <p className="text-xs text-slate-400">Solicitado por: <strong>{s.solicitante?.nome}</strong></p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-md font-medium border ${
                  s.status === "pendente" ? "bg-amber-950/30 border-amber-900/50 text-amber-400" :
                  s.status === "aceito" ? "bg-emerald-950/30 border-emerald-900/50 text-emerald-400" :
                  "bg-rose-950/30 border-rose-900/50 text-rose-400"
                }`}>
                  {s.status.toUpperCase()}
                </span>
              </div>
              
              <div className="p-4 bg-slate-800/20 text-sm text-slate-300 italic whitespace-pre-wrap">
                "{s.letra}"
              </div>

              {s.linkYoutube && (
                <div className="px-4 py-2 border-t border-b border-slate-800 bg-slate-900/30">
                  <a href={s.linkYoutube} target="_blank" rel="noopener noreferrer" className="text-xs text-red-400 hover:text-red-300 underline">Link do Vídeo no YouTube</a>
                </div>
              )}

              {s.status === "rejeitado" && s.motivoRejeicao && (
                <div className="p-4 bg-rose-500/10 border-t border-rose-500/20 flex gap-2">
                   <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                   <p className="text-xs text-rose-400"><strong>Motivo:</strong> {s.motivoRejeicao}</p>
                </div>
              )}

              {s.status === "pendente" && (
                <div className="flex p-4 gap-3 bg-slate-900/50 border-t border-slate-800">
                  <button 
                    onClick={() => handleAprovar(s.id, s.solicitante.celular, s.solicitante.nome)}
                    disabled={actionLoading === s.id}
                    className="flex-1 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-600/50 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    {actionLoading === s.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4" /> Aprovar e Avisar no Zap</>}
                  </button>
                  <button 
                    onClick={() => setRejectingId(s.id)}
                    disabled={actionLoading === s.id}
                    className="flex-1 bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-600/50 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <X className="w-4 h-4" /> Rejeitar
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal de Motivo da Rejeição */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-white mb-2 text-rose-400">Rejeitar Ponto</h2>
            <p className="text-sm text-slate-400 mb-4">Por favor, escreva de modo simples o motivo pela qual esse ponto não será cantado, para o membro ficar ciente. (O Whatsapp abrirá a seguir).</p>
            <form onSubmit={handleRejeitar} className="space-y-4">
              <textarea 
                required 
                className="input-field min-h-[100px]" 
                placeholder="Ex: A letra está fora da base da nossa casa, ou não tocamos na linha de nagô esse tipo de ponto..."
                value={motivo} 
                onChange={(e) => setMotivo(e.target.value)} 
              />
              <div className="flex gap-3">
                <button type="button" onClick={() => { setRejectingId(null); setMotivo(""); }} className="btn-secondary flex-1 py-2">Cancelar</button>
                <button type="submit" disabled={actionLoading === rejectingId} className="btn-primary flex-1 py-2 bg-rose-600 hover:bg-rose-500 ring-rose-500">
                  {actionLoading === rejectingId ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirmar e Avisar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
