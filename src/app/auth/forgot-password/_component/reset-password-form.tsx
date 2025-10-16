"use client";
import { useAction } from "convex/react";
import React from "react";
import { api } from "../../../../../convex/_generated/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Step } from "../page";
import { toast } from "sonner";

export interface UserdataType {
  email: string;
  phone: string;
  newPassword: string;
  confirmPassword: string;
  showPassword: boolean;
  showConfirmPassword: boolean;
  error: string;
}

interface ResetPasswordFormProps {
  token: string;
  userData: UserdataType;
  handleUserDataChange: (
    field: string,
    value: string | number | boolean
  ) => void;
  isLoading: boolean;
  setStep: (step: Step) => void;
  setIsLoading: (isLoading: boolean) => void;
}
function ResetPasswordForm({
  token,
  userData,
  handleUserDataChange,
  isLoading,
  setStep,
  setIsLoading,
}: ResetPasswordFormProps) {
  const resetPassword = useAction(api.passwordResetActions.resetPassword);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    handleUserDataChange("error", "");

    if (userData.newPassword !== userData.confirmPassword) {
      handleUserDataChange("error", "Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (userData.newPassword.length < 6) {
      handleUserDataChange("error", "Password must be at least 6 characters");
      setIsLoading(false);
      return;
    }

    try {
      if (!token) {
        setStep("email");
        return;
      }

      await resetPassword({
        token: token,
        email: userData.email,
        newPassword: userData.newPassword,
      });

      setStep("success");
    } catch (error) {
      console.log(error);
      toast.error("Invalid reset password session.");
      setStep("email");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-12 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl text-balance">
            Create new password
          </CardTitle>
          <CardDescription className="text-base leading-relaxed">
            Enter a new password for your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordReset} className="space-y-6">
            {userData.error && (
              <Alert variant="destructive">
                <AlertDescription>{userData.error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="new-password">New password</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={userData.showPassword ? "text" : "password"}
                  placeholder="Enter new password"
                  value={userData.newPassword}
                  autoComplete={userData.newPassword}
                  onChange={(e) =>
                    handleUserDataChange("newPassword", e.target.value)
                  }
                  required
                  disabled={isLoading}
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleUserDataChange("showPassword", !userData.showPassword)
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {userData.showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm password</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={userData.showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={userData.confirmPassword}
                  autoComplete={userData.confirmPassword}
                  onChange={(e) =>
                    handleUserDataChange("confirmPassword", e.target.value)
                  }
                  required
                  disabled={isLoading}
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() =>
                    handleUserDataChange(
                      "showConfirmPassword",
                      !userData.showConfirmPassword
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {userData.showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
              disabled={isLoading}
              size="lg"
            >
              {isLoading ? "Resetting password..." : "Reset password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default ResetPasswordForm;
