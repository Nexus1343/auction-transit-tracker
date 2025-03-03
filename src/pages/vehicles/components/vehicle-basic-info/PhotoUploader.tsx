
import { Camera } from "lucide-react"

export const PhotoUploader = () => {
  return (
    <div className="border-2 border-dashed rounded-lg p-6 text-center">
      <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <div className="text-sm text-gray-600 mb-2">
        Drop photos here or click to upload
      </div>
      <button type="button" className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100">
        Browse Files
      </button>
    </div>
  )
}
