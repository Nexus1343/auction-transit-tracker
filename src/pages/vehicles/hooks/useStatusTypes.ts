
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

export const useStatusTypes = () => {
  const [statuses, setStatuses] = useState<{ id: number; name: string; sequence_order: number }[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchStatusTypes = async () => {
      try {
        const { data, error } = await supabase
          .from('status_types')
          .select('id, name, sequence_order')
          .order('sequence_order', { ascending: true })

        if (error) {
          throw error
        }

        setStatuses(data || [])
      } catch (error) {
        console.error('Error fetching status types:', error)
        toast({
          title: "Error",
          description: "Failed to load status types. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStatusTypes()
  }, [toast])

  return {
    statuses,
    isLoading
  }
}
