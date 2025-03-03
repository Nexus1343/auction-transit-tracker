
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UseFormReturn } from "react-hook-form"
import { VehicleFormValues } from "../../types/vehicleTypes"

interface PlatformSubsectionProps {
  form: UseFormReturn<VehicleFormValues>
}

export const PlatformSubsection = ({ form }: PlatformSubsectionProps) => {
  return (
    <div className="mb-6">
      <h3 className="text-md font-medium mb-4 border-b pb-2">Platform</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="auction_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                  Auction Platform
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                    placeholder="Auction ID"
                    className="w-full p-2 border rounded-lg"
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
    </div>
  )
}
