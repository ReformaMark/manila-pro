"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import {
  AlertCircle,
  Eye,
  EyeOff,
  Lock,
  Mail,
  MapPin,
  TriangleAlertIcon,
  User,
} from "lucide-react";

// import { useRouter } from "next/navigation"
import { useState } from "react";
import { AuthFlow } from "./auth-screen";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Label } from "../ui/label";
import { ConvexError } from "convex/values";
import { useAuthActions } from "@convex-dev/auth/react";

export const SignUpCard = ({
  setState,
}: {
  setState: (state: AuthFlow) => void;
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    city: "",
    street: "",
    barangay: "",
    houseNumber: "",
  });

  const { signIn } = useAuthActions();
  const createBuyer = useMutation(api.users.createBuyer);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };
  //   const newPassword = e.target.value;
  //   setPassword(newPassword);

  //   if (newPassword.length > 0 && newPassword.length < 8) {
  //     setPasswordError("Password must be at least 8 characters long");
  //   } else {
  //     setPasswordError("");
  //   }

  //   // Check confirm password match if confirm password exists
  //   if (confirmPassword && newPassword !== confirmPassword) {
  //     setConfirmPasswordError("Passwords do not match");
  //   } else {
  //     setConfirmPasswordError("");
  //   }
  // };

  // const handleConfirmPasswordChange = (
  //   e: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   const newConfirmPassword = e.target.value;
  //   setConfirmPassword(newConfirmPassword);

  //   if (password && newConfirmPassword !== password) {
  //     setConfirmPasswordError("Passwords do not match");
  //   } else {
  //     setConfirmPasswordError("");
  //   }
  // };

  const onSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    if (!validateForm()) {
      setIsLoading(false);
      return;
    }
    try {
      const res = await createBuyer({
        fname: formData.firstName,
        lname: formData.lastName,
        email: formData.email,
        password: formData.password,
        contact: formData.phone,
        houseNumber: formData.houseNumber,
        street: "",
        barangay: "",
        city: formData.city,
        phoneVerified: false,
        phone: formData.phone,
      });
      if (res.success) {
        await signIn("password", {
          email: formData.email,
          password: formData.password,
          flow: "signUp",
        });
      } else {
        setError("Failed to create account");
      }
    } catch (error: unknown) {
      let errorMessage = "Unexpected error occurred";

      if (error instanceof ConvexError) {
        console.log("it is a convex error");
        const data = error.data as { code?: string; message?: string };
        errorMessage = data.message ?? "Unexpected error occurred";

        if (data.code === "EMAIL_EXISTS") {
          setErrors({ email: "This email is already registered" });
          return;
        }
        if (data.code === "PHONE_EXIST") {
          setErrors({ phone: "This phone number is already being used." });
          return;
        }
      }

      setError(errorMessage || "Failed to create account");
    } finally {
      setIsLoading(false);
    }
  };
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one uppercase letter";
    } else if (!/[a-z]/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one lowercase letter";
    } else if (!/[0-9]/.test(formData.password)) {
      newErrors.password = "Password must contain at least one number";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      newErrors.password =
        "Password must contain at least one special character";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^9\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits and start with 9";
    }

    if (!formData.city) newErrors.city = "City is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-primary">Sign up to continue</CardTitle>
        <CardDescription>All fields are required to continue</CardDescription>
      </CardHeader>
      {!!error && (
        <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
          <TriangleAlertIcon className="size-4" />
          {error}
        </div>
      )}
      <CardContent className="space-y-5 px-0 pb-0">
        <form onSubmit={onSignUp} className="space-y-5">
          {/* Email */}
          <div className="space-y-2">
            {/* Email */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-sm font-medium text-gray-700"
              >
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className={`pl-10 h-12 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-gray-700"
              >
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className={`pl-10 pr-10 h-12 ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-gray-700"
              >
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    handleChange("confirmPassword", e.target.value)
                  }
                  className={`pl-10 pr-10 h-12 ${errors.confirmPassword ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="firstName"
                  className="text-sm font-medium text-gray-700"
                >
                  First Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    className={`pl-10 h-12 ${errors.firstName ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                  />
                </div>
                {errors.firstName && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.firstName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="lastName"
                  className="text-sm font-medium text-gray-700"
                >
                  Last Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                    className={`pl-10 h-12 ${errors.lastName ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                  />
                </div>
                {errors.lastName && (
                  <p className="text-xs text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.lastName}
                  </p>
                )}
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="text-sm font-medium text-gray-700"
              >
                Phone Number
              </Label>
              <div className="relative flex items-center">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
                  (+63)
                </span>
                <Input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder=""
                  value={formData.phone}
                  onChange={(e) => {
                    // Only allow numbers
                    const value = e.target.value.replace(/\D/g, "");
                    handleChange("phone", value);
                  }}
                  className={`pl-16 h-12 ${errors.phone ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
              </div>
              {errors.phone && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.phone}
                </p>
              )}
            </div>

            {/* City */}
            <div className="space-y-2">
              <Label
                htmlFor="city"
                className="text-sm font-medium text-gray-700"
              >
                City
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  id="city"
                  type="text"
                  placeholder="Manila"
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  className={`pl-10 h-12 ${errors.city ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
              </div>
              {errors.city && (
                <p className="text-xs text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.city}
                </p>
              )}
            </div>
          </div>
          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-12 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base mt-6"
          >
            {isLoading ? "Creating Account..." : "Continue"}
          </Button>
        </form>
        <Separator />
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <span
              className="text-primary hover:underline cursor-pointer"
              onClick={() => setState("signIn")}
            >
              Sign in
            </span>
          </p>

          {/* <p className="block lg:hidden text-sm text-muted-foreground">
                        Changed your mind? <span
                            className="text-primary hover:underline cursor-pointer"
                            onClick={() => router.push("/")}>
                            Go back to homepage.
                        </span>
                    </p> */}
        </div>
      </CardContent>
    </Card>
  );
};
