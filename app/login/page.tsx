"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import WelcomeHeading from "@/components/WelcomeHeading";
const Login = () => {
  const router = useRouter();
  const [user, setUser] = React.useState({
    email: "",
    password: "",
  })
  // const [userDetails, setUserDetails] = React.useState({})
  const [buttonDisabled, setButtonDisabled] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const onLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/login", user);
      router.replace("/");
      router.refresh()
      console.log("Login success", response);
      toast(response.data.message, {
        duration: 5000, position: 'bottom-center',
        style: {
          color: 'green'
        },
        icon: '✅'
      });

    } catch (error: any) {
      console.log("Login failed", error);
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
    if (user.email.length > 0 && user.password.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);
  // useEffect(() => { localStorage.setItem('userDetails', JSON.stringify(userDetails)) }, [userDetails])

  return (
    <>
      <WelcomeHeading />
      <div className="flex flex-col items-center justify-center">
        <hr />
        <p className="text-[#2A3645] font-bold text-3xl pb-5">Login</p>
        {/* <label htmlFor="email">Email</label> */}
        <input
          required
          className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
          id="email"
          type="text"
          value={user.email}
          onChange={(e) => setUser({ ...user, email: e.target.value })}
          placeholder="Email"
        />
        {/* <label htmlFor="password">Password</label> */}
        <input
          required
          className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
          id="password"
          type="password"
          value={user.password}
          onChange={(e) => setUser({ ...user, password: e.target.value })}
          placeholder="Password"
        />
        <button
          onClick={onLogin}
          className="px-4 py-2 border border-gray-300 rounded-lg mb-4 bg-[#FE9C09] text-white">
          {loading ? "Loading..." : "Login"}
        </button>
        <p>Don't have an account?</p>
        <Link href='/signup' className="underline text-blue-500">Signup</Link>
      </div>
      <Toaster />
    </>
  )

}
export default Login