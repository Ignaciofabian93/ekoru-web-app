"use client";

import clsx from "clsx";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
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
  inputTrailingButtonClass,
  inputWidthClass,
} from "@/design/input";
import type { InputProps } from "./Input.types";

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
  const showError = hasError || isInvalid;

  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const resolvedType = isPassword ? (showPassword ? "text" : "password") : type;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChangeText?.(e.target.value);
  };

  return (
    <div className={clsx(inputRootClass, inputWidthClass[width])}>
      {label && (
        <label htmlFor={name} className={inputLabelClass}>
          {label}
        </label>
      )}

      <div className={clsx(inputRowClass, inputHeightClass[size])}>
        {LeftIcon && (
          <div
            className={clsx(
              inputLeftIconClass,
              showError ? inputLeftIconToneClass.error : inputLeftIconToneClass.default,
            )}
          >
            <LeftIcon size={inputIconSize[size]} color="currentColor" strokeWidth={2} />
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
            showError ? inputFieldErrorClass[size] : inputFieldClass[variant][size],
            LeftIcon && inputPadLeftClass[size],
            isPassword && inputPadRightClass[size],
          )}
          {...rest}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((p) => !p)}
            className={inputTrailingButtonClass}
          >
            {showPassword ? (
              <EyeOff size={inputIconSize[size]} color="currentColor" strokeWidth={2} />
            ) : (
              <Eye size={inputIconSize[size]} color="currentColor" strokeWidth={2} />
            )}
          </button>
        )}
      </div>

      {showError && errorMessage && (
        <span className={inputErrorTextClass}>{errorMessage}</span>
      )}
    </div>
  );
}
