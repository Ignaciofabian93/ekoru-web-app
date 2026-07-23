export function ProductGridListLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="ml-0 grid grid-cols-2 gap-[2%] sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 place-items-center">
      {children}
    </div>
  );
}
