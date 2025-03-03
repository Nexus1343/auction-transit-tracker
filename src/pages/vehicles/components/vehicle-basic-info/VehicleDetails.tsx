
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { UseFormReturn } from "react-hook-form"
import { VehicleFormValues } from "../../types/vehicleTypes"
import { useBodyTypes } from "../../hooks/useBodyTypes"

interface VehicleDetailsProps {
  form: UseFormReturn<VehicleFormValues>
}

export const VehicleDetails = ({ form }: VehicleDetailsProps) => {
  const { data: bodyTypes = [], isLoading: isLoadingBodyTypes } = useBodyTypes()

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="body_type_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                Body Type
              </FormLabel>
              <Select
                value={field.value ? field.value.toString() : ""}
                onValueChange={(value) => field.onChange(parseInt(value) || 0)}
                disabled={isLoadingBodyTypes}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select body type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="0">Select body type</SelectItem>
                  {bodyTypes.map((bodyType) => (
                    <SelectItem key={bodyType.id} value={bodyType.id.toString()}>
                      {bodyType.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="has_key"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                Has Key
              </FormLabel>
              <FormControl>
                <div className="flex items-center h-10 mt-2">
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    id="has-key"
                  />
                  <label
                    htmlFor="has-key"
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

      <FormField
        control={form.control}
        name="highlights"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
              Highlights
            </FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Vehicle highlights..."
                className="w-full p-2 border rounded-lg"
                rows={4}
              />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  )
}
