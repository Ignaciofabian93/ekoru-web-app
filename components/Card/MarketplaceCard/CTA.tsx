import clsx from "clsx";
import { Repeat } from "lucide-react";

interface AddToCartButtonProps {
  handleAddToCart: (e: React.MouseEvent) => void;
  label: string;
}

interface ExchangeButtonProps {
  label?: string;
}

export function AddToCartButton({ handleAddToCart, label }: AddToCartButtonProps) {
  return (
    <button
      className={clsx(
        "px-4 py-2 bg-primary w-full rounded-md text-white cursor-pointer hover:brightness-110",
        "transition-all duration-200 ease-in-out",
      )}
      onClick={handleAddToCart}
    >
      {label}
    </button>
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
