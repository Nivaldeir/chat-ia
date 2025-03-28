"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SignModel } from "./signin.model";
import Image from "next/image";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const signInSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres")
});


export function LoginView() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(signInSchema)
  });

  const { signInWithCredentials, signInWithLinkedIn } = SignModel()
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
                    <h1 className="text-2xl font-bold">Bem vindo</h1>
                    <p className="text-balance text-muted-foreground">
                      Entre na sua conta
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      {...register("email")}
                      required
                    />
                    {errors.email && typeof errors.email.message === 'string' && (
                      <span className="text-red-500 text-sm">{errors.email.message}</span>
                    )}
                  </div>
                  <div className="grid gap-2">
                    <div className="flex items-center">
                      <Label htmlFor="password">Password</Label>
                      <a
                        href="#"
                        className="ml-auto text-sm underline-offset-2 hover:underline"
                      >
                        Esqueceu sua senha?
                      </a>
                    </div>
                    <Input id="password" type="password" required {...register("password")} />
                    {errors.password && typeof errors.password.message === 'string' && (
                      <span className="text-red-500 text-sm">{errors.password.message}</span>
                    )}
                  </div>
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                  <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                    <span className="relative z-10 bg-background px-2 text-muted-foreground">
                      Continue com
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <Button variant="outline" className="w-full" type="button" onClick={signInWithLinkedIn}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M19 0H5C2.238 0 0 2.238 0 5v14c0 2.762 2.238 5 5 5h14c2.762 0 5-2.238 5-5V5c0-2.762-2.238-5-5-5zM7 19H4V9h3v10zM5.5 7.5A1.5 1.5 0 1 1 5.5 4a1.5 1.5 0 0 1 0 3.5zM20 19h-3v-5.5c0-1.1-.9-2-2-2s-2 .9-2 2V19h-3V9h3v1.5c.9-1.3 2.4-2 4-2 2.2 0 4 1.8 4 4V19z" fill="#0077B5" />
                      </svg>
                      <span className="sr-only">Login with Apple</span>
                    </Button>
                    {/* <Button variant="outline" type="button" className="w-full" onClick={signInWithGoogle}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path
                          d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                          fill="currentColor"
                        />
                      </svg>
                      <span className="sr-only">Login with Google</span>
                    </Button> */}
                  </div>
                  <div className="text-center text-sm">
                    Não tem conta?{" "}
                    <a href="/signup" className="underline underline-offset-4">
                      Sign up
                    </a>
                  </div>
                </div>
              </form>
              <div className="relative flex justify-center  bg-muted md:block">
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
            By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
            and <a href="#">Privacy Policy</a>.
          </div>
        </div>
      </div>
    </div>
  )
}
