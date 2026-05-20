"use client";
import HeaderRight from "./HeaderRight";
import type { ReactNode } from "react";

interface CustomHeaderProps {
  logo: ReactNode;
  searchBar: ReactNode;
  subHeader: ReactNode;
}

export function CustomHeader({ logo, searchBar, subHeader }: CustomHeaderProps) {
  return (
    <header
      id="header"
      className="w-screen bg-linear-to-r from-primary-dark via-primary to-primary-dark"
    >
      <nav className="w-full max-w-4xl flex flex-col mx-auto pt-3 px-6">
        <div className="flex items-center justify-between mb-2 px-2">
          {logo}
          <HeaderRight />
        </div>
        {searchBar}
      </nav>
      {subHeader}
    </header>
  );
}
