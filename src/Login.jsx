import ElderlinkLogo from "./assets/elderlink-logo.png"

const Login = () => {
    return (
        <section className="relative flex items-center justify-center font-inter min-h-screen">
            {/* Background Image */}
            <div className="absolute inset-0 mix-blend-overlay bg-cover bg-center bg-custom-bg opacity-[0.07]"></div>
            {/* Gradient Overlay */}
            <div className="absolute inset-0 mix-blend-overlay bg-gradient-to-b from-[#F5F5FA] to-[#C1F3FF]"></div>

            {/* Login Form Container */}
            <div className="relative z-10 w-full max-w-md bg-[#FFFFFF] p-8 rounded-lg shadow-lg h-fit">
                <div className="flex flex-col items-center">
                    <img
                        src={ElderlinkLogo}
                        alt="Elderlink Logo"
                        className="h-16 mb-4"
                    />
                    <p className="text-[32px] font-bold mb-6 self-start">
                        Admin Login
                    </p>

                    <form className="w-full h-full flex flex-col gap-5">
                        <div>
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium text-[#1F1F29]"
                            >
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                className="mt-1 block bg-[#F5F5FA] w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-[#219EBC] sm:text-sm"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-[#1F1F29]"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                className="mt-1 block w-full bg-[#F5F5FA] px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-[#219EBC] sm:text-sm"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2 px-4 bg-[#219EBC] text-white font-semibold rounded-md shadow-sm mt-2"
                        >
                            Login
                        </button>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default Login
