"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Phone, AlertCircle, CheckCircle } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AddPhoneNumberForm() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const updateUserPhone = useMutation(api.users.updateUserPhone);
  const router = useRouter();
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");

    // Limit to 10 digits for Philippine numbers
    if (value.length > 10) {
      value = value.slice(0, 10);
    }

    // Format as (XXX) XXX-XXXX
    if (value.length > 0) {
      if (value.length <= 3) {
        value = `(${value}`;
      } else if (value.length <= 6) {
        value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
      } else {
        value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6)}`;
      }
    }

    setPhoneNumber(value);
    if (error) setError("");
  };

  const validatePhoneNumber = (phone: string): boolean => {
    const digitsOnly = phone.replace(/\D/g, "");
    return digitsOnly.length === 10;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePhoneNumber(phoneNumber)) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    setIsSubmitting(true);
    setError("");

    // Simulate API call
    toast.promise(updateUserPhone({ phone: phoneNumber.replace(/\D/g, "") }), {
      loading: "Adding phone number...",
      success: () => {
        router.back();
        return "Phone number updated successfully!";
      },
      error: "Failed to update phone number.",
    });

    // Simulate success
    setSuccess(true);
    console.log("[v0] Phone number added:", phoneNumber.replace(/\D/g, ""));

    // Reset form after 2 seconds
    setTimeout(() => {
      setPhoneNumber("");
      setSuccess(false);
    }, 2000);

    setIsSubmitting(false);
  };

  return (
    <>
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-100">
              <Phone className="h-8 w-8 text-orange-600" />
            </div>
          </div>

          {/* Title and Description */}
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-2xl font-bold text-neutral-900">
              Add your phone number
            </h1>
            <p className="text-balance text-sm text-neutral-600">
              We need your phone number to keep your account secure and send
              important updates.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Phone Number Input */}
            <div>
              <label
                htmlFor="phone"
                className="mb-3 block text-sm font-medium text-neutral-700"
              >
                Phone number
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">
                  +63
                </span>
                <input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  placeholder="(XXX) XXX-XXXX"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  disabled={isSubmitting || success}
                  className={`w-full rounded-lg border-2 bg-white py-3 pl-14 pr-4 text-base font-medium transition-colors focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${
                    error
                      ? "border-red-500 text-red-900 focus:border-red-500 focus:ring-red-500/20"
                      : success
                        ? "border-green-500 text-green-900 focus:border-green-500 focus:ring-green-500/20"
                        : "border-neutral-300 text-neutral-900 focus:border-orange-500 focus:ring-orange-500/20"
                  }`}
                  aria-invalid={!!error}
                  aria-describedby={error ? "phone-error" : undefined}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div
                  id="phone-error"
                  className="mt-3 flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-800"
                >
                  <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="mt-3 flex items-start gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-800">
                  <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <p>Phone number added successfully!</p>
                </div>
              )}

              {/* Helper Text */}
              <p className="mt-2 text-xs text-neutral-500">
                Enter your 10-digit Philippine mobile number
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={!phoneNumber || isSubmitting || success}
              className="h-12 w-full rounded-lg bg-orange-500 text-base font-semibold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
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
                  Adding phone number...
                </span>
              ) : success ? (
                <span className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Phone number added
                </span>
              ) : (
                "Add phone number"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 border-t border-neutral-200" />
            <span className="text-xs text-neutral-500">or</span>
            <div className="flex-1 border-t border-neutral-200" />
          </div>

          {/* Skip Option */}
          <button
            onClick={() => router.push("/")}
            disabled={isSubmitting || success}
            className="w-full rounded-lg border-2 border-neutral-300 py-3 text-base font-semibold text-neutral-700 transition-colors hover:border-neutral-400 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Skip for now
          </button>
        </div>

        {/* Help Text */}
        {/* <p className="mt-6 text-center text-sm text-neutral-600">
          Why do we need this?{" "}
          <button className="font-medium text-orange-600 hover:text-orange-700">
            Learn more
          </button>
        </p> */}
      </div>
    </>
  );
}
