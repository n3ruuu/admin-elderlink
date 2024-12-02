import { useState } from "react"

const ForgotPasswordModal = ({ closeModal }) => {
    const [email, setEmail] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        // Handle the logic to request password reset (e.g., API call)
        try {
            // Simulate sending the email for password reset
            // const response = await axios.post("/reset-password", { email })
            // if (response.status === 200) {
            //     alert("Password reset email sent.")
            //     closeModal()
            // }
            alert("Password reset email sent.") // Simulate success message
            closeModal() // Close the modal
        } catch (error) {
            setErrorMessage("An error occurred. Please try again.")
        }
    }

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-20">
            <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-xl font-semibold mb-4">Forgot Password</h2>

                {errorMessage && <div className="text-red-500 text-sm mb-4">{errorMessage}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-[#1F1F29]">
                            Email Address
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full bg-[#F5F5FA] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-[#219EBC] sm:text-sm"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 px-4 bg-[#219EBC] text-white font-semibold rounded-md"
                    >
                        Submit
                    </button>
                </form>

                <button
                    type="button"
                    onClick={closeModal}
                    className="mt-4 text-gray-500"
                >
                    Cancel
                </button>
            </div>
        </div>
    )
}

export default ForgotPasswordModal
