"use client";
import React from "react";
interface MainProps {
  children: React.ReactNode;
}
function Main({ children }: MainProps) {
  return (
    <div className="relative bg-orange-500">
      <main className="flex-1">{children}</main>
    </div>
  );
}

export default Main;
