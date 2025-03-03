
import { Car } from "lucide-react"
import { UseFormReturn } from "react-hook-form"
import { VehicleFormValues } from "../types/vehicleTypes"
import { VehicleIdentification } from "./vehicle-basic-info/VehicleIdentification"
import { VehicleManufacturerInfo } from "./vehicle-basic-info/VehicleManufacturerInfo"
import { VehicleDetails } from "./vehicle-basic-info/VehicleDetails"
import { PhotoUploader } from "./vehicle-basic-info/PhotoUploader"

interface VehicleBasicInfoProps {
  form: UseFormReturn<VehicleFormValues>
}

export const VehicleBasicInfo = ({ form }: VehicleBasicInfoProps) => {
  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-6 flex items-center">
          <Car className="w-5 h-5 text-gray-500 mr-2" />
          Vehicle Details
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <VehicleIdentification form={form} />
            <VehicleManufacturerInfo form={form} />
            <VehicleDetails form={form} />
          </div>
          <PhotoUploader />
        </div>
      </div>
    </div>
  )
}
