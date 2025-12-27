"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function HomePage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100 relative">
      <UserInfo />

      {/* HERO */}
      <section className="relative overflow-hidden">
        {/* 🔴 FIX: overlay does NOT block clicks */}
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_top,white,transparent_60%)]" />

        <div className="relative max-w-6xl mx-auto px-6 py-28 text-center">
          <h1 className="text-5xl md:text-6xl font-bold uppercase tracking-wide">
            Know What’s Broken.
            <br />
            <span className="text-blue-500">Fix It Faster.</span>
          </h1>

          <p className="mt-6 text-lg text-gray-300 max-w-3xl mx-auto">
            A structured issue tracking platform designed for machines, operators, and
            supervisors. Log issues, attach supporting evidence, monitor resolution
            progress, and ensure effective prevention of recurring problems.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-5">
            {isLoggedIn && (
              <button
                onClick={() => router.push("/dashboard")}
                className="px-7 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg"
              >
                Dashboard
              </button>
            )}

            {!isLoggedIn && (
              <>
                <button
                  onClick={() => router.push("/login")}
                  className="px-7 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold shadow-lg"
                >
                  Login
                </button>

                <button
                  onClick={() => router.push("/signup")}
                  className="px-7 py-3 border border-gray-500 hover:bg-gray-800 font-semibold"
                >
                  Signup
                </button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-t border-gray-700 bg-gray-900">
        <div className="max-w-6xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Faster Detection"
            value="↓ Downtime"
            desc="Spot machine issues the moment they occur."
          />
          <StatCard
            title="Clear Ownership"
            value="↑ Accountability"
            desc="Operators report, supervisors resolve."
          />
          <StatCard
            title="Evidence Driven"
            value="📸 Visual Proof"
            desc="Images, corrective actions, and resolutions."
          />
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-gray-950 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-10">
          <Feature
            title="Designed for the Shop Floor"
            desc="No clutter. No confusion. Create and update issues in seconds."
          />
          <Feature
            title="Built for Supervisors"
            desc="Track issue lifecycle, corrective actions, and closure history."
          />
          <Feature
            title="Visual Proof"
            desc="Attach images directly to issues — see the problem, not guesses."
          />
          <Feature
            title="Prevent Repeat Failures"
            desc="Document corrective actions so the same issue never happens twice."
          />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black border-t border-gray-800 py-6 text-center text-sm text-gray-400">
        Industrial Issue Tracking System • Built for clarity, speed & control
      </footer>
    </div>
  );
}

/* ---------------- Components ---------------- */

function StatCard({
  title,
  value,
  desc,
}: {
  title: string;
  value: string;
  desc: string;
}) {
  return (
    <div className="border border-gray-700 bg-gray-800 p-6 shadow-md">
      <h4 className="text-sm uppercase text-gray-400">{title}</h4>
      <div className="text-2xl font-bold text-blue-400 mt-2">{value}</div>
      <p className="text-gray-300 text-sm mt-3">{desc}</p>
    </div>
  );
}

function Feature({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  return (
    <div className="border border-gray-800 bg-gray-900 p-6 shadow-sm">
      <h3 className="text-xl font-semibold uppercase mb-2">{title}</h3>
      <p className="text-gray-400">{desc}</p>
    </div>
  );
}

/* ---------------- User Info ---------------- */

function UserInfo() {
  const router = useRouter();

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "null")
      : null;

  if (!user) return null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    router.replace("/login");
    router.refresh();
  };

  return (
    <div className="absolute top-6 right-6 z-50 flex items-center gap-4 border border-gray-700 bg-gray-900 px-4 py-2 shadow-md">
      {/* Avatar */}
      <div className="w-9 h-9 bg-blue-600 flex items-center justify-center font-bold text-white uppercase">
        {user.name?.[0]}
      </div>

      {/* User info */}
      <div className="text-left leading-tight">
        <div className="text-sm font-semibold text-white">{user.name}</div>
        <div className="text-xs text-gray-400">{user.email}</div>
      </div>

      {/* Divider */}
      <div className="h-8 w-px bg-gray-700" />

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="text-sm text-red-400 hover:text-red-300 font-medium cursor-pointer"
      >
        Logout
      </button>
    </div>
  );
}
