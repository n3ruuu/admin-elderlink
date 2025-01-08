/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react"
import { FaEye, FaEyeSlash } from "react-icons/fa" // Import eye icons
import axios from "axios"

const ForgotPasswordModal = ({ closeModal }) => {
    const [email, setEmail] = useState("")
    const [verificationCode, setVerificationCode] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("") // New confirm password state
    const [showPassword, setShowPassword] = useState(false) // State to toggle password visibility
    const [showConfirmPassword, setShowConfirmPassword] = useState(false) // State to toggle confirm password visibility
    const [step, setStep] = useState(1)
    const [errorMessage, setErrorMessage] = useState("")

    // Check if the email belongs to an admin
    const checkIfAdmin = async (email) => {
        if (!email) {
            console.error("Email is required to check if the admin exists.")
            return
        }

        try {
            const response = await axios.get(`http://localhost:5000/login/check-email`, {
                params: { email },
            })
            console.log("Response:", response.data)
            return response.data
        } catch (error) {
            if (error.response) {
                console.error("Error:", error.response.data)
            } else if (error.request) {
                console.error("No response received:", error.request)
            } else {
                console.error("Error setting up request:", error.message)
            }
        }
    }

    // Handle email submit
    const handleEmailSubmit = async (e) => {
        e.preventDefault()

        const adminCheck = await checkIfAdmin(email)
        if (!adminCheck || !adminCheck.exists) {
            setErrorMessage("This email is not associated with an admin account.")
            return
        }

        try {
            const response = await axios.post("http://localhost:5000/verification/send-verification-code", { email })
            if (response.status === 200) {
                alert("Verification code sent to your email.")
                setStep(2) // Move to verification code step
            }
        } catch (error) {
            setErrorMessage("Failed to send verification code. Please try again.")
        }
    }

    const handleCodeSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await axios.post("http://localhost:5000/verification/verify-code", {
                email,
                code: verificationCode,
            })
            if (response.status === 200) {
                alert("Code verified. You can now change your password.")
                setStep(3) // Move to password reset step
            }
        } catch (error) {
            setErrorMessage("Invalid verification code. Please try again.")
        }
    }

    const handlePasswordReset = async (e) => {
        e.preventDefault()
        if (newPassword !== confirmPassword) {
            setErrorMessage("Passwords do not match.")
            return
        }
        try {
            const response = await axios.post("http://localhost:5000/verification/reset-password", {
                email,
                newPassword,
            })
            if (response.status === 200) {
                alert("Password reset successfully.")
                closeModal()
            }
        } catch (error) {
            setErrorMessage("Failed to reset password. Please try again.")
        }
    }

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-20">
            <div className="bg-white p-6 rounded-lg w-96">
                <h2 className="text-xl font-semibold mb-4">Forgot Password</h2>

                {errorMessage && <div className="text-red-500 text-sm mb-4">{errorMessage}</div>}

                {step === 1 && (
                    <form onSubmit={handleEmailSubmit}>
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
                            className="w-full py-2 px-4 bg-[#219EBC] text-white font-semibold rounded-md hover:bg-[#1A7A89] transition duration-200"
                        >
                            Send Verification Code
                        </button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleCodeSubmit}>
                        <div className="mb-4">
                            <label htmlFor="verificationCode" className="block text-sm font-medium text-[#1F1F29]">
                                Verification Code
                            </label>
                            <input
                                id="verificationCode"
                                type="text"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                className="mt-1 block w-full bg-[#F5F5FA] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-[#219EBC] sm:text-sm"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-[#219EBC] text-white font-semibold rounded-md hover:bg-[#1A7A89] transition duration-200"
                        >
                            Verify Code
                        </button>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handlePasswordReset}>
                        <div className="mb-4">
                            <label htmlFor="newPassword" className="block text-sm font-medium text-[#1F1F29]">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    id="newPassword"
                                    type={showPassword ? "text" : "password"}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="mt-1 block w-full bg-[#F5F5FA] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-[#219EBC] sm:text-sm"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-2 top-3"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#1F1F29]">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="mt-1 block w-full bg-[#F5F5FA] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-[#219EBC] sm:text-sm"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-2 top-3"
                                >
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-[#219EBC] text-white font-semibold rounded-md hover:bg-[#1A7A89] transition duration-200"
                        >
                            Reset Password
                        </button>
                    </form>
                )}

                <div className="flex justify-center mt-4">
                    <button
                        type="button"
                        onClick={closeModal}
                        className="text-gray-500 hover:text-[#219EBC] transition duration-200"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ForgotPasswordModal
