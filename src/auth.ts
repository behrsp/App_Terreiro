import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Celular",
      credentials: {
        celular: { label: "Celular", type: "text", placeholder: "(11) 99999-9999" },
        senha: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.celular || !credentials?.senha) {
          throw new Error("Credenciais inválidas");
        }

        const user = await prisma.user.findUnique({
          where: { celular: credentials.celular as string },
        });

        if (!user) {
          throw new Error("Usuário não encontrado");
        }

        const isValidPassword = await bcrypt.compare(
          credentials.senha as string,
          user.senha
        );

        if (!isValidPassword) {
          throw new Error("Senha incorreta");
        }

        return {
          id: user.id,
          name: user.nome,
          celular: user.celular,
          perfil: user.perfil,
          isCapitao: user.isCapitao
        } as any;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.perfil = (user as any).perfil;
        token.isCapitao = (user as any).isCapitao;
        token.celular = (user as any).celular;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        (session.user as any).perfil = token.perfil;
        (session.user as any).isCapitao = token.isCapitao;
        (session.user as any).celular = token.celular;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
});
