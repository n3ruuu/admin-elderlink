import { useState, useEffect } from "react"
import axios from "axios"
import Header from "./Header"

const ContentManagement = () => {
    const [officers, setOfficers] = useState([])
    const [coordinators, setCoordinators] = useState([])
    const [newOfficer, setNewOfficer] = useState({ name: "", position: "" })
    const [newCoordinator, setNewCoordinator] = useState({ name: "", area: "" })

    // Fetch officers and coordinators data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const officerResponse = await axios.get("http://localhost:5000/cms/officers")
                const coordinatorResponse = await axios.get("http://localhost:5000/cms/area-coordinators")
                console.log("Officers:", officerResponse.data)
                console.log("Coordinators:", coordinatorResponse.data)
                setOfficers(officerResponse.data)
                setCoordinators(coordinatorResponse.data)
            } catch (error) {
                console.error("Error fetching data", error)
            }
        }

        fetchData()
    }, [])

    // Handle adding a new officer
    const handleAddOfficer = async () => {
        try {
            await axios.post("http://localhost:5000/cms/officers", newOfficer)
            setOfficers([...officers, newOfficer])
            setNewOfficer({ name: "", position: "" })
        } catch (error) {
            console.error("Error adding officer", error)
        }
    }

    // Handle adding a new area coordinator
    const handleAddCoordinator = async () => {
        try {
            await axios.post("http://localhost:5000/cms/area-coordinators", newCoordinator)
            setCoordinators([...coordinators, newCoordinator])
            setNewCoordinator({ name: "", area: "" })
        } catch (error) {
            console.error("Error adding coordinator", error)
        }
    }

    // Handle deleting an officer
    const handleDeleteOfficer = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/cms/officers/${id}`)
            setOfficers(officers.filter((officer) => officer.id !== id))
        } catch (error) {
            console.error("Error deleting officer", error)
        }
    }

    // Handle deleting a coordinator
    const handleDeleteCoordinator = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/cms/area-coordinators/${id}`)
            setCoordinators(coordinators.filter((coordinator) => coordinator.id !== id))
        } catch (error) {
            console.error("Error deleting coordinator", error)
        }
    }

    return (
        <section className="w-full font-inter h-screen bg-[#F5F5FA] overflow-auto">
            <Header />
            <div className="flex w-full h-full ">
                <div className="flex-1 flex flex-col px-16 py-4 ">
                    <div>
                        {/* Officers Management Section */}
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-600">Officers</h2>
                            <div className="mt-4 bg-white p-6 rounded-lg shadow-md">
                                <div className="flex mb-4 space-x-4">
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        value={newOfficer.name}
                                        onChange={(e) => setNewOfficer({ ...newOfficer, name: e.target.value })}
                                        className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Position"
                                        value={newOfficer.position}
                                        onChange={(e) => setNewOfficer({ ...newOfficer, position: e.target.value })}
                                        className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        onClick={handleAddOfficer}
                                        className="bg-[#219EBC] text-white px-6 py-3 rounded-lg hover:bg-[#1A8EBC] focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        Add Officer
                                    </button>
                                </div>
                                <ul className="space-y-3">
                                    {officers.map((officer) => (
                                        <li
                                            key={officer.id}
                                            className="flex justify-between items-center bg-gray-50 p-3 rounded-lg shadow-sm"
                                        >
                                            <span className="text-gray-700">
                                                {officer.name} - {officer.position}
                                            </span>
                                            <button
                                                onClick={() => handleDeleteOfficer(officer.id)}
                                                className="text-red-600 hover:text-red-800 focus:outline-none"
                                            >
                                                Delete
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Area Coordinators Management Section */}
                        <div className="mt-8 mb-8">
                            <h2 className="text-2xl font-semibold text-gray-600">Area Coordinators</h2>
                            <div className="mt-4 bg-white p-6 rounded-lg shadow-md">
                                <div className="flex mb-4 space-x-4">
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        value={newCoordinator.name}
                                        onChange={(e) => setNewCoordinator({ ...newCoordinator, name: e.target.value })}
                                        className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Area"
                                        value={newCoordinator.area}
                                        onChange={(e) => setNewCoordinator({ ...newCoordinator, area: e.target.value })}
                                        className="p-3 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        onClick={handleAddCoordinator}
                                        className="bg-[#219EBC] text-white px-6 py-3 rounded-lg hover:bg-[#1A8EBC] focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        Add Coordinator
                                    </button>
                                </div>
                                <ul className="space-y-3">
                                    {coordinators.map((coordinator) => (
                                        <li
                                            key={coordinator.id}
                                            className="flex justify-between items-center bg-gray-50 p-3 rounded-lg shadow-sm"
                                        >
                                            <span className="text-gray-700">
                                                {coordinator.name} - {coordinator.area}
                                            </span>
                                            <button
                                                onClick={() => handleDeleteCoordinator(coordinator.id)}
                                                className="text-red-600 hover:text-red-800 focus:outline-none"
                                            >
                                                Delete
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ContentManagement
