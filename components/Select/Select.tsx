"use client";

import clsx from "clsx";
import { Check, ChevronDown, Circle, type LucideIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Text } from "../Text/Text";

export type Option = {
  label: string;
  value: string | number;
  iconColor?: string;
};

type Variant = "default" | "filled" | "outline";
type Size = "sm" | "md" | "lg";
type Width = "sm" | "md" | "lg" | "full";

export interface SelectProps {
  options?: Option[];
  value?: string | number;
  name?: string;
  label?: string;
  placeholder?: string;
  onChange: (value: string | number) => void;
  variant?: Variant;
  size?: Size;
  width?: Width;
  disabled?: boolean;
  readOnly?: boolean;
  leftIcon?: LucideIcon;
  errorMessage?: string;
  showColorIcon?: boolean;
  renderOption?: (option: Option, selected: boolean) => React.ReactNode;
  searchEnabled?: boolean;
  dropdownDirection?: "up" | "down";
  noResultsText?: string;
}

const SIZE_CLASS: Record<
  Size,
  { h: string; text: string; px: string; padLeft: string; icon: number }
> = {
  sm: { h: "h-9", text: "text-xs", px: "px-2.5", padLeft: "pl-5.5", icon: 14 },
  md: { h: "h-11", text: "text-base", px: "px-3", padLeft: "pl-6", icon: 16 },
  lg: { h: "h-14", text: "text-lg", px: "px-3.5", padLeft: "pl-6.5", icon: 18 },
};

const WIDTH_CLASS: Record<Width, string> = {
  sm: "w-1/3",
  md: "w-1/2",
  lg: "w-2/3",
  full: "w-full",
};

const VARIANT_BG: Record<Variant, string> = {
  default: "bg-input-bg",
  filled: "bg-background-secondary",
  outline: "bg-transparent",
};

const VARIANT_IDLE_BORDER: Record<Variant, string> = {
  default: "border-input-border",
  filled: "border-transparent",
  outline: "border-primary",
};

const VARIANT_FOCUS_BORDER: Record<Variant, string> = {
  default: "border-input-border-focus",
  filled: "border-input-border-focus",
  outline: "border-primary-active",
};

