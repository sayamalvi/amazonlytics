"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import WelcomeHeading from "@/components/WelcomeHeading";

const Signup = () => {
    const router = useRouter();
    const [user, setUser] = React.useState({
        email: "",
        password: "",
        username: "",
    })
    const [buttonDisabled, setButtonDisabled] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

    const onSignup = async () => {
        try {
            setLoading(true);
            const response = await axios.post("/api/users/signup", user);
            console.log("Successfully signed up!", response.data);
            router.push("/login");
            toast(response.data.message, {
                duration: 7000, position: 'bottom-center',
                style: {
                    color: 'green'
                },
                icon: '✅'
            });

        } catch (error: any) {
            console.log("Signup failed", error);
            toast(error.response.data.message, {
                duration: 6000, position: 'bottom-center',
                style: {
                    color: 'white',
                    backgroundColor: 'rgba(255, 0, 0, 0.8)',
                    textAlign: 'center'
                }
            });
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (user.email.length > 0 && user.password.length > 0 && user.username.length > 0) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [user]);


    return (
        <>
            <WelcomeHeading />
            <div className="flex flex-col items-center justify-center">
                <hr />
                <p className="text-[#2A3645] font-bold text-3xl pb-5">Signup</p>
                <input
                    className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
                    id="username"
                    type="text"
                    value={user.username}
                    onChange={(e) => setUser({ ...user, username: e.target.value })}
                    placeholder="Username"
                />
                <input
                    className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
                    id="email"
                    type="text"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    placeholder="Email"
                />
                <input
                    className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
                    id="password"
                    type="password"
                    value={user.password}
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                    placeholder="Password"
                />
                <button
                    onClick={onSignup}
                    className="px-4 py-2 border border-gray-300 rounded-lg mb-4 bg-[#FE9C09] text-white">
                    {loading ? "Loading..." : "Signup"}
                </button>
                <p>Already have an account?</p><Link href='/login' className="underline text-blue-500" shallow={true} replace={true}>Login</Link>
            </div>
            <Toaster />
        </>
    )

}
export default Signup