/* eslint-disable react/prop-types */
const NewFolder = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg w-[400px]">
                <h2 className="text-2xl font-bold mb-4">Create New Folder</h2>
                <input
                    type="text"
                    placeholder="Untitled Folder"
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none mb-4"
                />
                <div className="flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="bg-white border-[#219EBC] text-[#219EBC] border border-[1px] px-4 py-2 rounded-md"
                    >
                        Cancel
                    </button>
                    <button className="bg-[#219EBC] text-white px-4 py-2 rounded-md w-[100px]">
                        Save
                    </button>
                </div>
            </div>
        </div>
    )
}

export default NewFolder
