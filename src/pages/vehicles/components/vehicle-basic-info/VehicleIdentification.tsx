
import { Car } from "lucide-react"
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UseFormReturn } from "react-hook-form"
import { VehicleFormValues } from "../../types/vehicleTypes"

interface VehicleIdentificationProps {
  form: UseFormReturn<VehicleFormValues>
}

export const VehicleIdentification = ({ form }: VehicleIdentificationProps) => {
  return (
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
    </div>
  )
}
