"use client";

import { useState } from "react";
import Link from "next/link";
import { Signin } from "../api/auth"; 

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    

    if (!email.trim() || !password.trim()) {
      return;
    }

    try {
      setLoading(true);
      const data = await Signin(email, password);

      if (data?.success) {
        localStorage.setItem("token", data.token);
        // You can redirect to dashboard here, e.g., router.push("/dashboard")
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0b0711] w-full p-4">
      <div className="flex w-full max-w-[1000px] h-[600px] border rounded-md border-slate-800 p-4">
        
        {/* Left Side: Brand & Feature Highlights */}
        <div className="flex flex-col flex-1 gap-2 items-center justify-center bg-[radial-gradient(ellipse_150%_100%_at_50%_100%,#000000_40%,transparent_80%),linear-gradient(to_bottom,#d8b4fe_0%,#6b21a8_45%,#000000_100%)] h-full rounded-md">
          <div className="flex flex-col items-center justify-center w-3/4 max-w-sm">
            <h2 className="text-2xl text-slate-50 font-semibold">Loveable</h2>
            <h1 className="text-2xl text-slate-50 mt-3 font-medium">Welcome back</h1>
            <span className="text-slate-400 font-light text-center mt-1 text-sm">
              Log in to access your workspace and manage your projects
            </span>

            <div className="mt-8 w-full flex flex-col gap-3">
              <div className="flex flex-row border rounded-md border-gray-400/20 px-4 py-2.5 items-center bg-slate-100/10 backdrop-blur-sm gap-3">
                <span className="flex border border-slate-700 rounded-full w-5 h-5 bg-slate-950 text-slate-50 items-center justify-center text-xs shrink-0">
                  ✓
                </span>
                <span className="text-slate-200 text-sm">Real-time sync across devices</span>
              </div>

              <div className="flex flex-row border rounded-md border-gray-400/20 px-4 py-2.5 items-center bg-slate-100/10 backdrop-blur-sm gap-3">
                <span className="flex border border-slate-700 rounded-full w-5 h-5 bg-slate-950 text-slate-50 items-center justify-center text-xs shrink-0">
                  ✓
                </span>
                <span className="text-slate-200 text-sm">Collaborative workspaces</span>
              </div>

              <div className="flex flex-row border rounded-md border-gray-400/20 px-4 py-2.5 items-center bg-slate-100/10 backdrop-blur-sm gap-3">
                <span className="flex border border-slate-700 rounded-full w-5 h-5 bg-slate-950 text-slate-50 items-center justify-center text-xs shrink-0">
                  ✓
                </span>
                <span className="text-slate-200 text-sm">Secure and encrypted storage</span>
              </div>
            </div>
          </div>
        </div>

         
        <div className="flex flex-col items-center justify-center flex-1 h-full px-4">
          <span className="text-2xl font-semibold text-slate-50">
            Log in to Account
          </span>
          <span className="text-slate-400 text-sm mt-1">
            Enter your credentials to access your account
          </span>

         
          <div className="flex flex-row gap-4 mt-8 w-full max-w-xs">
            <button 
              type="button"
              className="border border-gray-700 flex flex-1 items-center justify-center bg-[#0b0711] text-slate-50 py-2 rounded-md text-sm hover:border-gray-500 transition"
            >
              Google
            </button>
            <button 
              type="button"
              className="border border-gray-700 flex flex-1 items-center justify-center bg-[#0b0711] text-slate-50 py-2 rounded-md text-sm hover:border-gray-500 transition"
            >
              Github
            </button>
          </div>

          {/* Input Fields */}
          <form onSubmit={handleSubmit} className="mt-8 w-full max-w-xs gap-4 flex flex-col">
            <div className="flex flex-col gap-1.5">
              <span className="text-slate-300 text-xs font-medium">Email</span>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#191919] border border-gray-800 text-slate-100 text-sm px-3 py-2 rounded-md w-full focus:outline-none focus:border-gray-600 placeholder:text-gray-600"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center">
                <span className="text-slate-300 text-xs font-medium">Password</span>
                <a href="#" className="text-xs text-purple-400 hover:underline">
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#191919] border border-gray-800 text-slate-100 text-sm px-3 py-2 rounded-md w-full focus:outline-none focus:border-gray-600 placeholder:text-gray-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-slate-50 text-slate-900 rounded-md py-2 w-full font-medium text-sm mt-3 hover:bg-slate-200 transition disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Log In"}
            </button>
          </form>

          {/* Footer switch */}
          <span className="text-slate-400 text-xs mt-6">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-purple-400 font-medium hover:underline">
              Sign up
            </Link>
          </span>
        </div>

      </div>
    </div>
  );
}