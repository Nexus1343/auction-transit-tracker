
import { Truck } from "lucide-react"
import { UseFormReturn } from "react-hook-form"
import { SectionsData, VehicleFormValues } from "../types/vehicleTypes"
import { SectionWrapper } from "./SectionWrapper"
import { useLandTransportClosing } from "../hooks/useLandTransportClosing"
import { DestinationSubsection } from "./land-transport/DestinationSubsection"
import { DatesSubsection } from "./land-transport/DatesSubsection"
import { PriceSubsection } from "./land-transport/PriceSubsection"
import { PhotosSubsection } from "./land-transport/PhotosSubsection"
import { TransporterCompanySubsection } from "./land-transport/TransporterCompanySubsection"

interface LandTransportationSectionProps {
  form: UseFormReturn<VehicleFormValues>
  sectionsData: SectionsData
  addSection: (section: keyof SectionsData) => void
  removeSection: (section: keyof SectionsData) => void
}

export const LandTransportationSection = ({ 
  form, 
  sectionsData, 
  addSection, 
  removeSection 
}: LandTransportationSectionProps) => {
  const { confirmClose, ConfirmationDialog } = useLandTransportClosing(form, removeSection);

  return (
    <>
      <ConfirmationDialog />
      <SectionWrapper
        title={<><Truck className="w-5 h-5 text-gray-500 mr-2" /> Land Transportation</>}
        section="landTransport"
        sectionData={sectionsData}
        addSection={addSection}
        removeSection={confirmClose}
        emptyDescription="No land transportation information has been added yet"
        addButtonText="land transportation information"
      >
        <div className="space-y-6">
          <DestinationSubsection form={form} />
          <DatesSubsection form={form} />
          <PriceSubsection form={form} />
          <PhotosSubsection />
          <TransporterCompanySubsection form={form} />
        </div>
      </SectionWrapper>
    </>
  )
}
