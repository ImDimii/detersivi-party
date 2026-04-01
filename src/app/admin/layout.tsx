"use client"

import { ReactNode } from "react"
import Link from "next/link"
import { 
  LayoutDashboard, 
  Package, 
  Tags, 
  ShoppingBag, 
  Calendar, 
  Users, 
  Settings, 
  LogOut,
  ChevronRight,
  MessageSquare
} from "lucide-react"

const adminLinks = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Messaggi", href: "/admin/messaggi", icon: MessageSquare },
  { name: "Prodotti", href: "/admin/prodotti", icon: Package },
  { name: "Categorie", href: "/admin/categorie", icon: Tags },
  { name: "Ordini", href: "/admin/ordini", icon: ShoppingBag },
  { name: "Prenotazioni", href: "/admin/prenotazioni", icon: Calendar },
  { name: "Clienti", href: "/admin/clienti", icon: Users },
  { name: "Impostazioni", href: "/admin/impostazioni", icon: Settings },
]

import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  const isAdmin = user?.user_metadata?.is_admin === true

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push("/login")
    }
  }, [loading, isAdmin, router])

  if (loading || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-secondary/10">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Verifica Autorizzazione...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-secondary/10">
      {/* Admin Sidebar */}
      <aside className="w-72 bg-white border-r border-border/50 flex flex-col shadow-sm">
        <div className="p-8 border-b">
           <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-heading font-extrabold tracking-tighter text-primary">DP</span>
              <span className="text-xs uppercase font-bold tracking-widest text-muted-foreground pt-1">Admin Panel</span>
           </Link>
        </div>
        
        <nav className="flex-grow p-6 space-y-2">
          {adminLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className="flex items-center space-x-3 p-3 rounded-xl text-sm font-bold text-muted-foreground hover:bg-primary/5 hover:text-primary transition-all group"
            >
              <link.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span className="flex-grow">{link.name}</span>
              <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </nav>
        
        <div className="p-6 border-t">
            <Button 
              variant="ghost" 
              onClick={async () => {
                await signOut()
                window.location.href = "/"
              }}
              className="w-full justify-start text-destructive hover:bg-destructive/5 font-bold"
            >
               <LogOut className="w-5 h-5 mr-3" />
               Esci
            </Button>
         </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow p-12 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
           {children}
        </div>
      </main>
    </div>
  )
}

function Button({ children, variant, className, ...props }: any) {
  return (
    <button className={`inline-flex items-center justify-center rounded-xl px-4 py-2 transition-colors ${
      variant === "ghost" ? "hover:bg-secondary/50" : "bg-primary text-primary-foreground"
    } ${className}`} {...props}>
      {children}
    </button>
  )
}
