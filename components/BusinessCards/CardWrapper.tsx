import type { ReactNode } from "react";
import { cardStyles } from "./styles";

export default function CardWrapper({ children }: { children: ReactNode }) {
  return <article className={cardStyles.root}>{children}</article>;
}
