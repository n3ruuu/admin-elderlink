/* eslint-disable react/prop-types */
import axios from "axios"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaEye, FaEyeSlash } from "react-icons/fa" // Import eye icons
import ElderlinkLogo from "./assets/elderlink-logo.png"
import ForgotPasswordModal from "./ForgotPasswordModal" // Import the ForgotPasswordModal

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false) // State to toggle password visibility
    const [errorMessage, setErrorMessage] = useState("")
    const [isModalOpen, setIsModalOpen] = useState(false) // State to control modal visibility
    const navigate = useNavigate()

    const handleLogin = async (e) => {
        e.preventDefault()

        // Client-side validation for empty fields
        if (!username || !password) {
            setErrorMessage("Username and password are required.")
            return
        }

        try {
            const response = await axios.post("http://5.181.217.153:5000/login", {
                identifier: username, // Send 'identifier' (username or email)
                password,
            })

            if (response.status === 200) {
                const { token, username } = response.data
                localStorage.setItem("authToken", token)
                localStorage.setItem("username", username)
                onLogin()
                navigate("/admin-elderlink/dashboard")
            }
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "An error occurred. Please try again.")
        }
    }

    return (
        <section className="relative flex items-center justify-center font-inter min-h-screen">
            <div className="absolute inset-0 mix-blend-overlay bg-cover bg-center bg-custom-bg opacity-[0.07]"></div>
            <div className="absolute inset-0 mix-blend-overlay bg-gradient-to-b from-[#F5F5FA] to-[#C1F3FF]"></div>

            <div className="relative z-10 w-full max-w-md bg-[#FFFFFF] p-8 rounded-lg shadow-lg h-fit">
                <div className="flex flex-col items-center">
                    <img src={ElderlinkLogo} alt="Elderlink Logo" className="h-16 mb-4" />
                    <p className="text-[32px] font-bold mb-6 self-start">Admin Login</p>

                    {errorMessage && <div className="text-red-500 text-sm mb-4">{errorMessage}</div>}

                    <form className="w-full h-full flex flex-col gap-5" onSubmit={handleLogin}>
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-[#1F1F29]">
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="mt-1 block bg-[#F5F5FA] w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-[#219EBC] sm:text-sm"
                            />
                        </div>

                        <div className="relative">
                            <label htmlFor="password" className="block text-sm font-medium text-[#1F1F29]">
                                Password
                            </label>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"} // Toggle input type
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-1 block w-full bg-[#F5F5FA] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-[#219EBC] sm:text-sm"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)} // Toggle state
                                className="absolute inset-y-0 top-6 right-3 flex items-center text-gray-500 hover:text-[#219EBC] transition duration-200"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>

                        {/* Forgot Password Link */}
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(true)} // Open the modal
                            className="text-[#219EBC] text-sm self-end hover:text-[#1A7A89] transition duration-200"
                        >
                            Forgot Password?
                        </button>

                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-[#219EBC] text-white font-semibold rounded-md shadow-sm hover:bg-[#1A7A89] transition duration-200"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && <ForgotPasswordModal closeModal={() => setIsModalOpen(false)} />}
        </section>
    )
}

export default Login
