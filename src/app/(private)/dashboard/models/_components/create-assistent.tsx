'use client'
import CustomModal from "@/components/custom-modal"
import { DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
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


type ApiResponse = {
  message: string
  data: File[]
}
export const CreateAssistent = () => {
  const searchParams = useSearchParams()
  const { setClose } = useModal()
  const params = new URLSearchParams(searchParams.toString())
  const team = params.get("team")
  const { data } = useFetcher<ApiResponse>(`/api/openai/file?team=${team}`)
  const form = useForm<z.infer<typeof formCreateAssistentSchema>>({
    resolver: zodResolver(formCreateAssistentSchema),
    defaultValues: {
      name: '',
      description: '',
      model: EnumModel.GPT_4O,
      team: team!,
      instructions: '',
      temperature: 0.5,
      files_ids: [],
    },
  })

  const handleSubmit = async (data: z.infer<typeof formCreateAssistentSchema>) => {
    const response = await fetch(`/api/openai/assistents?team=${team}`, {
      method: 'POST',
      body: JSON.stringify({ ...data, team }),
    })
    if (response.status === 200) {
      toast.success("Assistente criado com sucesso")
      setClose()
      return;
    }
  }

  return (
    <CustomModal>
      <h1 className="text-center font-bold text-lg">Criando seu assistente</h1>
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
                  Modelo <Question question="" />
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
                    value={data?.data?.filter(f => field.value.includes(f.id))
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
                    className="basic-multi-select"
                    classNamePrefix="select"
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
                <span className="text-white">Criando</span>
              </>
            ) : (
              <span className="text-white">Criar assistente</span>
            )}
          </Button>
        </form>
      </Form>
    </CustomModal>
  )
}
