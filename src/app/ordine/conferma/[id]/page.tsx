"use client"

import { useParams } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import { createClient } from "@/lib/supabase/client"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"
import {
  CheckCircle2,
  ShoppingBag,
  MapPin,
  Clock,
  ArrowRight,
  Printer,
  Mail,
  Home,
  Loader2,
  Package,
  Truck,
  XCircle,
} from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useSettings } from "@/hooks/useSettings"

interface OrderData {
  id: string
  order_number: string
  customer_name: string
  customer_email: string
  customer_phone: string
  type: "pickup" | "delivery"
  delivery_address: any
  subtotal: number
  delivery_fee: number
  total: number
  status: string
  created_at: string
  order_items: {
    id: string
    product_name: string
    variant_label: string | null
    quantity: number
    unit_price: number
    total_price: number
  }[]
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("it-IT", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function OrderConfirmationPage() {
  const params = useParams()
  const orderId = params.id as string
  const supabase = createClient()
  const printRef = useRef<HTMLDivElement>(null)

  const [order, setOrder] = useState<OrderData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const { getSettings } = useSettings()
  const settings = getSettings.data || {}
  const shopName = settings.shop_name || "DetersiviParty"
  const shopAddress = settings.shop_address || "Via del Commercio, 123, 00100 Roma (RM)"
  const shopPhone = settings.contact_phone || "+39 06 123 4567"
  const shopEmail = settings.contact_email || "info@detersiviparty.it"

  useEffect(() => {
    if (!orderId) return
    supabase
      .from("orders")
      .select(`*, order_items(*)`)
      .eq("id", orderId)
      .single()
      .then(({ data, error }) => {
        if (error) setError("Ordine non trovato.")
        else setOrder(data as OrderData)
        setLoading(false)
      })
  }, [orderId])

  const handlePrint = () => {
    window.print()
  }

  if (loading) {
    return (
      <main className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
        <Footer />
      </main>
    )
  }

  if (error || !order) {
    return (
      <main className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <div className="flex-grow flex flex-col items-center justify-center gap-4 text-center p-6">
          <p className="text-xl font-bold text-destructive">{error ?? "Ordine non trovato."}</p>
          <Link href="/account"><Button>Vai ai miei ordini</Button></Link>
        </div>
        <Footer />
      </main>
    )
  }

  const isDelivery = order.type === "delivery"

  const getStatusConfig = () => {
    switch (order.status) {
      case "received":
        return {
          bgClass: "bg-blue-500",
          icon: <ShoppingBag className="w-10 h-10 text-blue-500" />,
          title: "Ordine Ricevuto!",
          message: "Il tuo ordine è stato ricevuto ed è in attesa di essere elaborato."
        }
      case "preparing":
        return {
          bgClass: "bg-amber-500",
          icon: <Package className="w-10 h-10 text-amber-500" />,
          title: "In Preparazione",
          message: "Stiamo preparando il tuo ordine proprio adesso!"
        }
      case "ready":
        return {
          bgClass: "bg-success",
          icon: <CheckCircle2 className="w-10 h-10 text-success" />,
          title: "Ordine Pronto!",
          message: "Il tuo ordine è pronto per il ritiro in negozio."
        }
      case "delivering":
        return {
          bgClass: "bg-indigo-500",
          icon: <Truck className="w-10 h-10 text-indigo-500" />,
          title: "In Consegna!",
          message: "Il corriere è in viaggio verso di te."
        }
      case "completed":
        return {
          bgClass: "bg-secondary",
          icon: <CheckCircle2 className="w-10 h-10 text-muted-foreground" />,
          title: "Ordine Completato",
          message: "Questo ordine è stato completato con successo."
        }
      case "cancelled":
        return {
          bgClass: "bg-destructive",
          icon: <XCircle className="w-10 h-10 text-destructive" />,
          title: "Ordine Annullato",
          message: "Questo ordine è stato annullato."
        }
      default:
        return {
          bgClass: "bg-primary",
          icon: <ShoppingBag className="w-10 h-10 text-primary" />,
          title: "Ordine Inviato!",
          message: "Lo stato del tuo ordine è sconosciuto."
        }
    }
  }

  const config = getStatusConfig()

  return (
    <>
      {/* ── Print-only receipt styles ─────────────────────────── */}
      <style>{`
        @media print {
          html, body {
            height: auto !important;
            min-height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          body * { visibility: hidden !important; }
          #print-receipt, #print-receipt * { visibility: visible !important; }
          .no-print { display: none !important; }
          #print-receipt {
            position: absolute !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            padding: 32px !important;
            background: white !important;
            font-family: Arial, sans-serif !important;
          }
          tr { page-break-inside: avoid !important; }
        }
      `}</style>

      <main className="flex flex-col min-h-screen bg-background">
        <Navbar />

        <div className="flex-grow pt-32 pb-24 px-4 overflow-hidden">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[2.5rem] border border-border/50 shadow-2xl overflow-hidden"
            >
              {/* ── Success Header (no-print on actual receipt) ── */}
              <div className={`${config.bgClass} p-12 text-center space-y-4 relative no-print overflow-hidden`}>
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                  <div className="absolute -top-24 -left-24 w-64 h-64 bg-white rounded-full blur-3xl" />
                  <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white rounded-full blur-3xl delay-700" />
                </div>
                <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto border-2 border-white/30 shadow-xl z-10 relative">
                  {config.icon}
                </div>
                <h1 className={`text-4xl font-heading font-black tracking-tighter relative z-10 ${order.status === 'completed' ? 'text-foreground' : 'text-white'}`}>{config.title}</h1>
                <p className={`font-bold uppercase tracking-widest text-xs relative z-10 ${order.status === 'completed' ? 'text-muted-foreground' : 'text-white/80'}`}>
                  Numero Ordine: {order.order_number}
                </p>
              </div>

              {/* ── Printable Receipt ────────────────────────────── */}
              <div id="print-receipt" ref={printRef}>
                {/* Receipt header (visible only in print) */}
                <div className="hidden print:block text-center pb-6 border-b-2 border-black mb-6">
                  <h1 className="text-2xl font-black uppercase">{shopName}</h1>
                  <p className="text-sm text-gray-600">{shopAddress}</p>
                  <p className="text-sm text-gray-600">Tel: {shopPhone} | {shopEmail}</p>
                  <div className="mt-3">
                    <p className="font-bold text-xl">RICEVUTA ORDINE</p>
                    <p className="font-mono text-lg font-black">{order.order_number}</p>
                    <p className="text-sm text-gray-500">{formatDate(order.created_at)}</p>
                  </div>
                </div>

                <div className="p-8 md:p-12 space-y-10">
                  {/* Customer info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-border/30 pb-8">
                    <div className="space-y-2">
                      <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Cliente</p>
                      <p className="font-bold text-lg">{order.customer_name}</p>
                      <p className="text-sm text-muted-foreground">{order.customer_email}</p>
                      <p className="text-sm text-muted-foreground">{order.customer_phone}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
                        {isDelivery ? "Consegna a" : "Ritiro in Negozio"}
                      </p>
                      {isDelivery ? (
                        <>
                          <p className="font-bold">{order.delivery_address?.street}</p>
                          <p className="text-sm text-muted-foreground">{order.delivery_address?.city}</p>
                        </>
                      ) : (
                        <>
                          <p className="font-bold">Via Roma 123</p>
                          <p className="text-sm text-muted-foreground">Santa Margherita Ligure (GE)</p>
                          <p className="text-sm text-muted-foreground">Lun–Sab 9:00–19:00</p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Items table */}
                  <div className="space-y-4">
                    <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">Prodotti Ordinati</p>
                    <div className="rounded-2xl border border-border/50 overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-secondary/30">
                          <tr>
                            <th className="text-left p-4 font-black text-xs uppercase tracking-wider">Prodotto</th>
                            <th className="text-center p-4 font-black text-xs uppercase tracking-wider">Q.tà</th>
                            <th className="text-right p-4 font-black text-xs uppercase tracking-wider">Prezzo</th>
                            <th className="text-right p-4 font-black text-xs uppercase tracking-wider">Totale</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/30">
                          {order.order_items.map((item) => (
                            <tr key={item.id} className="hover:bg-secondary/10 transition-colors">
                              <td className="p-4">
                                <span className="font-bold">{item.product_name}</span>
                                {item.variant_label && (
                                  <span className="block text-xs text-muted-foreground">{item.variant_label}</span>
                                )}
                              </td>
                              <td className="p-4 text-center font-mono font-bold">{item.quantity}</td>
                              <td className="p-4 text-right text-muted-foreground">€{Number(item.unit_price).toFixed(2)}</td>
                              <td className="p-4 text-right font-bold">€{Number(item.total_price).toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Totals */}
                    <div className="space-y-2 ml-auto max-w-xs">
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Subtotale</span>
                        <span>€{Number(order.subtotal).toFixed(2)}</span>
                      </div>
                      {Number(order.delivery_fee) > 0 && (
                        <div className="flex justify-between text-sm text-muted-foreground">
                          <span>Spedizione</span>
                          <span>€{Number(order.delivery_fee).toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-xl font-heading font-black border-t border-border pt-3 mt-2">
                        <span>Totale</span>
                        <span className="text-primary">€{Number(order.total).toFixed(2)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground text-right">
                        Pagamento al {isDelivery ? "momento della consegna" : "ritiro"}
                      </p>
                    </div>
                  </div>

                  {/* Next steps (no-print) */}
                  <div className="bg-secondary/20 rounded-3xl p-8 space-y-6 no-print">
                    <h4 className="font-heading font-black uppercase text-xs tracking-widest text-muted-foreground text-center">Cosa succede ora?</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        { icon: Mail, label: "Controlla l'Email", text: "Riceverai aggiornamenti sullo stato." },
                        { icon: Package, label: "Preparazione", text: "Verifichiamo lo stock e prepariamo tutto." },
                        { icon: ShoppingBag, label: isDelivery ? "Consegna" : "Ritiro", text: "Ti avviseremo quando sarà pronto." },
                      ].map((step, idx) => (
                        <div key={idx} className="text-center space-y-2">
                          <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center mx-auto text-primary border border-border/50">
                            <step.icon className="w-5 h-5" />
                          </div>
                          <p className="font-bold text-xs">{step.label}</p>
                          <p className="text-[10px] text-muted-foreground leading-relaxed">{step.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Signature line (print only) */}
                  <div className="hidden print:flex justify-between pt-12 border-t border-black text-xs text-gray-500">
                    <span>Firma del cliente: _______________________</span>
                    <span>DetersiviParty — {new Date().getFullYear()}</span>
                  </div>

                  {/* Actions (no-print) */}
                  <div className="flex flex-col sm:flex-row gap-4 no-print">
                    <Link href="/account/ordini" className="flex-grow">
                      <Button variant="outline" size="lg" className="w-full h-14 rounded-xl font-bold border-2">
                        <ArrowRight className="w-5 h-5 mr-3 rotate-180" />
                        Vai ai Miei Ordini
                      </Button>
                    </Link>
                    <Link href="/" className="flex-grow">
                      <Button size="lg" className="w-full h-14 rounded-xl font-bold shadow-xl">
                        <Home className="w-5 h-5 mr-3" />
                        Torna alla Home
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* ── Print Button ──────────────────────────────────── */}
              <div className="bg-secondary/10 p-6 border-t border-border/30 text-center no-print">
                <button
                  onClick={handlePrint}
                  className="text-sm font-bold text-muted-foreground hover:text-primary transition-all flex items-center justify-center mx-auto gap-2 group"
                >
                  <Printer className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Stampa Ricevuta / Salva PDF
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        <Footer />
      </main>
    </>
  )
}
