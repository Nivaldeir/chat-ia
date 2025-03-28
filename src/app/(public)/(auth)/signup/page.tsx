import { Metadata } from "next"
import { SignupView } from "./signin-up.view"

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'TATICCA AI - Register',
  }
}

export default async function SignUpage() {
  return (
    <SignupView />
  )
}