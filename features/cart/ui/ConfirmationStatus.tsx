"use client";
import Link from "next/link";
import { CheckCircle2, Clock, XCircle, Loader2 } from "lucide-react";

import MainButton from "@/components/Button/MainButton";
import { Text } from "@/components/Text/Text";
import { Title } from "@/components/Title/Title";
import { type SupportedLanguage } from "@/constants/settings";
import { useTranslation } from "@/i18n/context";
import type { PaymentStatusResponse } from "@/types/checkout";

type Props = {
  lang: SupportedLanguage;
  payment: PaymentStatusResponse | null;
  loading: boolean;
};

export function ConfirmationStatus({ lang, payment, loading }: Props) {
  const { t } = useTranslation("cart");
  const providerLabel = payment?.provider ? humanizeProvider(payment.provider) : "";

  if (!payment && loading) {
    return (
      <StatusCard
        icon={<Loader2 size={36} className="animate-spin text-primary" />}
        title={t("confirmation.checking.title")}
        subtitle={t("confirmation.checking.subtitle", { provider: providerLabel })}
      />
    );
  }

  if (!payment) {
    return (
      <StatusCard
        icon={<XCircle size={36} className="text-danger" />}
        title={t("confirmation.failed.title")}
        subtitle={t("confirmation.missingPayment")}
        actions={
          <Link href={`/${lang}/cart`}>
            <MainButton text={t("confirmation.failed.backToCart")} variant="outline" />
          </Link>
        }
      />
    );
  }

  const status = payment.status;
  const orderId = payment.orderId ? String(payment.orderId) : "—";

  if (status === "COMPLETED") {
    return (
      <StatusCard
        icon={<CheckCircle2 size={36} className="text-success" />}
        title={t("confirmation.success.title")}
        subtitle={t("confirmation.success.subtitle", { orderId })}
        actions={
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link href={`/${lang}/profile/orders`}>
              <MainButton text={t("confirmation.success.viewOrder")} fullWidth />
            </Link>
            <Link href={`/${lang}/marketplace`}>
              <MainButton
                text={t("confirmation.success.continueShopping")}
                variant="outline"
                fullWidth
              />
            </Link>
          </div>
        }
      />
    );
  }

  if (status === "PENDING" || status === "PROCESSING") {
    return (
      <StatusCard
        icon={<Clock size={36} className="text-warning" />}
        title={t("confirmation.pending.title")}
        subtitle={t("confirmation.pending.subtitle", { provider: providerLabel })}
        actions={
          <Link href={`/${lang}/profile/orders`}>
            <MainButton text={t("confirmation.pending.viewOrder")} variant="outline" />
          </Link>
        }
      />
    );
  }

  return (
    <StatusCard
      icon={<XCircle size={36} className="text-danger" />}
      title={t("confirmation.failed.title")}
      subtitle={t("confirmation.failed.subtitle", { provider: providerLabel })}
      actions={
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link href={`/${lang}/cart/checkout`}>
            <MainButton text={t("confirmation.failed.retry")} fullWidth />
          </Link>
          <Link href={`/${lang}/cart`}>
            <MainButton
              text={t("confirmation.failed.backToCart")}
              variant="outline"
              fullWidth
            />
          </Link>
        </div>
      }
    />
  );
}

function StatusCard({
  icon,
  title,
  subtitle,
  actions,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-border-light bg-surface px-6 py-10 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-background-secondary">
        {icon}
      </div>
      <Title level="h2" size="h4" weight="semibold" align="center">
        {title}
      </Title>
      <Text variant="p" color="secondary" align="center">
        {subtitle}
      </Text>
      {actions ? <div className="mt-2 w-full max-w-md">{actions}</div> : null}
    </div>
  );
}

function humanizeProvider(provider: string): string {
  switch (provider.toUpperCase()) {
    case "WEBPAY":
      return "Webpay";
    case "KHIPU":
      return "Khipu";
    case "MERCADOPAGO":
      return "MercadoPago";
    default:
      return provider;
  }
}
