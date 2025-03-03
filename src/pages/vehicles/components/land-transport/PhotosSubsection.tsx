
import { FormLabel } from "@/components/ui/form"
import { Upload } from "lucide-react"

export const PhotosSubsection = () => {
  return (
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
  )
}
