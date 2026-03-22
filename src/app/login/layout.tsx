import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Accedi o Registrati | DetersiviParty",
  description: "Accedi alla tua area riservata per gestire i tuoi ordini, le tue prenotazioni e il tuo profilo cliente.",
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return children
}
