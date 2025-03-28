import { useModal } from "@/contexts/modal"
import { CreateAssistent } from "./_components/create-assistent"

export const useModels = () => {
  const { setOpen } = useModal()
  const handleOpenCreateAssistant = () => {
    setOpen(<CreateAssistent />)
  }
  return {
    handleOpenCreateAssistant
  }
}