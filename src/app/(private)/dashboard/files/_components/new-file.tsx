import { useState } from "react";
import { useDropzone } from "react-dropzone";
import CustomModal from "@/components/custom-modal";
import { getFileIcon } from "./file-upload";
import { DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";

export function NewFile() {
  return (
    <CustomModal>
      <FileUpload />
    </CustomModal>
  );
}

type UploadFile = {
  file: File,
  progress: number,
  uploading: boolean
}

export function FileUpload() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams.toString())
  const team = params.get("team")

  const [files, setFiles] = useState<UploadFile[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const onDrop = (acceptedFiles: any) => {
    const newFiles = acceptedFiles.map((file: UploadFile) => ({
      file,
      progress: 0,
      uploading: true,
    }));
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const uploadFile = (fileObj: UploadFile) => {
    const formData = new FormData();
    formData.append("file", fileObj.file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/openai/file?team=" + team, true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded * 100) / event.total);
        setFiles((prevFiles) =>
          prevFiles.map((f) =>
            f.file === fileObj.file ? { ...f, progress: percent } : f
          )
        );
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        setFiles((prevFiles) =>
          prevFiles.map((f) =>
            f.file === fileObj.file ? { ...f, uploading: false } : f
          )
        );
      }
    };
    xhr.send(formData);
    toast.success(`O arquivo '${fileObj.file.name}' salvo com sucesso`)
  };

  const handleSubmit = () => {
    setUploading(true);
    files.forEach((fileObj: UploadFile) => uploadFile(fileObj));
    router.refresh();
    setFiles([]);
    setUploading(false);
  }
  const deleteFile = (fileObj: UploadFile) => {
    setDeleting(fileObj.file.name);
    toast.message(`Deletando ${fileObj.file.name}...`);
    setTimeout(() => {
      setFiles((prevFiles) => prevFiles.filter((f) => f.file !== fileObj.file));
      setDeleting(null);
      toast.message(`Deletado ${fileObj.file.name}`);
    }, 1000);
  };
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className="flex flex-col gap-2">
      <div
        id="hs-file-upload"
        className="p-2 border-dashed border-2 rounded-xl text-center bg-white border-gray-300 dark:bg-neutral-800 dark:border-neutral-600"
      >
        <div
          {...getRootProps()}
          className="cursor-pointer p-12 flex justify-center"
        >
          <input {...getInputProps()} />
          <div className="text-center">
            <span className="inline-flex justify-center items-center size-16 bg-gray-100 text-gray-800 rounded-full dark:bg-neutral-700 dark:text-neutral-200">
              <svg
                className="shrink-0 size-6"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </span>
            <div className="mt-4 text-sm text-gray-600">
              <span className="pe-1 font-medium text-gray-800 dark:text-neutral-200">
                Arraste um arquivo ou
              </span>
              <span className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-600 cursor-pointer">
                clique para selecionar
              </span>
            </div>
            <p className="mt-1 text-xs text-gray-400 dark:text-neutral-400">Arquivos até 2MB.</p>
          </div>
        </div>
      </div>
      {files.map((fileObj) => {
        const icon = getFileIcon(fileObj.file.name.split(".")[1]);
        return (
          <div key={fileObj.file.name} className="border rounded-md p-2 flex items-center gap-2">
            {icon.icon}
            <div className="flex flex-col flex-1">
              <div className="flex justify-between items-start">
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-gray-800 dark:text-white">{fileObj.file.name}</p>
                  <p className="text-[10px] text-gray-500 dark:text-neutral-500">{fileObj.file.size} bytes</p>
                </div>
                <button
                  onClick={() => deleteFile(fileObj)}
                  disabled={deleting === fileObj.file.name}
                  className="text-red-600 hover:text-red-800 transition disabled:opacity-50"
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
              <div className="mt-1 flex items-center gap-x-3 ">
                <div
                  className="w-full h-1 bg-gray-600 rounded-3xl relative overflow-hidden dark:bg-neutral-700"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className={`${icon.color} absolute z-[50] text-xs w-20  text-white text-center whitespace-nowrap transition-all duration-500`}
                    style={{ width: `${fileObj.progress}%` }}
                  >
                    <p>.</p>
                  </div>
                </div>
                <span className="text-[10px] text-gray-800 dark:text-white">
                  {fileObj.progress}%
                </span>
              </div>
            </div>

          </div>
        );
      })}
      <Button disabled={files.length == 0 || uploading} onClick={handleSubmit}>
        {uploading && <Loader2Icon className="animate-spin stroke-white" />}
        {uploading ? "Enviando..." : "Salvar"}
      </Button>
    </div>
  );
}
