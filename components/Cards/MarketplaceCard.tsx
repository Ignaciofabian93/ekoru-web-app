import type { Product } from "@/types/product";
import { Card } from "./Card";

export function MarketplaceCard({
  product,
  lang,
  priority,
}: {
  product: Product;
  lang: string;
  priority: boolean;
}) {
  return (
    <Card
      key={product.id}
      orientation="vertical"
      hasBackSide
      href={`/${lang}/product/${product.id}`}
    >
      <Card.FrontSide>
        <Card.Header
          coverImageString={product.images?.[0] ?? ""}
          imageAlt={product.name}
          priority={priority}
          condition={product.condition}
          isExchangeable={product.isExchangeable}
          isLikeEnabled={true}
          isLiked={product.isLiked}
        />
        <Card.Body
          name={product.name}
          isProduct
          brand={product.brand}
          price={product.price}
          isExchangeable={product.isExchangeable}
        />
        <Card.Footer itemType="MARKETPLACE" url={`/${lang}/product/${product.id}`} />
      </Card.FrontSide>
      <Card.BackSide>
        <Card.BackHeader itemName={product.name} />
        <Card.BackBody itemType="MARKETPLACE" impact={product.environmentalImpact} />
        <Card.BackFooter seller={product.seller} />
      </Card.BackSide>
    </Card>
  );
}
