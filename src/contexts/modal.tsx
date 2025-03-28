'use client'

import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react'

// Definição das props do provider
type ModalProviderProps = {
  children: ReactNode
}

// Tipo para os dados do modal
type ModalData = Record<string, unknown>

// Tipo para a função de carregamento de dados
type FetchDataFunction = () => Promise<ModalData>

// Definição do contexto do modal
type ModalContextType = {
  data: ModalData
  isOpen: boolean
  setOpen: (modal: ReactNode, fetchData?: FetchDataFunction) => Promise<void>
  setClose: () => void
}

// Criação do contexto com valores padrão
export const ModalContext = createContext<ModalContextType | undefined>(undefined)

const ModalProvider = ({ children }: ModalProviderProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [data, setData] = useState<ModalData>({})
  const [showingModal, setShowingModal] = useState<ReactNode>(null)
  const [isMounted, setIsMounted] = useState<boolean>(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const setOpen = async (modal: ReactNode, fetchData?: FetchDataFunction) => {
    if (modal) {
      if (fetchData) {
        try {
          const fetchedData = await fetchData()
          setData((prevData) => ({ ...prevData, ...fetchedData }))
        } catch (error) {
          console.error('Erro ao buscar dados do modal:', error)
        }
      }
      setShowingModal(modal)
      setIsOpen(true)
    }
  }

  const setClose = () => {
    setIsOpen(false)
    setData({})
    setShowingModal(null)
  }

  if (!isMounted) return null

  return (
    <ModalContext.Provider value={{ data, setOpen, setClose, isOpen }}>
      {children}
      {showingModal}
    </ModalContext.Provider>
  )
}

export const useModal = () => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider')
  }
  return context
}

export default ModalProvider