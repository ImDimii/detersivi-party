"use client"

import Link from "next/link"
import { Facebook, Instagram, Twitter, MapPin, Phone, Mail, Clock } from "lucide-react"
import { useSettings } from "@/hooks/useSettings"

export function Footer() {
  const { getSettings } = useSettings()
  const settings = getSettings.data || {}

  const shopName = settings.shop_name || "DetersiviParty"
  const shopAddress = settings.shop_address || "Via del Commercio, 123, 00100 Roma (RM)"
  const contactPhone = settings.contact_phone || "+39 06 123 4567"
  const contactEmail = settings.contact_email || "info@detersiviparty.it"
  const vatNumber = settings.vat_number || "0123456789"
  const shopDescription = settings.shop_description || "Il tuo punto di riferimento locale per l'igiene della casa e allestimenti party indimenticabili. Qualità e cortesia al tuo servizio."
  
  const defaultHours = {
    'Lunedì': { open: "09:00", close: "19:30", active: true },
    'Domenica': { open: "09:00", close: "19:30", active: false }
  }
  const hours = settings.opening_hours || defaultHours

  return (
    <footer className="bg-secondary/50 border-t pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <Link href="/" className="inline-block">
              <span className="font-heading font-extrabold text-2xl tracking-tighter text-primary">
                {shopName.toUpperCase().replace('PARTY', '')}<span className="text-success">PARTY</span>
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              {shopDescription}
            </p>
            <div className="flex space-x-4">
              {settings.social_facebook && (
                <Link href={settings.social_facebook} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <Facebook className="w-5 h-5" />
                </Link>
              )}
              {settings.social_instagram && (
                <Link href={settings.social_instagram} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                  <Instagram className="w-5 h-5" />
                </Link>
              )}
              {settings.social_tiktok && (
                <Link href={settings.social_tiktok} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors flex items-center justify-center font-bold">
                  <span>TikTok</span>
                </Link>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-bold text-sm uppercase tracking-wider mb-6">Navigazione</h3>
            <ul className="space-y-4">
              <li>
                <Link href="/catalogo" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Sfoglia il Catalogo
                </Link>
              </li>
              <li>
                <Link href="/prenota" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Prenota Allestimento
                </Link>
              </li>
              <li>
                <Link href="/offerte" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Offerte Speciali
                </Link>
              </li>
              <li>
                <Link href="/chi-siamo" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  La Nostra Storia
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-heading font-bold text-sm uppercase tracking-wider mb-6">Contatti</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-sm text-muted-foreground">
                <MapPin className="w-5 h-5 text-primary shrink-0" />
                <span>{shopAddress}</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-muted-foreground">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span>{contactPhone}</span>
              </li>
              <li className="flex items-center space-x-3 text-sm text-muted-foreground">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span>{contactEmail}</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-heading font-bold text-sm uppercase tracking-wider mb-6">Orari Apertura</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-sm text-muted-foreground">
                <Clock className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Lun - Sab</p>
                  <p>{hours['Lunedì']?.active ? `${hours['Lunedì'].open} - ${hours['Lunedì'].close}` : "Chiuso"}</p>
                  <p className="mt-2 font-medium text-foreground">Domenica</p>
                  <p className={hours['Domenica']?.active ? "" : "text-destructive"}>{hours['Domenica']?.active ? `${hours['Domenica'].open} - ${hours['Domenica'].close}` : "Chiuso"}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} {shopName}. Tutti i diritti riservati. P.IVA {vatNumber}</p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="/cookies" className="hover:text-primary transition-colors">Cookie Policy</Link>
            <Link href="/termini" className="hover:text-primary transition-colors">Termini & Condizioni</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
