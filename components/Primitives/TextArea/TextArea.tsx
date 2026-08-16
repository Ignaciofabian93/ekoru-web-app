"use client";

import clsx from "clsx";
import type React from "react";
import {
  textAreaBorderClass,
  textAreaErrorTextClass,
  textAreaFieldClass,
  textAreaLabelClass,
  textAreaRootClass,
} from "@/design/textArea";

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
    <div className={textAreaRootClass}>
      {label && (
        <label htmlFor={name} className={textAreaLabelClass}>
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
          textAreaFieldClass,
          showError ? textAreaBorderClass.error : textAreaBorderClass.default,
        )}
      />
      {showError && errorMessage && (
        <span id={errorId} className={textAreaErrorTextClass}>
          {errorMessage}
        </span>
      )}
    </div>
  );
}
