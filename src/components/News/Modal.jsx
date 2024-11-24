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
    const [date, setDate] = useState(news?.date || "")
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

    // Update hasChanges state whenever the form inputs or images change
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

    const handleRemoveImage = (index) => {
        const updatedImagePreviews = [...imagePreviews]

        updatedImagePreviews.splice(index, 1)

        setImages(updatedImagePreviews) // Update the state for images
        setImagePreviews(updatedImagePreviews) // Update the state for imagePreviews

        console.log(updatedImagePreviews)

        setHasChanges(true) // Mark as changed after removing an image
    }

    // Function to check if all required fields are filled (used for adding a new article)
    const isFormValid = () => {
        return headline && author && date && body && images.length > 0
    }

    const handleSubmit = async () => {
        const formData = new FormData()
        formData.append("headline", headline)
        formData.append("author", author)
        formData.append("date", date)
        formData.append("body", body)

        // Add only the newly selected images
        if (Array.isArray(images) && images.length > 0) {
            images.forEach((image) => formData.append("images", image))
        }

        // If there are no new images but existing images need to be kept, send the existing ones
        if (!images.length && news?.images) {
            const existingImages = JSON.parse(news.images) // Assuming it's stored as a JSON string
            existingImages.forEach((image) => formData.append("images", image))
        }

        console.log(images)

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
                                onChange={(e) => setDate(e.target.value)}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                            />
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
                                    <button
                                        className="absolute top-1 right-1 bg-gray-700 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                        onClick={() => handleRemoveImage(index)}
                                        aria-label="Remove image"
                                    >
                                        &times;
                                    </button>
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
                        <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
                        Upload Photos
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
