export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          image_url: string | null
          parent_id: string | null
          sort_order: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          image_url?: string | null
          parent_id?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          image_url?: string | null
          parent_id?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description_short: string | null
          description_long: string | null
          price: number
          price_original: number | null
          sku: string | null
          stock_quantity: number
          stock_alert_threshold: number
          category_id: string | null
          images: Json
          variants: Json
          tags: string[]
          is_featured: boolean
          is_new: boolean
          status: 'published' | 'draft' | 'archived'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description_short?: string | null
          description_long?: string | null
          price: number
          price_original?: number | null
          sku?: string | null
          stock_quantity?: number
          stock_alert_threshold?: number
          category_id?: string | null
          images?: Json
          variants?: Json
          tags?: string[]
          is_featured?: boolean
          is_new?: boolean
          status?: 'published' | 'draft' | 'archived'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description_short?: string | null
          description_long?: string | null
          price?: number
          price_original?: number | null
          sku?: string | null
          stock_quantity?: number
          stock_alert_threshold?: number
          category_id?: string | null
          images?: Json
          variants?: Json
          tags?: string[]
          is_featured?: boolean
          is_new?: boolean
          status?: 'published' | 'draft' | 'archived'
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          user_id: string | null
          customer_name: string
          customer_email: string
          customer_phone: string
          type: 'pickup' | 'delivery'
          delivery_address: Json
          pickup_slot: string | null
          status: 'received' | 'preparing' | 'ready' | 'delivering' | 'completed' | 'cancelled'
          subtotal: number
          delivery_fee: number
          total: number
          discount_code: string | null
          discount_amount: number
          customer_notes: string | null
          internal_notes: string | null
          status_history: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number: string
          user_id?: string | null
          customer_name: string
          customer_email: string
          customer_phone: string
          type: 'pickup' | 'delivery'
          delivery_address?: Json
          pickup_slot?: string | null
          status?: 'received' | 'preparing' | 'ready' | 'delivering' | 'completed' | 'cancelled'
          subtotal: number
          delivery_fee?: number
          total: number
          discount_code?: string | null
          discount_amount?: number
          customer_notes?: string | null
          internal_notes?: string | null
          status_history?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          user_id?: string | null
          customer_name?: string
          customer_email?: string
          customer_phone?: string
          type?: 'pickup' | 'delivery'
          delivery_address?: Json
          pickup_slot?: string | null
          status?: 'received' | 'preparing' | 'ready' | 'delivering' | 'completed' | 'cancelled'
          subtotal?: number
          delivery_fee?: number
          total?: number
          discount_code?: string | null
          discount_amount?: number
          customer_notes?: string | null
          internal_notes?: string | null
          status_history?: Json
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string | null
          product_id: string | null
          product_name: string
          variant_label: string | null
          quantity: number
          unit_price: number
          total_price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id?: string | null
          product_id?: string | null
          product_name: string
          variant_label?: string | null
          quantity: number
          unit_price: number
          total_price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string | null
          product_id?: string | null
          product_name?: string
          variant_label?: string | null
          quantity?: number
          unit_price?: number
          total_price?: number
          created_at?: string
        }
      }
      reservations: {
        Row: {
          id: string
          reservation_number: string
          user_id: string | null
          customer_name: string
          customer_email: string
          customer_phone: string
          type: 'consultation' | 'full_setup' | 'pickup' | 'custom'
          event_type: 'birthday' | 'wedding' | 'graduation' | 'corporate' | 'other' | null
          event_date: string
          slot_start: string
          slot_end: string
          guests_count: string | null
          budget_range: string | null
          notes: string | null
          attachments: string[]
          status: 'pending' | 'confirmed' | 'rejected' | 'completed' | 'cancelled'
          admin_notes: string | null
          rejection_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          reservation_number: string
          user_id?: string | null
          customer_name: string
          customer_email: string
          customer_phone: string
          type: 'consultation' | 'full_setup' | 'pickup' | 'custom'
          event_type?: 'birthday' | 'wedding' | 'graduation' | 'corporate' | 'other' | null
          event_date: string
          slot_start: string
          slot_end: string
          guests_count?: string | null
          budget_range?: string | null
          notes?: string | null
          attachments?: string[]
          status?: 'pending' | 'confirmed' | 'rejected' | 'completed' | 'cancelled'
          admin_notes?: string | null
          rejection_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          reservation_number?: string
          user_id?: string | null
          customer_name?: string
          customer_email?: string
          customer_phone?: string
          type?: 'consultation' | 'full_setup' | 'pickup' | 'custom'
          event_type?: 'birthday' | 'wedding' | 'graduation' | 'corporate' | 'other' | null
          event_date?: string
          slot_start?: string
          slot_end?: string
          guests_count?: string | null
          budget_range?: string | null
          notes?: string | null
          attachments?: string[]
          status?: 'pending' | 'confirmed' | 'rejected' | 'completed' | 'cancelled'
          admin_notes?: string | null
          rejection_reason?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

export type Category = Database['public']['Tables']['categories']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type Order = Database['public']['Tables']['orders']['Row']
export type OrderItem = Database['public']['Tables']['order_items']['Row']
export type Reservation = Database['public']['Tables']['reservations']['Row']
