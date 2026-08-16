"use client";

import clsx from "clsx";
import { Check, ChevronDown, Circle } from "lucide-react";
import React, { useEffect, useId, useRef, useState } from "react";
import { Text } from "@/components/Primitives/Text";
import {
  selectChevronClass,
  selectChevronToneClass,
  selectDropdownClass,
  selectDropdownDirectionClass,
  selectErrorBorderClass,
  selectErrorTextClass,
  selectFocusBorderClass,
  selectIconSize,
  selectIdleBorderClass,
  selectLeftIconClass,
  selectListboxClass,
  selectNoResultsClass,
  selectOptionClass,
  selectOptionDividerClass,
  selectOptionLabelClass,
  selectOptionLabelToneClass,
  selectOptionRowClass,
  selectOptionSelectedClass,
  selectPadLeftClass,
  selectRootClass,
  selectSearchClass,
  selectStateClass,
  selectTextClass,
  selectTriggerClass,
  selectValueClass,
  selectValueGroupClass,
  selectValueToneClass,
  selectWidthClass,
} from "@/design/select";
import type { Option, SelectProps } from "./Select.types";

export function Select({
  options = [],
  value,
  name,
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

  const chevronTone = hasError ? "error" : isOpen ? "open" : "idle";

  return (
    <div ref={setRefs} className={clsx(selectRootClass, selectWidthClass[width])}>
      {label && (
        <Text size="sm" weight="medium">
          <span id={labelId}>{label}</span>
        </Text>
      )}

      {/* Trigger. Carries `name` as its id so a form can focus this control the
          same way it focuses an input — by field name. */}
      <button
        id={name}
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
          selectTriggerClass[variant][size],
          hasError
            ? selectErrorBorderClass
            : isOpen
              ? selectFocusBorderClass[variant]
              : selectIdleBorderClass[variant],
          disabled || readOnly ? selectStateClass.disabled : selectStateClass.default,
        )}
      >
        {LeftIcon && (
          <span
            className={clsx(
              selectLeftIconClass,
              isOpen ? "text-primary" : "text-foreground-tertiary",
            )}
          >
            <LeftIcon
              size={selectIconSize[size]}
              color="currentColor"
              strokeWidth={2}
              aria-hidden
            />
          </span>
        )}

        <span
          className={clsx(selectValueGroupClass, LeftIcon && selectPadLeftClass[size])}
        >
          {selectedOption?.icon}
          {renderColorCircle(selectedOption)}
          <span
            className={clsx(
              selectValueClass,
              selectTextClass[size],
              selectedOption
                ? selectValueToneClass.selected
                : selectValueToneClass.placeholder,
            )}
          >
            {selectedOption?.label ?? placeholder}
          </span>
        </span>

        <span
          className={clsx(
            selectChevronClass,
            isOpen ? "rotate-180" : "rotate-0",
            selectChevronToneClass[chevronTone],
          )}
        >
          <ChevronDown
            size={selectIconSize[size]}
            color="currentColor"
            strokeWidth={2}
            aria-hidden
          />
        </span>
      </button>

      {errorMessage && (
        <span id={errorId} className={selectErrorTextClass}>
          {errorMessage}
        </span>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div
          className={clsx(
            selectDropdownClass,
            selectDropdownDirectionClass[dropdownDirection],
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
              className={selectSearchClass}
            />
          )}
          <div
            id={listboxId}
            role="listbox"
            aria-label={ariaLabel ?? label}
            className={selectListboxClass}
          >
            {filteredOptions.length === 0 ? (
              <span role="status" className={selectNoResultsClass}>
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
                      selectOptionClass,
                      isSelected && selectOptionSelectedClass,
                      i < filteredOptions.length - 1 && selectOptionDividerClass,
                    )}
                  >
                    {renderOption ? (
                      renderOption(item, isSelected)
                    ) : (
                      <span className={selectOptionRowClass}>
                        {item.icon}
                        {renderColorCircle(item)}
                        <span
                          className={clsx(
                            selectOptionLabelClass,
                            selectTextClass[size],
                            isSelected
                              ? selectOptionLabelToneClass.selected
                              : selectOptionLabelToneClass.default,
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
