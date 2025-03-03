
import { useQuery } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"

export const useManufacturers = () => {
  return useQuery({
    queryKey: ['manufacturers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('manufacturers')
        .select('id, name')
        .order('name')
      
      if (error) {
        console.error("Error fetching manufacturers:", error)
        throw new Error(error.message)
      }
      
      return data
    }
  })
}
