"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, ShoppingCart, User, Menu, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/useCart"
import { useAuth } from "@/hooks/useAuth"
import { useSettings } from "@/hooks/useSettings"

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Catalogo", href: "/catalogo" },
  { name: "Prenota", href: "/prenota" },
  { name: "Offerte", href: "/offerte" },
  { name: "Contatti", href: "/contatti" },
]

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const pathname = usePathname()
  const { items, setIsOpen } = useCart()
  const { user } = useAuth()
  const { getSettings } = useSettings()
  const settings = getSettings.data || {}
  const rawShopName = settings.shop_name || "DetersiviParty"
  const renderLogo = () => {
    const isParty = rawShopName.toUpperCase().includes('PARTY');
    if (isParty) {
      const parts = rawShopName.toUpperCase().split('PARTY');
      return (
        <>
          <span className="text-primary">{parts[0]}</span>
          <span className="text-success">PARTY</span>
          {parts[1] && <span className="text-success">{parts[1]}</span>}
        </>
      )
    }
    
    const words = rawShopName.trim().split(' ');
    if (words.length === 1) {
      const half = Math.ceil(rawShopName.length / 2);
      return (
        <>
          <span className="text-primary">{rawShopName.slice(0, half).toUpperCase()}</span>
          <span className="text-success">{rawShopName.slice(half).toUpperCase()}</span>
        </>
      )
    }
    return (
      <>
        <span className="text-primary">{words[0].toUpperCase()} </span>
        <span className="text-success">{words.slice(1).join(' ').toUpperCase()}</span>
      </>
    )
  }

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/80 backdrop-blur-md border-b" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-heading font-extrabold text-xl sm:text-2xl tracking-tighter">
              {renderLogo()}
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === link.href ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Search className="w-5 h-5" />
            </Button>
            {settings.social_whatsapp && (
               <Link href={`https://wa.me/${settings.social_whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer">
                 <Button variant="ghost" size="icon" className="text-green-600 hover:text-green-500 hover:bg-green-50">
                   <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                 </Button>
               </Link>
            )}
            <Link href={user ? "/account" : "/login"}>
              <Button variant="ghost" size="icon" className="relative">
                <User className="w-5 h-5" />
                {user && <span className="absolute top-1 right-1 w-2 h-2 bg-success rounded-full ring-2 ring-white" />}
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="relative" onClick={() => setIsOpen(true)}>
                <ShoppingCart className="w-5 h-5" />
                {items.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                    {items.length}
                  </span>
                )}
            </Button>
            
            {/* Mobile Menu Trigger */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background border-b"
          >
            <div className="px-4 pt-2 pb-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`block px-3 py-4 text-base font-medium rounded-md ${
                    pathname === link.href
                      ? "bg-secondary text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-primary"
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 px-3 flex items-center space-x-4">
                 <Button className="w-full justify-start" variant="ghost">
                    <Search className="w-5 h-5 mr-2" /> Cerca
                 </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
