import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nome, celular, senha, giraPertencente, guiaResponsavel, isCapitao } = body;

    // Validação básica
    if (!nome || !celular || !senha || !giraPertencente || !guiaResponsavel) {
      return NextResponse.json({ error: "Preencha todos os campos obrigatórios." }, { status: 400 });
    }

    // Verificar se o celular já existe
    const exists = await prisma.user.findUnique({
      where: { celular },
    });

    if (exists) {
      return NextResponse.json({ error: "Este número de celular já está cadastrado." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(senha, 10);

    const user = await prisma.user.create({
      data: {
        nome,
        celular,
        senha: hashedPassword,
        perfil: "corrente", // Por padrão é membro da corrente (Dirigentes são alterados manualmente)
        giraPertencente,
        guiaResponsavel,
        isCapitao: Boolean(isCapitao),
      },
    });

    return NextResponse.json({ 
      user: { id: user.id, nome: user.nome, celular: user.celular }, 
      message: "Cadastro realizado com sucesso!" 
    }, { status: 201 });

  } catch (error) {
    console.error("ERRO NO CADASTRO:", error);
    return NextResponse.json({ error: "Erro interno no servidor." }, { status: 500 });
  }
}
