import SearchIcon from "../assets/icons/search.svg"
import TotalNumberIcon from "../assets/icons/total-number.svg"
import TransactionIcon from "../assets/icons/transaction.svg"
import UpcomingEventsIcon from "../assets/icons/upcoming-events.svg"

const Dashboard = () => {
    return (
        <section className="w-full font-inter h-screen bg-[#F5F5FA] overflow-hidden">
            {/* Header */}
            <div className="p-16 w-full pb-8 flex items-start">
                <div className="w-1/2">
                    <h1 className="text-6xl font-bold">Dashboard</h1>
                    <p className="text-[#767171CC] mt-3">
                        Overview of key metrics and activities
                    </p>
                </div>
                <div className="flex items-start justify-end w-1/2 text-[#76717180]">
                    <div className="relative w-1/2">
                        <input
                            type="search"
                            name="search"
                            id="search"
                            className="p-3 pr-12 border border-gray-300 border-r-0 rounded-l-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 w-full"
                            placeholder="Search..."
                        />
                        <img
                            src={SearchIcon}
                            alt="Search Icon"
                            className="absolute right-3 top-6 transform -translate-y-1/2 w-5 h-5 pointer-events-none"
                        />
                    </div>
                    <select
                        name="category"
                        id="category"
                        className="p-3 border h-[50px] border-gray-300 rounded-r-xl border-l-1 focus:outline-none"
                    >
                        <option className="text-[#000000]" value="all">
                            All Categories
                        </option>
                        <option className="text-[#000000]" value="category1">
                            Category 1
                        </option>
                        <option className="text-[#000000]" value="category2">
                            Category 2
                        </option>
                        <option className="text-[#000000]" value="category3">
                            Category 3
                        </option>
                    </select>
                </div>
            </div>

            {/* Content */}
            <div className="flex w-full h-full">
                {/* Left Section: Cards and Service Requests */}
                <div className="flex-1 flex flex-col pl-16 pr-8">
                    {/* Cards */}
                    <div className="flex gap-5 mb-5">
                        <div className="bg-white w-1/3 h-[275px] rounded-[12px] p-8 flex flex-col gap-4">
                            <div className="bg-[#FFF5E1] w-[70px] h-[70px] p-4 rounded-[20px] flex items-center">
                                <img
                                    src={TotalNumberIcon}
                                    alt="Total Number Icon"
                                />
                            </div>
                            <h3 className="font-bold text-5xl">967</h3>
                            <p className="text-[24px]">
                                Total Number of Senior Citizens
                            </p>
                        </div>
                        <div className="bg-white w-1/3 h-[275px] rounded-[12px] p-8 flex flex-col gap-4">
                            <div className="bg-[#FFF1F8] w-[70px] h-[70px] p-4 rounded-[20px] flex items-center justify-center">
                                <img
                                    src={UpcomingEventsIcon}
                                    alt="Upcoming Events Icon"
                                />
                            </div>
                            <h3 className="font-bold text-5xl">3</h3>
                            <p className="text-[24px]">Upcoming Events</p>
                        </div>
                        <div className="bg-white w-1/3 h-[275px] rounded-[12px] p-8 flex flex-col gap-4">
                            <div className="bg-[#EDFFEE] w-[70px] h-[70px] p-4 rounded-[20px] flex items-center justify-center">
                                <img
                                    src={TransactionIcon}
                                    alt="Recent Transactions Icon"
                                />
                            </div>
                            <h3 className="font-bold text-5xl">10</h3>
                            <p className="text-[24px]">Recent Transactions</p>
                        </div>
                    </div>

                    {/* Service Requests */}
                    <div className="bg-white rounded-[12px] h-[380px]">
                        <h3 className="font-bold text-5xl pl-8 pt-12">
                            Service Requests by Senior Citizens
                        </h3>
                        {/* Additional content can be added here */}
                    </div>
                </div>

                {/* Right Section: History */}
                <div className="bg-white w-1/4 h-[675px] rounded-[12px] p-8 mr-16">
                    <h3 className="font-bold text-2xl">History</h3>
                    {/* Additional content can be added here */}
                </div>
            </div>
        </section>
    )
}

export default Dashboard
