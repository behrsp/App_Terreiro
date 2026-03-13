import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Sidebar from "@/components/Sidebar";

export default async function PainelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Cast das variaveis customizadas feitas no token/session
  const user = session.user as any;

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar Lateral baseada no perfil */}
      <Sidebar userPerfil={user.perfil} isCapitao={user.isCapitao} />
      
      {/* Container Principal */}
      <main className="flex-1 overflow-y-auto">
        {/* Topbar genérica (opcional) */}
        <header className="sticky top-0 z-10 p-4 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md flex items-center justify-between md:justify-end">
          <div className="md:hidden invisible">Spacer</div> {/* Apenas para empurrar os items no mobile onde tem o botão do menu */}
          <div className="flex items-center gap-4 pr-12 md:pr-4">
            <span className="text-sm font-medium text-slate-300">
              Olá, <strong className="text-brand-400">{user.name}</strong>
            </span>
            <div className="w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-xs uppercase">
              {user.name?.[0]}
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
