import React from "react";
import AddPhoneNumberForm from "../_component/add-phone-number-form";

function Page() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Main Content */}
      <main className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-12">
        <AddPhoneNumberForm />
      </main>
    </div>
  );
}

export default Page;
