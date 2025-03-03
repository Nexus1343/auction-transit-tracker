
import { Anchor } from "lucide-react"
import { UseFormReturn } from "react-hook-form"
import { SectionsData, VehicleFormValues } from "../types/vehicleTypes"
import { SectionWrapper } from "./SectionWrapper"
import { useSeaTransportClosing } from "../hooks/useSeaTransportClosing"
import { ShippingDetailsSubsection } from "./sea-transport/ShippingDetailsSubsection"
import { ContainerSubsection } from "./sea-transport/ContainerSubsection"
import { ScheduleSubsection } from "./sea-transport/ScheduleSubsection"

interface SeaTransportationSectionProps {
  form: UseFormReturn<VehicleFormValues>
  sectionsData: SectionsData
  addSection: (section: keyof SectionsData) => void
  removeSection: (section: keyof SectionsData) => void
}

export const SeaTransportationSection = ({ 
  form, 
  sectionsData, 
  addSection, 
  removeSection 
}: SeaTransportationSectionProps) => {
  const { confirmClose, ConfirmationDialog } = useSeaTransportClosing(form, removeSection);

  return (
    <>
      <ConfirmationDialog />
      <SectionWrapper
        title={<><Anchor className="w-5 h-5 text-gray-500 mr-2" /> Sea Transportation</>}
        section="seaTransport"
        sectionData={sectionsData}
        addSection={addSection}
        removeSection={confirmClose}
        emptyDescription="No sea transportation information has been added yet"
        addButtonText="sea transportation information"
      >
        <div className="space-y-6">
          <ShippingDetailsSubsection form={form} />
          <ContainerSubsection form={form} />
          <ScheduleSubsection form={form} />
        </div>
      </SectionWrapper>
    </>
  )
}
