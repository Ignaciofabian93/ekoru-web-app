"use client";
import { DEFAULT_LANGUAGE, type SupportedLanguage } from "@/constants/settings";
import { GET_MATERIALS } from "@/graphql/stores/queries";
import { useQuery } from "@apollo/client/react";
import { useParams } from "next/navigation";
import { useMemo } from "react";

// Shape mirrors the `materials` query (label is pre-translated by the stores
// subgraph based on the `language` variable).
type Material = { id: number; materialType: string; label: string };

export interface MaterialsState {
  loading: boolean;
  /** Select-ready options: value is the material id (as string), label localized. */
  options: { value: string; label: string }[];
  /** Resolve a material id back to its localized label (for the review step). */
  labelFor: (id: string) => string;
}

/** Fetches the catalog of material types for the composition picker. Only runs
 *  for store listings (via `enabled`). */
export function useMaterials(enabled: boolean): MaterialsState {
  const params = useParams<{ lang?: SupportedLanguage }>();
  const lang = params.lang ?? DEFAULT_LANGUAGE;
  const language = lang.toUpperCase() as "ES" | "EN" | "FR";

  const { data, loading } = useQuery<{ materials: Material[] }>(GET_MATERIALS, {
    variables: { language },
    fetchPolicy: "cache-first",
    skip: !enabled,
  });

  const materials = useMemo(() => data?.materials ?? [], [data]);

  const options = useMemo(
    () => materials.map((m) => ({ value: String(m.id), label: m.label })),
    [materials],
  );

  const labelFor = useMemo(() => {
    const map = new Map(materials.map((m) => [String(m.id), m.label]));
    return (id: string) => map.get(id) ?? "";
  }, [materials]);

  return { loading, options, labelFor };
}
