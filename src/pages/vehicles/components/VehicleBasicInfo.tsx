
import { Car, Camera } from "lucide-react"
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UseFormReturn } from "react-hook-form"
import { VehicleFormValues } from "../types/vehicleTypes"

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
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="stock_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                      Stock #
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Stock number"
                        className="w-full p-2 border rounded-lg"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                      VIN
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Vehicle VIN"
                        className="w-full p-2 border rounded-lg"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                      Year
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="number"
                        className="w-full p-2 border rounded-lg"
                        onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lot_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                      Lot Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Lot number"
                        className="w-full p-2 border rounded-lg"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="border-2 border-dashed rounded-lg p-6 text-center">
            <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <div className="text-sm text-gray-600 mb-2">
              Drop photos here or click to upload
            </div>
            <button type="button" className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100">
              Browse Files
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
