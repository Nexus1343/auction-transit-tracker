
import { useState, useEffect } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { useManufacturers } from "@/pages/vehicles/hooks/useManufacturers"
import { useModels } from "@/pages/vehicles/hooks/useModels"

// Define form schema with Zod
const vehicleFormSchema = z.object({
  vin: z.string().min(1, "VIN is required"),
  lotNumber: z.string().min(1, "Lot number is required"),
  manufacturerId: z.string().min(1, "Manufacturer is required"),
  modelId: z.string().min(1, "Model is required"),
  year: z.string().regex(/^\d{4}$/, "Year must be a 4-digit number"),
})

type VehicleFormValues = z.infer<typeof vehicleFormSchema>

interface AddVehicleModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onVehicleAdded: () => void
}

export function AddVehicleModal({ open, onOpenChange, onVehicleAdded }: AddVehicleModalProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { data: manufacturers = [], isLoading: isLoadingManufacturers } = useManufacturers()
  const [selectedManufacturerId, setSelectedManufacturerId] = useState<number | null>(null)
  const { data: models = [], isLoading: isLoadingModels } = useModels(selectedManufacturerId)

  // Initialize form
  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      vin: "",
      lotNumber: "",
      manufacturerId: "",
      modelId: "",
      year: new Date().getFullYear().toString(),
    },
  })

  // Reset model when manufacturer changes
  useEffect(() => {
    if (form.getValues("manufacturerId") !== selectedManufacturerId?.toString()) {
      form.setValue("modelId", "")
    }
  }, [selectedManufacturerId, form])

  // Form submission handler
  async function onSubmit(data: VehicleFormValues) {
    setIsSubmitting(true)
    
    try {
      // Create vehicle record
      const { error: vehicleError } = await supabase
        .from('vehicles')
        .insert({
          vin: data.vin,
          lot_number: data.lotNumber,
          manufacturer_id: parseInt(data.manufacturerId),
          model_id: parseInt(data.modelId),
          year: parseInt(data.year)
        });
      
      if (vehicleError) throw vehicleError;
      
      toast({
        title: "Vehicle Added",
        description: `Successfully added vehicle with VIN: ${data.vin}`,
      })
      
      // Reset form and close modal
      form.reset()
      onOpenChange(false)
      // Refresh the vehicle list
      onVehicleAdded()
    } catch (error) {
      console.error("Error adding vehicle:", error)
      toast({
        title: "Error",
        description: "Failed to add vehicle. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Vehicle</DialogTitle>
          <DialogDescription>
            Enter the basic information for the vehicle. You can add additional details later.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="vin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>VIN</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter vehicle VIN" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="lotNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lot Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter lot number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="manufacturerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Manufacturer</FormLabel>
                  <Select
                    disabled={isLoadingManufacturers}
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedManufacturerId(parseInt(value));
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a manufacturer" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {manufacturers.map((manufacturer) => (
                        <SelectItem 
                          key={manufacturer.id} 
                          value={manufacturer.id.toString()}
                        >
                          {manufacturer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="modelId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <Select
                    disabled={isLoadingModels || !selectedManufacturerId}
                    onValueChange={field.onChange}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a model" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {models.map((model) => (
                        <SelectItem 
                          key={model.id} 
                          value={model.id.toString()}
                        >
                          {model.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Year</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 2022" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Adding..." : "Add Vehicle"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
