"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import { SignUpModel } from "./signin-up.model";

const signUpSchema = z.object({
  name: z.string().min(3, "Nome deve ter pelo menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"]
});

export function SignupView() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(signUpSchema)
  });
  const { signInWithCredentials, signInWithLinkedIn } = SignUpModel();

  const onSubmit = (data: any) => {
    signInWithCredentials(data);
  };
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden">
            <CardContent className="grid p-0 md:grid-cols-2">
              <form className="p-6 md:p-8" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center">
                    <h1 className="text-2xl font-bold">Criar Conta</h1>
                    <p className="text-balance text-muted-foreground">
                      Preencha os campos abaixo para se cadastrar
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input id="name" type="text" {...register("name")} required />
                    {errors.name && typeof errors.name.message === 'string' && (
                      <span className="text-red-500 text-sm">{errors.name.message}</span>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" {...register("email")} required />
                    {errors.email && typeof errors.email.message === 'string' && (
                      <span className="text-red-500 text-sm">{errors.email.message}</span>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input id="password" type="password" {...register("password")} required />
                    {errors.password && typeof errors.password.message === 'string' && (
                      <span className="text-red-500 text-sm">{errors.password.message}</span>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                    <Input id="confirmPassword" type="password" {...register("confirmPassword")} required />
                    {errors.confirmPassword && typeof errors.confirmPassword.message === 'string' && (
                      <span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>
                    )}
                  </div>
                  <Button type="submit" className="w-full">
                    Cadastrar
                  </Button>
                  <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                    <span className="relative z-10 bg-background px-2 text-muted-foreground">
                      Ou cadastre-se com
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <Button variant="outline" className="w-full" type="button" onClick={signInWithLinkedIn}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M19 0H5C2.238 0 0 2.238 0 5v14c0 2.762 2.238 5 5 5h14c2.762 0 5-2.238 5-5V5c0-2.762-2.238-5-5-5zM7 19H4V9h3v10zM5.5 7.5A1.5 1.5 0 1 1 5.5 4a1.5 1.5 0 0 1 0 3.5zM20 19h-3v-5.5c0-1.1-.9-2-2-2s-2 .9-2 2V19h-3V9h3v1.5c.9-1.3 2.4-2 4-2 2.2 0 4 1.8 4 4V19z" fill="#0077B5" />
                      </svg>
                      <span className="sr-only">Cadastrar com LinkedIn</span>
                    </Button>
                  </div>
                  <div className="text-center text-sm">
                    Já tem uma conta?{" "}
                    <a href="#" className="underline underline-offset-4">
                      Entrar
                    </a>
                  </div>
                </div>
              </form>
              <div className="relative flex justify-center bg-muted md:block">
                <Image
                  src="/TATICCA_LOGO_BICOLOR.png"
                  alt="Image"
                  width={300}
                  height={150}
                />
              </div>
            </CardContent>
          </Card>
          <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
            Ao se cadastrar, você concorda com nossos <a href="#">Termos de Serviço</a>{" "}
            e <a href="#">Política de Privacidade</a>.
          </div>
        </div>
      </div>
    </div>
  );
}
