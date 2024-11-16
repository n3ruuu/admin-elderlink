/* eslint-disable react/prop-types */

const DashboardHeader = () => {
    return (
        <div className="p-16 w-full pb-8 flex items-start justify-between">
            <div className="w-1/2">
                <h1 className="text-6xl font-bold">Dashboard</h1>
                <p className="text-[#767171CC] mt-3">
                    Overview of key metrics and activities
                </p>
            </div>
            <div className="flex items-center w-1/3 mt-4"></div>
        </div>
    )
}

export default DashboardHeader
