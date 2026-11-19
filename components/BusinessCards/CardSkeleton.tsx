import { Skeleton } from "@/components/Primitives";
import { skeletonStyles } from "./styles";

export default function CardSkeleton() {
  return (
    <div aria-hidden className={skeletonStyles.card}>
      <Skeleton radius="none" className={skeletonStyles.cover} />
      <div className={skeletonStyles.logoWrap}>
        <Skeleton radius="xl" className={skeletonStyles.logo} />
      </div>
      <div className={skeletonStyles.body}>
        <Skeleton radius="md" className={skeletonStyles.name} />
        <Skeleton radius="md" className={skeletonStyles.line} />
        <Skeleton radius="md" className={skeletonStyles.shortLine} />
        <Skeleton radius="md" className={skeletonStyles.footer} />
      </div>
    </div>
  );
}
