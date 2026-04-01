"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { 
  ShoppingBag, 
  Search, 
  MoreVertical, 
  Eye, 
  Truck, 
  Store, 
  Clock, 
  CheckCircle2, 
  XCircle,
  AlertCircle,
  Filter,
  Download
} from "lucide-react"
import { useOrders } from "@/hooks/useOrders"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"

import { useToast } from "@/hooks/useToast"
import { CustomModal } from "@/components/ui/CustomModal"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export default function AdminOrdersPage() {
  const router = useRouter()
  const { getOrders, updateOrderStatus } = useOrders()
  const { addToast } = useToast()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null)
  const [isCancelling, setIsCancelling] = useState(false)

  const orders = getOrders.data || []
  
  const filteredOrders = orders.filter(o => {
    const matchesSearch = (o.customer_name?.toLowerCase().includes(search.toLowerCase()) || 
                          o.order_number?.toLowerCase().includes(search.toLowerCase()) ||
                          o.customer_email?.toLowerCase().includes(search.toLowerCase()))
    const matchesStatus = statusFilter === "all" ? true : o.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await updateOrderStatus.mutateAsync({ id, status: status as any })
      addToast(`Stato ordine aggiornato a: ${getStatusLabel(status)}`, "success")
    } catch (err: any) {
      addToast("Errore aggiornamento: " + err.message, "error")
    }
  }

  const handleCancelOrder = async () => {
    if (!orderToCancel) return
    setIsCancelling(true)
    try {
      await updateOrderStatus.mutateAsync({ id: orderToCancel, status: 'cancelled' })
      addToast("Ordine annullato", "success")
    } catch (err: any) {
      addToast("Errore annullamento: " + err.message, "error")
    } finally {
      setIsCancelling(false)
      setOrderToCancel(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "received": return "bg-blue-500/10 text-blue-600 border-blue-200"
      case "preparing": return "bg-amber-500/10 text-amber-600 border-amber-200"
      case "ready": return "bg-success/10 text-success border-success/20"
      case "delivering": return "bg-indigo-500/10 text-indigo-600 border-indigo-200"
      case "completed": return "bg-secondary text-muted-foreground border-border/50"
      case "cancelled": return "bg-destructive/10 text-destructive border-destructive/20"
      default: return "bg-secondary text-muted-foreground"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "received": return "Ricevuto"
      case "preparing": return "In Preparazione"
      case "ready": return "Pronto"
      case "delivering": return "In Consegna"
      case "completed": return "Completato"
      case "cancelled": return "Annullato"
      default: return status
    }
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
           <h1 className="text-4xl font-heading font-extrabold tracking-tight">Ordini</h1>
           <p className="text-muted-foreground">Gestisci le vendite e traccia lo stato della preparazione.</p>
        </div>
        <Button variant="outline" size="lg" className="h-14 px-8 font-bold rounded-xl border-2">
           <Download className="w-5 h-5 mr-3" />
           Esporta CSV
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-6 rounded-3xl border border-border/50 shadow-sm flex flex-col lg:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Cerca per numero ordine, nome cliente o email..." 
            className="pl-10 h-12 rounded-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
           <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v || "all")}>
              <SelectTrigger className="w-[180px] h-12 rounded-xl">
                 <SelectValue placeholder="Stato Ordine" />
              </SelectTrigger>
              <SelectContent className="bg-white border rounded-xl shadow-xl z-50 p-1">
                 <SelectItem value="all">Tutti gli stati</SelectItem>
                 <SelectItem value="received">Ricevuto</SelectItem>
                 <SelectItem value="preparing">In Preparazione</SelectItem>
                 <SelectItem value="ready">Pronto</SelectItem>
                 <SelectItem value="delivering">In Consegna</SelectItem>
                 <SelectItem value="completed">Completato</SelectItem>
                 <SelectItem value="cancelled">Annullato</SelectItem>
              </SelectContent>
           </Select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-border/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-secondary/10 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b">
                <th className="px-8 py-5">Ordine</th>
                <th className="px-6 py-5">Cliente</th>
                <th className="px-6 py-5">Modalità</th>
                <th className="px-6 py-5">Totale</th>
                <th className="px-6 py-5">Stato</th>
                <th className="px-8 py-5 text-right">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {getOrders.isLoading ? (
                 [1, 2, 3].map(i => (
                    <tr key={i} className="animate-pulse">
                       <td className="px-8 py-6"><div className="h-4 bg-secondary rounded w-24" /></td>
                       <td className="px-6 py-6"><div className="h-4 bg-secondary rounded w-32" /></td>
                       <td className="px-6 py-6"><div className="h-4 bg-secondary rounded w-20" /></td>
                       <td className="px-6 py-6"><div className="h-4 bg-secondary rounded w-16" /></td>
                       <td className="px-6 py-6"><div className="h-4 bg-secondary rounded w-20" /></td>
                       <td className="px-8 py-6 text-right"><div className="h-8 bg-secondary rounded w-8 ml-auto" /></td>
                    </tr>
                 ))
              ) : filteredOrders.map((order) => (
                <tr key={order.id} className={`transition-colors group ${
                  order.status === 'preparing' ? 'bg-amber-500/5 hover:bg-amber-500/10' :
                  order.status === 'ready' ? 'bg-success/5 hover:bg-success/10' :
                  order.status === 'delivering' ? 'bg-indigo-500/5 hover:bg-indigo-500/10' :
                  order.status === 'completed' ? 'bg-secondary/50 grayscale-[0.5] hover:bg-secondary/70' :
                  order.status === 'cancelled' ? 'bg-destructive/5 hover:bg-destructive/10 opacity-75' :
                  'hover:bg-secondary/5'
                }`}>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                       <p className="font-bold">{order.order_number}</p>
                       <p className="text-[10px] text-muted-foreground uppercase font-bold">{new Date(order.created_at).toLocaleDateString('it-IT')}</p>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="space-y-0.5 min-w-0">
                       <p className="font-bold truncate">{order.customer_name}</p>
                       <p className="text-xs text-muted-foreground truncate">{order.customer_email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center space-x-2 text-xs font-medium">
                       {order.type === "delivery" ? <Truck className="w-3.5 h-3.5 text-primary" /> : <Store className="w-3.5 h-3.5 text-primary" />}
                       <span>{order.type === "delivery" ? "Consegna" : "Ritiro"}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6 font-bold text-sm">
                    €{Number(order.total).toFixed(2)}
                  </td>
                  <td className="px-6 py-6">
                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-lg border ${getStatusColor(order.status)}`}>
                      {getStatusLabel(order.status)}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                        <DropdownMenu>
                           <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-full")}>
                              <MoreVertical className="w-4 h-4" />
                           </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 rounded-xl p-2 bg-white border shadow-xl z-50">
                           <DropdownMenuItem 
                              onClick={() => router.push(`/ordine/conferma/${order.id}`)}
                              className="flex items-center p-3 cursor-pointer font-bold text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
                           >
                              <Eye className="w-3.5 h-3.5 mr-3" /> Vedi Dettagli
                           </DropdownMenuItem>
                           <DropdownMenuItem 
                              onClick={() => handleUpdateStatus(order.id, 'ready')}
                              className="flex items-center p-3 cursor-pointer font-bold text-xs uppercase tracking-widest text-success hover:bg-success/5 transition-colors"
                           >
                              <CheckCircle2 className="w-3.5 h-3.5 mr-3" /> Segna come Pronto
                           </DropdownMenuItem>
                           <DropdownMenuItem 
                              onClick={() => handleUpdateStatus(order.id, 'preparing')}
                              className="flex items-center p-3 cursor-pointer font-bold text-xs uppercase tracking-widest text-amber-600 hover:bg-amber-500/5 transition-colors"
                           >
                              <AlertCircle className="w-3.5 h-3.5 mr-3" /> In Preparazione
                           </DropdownMenuItem>
                           <div className="h-px bg-border/50 my-1 mx-2" />
                           <DropdownMenuItem 
                              onClick={() => setOrderToCancel(order.id)}
                              className="flex items-center p-3 cursor-pointer font-bold text-xs uppercase tracking-widest text-destructive hover:bg-destructive/5 transition-colors"
                           >
                              <XCircle className="w-3.5 h-3.5 mr-3" /> Annulla Ordine
                           </DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>
                  </td>
                </tr>
              ))}
              {!getOrders.isLoading && filteredOrders.length === 0 && (
                <tr>
                   <td colSpan={6} className="px-8 py-20 text-center text-muted-foreground">
                      <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-10" />
                      <p className="font-bold">Nessun ordine trovato</p>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CustomModal 
        isOpen={!!orderToCancel}
        onClose={() => setOrderToCancel(null)}
        onConfirm={handleCancelOrder}
        title="Annulla Ordine"
        description="Sei sicuro di voler annullare questo ordine? Questa azione non può essere annullata."
        confirmText="Annulla Ordine"
        variant="destructive"
        isLoading={isCancelling}
      />
    </div>
  )
}
