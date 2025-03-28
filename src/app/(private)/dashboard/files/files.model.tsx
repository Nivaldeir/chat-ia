"use client"
import { NewFile } from "./_components/new-file"
import { DeleteFile } from "./_components/delete-file"
import { File } from "@prisma/client"
import { useModal } from "@/contexts/modal"
import CustomModal from "@/components/custom-modal"

export const filesModel = () => {
  const { setOpen } = useModal()
  const handleUploadNewFile = () => {
    setOpen(<NewFile />)
  }

  const handleDeleteFile = (file: File) => {
    setOpen(<DeleteFile />)
  }
  return {
    handleUploadNewFile,
    handleDeleteFile
  }
}