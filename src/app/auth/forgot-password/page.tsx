"use client";

import type React from "react";
import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft, CheckCircle2 } from "lucide-react";
import { sendOtpAction } from "../../../../actions/twilio";
import { toast } from "sonner";
import { useAction, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import ResetPasswordForm from "./_component/reset-password-form";
import { cn } from "@/lib/utils";
import OtpForm from "./_component/otp-form";
export type Step = "email" | "otp" | "reset" | "success";

export default function ForgotPasswordForm() {
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [step, setStep] = useState<Step>("email");
  const [resetToken, setResetToken] = useState<string | null>(null);
  const [userData, setUserData] = useState({
    email: "",
    phone: "",
    newPassword: "",
    confirmPassword: "",
    showPassword: false,
    showConfirmPassword: false,
    error: "",
  });
  const [verificationData, setVerificationData] = useState({
    isVerifying: false,
    resendTimer: 60,
    canResend: false,
    otp: ["", "", "", "", "", ""],
    error: "",
  });

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getUserPhone = useMutation(api.users.getUserPhoneUsingEmail);
  const requestReset = useAction(api.passwordResetActions.requestPasswordReset);

  const handleUserDataChange = (
    field: string,
    value: string | number | boolean
  ) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };
  const handleVerificationDataChange = (
    field: string,
    value: string | number | boolean | string[]
  ) => {
    setVerificationData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    handleUserDataChange("error", "");
    if (userData.email) {
      handleVerificationDataChange("otp", ["", "", "", "", "", ""]);
      setResendTimer(60);
      setCanResend(false);
      inputRefs.current[0]?.focus();

      const phoneNumber = await getUserPhone({ email: userData.email });

      if (phoneNumber === null) {
        handleUserDataChange("error", "Invalid Email");
        setIsLoading(false);
        return;
      }
      if (phoneNumber) {
        console.log(phoneNumber);
        handleUserDataChange("phone", phoneNumber);

        const isSuccess = await onResendOtp(phoneNumber);
        setIsLoading(false);

        if (!isSuccess) return;

        //for password reset token
        try {
          const data = await requestReset({ email: userData.email });
          if (data.result && data.success) {
            setResetToken(data.result.token);
          }
          setStep("otp");
          return;
        } catch (error) {
          console.log(error);
          toast.error("Something went wrong. Please try again.");
        }
      }
      setStep("reset");
      setIsLoading(false);
      console.log(step, userData);
    }
  };

  const onResendOtp = useCallback(async (phoneNumber: string) => {
    try {
      if (!phoneNumber) {
        handleUserDataChange("error", "User phone number is missing");
        return;
      }
      toast.promise(sendOtpAction(phoneNumber), {
        loading: "Sending SMS...",
        success: "SMS sent successfully",
        error: "Failed to send SMS",
      });

      return { succes: true };
    } catch (err) {
      console.error("Failed to resend OTP:", err);
      return { succes: false };
    }
  }, []);

  useEffect(() => {
    setResendTimer(0);
    setCanResend(true);
  }, []);

  useEffect(() => {
    if (step === "email" && resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer, step, setCanResend, setResendTimer]);

  if (step === "success") {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-12 bg-gray-50">
        <Card className="max-w-full md:max-w-2xl lg:max-w-4xl  bg-transparent shadow-none rounded-none  border-none">
          <CardHeader className="space-y-2 text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
              <CheckCircle2 className="h-6 w-6 text-accent" />
            </div>
            <CardTitle className="text-2xl">
              Password reset successful
            </CardTitle>
            <CardDescription className="text-base">
              Your password has been successfully reset. You can now sign in
              with your new password.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              asChild
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              size="lg"
            >
              <Link href="/auth">Sign in to your account</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === "reset" && resetToken) {
    return (
      <ResetPasswordForm
        token={resetToken}
        userData={userData}
        handleUserDataChange={handleUserDataChange}
        isLoading={isLoading}
        setStep={setStep}
        setIsLoading={setIsLoading}
      />
    );
  }
  if (step === "otp") {
    return (
      <OtpForm
        verificationData={verificationData}
        handleVerificationDataChange={handleVerificationDataChange}
        setIsLoading={setIsLoading}
        inputRefs={inputRefs}
        setStep={setStep}
        userData={userData}
        handleUserDataChange={handleUserDataChange}
        onResendOtp={onResendOtp}
        setCanResend={setCanResend}
        setResendTimer={setResendTimer}
        canResend={canResend}
        isLoading={isLoading}
        resendTimer={resendTimer}
        step={step}
      />
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-12 bg-gray-50">
      <Card className="max-w-full md:max-w-2xl lg:max-w-4xl  bg-transparent shadow-none rounded-none  border-none">
        <CardHeader className="space-y-2">
          <CardTitle className="text-primary text-3xl md:text-5xl font-bold  mb-4">
            Reset your password
          </CardTitle>
          <CardDescription className="text-lg md:text-xl text-gray-700">
            Enter your email address and we&apos;ll send you a verification
            code.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            {userData.error && (
              <Alert variant="destructive">
                <AlertDescription className="flex items-center gap-x-3">
                  <AlertCircle className="text-red-500" /> {userData.error}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label
                htmlFor="email"
                className={cn(userData.error && " text-red-500")}
              >
                Email address
              </Label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={userData.email}
                onChange={(e) => handleUserDataChange("email", e.target.value)}
                required
                disabled={isLoading}
                className={cn(
                  userData.error && "o outline outline-red-600 outline-1",
                  "px-4 py-2 h-12 auth-input-field"
                )}
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base mt-6"
              disabled={isLoading || !canResend}
              size="lg"
            >
              {isLoading
                ? "Sending code..."
                : canResend
                  ? "Send verification code"
                  : `Wait for ${resendTimer}s`}
            </Button>

            <div className="text-center">
              <Link
                href="/auth"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
