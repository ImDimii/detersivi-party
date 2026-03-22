import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product } from '@/types/database'

export interface CartItem {
  id: string
  product: Product & { categories: { name: string, slug: string } }
  quantity: number
  variant?: string
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (product: Product & { categories: { name: string, slug: string } }, quantity?: number, variant?: string) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  setIsOpen: (isOpen: boolean) => void
  getTotal: () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      setIsOpen: (isOpen) => set({ isOpen }),
      addItem: (product, quantity = 1, variant) => {
        const currentItems = get().items
        const existingItem = currentItems.find(item => item.id === product.id + (variant || ''))

        if (existingItem) {
          set({
            items: currentItems.map(item =>
              item.id === product.id + (variant || '')
                ? { ...item, quantity: item.quantity + quantity }
                : item
            ),
          })
        } else {
          set({
            items: [...currentItems, { id: product.id + (variant || ''), product, quantity, variant }],
          })
        }
        set({ isOpen: true }) // Open cart when item is added
      },
      removeItem: (id) => {
        set({
          items: get().items.filter(item => item.id !== id),
        })
      },
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        set({
          items: get().items.map(item =>
            item.id === id ? { ...item, quantity } : item
          ),
        })
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce((total, item) => total + (Number(item.product.price) * item.quantity), 0)
      },
    }),
    {
      name: 'detersivi-party-cart',
    }
  )
)
