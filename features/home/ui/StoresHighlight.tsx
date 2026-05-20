import { MapPin, ShieldCheck, Star } from "lucide-react";
import Link from "next/link";

type Store = {
  id: string;
  name: string;
  rating: number;
  county: string;
  category: string;
  isVerified: boolean;
};

export function StoresHighlight({ lang, stores }: { lang: string; stores: Store[] }) {
  return (
    <div className="my-10">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-foreground">Eco Stores</h2>
          <p className="text-sm text-foreground-secondary mt-0.5">Verified sustainable shops</p>
        </div>
        <Link href={`/${lang}/stores`} className="text-sm font-semibold text-primary hover:underline">
          See all
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {stores.map((store) => (
          <Link
            key={store.id}
            href={`/${lang}/stores/${store.id}`}
            className="flex items-center gap-4 bg-surface border border-border rounded-xl p-4 hover:shadow-sm transition-shadow"
          >
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-primary to-primary-dark flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-lg">{store.name[0]}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-foreground truncate">{store.name}</span>
                {store.isVerified && <ShieldCheck size={14} className="text-primary shrink-0" strokeWidth={2} />}
              </div>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="flex items-center gap-1 text-xs text-foreground-secondary">
                  <Star size={11} className="text-amber-400" fill="currentColor" strokeWidth={0} />
                  {store.rating}
                </span>
                <span className="flex items-center gap-1 text-xs text-foreground-secondary">
                  <MapPin size={11} strokeWidth={1.5} />
                  {store.county}
                </span>
              </div>
            </div>
            <span className="text-xs font-medium text-primary bg-primary-light-bg px-2 py-0.5 rounded-full shrink-0">
              {store.category}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
