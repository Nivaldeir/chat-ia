
import { ReactNode } from "react"
import { Excel, Pdf, Txt, Word } from "../../../../../components/icons"
import { File } from "@prisma/client"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

type Props = {
  file: File
}

export const getFileIcon = (type: string) => {
  let icon: ReactNode = <p></p>
  let color: string
  switch (type) {
    case "xlsx":
    case "csv":
      icon = <Excel />
      color = "bg-green-500"
      break
    case "pdf":
      icon = <Pdf />;
      color = "bg-red-500"
      break
    case "doc":
    case "docx":
      icon = <Word />;
      color = "bg-blue-500"
      break
    case "txt":
      icon = <Txt />;
      color = "bg-zinc-500"
      break
    default:
      icon = <div className="bg-green-500"></div>
      color = "bg-zinc-500"
  }
  return {
    icon,
    color
  }
};


export const FileUpload = ({ file }: Props) => {
  const Icon = getFileIcon(file.extension);
  const router = useRouter();
  const handleDelete = async () => {
    toast.promise(
      fetch(`/api/openai/file/${file.id}`, {
        method: 'DELETE',
      }).then(res => {
        router.refresh();
        return res.json()
      }),
      {
        loading: "Deletando arquivo...",
        success: "Arquivo deletado com sucesso!",
        error: "Erro ao deletar o arquivo",
      }
    );
  };
  return (
    <div className="mb-4 w-full sm:w-[200px] md:w-[250px] lg:w-[300px] hover:shadow-lg p-2 shadow-sm bg-white border border-gray-200 rounded-lg dark:bg-neutral-800">
      <div className="mb-2 flex justify-between items-center">
        <div className="flex items-center gap-x-3">
          {Icon.icon}
          <div>
            <p className="text-sm truncate max-w-[92%] font-medium text-gray-800 dark:text-white">{file.filename}</p>
            <p className="text-xs text-gray-500 dark:text-neutral-500">{file.bytes} bytes</p>
          </div>
        </div>
        <div className="inline-flex items-center gap-x-2">
          <button
            type="button"
            onClick={handleDelete}
            className="relative text-gray-500 hover:text-gray-800 focus:outline-none focus:text-gray-800 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-500 dark:hover:text-neutral-200 dark:focus:text-neutral-200"
          >
            <svg
              className="shrink-0 size-4 hover:fill-red-200 hover:stroke-red-400"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18" />
              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
              <line x1="10" x2="10" y1="11" y2="17" />
              <line x1="14" x2="14" y1="11" y2="17" />
            </svg>
            <span className="sr-only">Delete</span>
          </button>
        </div>
      </div>
    </div>
  )
}