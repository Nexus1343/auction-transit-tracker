
import { Users } from "lucide-react"
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UseFormReturn } from "react-hook-form"
import { SectionsData, VehicleFormValues } from "../types/vehicleTypes"
import { SectionWrapper } from "./SectionWrapper"

interface DealerSectionProps {
  form: UseFormReturn<VehicleFormValues>
  sectionsData: SectionsData
  addSection: (section: keyof SectionsData) => void
  removeSection: (section: keyof SectionsData) => void
}

export const DealerSection = ({ 
  form, 
  sectionsData, 
  addSection, 
  removeSection 
}: DealerSectionProps) => {
  return (
    <SectionWrapper
      title={<><Users className="w-5 h-5 text-gray-500 mr-2" /> Dealer</>}
      section="dealer"
      sectionData={sectionsData}
      addSection={addSection}
      removeSection={removeSection}
      emptyDescription="No dealer information has been added yet"
      addButtonText="dealer information"
    >
      <div className="space-y-6">
        {/* Dealer Subsection */}
        <div className="border-b pb-4">
          <h3 className="text-md font-medium mb-4">Dealer</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="dealer_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                    Dealer
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                      placeholder="Enter dealer ID"
                      className="w-full p-2 border rounded-lg"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sub_dealer_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                    Sub-Dealer
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                      placeholder="Enter sub-dealer ID"
                      className="w-full p-2 border rounded-lg"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="mt-4">
            <FormField
              control={form.control}
              name="pay_due_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                    Dealer Pay Due Date
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      placeholder="Select date"
                      className="w-full p-2 border rounded-lg"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Client Subsection */}
        <div>
          <h3 className="text-md font-medium mb-4">Client</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="client_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                    Client Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter client name"
                      className="w-full p-2 border rounded-lg"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="client_phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                    Client Phone Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter phone number"
                      className="w-full p-2 border rounded-lg"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="client_passport_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                    Client Passport Number
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter passport number"
                      className="w-full p-2 border rounded-lg"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="client_buyer_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                    Client Buyer ID
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter buyer ID"
                      className="w-full p-2 border rounded-lg"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>
    </SectionWrapper>
  )
}
