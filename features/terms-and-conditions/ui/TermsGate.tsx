"use client";
import { Modal } from "@/components/Overlays";
import { Button } from "@/components/Primitives/Button";
import { Text } from "@/components/Primitives/Text";
import { DEFAULT_LANGUAGE } from "@/constants/settings";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { ACCEPT_TERMS, MY_TERMS_STATUS } from "@/graphql/legal/terms";
import { useToast } from "@/hooks/useToast";
import { useTranslation } from "@/i18n/context";
import useAuthStore from "@/store/useAuthStore";
import { useMutation, useQuery } from "@apollo/client/react";
import { ExternalLink } from "lucide-react";
import { useParams, usePathname } from "next/navigation";
import { NAMESPACE } from "../i18n";

interface TermsStatus {
  currentVersion: number | null;
  acceptedVersion: number | null;
  mustAccept: boolean;
  summary: string | null;
}

/**
 * Asks a signed-in account to accept the terms in force (LEG-1): every account
 * created before acceptance was recorded, and everyone again after the panel
 * publishes a new version. It can't be dismissed, only accepted or left by
 * signing out. The terms page itself stays readable, so the link opens it in
 * a new tab and the prompt is not shown there.
 */
export function TermsGate() {
  const { t } = useTranslation(NAMESPACE);
  const toast = useToast();
  const params = useParams<{ lang?: string }>();
  const pathname = usePathname();
  const lang = params?.lang ?? DEFAULT_LANGUAGE;
  const seller = useAuthStore((s) => s.seller);
  const { handleLogout, loading: leaving } = useLogout();

  const variables = { language: lang.toUpperCase() };
  const { data, refetch } = useQuery<{ myTermsStatus: TermsStatus }>(MY_TERMS_STATUS, {
    variables,
    skip: !seller,
    fetchPolicy: "network-only",
  });
  const [accept, { loading }] = useMutation<{ acceptTerms: TermsStatus }>(ACCEPT_TERMS);

  const status = data?.myTermsStatus;
  const onTermsPage = pathname?.endsWith("/terms-and-conditions") ?? false;
  if (!seller || !status?.mustAccept || status.currentVersion === null || onTermsPage) {
    return null;
  }

  const handleAccept = async () => {
    try {
      await accept({ variables: { version: status.currentVersion, ...variables } });
    } catch (err) {
      // A newer version may have been published meanwhile; the refetch shows it.
      toast.error(err instanceof Error && err.message ? err.message : t("gate.error"));
    }
    await refetch();
  };

  return (
    <Modal
      isOpen
      title={status.acceptedVersion ? t("gate.title") : t("gate.firstTitle")}
      showCloseButton={false}
      closeOnOverlayClick={false}
      size="md"
    >
      <div className="flex flex-col gap-4">
        <Text variant="p" size="sm" color="secondary">
          {t("gate.body", { version: String(status.currentVersion) })}
        </Text>
        {status.summary && (
          <div className="rounded-xl border border-border-light bg-background-secondary/50 p-3">
            <Text variant="span" size="xs" weight="semibold" color="primary">
              {t("gate.summaryLabel")}
            </Text>
            <Text variant="p" size="sm" color="secondary" className="whitespace-pre-line">
              {status.summary}
            </Text>
          </div>
        )}
        <a
          href={`/${lang}/terms-and-conditions`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary underline-offset-2 hover:underline"
        >
          {t("gate.read")}
          <ExternalLink aria-hidden className="size-4" />
        </a>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            text={t("gate.signOut")}
            variant="outline"
            type="button"
            size="md"
            loading={leaving}
            onClick={() => void handleLogout()}
          />
          <Button
            text={t("gate.accept")}
            type="button"
            size="md"
            loading={loading}
            onClick={() => void handleAccept()}
          />
        </div>
      </div>
    </Modal>
  );
}
