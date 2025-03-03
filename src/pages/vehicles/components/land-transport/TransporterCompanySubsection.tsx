
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UseFormReturn } from "react-hook-form"
import { VehicleFormValues } from "../../types/vehicleTypes"

interface TransporterCompanySubsectionProps {
  form: UseFormReturn<VehicleFormValues>
}

export const TransporterCompanySubsection = ({ form }: TransporterCompanySubsectionProps) => {
  return (
    <div>
      <h3 className="text-md font-medium mb-4 border-b pb-2">Transporter Company</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="company_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Company Name"
                    className="w-full p-2 border rounded-lg"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="mc_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                  MC #
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="MC Number"
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
            name="transporter_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                  Transporter Name
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Transporter Name"
                    className="w-full p-2 border rounded-lg"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="transporter_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                  Transporter Phone
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Transporter Phone"
                    className="w-full p-2 border rounded-lg"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="transporter_payment_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                  Transporter Payment Date
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
