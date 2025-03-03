
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UseFormReturn } from "react-hook-form"
import { VehicleFormValues } from "../../types/vehicleTypes"

interface DatesSubsectionProps {
  form: UseFormReturn<VehicleFormValues>
}

export const DatesSubsection = ({ form }: DatesSubsectionProps) => {
  return (
    <div className="mb-6">
      <h3 className="text-md font-medium mb-4 border-b pb-2">Dates</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="storage_start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                  Storage Start Date
                </FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    className="w-full p-2 border rounded-lg"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="pickup_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                  Pickup Date
                </FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    className="w-full p-2 border rounded-lg"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="pickup_date_status"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                  Pickup Date Status
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Pickup Date Status"
                    className="w-full p-2 border rounded-lg"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="delivery_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Date
                </FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    className="w-full p-2 border rounded-lg"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="delivery_date_status"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Date Status
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Delivery Date Status"
                    className="w-full p-2 border rounded-lg"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  )
}
