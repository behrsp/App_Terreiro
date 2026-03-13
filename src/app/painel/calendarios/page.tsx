"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getCalendario, criarCalendario, getEventosCasa, criarEventoCasa, deletarCalendarioRegistro } from "@/app/actions/calendarios";
import { CalendarDays, Star, Trash2, Plus, Loader2 } from "lucide-react";

export default function CalendariosPage() {
  const { data: session } = useSession();
  const user = session?.user as any;
  const isDirigente = user?.perfil === "dirigente";
  const canPostEvents = user?.perfil === "oga" || isDirigente;

  const [calendarios, setCalendarios] = useState<any[]>([]);
  const [eventos, setEventos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"gira" | "limpeza" | "evento">("gira");
  const [saving, setSaving] = useState(false);
  
  // Form State
  const [form, setForm] = useState({ titulo: "", descricao: "", dataEvento: "" });

  const fetchData = async () => {
    setLoading(true);
    const [resCal, resEv] = await Promise.all([getCalendario(), getEventosCasa()]);
    if (resCal.success) setCalendarios(resCal.calendarios || []);
    if (resEv.success) setEventos(resEv.eventos || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Assegura que a data salva esteja no horário de meio dia para evitar fuso de virar meia noite
    const dt = new Date(form.dataEvento);
    dt.setHours(12, 0, 0, 0);

    let success = false;
    if (modalType === "evento") {
       const res = await criarEventoCasa({ titulo: form.titulo, descricao: form.descricao, dataEvento: dt });
       success = res.success;
    } else {
       const res = await criarCalendario({ tipo: modalType, descricao: form.descricao, dataEvento: dt });
       success = res.success;
    }

    if (success) {
      setShowModal(false);
      setForm({ titulo: "", descricao: "", dataEvento: "" });
      fetchData();
    } else {
      alert("Erro ao salvar.");
    }
    setSaving(false);
  };

  const handleDelete = async (id: string, isEvento: boolean) => {
    if(confirm("Tem certeza que deseja apagar?")) {
      await deletarCalendarioRegistro(id, isEvento);
      fetchData();
    }
  }

  function renderDateItem(item: any, isEvento: boolean) {
     const dt = new Date(item.dataEvento);
     const day = dt.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
     const weekday = dt.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');

     return (
       <div key={item.id} className="flex gap-4 items-start p-4 hover:bg-slate-800/30 rounded-xl transition-colors group border border-transparent hover:border-slate-700/50">
          <div className="flex flex-col items-center justify-center p-2 bg-slate-800 rounded-lg min-w-[60px] border border-slate-700">
             <span className="text-xl font-bold font-mono text-white">{day.split('/')[0]}</span>
             <span className="text-xs text-slate-400 capitalize">{weekday}</span>
          </div>
          <div className="flex-1">
             <h4 className={`font-semibold text-lg ${isEvento ? 'text-amber-400' : item.tipo === 'gira' ? 'text-brand-400' : 'text-emerald-400'}`}>
               {isEvento ? item.titulo : item.tipo === 'gira' ? 'Gira de Atendimento' : 'Limpeza / Manutenção'}
             </h4>
             <p className="text-slate-300 text-sm mt-1">{item.descricao}</p>
             {isEvento && <p className="text-xs text-slate-500 mt-2">Por: {item.criadoPor?.nome}</p>}
          </div>
          {isDirigente && (
            <button onClick={() => handleDelete(item.id, isEvento)} className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-rose-400 transition-all rounded hover:bg-rose-500/10 shrink-0">
               <Trash2 className="w-4 h-4" />
            </button>
          )}
       </div>
     );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <CalendarDays className="text-brand-500 w-6 h-6" /> Calendário da Casa
          </h1>
          <p className="text-slate-400 text-sm">Visualize as próximas giras, limpezas e eventos formativos.</p>
        </div>

        <div className="flex gap-2">
           {canPostEvents && (
             <button onClick={() => { setModalType("evento"); setShowModal(true); }} className="btn-secondary py-2 px-4 shadow shadow-amber-500/10 text-amber-400 hover:text-amber-300">
               <Star className="w-4 h-4" /> Novo Evento
             </button>
           )}
           {isDirigente && (
             <button onClick={() => { setModalType("gira"); setShowModal(true); }} className="btn-primary py-2 px-4">
               <Plus className="w-4 h-4" /> Marcar Dia
             </button>
           )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Lista de Giras e Limpezas */}
         <div className="glass-panel overflow-hidden">
            <div className="p-4 border-b border-slate-700/50 bg-slate-800/30">
               <h2 className="font-semibold text-white flex items-center gap-2">
                 <CalendarDays className="w-4 h-4 text-brand-500" /> Próximas Giras e Limpezas
               </h2>
            </div>
            <div className="p-2 space-y-1">
               {loading ? (
                 <div className="py-8"><Loader2 className="w-6 h-6 animate-spin mx-auto text-brand-500" /></div>
               ) : calendarios.length === 0 ? (
                 <div className="p-8 text-center text-slate-400">Nenhum agendamento futuro.</div>
               ) : calendarios.map(c => renderDateItem(c, false))}
            </div>
         </div>

         {/* Lista de Eventos */}
         <div className="glass-panel overflow-hidden">
            <div className="p-4 border-b border-slate-700/50 bg-slate-800/30">
               <h2 className="font-semibold text-white flex items-center gap-2">
                 <Star className="w-4 h-4 text-amber-500" /> Eventos, Festas e Aulas
               </h2>
            </div>
            <div className="p-2 space-y-1">
               {loading ? (
                 <div className="py-8"><Loader2 className="w-6 h-6 animate-spin mx-auto text-amber-500" /></div>
               ) : eventos.length === 0 ? (
                 <div className="p-8 text-center text-slate-400">Nenhum evento futuro.</div>
               ) : eventos.map(e => renderDateItem(e, true))}
            </div>
         </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-sm p-6">
            <h2 className="text-xl font-bold text-white mb-4">
              {modalType === "evento" ? "Adicionar Evento" : "Agendar Data Fixa"}
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              {modalType !== "evento" && (
                <div>
                   <label className="block text-sm text-slate-300 mb-1">O que haverá neste dia?</label>
                   <select className="input-field py-2" value={modalType} onChange={(e) => setModalType(e.target.value as any)}>
                     <option value="gira">Gira de Atendimento</option>
                     <option value="limpeza">Limpeza / Firmeza</option>
                   </select>
                </div>
              )}
              {modalType === "evento" && (
                <div>
                  <label className="block text-sm text-slate-300 mb-1">Título do Evento</label>
                  <input required type="text" className="input-field py-2" value={form.titulo} onChange={(e) => setForm({...form, titulo: e.target.value})} placeholder="Ex: Roda de Samba, Aula de Atabaque..." />
                </div>
              )}
              <div>
                <label className="block text-sm text-slate-300 mb-1">Data</label>
                <input required type="date" className="input-field py-2 [&::-webkit-calendar-picker-indicator]:invert" value={form.dataEvento} onChange={(e) => setForm({...form, dataEvento: e.target.value})} min={new Date().toISOString().split('T')[0]} />
              </div>
              <div>
                 <label className="block text-sm text-slate-300 mb-1">Breve Descrição / Horário</label>
                 <textarea required className="input-field min-h-[80px]" value={form.descricao} onChange={(e) => setForm({...form, descricao: e.target.value})} placeholder="Ex: Início às 19h com a linha de Exu..." />
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-700">
                 <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1 py-2">Cancelar</button>
                 <button type="submit" disabled={saving} className={`flex-1 py-2 ${modalType === 'evento' ? 'btn-primary bg-amber-600 hover:bg-amber-500 ring-amber-500' : 'btn-primary'}`}>
                   {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Agendar"}
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
