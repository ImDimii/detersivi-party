"use client"

import { useState } from "react"
import { 
  Users, 
  Search, 
  MoreVertical, 
  Eye, 
  ShoppingBag, 
  Calendar, 
  Mail, 
  Phone,
  Download,
  Filter,
  UserPlus
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

import { useCustomers } from "@/hooks/useCustomers"

export default function AdminCustomersPage() {
  const [search, setSearch] = useState("")
  const { getCustomers } = useCustomers(search)

  const customers = getCustomers.data || []
  
  // Stats from customers data
  const totalSpentAll = customers.reduce((acc, c) => acc + c.total_spent, 0)
  const totalOrdersAll = customers.reduce((acc, c) => acc + c.orders_count, 0)
  const totalResAll = customers.reduce((acc, c) => acc + c.reservations_count, 0)

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
           <h1 className="text-4xl font-heading font-extrabold tracking-tight">Clienti</h1>
           <p className="text-muted-foreground">Gestisci i tuoi clienti registrati e visualizza le loro attività.</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" size="lg" className="h-14 px-6 font-bold rounded-xl border-2">
             <Download className="w-5 h-5" />
          </Button>
          <Button size="lg" className="h-14 px-8 font-bold shadow-xl rounded-xl">
             <UserPlus className="w-5 h-5 mr-3" />
             Nuovo Cliente
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         {[
           { label: "Clienti Totali", value: customers.length.toString(), icon: Users, color: "text-primary" },
           { label: "Ordini Totali", value: totalOrdersAll.toString(), icon: ShoppingBag, color: "text-indigo-500" },
           { label: "Spesa Totale", value: `€${totalSpentAll.toFixed(2)}`, icon: Calendar, color: "text-success" },
         ].map((stat) => (
           <div key={stat.label} className="bg-white p-6 rounded-3xl border border-border/50 shadow-sm flex items-center space-x-4">
              <div className={`p-4 rounded-2xl ${stat.color} bg-current/10`}>
                 <stat.icon className="w-6 h-6" />
              </div>
              <div>
                 <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                 <p className="text-2xl font-heading font-extrabold">{getCustomers.isLoading ? "..." : stat.value}</p>
              </div>
           </div>
         ))}
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-6 rounded-3xl border border-border/50 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Cerca cliente per nome, email o telefono..." 
            className="pl-10 h-12 rounded-xl"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-3xl border border-border/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-secondary/10 text-xs font-bold uppercase tracking-wider text-muted-foreground border-b">
                <th className="px-8 py-5">Cliente</th>
                <th className="px-6 py-5">Contatto</th>
                <th className="px-6 py-5 text-center">Attività</th>
                <th className="px-6 py-5">Spesa Totale</th>
                <th className="px-6 py-5">Ultima Attività</th>
                <th className="px-8 py-5 text-right">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {getCustomers.isLoading ? (
                 [1, 2, 3].map(i => (
                    <tr key={i} className="animate-pulse">
                       <td className="px-8 py-6"><div className="h-4 bg-secondary rounded w-32" /></td>
                       <td className="px-6 py-6"><div className="h-4 bg-secondary rounded w-40" /></td>
                       <td className="px-6 py-6 text-center"><div className="h-4 bg-secondary rounded w-16 mx-auto" /></td>
                       <td className="px-6 py-6"><div className="h-4 bg-secondary rounded w-16" /></td>
                       <td className="px-6 py-6"><div className="h-4 bg-secondary rounded w-20" /></td>
                       <td className="px-8 py-6 text-right"><div className="h-8 bg-secondary rounded w-8 ml-auto" /></td>
                    </tr>
                 ))
              ) : customers.map((customer) => (
                <tr key={customer.email} className="hover:bg-secondary/5 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                       <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-xs shadow-sm">
                          {customer.name.split(' ').map(n => n[0]).join('')}
                       </div>
                       <span className="font-bold">{customer.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="space-y-0.5">
                       <p className="flex items-center text-xs text-muted-foreground">
                          <Mail className="w-3 h-3 mr-2" /> {customer.email}
                       </p>
                       <p className="flex items-center text-xs text-muted-foreground">
                          <Phone className="w-3 h-3 mr-2" /> {customer.phone || 'N/D'}
                       </p>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-center">
                    <div className="flex items-center justify-center space-x-3">
                       <div className="flex flex-col items-center">
                          <span className="font-bold">{customer.orders_count}</span>
                          <span className="text-[9px] uppercase font-bold text-muted-foreground">Ordini</span>
                       </div>
                       <div className="w-px h-6 bg-border/50" />
                       <div className="flex flex-col items-center">
                          <span className="font-bold">{customer.reservations_count}</span>
                          <span className="text-[9px] uppercase font-bold text-muted-foreground">Prenot.</span>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 font-bold text-primary">
                    €{customer.total_spent.toFixed(2)}
                  </td>
                  <td className="px-6 py-6 text-muted-foreground text-xs">
                    {new Date(customer.last_activity).toLocaleDateString('it-IT')}
                  </td>
                  <td className="px-8 py-6 text-right">
                     <DropdownMenu>
                        <DropdownMenuTrigger className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-full")}>
                           <MoreVertical className="w-4 h-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-xl p-2 bg-white border shadow-xl z-50">
                           <DropdownMenuItem className="flex items-center p-3 cursor-pointer font-bold text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
                              <Eye className="w-3.5 h-3.5 mr-3" /> Vedi Profilo
                           </DropdownMenuItem>
                           <DropdownMenuItem className="flex items-center p-3 cursor-pointer font-bold text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
                              <Mail className="w-3.5 h-3.5 mr-3" /> Invia Email
                           </DropdownMenuItem>
                           <div className="h-px bg-border/50 my-1 mx-2" />
                           <DropdownMenuItem className="flex items-center p-3 cursor-pointer font-bold text-xs uppercase tracking-widest text-destructive hover:bg-destructive/5 transition-colors">
                              Disabilita Account
                           </DropdownMenuItem>
                        </DropdownMenuContent>
                     </DropdownMenu>
                  </td>
                </tr>
              ))}
              {!getCustomers.isLoading && customers.length === 0 && (
                <tr>
                   <td colSpan={6} className="px-8 py-20 text-center text-muted-foreground">
                      <Users className="w-12 h-12 mx-auto mb-4 opacity-10" />
                      <p className="font-bold">Nessun cliente trovato</p>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
