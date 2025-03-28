import { signIn } from "next-auth/react";
import { toast } from "sonner";

export const SignModel = () => {
  const signInWithCredentials = async (data: { email: string, password: string }) => {
    const output = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: true,
      callbackUrl: "/dashboard",
    });
    if(!output?.error) toast.error("Usuario ou senha nao compativel")
  };

  return {
    // signInWithGoogle: async () =>
    //   await signIn("google", {
    //     callbackUrl: "/dashboard",
    //     redirect: true
    //   }),

    signInWithLinkedIn: async () =>
      await signIn("linkedin", {
        callbackUrl: "/dashboard",
        redirect: true
      }),
    signInWithCredentials
  };
};
