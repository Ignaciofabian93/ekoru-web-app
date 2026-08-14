export function ComingSoonChip({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-border-strong bg-background px-2 py-0.5 text-xs font-medium text-foreground">
      {label}
    </span>
  );
}
