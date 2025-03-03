
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { UseFormReturn } from "react-hook-form"
import { VehicleFormValues } from "../../types/vehicleTypes"

interface AddressSubsectionProps {
  form: UseFormReturn<VehicleFormValues>
}

export const AddressSubsection = ({ form }: AddressSubsectionProps) => {
  return (
    <div className="mb-6">
      <h3 className="text-md font-medium mb-4 border-b pb-2">Address</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Address"
                    className="w-full p-2 border rounded-lg"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="City"
                      className="w-full p-2 border rounded-lg"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="State"
                      className="w-full p-2 border rounded-lg"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="zip_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                  Zip Code
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Zip Code"
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
            name="gate_pass_pin"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                  Gate Pass PIN
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Gate Pass PIN"
                    className="w-full p-2 border rounded-lg"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="is_sublot"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                  Is Sublot
                </FormLabel>
                <FormControl>
                  <div className="flex items-center h-10 mt-2">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      id="is-sublot"
                    />
                    <label
                      htmlFor="is-sublot"
                      className="ml-2 text-sm text-gray-600"
                    >
                      Yes
                    </label>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
    </div>
  )
}
