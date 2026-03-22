"use client"

import { ShoppingBag, Search, ChevronRight, Package, Clock, CheckCircle2, Truck, Store } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useOrders } from "@/hooks/useOrders"
import { useAuth } from "@/hooks/useAuth"

export default function AccountOrdersPage() {
  const { user } = useAuth()
  const { getMyOrders } = useOrders()
  const { data: orders } = getMyOrders(user?.id || "")

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <h2 className="text-3xl font-heading font-extrabold tracking-tight">I Miei Ordini</h2>
           <p className="text-muted-foreground">Visualizza lo storico e traccia i tuoi ordini in tempo reale.</p>
        </div>
        <div className="relative w-full md:w-72">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
           <Input placeholder="Cerca ordine..." className="pl-10 h-11 rounded-xl" />
        </div>
      </div>

      <div className="space-y-4">
         {(orders || []).map((order) => (
           <div key={order.id} className="bg-white rounded-3xl border border-border/50 shadow-sm overflow-hidden group hover:shadow-md transition-all">
              <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
                 {/* Order Info */}
                 <div className="flex-grow space-y-6">
                    <div className="flex justify-between items-start">
                       <div className="space-y-1">
                          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Ordine #{order.order_number}</p>
                          <h3 className="text-xl font-heading font-extrabold">{new Date(order.created_at).toLocaleDateString()}</h3>
                       </div>
                       <div className="flex items-center text-xs font-bold px-3 py-1 bg-secondary rounded-full">
                          {order.status === 'completed' ? <CheckCircle2 className="w-3.5 h-3.5 mr-2 text-success" /> : <Package className="w-3.5 h-3.5 mr-2" />}
                          {order.status}
                       </div>
                    </div>

                    <div className="flex flex-wrap gap-4">
                       <div className="flex items-center text-sm font-medium p-3 bg-secondary/30 rounded-2xl">
                          {order.delivery_method === 'home' ? <Truck className="w-4 h-4 mr-2 text-primary" /> : <Store className="w-4 h-4 mr-2 text-primary" />}
                          {order.delivery_method === 'home' ? "Consegna Locale" : "Ritiro in Negozio"}
                       </div>
                       <div className="flex items-center text-sm font-bold p-3 bg-primary/5 text-primary rounded-2xl border border-primary/10">
                          Totale: €{Number(order.total).toFixed(2)}
                       </div>
                    </div>
                 </div>

                 {/* Order Preview Items */}
                 <div className="md:w-64 space-y-4 flex flex-col justify-center border-t md:border-t-0 md:border-l border-border/30 pt-6 md:pt-0 md:pl-8">
                    <Link href={`/ordine/conferma/${order.id}`}>
                      <Button variant="outline" className="w-full font-bold h-11 rounded-xl">Dettagli Ordine</Button>
                    </Link>
                 </div>
              </div>
           </div>
         ))}
         {(!orders || orders.length === 0) && (
           <div className="bg-white rounded-3xl border border-border/50 shadow-sm p-12 text-center text-muted-foreground font-medium">
              Non hai ancora effettuato ordini.
           </div>
         )}
      </div>
    </div>
  )
}
