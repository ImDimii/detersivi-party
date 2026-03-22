"use client"

import { createClient } from "@/lib/supabase/client"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

export function useSettings() {
  const supabase = createClient()
  const queryClient = useQueryClient()

  const getSettings = useQuery({
    queryKey: ['settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
      
      if (error) throw error
      
      // Convert array to object
      return data.reduce((acc, curr) => ({
        ...acc,
        [curr.key]: curr.value
      }), {} as Record<string, any>)
    }
  })

  const updateSetting = useMutation({
    mutationFn: async ({ key, value }: { key: string, value: any }) => {
      const { data, error } = await supabase
        .from('site_settings')
        .upsert({ key, value, updated_at: new Date().toISOString() })
        .select()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] })
    }
  })

  return {
    getSettings,
    updateSetting
  }
}
