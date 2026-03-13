"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

// Eventos da Casa
export async function criarEventoCasa(data: { titulo: string, descricao: string, dataEvento: Date }) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Não autorizado" };

  try {
    const dataAjustada = new Date(data.dataEvento);
    
    await prisma.evento.create({
      data: {
        titulo: data.titulo,
        descricao: data.descricao,
        dataEvento: dataAjustada,
        criadoPorId: session.user.id,
      },
    });
    revalidatePath("/painel/calendarios");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Erro ao criar evento." };
  }
}

export async function getEventosCasa() {
  try {
    const eventos = await prisma.evento.findMany({
      orderBy: { dataEvento: "asc" },
      where: {
        dataEvento: {
          gte: new Date(new Date().setHours(0,0,0,0)) // Apenas eventos futuros ou de hoje
        }
      },
      include: {
        criadoPor: { select: { nome: true } },
      },
      take: 20
    });
    return { success: true, eventos };
  } catch (error) {
    return { success: false, error: "Erro ao buscar eventos." };
  }
}

// Calendários Gira / Limpeza
export async function criarCalendario(data: { tipo: string, descricao: string, dataEvento: Date }) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Não autorizado" };

  try {
    const dataAjustada = new Date(data.dataEvento);

    await prisma.calendario.create({
      data: {
        tipo: data.tipo,
        descricao: data.descricao,
        dataEvento: dataAjustada,
        criadoPorId: session.user.id,
      },
    });
    revalidatePath("/painel/calendarios");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Erro ao criar calendário." };
  }
}

export async function getCalendario() {
  try {
    const calendarios = await prisma.calendario.findMany({
      orderBy: { dataEvento: "asc" },
      where: {
        dataEvento: {
          gte: new Date(new Date().setHours(0,0,0,0))
        }
      },
      take: 20
    });
    return { success: true, calendarios };
  } catch (error) {
    return { success: false, error: "Erro ao buscar calendários." };
  }
}

export async function deletarCalendarioRegistro(id: string, isEvento: boolean) {
  try {
    if (isEvento) {
      await prisma.evento.delete({ where: { id } });
    } else {
       await prisma.calendario.delete({ where: { id } });
    }
    revalidatePath("/painel/calendarios");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Erro ao deletar registro." };
  }
}
