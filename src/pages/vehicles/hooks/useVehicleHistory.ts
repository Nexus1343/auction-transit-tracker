
import { useEffect, useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { StatusHistoryEvent } from "../types/vehicleTypes"

export const useVehicleHistory = (vehicleId: number | null) => {
  const [history, setHistory] = useState<StatusHistoryEvent[]>([])
  
  const fetchHistory = async () => {
    if (!vehicleId) return
    
    try {
      const { data: historyData, error: historyError } = await supabase
        .from('vehicle_status_history')
        .select(`
          id,
          created_at,
          notes,
          status_id,
          changed_by
        `)
        .eq('vehicle_id', vehicleId)
        .order('created_at', { ascending: false })
      
      if (historyError) throw historyError
      
      if (historyData) {
        const formattedHistory = historyData.map(item => ({
          date: new Date(item.created_at).toLocaleString(),
          user: "Admin", // Replace with actual user when available
          action: item.notes || "Status updated"
        }))
        setHistory(formattedHistory)
      }
    } catch (historyError) {
      console.error('Error fetching history:', historyError)
    }
  }

  useEffect(() => {
    fetchHistory()
  }, [vehicleId])

  // Function to add a history event and refresh the history
  const addHistoryEvent = async (vehicleId: number, note: string) => {
    if (!vehicleId) return
    
    try {
      const { error } = await supabase
        .from('vehicle_status_history')
        .insert({
          vehicle_id: vehicleId,
          notes: note,
          created_at: new Date().toISOString()
        })
      
      if (error) throw error
      
      // Refresh history
      await fetchHistory()
      
      return true
    } catch (error) {
      console.error('Error adding history event:', error)
      return false
    }
  }

  return { history, addHistoryEvent, fetchHistory }
}
