"use client"

import { useState, useEffect } from "react"
import { useCart } from "@/hooks/useCart"
import { useAuth } from "@/hooks/useAuth"
import { AuthModal } from "@/components/shared/AuthModal"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ShoppingBag, Truck, Store, ArrowRight, ArrowLeft, CheckCircle2, LogIn } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { useOrders } from "@/hooks/useOrders"
import Link from "next/link"

type CheckoutStep = "review" | "details" | "confirm"

export default function CheckoutPage() {
  const { items, getTotal, clearCart } = useCart()
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const [step, setStep] = useState<CheckoutStep>("review")
  const [orderType, setOrderType] = useState<"pickup" | "delivery">("pickup")
  const [showAuthModal, setShowAuthModal] = useState(false)
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    notes: ""
  })

  // Pre-fill name and email from user profile
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.user_metadata?.full_name ?? prev.name,
        email: user.email ?? prev.email,
      }))
    }
  }, [user])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleNext = () => {
    if (!user) {
      setShowAuthModal(true)
      return
    }
    if (step === "review") setStep("details")
    else if (step === "details") setStep("confirm")
  }

  const handleBack = () => {
    if (step === "details") setStep("review")
    else if (step === "confirm") setStep("details")
  }

  const { createOrder } = useOrders()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (isSubmitting) return
    setIsSubmitting(true)
    try {
      const orderData = {
        user_id: user?.id ?? null,
        customer_name: formData.name,
        customer_email: formData.email,
        customer_phone: formData.phone,
        type: orderType,
        delivery_address: orderType === 'delivery'
          ? { street: formData.address, city: formData.city }
          : {},
        subtotal: getTotal(),
        total: getTotal(),
        items: items.map(item => ({
          product_id: item.product.id,
          product_name: item.product.name,
          quantity: item.quantity,
          unit_price: Number(item.product.price),
          total_price: Number(item.product.price) * item.quantity
        }))
      }

      const res = await createOrder.mutateAsync(orderData as any)
      clearCart()
      router.push(`/ordine/conferma/${res.id}`)
    } catch (error: any) {
      console.error("Order submission failed:", error)
      const msg = error?.message ?? "Errore sconosciuto"
      alert(`Errore durante l'invio dell'ordine: ${msg}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0 && step !== "confirm") {
    return (
      <main className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center p-6 text-center space-y-6">
           <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-muted-foreground" />
           </div>
           <div className="space-y-2">
              <h1 className="text-3xl font-heading font-bold">Il carrello è vuoto</h1>
              <p className="text-muted-foreground">Devi aggiungere dei prodotti prima di procedere al checkout.</p>
           </div>
           <Link href="/catalogo">
              <Button size="lg" className="h-14 px-8 font-bold">Torna al Catalogo</Button>
           </Link>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="flex flex-col min-h-screen bg-background">
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false)
          setStep("details")
        }}
      />
      <Navbar />
      
      <div className="flex-grow pt-32 pb-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex justify-between items-center relative">
               <div className="absolute top-1/2 left-0 w-full h-0.5 bg-secondary -translate-y-1/2 z-0" />
               <div 
                  className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 z-0 transition-all duration-500" 
                  style={{ width: step === "review" ? "0%" : step === "details" ? "50%" : "100%" }}
               />
               
               {[
                 { id: "review", label: "Riepilogo", icon: ShoppingBag },
                 { id: "details", label: "Dati & Modalità", icon: Truck },
                 { id: "confirm", label: "Conferma", icon: CheckCircle2 }
               ].map((s, i) => {
                 const Icon = s.icon
                 const isActive = step === s.id
                 const isCompleted = (step === "details" && i === 0) || (step === "confirm" && i < 2)
                 
                 return (
                   <div key={s.id} className="relative z-10 flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-500 ${
                        isActive || isCompleted ? "bg-primary text-primary-foreground shadow-lg" : "bg-bg-secondary text-muted-foreground border-2 border-secondary"
                      }`}>
                         <Icon className="w-5 h-5" />
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider mt-2 ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                        {s.label}
                      </span>
                   </div>
                 )
               })}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === "review" && (
              <motion.div
                key="review"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="bg-white rounded-3xl border border-border/50 shadow-sm overflow-hidden">
                  <div className="p-6 border-b bg-secondary/10">
                    <h2 className="text-xl font-heading font-bold">Riepilogo Prodotti</h2>
                  </div>
                  <div className="p-6 space-y-6">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-secondary rounded-xl overflow-hidden shrink-0 border border-border/50">
                          {Array.isArray(item.product.images) && item.product.images.length > 0 ? (
                            <img src={item.product.images[0] as string} alt={item.product.name} className="w-full h-full object-cover" />
                          ) : <div className="w-full h-full flex items-center justify-center text-[10px] italic">No image</div>}
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-bold text-sm leading-tight">{item.product.name}</h3>
                          <p className="text-xs text-muted-foreground">Quantità: {item.quantity}</p>
                        </div>
                        <p className="font-bold">€{(Number(item.product.price) * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                    <div className="pt-6 border-t space-y-2">
                       <div className="flex justify-between font-heading font-extrabold text-2xl">
                          <span>Totale</span>
                          <span className="text-primary">€{getTotal().toFixed(2)}</span>
                       </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button size="lg" className="h-14 px-10 font-bold group shadow-xl" onClick={handleNext}>
                    Continua
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === "details" && (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Customer Info */}
                  <div className="bg-white rounded-3xl border border-border/50 shadow-sm overflow-hidden h-fit">
                    <div className="p-6 border-b bg-secondary/10">
                      <h2 className="text-xl font-heading font-bold">I Tuoi Dati</h2>
                    </div>
                    <div className="p-6 space-y-4">
                       <div className="space-y-2">
                          <Label htmlFor="name">Nome Completo</Label>
                          <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Mario Rossi" />
                       </div>
                       <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="mario@esempio.it" />
                       </div>
                       <div className="space-y-2">
                          <Label htmlFor="phone">Telefono</Label>
                          <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="333 1234567" />
                       </div>
                    </div>
                  </div>

                  {/* Order Mode */}
                  <div className="bg-white rounded-3xl border border-border/50 shadow-sm overflow-hidden h-fit">
                    <div className="p-6 border-b bg-secondary/10">
                      <h2 className="text-xl font-heading font-bold">Modalità</h2>
                    </div>
                    <div className="p-6 space-y-6">
                       <RadioGroup value={orderType} onValueChange={(v: any) => setOrderType(v)} className="grid grid-cols-1 gap-4">
                          <Label
                            htmlFor="pickup"
                            className={`flex items-center space-x-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                              orderType === "pickup" ? "border-primary bg-primary/5" : "border-border/50 hover:bg-secondary/50"
                            }`}
                          >
                            <RadioGroupItem value="pickup" id="pickup" className="sr-only" />
                            <Store className={`w-6 h-6 ${orderType === "pickup" ? "text-primary" : "text-muted-foreground"}`} />
                            <div className="flex-grow">
                               <p className="font-bold">Ritiro in Negozio</p>
                               <p className="text-xs text-muted-foreground">Gratuito • Disponibile in 2 ore</p>
                            </div>
                          </Label>

                          <Label
                            htmlFor="delivery"
                            className={`flex items-center space-x-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                              orderType === "delivery" ? "border-primary bg-primary/5" : "border-border/50 hover:bg-secondary/50"
                            }`}
                          >
                            <RadioGroupItem value="delivery" id="delivery" className="sr-only" />
                            <Truck className={`w-6 h-6 ${orderType === "delivery" ? "text-primary" : "text-muted-foreground"}`} />
                            <div className="flex-grow">
                               <p className="font-bold">Consegna Locale</p>
                               <p className="text-xs text-muted-foreground">Gratuita • Solo zone limitrofe</p>
                            </div>
                          </Label>
                       </RadioGroup>

                       {orderType === "delivery" && (
                         <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-4 pt-4 border-t">
                            <div className="space-y-2">
                              <Label htmlFor="address">Indirizzo di Consegna</Label>
                              <Input id="address" name="address" value={formData.address} onChange={handleInputChange} placeholder="Via Roma, 123" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="city">Città</Label>
                              <Input id="city" name="city" value={formData.city} onChange={handleInputChange} placeholder="Città (S. Margherita B.)" />
                            </div>
                         </motion.div>
                       )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <Button variant="ghost" onClick={handleBack} className="font-bold">
                    <ArrowLeft className="mr-2 w-4 h-4" /> Indietro
                  </Button>
                  <Button size="lg" className="h-14 px-10 font-bold group shadow-xl" onClick={handleNext}>
                    Vai al Riepilogo Finale
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === "confirm" && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8 text-center"
              >
                <div className="bg-white rounded-3xl border border-border/50 shadow-2xl overflow-hidden p-12 space-y-8">
                   <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-12 h-12 text-success" />
                   </div>
                   <div className="space-y-4">
                      <h2 className="text-4xl font-heading font-extrabold tracking-tight">Conferma il Tuo Ordine</h2>
                      <p className="text-muted-foreground max-w-md mx-auto text-lg leading-relaxed">
                        Controlla che tutti i dati siano corretti. Riceverai un'email con il riepilogo del tuo ordine.
                      </p>
                   </div>
                   
                   <div className="bg-secondary/10 rounded-2xl p-8 space-y-4 max-w-lg mx-auto text-left border border-border/30">
                      <div className="flex justify-between items-center border-b border-border/50 pb-4">
                         <span className="text-sm font-bold uppercase text-muted-foreground">Metodo</span>
                         <span className="font-bold">{orderType === "pickup" ? "Ritiro in Negozio" : "Consegna Locale"}</span>
                      </div>
                      <div className="flex justify-between items-center border-b border-border/50 pb-4">
                         <span className="text-sm font-bold uppercase text-muted-foreground">Destinatario</span>
                         <span className="font-bold">{formData.name}</span>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                         <span className="font-heading font-extrabold text-2xl">Totale da Pagare</span>
                         <span className="font-heading font-extrabold text-2xl text-primary">€{getTotal().toFixed(2)}</span>
                      </div>
                   </div>

                   <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                     <Button variant="outline" size="lg" onClick={handleBack} disabled={isSubmitting} className="h-14 px-8 font-bold">Modifica Dati</Button>
                     <Button size="lg" onClick={handleSubmit} disabled={isSubmitting} className="h-14 px-12 font-bold shadow-xl">
                       {isSubmitting ? 'Invio in corso…' : 'Invia Ordine'}
                     </Button>
                   </div>
                   
                   <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                     Cliccando su "Invia Ordine" accetti di pagare l'importo totale al momento del ritiro o della consegna.
                   </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Footer />
    </main>
  )
}
