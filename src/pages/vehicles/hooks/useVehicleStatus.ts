
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { VehicleDetails } from "../types/vehicleTypes"
import { useVehicleHistory } from "./useVehicleHistory"
import { supabase } from "@/integrations/supabase/client"
import { useStatusTypes } from "./useStatusTypes"

export const useVehicleStatus = (vehicle: VehicleDetails | null) => {
  const [currentStatusId, setCurrentStatusId] = useState<number | null>(null)
  const { toast } = useToast()
  const { addHistoryEvent } = useVehicleHistory(vehicle?.id || null)
  const { statuses, isLoading: isLoadingStatuses } = useStatusTypes()
  
  useEffect(() => {
    if (vehicle && vehicle.current_status_id) {
      setCurrentStatusId(vehicle.current_status_id)
    } else if (statuses.length > 0) {
      // Default to first status if no status is set
      setCurrentStatusId(statuses[0].id)
    }
  }, [vehicle, statuses])

  const updateStatus = async (newStatusId: number) => {
    if (!vehicle) return

    try {
      // Update vehicle status in the database
      const { error } = await supabase
        .from('vehicles')
        .update({ current_status_id: newStatusId })
        .eq('id', vehicle.id)

      if (error) {
        throw error
      }

      // Get the status name for the history event
      const statusName = statuses.find(status => status.id === newStatusId)?.name || 'Unknown status'
      
      setCurrentStatusId(newStatusId)
      await addHistoryEvent(vehicle.id, `Changed status to "${statusName}"`)
      
      // Add entry to vehicle_status_history table
      await supabase
        .from('vehicle_status_history')
        .insert({
          vehicle_id: vehicle.id,
          status_id: newStatusId,
          notes: `Status updated to ${statusName}`
        })
      
      toast({
        title: "Status Updated",
        description: `Vehicle status changed to ${statusName}`,
      })
    } catch (error) {
      console.error('Error updating status:', error)
      toast({
        title: "Error",
        description: "Failed to update status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const getCurrentStatus = () => {
    return statuses.find(status => status.id === currentStatusId)?.name || ''
  }

  const getProgressPercentage = () => {
    if (!currentStatusId || statuses.length === 0) return 0
    
    const currentStatus = statuses.find(status => status.id === currentStatusId)
    if (!currentStatus) return 0
    
    const currentIndex = statuses.findIndex(status => status.id === currentStatusId)
    return ((currentIndex + 1) / statuses.length) * 100
  }

  return {
    currentStatusId,
    currentStatus: getCurrentStatus(),
    statuses,
    isLoadingStatuses,
    updateStatus,
    getProgressPercentage
  }
}
