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
              {contactPhone && (
                <Link 
                  href={`https://wa.me/${contactPhone.replace(/[^0-9]/g, '')}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-muted-foreground hover:text-success transition-colors"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                  </svg>
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
                <a href={`tel:${contactPhone.replace(/\s/g, '')}`} className="flex items-center space-x-3 hover:text-primary transition-colors">
                  <Phone className="w-5 h-5 text-primary shrink-0" />
                  <span>{contactPhone}</span>
                </a>
              </li>
              <li className="flex items-center space-x-3 text-sm text-muted-foreground">
                <a href={`mailto:${contactEmail}`} className="flex items-center space-x-3 hover:text-primary transition-colors">
                  <Mail className="w-5 h-5 text-primary shrink-0" />
                  <span>{contactEmail}</span>
                </a>
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
