
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export const useGenerations = (modelId: number | null) => {
  return useQuery({
    queryKey: ['generations', modelId],
    queryFn: async () => {
      if (!modelId) return []
      
      const { data, error } = await supabase
        .from('generations')
        .select('id, name')
        .eq('model_id', modelId)
        .order('name')
      
      if (error) {
        console.error("Error fetching generations:", error)
        throw new Error(error.message)
      }
      
      return data
    },
    enabled: !!modelId
  })
}
