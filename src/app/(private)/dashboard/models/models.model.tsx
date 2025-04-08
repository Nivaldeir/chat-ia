import { useModal } from "@/contexts/modal"
import { CreateOrEditAssistant } from "./_components/create-assistent"

export const useModels = () => {
  const { setOpen } = useModal()
  const handleOpenCreateAssistant = () => {
    setOpen(<CreateOrEditAssistant />)
  }
  return {
    handleOpenCreateAssistant
  }
}