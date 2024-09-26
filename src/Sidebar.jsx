import { useState } from "react"
import { BrowserRouter as Route, Routes, Link } from "react-router-dom"
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

    const toggleSubSection = (section) => {
        setOpenSubSection(openSubSection === section ? null : section)
    }

    return (
        <section className="flex">
            <div className="pl-12 pt-12 font-bold w-[25%] bg-[#FFFFFF] text-[#1F1F29] font-inter h-screen relative">
                <img
                    className="h-[60px] mb-8"
                    src={ElderlinkLogo}
                    alt="Elderlink Logo"
                />
                <div className="flex flex-col gap-2 w-[98%]">
                    <Link
                        to="admin-elderlink/dashboard"
                        className="group flex items-center space-x-8 text-[20px] px-6 py-4 rounded-2xl cursor-pointer hover:bg-[#219EBC] hover:font-normal hover:text-[#F5F5FA]"
                    >
                        <img
                            src={DashboardIcon}
                            alt="Dashboard Icon"
                            className="group-hover:filter group-hover:brightness-0 group-hover:invert"
                        />
                        <p>Admin Dashboard</p>
                    </Link>

                    <div>
                        <div
                            className="group flex items-center space-x-7 text-[20px] px-6 py-4 rounded-2xl cursor-pointer hover:bg-[#219EBC] hover:font-normal hover:text-[#F5F5FA]"
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
                                <Link
                                    to="admin-elderlink/members-list"
                                    className="group flex items-center space-x-8 text-[20px] px-6 py-4 rounded-2xl cursor-pointer hover:bg-[#219EBC] hover:font-normal hover:text-[#F5F5FA]"
                                >
                                    <img
                                        src={ListIcon}
                                        alt="List Icon"
                                        className="group-hover:filter group-hover:brightness-0 group-hover:invert"
                                    />
                                    <p>Members List</p>
                                </Link>
                                <Link
                                    to="admin-elderlink/health-records"
                                    className="group flex items-center space-x-8 text-[20px] px-6 py-4 rounded-2xl cursor-pointer hover:bg-[#219EBC] hover:font-normal hover:text-[#F5F5FA]"
                                >
                                    <img
                                        src={HealthIcon}
                                        alt="Health Icon"
                                        className="group-hover:filter group-hover:brightness-0 group-hover:invert"
                                    />
                                    <p>Health Records</p>
                                </Link>
                                <Link
                                    to="admin-elderlink/financial-assistance"
                                    className="group flex items-center space-x-8 text-[20px] px-6 py-4 rounded-2xl cursor-pointer hover:bg-[#219EBC] hover:font-normal hover:text-[#F5F5FA]"
                                >
                                    <img
                                        src={FinancialIcon}
                                        alt="Financial Icon"
                                        className="group-hover:filter group-hover:brightness-0 group-hover:invert"
                                    />
                                    <p>Financial Assistance</p>
                                </Link>
                            </div>
                        )}
                    </div>

                    <Link
                        to="admin-elderlink/events"
                        className="group flex items-center space-x-8 text-[20px] px-6 py-4 rounded-2xl cursor-pointer hover:bg-[#219EBC] hover:font-normal hover:text-[#F5F5FA]"
                    >
                        <img
                            src={EventsIcon}
                            alt="Events Icon"
                            className="group-hover:filter group-hover:brightness-0 group-hover:invert"
                        />
                        <p>Events</p>
                    </Link>

                    <div>
                        <div
                            className="group flex items-center space-x-8 text-[20px] px-6 py-4 rounded-2xl cursor-pointer hover:bg-[#219EBC] hover:font-normal hover:text-[#F5F5FA]"
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
                                    className="group flex items-center space-x-8 text-[20px] px-6 py-4 rounded-2xl cursor-pointer hover:bg-[#219EBC] hover:font-normal hover:text-[#F5F5FA]"
                                >
                                    <img
                                        src={FormsIcon}
                                        alt="Forms Icon"
                                        className="group-hover:filter group-hover:brightness-0 group-hover:invert"
                                    />
                                    <p>Forms</p>
                                </Link>
                                <Link
                                    to="admin-elderlink/applications"
                                    className="group flex items-center space-x-8 text-[20px] px-6 py-4 rounded-2xl cursor-pointer hover:bg-[#219EBC] hover:font-normal hover:text-[#F5F5FA]"
                                >
                                    <img
                                        src={ApplicationIcon}
                                        alt="Applications Icon"
                                        className="group-hover:filter group-hover:brightness-0 group-hover:invert"
                                    />
                                    <p>Applications</p>
                                </Link>
                            </div>
                        )}
                    </div>

                    <Link
                        to="admin-elderlink/archive"
                        className="group flex items-center space-x-8 text-[20px] px-6 py-4 rounded-2xl cursor-pointer hover:bg-[#219EBC] hover:font-normal hover:text-[#F5F5FA]"
                    >
                        <img
                            src={ArchiveIcon}
                            alt="Archive Icon"
                            className="group-hover:filter group-hover:brightness-0 group-hover:invert"
                        />
                        <p>Archive</p>
                    </Link>
                </div>

                {/* Fixed Settings and Logout Section */}
                <div className="absolute bottom-5 w-[85%]">
                    <div className="group flex items-center space-x-8 text-[20px] px-6 py-4 rounded-2xl cursor-pointer hover:bg-[#219EBC] hover:font-normal hover:text-[#F5F5FA]">
                        <img
                            src={SettingsIcon}
                            alt="Settings Icon"
                            className="group-hover:filter group-hover:brightness-0 group-hover:invert"
                        />
                        <p>Settings</p>
                    </div>
                    <div className="group flex items-center space-x-8 text-[20px] px-6 py-4 rounded-2xl cursor-pointer hover:bg-[#219EBC] hover:font-normal hover:text-[#F5F5FA]">
                        <img
                            src={LogoutIcon}
                            alt="Logout Icon"
                            className="group-hover:filter group-hover:brightness-0 group-hover:invert"
                        />
                        <p>Logout</p>
                    </div>
                </div>
            </div>

            {/* Conditionally Rendered Pages */}
            <Routes>
                <Route
                    path="/admin-elderlink/dashboard"
                    element={<Dashboard />}
                />
                <Route
                    path="/admin-elderlink/members-list"
                    element={<MembersList />}
                />
                <Route
                    path="/admin-elderlink/health-records"
                    element={<HealthRecords />}
                />
                <Route
                    path="/admin-elderlink/financial-assistance"
                    element={<FinancialAssistance />}
                />
                <Route path="/admin-elderlink/events" element={<Events />} />
                <Route path="/admin-elderlink/forms" element={<Forms />} />
                <Route
                    path="/admin-elderlink/applications"
                    element={<Applications />}
                />
                <Route path="/admin-elderlink/archive" element={<Archives />} />
                <Route path="*" element={<Dashboard />} /> {/* Default route */}
            </Routes>
        </section>
    )
}

export default Sidebar
