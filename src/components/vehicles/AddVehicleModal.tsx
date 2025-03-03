
import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"

// Define form schema with Zod
const vehicleFormSchema = z.object({
  vin: z.string().min(1, "VIN is required"),
  lotNumber: z.string().min(1, "Lot number is required"),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  model: z.string().min(1, "Model is required"),
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

  // Initialize form
  const form = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      vin: "",
      lotNumber: "",
      manufacturer: "",
      model: "",
      year: new Date().getFullYear().toString(),
    },
  })

  // Form submission handler
  async function onSubmit(data: VehicleFormValues) {
    setIsSubmitting(true)
    
    try {
      // Find or create manufacturer
      let manufacturerId: number;
      const { data: existingManufacturer } = await supabase
        .from('manufacturers')
        .select('id')
        .eq('name', data.manufacturer)
        .maybeSingle();
      
      if (existingManufacturer) {
        manufacturerId = existingManufacturer.id;
      } else {
        const { data: newManufacturer, error: manufacturerError } = await supabase
          .from('manufacturers')
          .insert({ name: data.manufacturer })
          .select('id')
          .single();
          
        if (manufacturerError) throw manufacturerError;
        manufacturerId = newManufacturer.id;
      }
      
      // Find or create model
      let modelId: number;
      const { data: existingModel } = await supabase
        .from('models')
        .select('id')
        .eq('name', data.model)
        .eq('manufacturer_id', manufacturerId)
        .maybeSingle();
      
      if (existingModel) {
        modelId = existingModel.id;
      } else {
        const { data: newModel, error: modelError } = await supabase
          .from('models')
          .insert({ 
            name: data.model,
            manufacturer_id: manufacturerId 
          })
          .select('id')
          .single();
          
        if (modelError) throw modelError;
        modelId = newModel.id;
      }
      
      // Create vehicle record
      const { error: vehicleError } = await supabase
        .from('vehicles')
        .insert({
          vin: data.vin,
          lot_number: data.lotNumber,
          manufacturer_id: manufacturerId,
          model_id: modelId,
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
              name="manufacturer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Manufacturer</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Toyota, Honda" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Model</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Camry, Civic" {...field} />
                  </FormControl>
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
