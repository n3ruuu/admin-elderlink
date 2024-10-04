import { useState } from "react"
import { Route, Routes, Link, useLocation } from "react-router-dom"
import ElderlinkLogo from "./assets/elderlink-logo2.png"
import DashboardIcon from "./assets/icons/dashboard.svg"
import MembersIcon from "./assets/icons/members.svg"
import ListIcon from "./assets/icons/list.svg"
import HealthIcon from "./assets/icons/record.svg"
import FinancialIcon from "./assets/icons/finance.svg"
import EventsIcon from "./assets/icons/events.svg"
import FormsAndAppIcon from "./assets/icons/forms-and-app.svg"
import FormsIcon from "./assets/icons/forms.svg"
import ApplicationIcon from "./assets/icons/applications.svg"
import ArchiveIcon from "./assets/icons/archive.svg"
import SettingsIcon from "./assets/icons/settings.svg"
import LogoutIcon from "./assets/icons/logout.svg"
import Dashboard from "./components/Dashboard/Dashboard"
import MembersList from "./components/MembersList/MembersList"
import HealthRecords from "./components/HealthRecords/HealthRecords"
import FinancialAssistance from "./components/FinancialAssistance/FinancialAssistance"
import Events from "./components/Events/Events"
import Forms from "./components/Forms/Forms"
import Applications from "./components/Applications/Applications"
import Archives from "./components/Archives/Archives"

