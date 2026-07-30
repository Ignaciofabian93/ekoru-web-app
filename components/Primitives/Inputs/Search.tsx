"use client";

import clsx from "clsx";
import { Search as SearchIcon, X } from "lucide-react";
import React from "react";
import type { SearchInputProps } from "./Input.types";
import { FIELD_BASE, SIZE_CLASS, VARIANT_CLASS, WIDTH_CLASS } from "./styles";

/**
 * Search form field — the same shell as `Input`, typed `search`, with a clear
 * button. For the navigation search bar (which submits a query) see
 * `components/Navigation/SearchBar`.
 */
export function SearchInput({
  label,
  name,
  leftIcon: LeftIcon = SearchIcon,
  errorMessage,
  size = "md",
  width = "full",
  variant = "default",
  hasError,
  isInvalid,
  placeholder,
  maxLength = 50,
  clearable = true,
  clearLabel = "Clear search",
  value,
  onFocus,
  onBlur,
  onChangeText,
  onClear,
  ref,
  ...rest
}: SearchInputProps) {
  const s = SIZE_CLASS[size];
  const showError = hasError || isInvalid;
  const showClear = clearable && Boolean(value);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeText?.(e.target.value);
  };

  const handleClear = () => {
    onChangeText?.("");
    onClear?.();
  };

  return (
    <div className={clsx("relative flex flex-col gap-px", WIDTH_CLASS[width])}>
      {label && (
        <label htmlFor={name} className="font-sans text-sm font-medium text-foreground">
          {label}
        </label>
      )}

      <div className={clsx("group relative flex items-center", s.h)}>
        <div
          className={clsx(
            "pointer-events-none absolute left-3 z-1 flex",
            showError ? "text-danger" : "text-foreground-tertiary group-focus-within:text-primary",
          )}
        >
          <LeftIcon size={s.icon} color="currentColor" strokeWidth={2} />
        </div>

        <input
          ref={ref}
          id={name}
          name={name}
          type="search"
          placeholder={placeholder}
          maxLength={maxLength}
          value={value}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={handleChange}
          className={clsx(
            FIELD_BASE,
            "[&::-webkit-search-cancel-button]:appearance-none",
            s.text,
            s.px,
            s.padLeft,
            showClear && s.padRight,
            showError ? "border-danger" : VARIANT_CLASS[variant],
          )}
          {...rest}
        />

        {showClear && (
          <button
            type="button"
            onClick={handleClear}
            aria-label={clearLabel}
            className="absolute right-3 flex cursor-pointer items-center p-0 text-foreground-tertiary transition-opacity duration-75 hover:text-foreground"
          >
            <X size={s.icon} color="currentColor" strokeWidth={2} />
          </button>
        )}
      </div>

      {showError && errorMessage && (
        <span className="absolute -bottom-4.5 font-sans text-xs font-normal text-danger">
          {errorMessage}
        </span>
      )}
    </div>
  );
}
