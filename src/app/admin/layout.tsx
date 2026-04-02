"use client"

import { ReactNode, useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
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
  MessageSquare,
  Menu,
  X
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

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const isAdmin = user?.user_metadata?.is_admin === true

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => { document.body.style.overflow = "" }
  }, [sidebarOpen])

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

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin"
    return pathname.startsWith(href)
  }

  return (
    <div className="flex min-h-screen bg-secondary/10">
      {/* Mobile Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 lg:hidden bg-white/95 backdrop-blur-xl border-b border-border/50 shadow-sm">
        <div className="flex items-center justify-between px-4 h-16">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-heading font-extrabold tracking-tighter text-primary">DP</span>
            <span className="text-xs uppercase font-bold tracking-widest text-muted-foreground pt-0.5">Admin</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl hover:bg-secondary/50 transition-colors"
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Backdrop overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden animate-in fade-in duration-200"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Admin Sidebar */}
      <aside className={`
        fixed top-0 left-0 bottom-0 z-50 w-72 bg-white border-r border-border/50 flex flex-col shadow-xl
        transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:shadow-sm lg:z-auto
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar header - hidden on mobile since we have the top bar */}
        <div className="p-8 border-b hidden lg:block">
           <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-heading font-extrabold tracking-tighter text-primary">DP</span>
              <span className="text-xs uppercase font-bold tracking-widest text-muted-foreground pt-1">Admin Panel</span>
           </Link>
        </div>

        {/* Mobile sidebar header with close */}
        <div className="p-6 border-b lg:hidden flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-heading font-extrabold tracking-tighter text-primary">DP</span>
            <span className="text-xs uppercase font-bold tracking-widest text-muted-foreground pt-0.5">Admin</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-xl hover:bg-secondary/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex-grow p-4 lg:p-6 space-y-1 lg:space-y-2 overflow-y-auto">
          {adminLinks.map((link) => (
            <Link 
              key={link.name} 
              href={link.href}
              className={`flex items-center space-x-3 p-3 rounded-xl text-sm font-bold transition-all group ${
                isActive(link.href)
                  ? "bg-primary text-white shadow-lg"
                  : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
              }`}
            >
              <link.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                isActive(link.href) ? "" : ""
              }`} />
              <span className="flex-grow">{link.name}</span>
              <ChevronRight className={`w-4 h-4 transition-opacity ${
                isActive(link.href) ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              }`} />
            </Link>
          ))}
        </nav>
        
        <div className="p-4 lg:p-6 border-t">
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
      <main className="flex-grow p-4 pt-20 sm:p-6 sm:pt-22 lg:p-12 lg:pt-12 overflow-y-auto min-w-0">
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
