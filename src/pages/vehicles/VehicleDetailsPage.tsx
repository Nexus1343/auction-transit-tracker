
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Form } from "@/components/ui/form"
import { VehicleHeader } from "./components/VehicleHeader"
import { VehicleBasicInfo } from "./components/VehicleBasicInfo"
import { AuctionSection } from "./components/AuctionSection"
import { DealerSection } from "./components/DealerSection"
import { DocumentsSection } from "./components/DocumentsSection"
import { VehicleLoading } from "./components/VehicleLoading"
import { VehicleNotFound } from "./components/VehicleNotFound"
import { useVehicleDetails } from "./hooks/useVehicleDetails"
import { useVehicleStatus } from "./hooks/useVehicleStatus"
import { useSectionActions } from "./hooks/useSectionActions"
import { saveVehicleDetails } from "./services/vehicleService"
import { LandTransportationSection } from "./components/LandTransportationSection"
import { SeaTransportationSection } from "./components/SeaTransportationSection"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

// Create a client
const queryClient = new QueryClient()

const VehicleDetailsPage = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  
  const {
    vehicle,
    isLoading,
    isSaving,
    setIsSaving,
    form,
    sectionsData,
    setSectionsData,
    setVehicle
  } = useVehicleDetails()
  
  const {
    currentStatus,
    statuses,
    updateStatus,
    getProgressPercentage
  } = useVehicleStatus(vehicle)
  
  const { addSection, removeSection } = useSectionActions(
    vehicle,
    sectionsData,
    setSectionsData
  )

  const onSubmit = async (data: any) => {
    if (!vehicle) return
    
    setIsSaving(true)
    try {
      console.log("Saving data:", data);
      
      await saveVehicleDetails(vehicle, data, setVehicle)
      
      toast({
        title: "Success",
        description: "Vehicle details updated successfully.",
      })
      
    } catch (error) {
      console.error('Error updating vehicle details:', error)
      toast({
        title: "Error",
        description: "Failed to update vehicle details. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <VehicleLoading />
  }

  if (!vehicle) {
    return <VehicleNotFound />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <VehicleHeader
        vehicle={vehicle}
        currentStatus={currentStatus}
        statuses={statuses}
        updateStatus={updateStatus}
        getProgressPercentage={getProgressPercentage}
      />

      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <VehicleBasicInfo form={form} />
            
            <AuctionSection 
              form={form}
              sectionsData={sectionsData}
              addSection={addSection}
              removeSection={removeSection}
            />
            
            <DealerSection 
              form={form}
              sectionsData={sectionsData}
              addSection={addSection}
              removeSection={removeSection}
            />
            
            <LandTransportationSection
              form={form}
              sectionsData={sectionsData}
              addSection={addSection}
              removeSection={removeSection}
            />
            
            <SeaTransportationSection
              form={form}
              sectionsData={sectionsData}
              addSection={addSection}
              removeSection={removeSection}
            />
            
            <DocumentsSection
              sectionsData={sectionsData}
              addSection={addSection}
              removeSection={removeSection}
            />

            <div className="flex justify-end mb-8">
              <Button
                type="submit"
                disabled={isSaving}
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}

// Wrap the component with QueryClientProvider
const VehicleDetailsPageWithQueryClient = () => (
  <QueryClientProvider client={queryClient}>
    <VehicleDetailsPage />
  </QueryClientProvider>
)

export default VehicleDetailsPageWithQueryClient
