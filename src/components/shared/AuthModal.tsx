"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Lock, User, Phone, ArrowRight, Eye, EyeOff, Sparkles, X, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/useToast"

type AuthTab = "login" | "register" | "forgot"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  /** Called after successful login/register */
  onSuccess?: () => void
  /** Pre-select a tab */
  defaultTab?: AuthTab
}

export function AuthModal({ isOpen, onClose, onSuccess, defaultTab = "login" }: AuthModalProps) {
  const { addToast } = useToast()
  const [tab, setTab] = useState<AuthTab>(defaultTab)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [forgotSent, setForgotSent] = useState(false)
  const [registerDone, setRegisterDone] = useState(false)
  const supabase = createClient()

  const resetState = () => {
    setError(null)
    setForgotSent(false)
    setRegisterDone(false)
    setIsLoading(false)
  }

  const switchTab = (t: AuthTab) => {
    resetState()
    setTab(t)
  }

  const handleAuth = async (e: React.FormEvent, type: "login" | "register") => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    const formData = new FormData(e.currentTarget as HTMLFormElement)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      if (type === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        addToast("Bentornato! Accesso effettuato.", "success")
        onClose()
        onSuccess?.()
      } else {
        const firstName = formData.get("first-name") as string
        const lastName = formData.get("last-name") as string
        const phone = formData.get("phone") as string
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
              full_name: `${firstName} ${lastName}`,
              phone,
            },
          },
        })
        if (error) throw error
        // Don't call onSuccess yet — user must confirm email first
        setRegisterDone(true)
      }
    } catch (err: any) {
      const msg = err.message === "Invalid login credentials" ? "Email o password non validi." : err.message
      setError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    const formData = new FormData(e.currentTarget as HTMLFormElement)
    const email = formData.get("email") as string
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      if (error) throw error
      setForgotSent(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[200]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="w-full max-w-[420px] pointer-events-auto">
              <div className="bg-white rounded-[2.5rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.2)] border border-border/40 overflow-hidden relative">
                
                {/* Close button */}
                <button
                  onClick={onClose}
                  className="absolute top-5 right-5 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-secondary/60 hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Tabs */}
                <div className="flex border-b border-border/40">
                  {(["login", "register"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => switchTab(t)}
                      className={cn(
                        "flex-1 py-5 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative mt-2",
                        tab === t ? "text-primary" : "text-muted-foreground/50 hover:text-muted-foreground"
                      )}
                    >
                      {t === "login" ? "Accedi" : "Unisciti"}
                      {tab === t && !["forgot"].includes(tab) && (
                        <motion.div layoutId="authModalTab" className="absolute bottom-0 left-1/4 right-1/4 h-1 bg-primary rounded-full" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="p-10 space-y-7 text-center">
                  {/* Icon + Title */}
                  <div className="space-y-3">
                    <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto shadow-inner ring-4 ring-white">
                      <Sparkles className="w-7 h-7 text-primary" />
                    </div>
                    <h2 className="text-3xl font-heading font-black tracking-tight uppercase italic">
                      {tab === "login" ? "Bentornato" : tab === "register" ? "Benvenuto" : "Recupera Password"}
                    </h2>
                    <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.15em] opacity-70">
                      {tab === "login" ? "Accedi per completare l'ordine" : tab === "register" ? "Crea il tuo account DetersiviParty" : "Inserisci la tua email"}
                    </p>
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="p-3 bg-destructive/5 border border-destructive/10 rounded-2xl text-destructive text-[10px] font-black uppercase tracking-widest text-center">
                      {error}
                    </div>
                  )}

                  <AnimatePresence mode="wait">
                    {/* LOGIN */}
                    {tab === "login" && (
                      <motion.form
                        key="modal-login"
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        onSubmit={(e) => handleAuth(e, "login")}
                        className="space-y-5 text-left"
                      >
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Email</Label>
                          <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                            <Input name="email" type="email" placeholder="mario@esempio.it" className="pl-11 h-13 rounded-2xl border-2 border-secondary bg-secondary/10 focus:bg-white focus:border-primary/50 transition-all font-bold" required />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center px-1">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Password</Label>
                            <button type="button" onClick={() => switchTab("forgot")} className="text-[10px] font-black text-primary hover:underline uppercase">Persa?</button>
                          </div>
                          <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                            <Input name="password" type={showPassword ? "text" : "password"} placeholder="••••••••" className="pl-11 pr-11 h-13 rounded-2xl border-2 border-secondary bg-secondary/10 focus:bg-white focus:border-primary/50 transition-all font-bold" required />
                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-foreground">
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                        <Button type="submit" className="w-full h-13 text-xs font-black uppercase tracking-widest rounded-2xl shadow-lg" disabled={isLoading}>
                          {isLoading ? "Entrata..." : "Accedi Ora"}
                          {!isLoading && <ArrowRight className="ml-2 w-4 h-4" />}
                        </Button>
                      </motion.form>
                    )}

                    {/* REGISTER */}
                    {tab === "register" && (
                      registerDone ? (
                        <motion.div
                          key="modal-register-done"
                          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                          className="text-center space-y-5 py-2"
                        >
                          <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle2 className="w-8 h-8 text-success" />
                          </div>
                          <div className="space-y-2">
                            <p className="font-bold text-lg">Account creato!</p>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              Ti abbiamo inviato un'email di conferma.<br />
                              <span className="font-bold text-foreground">Clicca il link nell'email</span> per attivare il tuo account, poi torna qui e accedi per completare l'ordine.
                            </p>
                          </div>
                          <Button
                            className="w-full h-12 text-xs font-black uppercase tracking-widest rounded-2xl shadow-lg"
                            onClick={() => switchTab("login")}
                          >
                            Ho confermato, accedi →
                          </Button>
                        </motion.div>
                      ) : (
                      <motion.form
                        key="modal-register"
                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                        onSubmit={(e) => handleAuth(e, "register")}
                        className="space-y-4 text-left"
                      >
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1.5">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Nome</Label>
                            <Input name="first-name" placeholder="Mario" className="h-12 rounded-2xl border-2 border-secondary bg-secondary/10 focus:bg-white font-bold transition-all" required />
                          </div>
                          <div className="space-y-1.5">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Cognome</Label>
                            <Input name="last-name" placeholder="Rossi" className="h-12 rounded-2xl border-2 border-secondary bg-secondary/10 focus:bg-white font-bold transition-all" required />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Email</Label>
                          <Input name="email" type="email" placeholder="mario@esempio.it" className="h-12 rounded-2xl border-2 border-secondary bg-secondary/10 focus:bg-white font-bold transition-all" required />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Telefono</Label>
                          <Input name="phone" placeholder="333 1234567" className="h-12 rounded-2xl border-2 border-secondary bg-secondary/10 focus:bg-white font-bold transition-all" required />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Password</Label>
                          <Input name="password" type="password" placeholder="Minimo 8 caratteri" className="h-12 rounded-2xl border-2 border-secondary bg-secondary/10 focus:bg-white font-bold transition-all" required />
                        </div>
                        <Button type="submit" className="w-full h-13 text-xs font-black uppercase tracking-widest rounded-2xl shadow-lg mt-2" disabled={isLoading}>
                          {isLoading ? "Creazione..." : "Crea Account"}
                          {!isLoading && <ArrowRight className="ml-2 w-4 h-4" />}
                        </Button>
                      </motion.form>
                      )
                    )}

                    {/* FORGOT PASSWORD */}
                    {tab === "forgot" && (
                      <motion.div
                        key="modal-forgot"
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-5 text-left"
                      >
                        {forgotSent ? (
                          <div className="text-center space-y-4 py-4">
                            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                              <CheckCircle2 className="w-8 h-8 text-success" />
                            </div>
                            <div>
                              <p className="font-bold text-lg">Email inviata!</p>
                              <p className="text-sm text-muted-foreground mt-1">Controlla la tua casella e clicca sul link per reimpostare la password.</p>
                            </div>
                            <button onClick={() => switchTab("login")} className="text-[11px] font-black text-primary hover:underline uppercase tracking-widest">
                              ← Torna al login
                            </button>
                          </div>
                        ) : (
                          <form onSubmit={handleForgot} className="space-y-5">
                            <div className="space-y-2">
                              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">La tua Email</Label>
                              <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                                <Input name="email" type="email" placeholder="mario@esempio.it" className="pl-11 h-13 rounded-2xl border-2 border-secondary bg-secondary/10 focus:bg-white focus:border-primary/50 transition-all font-bold" required />
                              </div>
                            </div>
                            <Button type="submit" className="w-full h-13 text-xs font-black uppercase tracking-widest rounded-2xl shadow-lg" disabled={isLoading}>
                              {isLoading ? "Invio..." : "Invia Link di Reset"}
                              {!isLoading && <ArrowRight className="ml-2 w-4 h-4" />}
                            </Button>
                            <button type="button" onClick={() => switchTab("login")} className="w-full text-center text-[10px] font-black text-muted-foreground/50 hover:text-primary uppercase tracking-widest transition-colors">
                              ← Torna al login
                            </button>
                          </form>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
