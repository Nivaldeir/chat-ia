import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import bcrypt from "bcrypt";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider, { LinkedInProfile } from "next-auth/providers/linkedin";
import { prisma } from "@/lib/prisma";
import Credentials from "next-auth/providers/credentials";
import { Adapter } from "next-auth/adapters";
export const nextAuthConfig = NextAuth({
  pages: {
    signIn: "/signin",
    signOut: "/signout",
    error: "/signin",
  },
  debug: true,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      //@ts-ignore
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Credenciais inválidas");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: { teams: true },
        });
        if (!user) {
          throw new Error("Usuário não encontrado");
        }
        // const passwordHassg = 
        const isMatch = await bcrypt.compare(credentials.password, user!.password!);
        if (!isMatch) throw new Error("Usuário ou Senha não compativel");
        return user
      },
    }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    // }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID || "",
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET || "",
      client: { token_endpoint_auth_method: "client_secret_post" },
      issuer: "https://www.linkedin.com",
      //@ts-ignore
      profile: (profile: LinkedInProfile) => ({
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
        isAdmin: false,
      }),
      wellKnown:
        "https://www.linkedin.com/oauth/.well-known/openid-configuration",
      authorization: {
        params: {
          scope: "openid profile email",
        },
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  adapter: PrismaAdapter(prisma) as unknown as Adapter,
  callbacks: {
    async jwt({ token, user, account, profile, session, trigger }) {
      if (trigger === "update" && session?.teams) {
        token.teams = session.teams
      }
      if (user) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email! },
          include: {
            teamAdminUser: {
              include: {
                Team: true
              }
            }, teams: true
          },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.teams = dbUser.teams.map(t => {
            if (dbUser.teamAdminUser.find(admin => admin.teamId == t.id)?.userId == dbUser.id) {
              return { ...t, admin: true }
            }
          })
          token.isAdmin = dbUser.isAdmin;
        }
      }
      return token;
    },
    async session({ session, token }: { token: any, session: any }) {
      session.user = {
        id: token.id,
        name: token.name!,
        email: token.email!,
        image: token.picture! ?? token.image!,
        isAdmin: token.isAdmin ?? false,
        admins: token.admins || [],
        teams: token.teams || [],
      };
      return session;
    },
  },
});