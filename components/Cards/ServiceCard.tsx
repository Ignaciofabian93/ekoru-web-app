import type { ReactNode } from "react";
import type { ServiceCardService } from "./types/Card.types";
import { Card } from "./Card";

interface ServiceCardProps {
  service: ServiceCardService;
  lang: string;
  priority?: boolean;
  /** Overrides the default link target (`/[lang]/service/[id]`). */
  href?: string;
  /** Owner controls — see `CardProps.actions`. Switches to management mode. */
  actions?: ReactNode;
  /** Owner's primary action — see `CardProps.onEdit`. */
  onEdit?: () => void;
}

/**
 * A service listing. Unlike the product cards its back face carries the
 * description rather than an environmental-impact panel: a service consumes no
 * materials, so there are no savings to compute.
 */
export function ServiceCard({
  service,
  lang,
  priority = false,
  href,
  actions,
  onEdit,
}: ServiceCardProps) {
  const target = href ?? `/${lang}/service/${service.id}`;

  return (
    <Card
      orientation="vertical"
      hasBackSide
      href={target}
      ariaLabel={service.name}
      actions={actions}
      onEdit={onEdit}
    >
      <Card.FrontSide>
        <Card.Header
          coverImageString={service.image ?? ""}
          imageAlt={service.name}
          priority={priority}
          isLikeEnabled
          isLiked={service.isLiked}
          itemId={Number(service.id)}
          favoriteSource="service"
          // Services flip to their description, not to an impact panel.
          flipTarget="details"
        />
        <Card.Body
          isProduct
          name={service.name}
          // The sub-category sits where a product shows its brand — it's the
          // same "what kind of thing is this" line.
          brand={service.category ?? undefined}
          price={service.price ?? undefined}
          isPriceFrom
          duration={service.duration ?? undefined}
          averageRating={service.averageRating ?? undefined}
          reviewsNumber={service.reviewsNumber ?? undefined}
        />
        <Card.Footer itemType="SERVICE" url={target} />
      </Card.FrontSide>
      <Card.BackSide>
        <Card.BackHeader itemName={service.name} />
        <Card.BackBody itemType="SERVICE" description={service.description} />
        {/* Services project a provider name and logo rather than a full
            `Seller`, so the footer takes the explicit overrides. */}
        <Card.BackFooter
          name={service.providerName ?? undefined}
          imageUrl={service.providerLogo ?? undefined}
          subtitle={service.providerLocation ?? undefined}
        />
      </Card.BackSide>
    </Card>
  );
}
