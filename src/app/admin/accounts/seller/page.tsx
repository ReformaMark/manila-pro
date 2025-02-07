import { SellersList } from "./_components/sellers-list";

const SellerPage = () => {
    return (
        <>
            <h2
                className="text-lg font-semibold mt-[20px] ml-[50px]"
            >
                Sellers Account
            </h2>

            <SellersList />
        </>
    )
}

export default SellerPage;