import { SellerProfileSettings } from "./_components/seller-profile-settings";

const UserProfilePage = () => {
  return (
    <main className="p-5 flex flex-col justify-center items-center space-y-2">
      <div className="w-full flex flex-col items-center mb-3">
        <h1 className="font-bold text-xl text-left">Profile Management</h1>
        <p className="text-zinc-500 text-sm">
          Manage your real estate professional profile
        </p>
      </div>

      <SellerProfileSettings />
    </main>
  );
};

export default UserProfilePage;
