"use client";

import { useState, useEffect } from "react";
import { getPontosAcervo, criarPontoOga } from "@/app/actions/pontos";
import { useSession } from "next-auth/react";
import { Search, Plus, Music, Loader2, Youtube, ExternalLink } from "lucide-react";

export default function AcervoPontosPage() {
  const { data: session } = useSession();
  const user = session?.user as any;
  const isOgaOrAdmin = user?.perfil === "oga" || user?.perfil === "dirigente";

  const [pontos, setPontos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterLinha, setFilterLinha] = useState("todas");
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ nomePonto: "", linha: "Direita", toque: "Ijexá", letra: "", linkYoutube: "" });

  const fetchPontos = async () => {
    setLoading(true);
    const res = await getPontosAcervo(search, filterLinha);
    if (res.success) setPontos(res.pontos || []);
    setLoading(false);
  };

  useEffect(() => {
    const delay = setTimeout(fetchPontos, 500);
    return () => clearTimeout(delay);
  }, [search, filterLinha]);

  const handleSavePonto = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await criarPontoOga(form);
    if (res.success) {
      setShowModal(false);
      setForm({ nomePonto: "", linha: "Direita", toque: "Ijexá", letra: "", linkYoutube: "" });
      fetchPontos();
    } else {
      alert("Falha ao salvar o ponto.");
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Music className="text-purple-500 w-6 h-6" /> Acervo Oficial de Pontos
          </h1>
          <p className="text-slate-400 text-sm">Biblioteca de pontos oficiais cadastrados pelos Ogãs da casa.</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Buscar ponto ou letra..."
            className="input-field py-2 text-sm w-full md:w-60"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select 
            className="input-field py-2 text-sm w-auto"
            value={filterLinha}
            onChange={(e) => setFilterLinha(e.target.value)}
          >
            <option value="todas">Linhas (Todas)</option>
            <option value="Direita">Linha de Direita</option>
            <option value="Esquerda">Linha de Esquerda</option>
          </select>

          {isOgaOrAdmin && (
            <button onClick={() => setShowModal(true)} className="btn-primary py-2 px-4 shadow-lg shadow-purple-500/20 bg-purple-600 hover:bg-purple-500 ring-purple-500 whitespace-nowrap">
              <Plus className="w-4 h-4" /> Novo Ponto Oficial
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-purple-500" /></div>
        ) : pontos.length === 0 ? (
          <div className="col-span-full glass-panel p-8 text-center text-slate-400">Nenhum ponto encontrado no acervo.</div>
        ) : (
          pontos.map((p) => (
            <div key={p.id} className="glass-panel overflow-hidden border border-slate-700/50 flex flex-col group">
              <div className="p-5 border-b border-slate-800 bg-slate-900/50">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-white group-hover:text-purple-400 transition-colors">{p.nomePonto}</h3>
                  <span className={`px-2 py-0.5 text-xs rounded-md border ${
                    p.linha === "Esquerda" ? "bg-rose-950/30 border-rose-900/50 text-rose-400" : "bg-emerald-950/30 border-emerald-900/50 text-emerald-400"
                  }`}>
                    {p.linha}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="bg-slate-800 px-2 py-1 rounded">🎵 Toque: {p.toque}</span>
                  <span>Por ogã {p.criadoPor?.nome}</span>
                </div>
              </div>

              <div className="p-5 flex-1 bg-slate-800/20">
                <pre className="font-sans text-sm text-slate-300 whitespace-pre-wrap italic">
                  "{p.letra}"
                </pre>
              </div>

              {p.linkYoutube && (
                <div className="p-3 bg-slate-900/80 border-t border-slate-800">
                  <a href={p.linkYoutube} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 text-sm text-red-400 hover:text-red-300 transition-colors py-2 rounded-lg hover:bg-red-500/10">
                    <Youtube className="w-5 h-5" /> Aprender no YouTube <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-lg p-6 animate-in fade-in zoom-in duration-200">
            <h2 className="text-xl font-bold text-white mb-4">Adicionar Ponto ao Acervo</h2>
            <form onSubmit={handleSavePonto} className="space-y-4">
              <div>
                <label className="block text-sm text-slate-300 mb-1">Nome do Ponto</label>
                <input required type="text" className="input-field py-2" value={form.nomePonto} onChange={(e) => setForm({...form, nomePonto: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Linha</label>
                  <select className="input-field py-2" value={form.linha} onChange={(e) => setForm({...form, linha: e.target.value})}>
                    <option value="Direita">Direita</option><option value="Esquerda">Esquerda</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Toque</label>
                  <select className="input-field py-2" value={form.toque} onChange={(e) => setForm({...form, toque: e.target.value})}>
                    <option value="Ijexá">Ijexá</option><option value="Nagô">Nagô</option>
                    <option value="Congo">Congo</option><option value="Samba">Samba de Caboclo</option>
                    <option value="Barra vento">Barra Vento</option>
                  </select>
                </div>
              </div>
              <div>
                 <label className="block text-sm text-slate-300 mb-1">Letra (Cole aqui)</label>
                 <textarea required className="input-field min-h-[100px]" value={form.letra} onChange={(e) => setForm({...form, letra: e.target.value})} />
              </div>
              <div>
                 <label className="block text-sm text-slate-300 mb-1">Link do YouTube (Opcional)</label>
                 <input type="url" placeholder="https://youtube.com/..." className="input-field py-2" value={form.linkYoutube} onChange={(e) => setForm({...form, linkYoutube: e.target.value})} />
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-700">
                 <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1 py-2">Cancelar</button>
                 <button type="submit" disabled={saving} className="btn-primary flex-1 py-2 bg-purple-600 hover:bg-purple-500 ring-purple-500">
                   {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Salvar Ponto Oficial"}
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
