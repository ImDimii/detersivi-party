"use client"

import { 
  TrendingUp, 
  ShoppingBag, 
  Users, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight,
  Clock,
  Package
} from "lucide-react"
import { useOrders } from "@/hooks/useOrders"
import { useReservations } from "@/hooks/useReservations"
import { useProducts } from "@/hooks/useProducts"
import { useCustomers } from "@/hooks/useCustomers"
import Link from "next/link"
import { Order, Reservation, Product } from "@/types/database"

export default function AdminDashboard() {
  const { getOrders } = useOrders()
  const { getReservations } = useReservations()
  const { data: products } = useProducts()
  const { getCustomers } = useCustomers()

  const orders: Order[] = getOrders.data || []
  const reservations: Reservation[] = getReservations.data || []
  const customers = getCustomers.data || []
  
  // Real inventory alerts
  const lowStockProducts = (products as Product[] | undefined)?.filter(p => p.stock_quantity <= p.stock_alert_threshold).slice(0, 5) || []

  // Simple KPI calculations
  const totalRevenue = orders.reduce((acc: number, order: Order) => acc + Number(order.total), 0)
  const pendingOrders = orders.filter((o: Order) => o.status === 'received').length
  const pendingReservations = reservations.filter((r: Reservation) => r.status === 'pending').length

  const stats = [
    { name: "Vendite Totali", value: `€${totalRevenue.toFixed(2)}`, icon: TrendingUp, change: "+12.5%", color: "text-primary", bg: "bg-primary/10" },
    { name: "Ordini Ricevuti", value: orders.length.toString(), icon: ShoppingBag, change: `+${pendingOrders}`, color: "text-success", bg: "bg-success/10" },
    { name: "Prenotazioni", value: reservations.length.toString(), icon: Calendar, change: `+${pendingReservations}`, color: "text-amber-500", bg: "bg-amber-500/10" },
    { name: "Clienti Totali", value: customers.length.toString(), icon: Users, change: `+${customers.filter(c => new Date(c.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}`, color: "text-primary", bg: "bg-primary/10" },
  ]

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
        <div className="space-y-2">
           <h1 className="text-2xl sm:text-3xl lg:text-4xl font-heading font-extrabold tracking-tight">Bentornato, Admin</h1>
           <p className="text-sm sm:text-base text-muted-foreground">Ecco cosa è successo nel tuo negozio nelle ultime 24 ore.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border border-border/50 shadow-sm flex items-center space-x-2 text-sm font-bold self-start sm:self-auto shrink-0">
           <Clock className="w-4 h-4 text-primary" />
           <span>{new Date().toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-border/50 shadow-sm space-y-3 sm:space-y-4">
             <div className="flex justify-between items-start">
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                   <stat.icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center text-xs font-bold ${stat.change.startsWith('+') ? 'text-success' : 'text-destructive'}`}>
                   {stat.change}
                   {stat.change.startsWith('+') ? <ArrowUpRight className="w-3 h-3 ml-1" /> : <ArrowDownRight className="w-3 h-3 ml-1" />}
                </div>
             </div>
             <div>
                 <p className="text-[10px] sm:text-sm font-bold text-muted-foreground uppercase tracking-wider">{stat.name}</p>
                 <p className="text-xl sm:text-3xl font-heading font-extrabold tracking-tight">{stat.value}</p>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         {/* Recent Orders Placeholder */}
         <div className="bg-white rounded-3xl border border-border/50 shadow-sm overflow-hidden">
            <div className="p-6 border-b bg-secondary/10 flex justify-between items-center">
               <h3 className="text-xl font-heading font-bold">Ultimi Ordini</h3>
               <button className="text-xs font-bold text-primary hover:underline uppercase tracking-wider">Vedi Tutti</button>
            </div>
             <div className="p-6">
                <div className="space-y-6">
                   {orders.slice(0, 5).map((order) => (
                     <div key={order.id} className="flex items-center justify-between py-2 border-b last:border-0">
                        <div className="flex items-center space-x-4">
                           <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                              <ShoppingBag className="w-5 h-5 text-muted-foreground" />
                           </div>
                           <div>
                              <p className="font-bold text-sm">Ordine {order.order_number}</p>
                              <p className="text-xs text-muted-foreground">{order.customer_name} • {new Date(order.created_at).toLocaleDateString()}</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="font-bold text-sm">€{Number(order.total).toFixed(2)}</p>
                           <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${order.status === 'received' ? 'text-success bg-success/10' : 'text-muted-foreground bg-secondary'}`}>
                              {order.status}
                           </span>
                        </div>
                     </div>
                   ))}
                   {orders.length === 0 && <p className="text-center text-muted-foreground py-8">Nessun ordine recente.</p>}
                </div>
             </div>
         </div>

         {/* Inventory Alert Placeholder */}
         <div className="bg-white rounded-3xl border border-border/50 shadow-sm overflow-hidden">
            <div className="p-6 border-b bg-secondary/10 flex justify-between items-center">
               <h3 className="text-xl font-heading font-bold">Avvisi Inventario</h3>
               <button className="text-xs font-bold text-primary hover:underline uppercase tracking-wider">Gestisci Stock</button>
            </div>
            <div className="p-6">
                <div className="space-y-6">
                   {lowStockProducts.map((product) => (
                     <div key={product.id} className="flex items-center space-x-4 py-2 border-b last:border-0 font-medium">
                        <Package className="w-5 h-5 text-destructive" />
                        <p className="flex-grow text-sm">{product.name} - <span className="text-destructive font-bold">Solo {product.stock_quantity} rimasti</span></p>
                        <Link href={`/admin/prodotti/modifica/${product.id}`}>
                           <button className="text-xs font-bold text-primary">Gestisci</button>
                        </Link>
                     </div>
                   ))}
                   {lowStockProducts.length === 0 && (
                     <p className="text-center text-muted-foreground py-8">Tutti i prodotti sono sopra la soglia di allerta.</p>
                   )}
                </div>
             </div>
         </div>
      </div>
    </div>
  )
}
