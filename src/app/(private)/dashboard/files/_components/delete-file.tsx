'use client'
import CustomModal from "@/components/custom-modal"
import { Button } from "@/components/ui/button"
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2Icon } from "lucide-react"
import { useState } from "react"

export const DeleteFile = () => {
  const [loading, setLoading] = useState(false)
  const handleDelete = () => {
    setLoading(true)
    setTimeout(()=> {
      setLoading(false)
    }, 5000)
  }
  return (
    <CustomModal className="p-5">
      <DialogContent className="">
        <DialogHeader>
          <DialogTitle className="text-center">Excluir</DialogTitle>
          <DialogDescription>Tem certeza que deseja excluir esse arquivo?</DialogDescription>
        </DialogHeader>
        <div className="flex gap-2">
          <Button className="flex flex-1">Fechar</Button>
          <Button className="bg-red-500 flex flex-1" onClick={handleDelete}>
            {loading && <Loader2Icon className="animate-spin stroke-white" /> }
            {loading ? "Excluindo..." : "Excluir"}
          </Button>
        </div>
      </DialogContent>
    </CustomModal>
  )
}