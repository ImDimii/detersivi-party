"use client"

import { useState } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Mail, Lock, User, Phone, ArrowRight, Eye, EyeOff, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/useToast"
import { cn } from "@/lib/utils"

export default function LoginPage() {
  const { addToast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"login" | "register">("login")
  const router = useRouter()
  const supabase = createClient()

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
        router.push("/account")
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
              phone: phone,
            },
          },
        })
        if (error) throw error
        addToast("Registrazione completata! Controlla la tua email.", "success", 6000)
      }
    } catch (err: any) {
      const msg = err.message === "Invalid login credentials" ? "Email o password non validi." : err.message
      setError(msg)
      addToast(msg, "error")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex flex-col min-h-screen bg-[#fafafa]">
      <Navbar />
      
      <div className="flex-grow flex items-center justify-center pt-32 pb-24 px-4 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-success/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />

        <div className="w-full max-w-[420px] relative">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2.5rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] border border-border/40 overflow-hidden"
          >
            {/* Custom Tabs List at the very top */}
            <div className="flex border-b border-border/40">
              <button 
                onClick={() => setActiveTab("login")}
                className={cn(
                  "flex-1 py-5 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative mt-2",
                  activeTab === 'login' ? "text-primary" : "text-muted-foreground/50 hover:text-muted-foreground"
                )}
              >
                Accedi
                {activeTab === 'login' && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-1/4 right-1/4 h-1 bg-primary rounded-full" />
                )}
              </button>
              <button 
                onClick={() => setActiveTab("register")}
                className={cn(
                  "flex-1 py-5 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative mt-2",
                  activeTab === 'register' ? "text-primary" : "text-muted-foreground/50 hover:text-muted-foreground"
                )}
              >
                Unisciti
                {activeTab === 'register' && (
                  <motion.div layoutId="activeTab" className="absolute bottom-0 left-1/4 right-1/4 h-1 bg-primary rounded-full" />
                )}
              </button>
            </div>

            <div className="p-10 space-y-8 text-center">
              <div className="space-y-3">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner ring-4 ring-white">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-4xl font-heading font-black tracking-tight text-foreground uppercase italic px-4">
                  {activeTab === 'login' ? 'Bentornato' : 'Benvenuto'}
                </h1>
                <p className="text-muted-foreground text-[10px] font-black uppercase tracking-[0.15em] opacity-80">
                  {activeTab === 'login' ? 'Accesso riservato ai clienti' : 'Crea il tuo profilo DetersiviParty'}
                </p>
              </div>

              <AnimatePresence mode="wait">
                {activeTab === 'login' ? (
                  <motion.form 
                    key="login-form"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={(e) => handleAuth(e, "login")} 
                    className="space-y-6 text-left"
                  >
                    {error && (
                      <div className="p-4 bg-destructive/5 border border-destructive/10 rounded-2xl text-destructive text-[10px] font-black uppercase tracking-widest text-center">
                        {error}
                      </div>
                    )}
                    
                    <div className="space-y-5">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Indirizzo Email</Label>
                        <div className="relative group">
                           <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                           <Input name="email" type="email" placeholder="mario@esempio.it" className="pl-12 h-14 rounded-2xl border-2 border-secondary bg-secondary/10 focus:bg-white focus:border-primary/50 transition-all font-bold" required />
                        </div>
                      </div>

                      <div className="space-y-2">
                         <div className="flex justify-between items-center px-1">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Password</Label>
                            <button type="button" className="text-[10px] font-black text-primary hover:underline uppercase">Persa?</button>
                         </div>
                        <div className="relative group">
                           <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
                           <Input 
                             name="password" 
                             type={showPassword ? "text" : "password"} 
                             placeholder="••••••••" 
                             className="pl-12 pr-12 h-14 rounded-2xl border-2 border-secondary bg-secondary/10 focus:bg-white focus:border-primary/50 transition-all font-bold" 
                             required 
                           />
                           <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-foreground">
                              {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                           </button>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3 px-1">
                         <Checkbox id="remember" className="w-5 h-5 rounded-md border-2" />
                         <label htmlFor="remember" className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest cursor-pointer select-none">Resta collegato</label>
                      </div>
                    </div>

                    <Button type="submit" className="w-full h-15 text-xs font-black uppercase tracking-widest rounded-2xl shadow-[0_20px_40px_-12px_rgba(var(--primary),0.3)] bg-primary hover:bg-primary/90 transition-all active:scale-[0.98]" disabled={isLoading}>
                      {isLoading ? "Entrata..." : "Accedi Ora"}
                      {!isLoading && <ArrowRight className="ml-2 w-5 h-5" />}
                    </Button>
                  </motion.form>
                ) : (
                  <motion.form 
                    key="register-form"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    onSubmit={(e) => handleAuth(e, "register")} 
                    className="space-y-5 text-left"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Nome</Label>
                        <Input name="first-name" placeholder="Mario" className="h-13 rounded-2xl border-2 border-secondary bg-secondary/10 focus:bg-white font-bold transition-all" required />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Cognome</Label>
                        <Input name="last-name" placeholder="Rossi" className="h-13 rounded-2xl border-2 border-secondary bg-secondary/10 focus:bg-white font-bold transition-all" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Email</Label>
                       <Input name="email" type="email" placeholder="mario@esempio.it" className="h-13 rounded-2xl border-2 border-secondary bg-secondary/10 focus:bg-white font-bold transition-all" required />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Telefono</Label>
                       <Input name="phone" placeholder="333 1234567" className="h-13 rounded-2xl border-2 border-secondary bg-secondary/10 focus:bg-white font-bold transition-all" required />
                    </div>
                    <div className="space-y-2">
                       <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Password</Label>
                       <Input name="password" type="password" placeholder="Minimo 8 caratteri" className="h-13 rounded-2xl border-2 border-secondary bg-secondary/10 focus:bg-white font-bold transition-all" required />
                    </div>
                    <Button type="submit" className="w-full h-15 text-xs font-black uppercase tracking-widest rounded-2xl shadow-[0_20px_40px_-12px_rgba(var(--primary),0.3)] bg-primary hover:bg-primary/90 transition-all active:scale-[0.98] mt-4" disabled={isLoading}>
                       {isLoading ? "Creazione..." : "Crea Account"}
                       {!isLoading && <ArrowRight className="ml-2 w-5 h-5" />}
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
          
          <div className="mt-12 text-center">
             <Link href="/" className="text-[10px] font-black text-muted-foreground/40 hover:text-primary transition-all uppercase tracking-[0.4em]">
                ← Torna alla Home
             </Link>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
