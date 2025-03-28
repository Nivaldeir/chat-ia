import { Prisma, Team, TeamAdminUser } from "@prisma/client"
import NextAuth from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string
      name: string
      email: string
      image: string
      isAdmin: boolean
      teams: {
        id: string;
        name: string;
        icon: string | null;
        userId: string | null;
        admin: boolean;
      }[]
    }
  }
  interface User {
    id: string
    name: string
    email: string
    image: string
    isAdmin: boolean
    teams: {
      id: string;
      name: string;
      icon: string | null;
      userId: string | null;
      isAdmin: boolean;
    }[]
  }
}