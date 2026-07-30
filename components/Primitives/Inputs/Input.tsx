"use client";

import clsx from "clsx";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import type { InputProps } from "./Input.types";
import { FIELD_BASE, SIZE_CLASS, VARIANT_CLASS, WIDTH_CLASS } from "./styles";

export function Input({
  label,
  name,
  leftIcon: LeftIcon,
  errorMessage,
  size = "md",
  width = "full",
  variant = "default",
  type = "text",
  hasError,
  isInvalid,
  placeholder,
  maxLength = 50,
  onFocus,
  onBlur,
  onChangeText,
  ref,
  ...rest
}: InputProps) {
  const s = SIZE_CLASS[size];
  const showError = hasError || isInvalid;

  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const resolvedType = isPassword ? (showPassword ? "text" : "password") : type;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeText?.(e.target.value);
  };

  return (
    <div className={clsx("relative flex flex-col gap-px", WIDTH_CLASS[width])}>
      {label && (
        <label htmlFor={name} className="font-sans text-sm font-medium text-foreground">
          {label}
        </label>
      )}

      <div className={clsx("group relative flex items-center", s.h)}>
        {LeftIcon && (
          <div
            className={clsx(
              "pointer-events-none absolute left-3 z-1 flex",
              showError ? "text-danger" : "text-foreground-tertiary group-focus-within:text-primary",
            )}
          >
            <LeftIcon size={s.icon} color="currentColor" strokeWidth={2} />
          </div>
        )}

        <input
          ref={ref}
          id={name}
          name={name}
          type={resolvedType}
          placeholder={placeholder}
          maxLength={maxLength}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={handleChange}
          className={clsx(
            FIELD_BASE,
            s.text,
            s.px,
            LeftIcon && s.padLeft,
            isPassword && s.padRight,
            showError ? "border-danger" : VARIANT_CLASS[variant],
          )}
          {...rest}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className="absolute right-3 flex cursor-pointer items-center p-0 text-foreground-tertiary transition-opacity duration-75"
          >
            {showPassword ? (
              <EyeOff size={s.icon} color="currentColor" strokeWidth={2} />
            ) : (
              <Eye size={s.icon} color="currentColor" strokeWidth={2} />
            )}
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
