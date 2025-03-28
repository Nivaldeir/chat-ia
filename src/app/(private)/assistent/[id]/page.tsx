//@ts-nocheck
import { prisma } from "@/lib/prisma";
import { Chat } from "@/components/chat";


type ChatPageProps = {
  params: Promise<{ id: string }>
  searchParams: Promise<any>
}


export default async function Page({ params }: ChatPageProps) {
  const { id } = await params
  const chat = await prisma.assistant.findUnique({
    where: {
      id,
    }
  })

  return (
    <Chat id={chat?.id} initialMessages={[]} />
  );
}
