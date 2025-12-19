"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateMachinePage() {
  const router = useRouter();

  const [machineCode, setMachineCode] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch("/api/machine/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          machineCode,
          name,
          type,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to create machine");
      }

      // success → go back to dashboard
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-10 font-['Segoe UI',sans-serif]">
      <div className="w-full max-w-xl bg-gray-100 border border-gray-400 shadow-[0_0_8px_rgba(0,0,0,0.25)] p-6">
        {/* Header */}
        <div className="border-b border-gray-400 pb-3 mb-6 flex items-center gap-3">
          <div className="w-6 h-6 bg-green-700" />
          <h1 className="text-xl font-semibold text-gray-800 uppercase tracking-wide">
            Add Machine
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-sm">
          {/* Machine Code */}
          <div>
            <label className="block mb-1 font-medium text-gray-800">
              Machine Code
            </label>
            <input
              type="text"
              value={machineCode}
              onChange={(e) => setMachineCode(e.target.value)}
              required
              className="w-full p-2 border border-gray-500 bg-white focus:outline-none focus:ring-1 focus:ring-green-700"
              placeholder="M-101"
            />
          </div>

          {/* Name */}
          <div>
            <label className="block mb-1 font-medium text-gray-800">
              Machine Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2 border border-gray-500 bg-white focus:outline-none focus:ring-1 focus:ring-green-700"
              placeholder="Hydraulic Press"
            />
          </div>

          {/* Type */}
          <div>
            <label className="block mb-1 font-medium text-gray-800">
              Machine Type
            </label>
            <input
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
              className="w-full p-2 border border-gray-500 bg-white focus:outline-none focus:ring-1 focus:ring-green-700"
              placeholder="Mechanical / Electrical"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="text-red-700 border border-red-500 bg-red-100 p-2">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-5 py-2 bg-gray-300 border border-gray-600 shadow-inner hover:bg-gray-400"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-green-700 text-white border border-green-900 shadow hover:bg-green-800 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Create Machine"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
