"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
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
            console.log("Signup success", response.data);
            router.push("/login");
            toast(response.data.message, {
                duration: 6000, position: 'bottom-center',
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
            <div className="flex flex-col items-center justify-center min-h-screen py-2">
                <hr />
                <label htmlFor="username">Username</label>
                <input
                    className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
                    id="username"
                    type="text"
                    value={user.username}
                    onChange={(e) => setUser({ ...user, username: e.target.value })}
                    placeholder="username"
                />
                <label htmlFor="email">email</label>
                <input
                    className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
                    id="email"
                    type="text"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    placeholder="email"
                />
                <label htmlFor="password">password</label>
                <input
                    className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
                    id="password"
                    type="password"
                    value={user.password}
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                    placeholder="password"
                />
                <button
                    onClick={onSignup}
                    className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600">Signup</button>
                <p>Already have an account?</p><Link href='/login' className="underline text-blue-500">Login</Link>
            </div>
            <Toaster />
        </>
    )

}
export default Signup