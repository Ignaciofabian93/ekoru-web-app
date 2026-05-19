"use client";
import SearchBar from "../SearchBar/SearchBar";
import SubHeader from "../SubHeader/SubHeader";
import HeaderRight from "./HeaderRight";
import type { ReactNode } from "react";

export function CustomHeader({ logo }: { logo: ReactNode }) {
  return (
    <header
      id="header"
      className="w-screen bg-linear-to-r from-primary-dark via-primary to-primary-dark"
    >
      <nav className="w-full max-w-250 flex flex-col mx-auto py-2">
        <div className="flex items-center justify-between px-6 mb-2">
          {logo}
          <HeaderRight />
        </div>
        <SearchBar />
      </nav>
      <SubHeader />
    </header>
  );
}
