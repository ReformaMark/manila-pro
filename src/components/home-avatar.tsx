import Link from "next/link"

const HomeAvatar = () => {
    return (
        <div className="logo">
            <Link href={'/'}>Manila<span className="text-orange-500 text-xl font-semibold">Pro</span></Link>
        </div>
    )
}

export default HomeAvatar;