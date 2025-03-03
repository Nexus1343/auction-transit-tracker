
import { useEffect } from "react"
import { Car, Camera } from "lucide-react"
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UseFormReturn } from "react-hook-form"
import { VehicleFormValues } from "../types/vehicleTypes"
import { useManufacturers } from "../hooks/useManufacturers"
import { useModels } from "../hooks/useModels"
import { useGenerations } from "../hooks/useGenerations"
import { useBodyTypes } from "../hooks/useBodyTypes"

interface VehicleBasicInfoProps {
  form: UseFormReturn<VehicleFormValues>
}

export const VehicleBasicInfo = ({ form }: VehicleBasicInfoProps) => {
  const { data: manufacturers = [], isLoading: isLoadingManufacturers } = useManufacturers()
  const { data: bodyTypes = [], isLoading: isLoadingBodyTypes } = useBodyTypes()
  
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