const Sidebar = () => {
    const [openSubSection, setOpenSubSection] = useState(null)
    const location = useLocation() // Get the current path

    const toggleSubSection = (section) => {
        setOpenSubSection(openSubSection === section ? null : section)
    }

    const isActive = (path) => location.pathname.includes(path) // Check if the current path matches the route

    return (
        <section className="flex">
            <div className="pl-12 pt-12 font-bold w-[25%] bg-[#FFFFFF] text-[#1F1F29] font-inter h-screen relative">
                <img
                    className="h-[60px] mb-8"
                    src={ElderlinkLogo}
                    alt="Elderlink Logo"
                />
                <div className="flex flex-col gap-2 w-[98%]">
                    {/* Dashboard Link */}
                    <Link
                        to="admin-elderlink/dashboard"
                        className={`group flex items-center space-x-8 text-[20px] px-6 py-4 rounded-2xl cursor-pointer ${
                            isActive("/admin-elderlink/dashboard")
                                ? "bg-[#219EBC] text-[#F5F5FA]"
                                : "hover:bg-[#219EBC] hover:text-[#F5F5FA]"
                        }`}
                    >
                        <img
                            src={DashboardIcon}
                            alt="Dashboard Icon"
                            className={`group-hover:filter group-hover:brightness-0 group-hover:invert ${
                                isActive("/admin-elderlink/dashboard") &&
                                "filter brightness-0 invert"
                            }`}
                        />
                        <p>Admin Dashboard</p>
                    </Link>

                    {/* Members Section */}
                    <div>
                        <div
                            className={`group flex items-center space-x-7 text-[20px] px-6 py-4 rounded-2xl cursor-pointer hover:bg-[#219EBC] hover:text-[#F5F5FA]`}
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
                                    className={`group flex items-center space-x-8 text-[20px] px-6 py-4 rounded-2xl cursor-pointer ${
                                        isActive(
                                            "/admin-elderlink/members-list",
                                        )
                                            ? "bg-[#219EBC] text-[#F5F5FA]"
                                            : "hover:bg-[#219EBC] hover:text-[#F5F5FA]"
                                    }`}
                                >
                                    <img
                                        src={ListIcon}
                                        alt="List Icon"
                                        className={`group-hover:filter group-hover:brightness-0 group-hover:invert ${
                                            isActive(
                                                "/admin-elderlink/members-list",
                                            ) && "filter brightness-0 invert"
                                        }`}
                                    />
                                    <p>Members List</p>
                                </Link>

                                {/* Health Records */}
                                <Link
                                    to="admin-elderlink/health-records"
                                    className={`group flex items-center space-x-8 text-[20px] px-6 py-4 rounded-2xl cursor-pointer ${
                                        isActive(
                                            "/admin-elderlink/health-records",
                                        )
                                            ? "bg-[#219EBC] text-[#F5F5FA]"
                                            : "hover:bg-[#219EBC] hover:text-[#F5F5FA]"
                                    }`}
                                >
                                    <img
                                        src={HealthIcon}
                                        alt="Health Icon"
                                        className={`group-hover:filter group-hover:brightness-0 group-hover:invert ${
                                            isActive(
                                                "/admin-elderlink/health-records",
                                            ) && "filter brightness-0 invert"
                                        }`}
                                    />
                                    <p>Health Records</p>
                                </Link>

                                {/* Financial Assistance */}
                                <Link
                                    to="admin-elderlink/financial-assistance"
                                    className={`group flex items-center space-x-8 text-[20px] px-6 py-4 rounded-2xl cursor-pointer ${
                                        isActive(
                                            "/admin-elderlink/financial-assistance",
                                        )
                                            ? "bg-[#219EBC] text-[#F5F5FA]"
                                            : "hover:bg-[#219EBC] hover:text-[#F5F5FA]"
                                    }`}
                                >
                                    <img
                                        src={FinancialIcon}
                                        alt="Financial Icon"
                                        className={`group-hover:filter group-hover:brightness-0 group-hover:invert ${
                                            isActive(
                                                "/admin-elderlink/financial-assistance",
                                            ) && "filter brightness-0 invert"
                                        }`}
                                    />
                                    <p>Financial Assistance</p>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Events */}
                    <Link
                        to="admin-elderlink/events"
                        className={`group flex items-center space-x-8 text-[20px] px-6 py-4 rounded-2xl cursor-pointer ${
                            isActive("/admin-elderlink/events")
                                ? "bg-[#219EBC] text-[#F5F5FA]"
                                : "hover:bg-[#219EBC] hover:text-[#F5F5FA]"
                        }`}
                    >
                        <img
                            src={EventsIcon}
                            alt="Events Icon"
                            className={`group-hover:filter group-hover:brightness-0 group-hover:invert ${
                                isActive("/admin-elderlink/events") &&
                                "filter brightness-0 invert"
                            }`}
                        />
                        <p>Events</p>
                    </Link>

                    {/* Forms & Applications */}
                    <div>
                        <div
                            className="group flex items-center space-x-8 text-[20px] px-6 py-4 rounded-2xl cursor-pointer hover:bg-[#219EBC]  hover:text-[#F5F5FA]"
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
                                    className={`group flex items-center space-x-8 text-[20px] px-6 py-4 rounded-2xl cursor-pointer ${
                                        isActive("/admin-elderlink/forms")
                                            ? "bg-[#219EBC] text-[#F5F5FA]"
                                            : "hover:bg-[#219EBC] hover:text-[#F5F5FA]"
                                    }`}
                                >
                                    <img
                                        src={FormsIcon}
                                        alt="Forms Icon"
                                        className={`group-hover:filter group-hover:brightness-0 group-hover:invert ${
                                            isActive(
                                                "/admin-elderlink/forms",
                                            ) && "filter brightness-0 invert"
                                        }`}
                                    />
                                    <p>Forms</p>
                                </Link>

                                <Link
                                    to="admin-elderlink/applications"
                                    className={`group flex items-center space-x-8 text-[20px] px-6 py-4 rounded-2xl cursor-pointer ${
                                        isActive(
                                            "/admin-elderlink/applications",
                                        )
                                            ? "bg-[#219EBC] text-[#F5F5FA]"
                                            : "hover:bg-[#219EBC] hover:text-[#F5F5FA]"
                                    }`}
                                >
                                    <img
                                        src={ApplicationIcon}
                                        alt="Applications Icon"
                                        className={`group-hover:filter group-hover:brightness-0 group-hover:invert ${
                                            isActive(
                                                "/admin-elderlink/applications",
                                            ) && "filter brightness-0 invert"
                                        }`}
                                    />
                                    <p>Applications</p>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Archive */}
                    <Link
                        to="admin-elderlink/archives"
                        className={`group flex items-center space-x-8 text-[20px] px-6 py-4 rounded-2xl cursor-pointer ${
                            isActive("/admin-elderlink/archives")
                                ? "bg-[#219EBC] text-[#F5F5FA]"
                                : "hover:bg-[#219EBC] hover:text-[#F5F5FA]"
                        }`}
                    >
                        <img
                            src={ArchiveIcon}
                            alt="Archive Icon"
                            className={`group-hover:filter group-hover:brightness-0 group-hover:invert ${
                                isActive("/admin-elderlink/archives") &&
                                "filter brightness-0 invert"
                            }`}
                        />
                        <p>Archives</p>
                    </Link>

                    {/* Settings */}
                    <Link
                        to="admin-elderlink/settings"
                        className={`group flex items-center space-x-8 text-[20px] px-6 py-4 rounded-2xl cursor-pointer ${
                            isActive("/admin-elderlink/settings")
                                ? "bg-[#219EBC] text-[#F5F5FA]"
                                : "hover:bg-[#219EBC] hover:text-[#F5F5FA]"
                        } absolute bottom-20 w-[95%]`}
                    >
                        <img
                            src={SettingsIcon}
                            alt="Settings Icon"
                            className={`group-hover:filter group-hover:brightness-0 group-hover:invert ${
                                isActive("/admin-elderlink/settings") &&
                                "filter brightness-0 invert"
                            }`}
                        />
                        <p>Settings</p>
                    </Link>

                    {/* Logout */}
                    <Link
                        to="admin-elderlink/logout"
                        className="group flex items-center space-x-8 text-[20px] px-6 py-4 rounded-2xl cursor-pointer hover:bg-[#219EBC] hover:font-normal hover:text-[#F5F5FA] absolute bottom-5 w-[95%]"
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

            <Routes>
                <Route path="admin-elderlink/" element={<Dashboard />} />
                <Route
                    path="admin-elderlink/dashboard"
                    element={<Dashboard />}
                />
                <Route
                    path="admin-elderlink/members-list"
                    element={<MembersList />}
                />
                <Route
                    path="admin-elderlink/health-records"
                    element={<HealthRecords />}
                />
                <Route
                    path="admin-elderlink/financial-assistance"
                    element={<FinancialAssistance />}
                />
                <Route path="admin-elderlink/events" element={<Events />} />
                <Route path="admin-elderlink/forms" element={<Forms />} />
                <Route
                    path="admin-elderlink/applications"
                    element={<Applications />}
                />
                <Route path="admin-elderlink/archives" element={<Archives />} />
            </Routes>
        </section>
    )
}

export default Sidebar
