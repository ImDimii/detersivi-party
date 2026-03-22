"use client"

import { ReactNode } from "react"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import Link from "next/link"
import { 
  User, 
  ShoppingBag, 
  Calendar, 
  Settings, 
  LogOut,
  ChevronRight,
  LayoutDashboard
} from "lucide-react"

import { useAuth } from "@/hooks/useAuth"

const accountLinks = [
  { name: "Panoramica", href: "/account", icon: LayoutDashboard },
  { name: "I Miei Ordini", href: "/account/ordini", icon: ShoppingBag },
  { name: "Prenotazioni", href: "/account/prenotazioni", icon: Calendar },
  { name: "Il Mio Profilo", href: "/account/profilo", icon: Settings },
]

export default function AccountLayout({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth()
  const fullName = user?.user_metadata?.full_name || user?.email || "Utente"

  return (
    <div className="flex flex-col min-h-screen bg-secondary/10">
      <Navbar />
      
      <div className="flex-grow pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar Navigation */}
            <aside className="w-full lg:w-72 space-y-4">
               <div className="bg-white rounded-3xl border border-border/50 shadow-sm p-8 flex flex-col items-center text-center space-y-4">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center border-2 border-white shadow-lg overflow-hidden capitalize text-2xl font-black text-primary">
                     {fullName.charAt(0)}
                  </div>
                  <div>
                     <h3 className="font-heading font-extrabold text-lg">{fullName}</h3>
                     <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Account Cliente</p>
                  </div>
               </div>

               <nav className="bg-white rounded-3xl border border-border/50 shadow-sm p-4 space-y-1">
                  {accountLinks.map((link) => (
                    <Link 
                      key={link.name} 
                      href={link.href}
                      className="flex items-center space-x-3 p-3 rounded-xl text-sm font-bold text-muted-foreground hover:bg-primary/5 hover:text-primary transition-all group"
                    >
                      <link.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                      <span className="flex-grow">{link.name}</span>
                    </Link>
                  ))}
                  <div className="pt-4 mt-4 border-t border-border/30">
                     <button 
                       onClick={async () => {
                         await signOut()
                         window.location.href = "/"
                       }}
                       className="flex items-center space-x-3 p-3 w-full rounded-xl text-sm font-bold text-destructive hover:bg-destructive/5 transition-all"
                     >
                        <LogOut className="w-5 h-5" />
                        <span>Esci</span>
                     </button>
                  </div>
               </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-grow">
               {children}
            </main>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
