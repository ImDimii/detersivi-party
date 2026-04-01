"use client"

import { ShoppingBag, Search, ChevronRight, Package, Clock, CheckCircle2, Truck, Store } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CustomModal } from "@/components/ui/CustomModal"
import Link from "next/link"
import { useState } from "react"
import { useOrders } from "@/hooks/useOrders"
import { useAuth } from "@/hooks/useAuth"

export default function AccountOrdersPage() {
  const { user } = useAuth()
  const { getMyOrders, updateOrderStatus } = useOrders()
  const { data: orders } = getMyOrders(user?.id || "")
  const [cancelId, setCancelId] = useState<string | null>(null)

  const handleCancelClick = (id: string) => {
    setCancelId(id)
  }

  const handleConfirmCancel = async () => {
    if (!cancelId) return
    try {
      await updateOrderStatus.mutateAsync({ id: cancelId, status: 'cancelled' })
      setCancelId(null)
    } catch (e) {
      alert("Errore durante l'annullamento dell'ordine.")
    }
  }

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
              <div className="p-5 md:p-6 flex flex-col md:flex-row gap-6">
                 {/* Order Info */}
                 <div className="flex-grow space-y-6">
                    <div className="flex justify-between items-start">
                       <div className="space-y-1">
                          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Ordine {order.order_number}</p>
                          <h3 className="text-xl font-heading font-extrabold">{new Date(order.created_at).toLocaleDateString()}</h3>
                       </div>
                       <div className={`flex items-center text-[10px] uppercase font-bold px-3 py-1.5 rounded-full border ${
                          order.status === 'preparing' ? 'bg-amber-500/10 text-amber-600 border-amber-200' :
                          order.status === 'ready' ? 'bg-success/10 text-success border-success/20' :
                          order.status === 'delivering' ? 'bg-indigo-500/10 text-indigo-600 border-indigo-200' :
                          order.status === 'completed' ? 'bg-secondary text-muted-foreground border-border/50' :
                          order.status === 'cancelled' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                          'bg-blue-500/10 text-blue-600 border-blue-200'
                       }`}>
                          {order.status === 'completed' ? <CheckCircle2 className="w-3.5 h-3.5 mr-2" /> : <Package className="w-3.5 h-3.5 mr-2" />}
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
                 <div className="md:w-64 space-y-4 flex flex-col justify-center border-t md:border-t-0 md:border-l border-border/30 pt-4 md:pt-0 md:pl-6">
                    <Link href={`/ordine/conferma/${order.id}`}>
                      <Button variant="outline" className="w-full font-bold h-10 rounded-xl">Dettagli</Button>
                    </Link>
                    {order.status !== 'cancelled' && order.status !== 'completed' && (Date.now() - new Date(order.created_at).getTime()) < 24 * 60 * 60 * 1000 && (
                      <Button 
                        variant="ghost" 
                        className="w-full font-bold h-11 rounded-xl text-destructive hover:bg-destructive/10"
                        onClick={() => handleCancelClick(order.id)}
                        disabled={updateOrderStatus.isPending}
                      >
                        {updateOrderStatus.isPending ? "Annullamento..." : "Annulla Ordine"}
                      </Button>
                    )}
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

      <CustomModal
        isOpen={!!cancelId}
        onClose={() => setCancelId(null)}
        onConfirm={handleConfirmCancel}
        title="Annulla Ordine"
        description="Vuoi davvero annullare questo ordine? L'azione è irreversibile e i prodotti torneranno disponibili a catalogo."
        confirmText="Conferma Annullamento"
        variant="destructive"
        isLoading={updateOrderStatus.isPending}
      />
    </div>
  )
}
