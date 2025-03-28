import { Metadata } from "next"
import { LoginView } from "./signin.view"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'TATICCA AI - Login',
  }
}

export default async function SignInPage() {
  return (
    <LoginView />
  )
}