/* eslint-disable react/prop-types */
import moment from "moment"

const FormsContainer = ({ groupedForms, selectedCategory }) => {
    return (
        <div className="py-8 px-16">
            {/* Display only selected category forms */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {groupedForms[selectedCategory]?.map((form) => (
                    <div
                        key={form.id}
                        className="bg-white rounded-lg shadow-md p-6 hover:scale-105 transform transition-all relative"
                    >
                        <div>
                            {/* Use an object tag to display a thumbnail preview */}
                            <div className="w-full h-32 bg-gray-300 mb-4 rounded-lg ">
                                <object
                                    data={`http://localhost:5000/${form.pdfLink}`}
                                    type="application/pdf"
                                    width="100%"
                                    height="100%"
                                >
                                    <p>
                                        Your browser does not support PDF
                                        preview.
                                    </p>
                                </object>
                            </div>
                            <h3 className="text-lg font-semibold">
                                {form.title}
                            </h3>
                            <p className="text-sm text-gray-500">
                                Date Created:{" "}
                                {moment(form.lastOpened).format(
                                    "MMMM D, YYYY, h:mm A",
                                )}
                            </p>
                        </div>
                        <a
                            href={`http://localhost:5000/${form.pdfLink}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#219EBC] font-semibold mt-2 hover:underline inline-block"
                        >
                            Open Form
                        </a>

                        {/* Ellipsis dots in the bottom left corner */}
                        <div className="absolute bottom-8 right-8 flex flex-col items-center space-y-1 cursor-pointer">
                            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                            <div className="w-1 h-1 bg-gray-500 rounded-full"></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default FormsContainer
