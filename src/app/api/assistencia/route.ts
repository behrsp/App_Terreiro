import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nome, celular, email, linhaSolicitada } = body;

    // Validação básica
    if (!nome || !celular || !linhaSolicitada) {
      return NextResponse.json({ error: "Preencha os campos obrigatórios." }, { status: 400 });
    }

    const consulta = await prisma.consultaAssistencia.create({
      data: {
        nome,
        celular,
        email: email || null,
        linhaSolicitada,
        status: "pendente",
      },
    });

    return NextResponse.json({ 
      consulta,
      message: "Consulta agendada e enviada para aprovação com sucesso!" 
    }, { status: 201 });

  } catch (error) {
    console.error("ERRO NO AGENDAMENTO:", error);
    return NextResponse.json({ error: "Erro interno no servidor." }, { status: 500 });
  }
}