const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      options = [],
      value,
      name: _name,
      label,
      placeholder = "Select...",
      onChange,
      variant = "default",
      size = "md",
      width = "full",
      disabled = false,
      readOnly = false,
      leftIcon: LeftIcon,
      errorMessage,
      showColorIcon = false,
      renderOption,
      searchEnabled = true,
      dropdownDirection = "down",
      noResultsText = "No results found",
    },
    ref,
  ) => {
    const s = SIZE_CLASS[size];
    const hasError = !!errorMessage;

    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    const selectedOption = options.find((o) => o.value === value);
    const filteredOptions = options.filter((o) =>
      o.label.toLowerCase().includes(search.toLowerCase()),
    );

    // Close on outside click
    useEffect(() => {
      if (!isOpen) return;
      const handler = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          handleClose();
        }
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, [isOpen]);

    // Focus search on open
    useEffect(() => {
      if (isOpen && searchEnabled) {
        setTimeout(() => searchRef.current?.focus(), 0);
      }
    }, [isOpen, searchEnabled]);

    const handleOpen = () => {
      if (disabled || readOnly) return;
      setIsOpen(true);
    };

    const handleClose = () => {
      setIsOpen(false);
      setSearch("");
    };

    const handleSelect = (optionValue: string | number) => {
      onChange(optionValue);
      handleClose();
    };

    const renderColorCircle = (option?: Option) => {
      if (!showColorIcon || !option?.iconColor) return null;
      return (
        <Circle
          size={16}
          color={option.iconColor}
          fill={option.iconColor}
          strokeWidth={option.iconColor === "#FFFFFF" ? 1 : 0}
          stroke={option.iconColor === "#FFFFFF" ? "#888" : option.iconColor}
        />
      );
    };

    return (
      <div
        ref={(node) => {
          (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
          if (typeof ref === "function") ref(node);
          else if (ref)
            (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        className={clsx("relative flex flex-col gap-px", WIDTH_CLASS[width])}
      >
        {label && (
          <Text size="sm" weight="medium">
            {label}
          </Text>
        )}

        {/* Trigger */}
        <button
          type="button"
          onClick={handleOpen}
          disabled={disabled || readOnly}
          className={clsx(
            "relative box-border flex flex-row items-center gap-2 rounded-md border-2 border-solid outline-none transition-[border-color] duration-150",
            s.h,
            s.px,
            VARIANT_BG[variant],
            hasError
              ? "border-danger"
              : isOpen
                ? VARIANT_FOCUS_BORDER[variant]
                : VARIANT_IDLE_BORDER[variant],
            disabled || readOnly ? "cursor-not-allowed opacity-50" : "cursor-pointer",
          )}
        >
          {LeftIcon && (
            <span
              className={clsx(
                "absolute left-3 flex",
                isOpen ? "text-primary" : "text-foreground-tertiary",
              )}
            >
              <LeftIcon size={s.icon} color="currentColor" strokeWidth={2} />
            </span>
          )}

          <span
            className={clsx(
              "flex flex-1 flex-row items-center gap-2 overflow-hidden",
              LeftIcon && s.padLeft,
            )}
          >
            {renderColorCircle(selectedOption)}
            <span
              className={clsx(
                "flex-1 truncate text-left font-sans font-normal",
                s.text,
                selectedOption ? "text-input-text" : "text-input-placeholder",
              )}
            >
              {selectedOption?.label ?? placeholder}
            </span>
          </span>

          <span
            className={clsx(
              "flex transition-transform duration-200",
              isOpen ? "rotate-180" : "rotate-0",
              hasError ? "text-danger" : isOpen ? "text-primary" : "text-foreground-tertiary",
            )}
          >
            <ChevronDown size={s.icon} color="currentColor" strokeWidth={2} />
          </span>
        </button>

        {errorMessage && (
          <span className="font-sans text-xs font-normal text-danger">{errorMessage}</span>
        )}

        {/* Dropdown */}
        {isOpen && (
          <div
            className={clsx(
              "absolute right-0 left-0 z-10 flex max-h-80 flex-col overflow-hidden rounded-lg border-[1.5px] border-solid border-border-light bg-surface shadow-md",
              dropdownDirection === "up" ? "bottom-full mb-2" : "top-full mt-2",
            )}
          >
            {searchEnabled && (
              <input
                ref={searchRef}
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="shrink-0 border-b border-border-light px-4 py-2 font-sans text-base font-normal text-input-text outline-none"
              />
            )}
            <div className="max-h-67 overflow-y-auto">
              {filteredOptions.length === 0 ? (
                <span className="block px-4 py-3 font-sans text-sm font-normal italic text-foreground-secondary">
                  {noResultsText}
                </span>
              ) : (
                filteredOptions.map((item, i) => {
                  const isSelected = item.value === value;
                  return (
                    <button
                      key={String(item.value)}
                      type="button"
                      onClick={() => handleSelect(item.value)}
                      className={clsx(
                        "flex w-full cursor-pointer p-0 text-left",
                        isSelected && "bg-primary/10",
                        i < filteredOptions.length - 1 && "border-b border-border-light",
                      )}
                    >
                      {renderOption ? (
                        renderOption(item, isSelected)
                      ) : (
                        <span className="flex flex-1 flex-row items-center gap-2.5 px-4 py-3.5">
                          {renderColorCircle(item)}
                          <span
                            className={clsx(
                              "flex-1 font-sans leading-5",
                              s.text,
                              isSelected
                                ? "font-semibold text-primary"
                                : "font-normal text-foreground",
                            )}
                          >
                            {item.label}
                          </span>
                          {isSelected && (
                            <Check size={16} color="currentColor" strokeWidth={2.5} className="text-primary" />
                          )}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";

export default Select;
export { Select };
