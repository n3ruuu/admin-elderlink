/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import SuccessModal from "./SuccessModal"
import axios from "axios"

const AddFormModal = ({ isOpen, onClose, onAddNewInitiative }) => {
  const [categoryName, setCategoryName] = useState("")
  const [icon, setIcon] = useState(null)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [successModalTitle, setSuccessModalTitle] = useState("")
  const [successModalMessage, setSuccessModalMessage] = useState("")

  const handleIconChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setIcon(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!categoryName.trim()) {
      alert("Category name is required")
      return
    }
    const formData = new FormData()
    formData.append("category_name", categoryName)
    if (icon) {
      const fileInput = document.getElementById("formIcon")
      formData.append("icon", fileInput.files[0])
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/forms/initiatives",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      const newInitiative = response.data

      if (onAddNewInitiative) {
        onAddNewInitiative(newInitiative)
         // ✅ Clear fields after adding
  setCategoryName("")
  setIcon(null)
      }
    } catch (error) {
      console.error("Error saving form:", error)
      alert("Failed to add initiative. Please try again.")
    }
  }

  const closeSuccessModal = () => {
    setIsSuccessModalOpen(false)
    onClose()
  }


  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96 max-w-full">
        <h2 className="text-2xl font-semibold mb-4">Add New Category</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">
              Category Name
            </label>
            <input
              type="text"
              id="categoryName"
              className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
              placeholder="Enter category name"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="formIcon" className="block text-sm font-medium text-gray-700">
              Icon
            </label>
            <input
              type="file"
              id="formIcon"
              accept="image/*"
              className="mt-1 p-2 w-full border border-gray-300 rounded-lg"
              onChange={handleIconChange}
            />
            {icon && (
              <div className="mt-2">
                <img
                  src={icon}
                  alt="Icon preview"
                  className="w-20 h-20 object-contain rounded-md"
                />
              </div>
            )}
          </div>
          <div className="flex justify-between gap-4">
            <button
              type="button"
              className="border w-[100px] h-[45px] border-[#219EBC] bg-transparent hover:bg-[#219EBC] hover:text-white text-[#219EBC] font-bold py-2 px-4 rounded transition-colors duration-300"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#219EBC] text-white w-[100px] h-[45px] font-bold py-2 px-4 rounded transition-colors duration-300 hover:bg-[#1A7F92]"
            >
              Add
            </button>
          </div>
        </form>

        <SuccessModal
          isOpen={isSuccessModalOpen}
          onClose={closeSuccessModal}
          title={successModalTitle}
          message={successModalMessage}
          onGoToArchives={() => {}}
          isArchiving={false}
        />
      </div>
    </div>
  )
}

export default AddFormModal
