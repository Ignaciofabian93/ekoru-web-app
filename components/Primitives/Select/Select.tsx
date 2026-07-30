"use client";

import clsx from "clsx";
import { Check, ChevronDown, Circle } from "lucide-react";
import React, { useEffect, useId, useRef, useState } from "react";
import { Text } from "@/components/Primitives/Text";
import type {
  Option,
  SelectProps,
  SelectSize,
  SelectVariant,
  SelectWidth,
} from "./Select.types";

const SIZE_CLASS: Record<
  SelectSize,
  { h: string; text: string; px: string; padLeft: string; icon: number }
> = {
  sm: { h: "h-9", text: "text-xs", px: "px-2.5", padLeft: "pl-5.5", icon: 14 },
  md: { h: "h-11", text: "text-base", px: "px-3", padLeft: "pl-6", icon: 16 },
  lg: { h: "h-14", text: "text-lg", px: "px-3.5", padLeft: "pl-6.5", icon: 18 },
};

const WIDTH_CLASS: Record<SelectWidth, string> = {
  sm: "w-1/3",
  md: "w-1/2",
  lg: "w-2/3",
  full: "w-full",
};

const VARIANT_BG: Record<SelectVariant, string> = {
  default: "bg-input-bg",
  filled: "bg-background-secondary",
  outline: "bg-transparent",
};

const VARIANT_IDLE_BORDER: Record<SelectVariant, string> = {
  default: "border-input-border",
  filled: "border-transparent",
  outline: "border-primary",
};

const VARIANT_FOCUS_BORDER: Record<SelectVariant, string> = {
  default: "border-input-border-focus",
  filled: "border-input-border-focus",
  outline: "border-primary-active",
};

export function Select({
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
  ariaLabel,
  ariaDescribedBy,
  searchLabel = "Search options",
  searchPlaceholder = "Search...",
  ref,
}: SelectProps) {
  const s = SIZE_CLASS[size];
  const hasError = !!errorMessage;
  const reactId = useId();
  const labelId = `${reactId}-label`;
  const listboxId = `${reactId}-listbox`;
  const errorId = `${reactId}-error`;
  // The visible label is a plain <Text>, so it only names the trigger once
  // it's wired up here; an explicit `ariaLabel` takes precedence over it.
  const describedBy =
    [ariaDescribedBy, hasError ? errorId : null].filter(Boolean).join(" ") || undefined;

  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const selectedOption = options.find((o) => o.value === value);
  const filteredOptions = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase()),
  );

  const handleClose = () => {
    setIsOpen(false);
    setSearch("");
  };

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch("");
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

  const handleToggle = () => {
    if (disabled || readOnly) return;
    if (isOpen) handleClose();
    else setIsOpen(true);
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
        aria-hidden
        color={option.iconColor}
        fill={option.iconColor}
        strokeWidth={option.iconColor === "#FFFFFF" ? 1 : 0}
        stroke={option.iconColor === "#FFFFFF" ? "#888" : option.iconColor}
      />
    );
  };

  // The outside-click handler needs the node too, so the forwarded ref is
  // merged rather than passed straight through.
  const setRefs = (node: HTMLDivElement | null) => {
    containerRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };

  return (
    <div ref={setRefs} className={clsx("relative flex flex-col gap-px", WIDTH_CLASS[width])}>
      {label && (
        <Text size="sm" weight="medium">
          <span id={labelId}>{label}</span>
        </Text>
      )}

      {/* Trigger */}
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled || readOnly}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={isOpen ? listboxId : undefined}
        aria-label={ariaLabel}
        aria-labelledby={!ariaLabel && label ? labelId : undefined}
        aria-describedby={describedBy}
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
            <LeftIcon size={s.icon} color="currentColor" strokeWidth={2} aria-hidden />
          </span>
        )}

        <span
          className={clsx(
            "flex flex-1 flex-row items-center gap-2 overflow-hidden",
            LeftIcon && s.padLeft,
          )}
        >
          {selectedOption?.icon}
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
          <ChevronDown size={s.icon} color="currentColor" strokeWidth={2} aria-hidden />
        </span>
      </button>

      {errorMessage && (
        <span id={errorId} className="font-sans text-xs font-normal text-danger">
          {errorMessage}
        </span>
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
              placeholder={searchPlaceholder}
              aria-label={searchLabel}
              aria-controls={listboxId}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="shrink-0 border-b border-border-light px-4 py-2 font-sans text-base font-normal text-input-text outline-none"
            />
          )}
          <div
            id={listboxId}
            role="listbox"
            aria-label={ariaLabel ?? label}
            className="max-h-67 overflow-y-auto"
          >
            {filteredOptions.length === 0 ? (
              <span
                role="status"
                className="block px-4 py-3 font-sans text-sm font-normal italic text-foreground-secondary"
              >
                {noResultsText}
              </span>
            ) : (
              filteredOptions.map((item, i) => {
                const isSelected = item.value === value;
                return (
                  <button
                    // Values may legitimately repeat (e.g. phone dial "+1" is
                    // shared by several countries), so the key needs the index.
                    key={`${item.value}-${i}`}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
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
                        {item.icon}
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
                          <Check
                            size={16}
                            color="currentColor"
                            strokeWidth={2.5}
                            aria-hidden
                            className="text-primary"
                          />
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
}
