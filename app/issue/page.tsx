"use client";

import { useState } from "react";

export default function CreateIssue() {
  const [machineId, setMachineId] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const res = await fetch("/api/issues/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          machineId,
          description,
          category,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to create issue");
      }

      alert("Issue created successfully");
      setMachineId("");
      setDescription("");
      setCategory("");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-10">
      <div className="w-full max-w-2xl bg-gray-100 border border-gray-400 shadow-[0_0_8px_rgba(0,0,0,0.25)] rounded-sm p-6 font-['Segoe UI',sans-serif]">
        
        {/* Header */}
        <div className="border-b border-gray-400 pb-3 mb-6 flex items-center gap-3">
          <div className="w-6 h-6 bg-blue-700"></div>
          <h1 className="text-xl font-semibold text-gray-800 uppercase">
            Create Issue
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="text-gray-800 text-sm grid grid-cols-2 gap-x-6 gap-y-5"
        >
          {/* Machine ID */}
          <div className="col-span-2">
            <label className="block mb-1 font-medium">Machine ID</label>
            <input
              value={machineId}
              onChange={(e) => setMachineId(e.target.value)}
              className="w-full p-2 border border-gray-500 bg-white focus:ring-1 focus:ring-blue-600"
              required
            />
          </div>

          {/* Issue Description */}
          <div className="col-span-2">
            <label className="block mb-1 font-medium">Issue Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-500 bg-white h-24 resize-none focus:ring-1 focus:ring-blue-600"
              required
            />
          </div>

          {/* Production Affect → category */}
          <div className="col-span-2">
            <label className="block mb-1 font-medium">Production Affect</label>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border border-gray-500 bg-white focus:ring-1 focus:ring-blue-600"
              placeholder="Downtime / Reduced Output / Safety Risk"
            />
          </div>

          {error && (
            <div className="col-span-2 text-red-600 font-medium">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="col-span-2 flex justify-end gap-3 mt-4">
            <button
              type="reset"
              className="px-5 py-2 bg-gray-300 border border-gray-600 shadow-inner"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-blue-700 text-white border border-blue-900 shadow hover:bg-blue-800 disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Issue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
