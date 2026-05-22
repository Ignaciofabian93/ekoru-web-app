"use client";

interface TextAreaProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText?: (text: string) => void;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  maxLength?: number;
  minLength?: number;
  style?: React.CSSProperties;
  rows?: number;
}

export default function TextArea({
  label,
  placeholder,
  value,
  onChangeText,
  onChange,
  maxLength,
  minLength,
  style,
  rows = 4,
}: TextAreaProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChangeText?.(e.target.value);
    onChange?.(e);
  };

  return (
    <div className="flex w-full flex-col gap-1.5">
      {label && (
        <label className="font-sans text-sm font-medium text-foreground-secondary">
          {label}
        </label>
      )}
      <textarea
        value={value}
        onChange={handleChange}
        maxLength={maxLength}
        minLength={minLength}
        placeholder={placeholder}
        rows={rows}
        style={style}
        className="resize-y rounded-md border-2 border-solid border-input-border bg-surface px-4 py-3 font-sans text-base font-normal text-foreground outline-none transition-[border-color] duration-150 focus:border-primary"
      />
    </div>
  );
}
