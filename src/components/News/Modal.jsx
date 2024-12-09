/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import SendIcon from "../../assets/icons/news-send.svg"
import PhotoIcon from "../../assets/icons/photo.svg"
import axios from "axios"

const Modal = ({ onClose, onSubmit, news }) => {
    const loggedInUsername = localStorage.getItem("username") || ""

    const [headline, setHeadline] = useState(news?.headline || "")
    const [author, setAuthor] = useState(news?.author || loggedInUsername)
    const [date, setDate] = useState(news?.date ? new Date(news.date).toISOString().split("T")[0] : "")
    const [body, setBody] = useState(news?.body || "")
    const [images, setImages] = useState(news.images || "")
    const [imagePreviews, setImagePreviews] = useState(
        news?.images
            ? Array.isArray(news.images)
                ? news.images.map((img) => `http://localhost:5000/uploads/${img}`)
                : JSON.parse(news.images).map((img) => `http://localhost:5000/uploads/${img}`)
            : [],
    )

    const [hasChanges, setHasChanges] = useState(false)
    const [dateError, setDateError] = useState("") // State for date error

    useEffect(() => {
        setHasChanges(
            headline !== news?.headline ||
                author !== news?.author ||
                date !== news?.date ||
                body !== news?.body ||
                images.length !== (news?.images?.length || 0),
        )
    }, [headline, author, date, body, images, news])

    const handleImageChange = (e) => {
        if (e.target.files) {
            const files = Array.from(e.target.files)
            setImages((prevImages) => [...prevImages, ...files])
            setImagePreviews((prevPreviews) => [...prevPreviews, ...files.map((file) => URL.createObjectURL(file))])
        }
    }

    const isFormValid = () => {
        return headline && author && date && body && images.length > 0 && !dateError
    }

    const handleDateChange = (e) => {
        const selectedDate = e.target.value
        const today = new Date().toISOString().split("T")[0] // Today's date in YYYY-MM-DD format

        if (selectedDate < today) {
            setDateError("The date cannot be in the past.")
        } else {
            setDateError("") // Clear the error if the date is valid
        }

        setDate(selectedDate)
    }

    const handleSubmit = async () => {
        if (dateError) return // Prevent submission if there's a date error

        const formData = new FormData()
        formData.append("headline", headline)
        formData.append("author", author)
        formData.append("date", date)
        formData.append("body", body)
        if (Array.isArray(images)) {
            images.forEach((image) => formData.append("images", image))
        }

        try {
            const response = news?.id
                ? await axios.put(`http://localhost:5000/news/${news.id}`, formData, {
                      headers: { "Content-Type": "multipart/form-data" },
                  })
                : await axios.post("http://localhost:5000/news", formData, {
                      headers: { "Content-Type": "multipart/form-data" },
                  })

            const article = news?.id ? response.data.updatedArticle : response.data
            onSubmit(article)
            onClose()
        } catch (error) {
            console.error("Error saving news:", error)
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg w-[600px] p-6 relative">
                <button
                    className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-2xl p-2"
                    onClick={onClose}
                    aria-label="Close modal"
                >
                    &times;
                </button>
                <h2 className="text-3xl font-bold mb-4">{news?.id ? "Edit" : "Add"} News</h2>

                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-700">Headline:</label>
                        <input
                            type="text"
                            value={headline}
                            onChange={(e) => setHeadline(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700">Date:</label>
                            <input
                                type="date"
                                value={date}
                                onChange={handleDateChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                            {dateError && <p className="text-red-500 text-sm mt-1">{dateError}</p>}
                        </div>
                        <div>
                            <label className="block text-gray-700">Author:</label>
                            <input
                                type="text"
                                value={author}
                                readOnly
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-gray-700">Body:</label>
                        <textarea
                            rows="4"
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                        ></textarea>
                    </div>

                    {imagePreviews.length > 0 && (
                        <div className="flex space-x-4 mt-4">
                            {imagePreviews.map((preview, index) => (
                                <div key={index} className="relative w-32 h-32">
                                    <img
                                        src={preview}
                                        alt="Image Preview"
                                        className="w-full h-full object-cover rounded-md"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-end gap-2 mt-6">
                    <label className="flex items-center px-4 py-2 border border-[#219EBC] text-[#219EBC] rounded-md cursor-pointer hover:bg-[#E0F7FA] transition-all duration-200">
                        <span className="mr-2">
                            <img src={PhotoIcon} alt="Upload Photo" />
                        </span>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={(e) => {
                                if (news?.id) {
                                    const files = Array.from(e.target.files)
                                    setImages(files)
                                    setImagePreviews(files.map((file) => URL.createObjectURL(file)))
                                } else {
                                    handleImageChange(e)
                                }
                            }}
                            className="hidden"
                        />
                        {news?.id ? "Replace Photos" : "Upload Photos"}
                    </label>

                    <button
                        className={`flex w-[150px] items-center justify-center py-2 ${
                            (news?.id ? hasChanges : isFormValid())
                                ? "bg-[#219EBC] text-white"
                                : "bg-gray-400 text-white"
                        } rounded-md`}
                        onClick={handleSubmit}
                        disabled={news?.id ? !hasChanges : !isFormValid()}
                    >
                        <span className="mr-2">
                            <img src={SendIcon} alt="Publish" width="15px" />
                        </span>
                        {news?.id ? "Edit" : "Publish"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Modal
