"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getConsultasAssistencia(statusFilter?: string) {
  try {
    const where = statusFilter && statusFilter !== "todas" ? { status: statusFilter } : {};

    const consultas = await prisma.consultaAssistencia.findMany({
      where,
      orderBy: { dataCadastro: "desc" },
      include: {
        avaliador: {
          select: { nome: true },
        },
      },
    });
    return { success: true, consultas };
  } catch (error) {
    return { success: false, error: "Erro ao buscar consultas da Assistência." };
  }
}

export async function atualizarStatusConsulta(consultaId: string, novoStatus: string, avaliadorId?: string) {
  try {
    await prisma.consultaAssistencia.update({
      where: { id: consultaId },
      data: { 
        status: novoStatus,
        avaliadorId: avaliadorId || null,
      },
    });
    revalidatePath("/painel/consultas");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Erro ao atualizar consulta." };
  }
}

// Para uso no painel do Capitão (Flegar Atendido / Não Atendido)
export async function getConsultasHoje(linhaFiltro?: string) {
  try {
    // Definir as margens do dia de hoje (00:00 às 23:59)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const where: any = {
      dataCadastro: {
        gte: today,
        lt: tomorrow,
      },
      // Geralmente capitães olham as consultas 'aprovadas' pela moderação
      status: { in: ['aprovada', 'atendida', 'nao_atendida'] }
    };
    
    if (linhaFiltro && linhaFiltro !== "todas") {
      where.linhaSolicitada = linhaFiltro;
    }

    const consultas = await prisma.consultaAssistencia.findMany({
      where,
      orderBy: { dataCadastro: "asc" },
    });
    return { success: true, consultas };
  } catch (error) {
    return { success: false, error: "Erro ao buscar consultas de hoje." };
  }
}
