# 🧼 DetersiviParty - Documentation Totale Progetto

Benvenuti nella documentazione ufficiale di **DetersiviParty**, la piattaforma all-in-one definitiva per la gestione di un'attività di vendita detersivi e allestimento eventi party. Questo progetto non è un semplice e-commerce, ma un sistema gestionale completo che connette l'esperienza utente alla logistica di magazzino e alla gestione clienti.

---

## 🏗️ Architettura del Sistema

Il progetto è costruito su un'architettura moderna e scalabile:

- **Frontend**: Next.js 16 (App Router) con Turbopack per performance di sviluppo e build fulminee.
- **Backend-as-a-Service**: Supabase per la gestione di Database (PostgreSQL), Autenticazione (JWT/GoTrue) e Storage.
- **State Management**: Zustand per una gestione fluida del carrello e della UI sincronizzata.
- **Data Fetching**: React Query (TanStack Query) per il caching avanzato e l'ottimizzazione delle chiamate API.
- **Styling**: Sistema di design personalizzato basato su Vanilla CSS e utility Tailwind per una coerenza visiva totale.

---

## 💎 Funzionalità Utente (Frontend)

### 📂 Catalogo Dinamico & Navigazione
- **Routing Categorie**: Sistema di routing dinamico basato su slug (`/catalogo/[categoria]`) per SEO ottimale.
- **Filtraggio Multilivello**: Ricerca per nome, filtro per prezzo massimo (slider dinamico) e selezione categorie.
- **Ordinamento Avanzato**: Implementazione di query Supabase con `!inner join` per filtraggio e ordinamento (Prezzo, Nome, Data) lato database.
- **Product Preview**: Anteprime eleganti con badge per "Novità" e "In Offerta".

### 🛒 Checkout & Carrello Intelligente
- **Sincronizzazione Carrello**: Uno speciale hook di background (`useCartSync`) valida il carrello ad ogni apertura:
    - Rimuove prodotti eliminati o diventati "Bozza/Archiviati".
    - Gestisce esaurimenti scorte (stock_quantity = 0).
    - Regola automaticamente la quantità in base alle reali scorte di magazzino.
- **Prenotazioni Allestimenti**: Sezione dedicata per richiedere preventivi di allestimenti personalizzati.
- **Area Pesonale**: Storico ordini e gestione profilo utente.

---

## 🛡️ Pannello di Controllo (Admin)

### 📊 Dashboard Analitica
- Visualizzazione in tempo reale di:
    - **Fatturato Totale**: Calcolato dinamicamente sulle vendite.
    - **Ordini Attivi**: Monitoraggio costante delle nuove richieste.
    - **Prenotazioni**: Gestione delle richieste di allestimento per eventi.

### 📦 Gestione Catalogo & Prodotti
- **CRUD Completo**: Gestione totale di prodotti e categorie.
- **Gestione Media**: Sistema di upload immagini nativo che converte i file in Base64 per archiviazione immediata senza dipendenze esterne.
- **Importazione di Massa**: Strumento di importazione JSON avanzato che risolve automaticamente le dipendenze tra categorie (UUID) per popolare il database in pochi secondi.

### ⚙️ Impostazioni Globali del Sito
- Configurazione dinamica di:
    - Nome Negozio, Indirizzo e Partita IVA.
    - **Logo Branding**: Sistema di splitting testuale automatico che garantisce il corretto schema colori del brand.
    - **Integrazione Google Maps**: Campo URL embed per posizionare il punto preciso sulla mappa nella pagina contatti.
    - **Social & Contatti**: WhatsApp, Instagram, Facebook e parametri SMTP per notifiche email.

---

## 💾 Schema Database (Supabase)

Il database è strutturato per garantire l'integrità dei dati:
- `products`: Anagrafica prodotti, prezzi, stock, flag novità/featured.
- `categories`: Struttura gerarchica del catalogo.
- `site_settings`: Tabella singleton per la configurazione globale del sito.
- `orders`: Storico acquisti e stati di lavorazione.
- `reservations`: Slot e dettagli per gli allestimenti party.
- `users_profile`: Estensione dei dati di autenticazione per i clienti.

---

## 🚀 Guida all'Installazione

1. Clone del repo: `git clone <url-repo>`
2. Installazione: `npm install`
3. Variabili d'ambiente: Creare `.env.local` con `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Sviluppo: `npm run dev`
5. Build: `npm run build`

---

**Fatto con <3 da Dimi**

---
© 2026 DetersiviParty - Tutti i diritti riservati.
