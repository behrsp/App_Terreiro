"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

export async function criarPontoOga(data: { nomePonto: string, linha: string, toque: string, letra: string, linkYoutube?: string }) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Não autorizado" };

  try {
    await prisma.pontoOga.create({
      data: {
        ...data,
        criadoPorId: session.user.id,
      },
    });
    revalidatePath("/painel/pontos");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Erro ao criar ponto." };
  }
}

export async function getPontosAcervo(search?: string, linhaFilter?: string) {
  try {
    const where: any = {};
    if (search) {
      where.OR = [
        { nomePonto: { contains: search, mode: "insensitive" } },
        { letra: { contains: search, mode: "insensitive" } },
      ];
    }
    if (linhaFilter && linhaFilter !== "todas") {
      where.linha = linhaFilter;
    }

    const pontos = await prisma.pontoOga.findMany({
      where,
      orderBy: { nomePonto: "asc" },
      include: {
        criadoPor: { select: { nome: true } },
      },
    });
    return { success: true, pontos };
  } catch (error) {
    return { success: false, error: "Erro ao buscar acervo." };
  }
}

// SOLICITACOES DE PONTOS PELA CORRENTE
export async function solicitarPontoCorrente(data: { nomePonto: string, linha: string, letra: string, linkYoutube?: string }) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Não autorizado" };

  try {
    await prisma.solicitacaoPonto.create({
      data: {
        ...data,
        status: "pendente",
        solicitanteId: session.user.id,
      },
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: "Erro ao solicitar ponto." };
  }
}

export async function getSolicitacoesPontos(status?: string) {
  try {
    const where = status && status !== "todas" ? { status } : {};
    
    const solicitacoes = await prisma.solicitacaoPonto.findMany({
      where,
      orderBy: { dataSolicitacao: "desc" },
      include: {
        solicitante: { select: { nome: true, celular: true } },
        avaliador: { select: { nome: true } },
      },
    });
    return { success: true, solicitacoes };
  } catch (error) {
    return { success: false, error: "Erro ao buscar solicitações." };
  }
}

export async function avaliarPonto(id: string, novoStatus: string, motivo?: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Não autorizado" };

  try {
    await prisma.solicitacaoPonto.update({
      where: { id },
      data: {
        status: novoStatus,
        avaliadorId: session.user.id,
        motivoRejeicao: motivo || null,
      },
    });
    revalidatePath("/painel/aprovar-pontos");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Erro ao avaliar ponto." };
  }
}
