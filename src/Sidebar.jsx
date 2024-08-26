import { useState } from "react"
import ElderlinkLogo from "./assets/elderlink-logo2.png"
import DashboardIcon from "./assets/icons/dashboard.svg"
import MembersIcon from "./assets/icons/members.svg"
import ListIcon from "./assets/icons/list.svg"
import HealthIcon from "./assets/icons/record.svg"
import FinancialIcon from "./assets/icons/finance.svg"
import EventsIcon from "./assets/icons/events.svg"
import FormsAndAppIcon from "./assets/icons/forms-and-app.svg"
import SettingsIcon from "./assets/icons/settings.svg"
import LogoutIcon from "./assets/icons/logout.svg"

const Sidebar = () => {
  const [isMembersOpen, setIsMembersOpen] = useState(false)
  const [isFormsOpen, setIsFormsOpen] = useState(false)

  const toggleMembers = () => {
    setIsMembersOpen(!isMembersOpen)
  }

  const toggleForms = () => {
    setIsFormsOpen(!isFormsOpen)
  }

  return (
    <section>
      <div className="pl-12 pt-12 font-bold w-[22%] bg-[#FFFFFF] text-[#1F1F29] font-inter h-screen relative">
        <img
          className="h-[60px] mb-8"
          src={ElderlinkLogo}
          alt="Elderlink Logo"
        />
        <div>
          <div className="group flex items-center space-x-8 text-[20px] px-6 py-4 rounded-2xl cursor-pointer hover:bg-[#219EBC] hover:font-normal hover:text-[#F5F5FA]">
            <img
              src={DashboardIcon}
              alt="Dashboard Icon"
              className="group-hover:filter group-hover:brightness-0 group-hover:invert"
            />
            <p>Admin Dashboard</p>
          </div>

          <div>
            <div
              className={`group flex items-center space-x-7 text-[20px] px-6 py-4 rounded-2xl cursor-pointer ${
                isMembersOpen ? "bg-[#219EBC] text-[#F5F5FA] font-normal" : ""
              } hover:bg-[#219EBC] hover:font-normal hover:text-[#F5F5FA]`}
              onClick={toggleMembers}
            >
              <img
                src={MembersIcon}
                alt="Members Icon"
                className={`group-hover:filter group-hover:brightness-0 group-hover:invert ${
                  isMembersOpen ? "filter brightness-0 invert" : ""
                }`}
              />
              <p>Members</p>
            </div>

            {isMembersOpen && (
              <div className="m-4 ml-8 space-y-2">
                <div className="group flex items-center space-x-8 text-[20px] px-6 py-4 rounded-2xl cursor-pointer hover:bg-[#219EBC] hover:font-normal hover:text-[#F5F5FA]">
                  <img
                    src={ListIcon}
                    alt="List Icon"
                    className="group-hover:filter group-hover:brightness-0 group-hover:invert"
                  />
                  <p>Members List</p>
                </div>
                <div className="group flex items-center space-x-8 text-[20px] px-6 py-4 rounded-2xl cursor-pointer hover:bg-[#219EBC] hover:font-normal hover:text-[#F5F5FA]">
                  <img
                    src={HealthIcon}
                    alt="Health Icon"
                    className="group-hover:filter group-hover:brightness-0 group-hover:invert"
                  />
                  <p>Health Records</p>
                </div>
                <div className="group flex items-center space-x-8 text-[20px] px-6 py-4 rounded-2xl cursor-pointer hover:bg-[#219EBC] hover:font-normal hover:text-[#F5F5FA]">
                  <img
                    src={FinancialIcon}
                    alt="Financial Icon"
                    className="group-hover:filter group-hover:brightness-0 group-hover:invert"
                  />
                  <p>Financial Assistance</p>
                </div>
              </div>
            )}
          </div>

          <div className="group flex items-center space-x-8 text-[20px] px-6 py-4 rounded-2xl cursor-pointer hover:bg-[#219EBC] hover:font-normal hover:text-[#F5F5FA]">
            <img
              src={EventsIcon}
              alt="Events Icon"
              className="group-hover:filter group-hover:brightness-0 group-hover:invert"
            />
            <p>Events</p>
          </div>

          <div>
            <div
              className={`group flex items-center space-x-8 text-[20px] px-6 py-4 rounded-2xl cursor-pointer ${
                isFormsOpen ? "bg-[#219EBC] text-[#F5F5FA] font-normal" : ""
              } hover:bg-[#219EBC] hover:font-normal hover:text-[#F5F5FA]`}
              onClick={toggleForms}
            >
              <img
                src={FormsAndAppIcon}
                alt="Forms Icon"
                className={`group-hover:filter group-hover:brightness-0 group-hover:invert ${
                  isFormsOpen ? "filter brightness-0 invert" : ""
                }`}
              />
              <p>Forms & Applications</p>
            </div>

            {isFormsOpen && (
              <div className="m-4 ml-10 space-y-2">
                <div className="group flex items-center space-x-8 text-[20px] px-6 py-4 rounded-2xl cursor-pointer hover:bg-[#219EBC] hover:font-normal hover:text-[#F5F5FA]">
                  <img
                    src={FormsAndAppIcon}
                    alt="Forms Icon"
                    className="group-hover:filter group-hover:brightness-0 group-hover:invert"
                  />
                  <p>Forms</p>
                </div>
                <div className="group flex items-center space-x-8 text-[20px] px-6 py-4 rounded-2xl cursor-pointer hover:bg-[#219EBC] hover:font-normal hover:text-[#F5F5FA]">
                  <img
                    src={FormsAndAppIcon}
                    alt="Applications Icon"
                    className="group-hover:filter group-hover:brightness-0 group-hover:invert"
                  />
                  <p>Applications</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Fixed Settings and Logout Section */}
        <div className="absolute bottom-5 w-[90%]">
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
    </section>
  )
}

export default Sidebar
