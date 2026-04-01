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

      // Generate sequential reservation number
      const { count } = await supabase
        .from('reservations')
        .select('*', { count: 'exact', head: true })
      const reservationNumber = `RES-${1000 + (count ?? 0)}`

      const { data, error } = await supabase
        .from('reservations')
        .insert([{
          ...newReservation,
          user_id: authUser?.id ?? null,
          reservation_number: reservationNumber,
        }])
        .select()
      
      if (error) {
        console.error('[createReservation] Supabase error:', JSON.stringify(error), error.message, error.code)
        if (error.code === '42501') {
          throw new Error('Permesso negato dal database (RLS). Per favore esegui le policy SQL indicate dall\'admin e riprova.')
        }
        throw new Error(error.message || error.code || JSON.stringify(error))
      }
      return data[0]
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
