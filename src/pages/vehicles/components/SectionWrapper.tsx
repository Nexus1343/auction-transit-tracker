
import { ReactNode } from "react"
import { Plus, X } from "lucide-react"
import { SectionsData } from "../types/vehicleTypes"

interface SectionWrapperProps {
  title: ReactNode
  section: keyof SectionsData
  sectionData: SectionsData
  addSection: (section: keyof SectionsData) => void
  removeSection: (section: keyof SectionsData) => void
  emptyDescription: string
  addButtonText: string
  children: ReactNode
}

export const SectionWrapper = ({
  title,
  section,
  sectionData,
  addSection,
  removeSection,
  emptyDescription,
  addButtonText,
  children
}: SectionWrapperProps) => {
  
  const renderEmptyState = () => (
    <div className="py-8 flex flex-col items-center justify-center text-center">
      <div className="text-sm text-gray-500 mb-4">{emptyDescription}</div>
      <button
        onClick={() => addSection(section)}
        className="flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add {addButtonText}
      </button>
    </div>
  )

  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="p-6">
        <h2 className="text-lg font-semibold flex items-center">
          {title}
        </h2>
        {!sectionData[section] ? (
          renderEmptyState()
        ) : (
          <div className="mt-6">
            <div className="flex justify-between items-start mb-6">
              <div className="text-sm text-gray-500">{addButtonText} information added</div>
              <button
                type="button"
                onClick={() => removeSection(section)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {children}
          </div>
        )}
      </div>
    </div>
  )
}
