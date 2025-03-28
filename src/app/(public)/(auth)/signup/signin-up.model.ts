import { signIn } from "next-auth/react";
import { createUser } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type CreateUserProps = {
  email: string
  password: string
  name: string
}
export const SignUpModel = () => {
  const route = useRouter()

  const signInWithCredentials = async (data: CreateUserProps) => {
    const output = await createUser(data)
    console.log(output)
    if (!output.error) {
      toast.success("Usuario criado com sucesso")
    } else {
      toast.error("Usuario já cadastrado")
    }
    route.push("/signin")
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
