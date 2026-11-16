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
          isLiked={service.isLiked}
          itemId={Number(service.id)}
          favoriteSource="service"
          // Services flip to their description, not to an impact panel.
          flipTarget="details"
        />
        <Card.Body
          name={service.name}
          price={service.price ?? undefined}
          isPriceFrom
          location={service.providerLocation}
          averageRating={service.averageRating ?? undefined}
          reviewsNumber={service.reviewsNumber ?? undefined}
          duration={service.duration ?? undefined}
          category={service.category ?? undefined}
        />
        {/* Booking happens on the service page, so the card only ever links
            there. */}
        <Card.Footer itemType="SERVICE" />
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
