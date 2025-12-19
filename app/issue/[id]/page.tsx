"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Issue = {
  id: string;
  machineId: string;
  description: string;
  status: string;
  resolution: string | null;
};

export default function IssueDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`/api/issues/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to load issue");

        const data = await res.json();
        setIssue(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchIssue();
  }, [id]);

  const handleUpdate = async () => {
    if (!issue) return;

    try {
      setSaving(true);
      const token = localStorage.getItem("token");

      const res = await fetch(`/api/issues/update/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          description: issue.description,
          status: issue.status,
          resolution: issue.resolution,
        }),
      });

      if (!res.ok) throw new Error("Update failed");

      alert("Issue updated successfully");
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to update issue");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-10">Loading...</div>;
  }

  if (!issue) {
    return <div className="p-10">Issue not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-10 font-['Segoe UI',sans-serif]">
      <div className="w-full max-w-2xl bg-gray-100 border border-gray-400 shadow-[0_0_8px_rgba(0,0,0,0.25)] p-6">
        {/* Header */}
        <div className="border-b border-gray-400 pb-3 mb-6">
          <h1 className="text-xl font-semibold uppercase text-gray-800">
            Update Issue
          </h1>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 gap-5 text-sm text-gray-800">
          <div>
            <label className="block mb-1 font-medium">Machine ID</label>
            <input
              disabled
              value={issue.machineId}
              className="w-full p-2 border border-gray-500 bg-gray-200"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Description</label>
            <textarea
              value={issue.description}
              onChange={(e) =>
                setIssue({ ...issue, description: e.target.value })
              }
              className="w-full p-2 border border-gray-500 bg-white h-24"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Status</label>
            <select
              value={issue.status}
              onChange={(e) =>
                setIssue({ ...issue, status: e.target.value })
              }
              className="w-full p-2 border border-gray-500 bg-white"
            >
              <option value="OPEN">OPEN</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="RESOLVED">RESOLVED</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Resolution</label>
            <textarea
              value={issue.resolution ?? ""}
              onChange={(e) =>
                setIssue({ ...issue, resolution: e.target.value })
              }
              className="w-full p-2 border border-gray-500 bg-white h-20"
            />
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-gray-300 border border-gray-600"
            >
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={saving}
              className="px-4 py-2 bg-blue-700 text-white border border-blue-900 hover:bg-blue-800"
            >
              {saving ? "Saving..." : "Update Issue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
