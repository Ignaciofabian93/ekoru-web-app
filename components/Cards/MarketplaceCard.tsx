import type { ReactNode } from "react";
import type { MarketplaceCardProduct } from "./types/Card.types";
import { Card } from "./Card";

interface MarketplaceCardProps {
  product: MarketplaceCardProduct;
  lang: string;
  /**
   * Eager-loads the cover image. Only worth setting on the first row of a grid
   * — everything below the fold should stay lazy.
   */
  priority?: boolean;
  /** Owner controls — see `CardProps.actions`. Switches to management mode. */
  actions?: ReactNode;
  /** Owner's primary action — see `CardProps.onEdit`. */
  onEdit?: () => void;
}

export function MarketplaceCard({
  product,
  lang,
  priority = false,
  actions,
  onEdit,
}: MarketplaceCardProps) {
  const href = `/${lang}/product/${product.id}`;

  return (
    <Card
      orientation="vertical"
      hasBackSide
      href={href}
      ariaLabel={product.name}
      actions={actions}
      onEdit={onEdit}
    >
      <Card.FrontSide>
        <Card.Header
          coverImageString={product.images?.[0] ?? ""}
          imageAlt={product.name}
          priority={priority}
          condition={product.condition ?? undefined}
          isExchangeable={product.isExchangeable ?? undefined}
          isLikeEnabled
          isLiked={product.isLiked ?? undefined}
          itemId={product.id}
          favoriteSource="marketplace"
        />
        <Card.Body
          name={product.name}
          isProduct
          brand={product.brand ?? undefined}
          price={product.price}
          isExchangeable={product.isExchangeable ?? undefined}
          interests={product.interests ?? undefined}
          exchangeRedirectUrl={`${href}?mode=exchange`}
        />
        {/* In management mode the footer resolves to the Edit CTA itself. */}
        <Card.Footer itemType="MARKETPLACE" url={href} />
      </Card.FrontSide>
      <Card.BackSide>
        <Card.BackHeader itemName={product.name} />
        <Card.BackBody itemType="MARKETPLACE" impact={product.environmentalImpact} />
        <Card.BackFooter seller={product.seller} />
      </Card.BackSide>
    </Card>
  );
}
