export function ContentLayout({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">{children}</div>;
}
