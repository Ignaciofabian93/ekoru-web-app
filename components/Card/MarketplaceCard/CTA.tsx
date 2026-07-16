import clsx from "clsx";
import { Minus, Plus, Repeat, ShoppingCart } from "lucide-react";
import { useState } from "react";

interface AddToCartButtonProps {
  /** Receives the chosen quantity — always 1 unless `stepper` is enabled. */
  handleAddToCart: (e: React.MouseEvent, quantity: number) => void;
  label: string;
  /** Store mode: render a stock-bounded quantity stepper beside the add action. */
  stepper?: boolean;
  /** Upper bound for the stepper (available stock). Ignored without `stepper`. */
  maxStock?: number;
  /** Aria-labels for the stepper controls. Required in `stepper` mode. */
  decreaseLabel?: string;
  increaseLabel?: string;
}

interface ExchangeButtonProps {
  label?: string;
}

export function AddToCartButton({
  handleAddToCart,
  label,
  stepper = false,
  maxStock = Infinity,
  decreaseLabel,
  increaseLabel,
}: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);

  if (!stepper) {
    return (
      <button
        className={clsx(
          "px-4 py-2 bg-primary w-full rounded-md text-white cursor-pointer hover:brightness-110",
          "transition-all duration-200 ease-in-out",
        )}
        onClick={(e) => handleAddToCart(e, 1)}
      >
        {label}
      </button>
    );
  }

  const clamp = (n: number) => Math.min(Math.max(n, 1), maxStock);
  const step = (delta: number) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuantity((q) => clamp(q + delta));
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-1 items-center justify-between rounded-md border border-border-strong">
        <button
          type="button"
          onClick={step(-1)}
          disabled={quantity <= 1}
          aria-label={decreaseLabel}
          className="flex size-8 items-center justify-center rounded-l-md text-foreground-secondary transition-colors hover:bg-surface-hover disabled:cursor-not-allowed disabled:text-foreground-muted"
        >
          <Minus size={14} strokeWidth={2.5} />
        </button>
        <span className="min-w-6 text-center text-sm font-semibold text-foreground">
          {quantity}
        </span>
        <button
          type="button"
          onClick={step(1)}
          disabled={quantity >= maxStock}
          aria-label={increaseLabel}
          className="flex size-8 items-center justify-center rounded-r-md text-foreground-secondary transition-colors hover:bg-surface-hover disabled:cursor-not-allowed disabled:text-foreground-muted"
        >
          <Plus size={14} strokeWidth={2.5} />
        </button>
      </div>
      <button
        type="button"
        onClick={(e) => handleAddToCart(e, quantity)}
        aria-label={label}
        className="flex size-9 shrink-0 items-center justify-center rounded-md bg-primary text-white shadow-sm transition-all duration-200 ease-in-out hover:brightness-110"
      >
        <ShoppingCart size={16} strokeWidth={2} />
      </button>
    </div>
  );
}

export function ExchangeButton({}: ExchangeButtonProps) {
  return (
    <button
      className={clsx(
        "p-2 bg-primary rounded-md text-white cursor-pointer",
        "hover:brightness-110 transition-all duration-200 ease-in-out",
      )}
    >
      <Repeat size={16} color="#fff" />
    </button>
  );
}
