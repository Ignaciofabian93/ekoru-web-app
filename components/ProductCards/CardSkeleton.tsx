import { Skeleton } from "@/components/Primitives";
import { skeletonStyles } from "./styles";

export default function CardSkeleton() {
  return (
    <div aria-hidden className={skeletonStyles.card}>
      <div className={skeletonStyles.media}>
        <Skeleton radius="xl" className={skeletonStyles.mediaBlock} />
      </div>
      <div className={skeletonStyles.body}>
        <Skeleton radius="md" className={skeletonStyles.price} />
        <Skeleton radius="md" className={skeletonStyles.line} />
        <Skeleton radius="md" className={skeletonStyles.shortLine} />
      </div>
      <div className={skeletonStyles.footer}>
        <Skeleton radius="md" className={skeletonStyles.browse} />
      </div>
    </div>
  );
}

/** Fills the back face while its chunk loads on the first flip. */
export function BackSideSkeleton() {
  return (
    <div aria-hidden className={skeletonStyles.back}>
      <Skeleton radius="md" className={skeletonStyles.backTitle} />
      <Skeleton radius="md" count={3} className={skeletonStyles.backLine} />
      <Skeleton radius="full" className={skeletonStyles.backAvatar} />
    </div>
  );
}
