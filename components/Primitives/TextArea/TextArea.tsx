"use client";

import clsx from "clsx";
import type React from "react";

export interface TextAreaProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText?: (text: string) => void;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  maxLength?: number;
  minLength?: number;
  style?: React.CSSProperties;
  rows?: number;
  /** Ties the label to the field and lets a form focus it by id. */
  name?: string;
  required?: boolean;
  autoComplete?: string;
  /** Mirrors `Input`: either flag paints the error state. */
  hasError?: boolean;
  isInvalid?: boolean;
  /** Shown under the field while the error state is on. */
  errorMessage?: string;
  ref?: React.Ref<HTMLTextAreaElement>;
}

export function TextArea({
  label,
  placeholder,
  value,
  onChangeText,
  onChange,
  maxLength,
  minLength,
  style,
  rows = 4,
  name,
  required,
  autoComplete,
  hasError,
  isInvalid,
  errorMessage,
  ref,
}: TextAreaProps) {
  const showError = Boolean(hasError || isInvalid);
  const errorId = name && showError && errorMessage ? `${name}-error` : undefined;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChangeText?.(e.target.value);
    onChange?.(e);
  };

  return (
    <div className="flex w-full flex-col gap-1.5">
      {label && (
        <label
          htmlFor={name}
          className="font-sans text-sm font-medium text-foreground-secondary"
        >
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={name}
        name={name}
        value={value}
        onChange={handleChange}
        maxLength={maxLength}
        minLength={minLength}
        placeholder={placeholder}
        rows={rows}
        required={required}
        autoComplete={autoComplete}
        aria-invalid={showError || undefined}
        aria-describedby={errorId}
        style={style}
        className={clsx(
          "resize-y rounded-md border-2 border-solid bg-surface px-4 py-3",
          "font-sans text-base font-normal text-foreground outline-none",
          "transition-[border-color] duration-150",
          showError ? "border-danger" : "border-input-border focus:border-primary",
        )}
      />
      {showError && errorMessage && (
        <span
          id={errorId}
          className="font-sans text-xs font-normal text-danger"
        >
          {errorMessage}
        </span>
      )}
    </div>
  );
}
