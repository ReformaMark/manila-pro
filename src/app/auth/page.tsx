"use client"

import { useConvexAuth } from "convex/react";
import { useState } from "react"
import Image from "next/image";
import { motion } from "framer-motion";
import { RoleCheck } from "@/components/auth/logged-in";
import { SignInCard } from "@/components/auth/sign-in-card";
import { SignUpCard } from "@/components/auth/sign-up-card";
import Bg from '@/../public/images/makati.jpg'
export type AuthFlow = "signIn" | "signUp";

const cardVariants = {
    signIn: {
        opacity: 1,
        display: "flex",
        transition: { duration: 0.3 }
    },
    signUp: {
        opacity: 0,
        display: "none",
        transition: { duration: 0.3 }
    }
};

const signUpCardVariants = {
    signIn: {
        opacity: 0,
        display: "none",
        transition: { duration: 0.3 }
    },
    signUp: {
        opacity: 1,
        display: "flex",
        transition: { duration: 0.3 }
    }
};

const imageVariants = {
    signIn: {
        x: "0%",
        transition: { duration: 0.5, ease: "easeInOut" }
    },
    signUp: {
        x: "-100%",
        transition: { duration: 0.5, ease: "easeInOut" }
    }
};

export default function AuthScreen(){
    const [state, setState] = useState<AuthFlow>("signIn")
    const { isAuthenticated } = useConvexAuth()

    if (isAuthenticated) {
        return <RoleCheck />
    }

    return (
        <div className="h-screen w-full overflow-hidden relative">
            <div className="flex flex-row h-full max-lg:items-center max-lg:justify-center">
                {/* Sign In Card */}
                <motion.div
                    className="lg:w-1/2 flex items-center justify-center"
                    animate={state}
                    variants={cardVariants}
                >
                    <div className="w-full sm:w-[350px] md:w-[400px] lg:w-[420px]">
                        <SignInCard setState={setState} />
                    </div>
                </motion.div>

                {/* Sliding Image */}
                <motion.div
                    className="hidden absolute w-1/2 h-full lg:flex items-center justify-center p-[20px]"
                    style={{ right: "0%" }}
                    animate={state}
                    variants={imageVariants}
                >
                    <Image
                        src={Bg}
                        alt="auth-image"
                        width={500}
                        height={500}
                        className="w-full h-full object-cover rounded-[25px]"
                        priority
                    />
                </motion.div>

                {/* Sign Up Card */}
                <motion.div
                    className="lg:w-1/2 flex items-center justify-center lg:ml-auto"

                    animate={state}
                    variants={signUpCardVariants}
                >
                    <div className="w-full sm:w-[350px] md:w-[400px] lg:w-[420px]">
                        <SignUpCard setState={setState} />
                    </div>
                </motion.div>
            </div>
        </div>
    )
}