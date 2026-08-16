import clsx from "clsx";

/**
 * Cross-multiplies a base class with a variant map and a size map into the
 * nested lookup the primitives expose: `xClass[variant][size]`.
 *
 * Every combination is a complete literal in the generated module, so Tailwind's
 * scanner still sees each class — nothing here is built from runtime fragments.
 */
export function cross<V extends string, S extends string>(
  base: string,
  variants: Record<V, string>,
  sizes: Record<S, string>,
): Record<V, Record<S, string>> {
  return Object.fromEntries(
    (Object.keys(variants) as V[]).map((variant) => [
      variant,
      Object.fromEntries(
        (Object.keys(sizes) as S[]).map((size) => [
          size,
          clsx(base, sizes[size], variants[variant]),
        ]),
      ),
    ]),
  ) as Record<V, Record<S, string>>;
}

/**
 * One-axis version of `cross`, for components with a variant/tone but no size
 * scale: `xClass[variant]`.
 */
export function single<V extends string>(
  base: string,
  variants: Record<V, string>,
): Record<V, string> {
  return Object.fromEntries(
    (Object.keys(variants) as V[]).map((variant) => [
      variant,
      clsx(base, variants[variant]),
    ]),
  ) as Record<V, string>;
}

/**
 * `cross` for a single state that replaces the variant axis entirely — an error
 * border, a checked box. Returns just the size map for that one state.
 */
export function crossState<S extends string>(
  base: string,
  state: string,
  sizes: Record<S, string>,
): Record<S, string> {
  return cross(base, { state }, sizes).state;
}
