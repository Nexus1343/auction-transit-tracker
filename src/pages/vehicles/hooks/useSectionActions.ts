
import { useVehicleHistory } from "./useVehicleHistory"
import { SectionsData } from "../types/vehicleTypes"

export const useSectionActions = (
  vehicle: { id: number } | null,
  sectionsData: SectionsData,
  setSectionsData: React.Dispatch<React.SetStateAction<SectionsData>>
) => {
  const { addHistoryEvent } = useVehicleHistory(vehicle?.id || null)

  const addSection = async (section: keyof typeof sectionsData) => {
    setSectionsData(prev => ({
      ...prev,
      [section]: {}
    }));
    
    if (vehicle) {
      await addHistoryEvent(vehicle.id, `Added ${section} information`)
    }
  }

  const removeSection = async (section: keyof typeof sectionsData) => {
    setSectionsData(prev => ({
      ...prev,
      [section]: null
    }));
    
    if (vehicle) {
      await addHistoryEvent(vehicle.id, `Removed ${section} information`)
    }
  }

  return {
    addSection,
    removeSection
  }
}
