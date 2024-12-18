import { useState, useEffect } from "react"
import { Route, Routes, Link, useLocation, useNavigate } from "react-router-dom"
import ElderlinkLogo from "./assets/elderlink-logo2.png"
import DashboardIcon from "./assets/icons/dashboard.svg"
import MembersIcon from "./assets/icons/members.svg"
import ListIcon from "./assets/icons/list.svg"
import HealthIcon from "./assets/icons/record.svg"
import FinancialIcon from "./assets/icons/finance.svg"
import EventsIcon from "./assets/icons/events.svg"
import FormsAndAppIcon from "./assets/icons/forms-and-app.svg"
import FormsIcon from "./assets/icons/forms.svg"
import ReportIcon from "./assets/icons/report copy.svg"
import CMSIcon from "./assets/icons/cms.svg"
import ApplicationIcon from "./assets/icons/applications.svg"
import ArchiveIcon from "./assets/icons/archive.svg"
import NewsIcon from "./assets/icons/news.svg"
import LogoutIcon from "./assets/icons/logout.svg"
import Dashboard from "./components/Dashboard/Dashboard"
import MembersList from "./components/MembersList/MembersList"
import HealthRecords from "./components/HealthRecords/HealthRecords"
import FinancialAssistance from "./components/FinancialAssistance/FinancialAssistance"
import Events from "./components/Events/Events"
import Forms from "./components/Forms/Forms"
import Applications from "./components/Applications/Applications"
import News from "./components/News/News"
import Archives from "./components/Archives/Archives"
import Reports from "./components/Reports/Reports"
import ContentManagement from "./components/ContentManagement/ContentManagement"
import Login from "./Login"

