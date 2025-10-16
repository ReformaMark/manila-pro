"use client";

import { useConvexAuth } from "convex/react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RoleCheck } from "@/components/auth/logged-in";
import { SignInCard } from "@/components/auth/sign-in-card";
import { SignUpCard } from "@/components/auth/sign-up-card";

export type AuthFlow = "signIn" | "signUp";

const cardVariants = {
  initial: { x: "100%", opacity: 0 },
  animate: {
    x: "0%",
    opacity: 1,
    transition: { duration: 0.8, ease: "easeInOut" },
  },
  exit: {
    x: "-100%",
    opacity: 0,
    transition: { duration: 0.8, ease: "easeInOut" },
  },
};

// const imageVariantsLeft = {
//   initial: { x: "-100%", opacity: 0 },
//   animate: {
//     x: "0%",
//     opacity: 1,
//     transition: { duration: 0.8, ease: "easeInOut" },
//   },
//   exit: {
//     x: "-100%",
//     opacity: 0,
//     transition: { duration: 0.8, ease: "easeInOut" },
//   },
// };

// const imageVariantsRight = {
//   initial: { x: "100%", opacity: 0 },
//   animate: {
//     x: "0%",
//     opacity: 1,
//     transition: { duration: 0.8, ease: "easeInOut" },
//   },
//   exit: {
//     x: "100%",
//     opacity: 0,
//     transition: { duration: 0.8, ease: "easeInOut" },
//   },
// };

export default function AuthScreen() {
  const [state, setState] = useState<AuthFlow>("signIn");
  const { isAuthenticated } = useConvexAuth();

  if (isAuthenticated) return <RoleCheck />;

  const isSignIn = state === "signIn";

  return (
    <div className="bg-none shadow-none rounded-none  border-none relative flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-12 bg-gray-50">
      {/* Layout: conditionally flip image and form order */}
      {isSignIn ? (
        <>
          {/* Form */}
          <AnimatePresence mode="wait">
            <motion.div
              key="signInForm"
              variants={cardVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full lg:w-full  bg-gray-50 z-10"
            >
              <div className="max-w-full md:max-w-2xl lg:max-w-4xl container bg-gray-50">
                <SignInCard setState={setState} />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Image on the right */}
          {/* <AnimatePresence mode="wait">
              <motion.div
                key="signInImage"
                variants={imageVariantsRight}
                initial="initial"
                animate="animate"
                exit="exit"
                className="hidden lg:flex w-1/2 relative h-full overflow-hidden"
              >
                <Image
                  src={Bg}
                  alt="City"
                  fill
                  className="object-cover"
                  priority
                />

                <div className="absolute inset-0 bg-black/40 w-full h-full  font-bold text-xl drop-shadow-lg"></div>

                <motion.div
                  initial={{ x: "-200%", rotate: 95, y: -300 }}
                  animate={{ x: "0%", rotate: 0, rotateX: 0, y: 0 }}
                  transition={{ duration: 2, type: "spring", delay: 0.5 }}
                  className="absolute inset-0 flex items-center justify-start text-white font-bold text-xl drop-shadow-lg text-center"
                >
                  <div className="relative bg-brand-black py-10 px-10 shadow-lg text-5xl rounded-lg after:absolute  after:inset-0 after:bg-white/30 after:content-[''] after:rounded-lg after:-z-10 after:blur-sm">
                    <p
                      className="font-bold inline-block text-5xl ml-2 text-white"
                      style={{
                        filter: "drop-shadow(0 0 2px #000)",
                        color: "#fff",
                      }}
                    >
                      Welcome back to Manila
                      <span
                        className="text-5xl font-extrabold text-brand-orange"
                        style={{
                          filter: "drop-shadow(0 0 2px #000)",
                        }}
                      >
                        Pro
                      </span>
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence> */}
        </>
      ) : (
        <>
          {/* Image on the left */}
          {/* <AnimatePresence mode="wait">
              <motion.div
                key="signUpImage"
                variants={imageVariantsLeft}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ type: "spring" }}
                className="hidden lg:flex w-1/2 relative h-full overflow-hidden"
              >
                <Image
                  src={Agent}
                  alt="City"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-black/40 w-full h-full  font-bold text-xl drop-shadow-lg"></div>
                <motion.div
                  initial={{ x: "100%" }}
                  animate={{ x: "0%" }}
                  transition={{
                    duration: 2,
                    ease: "easeInOut",
                    type: "spring",
                    delay: 0.5,
                  }}
                  className="absolute inset-0 flex items-center justify-end text-white font-bold text-xl drop-shadow-lg text-center"
                >
                  <div className="relative bg-black p-10 shadow-lg text-5xl rounded-lg after:absolute after:inset-0 after:bg-gray-50/50 after:content-[''] after:rounded-lg after:-z-10 after:blur-sm">
                    <p
                      className="font-bold inline-block text-5xl ml-2 text-white"
                      style={{
                        filter: "drop-shadow(0 0 2px #000)",
                        color: "#fff",
                      }}
                    >
                      Join us in Manila
                      <span
                        className="text-5xl font-extrabold text-brand-orange"
                        style={{
                          filter: "drop-shadow(0 0 2px #000)",
                        }}
                      >
                        Pro
                      </span>
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence> */}

          {/* Form */}
          <AnimatePresence mode="wait">
            <motion.div
              key="signUpForm"
              variants={cardVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: "spring" }}
              className="w-full lg:w-full flex items-center justify-center bg-transparent z-10"
            >
              <div className="max-w-full md:max-w-2xl lg:max-w-4xl container bg-gray-50">
                <SignUpCard setState={setState} />
              </div>
            </motion.div>
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
