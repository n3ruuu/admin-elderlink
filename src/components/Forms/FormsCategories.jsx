import ProvincialIcon from "../../assets/provincial.png"
import CityIcon from "../../assets/city.png"
import BarangayIcon from "../../assets/barangay.png"
import OscaIcon from "../../assets/osca.png"

const FormsCategories = () => {
    return (
        <div className="flex flex-wrap px-16 w-full gap-4 font-[500]">
            <button className="flex pl-8 text-[20px] items-center bg-[#FFFFFF] rounded-[12px] w-[31.5%] h-[120px]">
                <img src={ProvincialIcon} alt="Provincial Icon" />
                <p>Provincial Initiatives</p>
            </button>
            <button className="flex pl-8 text-[20px] items-center bg-[#FFFFFF] rounded-[12px] w-[31.5%] h-[120px]">
                <img src={CityIcon} alt="City Icon" />
                <p>City Initiatives</p>
            </button>
            <button className="flex pl-8 text-[20px] items-center bg-[#FFFFFF] rounded-[12px] w-[31.5%] h-[120px]">
                <img src={BarangayIcon} alt="Barangay Icon" />
                <p>Barangay Initiatives</p>
            </button>
            <button className="flex pl-8 text-[20px] items-center bg-[#FFFFFF] rounded-[12px] w-[31.5%] h-[120px]">
                <img src={OscaIcon} alt="OSCA Icon" />
                <p>OSCA Initiatives</p>
            </button>
        </div>
    )
}

export default FormsCategories
