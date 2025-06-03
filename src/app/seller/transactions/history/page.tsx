import { HistoryList } from "../_components/history-list";

const HistoryPage = () => {
  return (
    <div className="flex flex-col h-full w-full px-3 my-5">
      <h1 className="text-3xl font-semibold">History</h1>
      <p className="text-base text-muted-foreground">
        View your cancelled and completed transactions.
      </p>

      <HistoryList />
    </div>
  );
};

export default HistoryPage;
