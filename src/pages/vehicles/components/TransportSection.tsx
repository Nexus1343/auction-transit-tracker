
import { Ship } from "lucide-react"
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UseFormReturn } from "react-hook-form"
import { SectionsData, VehicleFormValues } from "../types/vehicleTypes"
import { SectionWrapper } from "./SectionWrapper"

interface TransportSectionProps {
  form: UseFormReturn<VehicleFormValues>
  sectionsData: SectionsData
  addSection: (section: keyof SectionsData) => void
  removeSection: (section: keyof SectionsData) => void
}

export const TransportSection = ({ 
  form, 
  sectionsData, 
  addSection, 
  removeSection 
}: TransportSectionProps) => {
  return (
    <SectionWrapper
      title={<><Ship className="w-5 h-5 text-gray-500 mr-2" /> Transport Details</>}
      section="transport"
      sectionData={sectionsData}
      addSection={addSection}
      removeSection={removeSection}
      emptyDescription="No transport information has been added yet"
      addButtonText="transport details"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="destination"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                  Destination
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter destination"
                    className="w-full p-2 border rounded-lg"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
    </SectionWrapper>
  )
}
