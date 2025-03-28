import { ReactNode, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog'

import { useModal } from '@/contexts/modal'
import { cn } from '@/lib/utils'
import { DialogView } from './dialog'
type Props = {
  children: ReactNode
  defaultOpen?: boolean
  className?: string
}

const CustomModal = ({ children, className }: Props) => {
  const { setClose, isOpen } = useModal()
  const handleClose = () => setClose()
  console.log(isOpen)
  useEffect(() => { console.log(isOpen) }, [handleClose])
  return (
    <DialogView isOpen={isOpen} setOpen={handleClose} className={cn(["lg:p-5 max-md:p-3 h-full max-w-[600px]", className])}>
      {children}
      {/* Seu conteúdo do modal aqui */}
    </DialogView>
  )
}

export default CustomModal