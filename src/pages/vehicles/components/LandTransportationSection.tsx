
import { Truck } from "lucide-react"
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { UseFormReturn } from "react-hook-form"
import { SectionsData, VehicleFormValues } from "../types/vehicleTypes"
import { SectionWrapper } from "./SectionWrapper"
import { useLandTransportClosing } from "../hooks/useLandTransportClosing"
import { Upload } from "lucide-react"

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
          {/* Destination Subsection */}
          <div className="mb-6">
            <h3 className="text-md font-medium mb-4 border-b pb-2">Destination</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="receiver_port_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                        Receiver Port
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                          placeholder="Receiver Port ID"
                          className="w-full p-2 border rounded-lg"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="warehouse_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                        Warehouse
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                          placeholder="Warehouse ID"
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
                  name="destination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                        Destination
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Destination"
                          className="w-full p-2 border rounded-lg"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
          
          {/* Dates Subsection */}
          <div className="mb-6">
            <h3 className="text-md font-medium mb-4 border-b pb-2">Dates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="storage_start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                        Storage Start Date
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
                  name="pickup_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                        Pickup Date
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
                  name="pickup_date_status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                        Pickup Date Status
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Pickup Date Status"
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
                  name="delivery_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                        Delivery Date
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
                  name="delivery_date_status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                        Delivery Date Status
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Delivery Date Status"
                          className="w-full p-2 border rounded-lg"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
          
          {/* Price Subsection */}
          <div className="mb-6">
            <h3 className="text-md font-medium mb-4 border-b pb-2">Price</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="transport_listed_price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                        Transport Listed Price
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
                  name="balance_payment_time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                        Balance Payment Time
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          {...field}
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
                  name="balance_payment_method"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                        Balance Payment Method
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Balance Payment Method"
                          className="w-full p-2 border rounded-lg"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="storage_fee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                        Storage Fee
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
            </div>
          </div>
          
          {/* Photos Subsection */}
          <div className="mb-6">
            <h3 className="text-md font-medium mb-4 border-b pb-2">Photos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <FormLabel className="block text-sm font-medium text-gray-700">
                  Transporter Pickup Photo
                </FormLabel>
                <div className="border-2 border-dashed rounded-lg p-4 text-center">
                  <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                  <div className="text-sm text-gray-500 mb-2">
                    Drop photo here or click to upload
                  </div>
                  <button type="button" className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-sm font-medium hover:bg-blue-100">
                    Browse Photos
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <FormLabel className="block text-sm font-medium text-gray-700">
                  Transporter Delivery Photo
                </FormLabel>
                <div className="border-2 border-dashed rounded-lg p-4 text-center">
                  <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                  <div className="text-sm text-gray-500 mb-2">
                    Drop photo here or click to upload
                  </div>
                  <button type="button" className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-sm font-medium hover:bg-blue-100">
                    Browse Photos
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Transporter Company Subsection */}
          <div>
            <h3 className="text-md font-medium mb-4 border-b pb-2">Transporter Company</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="company_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                        Company Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Company Name"
                          className="w-full p-2 border rounded-lg"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="mc_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                        MC #
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="MC Number"
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
                  name="transporter_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                        Transporter Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Transporter Name"
                          className="w-full p-2 border rounded-lg"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="transporter_phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                        Transporter Phone
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Transporter Phone"
                          className="w-full p-2 border rounded-lg"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="transporter_payment_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
                        Transporter Payment Date
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
