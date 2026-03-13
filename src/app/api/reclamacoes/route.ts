import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { mensagem } = await req.json();
    if (!mensagem) {
      return NextResponse.json({ error: "Mensagem vazia." }, { status: 400 });
    }

    await prisma.reclamacao.create({
      data: { mensagem },
    });

    return NextResponse.json({ message: "Sua mensagem foi enviada anonimamente com sucesso!" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Erro interno no servidor." }, { status: 500 });
  }
}
