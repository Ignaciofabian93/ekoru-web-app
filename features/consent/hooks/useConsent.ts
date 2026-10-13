"use client";
import { create } from "zustand";
import { getCookie, setCookie } from "@/utils/cookies";
import {
  allows,
  CONSENT_COOKIE,
  CONSENT_MAX_AGE_SECONDS,
  CONSENT_VERSION,
  parseConsent,
  serializeConsent,
  type ConsentCategory,
  type ConsentChoice,
} from "../consent";

interface ConsentState {
  choice: ConsentChoice | null;
  /** The cookie has been read; false during SSR and the first render. */
  loaded: boolean;
  /** The visitor reopened their choice from the footer. */
  reopened: boolean;
  load: () => void;
  decide: (accept: boolean) => void;
  reopen: () => void;
}

/** One answer for the whole page: the banner, the footer link and any script gate. */
export const useConsentStore = create<ConsentState>()((set) => ({
  choice: null,
  loaded: false,
  reopened: false,
  load: () => set({ choice: parseConsent(getCookie(CONSENT_COOKIE)), loaded: true }),
  decide: (accept) => {
    const choice: ConsentChoice = { analytics: accept, version: CONSENT_VERSION };
    setCookie(CONSENT_COOKIE, serializeConsent(choice), CONSENT_MAX_AGE_SECONDS);
    set({ choice, reopened: false });
  },
  reopen: () => set({ reopened: true }),
}));

/** Whether something in `category` may run now. For WEB-19's analytics loader. */
export const useConsentAllows = (category: ConsentCategory) =>
  useConsentStore((state) => allows(state.choice, category));
