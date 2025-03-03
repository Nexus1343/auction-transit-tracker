
import { FileText, Upload } from "lucide-react"
import { SectionsData } from "../types/vehicleTypes"
import { SectionWrapper } from "./SectionWrapper"

interface DocumentsSectionProps {
  sectionsData: SectionsData
  addSection: (section: keyof SectionsData) => void
  removeSection: (section: keyof SectionsData) => void
}

export const DocumentsSection = ({ 
  sectionsData, 
  addSection, 
  removeSection 
}: DocumentsSectionProps) => {
  return (
    <SectionWrapper
      title={<><FileText className="w-5 h-5 text-gray-500 mr-2" /> Documents</>}
      section="documents"
      sectionData={sectionsData}
      addSection={addSection}
      removeSection={removeSection}
      emptyDescription="No documents have been uploaded yet"
      addButtonText="documents"
    >
      <div className="border-2 border-dashed rounded-lg p-6 text-center">
        <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
        <div className="text-sm text-gray-500 mb-4">
          Drop files here or click to upload
        </div>
        <button type="button" className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100">
          Browse Files
        </button>
      </div>
    </SectionWrapper>
  )
}
