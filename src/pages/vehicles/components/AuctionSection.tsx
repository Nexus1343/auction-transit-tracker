
import { Building } from "lucide-react"
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { UseFormReturn } from "react-hook-form"
import { SectionsData, VehicleFormValues } from "../types/vehicleTypes"
import { SectionWrapper } from "./SectionWrapper"
import { useAuctionClosing } from "../hooks/useAuctionClosing"

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
          {/* Platform Subsection */}
          <div className="mb-6">
            <h3 className="text-md font-medium mb-4 border-b pb-2">Platform</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="auction_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                        Auction Platform
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                          placeholder="Auction ID"
                          className="w-full p-2 border rounded-lg"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="lot_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                        Lot Number
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Lot number"
                          className="w-full p-2 border rounded-lg"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
          
          {/* Address Subsection */}
          <div className="mb-6">
            <h3 className="text-md font-medium mb-4 border-b pb-2">Address</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                        Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Address"
                          className="w-full p-2 border rounded-lg"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="City"
                            className="w-full p-2 border rounded-lg"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                          State
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="State"
                            className="w-full p-2 border rounded-lg"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="zip_code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                        Zip Code
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Zip Code"
                          className="w-full p-2 border rounded-lg"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="gate_pass_pin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                        Gate Pass PIN
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Gate Pass PIN"
                          className="w-full p-2 border rounded-lg"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="is_sublot"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                        Is Sublot
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center h-10 mt-2">
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            id="is-sublot"
                          />
                          <label
                            htmlFor="is-sublot"
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
            </div>
          </div>
          
          {/* Purchase Subsection */}
          <div>
            <h3 className="text-md font-medium mb-4 border-b pb-2">Purchase</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="purchase_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                        Purchase Date
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          className="w-full p-2 border rounded-lg"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="auction_won_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                        Auction Won Price
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                          className="w-full p-2 border rounded-lg"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="auction_final_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                        Auction Final Price
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                          className="w-full p-2 border rounded-lg"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="auction_pay_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                        Auction Pay Date
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          className="w-full p-2 border rounded-lg"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>
    </>
  )
}
