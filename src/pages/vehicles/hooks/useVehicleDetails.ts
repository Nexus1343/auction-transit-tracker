
import { useState } from "react"
import { useVehicleData } from "./useVehicleData"
import { useVehicleForm } from "./useVehicleForm"

export const useVehicleDetails = () => {
  const [isSaving, setIsSaving] = useState(false)
  
  const {
    id,
    vehicle,
    isLoading,
    setVehicle,
    sectionsData,
    setSectionsData
  } = useVehicleData()
  
  const form = useVehicleForm(vehicle)

  return {
    id,
    vehicle,
    isLoading,
    isSaving,
    setIsSaving,
    form,
    sectionsData,
    setSectionsData,
    setVehicle
  }
}
