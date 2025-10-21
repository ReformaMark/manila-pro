import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { AlertCircle, ArrowLeft } from "lucide-react";
import React, { RefObject, useEffect, useRef } from "react";
import { Step } from "../page";
import { UserdataType } from "./reset-password-form";
import { verifyOtpAction } from "../../../../../actions/twilio";
import { toast } from "sonner";

interface VerificationDataTypes {
  isVerifying: boolean;
  resendTimer: number;
  canResend: boolean;
  otp: string[];
  error: string;
}
interface OtpFormProps {
  verificationData: VerificationDataTypes;
  handleVerificationDataChange: (
    field: string,
    value: string | number | boolean | string[]
  ) => void;
  setIsLoading: (isLoading: boolean) => void;
  inputRefs: RefObject<(HTMLInputElement | null)[]>;
  setStep: (step: Step) => void;
  userData: UserdataType;
  handleUserDataChange: (
    field: string,
    value: string | number | boolean
  ) => void;
  onResendOtp: (phone: string) => void;
  setCanResend: (canResend: boolean) => void;
  setResendTimer: (resendTimer: number) => void;
  canResend: boolean;
  isLoading: boolean;
  resendTimer: number;
  step: Step;
}

function OtpForm({
  verificationData,
  handleVerificationDataChange,
  setIsLoading,
  inputRefs,
  setStep,
  userData,
  handleUserDataChange,
  onResendOtp,
  setCanResend,
  setResendTimer,
  canResend,
  isLoading,
  resendTimer,
  step,
}: OtpFormProps) {
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(0, 1);
    }

    const newOtp = [...verificationData.otp];
    newOtp[index] = value;
    handleVerificationDataChange("otp", newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !verificationData.otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    handleVerificationDataChange("error", "");

    const res = await onVerifyOtp();
    const isSuccess = res.success;
    if (!isSuccess) {
      handleVerificationDataChange(
        "error",
        "Invalid verification code. Please try again."
      );
      handleVerificationDataChange("otp", ["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
      setIsLoading(false);
    } else {
      console.log(
        "[v0] OTP verified successfully:",
        verificationData.otp.join("")
      );
      setIsLoading(false);
      setStep("reset");
    }

    handleVerificationDataChange("isVerifying", false);
  };

  const onVerifyOtp = async () => {
    if (!userData.phone) {
      handleUserDataChange("error", "User phone number is missing");
      return { success: false, error: "User phone number is missing" };
    }
    const formatedOtp = verificationData.otp.join("");
    if (formatedOtp.length !== 6) {
      handleVerificationDataChange("error", "Please enter a valid 6-digit OTP");
      handleVerificationDataChange("isVerifying", false);
      return { success: false, error: "Invalid OTP length" };
    }
    try {
      const res = await verifyOtpAction(userData.phone, formatedOtp);
      if (res.success && res.error) {
        handleVerificationDataChange("error", res.error || "Invalid OTP");
        return { success: false, error: res.error || "Invalid OTP" };
      } else if (res.success && !res.error && res.status === "approved") {
        toast.success("OTP verified! Proceed to reset your password.");
        return { success: true };
      } else {
        handleVerificationDataChange("error", res.error || "Invalid OTP");
        return { success: false, error: res.error || "Invalid OTP" };
      }
    } catch (err) {
      console.log(err);
      handleVerificationDataChange("error", "Verification failed");
      return { success: false, error: "Verification failed" };
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    handleVerificationDataChange("error", "");
    handleVerificationDataChange("otp", ["", "", "", "", "", ""]);
    setCanResend(false);
    setResendTimer(60);

    await onResendOtp(userData.phone);
    setIsLoading(false);
  };

  const hiddenPhone = userData.phone
    ? userData.phone.replace(/^(\d+)(\d{4})$/, "**** **** $2")
    : "";

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer, step, setCanResend, setResendTimer]);

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-12 bg-gray-50">
      <Card className="max-w-full md:max-w-2xl lg:max-w-4xl  bg-transparent shadow-none rounded-none  border-none">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-2xl text-balance">
            Enter verification code
          </CardTitle>
          <CardDescription className="text-base leading-relaxed">
            We&apos;ve sent a 6-digit code to{" "}
            <span className="font-semibold text-neutral-900">
              +63 {hiddenPhone}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleOtpSubmit} className="space-y-6">
            {verificationData.error && (
              <Alert variant="destructive">
                <AlertDescription className="flex items-center gap-x-3">
                  <AlertCircle className="text-red-600" />{" "}
                  {verificationData.error}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label>Verification code</Label>
              <div className="flex gap-2 justify-between">
                {verificationData.otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      otpRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    disabled={isLoading}
                    className="h-14 md:h-20 lg:h-26 auth-input-field w-full text-center text-lg font-semibold"
                    aria-label={`Digit ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full text-lg md:text-xl h-12 rounded-xl bg-primary text-white font-semibold hover:bg-primary-hover transition-colors shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed mt-5"
              disabled={
                isLoading || verificationData.otp.some((digit) => !digit)
              }
              size="lg"
            >
              {isLoading ? "Verifying..." : "Verify code"}
            </Button>

            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Didn&apos;t receive the code?{" "}
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={isLoading}
                    className="text-accent hover:underline font-medium"
                  >
                    Resend
                  </button>
                ) : (
                  <p className="text-sm text-neutral-600">
                    Resend code in{" "}
                    <span className="font-semibold text-neutral-900">
                      {resendTimer}s
                    </span>
                  </p>
                )}
              </p>

              <button
                type="button"
                onClick={() => setStep("email")}
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4" />
                Change email
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default OtpForm;
