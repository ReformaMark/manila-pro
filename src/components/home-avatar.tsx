import Link from "next/link"

const HomeAvatar = () => {
    return (
        <Link href="/" className="flex items-center gap-2 w-fit">
            {/* <Avatar
                className="hidden md:block"
            >
                <AvatarImage src="/placeholder.svg" alt="@shadcn" />
                <AvatarFallback className="bg-sky-500 text-white text-sm">MNL</AvatarFallback>
            </Avatar> */}
            <span className="text-lg font-semibold">ManilaPRO</span>
        </Link>
    )
}

export default HomeAvatar