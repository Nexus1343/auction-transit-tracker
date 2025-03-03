
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export const useBodyTypes = () => {
  return useQuery({
    queryKey: ['bodyTypes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('body_types')
        .select('id, name')
        .order('name')
      
      if (error) {
        console.error("Error fetching body types:", error)
        throw new Error(error.message)
      }
      
      return data
    }
  })
}
