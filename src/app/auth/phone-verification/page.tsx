"use client";
import React, { useEffect, useRef, useState } from "react";
import { toast, Toaster } from "sonner";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useRouter } from "next/navigation";
import { sendOtpAction, verifyOtpAction } from "../../../../actions/twilio";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

function Page() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isShaking, setIsShaking] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const markAsVerified = useMutation(api.users.verifyPhone);
  const currentUser = useCurrentUser();
  const router = useRouter();

  const handleChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);

    // Focus last filled input or next empty
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = async () => {
    if (otp.join("").length !== 6) return;

    setIsVerifying(true);
    setError("");

    // Simulate API call
    const res = await onVerifyOtp();

    const isSuccess = res.success;

    if (!isSuccess) {
      setError("Invalid verification code. Please try again.");
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } else {
      console.log("[v0] OTP verified successfully:", otp.join(""));
      // Handle success (e.g., redirect to next page)
      router.push("/");
    }

    setIsVerifying(false);
  };

  const handleResend = async () => {
    if (!canResend) return;

    setCanResend(false);
    setOtp(["", "", "", "", "", ""]);
    setResendTimer(60);
    inputRefs.current[0]?.focus();

    onResendOtp();
  };

  const onResendOtp = React.useCallback(() => {
    try {
      if (!currentUser.user?.phone) {
        setError("User phone number is missing");
        return;
      }
      toast.promise(sendOtpAction(currentUser.user?.phone), {
        loading: "Sending SMS...",
        success: "SMS sent successfully",
        error: "Failed to send SMS",
      });
    } catch (err) {
      console.error("Failed to resend OTP:", err);
    }
  }, [currentUser.user?.phone]);

  const onVerifyOtp = async () => {
    if (!currentUser.user?.phone) {
      setError("User phone number is missing");
      return { success: false, error: "User phone number is missing" };
    }
    const formatedOtp = otp.join("");
    if (formatedOtp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      setIsVerifying(false);
      return { success: false, error: "Invalid OTP length" };
    }
    try {
      const res = await verifyOtpAction(currentUser.user?.phone, formatedOtp);
      if (res.success && res.error) {
        setError(res.error || "Invalid OTP");
        return { success: false, error: res.error || "Invalid OTP" };
      } else if (res.success && !res.error && res.status === "approved") {
        toast.success("Account verified successfully!");
        await markAsVerified();
        return { success: true };
      } else {
        setError(res.error || "Invalid OTP");
        return { success: false, error: res.error || "Invalid OTP" };
      }
    } catch (err) {
      console.log(err);
      setError("Verification failed");
      return { success: false, error: "Verification failed" };
    }
  };

  const hiddenPhone = currentUser.user?.phone
    ? currentUser.user.phone.replace(/^(\d+)(\d{4})$/, "**** **** $2")
    : "";

  const isComplete = otp.every((digit) => digit !== "");

  useEffect(() => {
    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  useEffect(() => {
    if (currentUser.user?.phone) onResendOtp();
  }, [onResendOtp, currentUser.user?.phone]);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Main Content */}
      <main className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
            {/* Icon */}
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
                <svg
                  className="h-8 w-8 text-orange-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>

            {/* Title and Description */}
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-2xl font-bold text-neutral-900">
                Verify your phone number
              </h1>
              <p className="text-balance text-sm text-neutral-600">
                We&apos;ve sent a 6-digit code to{" "}
                <span className="font-semibold text-neutral-900">
                  +63 {hiddenPhone}
                </span>
              </p>
            </div>

            {/* OTP Input */}
            <div className="mb-6">
              <label className="mb-3 block text-sm font-medium text-neutral-700">
                Enter verification code
              </label>
              <div
                className={`flex gap-2 sm:gap-3 ${isShaking ? "animate-shake" : ""}`}
              >
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className={`h-12 w-full rounded-lg border-2 text-center text-lg font-semibold transition-colors focus:outline-none focus:ring-2 sm:h-14 sm:text-xl ${
                      error
                        ? "border-red-500 text-red-900 focus:border-red-500 focus:ring-red-500/20"
                        : "border-neutral-300 text-neutral-900 focus:border-orange-500 focus:ring-orange-500/20"
                    }`}
                    aria-label={`Digit ${index + 1}`}
                    aria-invalid={!!error}
                  />
                ))}
              </div>
              {error && (
                <div className="mt-3 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-800">
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}
            </div>

            {/* Verify Button */}
            <Button
              onClick={handleVerify}
              disabled={!isComplete || isVerifying}
              className="mb-4 h-12 w-full rounded-lg bg-orange-500 text-base font-semibold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isVerifying ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Verifying...
                </span>
              ) : (
                "Verify OTP"
              )}
            </Button>

            {/* Resend Button */}
            <div className="text-center">
              {canResend ? (
                <button
                  onClick={handleResend}
                  className="text-sm font-medium text-orange-600 transition-colors hover:text-orange-700"
                >
                  Resend code
                </button>
              ) : (
                <p className="text-sm text-neutral-600">
                  Resend code in{" "}
                  <span className="font-semibold text-neutral-900">
                    {resendTimer}s
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Help Text
          <p className="mt-6 text-center text-sm text-neutral-600">
            Didn't receive the code?{" "}
            <button className="font-medium text-orange-600 hover:text-orange-700">
              Contact support
            </button>
          </p> */}
        </div>
      </main>
      <Toaster />
    </div>
  );
}

export default Page;
