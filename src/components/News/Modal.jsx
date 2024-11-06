/* eslint-disable react/prop-types */
import { useState, useEffect } from "react"
import SendIcon from "../../assets/icons/news-send.svg"
import PhotoIcon from "../../assets/icons/photo.svg"
import axios from "axios"

const Modal = ({ onClose, onSubmit, news }) => {
    const [headline, setHeadline] = useState(news?.headline || "")
    const [author, setAuthor] = useState(news?.author || "")
    const [date, setDate] = useState(news?.date || "")
    const [body, setBody] = useState(news?.body || "")
    const [image, setImage] = useState(null)
    const [imagePreview, setImagePreview] = useState(null)
    const [hasChanges, setHasChanges] = useState(false)

    // If news is being edited and has an image, set the imagePreview
    useEffect(() => {
        if (news?.image) {
            setImagePreview(`http://localhost:5000/uploads/${news.image}`) // Assuming news.image contains the URL of the image
        }
    }, [news])

    // Update hasChanges state whenever the form inputs or image change
    useEffect(() => {
        setHasChanges(
            headline !== news?.headline ||
                author !== news?.author ||
                date !== news?.date ||
                body !== news?.body ||
                image !== null,
        )
    }, [headline, author, date, body, image, news])

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setImage(file)
            setImagePreview(URL.createObjectURL(file))
        }
    }

    const handleRemoveImage = () => {
        setImage(null)
        setImagePreview(null)
        setHasChanges(true) // Indicate change if the image is removed
    }

    // Function to check if all required fields are filled (used for adding a new article)
    const isFormValid = () => {
        return headline && author && date && body && image
    }

    const handleSubmit = async () => {
        const formData = new FormData()
        formData.append("headline", headline)
        formData.append("author", author)
        formData.append("date", date)
        formData.append("body", body)
        if (image) formData.append("image", image)

        try {
            const response = news?.id
                ? await axios.put(
                      `http://localhost:5000/news/${news.id}`,
                      formData,
                      { headers: { "Content-Type": "multipart/form-data" } },
                  )
                : await axios.post("http://localhost:5000/news", formData, {
                      headers: { "Content-Type": "multipart/form-data" },
                  })

            // If updating, use the updated article, otherwise use the newly created article
            const article = news?.id
                ? response.data.updatedArticle
                : response.data

            onSubmit(article) // Pass the correct article object
            onClose() // Close the modal after submission
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
                <h2 className="text-3xl font-bold mb-4">
                    {news?.id ? "Edit" : "Add"} News
                </h2>

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
                            <label className="block text-gray-700">
                                Author:
                            </label>
                            <input
                                type="text"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
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

                    {imagePreview && (
                        <div className="relative mt-4 w-32 h-32">
                            <img
                                src={imagePreview}
                                alt="Image Preview"
                                className="w-full h-full object-cover rounded-md"
                            />
                            <button
                                className="absolute top-1 right-1 bg-gray-700 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                onClick={handleRemoveImage}
                                aria-label="Remove image"
                            >
                                &times;
                            </button>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-end gap-2 mt-6">
                    <label className="flex items-center px-4 py-2 border border-[#219EBC] text-[#219EBC] rounded-md cursor-pointer">
                        <span className="mr-2">
                            <img src={PhotoIcon} alt="Upload Photo" />
                        </span>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                        Upload Photo
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
