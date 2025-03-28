'use client'
import { SessionProvider } from "next-auth/react"
import { ReactNode } from "react"
import ModalProvider from "@/contexts/modal"
import { Toaster } from 'sonner';
import { TooltipProvider } from "./ui/tooltip"
type Props = {
  children: ReactNode
}
export const Provider = ({ children }: Props) => {
  return (
    <SessionProvider>
        <TooltipProvider>
          <Toaster position="top-right" richColors />
          <ModalProvider>
            {children}
          </ModalProvider>
        </TooltipProvider>
      {/* </SidebarProvider> */}
    </SessionProvider>
  )
}