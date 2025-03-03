
import { Building } from "lucide-react"
import { UseFormReturn } from "react-hook-form"
import { SectionsData, VehicleFormValues } from "../types/vehicleTypes"
import { SectionWrapper } from "./SectionWrapper"
import { useAuctionClosing } from "../hooks/useAuctionClosing"
import { PlatformSubsection } from "./auction/PlatformSubsection"
import { AddressSubsection } from "./auction/AddressSubsection"
import { PurchaseSubsection } from "./auction/PurchaseSubsection"

interface AuctionSectionProps {
  form: UseFormReturn<VehicleFormValues>
  sectionsData: SectionsData
  addSection: (section: keyof SectionsData) => void
  removeSection: (section: keyof SectionsData) => void
}

export const AuctionSection = ({ 
  form, 
  sectionsData, 
  addSection, 
  removeSection 
}: AuctionSectionProps) => {
  const { confirmClose, ConfirmationDialog } = useAuctionClosing(form, removeSection);

  return (
    <>
      <ConfirmationDialog />
      <SectionWrapper
        title={<><Building className="w-5 h-5 text-gray-500 mr-2" /> Auction</>}
        section="auction"
        sectionData={sectionsData}
        addSection={addSection}
        removeSection={confirmClose}
        emptyDescription="No auction information has been added yet"
        addButtonText="auction information"
      >
        <div className="space-y-6">
          <PlatformSubsection form={form} />
          <AddressSubsection form={form} />
          <PurchaseSubsection form={form} />
        </div>
      </SectionWrapper>
    </>
  )
}
