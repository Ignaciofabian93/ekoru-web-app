"use client";

import clsx from "clsx";
import { Search } from "lucide-react";
import { useState } from "react";

interface SearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function SearchBar({
  value: controlledValue,
  onChange,
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

  return (
    <div className={clsx("bg-transparent pt-1 pb-3", className)}>
      <div
        className={clsx(
          "flex flex-row items-center bg-surface rounded-md px-3 h-10 gap-2",
        )}
      >
        <Search
          size={20}
          className={clsx("text-input-placeholder shrink-0")}
          strokeWidth={2}
        />
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
    </div>
  );
}
