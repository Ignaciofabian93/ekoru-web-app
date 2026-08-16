"use client";

import clsx from "clsx";
import { Search as SearchIcon, X } from "lucide-react";
import React from "react";
import {
  inputErrorTextClass,
  inputFieldClass,
  inputFieldErrorClass,
  inputHeightClass,
  inputIconSize,
  inputLabelClass,
  inputLeftIconClass,
  inputLeftIconToneClass,
  inputPadLeftClass,
  inputPadRightClass,
  inputRootClass,
  inputRowClass,
  inputSearchResetClass,
  inputTrailingButtonClass,
  inputWidthClass,
} from "@/design/input";
import type { SearchInputProps } from "./Input.types";

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
    <div className={clsx(inputRootClass, inputWidthClass[width])}>
      {label && (
        <label htmlFor={name} className={inputLabelClass}>
          {label}
        </label>
      )}

      <div className={clsx(inputRowClass, inputHeightClass[size])}>
        <div
          className={clsx(
            inputLeftIconClass,
            showError ? inputLeftIconToneClass.error : inputLeftIconToneClass.default,
          )}
        >
          <LeftIcon size={inputIconSize[size]} color="currentColor" strokeWidth={2} />
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
            showError ? inputFieldErrorClass[size] : inputFieldClass[variant][size],
            inputSearchResetClass,
            inputPadLeftClass[size],
            showClear && inputPadRightClass[size],
          )}
          {...rest}
        />

        {showClear && (
          <button
            type="button"
            onClick={handleClear}
            aria-label={clearLabel}
            className={clsx(inputTrailingButtonClass, "hover:text-foreground")}
          >
            <X size={inputIconSize[size]} color="currentColor" strokeWidth={2} />
          </button>
        )}
      </div>

      {showError && errorMessage && (
        <span className={inputErrorTextClass}>{errorMessage}</span>
      )}
    </div>
  );
}
