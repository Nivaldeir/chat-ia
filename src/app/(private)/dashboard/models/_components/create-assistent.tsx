'use client'

import CustomModal from "@/components/custom-modal"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { EnumModel, formCreateAssistentSchema } from "../models.types"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { Question } from "./question"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import MultSelect from 'react-select'
import { File } from "@prisma/client"
import { getFileIcon } from "../../files/_components/file-upload"
import { useFetcher } from "@/hooks/use-fetcher"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { useModal } from "@/contexts/modal"
import { useEffect } from "react"

type ApiResponse = {
  message: string
  data: File[]
}

type Props = {
  assistantData?: z.infer<typeof formCreateAssistentSchema> & { id: string }
}

export const CreateOrEditAssistant = ({ assistantData }: Props) => {
  const searchParams = useSearchParams()
  const { setClose } = useModal()
  const params = new URLSearchParams(searchParams.toString())
  const team = params.get("team")

  const { data } = useFetcher<ApiResponse>(`/api/openai/file?team=${team}`)
  const form = useForm<z.infer<typeof formCreateAssistentSchema>>({
    resolver: zodResolver(formCreateAssistentSchema),
    defaultValues: assistantData ?? {
      name: '',
      description: '',
      model: EnumModel.GPT_4O,
      team: team!,
      instructions: '',
      temperature: 0.5,
      files_ids: [],
    },
  })

  // Atualiza valores se vierem por props (edição)
  useEffect(() => {
    if (assistantData) {
      form.reset(assistantData)
    }
  }, [assistantData, form])

  const handleSubmit = async (data: z.infer<typeof formCreateAssistentSchema>) => {
    const method = 'POST'
    const url = `/api/openai/assistents?team=${team}`

    const response = await fetch(url, {
      method,
      body: JSON.stringify({ ...assistantData, ...data, team }),
    })

    if (response.ok) {
      toast.success(assistantData ? "Assistente atualizado com sucesso" : "Assistente criado com sucesso")
      setClose()
    } else {
      toast.error("Algo deu errado.")
    }
  }

  return (
    <CustomModal>
      <h1 className="text-center font-bold text-lg">
        {assistantData ? "Editando assistente" : "Criando seu assistente"}
      </h1>
      <Form {...form}>
        <form className="flex flex-col gap-2" onSubmit={form.handleSubmit(handleSubmit)}>
          {/* Nome */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel className="text-left text-sm text-foreground/60 flex gap-1">
                  Nome <Question question="Identificar o assistente de forma única." />
                </FormLabel>
                <FormControl>
                  <Input placeholder="Nome" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Descrição */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel className="text-left text-sm text-foreground/60 flex gap-1">
                  Descrição <Question question="Fornecer uma visão geral do propósito ou funcionalidades do assistente." />
                </FormLabel>
                <FormControl>
                  <Input placeholder="Descrição" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Modelo */}
          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel className="text-left text-sm text-foreground/60 flex gap-1">
                  Modelo
                </FormLabel>
                <FormControl>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={EnumModel.GPT_4} />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(EnumModel).map(([label, value]) => (
                        <SelectItem className="cursor-pointer" key={label} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />

          {/* Arquivos */}
          <FormField
            control={form.control}
            name="files_ids"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel className="text-left text-sm text-foreground/60 flex gap-1">
                  Arquivos <Question question="Anexe arquivos para ajudar o assistente." />
                </FormLabel>
                <FormControl>
                  <MultSelect
                    isMulti
                    name="files"
                    options={!data ? [] : data?.data?.map(f => ({ value: f.id, label: f.filename, extension: f.extension }))}
                    //@ts-ignore
                    value={data?.data?.filter(f => (field.value || []).includes(f.id))
                      .map(f => ({ value: f.id, label: f.filename, extension: f.extension }))}
                    onChange={(selected) => field.onChange(selected.map(f => f.value))}
                    formatOptionLabel={(e) => {
                      const file = getFileIcon(e.extension);
                      return (
                        <div className="flex items-center gap-2 h-5">
                          {file.icon}
                          <p className="text-[10px]">{e.label}</p>
                        </div>
                      );
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Instruções */}
          <FormField
            control={form.control}
            name="instructions"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel className="text-left text-sm text-foreground/60 flex gap-1">
                  Instruções <Question question="Defina como o assistente deve agir." />
                </FormLabel>
                <FormControl>
                  <Textarea placeholder="Digite as instruções" className="resize-none" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Temperature */}
          <FormField
            control={form.control}
            name="temperature"
            render={({ field }) => (
              <FormItem className="flex flex-col w-full">
                <FormLabel className="text-left text-sm text-foreground/60 flex gap-1 justify-between w-full">
                  <p className="flex gap-1">
                    Temperature <Question question="Ajusta a criatividade do modelo." />
                  </p>
                  <p>{field.value}</p>
                </FormLabel>
                <FormControl>
                  <Slider
                    defaultValue={[0.5]}
                    max={1}
                    min={0}
                    step={0.1}
                    onValueChange={(value: number[]) => field.onChange(value[0])}
                    value={[field.value ?? 0]}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* Botão de Envio */}
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="stroke-white animate-spin" />
                <span className="text-white">{assistantData ? "Salvando" : "Criando"}</span>
              </>
            ) : (
              <span className="text-white">{assistantData ? "Salvar alterações" : "Criar assistente"}</span>
            )}
          </Button>
        </form>
      </Form>
    </CustomModal>
  )
}