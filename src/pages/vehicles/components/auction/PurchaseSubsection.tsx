
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UseFormReturn } from "react-hook-form"
import { VehicleFormValues } from "../../types/vehicleTypes"

interface PurchaseSubsectionProps {
  form: UseFormReturn<VehicleFormValues>
}

export const PurchaseSubsection = ({ form }: PurchaseSubsectionProps) => {
  return (
    <div>
      <h3 className="text-md font-medium mb-4 border-b pb-2">Purchase</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="purchase_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                  Purchase Date
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
            name="auction_won_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                  Auction Won Price
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    {...field}
                    onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
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
            name="auction_final_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                  Auction Final Price
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    {...field}
                    onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    className="w-full p-2 border rounded-lg"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="auction_pay_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                  Auction Pay Date
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
        </div>
      </div>
    </div>
  )
}
