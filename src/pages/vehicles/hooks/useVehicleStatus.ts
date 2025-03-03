
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { VehicleDetails } from "../types/vehicleTypes"
import { useVehicleHistory } from "./useVehicleHistory"

export const useVehicleStatus = (vehicle: VehicleDetails | null) => {
  const statuses = [
    'At Auction',
    'Ready to List',
    'Listed on Central',
    'Assigned',
    'Picked Up',
    'Delivered',
    'Sail Warehouse',
    'Loaded',
    'Sailed',
    'Delivered to Dest Port',
    'Delivered'
  ]
  
  const [currentStatus, setCurrentStatus] = useState(statuses[0])
  const { toast } = useToast()
  const { addHistoryEvent } = useVehicleHistory(vehicle?.id || null)

  const updateStatus = async (newStatus: string) => {
    if (!vehicle) return

    setCurrentStatus(newStatus)
    
    try {
      await addHistoryEvent(vehicle.id, `Changed status to "${newStatus}"`)
      
      toast({
        title: "Status Updated",
        description: `Vehicle status changed to ${newStatus}`,
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

  const getProgressPercentage = () => {
    const currentIndex = statuses.indexOf(currentStatus);
    return ((currentIndex + 1) / statuses.length) * 100;
  }

  return {
    currentStatus,
    statuses,
    updateStatus,
    getProgressPercentage
  }
}
