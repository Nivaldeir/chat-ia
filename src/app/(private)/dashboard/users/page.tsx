import { prisma } from "@/lib/prisma";
import { UserView } from "./users.view";

export default async function UserPage() {
  const users = await prisma.user.findMany({
    where: {
      teams: {
        some: {
          name: "Contabilidade"
        }
      }
    },
    include: {
      TokenUsage: true
    }
  }) as any
  return (
    <UserView users={users} />
  )
}