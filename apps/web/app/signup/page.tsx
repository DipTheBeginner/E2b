"use client"

import { useState } from "react";
import { Signup } from "../api/auth";





export default function SignupPage() {


  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");


  async function handleSubmit() {

    if (!email.trim() || !username.trim() || !password.trim()) {
      return;
    }


    try {

      const data = await Signup(username, email, password)

      if (data.success) {
        localStorage.setItem("token", data.token);
        
      }
      
    } catch (error) {
      console.log(error)
    }

    
    
  }
  


  
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0b0711] w-full ">
      <div className="flex w-full max-w-[1000px] h-[600px] border rounded-md border-slate-800 p-4">
        <div className="flex flex-col flex-1 gap-2 items-center justify-center bg-[radial-gradient(ellipse_150%_100%_at_50%_100%,#000000_40%,transparent_80%),linear-gradient(to_bottom,#d8b4fe_0%,#6b21a8_45%,#000000_100%)] w-[55%] h-full rounded-md">
          <div className="flex flex-col items-center justify-center w-1/2">
            <h2 className="text-2xl text-slate-50 font-semibold">Loveable</h2>
            <h1 className="text-2xl text-slate-50 mt-3">Get started with us</h1>
            <span className="text-slate-400 font-light text-center mt-1">
              Complete these easy steps to register your account
            </span>

            <div className="mt-8 w-full flex flex-col mx-auto max-w-md gap-3">
              <div className="flex flex-row border rounded-md border-gray-400/20  px-4 py-2.5 items-center bg-slate-100/10 backdrop-blur-sm gap-3">
                <span className="flex borded rounded-full w-4 h-4 bg-slate-950 text-slate-50 items-center justify-center text-xs">
                  1
                </span>
                <span className="text-slate-200 text-sm">sign up your account</span>
              </div>

              <div className="flex flex-row border rounded-md border-gray-400/20  px-4 py-2.5 items-center bg-slate-100/10 backdrop-blur-sm gap-3">
                <span className="flex borded rounded-full w-4 h-4 bg-slate-950 text-slate-50 items-center justify-center text-xs">
                  2
                </span>
                <span className="text-slate-200 text-sm">setup your workspace</span>
              </div>

              <div className="flex flex-row border rounded-md border-gray-400/20  px-4 py-2.5 items-center bg-slate-100/10 backdrop-blur-sm gap-3">
                <span className="flex borded rounded-full w-4 h-4 bg-slate-950 text-slate-50 items-center justify-center text-xs">
                  3
                </span>
                <span className="text-slate-200 text-sm">set up your profile</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center  flex-1 ">
          <span className="text-2xl font-semibold text-slate-50 ">
            Sign up Account
          </span>
          <span className="text-slate-400 text-sm mt-1">
            Enter your personal data to create your account
          </span>

          <div className=" flex flex-row gap-4 mt-9 w-full max-w-xs ">
            <button className="border border-gray-700 flex flex-1 items-center justify-center bg-[#0b0711] text-slate-50 py-2 rounded-md text-sm hover:border-gray-500 transition">
              
              Google
            </button>
            <button className="border border-gray-700 flex flex-1 items-center justify-center bg-[#0b0711] text-slate-50 py-2 rounded-md text-sm hover:border-gray-500 transition">
              
              Github
            </button>
          </div>

          <div className="mt-10 w-full max-w-xs gap-4 flex flex-col">
            <div className="flex flex-col gap-2">
              <span className="text-slate-300 text-xs font-medium">User Name</span>
              <input
                type="text"
                className="bg-[#191919] w-full py-1 rounded-md text-slate-200"
                onChange={(e)=>setUsername(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <span className="text-slate-300 text-xs font-medium">Email</span>
              <input
                type="text"
                className="bg-[#191919] w-full py-1 rounded-md text-slate-200"
                onChange={(e)=>setEmail(e.target.value)}
              />
            </div>


            <div className="flex flex-col gap-2">
              <span className="text-slate-300 text-xs font-medium">Password</span>
              <input
                type="text"
                className="bg-[#191919] w-full py-1 rounded-md text-slate-200"
                onChange={(e)=>setPassword(e.target.value)}
              />
            </div>

            <button onClick={handleSubmit} className="bg-slate-50 rounded-md py-2 w-full font-medium text-md mt-4">Sign Up</button>


            

          </div>
          <span className="text-slate-400 text-xs mt-6">Already have an account ? Log in</span>
        </div>
      </div>
    </div>
  );
}
