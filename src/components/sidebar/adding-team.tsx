import { z } from "zod";
import { Button } from "../ui/button";
import { DialogDescription, DialogHeader, DialogTitle } from "../ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AudioWaveform, Command, GalleryVerticalEnd, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useModal } from "@/contexts/modal";
import { useSidebar } from "../ui/sidebar";

// Opções de ícones
const iconOptions = [
  { label: "Acme Inc", value: GalleryVerticalEnd },
  { label: "Acme Corp.", value: AudioWaveform },
  { label: "Evil Corp.", value: Command },
];

export const schema = z.object({
  name: z.string().min(1, {
    message: "O nome é obrigatório e não pode estar vazio",
  }),
  icon: z.string().optional().refine(value => value === undefined || value.trim() !== "", {
    message: "O ícone não pode ser uma string vazia",
  }),
});

export const AddingTeam = () => {
  const route = useRouter()
  const { setClose } = useModal()
  const { data: session, update } = useSession()
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { name: "" }
  });

  const handleSubmit = async (data: z.infer<typeof schema>) => {
    const response = await fetch("/api/team", {
      method: "POST",
      body: JSON.stringify(data)
    })
    const output = await response.json()
    if (response.status == 201) {
      await update({
        teams: [...(session?.user?.teams || []), {...output.team, admin: true}],
      });
      toast.success("Team criado com sucesso")
      route.refresh()
      setClose()
      return;
    }
    toast.error(output.message)
  }

  return (
    <>
      <Form {...form}>
        <form className="flex gap-2 flex-col" onSubmit={form.handleSubmit(handleSubmit)}>
          {/* Nome do Time */}
          <FormField
            control={form.control}
            name="name"
            disabled={form.formState.isSubmitting}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Seleção de Ícone */}
          <FormField
            control={form.control}
            name="icon"
            disabled={form.formState.isSubmitting}
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Ícone</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um ícone" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {iconOptions.map((icon) => (
                      <SelectItem key={icon.label} value={icon.label} className="flex">
                        <div className="flex gap-1 items-center justify-end">
                          <icon.value size={13} />{icon.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button type="submit" disabled={form.formState.isSubmitting} >
              {form.formState.isSubmitting && <Loader2 className="animate-spin" />}
              {!form.formState.isSubmitting && "Criar equipe"}
            </Button>
          </div>
        </form>
      </Form>

      <div className="flex w-full items-center gap-4">
        <span className="w-[48%] h-[0.2px] bg-black/10" />
        <span className="text-[10px] text-gray-900/40">OU</span>
        <span className="w-[48%] h-[0.2px] bg-black/10" />
      </div>

      <div className="flex gap-2">
        <Input placeholder="Código do time" className="text-base" />
        <Button>Entrar</Button>
      </div>
    </>
  );
};