const Sidebar = () => {
    const [openSubSection, setOpenSubSection] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const location = useLocation() // Get the current path
    const navigate = useNavigate() // Initialize navigate for redirecting after login

    // Check if the user is authenticated when the component mounts
    useEffect(() => {
        const token = localStorage.getItem("authToken")
        if (token) {
            setIsAuthenticated(true)
        } else {
            setIsAuthenticated(false)
        }
    }, [])

    const toggleSubSection = (section) => {
        setOpenSubSection(openSubSection === section ? null : section)
    }

    console.log(isAuthenticated)

    const handleLogout = () => {
        // Clear authentication state or tokens here
        setIsAuthenticated(false)
        localStorage.removeItem("authToken")
        navigate("/admin-elderlink") // Redirect to login page
    }

    if (!isAuthenticated) {
        // If not authenticated, redirect to login page
        return <Login onLogin={() => setIsAuthenticated(true)} />
    }

    const isActive = (path) => location.pathname.includes(path) // Check if the current path matches the route

    return (
        <section className="flex">
            <div className="pl-12 pt-12 font-bold w-[25%] bg-[#FFFFFF] text-[#1F1F29] font-inter h-screen relative">
                <img className="h-[60px] mb-8" src={ElderlinkLogo} alt="Elderlink Logo" />
                <div className="flex flex-col gap-2 w-[98%]">
                    {/* Dashboard Link */}
                    <Link
                        to="admin-elderlink/dashboard"
                        className={`group flex items-center space-x-8 text-[20px] px-6 py-3 rounded-2xl cursor-pointer ${
                            isActive("/admin-elderlink/dashboard")
                                ? "bg-[#219EBC] text-[#F5F5FA]"
                                : "hover:bg-[#219EBC] hover:text-[#F5F5FA]"
                        }`}
                    >
                        <img
                            src={DashboardIcon}
                            alt="Dashboard Icon"
                            className={`group-hover:filter group-hover:brightness-0 group-hover:invert ${
                                isActive("/admin-elderlink/dashboard") && "filter brightness-0 invert"
                            }`}
                        />
                        <p>Admin Dashboard</p>
                    </Link>
                    {/* Members Section */}
                    <div>
                        <div
                            className={`group flex items-center space-x-7 text-[20px] px-6 py-3 rounded-2xl cursor-pointer hover:bg-[#219EBC] hover:text-[#F5F5FA]`}
                            onClick={() => toggleSubSection("members")}
                        >
                            <img
                                src={MembersIcon}
                                alt="Members Icon"
                                className="group-hover:filter group-hover:brightness-0 group-hover:invert"
                            />
                            <p>Members</p>
                        </div>

                        {openSubSection === "members" && (
                            <div className="m-4 space-y-2">
                                {/* Members List */}
                                <Link
                                    to="admin-elderlink/members-list"
                                    className={`group flex items-center space-x-8 text-[20px] px-6 py-3 rounded-2xl cursor-pointer ${
                                        isActive("/admin-elderlink/members-list")
                                            ? "bg-[#219EBC] text-[#F5F5FA]"
                                            : "hover:bg-[#219EBC] hover:text-[#F5F5FA]"
                                    }`}
                                >
                                    <img
                                        src={ListIcon}
                                        alt="List Icon"
                                        className={`group-hover:filter group-hover:brightness-0 group-hover:invert ${
                                            isActive("/admin-elderlink/members-list") && "filter brightness-0 invert"
                                        }`}
                                    />
                                    <p>Members List</p>
                                </Link>

                                {/* Health Records */}
                                <Link
                                    to="admin-elderlink/health-records"
                                    className={`group flex items-center space-x-8 text-[20px] px-6 py-3 rounded-2xl cursor-pointer ${
                                        isActive("/admin-elderlink/health-records")
                                            ? "bg-[#219EBC] text-[#F5F5FA]"
                                            : "hover:bg-[#219EBC] hover:text-[#F5F5FA]"
                                    }`}
                                >
                                    <img
                                        src={HealthIcon}
                                        alt="Health Icon"
                                        className={`group-hover:filter group-hover:brightness-0 group-hover:invert ${
                                            isActive("/admin-elderlink/health-records") && "filter brightness-0 invert"
                                        }`}
                                    />
                                    <p>Health Records</p>
                                </Link>

                                {/* Financial Assistance */}
                                <Link
                                    to="admin-elderlink/financial-assistance"
                                    className={`group flex items-center space-x-8 text-[20px] px-6 py-3 rounded-2xl cursor-pointer ${
                                        isActive("/admin-elderlink/financial-assistance")
                                            ? "bg-[#219EBC] text-[#F5F5FA]"
                                            : "hover:bg-[#219EBC] hover:text-[#F5F5FA]"
                                    }`}
                                >
                                    <img
                                        src={FinancialIcon}
                                        alt="Financial Icon"
                                        className={`group-hover:filter group-hover:brightness-0 group-hover:invert ${
                                            isActive("/admin-elderlink/financial-assistance") &&
                                            "filter brightness-0 invert"
                                        }`}
                                    />
                                    <p>Financial Records</p>
                                </Link>
                            </div>
                        )}
                    </div>
                    {/* Events */}
                    <Link
                        to="admin-elderlink/events"
                        className={`group flex items-center space-x-8 text-[20px] px-6 py-3 rounded-2xl cursor-pointer ${
                            isActive("/admin-elderlink/events")
                                ? "bg-[#219EBC] text-[#F5F5FA]"
                                : "hover:bg-[#219EBC] hover:text-[#F5F5FA]"
                        }`}
                    >
                        <img
                            src={EventsIcon}
                            alt="Events Icon"
                            className={`group-hover:filter group-hover:brightness-0 group-hover:invert ${
                                isActive("/admin-elderlink/events") && "filter brightness-0 invert"
                            }`}
                        />
                        <p>Events</p>
                    </Link>
                    {/* News */}
                    <Link
                        to="admin-elderlink/news"
                        className={`group flex items-center space-x-8 text-[20px] px-6 py-3 rounded-2xl cursor-pointer ${
                            isActive("/admin-elderlink/news")
                                ? "bg-[#219EBC] text-[#F5F5FA]"
                                : "hover:bg-[#219EBC] hover:text-[#F5F5FA]"
                        }`}
                    >
                        <img
                            src={NewsIcon}
                            alt="News Icon"
                            className={`group-hover:filter group-hover:brightness-0 group-hover:invert ${
                                isActive("/admin-elderlink/news") && "filter brightness-0 invert"
                            }`}
                        />
                        <p>News</p>
                    </Link>
                    {/* Forms & Applications */}
                    <div>
                        <div
                            className="group flex items-center space-x-8 text-[20px] px-6 py-3 rounded-2xl cursor-pointer hover:bg-[#219EBC]  hover:text-[#F5F5FA]"
                            onClick={() => toggleSubSection("forms")}
                        >
                            <img
                                src={FormsAndAppIcon}
                                alt="Forms Icon"
                                className="group-hover:filter group-hover:brightness-0 group-hover:invert"
                            />
                            <p>Forms & Applications</p>
                        </div>

                        {openSubSection === "forms" && (
                            <div className="m-4 ml-10 space-y-2">
                                <Link
                                    to="admin-elderlink/forms"
                                    className={`group flex items-center space-x-8 text-[20px] px-6 py-3 rounded-2xl cursor-pointer ${
                                        isActive("/admin-elderlink/forms")
                                            ? "bg-[#219EBC] text-[#F5F5FA]"
                                            : "hover:bg-[#219EBC] hover:text-[#F5F5FA]"
                                    }`}
                                >
                                    <img
                                        src={FormsIcon}
                                        alt="Forms Icon"
                                        className={`group-hover:filter group-hover:brightness-0 group-hover:invert ${
                                            isActive("/admin-elderlink/forms") && "filter brightness-0 invert"
                                        }`}
                                    />
                                    <p>Forms</p>
                                </Link>

                                <Link
                                    to="admin-elderlink/applications"
                                    className={`group flex items-center space-x-8 text-[20px] px-6 py-3 rounded-2xl cursor-pointer ${
                                        isActive("/admin-elderlink/applications")
                                            ? "bg-[#219EBC] text-[#F5F5FA]"
                                            : "hover:bg-[#219EBC] hover:text-[#F5F5FA]"
                                    }`}
                                >
                                    <img
                                        src={ApplicationIcon}
                                        alt="Applications Icon"
                                        className={`group-hover:filter group-hover:brightness-0 group-hover:invert ${
                                            isActive("/admin-elderlink/applications") && "filter brightness-0 invert"
                                        }`}
                                    />
                                    <p>Applications</p>
                                </Link>
                            </div>
                        )}
                    </div>
                    {/* Reports */}
                    <Link
                        to="admin-elderlink/reports"
                        className={`group flex items-center space-x-8 text-[20px] px-6 py-3 rounded-2xl cursor-pointer ${
                            isActive("/admin-elderlink/reports")
                                ? "bg-[#219EBC] text-[#F5F5FA]"
                                : "hover:bg-[#219EBC] hover:text-[#F5F5FA]"
                        }`}
                    >
                        <img
                            src={ReportIcon}
                            alt="Reports Icon"
                            className={`group-hover:filter group-hover:brightness-0 group-hover:invert ${
                                isActive("/admin-elderlink/reports") && "filter brightness-0 invert"
                            }`}
                        />
                        <p>Reports</p>
                    </Link>
                    {/* Archive */}
                    <Link
                        to="admin-elderlink/archives"
                        className={`group flex items-center space-x-8 text-[20px] px-6 py-3 rounded-2xl cursor-pointer ${
                            isActive("/admin-elderlink/archives")
                                ? "bg-[#219EBC] text-[#F5F5FA]"
                                : "hover:bg-[#219EBC] hover:text-[#F5F5FA]"
                        }`}
                    >
                        <img
                            src={ArchiveIcon}
                            alt="Archive Icon"
                            className={`group-hover:filter group-hover:brightness-0 group-hover:invert ${
                                isActive("/admin-elderlink/archives") && "filter brightness-0 invert"
                            }`}
                        />
                        <p>Archive</p>
                    </Link>{" "}
                    {/* Archive */}
                    <Link
                        to="admin-elderlink/content-management"
                        className={`group flex items-center space-x-8 text-[20px] px-6 py-3 rounded-2xl cursor-pointer ${
                            isActive("/admin-elderlink/content-management")
                                ? "bg-[#219EBC] text-[#F5F5FA]"
                                : "hover:bg-[#219EBC] hover:text-[#F5F5FA]"
                        }`}
                    >
                        <img
                            src={CMSIcon}
                            alt="Content Management Icon"
                            className={`group-hover:filter group-hover:brightness-0 group-hover:invert ${
                                isActive("/admin-elderlink/content-management") && "filter brightness-0 invert"
                            }`}
                        />
                        <p>Content Management</p>
                    </Link>
                    <div>
                        <Link
                            to="/admin-elderlink/"
                            onClick={handleLogout}
                            className={`group absolute bottom-0 w-[86%] flex justify-start space-x-8 text-[20px] px-6 py-3 rounded-xl cursor-pointer transition-all duration-300 ${
                                isActive(null)
                                    ? "bg-[#219EBC] text-[#F5F5FA]"
                                    : "hover:bg-[#219EBC] hover:text-[#F5F5FA]"
                            }`}
                        >
                            <img
                                src={LogoutIcon}
                                alt="Logout Icon"
                                className="group-hover:filter group-hover:brightness-0 group-hover:invert"
                            />
                            <p>Logout</p>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Routes */}
            <div className="w-full">
                <Routes>
                    <Route path="admin-elderlink/dashboard" element={<Dashboard />} />
                    <Route path="admin-elderlink/members-list" element={<MembersList />} />
                    <Route path="admin-elderlink/health-records" element={<HealthRecords />} />
                    <Route path="admin-elderlink/financial-assistance" element={<FinancialAssistance />} />
                    <Route path="admin-elderlink/events" element={<Events />} />
                    <Route path="admin-elderlink/forms" element={<Forms />} />
                    <Route path="admin-elderlink/applications" element={<Applications />} />
                    <Route path="admin-elderlink/news" element={<News />} />
                    <Route path="admin-elderlink/archives" element={<Archives />} />
                    <Route path="admin-elderlink/reports" element={<Reports />} />
                    <Route path="admin-elderlink/content-management" element={<ContentManagement />} />
                </Routes>
            </div>
        </section>
    )
}

export default Sidebar
