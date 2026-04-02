"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { Reservation } from '@/types/database'

export function useReservations(filters: { status?: string, userId?: string } = {}) {
  const supabase = createClient()
  const queryClient = useQueryClient()

  const getReservations = useQuery({
    queryKey: ['reservations', filters],
    queryFn: async () => {
      let query = supabase
        .from('reservations')
        .select('*')
      
      if (filters && filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status)
      }
      if (filters && filters.userId) {
        query = query.eq('user_id', filters.userId)
      }

      const { data, error } = await query.order('created_at', { ascending: false })
      
      if (error) throw error
      return data as Reservation[]
    },
    refetchInterval: 10000, // <-- LIVE POLLING OGNI 10 SECONDI
  })

  const getMyReservations = (userId: string) => useQuery({
    queryKey: ['reservations', 'my', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .eq('user_id', userId)
        .order('event_date', { ascending: true })
      
      if (error) throw error
      return data
    },
    enabled: !!userId,
    refetchInterval: 10000, // <-- LIVE POLLING OGNI 10 SECONDI
  })

  const createReservation = useMutation({
    mutationFn: async (newReservation: Partial<Reservation>) => {
      // Get authenticated user (server-verified)
      const { data: { user: authUser } } = await supabase.auth.getUser()

      // Generate a truly unique reservation number without relying on DB count (which fails due to SELECT RLS)
      const randomPart = Math.floor(1000 + Math.random() * 9000)
      const datePart = new Date().toISOString().slice(2, 10).replace(/-/g, '')
      const reservationNumber = `RES-${datePart}-${randomPart}`

      const { error } = await supabase
        .from('reservations')
        .insert([{
          ...newReservation,
          user_id: authUser?.id ?? null,
          reservation_number: reservationNumber,
        }])
      
      if (error) {
        console.error('[createReservation] Supabase error:', JSON.stringify(error), error.message, error.code)
        if (error.code === '42501') {
          throw new Error('Permesso negato dal database (RLS). Assicurati di aver eseguito le policy SQL (INSERT) nel pannello di Supabase!')
        }
        throw new Error(error.message || error.code || JSON.stringify(error))
      }
      return { 
         ...newReservation, 
         reservation_number: reservationNumber, 
         user_id: authUser?.id ?? null 
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] })
    }
  })

  const updateReservationStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: Reservation['status'] }) => {
      const { data, error } = await supabase
        .from('reservations')
        .update({ status })
        .eq('id', id)
        .select()
      
      if (error) throw error
      if (!data || data.length === 0) {
        throw new Error('Impossibile aggiornare: permesso negato o prenotazione non trovata.')
      }
      return data[0]
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reservations'] })
    }
  })

  return {
    getReservations,
    getMyReservations,
    createReservation,
    updateReservationStatus
  }
}
