export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-10">
      <div className="w-full max-w-md bg-gray-100 border border-gray-400 shadow-[0_0_8px_rgba(0,0,0,0.25)] rounded-sm p-6 font-['Segoe UI',sans-serif]">
        
        {/* Header */}
        <div className="border-b border-gray-400 pb-3 mb-6 flex items-center gap-3">
          <div className="w-6 h-6 bg-blue-700"></div>
          <h1 className="text-xl font-semibold text-gray-800 tracking-wide uppercase">
            User Login
          </h1>
        </div>

        <form className="text-gray-800 text-sm grid grid-cols-1 gap-y-5">
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              className="w-full p-2 border border-gray-500 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              className="w-full p-2 border border-gray-500 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          {/* Button Row */}
          <div className="flex justify-end gap-3 mt-4">
            <button className="px-5 py-2 bg-gray-300 border border-gray-600 shadow-inner hover:bg-gray-400">
              Reset
            </button>
            <button className="px-5 py-2 bg-blue-700 text-white border border-blue-900 shadow hover:bg-blue-800">
              Login
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
