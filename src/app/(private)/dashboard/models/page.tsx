'use client'
import { usePageHeaderInfo } from "@/hooks/use-page-info";
import { useModels } from "./models.model";
import { Button } from "@/components/ui/button";
import { useFetcher } from "@/hooks/use-fetcher";
import { Assistant } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { getFileIcon } from "../files/_components/file-upload";
import { Edit } from "lucide-react";
import { CreateOrEditAssistant } from "./_components/create-assistent";
import { useModal } from "@/contexts/modal";
import { EnumModel } from "@/correct/path/to/enum-model";

type ApiResponse = {
  data: Assistant[]
}
export default function ModelPage() {
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams.toString())
  const team = params.get("team")
  const { setOpen } = useModal()
  usePageHeaderInfo({
    title: "Home",
    description: "Seus modelos",
    breadcrumb: [
      {
        label: "Home",
        href: "/",
      },
      {
        label: "Seus modelos",
        href: "/dashboard/models",
      },
    ]
  });

  const { data } = useFetcher<ApiResponse>(`/api/openai/assistents?team=${team}`)
  const { handleOpenCreateAssistant } = useModels()
  return (
    <section className="container mx-auto">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Seus modelos</h1>
          <p className="text-sm text-gray-500 dark:text-neutral-400">Aqui você pode visualizar e fazer a geração de novos modelos</p>
        </div>
        <Button onClick={handleOpenCreateAssistant}>Criar assistente</Button>
      </div>
      <div className="w-full">
        {
          data?.data.map(ass => (
            <Card key={ass.id}>
              <div className="p-3 flex justify-between items-center">
                <CardTitle>{ass?.name}</CardTitle>
                <div>
                  {/* <Label className="text-[12px] opacity-70">Arquivos:</Label> */}
                  <div className="flex gap-1">
                    {/* {Array.from({ length: 3 }).map((_, idx) => {
                      const { color, icon } = getFileIcon("xlsx")
                      return <div key={idx}>{icon}</div>
                    })} */}
                    <Edit onClick={() => setOpen(<CreateOrEditAssistant assistantData={{
                      ...ass,
                      id: ass.id,
                      team: team || '',
                      model: ass.model as EnumModel,
                      description: ass.description ?? undefined,
                      instructions: ass.instructions ?? undefined
                    }} />)} />
                  </div>
                </div>
              </div>
              <CardContent className="">
                <div className="gap-2">
                  <Label className="text-[12px] opacity-70">Modelo:</Label>
                  <p className="ml-2">{ass?.model}</p>
                </div>
                <div>
                  <Label className="text-[12px] opacity-70">Descrição:</Label>
                  <p className="ml-2">{ass?.description}</p>
                </div>
                <div>
                  <Label className="text-[12px] opacity-70">Instrução:</Label>
                  <p className="ml-2">{ass?.instructions}</p>
                </div>
              </CardContent>
            </Card>
          ))
        }
      </div>
    </section>
  )
}