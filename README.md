# 🧼 DetersiviParty - Piattaforma Admin & Catalogo

Benvenuti in **DetersiviParty**, la soluzione definitiva per la gestione e la vendita di prodotti per l'igiene della casa e allestimenti per party. Questa piattaforma combina un'esperienza utente premium con un potente pannello di amministrazione per un controllo totale dell'inventario e degli ordini.

---

## ✨ Caratteristiche Principali

### 🛍️ Catalogo Dinamico & Ricerca
- **Filtri Avanzati**: Navigazione intuitiva per categorie con URL SEO-friendly (`/catalogo/[categoria]`).
- **Ordinamento Intelligente**: Ordina i prodotti per Prezzo (Crescente/Decrescente), Nome (A-Z) o Novità.
- **Ricerca Real-time**: Trova istantaneamente i prodotti che cerchi.
- **Pricing Dinamico**: Gestione di prezzi originali e scontati con evidenziatura automatica.

### 🛒 Sistema di Carrello Intelligente
- **Auto-Sincronizzazione**: Il carrello si valida automaticamente contro il database reale.
- **Valutazione Stock**: Rimozione automatica di articoli esauriti o eliminati dall'admin.
- **Correzione Quantità**: Regolazione automatica della quantità nel carrello in base alla disponibilità effettiva.

### 🛡️ Pannello Admin Potente
- **Dashboard Statistiche**: Visualizzazione immediata di ordini, fatturato e prodotti più venduti.
- **Gestione Prodotti**: Caricamento semplificato con **Upload nativo di immagini** (Base64).
- **Importazione Bulk**: Sistema di caricamento massivo via JSON con validazione real-time dei UUID.
- **Impostazioni Sito**: Controllo totale su loghi, orari di apertura, URL mappa ed email SMTP.

---

## 🛠️ Tech Stack

- **Frontend**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Styling**: Vanilla CSS & Tailwind CSS per un design ultra-premium e moderno.
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) (con persistenza localStorage)
- **Fetching**: [React Query](https://tanstack.com/query/latest)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

---

## 🚀 Sviluppo Locale

1. Clona il repository:
   ```bash
   git clone https://github.com/ImDimii/detersivi-party.git
   ```
2. Installa le dipendenze:
   ```bash
   npm install
   ```
3. Configura le variabili d'ambiente in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=tuo_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tua_chiave
   ```
4. Avvia il server di sviluppo:
   ```bash
   npm run dev
   ```

---

## 💗 Nota dell'Autore

*Questo progetto è stato costruito per offrire la massima efficienza e una bellezza visiva senza compromessi.*

**Fatto con il cuore da Dimi** ✨🧼

---
© 2026 DetersiviParty. Tutti i diritti riservati.
