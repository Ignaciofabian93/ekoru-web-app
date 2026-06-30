"use client";

import clsx from "clsx";
import { Search } from "lucide-react";
import { useState } from "react";

interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  /** Fired on Enter or when the search icon is clicked. */
  onSubmit?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  value: controlledValue,
  onChange,
  onSubmit,
  placeholder = "Search...",
  className,
}: SearchBarProps) {
  const [internalValue, setInternalValue] = useState("");
  const isControlled = controlledValue !== undefined;
  const query = isControlled ? controlledValue : internalValue;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isControlled) setInternalValue(e.target.value);
    onChange?.(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(query);
  };

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={clsx("bg-transparent pt-1 pb-3", className)}
    >
      <div
        className={clsx(
          "flex flex-row items-center bg-surface rounded-md px-3 h-10 gap-2",
        )}
      >
        <button
          type="submit"
          aria-label="Search"
          className={clsx(
            "flex shrink-0 items-center justify-center border-none bg-transparent p-0",
            onSubmit ? "cursor-pointer" : "cursor-default",
          )}
        >
          <Search
            size={20}
            className={clsx("text-input-placeholder")}
            strokeWidth={2}
          />
        </button>
        <input
          type="search"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className={clsx(
            "flex-1 text-base bg-transparent border-none outline-none p-0",
            "text-foreground placeholder:text-input-placeholder",
          )}
        />
      </div>
    </form>
  );
}
