import { useState } from "react"
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
import Dashboard from "./pages/Dashboard"
import MembersList from "./pages/MembersList"
import HealthRecords from "./pages/HealthRecords"
import FinancialAssistance from "./pages/FinancialAssistance" // Import FinancialAssistance
import Events from "./pages/Events"
import Forms from "./pages/Forms"

const Sidebar = () => {
    const [activeSection, setActiveSection] = useState("dashboard")
    const [openSubSection, setOpenSubSection] = useState(null)

    const toggleSection = (section) => {
        setActiveSection(section)
    }

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
                    <div
                        className={`group flex items-center space-x-8 text-[20px] px-6 py-4 rounded-2xl cursor-pointer ${
                            activeSection === "dashboard"
                                ? "bg-[#219EBC] text-[#F5F5FA] font-normal"
                                : ""
                        } hover:bg-[#219EBC] hover:font-normal hover:text-[#F5F5FA]`}
                        onClick={() => toggleSection("dashboard")}
                    >
                        <img
                            src={DashboardIcon}
                            alt="Dashboard Icon"
                            className={`group-hover:filter group-hover:brightness-0 group-hover:invert ${
                                activeSection === "dashboard"
                                    ? "filter brightness-0 invert"
                                    : ""
                            }`}
                        />
                        <p>Admin Dashboard</p>
                    </div>

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
                                <div
                                    className={`group flex items-center space-x-8 text-[20px] px-6 py-4 rounded-2xl cursor-pointer ${
                                        activeSection === "membersList"
                                            ? "bg-[#219EBC] text-[#F5F5FA] font-normal"
                                            : ""
                                    } hover:bg-[#219EBC] hover:font-normal hover:text-[#F5F5FA]`}
                                    onClick={() =>
                                        setActiveSection("membersList")
                                    }
                                >
                                    <img
                                        src={ListIcon}
                                        alt="List Icon"
                                        className={`group-hover:filter group-hover:brightness-0 group-hover:invert ${
                                            activeSection === "membersList"
                                                ? "filter brightness-0 invert"
                                                : ""
                                        }`}
                                    />
                                    <p>Members List</p>
                                </div>
                                <div
                                    className={`group flex items-center space-x-8 text-[20px] px-6 py-4 rounded-2xl cursor-pointer ${
                                        activeSection === "healthRecords"
                                            ? "bg-[#219EBC] text-[#F5F5FA] font-normal"
                                            : ""
                                    } hover:bg-[#219EBC] hover:font-normal hover:text-[#F5F5FA]`}
                                    onClick={() =>
                                        setActiveSection("healthRecords")
                                    }
                                >
                                    <img
                                        src={HealthIcon}
                                        alt="Health Icon"
                                        className={`group-hover:filter group-hover:brightness-0 group-hover:invert ${
                                            activeSection === "healthRecords"
                                                ? "filter brightness-0 invert"
                                                : ""
                                        }`}
                                    />
                                    <p>Health Records</p>
                                </div>
                                <div
                                    className={`group flex items-center space-x-8 text-[20px] px-6 py-4 rounded-2xl cursor-pointer ${
                                        activeSection === "financialAssistance"
                                            ? "bg-[#219EBC] text-[#F5F5FA] font-normal"
                                            : ""
                                    } hover:bg-[#219EBC] hover:font-normal hover:text-[#F5F5FA]`}
                                    onClick={() =>
                                        setActiveSection("financialAssistance")
                                    }
                                >
                                    <img
                                        src={FinancialIcon}
                                        alt="Financial Icon"
                                        className={`group-hover:filter group-hover:brightness-0 group-hover:invert ${
                                            activeSection ===
                                            "financialAssistance"
                                                ? "filter brightness-0 invert"
                                                : ""
                                        }`}
                                    />
                                    <p>Financial Assistance</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div
                        className={`group flex items-center space-x-8 text-[20px] px-6 py-4 rounded-2xl cursor-pointer ${
                            activeSection === "events"
                                ? "bg-[#219EBC] text-[#F5F5FA] font-normal"
                                : ""
                        } hover:bg-[#219EBC] hover:font-normal hover:text-[#F5F5FA]`}
                        onClick={() => toggleSection("events")}
                    >
                        <img
                            src={EventsIcon}
                            alt="Events Icon"
                            className={`group-hover:filter group-hover:brightness-0 group-hover:invert ${
                                activeSection === "events"
                                    ? "filter brightness-0 invert"
                                    : ""
                            }`}
                        />
                        <p>Events</p>
                    </div>
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
                                <div
                                    className={`group flex items-center space-x-8 text-[20px] px-6 py-4 rounded-2xl cursor-pointer ${
                                        activeSection === "forms"
                                            ? "bg-[#219EBC] text-[#F5F5FA] font-normal"
                                            : ""
                                    } hover:bg-[#219EBC] hover:font-normal hover:text-[#F5F5FA]`}
                                    onClick={() => toggleSection("forms")}
                                >
                                    <img
                                        src={FormsIcon}
                                        alt="Forms Icon"
                                        className={`group-hover:filter group-hover:brightness-0 group-hover:invert ${
                                            activeSection === "forms"
                                                ? "filter brightness-0 invert"
                                                : ""
                                        }`}
                                    />
                                    <p>Forms</p>
                                </div>
                                <div className="group flex items-center space-x-8 text-[20px] px-6 py-4 rounded-2xl cursor-pointer hover:bg-[#219EBC] hover:font-normal hover:text-[#F5F5FA]">
                                    <img
                                        src={ApplicationIcon}
                                        alt="Applications Icon"
                                        className="group-hover:filter group-hover:brightness-0 group-hover:invert"
                                    />
                                    <p>Applications</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div
                        className={`group flex items-center space-x-8 text-[20px] px-6 py-4 rounded-2xl cursor-pointer ${
                            activeSection === "archive"
                                ? "bg-[#219EBC] text-[#F5F5FA] font-normal"
                                : ""
                        } hover:bg-[#219EBC] hover:font-normal hover:text-[#F5F5FA]`}
                    >
                        <img
                            src={ArchiveIcon}
                            alt="Archive Icon"
                            className={`group-hover:filter group-hover:brightness-0 group-hover:invert ${
                                activeSection === "archive"
                                    ? "filter brightness-0 invert"
                                    : ""
                            }`}
                        />
                        <p>Archive</p>
                    </div>
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
            {activeSection === "dashboard" && <Dashboard />}
            {activeSection === "membersList" && <MembersList />}
            {activeSection === "healthRecords" && <HealthRecords />}
            {activeSection === "financialAssistance" && <FinancialAssistance />}
            {/* Added FinancialAssistance */}
            {activeSection === "events" && <Events />}
            {activeSection === "forms" && <Forms />}
        </section>
    )
}

export default Sidebar
