import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { TeamView } from "./teams.view"

export default async function TeamPage() {
  const user = await getServerSession()
  const teams = await prisma.team.findMany({
    where: {
      users: {
        every: {
          id: user?.user.id
        }
      }
    },
    include: {
      assistant: true,
      users: {
        select: {
          _count: true
        }
      }
    }
  })
  return (
    <TeamView teams={teams} />
  )
}