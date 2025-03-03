
import { useEffect } from "react"
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UseFormReturn } from "react-hook-form"
import { VehicleFormValues } from "../../types/vehicleTypes"
import { useManufacturers } from "../../hooks/useManufacturers"
import { useModels } from "../../hooks/useModels"
import { useGenerations } from "../../hooks/useGenerations"

interface VehicleManufacturerInfoProps {
  form: UseFormReturn<VehicleFormValues>
}

export const VehicleManufacturerInfo = ({ form }: VehicleManufacturerInfoProps) => {
  const { data: manufacturers = [], isLoading: isLoadingManufacturers } = useManufacturers()
  
  const manufacturerId = form.watch("manufacturer_id")
  const { data: models = [], isLoading: isLoadingModels } = useModels(manufacturerId || null)
  
  const modelId = form.watch("model_id")
  const { data: generations = [], isLoading: isLoadingGenerations } = useGenerations(modelId || null)
  
  // Reset model and generation when manufacturer changes
  useEffect(() => {
    if (manufacturerId) {
      form.setValue("model_id", 0)
      form.setValue("generation_id", 0)
    }
  }, [manufacturerId, form])
  
  // Reset generation when model changes
  useEffect(() => {
    if (modelId) {
      form.setValue("generation_id", 0)
    }
  }, [modelId, form])

  return (
    <div className="space-y-4">
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
          name="manufacturer_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                Manufacturer
              </FormLabel>
              <Select
                value={field.value ? field.value.toString() : ""}
                onValueChange={(value) => field.onChange(parseInt(value) || 0)}
                disabled={isLoadingManufacturers}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select manufacturer" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="0">Select manufacturer</SelectItem>
                  {manufacturers.map((manufacturer) => (
                    <SelectItem key={manufacturer.id} value={manufacturer.id.toString()}>
                      {manufacturer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="model_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                Model
              </FormLabel>
              <Select
                value={field.value ? field.value.toString() : ""}
                onValueChange={(value) => field.onChange(parseInt(value) || 0)}
                disabled={isLoadingModels || !manufacturerId}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="0">Select model</SelectItem>
                  {models.map((model) => (
                    <SelectItem key={model.id} value={model.id.toString()}>
                      {model.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="generation_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                Generation
              </FormLabel>
              <Select
                value={field.value ? field.value.toString() : ""}
                onValueChange={(value) => field.onChange(parseInt(value) || 0)}
                disabled={isLoadingGenerations || !modelId}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select generation" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="0">Select generation</SelectItem>
                  {generations.map((generation) => (
                    <SelectItem key={generation.id} value={generation.id.toString()}>
                      {generation.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
