"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Issue = {
  id: string;
  machineId: string;
  description: string;
  status: string;
  loggedById: string;
};

type UserPayload = {
  id: string;
  email: string;
  role: string;
};
function decodeToken(token: string) {
  try {
    const payload = token.split(".")[1];
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch {
    return null;
  }
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserPayload | null>(null);
  const router = useRouter();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const token = localStorage.getItem("token");
        const decodedUser = decodeToken(token || "");
        setUser(decodedUser);

        const res = await fetch("/api/issues/getall", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch issues");
        }

        const data = await res.json();
        setIssues(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  return (
    <div className="min-h-screen bg-gray-200 p-6 font-['Segoe UI',sans-serif]">
      {/* Top Bar */}
      <div className="bg-gray-100 border border-gray-400 shadow-sm p-4 mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold text-gray-800 uppercase tracking-wide">
            Maintenance Dashboard
          </h1>

          {user && (
            <div className="text-sm text-gray-600 mt-1">
              Logged in as{" "}
              <span className="font-medium text-gray-800">{user.email}</span> (
              {user.role})
            </div>
          )}
        </div>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
          className="px-4 py-1 bg-red-600 text-white border border-red-800 shadow hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {/* Actions */}
      <div className="bg-gray-100 border border-gray-400 shadow-sm p-4 mb-6 flex gap-4">
        <button
          onClick={() => router.push("/issue")}
          className="px-4 py-2 bg-blue-700 text-white border border-blue-900 shadow hover:bg-blue-800"
        >
          Log New Issue
        </button>
        <button
          onClick={() => router.push("/machine/create")}
          className="px-4 py-2 bg-green-700 text-white border border-blue-900 shadow hover:bg-green-800"
        >
          Create New Machine
        </button>
      </div>

      {/* Issues Table */}
      <div className="bg-gray-100 border border-gray-400 shadow-sm">
        <div className="border-b border-gray-400 p-3 font-semibold text-gray-800 uppercase">
          Recent Issues
        </div>

        <table className="w-full text-sm text-gray-800 border-collapse">
          <thead className="bg-gray-300 border-b border-gray-400">
            <tr>
              <th className="p-2 border-r border-gray-400 text-left">
                Machine
              </th>
              <th className="p-2 border-r border-gray-400 text-left">
                Description
              </th>
              <th className="p-2 border-r border-gray-400 text-left">Status</th>
              <th className="p-2 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={4} className="p-4 text-center">
                  Loading issues...
                </td>
              </tr>
            )}

            {!loading && issues.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center">
                  No issues found
                </td>
              </tr>
            )}

            {issues.map((issue) => (
              <IssueRow
                key={issue.id}
                machine={issue.machineId}
                description={issue.description}
                status={issue.status}
                onView={() => router.push(`/issue/${issue.id}`)}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
function IssueRow({
  machine,
  description,
  status,
  onView,
}: {
  machine: string;
  description: string;
  status: string;
  onView: () => void;
}) {
  const statusColor =
    status === "OPEN"
      ? "text-red-700"
      : status === "IN_PROGRESS"
      ? "text-yellow-700"
      : "text-green-700";

  return (
    <tr className="border-b border-gray-300 hover:bg-gray-200">
      <td className="p-2 border-r border-gray-300">{machine}</td>
      <td className="p-2 border-r border-gray-300">{description}</td>
      <td className={`p-2 border-r border-gray-300 font-medium ${statusColor}`}>
        {status}
      </td>
      <td className="p-2">
        <button
          onClick={onView}
          className="px-3 py-1 bg-blue-600 text-white border border-blue-800 shadow hover:bg-blue-700"
        >
          View
        </button>
      </td>
    </tr>
  );
}
