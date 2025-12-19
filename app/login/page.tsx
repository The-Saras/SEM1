"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Login failed");
      }

      const data = await res.json();

      // 🔐 Store JWT
      localStorage.setItem("token", data.token);

      // (optional) store user for demo
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ Redirect after login
      router.push("/dashboard"); // change if needed
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    }
  };

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

        <form
          onSubmit={handleLogin}
          className="text-gray-800 text-sm grid grid-cols-1 gap-y-5"
        >
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 p-2">
              {error}
            </div>
          )}

          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border border-gray-500 bg-white focus:outline-none focus:ring-1 focus:ring-blue-600"
            />
          </div>

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
          <div className="flex justify-end gap-3 mt-4">
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
              {loading ? "Logging in..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
