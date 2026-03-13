"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { 
  LayoutDashboard, 
  CalendarDays, 
  Music, 
  Users, 
  MessageSquare,
  LogOut,
  Menu,
  X
} from "lucide-react";

interface SidebarProps {
  userPerfil: string;
  isCapitao: boolean;
}

export default function Sidebar({ userPerfil, isCapitao }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(false);

  const getMenuLinks = () => {
    const links = [
      { name: "Início", href: "/painel", icon: LayoutDashboard },
    ];

    if (userPerfil === "dirigente") {
      links.push(
        { name: "Calendários", href: "/painel/calendarios", icon: CalendarDays },
        { name: "Aprovar Consultas", href: "/painel/consultas", icon: Users },
        { name: "Aprovar Pontos", href: "/painel/aprovar-pontos", icon: Music },
        { name: "Membros", href: "/painel/membros", icon: Users },
        { name: "Reclamações", href: "/painel/reclamacoes", icon: MessageSquare }
      );
    }

    if (userPerfil === "oga") {
      links.push(
        { name: "Eventos", href: "/painel/calendarios", icon: CalendarDays },
        { name: "Cadastrar Pontos", href: "/painel/pontos", icon: Music },
        { name: "Pedidos de Pontos", href: "/painel/aprovar-pontos", icon: Music }
      );
    }

    if (userPerfil === "corrente") {
      links.push(
        { name: "Solicitar Consulta", href: "/painel/solicitar-consulta", icon: MessageSquare },
        { name: "Solicitar Ponto", href: "/painel/solicitar-ponto", icon: Music },
        { name: "Pontos Casa", href: "/painel/pontos", icon: Music }
      );
      if (isCapitao) {
        links.push({ name: "Painel Capitão", href: "/painel/capitao", icon: Users });
      }
    }

    return links;
  };

  const navLinks = getMenuLinks();

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 right-4 z-50 p-2 bg-slate-800 rounded-lg text-white"
      >
        {isOpen ? <X /> : <Menu />}
      </button>

      {/* Sidebar Overlay for Mobile */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <aside className={`fixed md:sticky top-0 left-0 w-64 h-screen bg-slate-900 border-r border-slate-800 flex flex-col transition-transform duration-300 z-40 ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6 border-b border-slate-800 flex flex-col items-center text-center">
          {/* Espaço reservado para a Logo do Terreiro na Sidebar */}
          <div className="w-20 h-20 bg-slate-900 rounded-full border border-slate-700 flex items-center justify-center mb-4 overflow-hidden relative shadow-lg">
             <img src="/logo.png" alt="Terreiro Pai Congo" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
          </div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-brand-500 to-purple-400 bg-clip-text text-transparent">
            Terreiro Portal
          </h2>
          <p className="text-xs text-slate-500 mt-1 capitalize">{userPerfil} {isCapitao && "- Capitão"}</p>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            
            return (
              <Link 
                key={link.href} 
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                  isActive 
                    ? "bg-brand-500/10 text-brand-400" 
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium text-rose-400 hover:bg-rose-500/10 w-full text-left"
          >
            <LogOut className="w-5 h-5" />
            Sair do Sistema
          </button>
        </div>
      </aside>
    </>
  );
}
