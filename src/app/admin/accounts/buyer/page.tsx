import { BuyerList } from "./_components/buyer-list";

const BuyerPage = () => {
    return (
        <>
            <h2
                className="text-lg font-semibold mt-[20px] ml-[50px]"
            >
                Buyers Account
            </h2>
            <BuyerList />
        </>
    )
}

export default BuyerPage;