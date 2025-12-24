"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/* ================= TYPES ================= */

type Machine = {
  id: string;
  machineCode: string;
  name: string;
  type: string;
  location: string | null;
  createdAt: string;
};

type UserPayload = {
  id: string;
  email: string;
  role: string;
};

/* ================= HELPERS ================= */

function decodeToken(token: string) {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

/* ================= PAGE ================= */

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<UserPayload | null>(null);
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        const decodedUser = decodeToken(token);
        setUser(decodedUser);

        const res = await fetch("/api/machine/getall", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch machines");
        }

        const data = await res.json();
        setMachines(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMachines();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-200 p-6 font-['Segoe UI',sans-serif]">
      {/* ================= TOP BAR ================= */}
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

      {/* ================= ACTIONS ================= */}
      <div className="bg-gray-100 border border-gray-400 shadow-sm p-4 mb-6 flex gap-4">
        {user?.role === "SUPERVISOR" && (
          <button
            onClick={() => router.push("/machine/create")}
            className="px-4 py-2 bg-green-700 text-white border border-green-900 shadow hover:bg-green-800"
          >
            Create New Machine
          </button>
        )}
      </div>

      {/* ================= MACHINES TABLE ================= */}
      <div className="bg-gray-100 border border-gray-400 shadow-sm">
        <div className="border-b border-gray-400 p-3 font-semibold text-gray-800 uppercase">
          Machines
        </div>

        <table className="w-full text-sm text-gray-800 border-collapse">
          <thead className="bg-gray-300 border-b border-gray-400">
            <tr>
              <th className="p-2 border-r border-gray-400 text-left">
                Machine Code
              </th>
              <th className="p-2 border-r border-gray-400 text-left">
                Name
              </th>
              <th className="p-2 border-r border-gray-400 text-left">
                Type
              </th>
              <th className="p-2 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan={4} className="p-4 text-center">
                  Loading machines...
                </td>
              </tr>
            )}

            {!loading && machines.length === 0 && (
              <tr>
                <td colSpan={4} className="p-4 text-center">
                  No machines found
                </td>
              </tr>
            )}

            {!loading &&
              machines.map((machine) => (
                <MachineRow
                  key={machine.id}
                  machineCode={machine.machineCode}
                  name={machine.name}
                  type={machine.type}
                  onView={() => router.push(`/machine/${machine.id}`)}
                />
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}



function MachineRow({
  machineCode,
  name,
  type,
  onView,
}: {
  machineCode: string;
  name: string;
  type: string;
  onView: () => void;
}) {
  return (
    <tr className="border-b border-gray-300 hover:bg-gray-200">
      <td className="p-2 border-r border-gray-300">{machineCode}</td>
      <td className="p-2 border-r border-gray-300">{name}</td>
      <td className="p-2 border-r border-gray-300">{type}</td>
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
