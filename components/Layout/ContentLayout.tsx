export function ContentLayout({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">{children}</div>;
}

export function InnerContentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-5 px-2 py-4">
      {children}
    </div>
  );
}
