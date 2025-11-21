export default function CreateIssue() {
  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-10">
      <div className="w-full max-w-2xl bg-gray-100 border border-gray-400 shadow-[0_0_8px_rgba(0,0,0,0.25)] rounded-sm p-6 font-['Segoe UI',sans-serif]">
        {/* Header */}
        <div className="border-b border-gray-400 pb-3 mb-6 flex items-center gap-3">
          <div className="w-6 h-6 bg-blue-700"></div>
          <h1 className="text-xl font-semibold text-gray-800 tracking-wide uppercase">
            Create Issue
          </h1>
        </div>

        <form className="text-gray-800 text-sm grid grid-cols-2 gap-x-6 gap-y-5">
          {/* Machine ID */}
          <div className="col-span-2">
            <label className="block mb-1 font-medium">Machine ID</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-500 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
              placeholder="Enter machine ID"
            />
          </div>

          {/* Issue Description */}
          <div className="col-span-2">
            <label className="block mb-1 font-medium">Issue Description</label>
            <textarea
              className="w-full p-2 border border-gray-500 bg-white h-24 resize-none focus:outline-none focus:ring-1 focus:ring-blue-600"
              placeholder="Describe the issue"
            ></textarea>
          </div>

          {/* Production Affect */}
          <div className="col-span-2">
            <label className="block mb-1 font-medium">Production Affect</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-500 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
              placeholder="Enter how production is affected"
            />
          </div>

          {/* Photo Upload */}
          <div className="col-span-2">
            <label className="block mb-1 font-medium">Photo</label>
            <input
              type="file"
              className="w-full border border-gray-500 bg-white p-1.5 focus:outline-none"
            />
          </div>

          {/* Buttons */}
          <div className="col-span-2 flex justify-end gap-3 mt-4">
            <button className="px-5 py-2 bg-gray-300 border border-gray-600 shadow-inner hover:bg-gray-400">
              Reset
            </button>
            <button className="px-5 py-2 bg-blue-700 text-white border border-blue-900 shadow hover:bg-blue-800">
              Submit Issue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
