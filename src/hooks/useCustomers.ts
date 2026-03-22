"use client"

import { createClient } from "@/lib/supabase/client"
import { useQuery } from "@tanstack/react-query"

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  orders_count: number
  reservations_count: number
  total_spent: number
  last_activity: string
  created_at: string
}

export function useCustomers(search?: string) {
  const supabase = createClient()

  const getCustomers = useQuery({
    queryKey: ['customers', search],
    queryFn: async () => {
      // Since we don't have a profiles table, we aggregate from orders and reservations
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('customer_name, customer_email, customer_phone, total, created_at')
      
      const { data: reservations, error: resError } = await supabase
        .from('reservations')
        .select('customer_name, customer_email, customer_phone, created_at')

      if (ordersError) throw ordersError
      if (resError) throw resError

      const customersMap = new Map<string, Customer>()

      // Process orders
      orders?.forEach(o => {
        const email = o.customer_email.toLowerCase()
        const existing = customersMap.get(email)
        if (existing) {
          existing.orders_count += 1
          existing.total_spent += Number(o.total)
          if (new Date(o.created_at) > new Date(existing.last_activity)) {
            existing.last_activity = o.created_at
          }
        } else {
          customersMap.set(email, {
            id: email,
            name: o.customer_name,
            email: email,
            phone: o.customer_phone,
            orders_count: 1,
            reservations_count: 0,
            total_spent: Number(o.total),
            last_activity: o.created_at,
            created_at: o.created_at // Use first order date as joined date
          })
        }
      })

      // Process reservations
      reservations?.forEach(r => {
        const email = r.customer_email.toLowerCase()
        const existing = customersMap.get(email)
        if (existing) {
          existing.reservations_count += 1
          if (new Date(r.created_at) > new Date(existing.last_activity)) {
            existing.last_activity = r.created_at
          }
        } else {
          customersMap.set(email, {
            id: email,
            name: r.customer_name,
            email: email,
            phone: r.customer_phone,
            orders_count: 0,
            reservations_count: 1,
            total_spent: 0,
            last_activity: r.created_at,
            created_at: r.created_at
          })
        }
      })

      let result = Array.from(customersMap.values())

      if (search) {
        const s = search.toLowerCase()
        result = result.filter(c => 
          c.name.toLowerCase().includes(s) || 
          c.email.toLowerCase().includes(s) || 
          c.phone?.toLowerCase().includes(s)
        )
      }

      return result.sort((a, b) => new Date(b.last_activity).getTime() - new Date(a.last_activity).getTime())
    }
  })

  return { getCustomers }
}
