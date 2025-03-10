import logAction from "@/services/auditService"
import { getDeviceInfo } from "@/services/getDeviceInfo"
import { getLocationInfo } from "@/services/getLocationInfo"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"
import NextAuth, { SessionStrategy } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { z } from "zod"

const prisma = new PrismaClient()

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})
export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const { email, password } = loginSchema.parse(credentials)

          const user = await prisma.user.findUnique({
            where: { email },
          })

          if (!user) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(password, user.password)

          if (!isPasswordValid) {
            return null
          }
          // (async () => {
          //   try {
          //     const deviceInfo = getDeviceInfo();
          //     const locationInfo = await getLocationInfo();
          //     await logAction(user.id, "Novo Inicio de sessão",
          //       `Email ${user.email} logged in successfully. Device: ${deviceInfo}, Location: ${locationInfo}`
          //     );
          //   } catch (error) {
          //     console.error("Erro ao registrar logs de login:", error);
          //   }
          // })();




          await logAction(user.id, "Novo inicio de sessao", `nome: ${user.name}, perfil: ${user.role.toLocaleLowerCase()}`);

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error) {
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt" as SessionStrategy,
  },
  callbacks: {
    async jwt({ token, user }: { token: any; user?: any }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session?.user) {
        session.user.id = token.id
        session.user.role = token.role
      }
      return session
    },
  },

  pages: {
    signIn: "/login",
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
