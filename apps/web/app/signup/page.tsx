"use client"


import { useRouter } from "next/navigation";
import { useState } from "react";
import { signup } from "../api/auth";
import Image from "next/image";





export default function SignUpPage() {
    const router = useRouter();


    const [userName, setUserName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    // const [showPassword, setShowPassword] = useState(false);


    async function handleSignUp() {

        if (!userName.trim() || !email.trim() || !password.trim()) {
            return;
    }

        try {
            const data = await signup(
                userName,
                email,
                password
            );

            console.log(data);

            if (data.success) {
                localStorage.setItem("token", data.token);
                router.push("/chat");
            }




        } catch (error) {
            console.error("Signup failed", error)

        }

    }



    return (

        <div className="bg-[#646176] min-h-screen flex items-center justify-center">
            <div className="flex flex-row bg-[#2C2736] w-3/4  max-w-5xl overflow-hidden justify-between rounded-4xl h-[650px] ">

                <div className="w-1/2 p-4 h-full">

                    <Image
                        src="/signup.jpg"
                        alt="Signup"
                        width={500}
                        height={500}
                        className="w-full object-cover h-full rounded-2xl"
                    />

                </div>

                <div className="flex flex-col px-12 w-1/2 py-16 mb-">

                    <div className="flex flex-col gap-2 ">

                        <div className="text-3xl text-slate-50 ">Create an account</div>

                        <div className="flex flex-row gap-2">
                            <div className="text-[#51505E] font-semibold">Already have an account?</div>
                            <a className="text-[#51505E] underline" href="">Log in</a>
                        </div>

                    </div>

                    <div className="flex flex-col gap-4 mt-8">


                        <input type="text"
                            className="bg-[#3C364B] w-11/12 py-2 rounded-md text-slate-200 outline-none px-4"
                            placeholder="Username"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                        />


                        <input type="text"
                            className="bg-[#3C364B] w-11/12 py-2 rounded-md text-slate-200 outline-none px-4"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}

                        />

                        <input type="password"
                            placeholder="Enter your passwod"
                            className="bg-[#3C364B] w-11/12 py-2 rounded-md text-slate-200 outline-none px-4"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}

                        />
                    </div>

                    <button onClick={handleSignUp}
                        className="bg-[#8D3ECA] cursor-pointer mt-20 w-11/12 rounded-md py-2 text-slate-50">Create an account</button>

                </div>
            </div>

        </div>

    )


}