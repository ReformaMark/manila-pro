import { AdminList } from "./_components/admin-list";

const SubAdminPage = () => {
    return (
        <>
            <h2
                className="text-lg font-semibold mt-[20px] ml-[50px]"
            >
                List of admins
            </h2>

            <AdminList />
        </>
    )
}

export default SubAdminPage;

