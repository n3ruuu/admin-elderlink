/* eslint-disable react/prop-types */
import SearchBar from "../common/SearchBar"

const Header = ({ onOpenModal }) => {
    return (
        <div className="p-16 w-full pb-8 flex items-center">
            <div className="w-1/2">
                <h1 className="text-6xl font-bold">Financial Assistance</h1>
                <p className="text-[#767171CC] mt-3">
                    Manage finances and benefits
                </p>
            </div>
            <div className="flex items-center w-2/3 text-[#76717180]">
                <div className="w-[60%]">
                    <SearchBar />
                </div>

                <button
                    className="text-[#F5F5FA] bg-[#219EBC] px-8 ml-4 text-[24px] py-2 rounded-lg hover:bg-[#1A7F8C]"
                    onClick={onOpenModal} // Use the correct prop name here
                >
                    &#43; Add Beneficiary
                </button>
            </div>
        </div>
    )
}

export default Header
