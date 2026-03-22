import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Catalogo Prodotti | DetersiviParty",
  description: "Sfoglia il nostro vastissimo catalogo di detersivi alla spina, prodotti per l'igiene della casa e articoli per feste indimenticabili.",
}

export default function CatalogLayout({ children }: { children: React.ReactNode }) {
  return children
}
