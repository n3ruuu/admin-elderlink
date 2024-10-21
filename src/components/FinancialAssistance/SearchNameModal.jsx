/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import Form from "./Form"

const SearchNameModal = ({ isOpen, onClose }) => {
    const [searchTerm, setSearchTerm] = useState("")
    const [suggestions, setSuggestions] = useState([])
    const [membersList, setMembersList] = useState([])
    const [isEditable, setIsEditable] = useState(true)

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await fetch("http://localhost:5000/members")
                if (!response.ok) {
                    throw new Error("Network response was not ok")
                }
                const data = await response.json()
                setMembersList(data)
            } catch (error) {
                console.error("Failed to fetch members:", error)
            }
        }

        fetchMembers()
    }, [])

    useEffect(() => {
        if (searchTerm) {
            const filteredSuggestions = membersList.filter((member) => {
                // Exclude the selected name from suggestions
                return (
                    member.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) &&
                    member.name.toLowerCase() !== searchTerm.toLowerCase()
                )
            })
            setSuggestions(filteredSuggestions)
        } else {
            setSuggestions([])
        }
    }, [searchTerm, membersList])

    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion.name) // Set the selected name in the search input
        setSuggestions([]) // Clear suggestions immediately
        setIsEditable(false) // Lock the input field
    }

    const clearSearchTerm = () => {
        setSearchTerm("")
        setSuggestions([])
        setIsEditable(true) // Make input editable again
    }

    const isSaveDisabled = searchTerm.trim() === "" // Disable Save button if search term is empty

    if (!isOpen) return null // Do not render the modal if it's not open

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-[40%]">
                <h2 className="text-3xl font-bold mb-6">Search Member</h2>
                <Form
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    clearSearchTerm={clearSearchTerm}
                    suggestions={suggestions} // Pass suggestions to Form
                    handleSuggestionClick={handleSuggestionClick}
                    handleSave={() => {
                        // Implement Save functionality here
                    }}
                    onClose={onClose}
                    isSaveDisabled={isSaveDisabled}
                    isEditable={isEditable} // Pass the editable state to Form
                />
            </div>
        </div>
    )
}

export default SearchNameModal
