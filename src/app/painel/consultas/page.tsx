"use client";

import { useState, useEffect } from "react";
import { getConsultasAssistencia, atualizarStatusConsulta } from "@/app/actions/consultas";
import { Loader2, Check, X, Filter, CalendarDays } from "lucide-react";
import { useSession } from "next-auth/react";

export default function ConsultasPage() {
  const { data: session } = useSession();
  const [consultas, setConsultas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("pendente");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchConsultas = async () => {
    setLoading(true);
    const res = await getConsultasAssistencia(filter);
    if (res.success) setConsultas(res.consultas || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchConsultas();
  }, [filter]);

  const handleUpdate = async (id: string, status: string) => {
    if (!session?.user?.id) return;
    setActionLoading(id);
    await atualizarStatusConsulta(id, status, session.user.id);
    await fetchConsultas();
    setActionLoading(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <CalendarDays className="text-emerald-500 w-6 h-6" />
            Gestão de Consultas
          </h1>
          <p className="text-slate-400 text-sm">Aprove ou rejeite solicitações feitas pela Assistência.</p>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-slate-400" />
          <select 
            className="input-field py-2 text-sm max-w-[200px]"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="todas">Todas</option>
            <option value="pendente">Pendentes</option>
            <option value="aprovada">Aprovadas</option>
            <option value="rejeitada">Rejeitadas</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full py-12 flex justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          </div>
        ) : consultas.length === 0 ? (
          <div className="col-span-full glass-panel p-8 text-center text-slate-400">
            Nenhuma consulta encontrada para este filtro.
          </div>
        ) : (
          consultas.map((c) => (
            <div key={c.id} className="glass-panel p-5 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg text-white">{c.nome}</h3>
                  <p className="text-sm text-slate-400">{c.celular}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  c.status === "pendente" ? "bg-amber-500/20 text-amber-400" :
                  c.status === "aprovada" ? "bg-emerald-500/20 text-emerald-400" :
                  "bg-rose-500/20 text-rose-400"
                }`}>
                  {c.status}
                </span>
              </div>
              
              <div className="bg-slate-900/50 p-3 rounded-lg text-sm border border-slate-700/50">
                <span className="text-slate-400 block mb-1">Linha Solicitada:</span>
                <span className="font-medium text-purple-400">{c.linhaSolicitada}</span>
              </div>

              {c.status === "pendente" && (
                <div className="flex gap-2 pt-2">
                  <button 
                    onClick={() => handleUpdate(c.id, "aprovada")}
                    disabled={actionLoading === c.id}
                    className="flex-1 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-600/50 py-2 rounded-lg transition-colors flex justify-center"
                  >
                    {actionLoading === c.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                  </button>
                  <button 
                    onClick={() => handleUpdate(c.id, "rejeitada")}
                    disabled={actionLoading === c.id}
                    className="flex-1 bg-rose-600/20 hover:bg-rose-600/40 text-rose-400 border border-rose-600/50 py-2 rounded-lg transition-colors flex justify-center"
                  >
                    {actionLoading === c.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <X className="w-5 h-5" />}
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
