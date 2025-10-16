import { useState } from "react";
import { AuthFlow } from "./auth-screen";
import { useAuthActions } from "@convex-dev/auth/react";
import { Eye, EyeOff, Lock, Mail, TriangleAlertIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import Link from "next/link";

export const SignInCard = ({
  setState,
}: {
  setState: (state: AuthFlow) => void;
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [pending, setPending] = useState<boolean>(false);
  const { signIn } = useAuthActions();

  const onSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (pending) return;

    setPending(true);
    setError("");

    try {
      await signIn("password", {
        email,
        password,
        flow: "signIn",
      });
      setError("");
    } catch (error) {
      console.error("Sign in error:", error);

      if (error instanceof Error) {
        if (error.message.includes("Failed to fetch")) {
          setError(
            "Connection error. Please check your internet connection and try again."
          );
        } else {
          setError("Invalid email or password");
        }
      } else {
        setError("Invalid email or password");
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <Card className="w-full h-full md:p-8 z-50 bg-none shadow-none rounded-none bg-transparent  border-none">
      <CardHeader className="px-0 pt-0 text-center">
        <CardTitle className="text-primary text-3xl md:text-5xl font-bold  mb-4">
          Welcome to ManilaPro
        </CardTitle>
        <CardDescription className="text-lg md:text-xl text-gray-700">
          Sign in to get started
        </CardDescription>
      </CardHeader>
      {!!error && (
        <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
          <TriangleAlertIcon className="size-4" />
          {error}
        </div>
      )}
      <CardContent className="space-y-5 px-0 pb-0">
        <form onSubmit={onSignIn} className="flex flex-col gap-y-5">
          <div className="">
            <Label>Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                disabled={pending}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                type="email"
                required
                className="px-10 h-12 w-full rounded-xl bg-white border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-shadow shadow-sm hover:shadow"
              />
            </div>
          </div>
          <div className="relative">
            <Label>Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                disabled={pending}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                type={showPassword ? "text" : "password"}
                required
                className="px-10 h-12 w-full rounded-xl bg-white border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-shadow shadow-sm hover:shadow"
              />

              <Button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                variant={"ghost"}
                size={"icon"}
                className="h-12 hover:bg-transparent hover:text-black absolute right-3 top-1/2 -translate-y-1/2 w-5 text-gray-400"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full text-lg md:text-xl h-12 rounded-xl bg-primary text-white font-semibold hover:bg-primary-hover transition-colors shadow-sm hover:shadow disabled:opacity-50 disabled:cursor-not-allowed mt-5"
            size={"lg"}
            disabled={pending}
          >
            Continue
          </Button>
        </form>
        <Separator />
        <div className="space-y-1 flex justify-center">
          <p className="text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <span
              className="text-primary hover:underline cursor-pointer"
              onClick={() => setState("signUp")}
            >
              Sign up
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
        <div className="text-center">
          <Link
            href={"/auth/forgot-password"}
            className="text-primary hover:text-primary-hover hover:underline text-sm"
          >
            Forgot your password?
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
