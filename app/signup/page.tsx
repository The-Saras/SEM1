"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type UserRole = "OPERATOR" | "SUPERVISOR";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("OPERATOR");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
        }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Signup failed");
      }

      router.push("/login");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Signup failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 flex items-center justify-center p-10">
      <div className="w-full max-w-2xl bg-gray-100 border border-gray-400 shadow-[0_0_8px_rgba(0,0,0,0.25)] rounded-sm p-6 font-['Segoe UI',sans-serif]">
        
        {/* Header */}
        <div className="border-b border-gray-400 pb-3 mb-6 flex items-center gap-3">
          <div className="w-6 h-6 bg-blue-700"></div>
          <h1 className="text-xl font-semibold text-gray-800 tracking-wide uppercase">
            Register User
          </h1>
        </div>

        <form
          onSubmit={handleSignup}
          className="text-gray-800 text-sm grid grid-cols-2 gap-x-6 gap-y-5"
        >
          {error && (
            <div className="col-span-2 bg-red-100 border border-red-400 text-red-700 p-2">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-2 border border-gray-500 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border border-gray-500 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          {/* Role */}
          <div>
            <label className="block mb-1 font-medium">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full p-2 border border-gray-500 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
            >
              <option value="OPERATOR">OPERATOR</option>
              <option value="SUPERVISOR">SUPERVISOR</option>
            </select>
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border border-gray-500 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

          {/* Button Row */}
          <div className="col-span-2 flex justify-end gap-3 mt-4">
            <button
              type="reset"
              className="px-5 py-2 bg-gray-300 border border-gray-600 shadow-inner hover:bg-gray-400"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 bg-blue-700 text-white border border-blue-900 shadow hover:bg-blue-800 disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
