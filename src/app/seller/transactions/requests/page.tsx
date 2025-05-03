import React from "react";
import { RequestList } from "../_components/request-list";

const RequestsPage = () => {
  return (
    <div className="flex flex-col h-full w-full px-3 my-5">
      <h1 className="text-3xl font-semibold">Deal Requests</h1>
      <p className="text-base text-muted-foreground">
        Manage incoming deal requests and negotiations
      </p>

      <RequestList />
    </div>
  );
};

export default RequestsPage;
