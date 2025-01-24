import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

import { TriangleAlertIcon } from "lucide-react"

// import { useRouter } from "next/navigation"
import { useState } from "react"
import { AuthFlow } from "./auth-screen"
import { useAuthActions } from "@convex-dev/auth/react"
import { generateBuyerId } from "@/lib/utils"

export const SignUpCard = ({
    setState
}: {
    setState: (state: AuthFlow) => void
}) => {
    const { signIn } = useAuthActions()

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fname, setFname] = useState("");
    const [lname, setLname] = useState("");
    const [contact, setContact] = useState("");
    const [houseNumber, setHouseNumber] = useState("");
    const [street, setStreet] = useState("");
    const [barangay, setBarangay] = useState("");
    const [city, setCity] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [pending, setPending] = useState<boolean>(false);
    const [error, setError] = useState("");

    const accountId = generateBuyerId();

    // const router = useRouter()

    const onSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        setPending(true)
        setError("")

        try {

            await signIn("password", {
                accountId,
                email,
                password,
                fname,
                lname,
                contact,
                houseNumber,
                street,
                barangay,
                city,
                role: "buyer",
                flow: "signUp",
            })

        } catch (error) {
            setError("Something went wrong. Please try again.")
            console.error(error)
        } finally {
            setPending(false)
        }
    }

    return (
        <Card className="w-full h-full p-8">
            <CardHeader className="px-0 pt-0">
                <CardTitle className="text-primary">
                    Sign up to continue
                </CardTitle>
                <CardDescription>
                    All fields are required to continue
                </CardDescription>
            </CardHeader>
            {!!error && (
                <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
                    <TriangleAlertIcon className="size-4" />
                    {error}
                </div>
            )}
            <CardContent className="space-y-5 px-0 pb-0">
                <form onSubmit={onSignUp} className="space-y-2.5">
                    <Input
                        disabled={pending}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        type="email"
                        required
                    />
                    <Input
                        disabled={pending}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        type="password"
                        required
                    />
                    <Input
                        disabled={pending}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm Password"
                        type="password"
                        required
                    />
                    <Input
                        disabled={pending}
                        value={fname}
                        onChange={(e) => setFname(e.target.value)}
                        placeholder="First Name"
                        type="text"
                        required
                    />
                    <Input
                        disabled={pending}
                        value={lname}
                        onChange={(e) => setLname(e.target.value)}
                        placeholder="Last Name"
                        type="text"
                        required
                    />
                    <Input
                        disabled={pending}
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder="Contact Number"
                        type="text"
                        required
                    />
                    <Input
                        disabled={pending}
                        value={houseNumber}
                        onChange={(e) => setHouseNumber(e.target.value)}
                        placeholder="House Number"
                        type="text"
                        required
                    />
                    <Input
                        disabled={pending}
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        placeholder="Street"
                        type="text"
                        required
                    />
                    <Input
                        disabled={pending}
                        value={barangay}
                        onChange={(e) => setBarangay(e.target.value)}
                        placeholder="Barangay"
                        type="text"
                        required
                    />
                    <Input
                        disabled={pending}
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="City"
                        type="text"
                        required
                    />
                    <Button
                        type="submit"
                        className="w-full"
                        size={"lg"}
                        disabled={pending}
                    >
                        Continue
                    </Button>
                </form>
                <Separator />
                <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                        Already have an account? <span
                            className="text-primary hover:underline cursor-pointer"
                            onClick={() => setState("signIn")}>
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
    )
}