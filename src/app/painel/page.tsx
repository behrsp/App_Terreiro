import { auth } from "@/auth";
import Link from "next/link";
import { Users, CalendarDays, Music } from "lucide-react";

export default async function PainelPage() {
  const session = await auth();
  const user = session?.user as any;

  return (
    <div className="space-y-6">
      <div className="glass-panel p-6 border-l-4 border-l-brand-500">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
          Bem-vindo(a) ao Portal do Terreiro
        </h1>
        <p className="text-slate-400 mt-2">
          {user?.perfil === "dirigente" && "Seu acesso de administrador geral está ativo."}
          {user?.perfil === "oga" && "Seu acesso musical (Ogã) está ativo."}
          {user?.perfil === "corrente" && "Área exclusiva para membros da corrente."}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {user?.perfil === "dirigente" && (
          <>
            <div className="glass-panel p-6 flex flex-col items-center justify-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-brand-500/20 text-brand-500 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg">Gerenciar Membros</h3>
              <p className="text-sm text-slate-400">Aprove/rejeite ou inative membros da casa.</p>
              <Link href="/painel/membros" className="btn-secondary mt-2 py-2">Acessar</Link>
            </div>
            <div className="glass-panel p-6 flex flex-col items-center justify-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center">
                <CalendarDays className="w-6 h-6" />
              </div>
              <h3 className="font-semibold text-lg">Consultas / Agendamentos</h3>
              <p className="text-sm text-slate-400">Coordene as assistências agendadas.</p>
              <Link href="/painel/consultas" className="btn-secondary mt-2 py-2">Acessar</Link>
            </div>
          </>
        )}
        
        {(user?.perfil === "oga" || user?.perfil === "corrente") && (
          <div className="glass-panel p-6 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Music className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg">Pontos da Casa</h3>
            <p className="text-sm text-slate-400">Acesse o acervo oficial de pontos.</p>
            <Link href="/painel/pontos" className="btn-secondary mt-2 py-2">Ver Acervo</Link>
          </div>
        )}
      </div>
    </div>
  );
}
