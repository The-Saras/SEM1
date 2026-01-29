"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

/* ================= TYPES ================= */

type Machine = {
  id: string;
  machineCode: string;
  name: string;
  type: string;
  location: string | null;
  createdAt: string;
};

type AnalysisData = {
  totalIssues: number;
  issuesByStatus: {
    OPEN: number;
    IN_PROGRESS: number;
    RESOLVED: number;
    CLOSED: number;
  };
  categoryCounts: Record<string, number>;
  issuesOverTime: Record<string, number>;
  avgResolutionTime: number;
  issuesWithRootCause: number;
  issuesWithoutRootCause: number;
  issuesWithCorrectiveAction: number;
  issuesWithoutCorrectiveAction: number;
  issuesByUser: Record<string, number>;
  resolutionTimes: number[];
};

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#0088fe"];

/* ================= PAGE ================= */

export default function MachineAnalysisPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [machine, setMachine] = useState<Machine | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/login");
          return;
        }

        // Fetch machine details
        const machineRes = await fetch(`/api/machine/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!machineRes.ok) throw new Error("Failed to fetch machine");

        const machineData = await machineRes.json();
        setMachine(machineData);

        // Fetch analysis data
        const analysisRes = await fetch(`/api/machine/${id}/analysis`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!analysisRes.ok) throw new Error("Failed to fetch analysis");

        const analysisData = await analysisRes.json();
        setAnalysisData(analysisData);
      } catch (err) {
        console.error(err);
        setError("Unable to load analysis data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-200 p-6 flex items-center justify-center">
        <div className="text-lg">Loading analysis...</div>
      </div>
    );
  }

  if (error || !machine || !analysisData) {
    return (
      <div className="min-h-screen bg-gray-200 p-6 flex items-center justify-center">
        <div className="bg-gray-100 border border-gray-400 p-6 shadow">
          <p className="text-red-700 mb-4">
            {error ?? "Unable to load analysis data"}
          </p>
          <button
            onClick={() => router.push(`/machine/${id}`)}
            className="px-4 py-2 bg-blue-700 text-white"
          >
            Back to Machine Details
          </button>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const statusData = Object.entries(analysisData.issuesByStatus).map(
    ([name, value]) => ({ name, value })
  );

  const categoryData = Object.entries(analysisData.categoryCounts).map(
    ([name, value]) => ({ name, value })
  );

  const timeSeriesData = Object.entries(analysisData.issuesOverTime)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => {
      const dateA = new Date(a.name);
      const dateB = new Date(b.name);
      return dateA.getTime() - dateB.getTime();
    });

  const userData = Object.entries(analysisData.issuesByUser)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10); // Top 10 users

  const rootCauseData = [
    { name: "With Root Cause", value: analysisData.issuesWithRootCause },
    { name: "Without Root Cause", value: analysisData.issuesWithoutRootCause },
  ];

  const correctiveActionData = [
    {
      name: "With Corrective Action",
      value: analysisData.issuesWithCorrectiveAction,
    },
    {
      name: "Without Corrective Action",
      value: analysisData.issuesWithoutCorrectiveAction,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-200 p-6 font-['Segoe UI',sans-serif]">
      {/* Header */}
      <div className="bg-gray-100 border border-gray-400 shadow-sm p-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-semibold text-gray-800 uppercase">
              Machine Analysis
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {machine.name} ({machine.machineCode})
            </p>
          </div>
          <button
            onClick={() => router.push(`/machine/${id}`)}
            className="px-4 py-2 bg-gray-600 text-white"
          >
            Back to Details
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gray-100 border border-gray-400 shadow-sm p-4">
          <div className="text-sm text-gray-600">Total Issues</div>
          <div className="text-2xl font-bold text-gray-800">
            {analysisData.totalIssues}
          </div>
        </div>
        <div className="bg-gray-100 border border-gray-400 shadow-sm p-4">
          <div className="text-sm text-gray-600">Open Issues</div>
          <div className="text-2xl font-bold text-red-700">
            {analysisData.issuesByStatus.OPEN}
          </div>
        </div>
        <div className="bg-gray-100 border border-gray-400 shadow-sm p-4">
          <div className="text-sm text-gray-600">Resolved Issues</div>
          <div className="text-2xl font-bold text-green-700">
            {analysisData.issuesByStatus.RESOLVED +
              analysisData.issuesByStatus.CLOSED}
          </div>
        </div>
        <div className="bg-gray-100 border border-gray-400 shadow-sm p-4">
          <div className="text-sm text-gray-600">Avg Resolution Time</div>
          <div className="text-2xl font-bold text-blue-700">
            {analysisData.avgResolutionTime > 0
              ? `${analysisData.avgResolutionTime} days`
              : "N/A"}
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Issues by Status - Pie Chart */}
        <div className="bg-gray-100 border border-gray-400 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 uppercase">
            Issues by Status
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Issues by Category - Bar Chart */}
        <div className="bg-gray-100 border border-gray-400 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 uppercase">
            Issues by Category
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Issues Over Time - Line Chart */}
        <div className="bg-gray-100 border border-gray-400 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 uppercase">
            Issues Over Time (Last 6 Months)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#8884d8"
                strokeWidth={2}
                name="Issues"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Issues by User - Bar Chart */}
        <div className="bg-gray-100 border border-gray-400 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 uppercase">
            Issues Logged by User (Top 10)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={userData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Root Cause Analysis - Pie Chart */}
        <div className="bg-gray-100 border border-gray-400 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 uppercase">
            Root Cause Analysis
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={rootCauseData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {rootCauseData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 0 ? "#82ca9d" : "#ffc658"}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Corrective Action Analysis - Pie Chart */}
        <div className="bg-gray-100 border border-gray-400 shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 uppercase">
            Corrective Action Analysis
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={correctiveActionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {correctiveActionData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={index === 0 ? "#82ca9d" : "#ffc658"}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Resolution Time Distribution */}
      {analysisData.resolutionTimes.length > 0 && (
        <div className="bg-gray-100 border border-gray-400 shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 uppercase">
            Resolution Time Distribution (Days)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-gray-600">Minimum</div>
              <div className="text-xl font-bold text-gray-800">
                {Math.min(...analysisData.resolutionTimes)} days
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Maximum</div>
              <div className="text-xl font-bold text-gray-800">
                {Math.max(...analysisData.resolutionTimes)} days
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Average</div>
              <div className="text-xl font-bold text-gray-800">
                {analysisData.avgResolutionTime} days
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Median</div>
              <div className="text-xl font-bold text-gray-800">
                {(() => {
                  const sorted = [...analysisData.resolutionTimes].sort(
                    (a, b) => a - b
                  );
                  const mid = Math.floor(sorted.length / 2);
                  return sorted.length % 2 !== 0
                    ? sorted[mid]
                    : (sorted[mid - 1] + sorted[mid]) / 2;
                })()}{" "}
                days
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

