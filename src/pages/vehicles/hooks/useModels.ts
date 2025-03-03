
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export const useModels = (manufacturerId: number | null) => {
  return useQuery({
    queryKey: ['models', manufacturerId],
    queryFn: async () => {
      if (!manufacturerId) return []
      
      const { data, error } = await supabase
        .from('models')
        .select('id, name')
        .eq('manufacturer_id', manufacturerId)
        .order('name')
      
      if (error) {
        console.error("Error fetching models:", error)
        throw new Error(error.message)
      }
      
      return data
    },
    enabled: !!manufacturerId
  })
}
