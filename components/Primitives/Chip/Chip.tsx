import { comingSoonChipClass } from "@/design/chip";

export function ComingSoonChip({ label }: { label: string }) {
  return <span className={comingSoonChipClass}>{label}</span>;
}
