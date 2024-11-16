/* eslint-disable react/prop-types */
import ProvincialIcon from "../../assets/provincial.png"
import CityIcon from "../../assets/city.png"
import BarangayIcon from "../../assets/barangay.png"
import OscaIcon from "../../assets/osca.png"

const FormsCategories = ({ onCategoryClick }) => {
    return (
        <div className="flex flex-wrap px-16 w-full gap-x-6 gap-y-4 font-[500]">
            <button
                onClick={() => onCategoryClick("Provincial Initiatives")}
                className="flex pl-8 text-[20px] items-center bg-[#FFFFFF] rounded-[12px] w-[31.5%] h-[120px] hover:bg-[#F0F0F0] transition-colors duration-300"
            >
                <img src={ProvincialIcon} alt="Provincial Icon" />
                <p>Provincial Initiatives</p>
            </button>
            <button
                onClick={() => onCategoryClick("City Initiatives")}
                className="flex pl-8 text-[20px] items-center bg-[#FFFFFF] rounded-[12px] w-[31.5%] h-[120px] hover:bg-[#F0F0F0] transition-colors duration-300"
            >
                <img src={CityIcon} alt="City Icon" />
                <p>City Initiatives</p>
            </button>
            <button
                onClick={() => onCategoryClick("Barangay Initiatives")}
                className="flex pl-8 text-[20px] items-center bg-[#FFFFFF] rounded-[12px] w-[31.5%] h-[120px] hover:bg-[#F0F0F0] transition-colors duration-300"
            >
                <img src={BarangayIcon} alt="Barangay Icon" />
                <p>Barangay Initiatives</p>
            </button>
            <button
                onClick={() => onCategoryClick("OSCA Initiatives")}
                className="flex pl-8 text-[20px] items-center bg-[#FFFFFF] rounded-[12px] w-[31.5%] h-[120px] hover:bg-[#F0F0F0] transition-colors duration-300"
            >
                <img src={OscaIcon} alt="OSCA Icon" />
                <p>OSCA Initiatives</p>
            </button>
        </div>
    )
}

export default FormsCategories
