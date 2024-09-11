import DashboardHeader from "./DashboardHeader"
import DashboardCard from "./DashboardCard"
import ServiceRequests from "./ServiceRequests"
import History from "./History"

import TotalNumberIcon from "../../assets/icons/total-number.svg"
import UpcomingEventsIcon from "../../assets/icons/upcoming-events.svg"
import TransactionIcon from "../../assets/icons/transaction.svg"

const Dashboard = () => {
    return (
        <section className="w-full font-inter h-screen bg-[#F5F5FA] overflow-hidden">
            <DashboardHeader />
            <div className="flex w-full h-full">
                <div className="flex-1 flex flex-col pl-16 pr-8">
                    <div className="flex gap-5 mb-5">
                        <DashboardCard
                            icon={TotalNumberIcon}
                            count="967"
                            title="Total Number of Senior Citizens"
                            bgColor="bg-[#FFF5E1]"
                        />
                        <DashboardCard
                            icon={UpcomingEventsIcon}
                            count="3"
                            title="Upcoming Events"
                            bgColor="bg-[#FFF1F8]"
                        />
                        <DashboardCard
                            icon={TransactionIcon}
                            count="10"
                            title="Recent Transactions"
                            bgColor="bg-[#EDFFEE]"
                        />
                    </div>
                    <ServiceRequests />
                </div>
                <History />
            </div>
        </section>
    )
}

export default Dashboard
