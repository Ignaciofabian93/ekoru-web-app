import { Grid } from "@/components/Layout";
import { Skeleton, type SkeletonRadius } from "@/components/Primitives/Skeleton";

type Cols = 1 | 2 | 3 | 4 | 5 | 6;

export interface SkeletonGridProps {
  count?: number;
  cols?: Cols;
  sm?: Cols;
  md?: Cols;
  lg?: Cols;
  /** Tailwind sizing for each cell, e.g. "aspect-3/4 w-full" or "h-52". */
  itemClassName?: string;
  radius?: SkeletonRadius;
}

/**
 * A grid of loading placeholders. `aria-busy` sits on the wrapper so the
 * pending state is announced once rather than per cell.
 *
 * `Patterns/ResultsGrid` already renders this shape for catalog results — reach
 * for `SkeletonGrid` in the grids that aren't result lists.
 */
export function SkeletonGrid({
  count = 8,
  cols = 2,
  sm = 3,
  md = 4,
  lg = 5,
  itemClassName = "aspect-3/4 w-full",
  radius = "xl",
}: SkeletonGridProps) {
  return (
    <div aria-busy="true">
      <Grid cols={cols} sm={sm} md={md} lg={lg} gap={4}>
        {Array.from({ length: count }, (_, i) => (
          <Skeleton key={i} radius={radius} className={itemClassName} />
        ))}
      </Grid>
    </div>
  );
}
