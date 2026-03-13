import Link from 'next/link';
import { Shield, Users, BookOpen, AlertCircle } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="z-10 w-full max-w-4xl text-center space-y-6 flex flex-col items-center">
        <div className="w-32 h-32 bg-slate-900 rounded-full border border-slate-700 flex items-center justify-center mb-2 overflow-hidden relative shadow-2xl">
           <img src="/logo.png" alt="Terreiro Pai Congo" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-brand-500 to-purple-400 bg-clip-text text-transparent pb-2">
          T.P.C.
        </h1>
        <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          Sistema do Terreiro Pai Congo
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-12 w-full max-w-5xl mx-auto pt-8">
          <Link href="/login" className="glass-panel p-6 flex flex-col items-center gap-4 hover:-translate-y-1 transition-transform group">
            <div className="w-16 h-16 rounded-full bg-brand-500/10 flex items-center justify-center group-hover:bg-brand-500/20 transition-colors">
              <Shield className="w-8 h-8 text-brand-500" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg">Dirigentes / Ogãs</h3>
              <p className="text-sm text-slate-400 mt-1">Acesso administrativo</p>
            </div>
          </Link>

          <Link href="/login" className="glass-panel p-6 flex flex-col items-center gap-4 hover:-translate-y-1 transition-transform group">
            <div className="w-16 h-16 rounded-full bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
              <Users className="w-8 h-8 text-purple-400" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg">Corrente</h3>
              <p className="text-sm text-slate-400 mt-1">Acesso para membros da casa</p>
            </div>
          </Link>

          <Link href="/assistencia" className="glass-panel p-6 flex flex-col items-center gap-4 hover:-translate-y-1 transition-transform group">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
              <BookOpen className="w-8 h-8 text-emerald-400" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg">Assistência</h3>
              <p className="text-sm text-slate-400 mt-1">Agendar consultas (público)</p>
            </div>
          </Link>

          <Link href="/reclamacoes" className="glass-panel p-6 flex flex-col items-center gap-4 hover:-translate-y-1 transition-transform group">
            <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center group-hover:bg-rose-500/20 transition-colors">
              <AlertCircle className="w-8 h-8 text-rose-400" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-lg">Ouvidoria</h3>
              <p className="text-sm text-slate-400 mt-1">Caixa de sugestões e reclamações</p>
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
}
