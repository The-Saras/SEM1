"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

/* ================= TYPES ================= */

type Machine = {
    id: string;
    machineCode: string;
    name: string;
    type: string;
    location: string | null;
    createdAt: string;
};
type Issue = {
    id: string;
    description: string;
    category: string | null;
    rootCause: string | null;
    correctiveAction: string | null;
    resolution: string | null;
    status: "OPEN" | "IN_PROGRESS" | "CLOSED";
    createdAt: string;
};



/* ================= PAGE ================= */

export default function MachineDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const [machine, setMachine] = useState<Machine | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [showIssueForm, setShowIssueForm] = useState(false);

    const [formData, setFormData] = useState({
        description: "",
        category: "",
        rootCause: "",
        correctiveAction: "",
        resolution: "",
    });

    const [submitting, setSubmitting] = useState(false);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const [issues, setIssues] = useState<Issue[]>([]);
    const [issuesLoading, setIssuesLoading] = useState(true);

    const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
    const [isEditOpen, setIsEditOpen] = useState(false);



    /* ================= FETCH MACHINE ================= */

    useEffect(() => {
        const fetchIssues = async () => {
            try {
                const token = localStorage.getItem("token");

                const res = await fetch(`/api/machine/${id}/issues`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error("Failed to fetch issues");

                const data = await res.json();
                setIssues(data);
            } catch (err) {
                console.error(err);
            } finally {
                setIssuesLoading(false);
            }
        };

        const fetchMachine = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    router.push("/login");
                    return;
                }

                const res = await fetch(`/api/machine/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) throw new Error("Failed to fetch machine");

                const data = await res.json();
                setMachine(data);
            } catch (err) {
                console.error(err);
                setError("Unable to load machine details");
            } finally {
                setLoading(false);
            }
        };

        if (id) { fetchMachine(); fetchIssues(); }
    }, [id, router]);

    /* ================= CREATE ISSUE ================= */

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setSuccessMsg(null);

        try {
            const token = localStorage.getItem("token");

            const res = await fetch("/api/issues/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    machineId: id, // 👈 comes from URL
                    ...formData,
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to create issue");
            }

            setSuccessMsg("Issue logged successfully");
            setFormData({
                description: "",
                category: "",
                rootCause: "",
                correctiveAction: "",
                resolution: "",
            });
            setShowIssueForm(false);
        } catch (err) {
            console.error(err);
            alert("Error creating issue");
        } finally {
            setSubmitting(false);
        }
    };

    /* ================= UI STATES ================= */

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-200 p-6 flex items-center justify-center">
                Loading machine...
            </div>
        );
    }

    if (error || !machine) {
        return (
            <div className="min-h-screen bg-gray-200 p-6 flex items-center justify-center">
                <div className="bg-gray-100 border border-gray-400 p-6 shadow">
                    <p className="text-red-700 mb-4">
                        {error ?? "Machine not found"}
                    </p>
                    <button
                        onClick={() => router.push("/dashboard")}
                        className="px-4 py-2 bg-blue-700 text-white"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    /* ================= MAIN VIEW ================= */

    return (
        <div className="min-h-screen bg-gray-200 p-6 font-['Segoe UI',sans-serif]">
            {/* Header */}
            <div className="bg-gray-100 border border-gray-400 shadow-sm p-4 mb-6">
                <h1 className="text-xl font-semibold text-gray-800 uppercase">
                    Machine Details
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                    Machine Code:{" "}
                    <span className="font-medium text-gray-800">
                        {machine.machineCode}
                    </span>
                </p>
            </div>

            {/* Details */}
            <div className="bg-gray-100 border border-gray-400 shadow-sm p-6 mb-6">
                <DetailRow label="Name" value={machine.name} />
                <DetailRow label="Type" value={machine.type} />
                <DetailRow
                    label="Location"
                    value={machine.location ?? "Not specified"}
                />
                <DetailRow
                    label="Created At"
                    value={new Date(machine.createdAt).toLocaleString()}
                />
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-6">
                <button
                    onClick={() => router.push("/dashboard")}
                    className="px-4 py-2 bg-gray-600 text-white"
                >
                    Back
                </button>

                <button
                    onClick={() => setShowIssueForm((prev) => !prev)}
                    className="px-4 py-2 bg-blue-700 text-white"
                >
                    {showIssueForm ? "Cancel" : "Log Issue for this Machine"}
                </button>
            </div>

            {/* Success */}
            {successMsg && (
                <div className="mb-4 text-green-700 font-medium">
                    {successMsg}
                </div>
            )}

            {/* Issue Form */}
            {showIssueForm && (
                <form
                    onSubmit={handleSubmit}
                    className="bg-gray-100 border border-gray-400 shadow-sm p-6 space-y-4"
                >
                    <Input
                        label="Description *"
                        value={formData.description}
                        onChange={(v) =>
                            setFormData({ ...formData, description: v })
                        }
                        required
                    />

                    <Input
                        label="Category"
                        value={formData.category}
                        onChange={(v) =>
                            setFormData({ ...formData, category: v })
                        }
                        placeholder="Optional"
                    />

                    <Input
                        label="Root Cause"
                        value={formData.rootCause}
                        onChange={(v) =>
                            setFormData({ ...formData, rootCause: v })
                        }
                        placeholder="Optional"
                    />

                    <Input
                        label="Corrective Action"
                        value={formData.correctiveAction}
                        onChange={(v) =>
                            setFormData({ ...formData, correctiveAction: v })
                        }
                        placeholder="Optional"
                    />

                    <Input
                        label="Resolution"
                        value={formData.resolution}
                        onChange={(v) =>
                            setFormData({ ...formData, resolution: v })
                        }
                        placeholder="Optional"
                    />

                    <button
                        type="submit"
                        disabled={submitting}
                        className="px-6 py-2 bg-green-700 text-white disabled:opacity-50"
                    >
                        {submitting ? "Submitting..." : "Create Issue"}
                    </button>
                </form>
            )}
            <div className="bg-gray-100 border border-gray-400 shadow-sm p-4 mt-8">
                <div className="font-semibold text-gray-800 uppercase mb-3">
                    Issues for this Machine
                </div>

                <table className="w-full text-sm border-collapse">
                    <thead className="bg-gray-300 border-b border-gray-400">
                        <tr>
                            <th className="p-2 border-r border-gray-400 text-left">
                                Description
                            </th>
                            <th className="p-2 border-r border-gray-400 text-left">
                                Category
                            </th>
                            <th className="p-2 border-r border-gray-400 text-left">
                                Status
                            </th>
                            <th className="p-2 text-left">
                                Created
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {issuesLoading && (
                            <tr>
                                <td colSpan={4} className="p-4 text-center">
                                    Loading issues...
                                </td>
                            </tr>
                        )}

                        {!issuesLoading && issues.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-4 text-center">
                                    No issues logged for this machine
                                </td>
                            </tr>
                        )}

                        {!issuesLoading &&
                            issues.map((issue) => (
                                <tr
                                    key={issue.id}
                                    onClick={() => {
                                        setSelectedIssue(issue);
                                        setIsEditOpen(true);
                                    }}
                                    className="border-b border-gray-300 hover:bg-gray-200 cursor-pointer"
                                >

                                    <td className="p-2 border-r border-gray-300">
                                        {issue.description}
                                    </td>
                                    <td className="p-2 border-r border-gray-300">
                                        {issue.category ?? "-"}
                                    </td>
                                    <td
                                        className={`p-2 border-r border-gray-300 font-medium ${issue.status === "OPEN"
                                            ? "text-red-700"
                                            : issue.status === "IN_PROGRESS"
                                                ? "text-yellow-700"
                                                : "text-green-700"
                                            }`}
                                    >
                                        {issue.status}
                                    </td>
                                    <td className="p-2">
                                        {new Date(issue.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
            {isEditOpen && selectedIssue && (
                <EditIssueModal
                    issue={selectedIssue}
                    onClose={() => setIsEditOpen(false)}
                    onUpdated={(updated) =>
                        setIssues((prev) =>
                            prev.map((i) => (i.id === updated.id ? updated : i))
                        )
                    }
                />
            )}

        </div>

    );
}

/* ================= REUSABLE COMPONENTS ================= */

function DetailRow({
    label,
    value,
}: {
    label: string;
    value: string;
}) {
    return (
        <div className="flex justify-between py-2 border-b border-gray-300 last:border-b-0">
            <span className="font-medium text-gray-700">{label}</span>
            <span className="text-gray-900">{value}</span>
        </div>
    );
}

function Input({
    label,
    value,
    onChange,
    required,
    placeholder,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    required?: boolean;
    placeholder?: string;
}) {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <input
                value={value}
                required={required}
                placeholder={placeholder}
                onChange={(e) => onChange(e.target.value)}
                className="w-full border border-gray-400 px-3 py-2"
            />
        </div>
    );
}
function EditIssueModal({
    issue,
    onClose,
    onUpdated,
}: {
    issue: Issue;
    onClose: () => void;
    onUpdated: (updated: Issue) => void;
}) {
    const [form, setForm] = useState({
        description: issue.description,
        status: issue.status,
        resolution: issue.resolution ?? "",
        correctiveAction: issue.correctiveAction ?? "",
    });

    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        try {
            setSaving(true);
            const token = localStorage.getItem("token");

            const res = await fetch(`/api/issues/update/${issue.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(form),
            });

            if (!res.ok) throw new Error("Update failed");

            const updated = await res.json();
            onUpdated(updated);
            onClose();
        } catch (err) {
            console.error(err);
            alert("Failed to update issue");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-gray-100 border border-gray-400 shadow-lg w-full max-w-3xl p-6">
                <h2 className="text-lg font-semibold mb-6 uppercase">
                    Edit Issue
                </h2>

                <div className="space-y-5">
                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Description
                        </label>
                        <textarea
                            value={form.description}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    description: e.target.value,
                                })
                            }
                            className="w-full border border-gray-400 px-3 py-2 min-h-[140px] resize-y"
                            required
                        />
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Status
                        </label>
                        <select
                            value={form.status}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    status: e.target.value as Issue["status"],
                                })
                            }
                            className="w-full border border-gray-400 px-3 py-2"
                        >
                            <option value="OPEN">OPEN</option>
                            <option value="IN_PROGRESS">IN_PROGRESS</option>
                            <option value="CLOSED">CLOSED</option>
                        </select>
                    </div>

                    {/* Corrective Action */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Corrective Action (optional)
                        </label>
                        <textarea
                            value={form.correctiveAction}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    correctiveAction: e.target.value,
                                })
                            }
                            className="w-full border border-gray-400 px-3 py-2 min-h-[100px] resize-y"
                            placeholder="Steps taken to prevent recurrence"
                        />
                    </div>

                    {/* Resolution */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Resolution (optional)
                        </label>
                        <textarea
                            value={form.resolution}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    resolution: e.target.value,
                                })
                            }
                            className="w-full border border-gray-400 px-3 py-2 min-h-[100px] resize-y"
                            placeholder="How the issue was resolved"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3 mt-8">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-500 text-white"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="px-4 py-2 bg-blue-700 text-white disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>
            </div>
        </div>
    );
}



