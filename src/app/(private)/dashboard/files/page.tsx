"use client"
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/app/(private)/dashboard/files/_components/file-upload";
import { usePageHeaderInfo } from "@/hooks/use-page-info";
import { filesModel } from "./files.model";
import { File } from "@prisma/client";
import { useFetcher } from "@/hooks/use-fetcher";
import { useSearchParams } from "next/navigation";




type ApiResponse = {
  message: string
  data: File[]
}

export default function FilePage() {
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams.toString())
  const team = params.get("team")

  const { data } = useFetcher<ApiResponse>(`/api/openai/file?team=${team}`)

  usePageHeaderInfo({
    title: "Home",
    description: "Seus arquivos",
    breadcrumb: [
      {
        label: "Home",
        href: "/",
      },
      {
        label: "Seus arquivos",
        href: "/dashboard/files",
      },
    ]
  });
  const { handleUploadNewFile } = filesModel()
  return (
    <section className="container mx-auto">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Seus arquivos</h1>
          <p className="text-sm text-gray-500 dark:text-neutral-400">Aqui você pode visualizar e fazer upload de arquivos</p>
        </div>
        <Button onClick={handleUploadNewFile}>Subirr um arquivo</Button>
      </div>
      <div className="flex gap-2 flex-wrap">
        {data?.data?.map((file, idx) => (
          <FileUpload key={file.id + idx} file={file} />
        ))}
      </div>
    </section>
  )
}