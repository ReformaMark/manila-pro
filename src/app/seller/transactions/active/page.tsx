import { ActiveList } from "../_components/active-list";

const ActivePage = () => {
  return (
    <div className="flex flex-col h-full w-full px-3 my-5">
      <h1 className="text-3xl font-semibold">Active Transactions</h1>
      <p className="text-base text-muted-foreground">
        Manage your active deals
      </p>

      <ActiveList />
    </div>
  );
};

export default ActivePage;
