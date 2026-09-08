"use client";

import { useParams, usePathname, useRouter } from "next/navigation";

import { DEFAULT_LANGUAGE, type SupportedLanguage } from "@/constants/settings";
import { useToast } from "@/hooks/useToast";
import { useTranslation } from "@/i18n/context";
import useAuthStore from "@/store/useAuthStore";

/**
 * Gate for actions that need a logged-in seller — requesting a purchase,
 * proposing an exchange, and the like.
 *
 * Anonymous users are toasted and sent to `/login?redirectTo=<here>`, the same
 * way the cart and favorites do, so the CTA stays pressable and leads
 * somewhere instead of dead-ending on a disabled button.
 */
export function useRequireAuth() {
  const seller = useAuthStore((s) => s.seller);
  const isAuthHydrated = useAuthStore((s) => s.isHydrated);
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{ lang?: SupportedLanguage }>();
  const toast = useToast();
  const { t } = useTranslation("common");
  const lang = params?.lang ?? DEFAULT_LANGUAGE;

  /**
   * True when the caller may proceed. On false it has already handled the
   * anonymous case (toast + redirect), so the caller just returns.
   */
  function requireAuth(): boolean {
    // Auth state unknown yet — ignore the press rather than misfire a redirect.
    if (!isAuthHydrated) return false;

    if (!seller) {
      const redirectTo = encodeURIComponent(pathname || `/${lang}`);
      toast.info(t("loginRequired"));
      router.push(`/${lang}/login?redirectTo=${redirectTo}`);
      return false;
    }

    return true;
  }

  return { isAuthed: Boolean(seller), isAuthHydrated, requireAuth };
}
