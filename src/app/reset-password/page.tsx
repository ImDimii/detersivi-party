"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, Eye, EyeOff, CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useToast } from "@/hooks/useToast"

function ResetPasswordForm() {
  const { addToast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [sessionReady, setSessionReady] = useState(false)
  const [sessionError, setSessionError] = useState<string | null>(null)

  // Supabase PKCE flow: the magic link contains ?code= which must be exchanged
  // for a real session before we can call updateUser().
  useEffect(() => {
    const code = searchParams.get("code")
    if (!code) {
      setSessionError("Link non valido o scaduto. Richiedi un nuovo link di reset.")
      return
    }
    supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
      if (error) {
        setSessionError("Link scaduto o già utilizzato. Richiedi un nuovo reset.")
      } else {
        setSessionReady(true)
      }
    })
  }, [supabase, searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password.length < 8) {
      setError("La password deve contenere almeno 8 caratteri.")
      return
    }
    if (password !== confirm) {
      setError("Le due password non coincidono.")
      return
    }

    setIsLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      setDone(true)
      addToast("Password aggiornata con successo!", "success")
      setTimeout(() => router.push("/account"), 2500)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex flex-col min-h-screen bg-[#fafafa]">
      <Navbar />

      <div className="flex-grow flex items-center justify-center pt-32 pb-24 px-4 relative overflow-hidden">
        {/* Decorative */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-success/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[420px] relative"
        >
          <div className="bg-white rounded-[2.5rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] border border-border/40 overflow-hidden p-10 space-y-8 text-center">

            {done ? (
              /* Success state */
              <div className="space-y-6 py-4">
                <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10 text-success" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl font-heading font-black tracking-tight uppercase italic">Password aggiornata!</h1>
                  <p className="text-muted-foreground text-sm">Verrai reindirizzato al tuo account tra pochi secondi.</p>
                </div>
                <Link href="/account">
                  <Button className="w-full h-13 text-xs font-black uppercase tracking-widest rounded-2xl shadow-lg">
                    Vai al mio Account <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="space-y-3">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto shadow-inner ring-4 ring-white">
                    <ShieldCheck className="w-8 h-8 text-primary" />
                  </div>
                  <h1 className="text-3xl font-heading font-black tracking-tight uppercase italic">
                    Nuova Password
                  </h1>
                  <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.15em] opacity-70">
                    Scegli una password sicura per il tuo account
                  </p>
                </div>

                {sessionError && (
                  <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-2xl text-destructive text-xs font-bold text-center space-y-3">
                    <p>{sessionError}</p>
                    <Link href="/login" className="underline text-primary">
                      Torna al login per richiedere un nuovo link
                    </Link>
                  </div>
                )}

                {!sessionReady && !sessionError && (
                  <div className="flex items-center justify-center gap-3 p-4 bg-secondary/40 rounded-2xl text-sm text-muted-foreground font-medium">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    Verifica del link in corso…
                  </div>
                )}

                {error && (
                  <div className="p-3 bg-destructive/5 border border-destructive/10 rounded-2xl text-destructive text-[10px] font-black uppercase tracking-widest">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5 text-left">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Nuova Password</Label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Minimo 8 caratteri"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        className="pl-11 pr-11 h-13 rounded-2xl border-2 border-secondary bg-secondary/10 focus:bg-white focus:border-primary/50 transition-all font-bold"
                        required
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-foreground">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Conferma Password</Label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="Ripeti la password"
                        value={confirm}
                        onChange={e => setConfirm(e.target.value)}
                        className="pl-11 h-13 rounded-2xl border-2 border-secondary bg-secondary/10 focus:bg-white focus:border-primary/50 transition-all font-bold"
                        required
                      />
                    </div>
                  </div>

                  {/* Password strength indicator */}
                  {password.length > 0 && (
                    <div className="space-y-1">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map(i => (
                          <div
                            key={i}
                            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                              password.length >= i * 2
                                ? i <= 1 ? "bg-destructive" : i <= 2 ? "bg-amber-400" : i <= 3 ? "bg-yellow-400" : "bg-success"
                                : "bg-secondary"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-[10px] text-muted-foreground font-bold ml-1">
                        {password.length < 4 ? "Troppo corta" : password.length < 6 ? "Debole" : password.length < 8 ? "Quasi sufficiente" : "Ottima!"}
                      </p>
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full h-13 text-xs font-black uppercase tracking-widest rounded-2xl shadow-lg"
                    disabled={isLoading || !sessionReady}
                  >
                    {isLoading ? "Salvataggio..." : "Imposta Nuova Password"}
                    {!isLoading && <ArrowRight className="ml-2 w-4 h-4" />}
                  </Button>
                </form>
              </>
            )}

            <div className="pt-2">
              <Link href="/login" className="text-[10px] font-black text-muted-foreground/40 hover:text-primary transition-all uppercase tracking-[0.4em]">
                ← Torna al Login
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      <Footer />
    </main>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  )
}
