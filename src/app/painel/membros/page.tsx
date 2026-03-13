"use client";

import { useState, useEffect } from "react";
import { getMembros, updatePerfilMembro, deleteMembro } from "@/app/actions/membros";
import { Search, Edit, Trash2, ShieldAlert, Loader2, Check } from "lucide-react";

export default function MembrosPage() {
  const [membros, setMembros] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchMembros = async () => {
    setLoading(true);
    const res = await getMembros(search);
    if (res.success) setMembros(res.users || []);
    setLoading(false);
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchMembros();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [search]);

  const handleUpdate = async (id: string, perfil: string, isCapitao: boolean) => {
    setActionLoading(id);
    await updatePerfilMembro(id, perfil, isCapitao);
    await fetchMembros();
    setActionLoading(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Tem certeza que deseja inativar/remover este membro da base?")) {
      setActionLoading(id);
      await deleteMembro(id);
      await fetchMembros();
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestão de Membros</h1>
          <p className="text-slate-400 text-sm">Visualize, altere permissões e gerencie a corrente.</p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou celular..."
            className="input-field pl-9 py-2 text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="glass-panel overflow-hidden border border-slate-700/50">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="text-xs text-slate-400 bg-slate-800/80 uppercase">
              <tr>
                <th className="px-4 py-3">Nome / Celular</th>
                <th className="px-4 py-3">Gira & Guia</th>
                <th className="px-4 py-3">Perfil de Acesso</th>
                <th className="px-4 py-3">Capitão(ã)?</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-500" />
                  </td>
                </tr>
              ) : membros.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-slate-500">
                    Nenhum membro encontrado.
                  </td>
                </tr>
              ) : (
                membros.map((m) => (
                  <tr key={m.id} className="border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-white">{m.nome}</div>
                      <div className="text-xs text-slate-400">{m.celular}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div>{m.giraPertencente || "-"}</div>
                      <div className="text-xs text-slate-400">{m.guiaResponsavel || "-"}</div>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        className="bg-slate-900 border border-slate-700 rounded text-xs p-1 focus:ring-brand-500"
                        value={m.perfil}
                        onChange={(e) => handleUpdate(m.id, e.target.value, m.isCapitao)}
                        disabled={actionLoading === m.id}
                      >
                        <option value="corrente">Corrente</option>
                        <option value="oga">Ogã</option>
                        <option value="dirigente">Dirigente</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleUpdate(m.id, m.perfil, !m.isCapitao)}
                        disabled={actionLoading === m.id}
                        className={`w-6 h-6 rounded flex items-center justify-center border transition-colors ${
                          m.isCapitao 
                            ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" 
                            : "bg-slate-800 border-slate-600 text-transparent hover:border-slate-400"
                        }`}
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {actionLoading === m.id ? (
                        <Loader2 className="w-5 h-5 animate-spin inline text-slate-400" />
                      ) : (
                        <button
                          onClick={() => handleDelete(m.id)}
                          className="text-rose-400 hover:text-rose-300 p-1 rounded-md hover:bg-rose-500/10 transition-colors"
                          title="Remover Membro"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
