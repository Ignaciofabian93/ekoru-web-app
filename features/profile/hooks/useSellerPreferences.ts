"use client";
import { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";

import {
  DEACTIVATE_ACCOUNT,
  DELETE_ACCOUNT,
  GET_MY_PREFERENCES,
  UPDATE_SELLER_PREFERENCES,
} from "@/graphql/auth/profile";
import { useTranslation } from "@/i18n/context";
import { useToast } from "@/hooks/useToast";
import type { SellerPreferences } from "@/types/user";
import { PREFERENCE_FIELDS, type PreferenceField } from "../constants/menuItems";
import { NAMESPACE } from "../i18n";

type PrefsState = Record<PreferenceField, boolean>;

export function useSellerPreferences() {
  const { t } = useTranslation(NAMESPACE);
  const toast = useToast();

  const { data } = useQuery<{
    me: { preferences?: SellerPreferences | null } | null;
  }>(GET_MY_PREFERENCES, { fetchPolicy: "cache-and-network" });
  const prefs = data?.me?.preferences ?? null;

  // Unsaved toggle overrides layered on top of the persisted preferences.
  // Deriving the effective value (rather than syncing query data into state via
  // an effect) keeps the render pure and avoids cascading re-renders.
  const [overrides, setOverrides] = useState<Partial<PrefsState>>({});

  const state = useMemo<PrefsState>(() => {
    const result = {} as PrefsState;
    for (const f of PREFERENCE_FIELDS) {
      result[f] = overrides[f] ?? prefs?.[f] ?? false;
    }
    return result;
  }, [overrides, prefs]);

  const toggle = useCallback((field: PreferenceField, value: boolean) => {
    setOverrides((o) => ({ ...o, [field]: value }));
  }, []);

  // Save is enabled only when an override actually differs from what's persisted.
  const dirty = useMemo(() => {
    if (!prefs) return false;
    return PREFERENCE_FIELDS.some(
      (f) => f in overrides && overrides[f] !== prefs[f],
    );
  }, [overrides, prefs]);

  const [updatePrefs, { loading: saving }] = useMutation(
    UPDATE_SELLER_PREFERENCES,
  );
  const save = useCallback(async () => {
    try {
      await updatePrefs({ variables: { input: state } });
      setOverrides({});
      toast.success(t("settings.savedSuccess"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("settings.saveError"));
    }
  }, [updatePrefs, state, toast, t]);

  const [deactivate, { loading: deactivating }] = useMutation(DEACTIVATE_ACCOUNT);
  const deactivateAccount = useCallback(async () => {
    try {
      await deactivate();
      toast.success(t("settings.deactivatedSuccess"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("settings.saveError"));
    }
  }, [deactivate, toast, t]);

  // Returns whether the deletion succeeded so the caller can then sign the user
  // out and redirect (the account is anonymised + locked server-side).
  const [remove, { loading: deleting }] = useMutation(DELETE_ACCOUNT);
  const deleteAccount = useCallback(async (): Promise<boolean> => {
    try {
      await remove();
      toast.success(t("settings.deletedSuccess"));
      return true;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : t("settings.deleteError"));
      return false;
    }
  }, [remove, toast, t]);

  return {
    state,
    toggle,
    dirty,
    save,
    saving,
    deactivateAccount,
    deactivating,
    deleteAccount,
    deleting,
  };
}
