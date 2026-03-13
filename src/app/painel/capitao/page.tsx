"use client";

import { useState, useEffect } from "react";
import { getConsultasHoje, atualizarStatusConsulta } from "@/app/actions/consultas";
import { Loader2, UserCheck, UserX, Flag } from "lucide-react";

export default function CapitaoPage() {
  const [consultasHoje, setConsultasHoje] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterLinha, setFilterLinha] = useState("todas");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchHoje = async () => {
    setLoading(true);
    const res = await getConsultasHoje(filterLinha);
    if (res.success) setConsultasHoje(res.consultas || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchHoje();
  }, [filterLinha]);

  const handleStatus = async (id: string, status: string) => {
    if(!confirm(`Marcar como ${status.replace("_", " ")}?`)) return;
    setActionLoading(id);
    await atualizarStatusConsulta(id, status);
    await fetchHoje();
    setActionLoading(null);
  };

  const atendidas = consultasHoje.filter(c => c.status === "atendida").length;
  const naoAtendidas = consultasHoje.filter(c => c.status === "nao_atendida").length;
  const pendentesFila = consultasHoje.filter(c => c.status === "aprovada").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Flag className="text-brand-500 w-6 h-6" />
          Painel do Capitão
        </h1>
        <p className="text-slate-400 text-sm">Controle as consultas agendadas e aprovadas para o dia de hoje.</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="glass-panel p-4 text-center">
          <div className="text-2xl font-bold text-white">{pendentesFila}</div>
          <div className="text-xs text-slate-400">Na Fila</div>
        </div>
        <div className="glass-panel p-4 text-center">
          <div className="text-2xl font-bold text-emerald-400">{atendidas}</div>
          <div className="text-xs text-slate-400">Atendidos</div>
        </div>
        <div className="glass-panel p-4 text-center">
          <div className="text-2xl font-bold text-rose-400">{naoAtendidas}</div>
          <div className="text-xs text-slate-400">Faltas</div>
        </div>
      </div>

      <div className="glass-panel overflow-hidden border border-slate-700/50">
        <div className="p-4 border-b border-slate-700/50 bg-slate-800/30 flex justify-between items-center">
          <h2 className="font-semibold text-white">Fila de Hoje</h2>
          <select 
            className="input-field py-1 px-3 text-xs w-auto max-w-[150px]"
            value={filterLinha}
            onChange={(e) => setFilterLinha(e.target.value)}
          >
            <option value="todas">Todas Linhas</option>
            <option value="Preto velhos">Pretos Velhos</option>
            <option value="Caboclos">Caboclos</option>
            <option value="Exus e Pombo Giras">Exus e Pombo Giras</option>
            {/* Outras podem ser adicionadas... */}
          </select>
        </div>

        <div className="divide-y divide-slate-700/50">
          {loading ? (
             <div className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-500" /></div>
          ) : consultasHoje.length === 0 ? (
            <div className="p-8 text-center text-slate-400">Ninguém agendado para hoje.</div>
          ) : (
            consultasHoje.map((c) => (
              <div key={c.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-800/20">
                <div>
                  <h3 className="font-semibold text-white">{c.nome}</h3>
                  <div className="flex items-center gap-3 text-sm text-slate-400 mt-1">
                    <span>{c.celular}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                    <span className="text-purple-400">{c.linhaSolicitada}</span>
                  </div>
                </div>

                <div className="flex gap-2 shrink-0">
                  {c.status === "aprovada" ? (
                    <>
                      <button 
                        onClick={() => handleStatus(c.id, "atendida")}
                        disabled={actionLoading === c.id}
                        className="bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-600/50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 text-sm"
                      >
                         <UserCheck className="w-4 h-4" /> Atendido
                      </button>
                      <button 
                        onClick={() => handleStatus(c.id, "nao_atendida")}
                        disabled={actionLoading === c.id}
                        className="bg-rose-600/20 hover:bg-rose-600/40 text-rose-400 border border-rose-600/50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 text-sm"
                      >
                         <UserX className="w-4 h-4" /> Falta
                      </button>
                    </>
                  ) : (
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                      c.status === "atendida" ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                    }`}>
                      {c.status === "atendida" ? "Finalizado" : "Não Compareceu"}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
