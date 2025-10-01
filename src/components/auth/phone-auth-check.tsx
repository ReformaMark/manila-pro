"use client";
import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { TriangleAlertIcon } from "lucide-react";
import { sendSms } from "../../../actions/twilio";
import { useRouter } from "next/navigation";

function PhoneAuthCheck({ contact }: { contact: string }) {
  const [error, setError] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const saveOTP = useMutation(api.otps.saveOTP);
  const verifyOtp = useMutation(api.otps.verifyOtp);
  const router = useRouter();

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const onResendOtp = async () => {
    try {
      // Call your Convex mutation again to send a new OTP
      const result = await saveOTP({ phone: contact });
      if (result.code) {
        const message = `Your ManilaPro account verification code is ${result.code}. Use this code to verify your phone number.`;
        toast.promise(sendSms(contact, message), {
          loading: "Sending SMS...",
          success: "SMS sent successfully",
          error: "Failed to send SMS",
        });
      }

      // Reset cooldown to 30 seconds
      setResendCooldown(30);
    } catch (err) {
      console.error("Failed to resend OTP:", err);
    }
  };

  const onVerifyOtp = async () => {
    try {
      const res = await verifyOtp({ phone: contact, code: otp });
      if (res.success) {
        // ✅ Now create the account

        toast.success("Account verified successfully!");
        router.push("/");
      } else {
        setError(res.message || "Invalid OTP");
      }
      console.log(res);
    } catch (err) {
      console.log(err);
      setError("Verification failed");
    }
  };

  return (
    <div className="space-y-4">
      {!!error && (
        <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
          <TriangleAlertIcon className="size-4" />
          {error}
        </div>
      )}
      <Input
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
        type="number"
      />
      <Button onClick={onVerifyOtp} className="w-full">
        Verify OTP
      </Button>

      <div className="flex justify-between items-center">
        <Button
          variant="outline"
          disabled={resendCooldown > 0}
          onClick={onResendOtp}
          className="w-full"
        >
          {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
        </Button>
      </div>
    </div>
  );
}

export default PhoneAuthCheck;
