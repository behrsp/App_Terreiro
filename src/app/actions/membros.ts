"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getMembros(search?: string) {
  try {
    const where = search
      ? {
          OR: [
            { nome: { contains: search, mode: "insensitive" as const } },
            { celular: { contains: search } },
          ],
        }
      : {};

    const users = await prisma.user.findMany({
      where,
      orderBy: { nome: "asc" },
      select: {
        id: true,
        nome: true,
        celular: true,
        perfil: true,
        giraPertencente: true,
        guiaResponsavel: true,
        isCapitao: true,
        dataCadastro: true,
      },
    });
    return { success: true, users };
  } catch (error) {
    return { success: false, error: "Erro ao buscar membros." };
  }
}

export async function updatePerfilMembro(userId: string, newPerfil: string, isCapitao: boolean) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { perfil: newPerfil, isCapitao },
    });
    revalidatePath("/painel/membros");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Erro ao atualizar membro." };
  }
}

export async function deleteMembro(userId: string) {
  try {
    await prisma.user.delete({
      where: { id: userId },
    });
    revalidatePath("/painel/membros");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Erro ao deletar membro. Pode haver registros atrelados a ele." };
  }
}
