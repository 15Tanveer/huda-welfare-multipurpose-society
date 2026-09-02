import { Container } from "@/components/ui/Container";

export default function GalleryLoading() {
  return (
    <Container className="flex flex-col gap-8 py-16 sm:py-20">
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-9 w-24 animate-pulse rounded-full bg-brand-light/60" />
        ))}
      </div>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-xl bg-brand-light/50"
            style={{ height: `${180 + (i % 3) * 60}px` }}
          />
        ))}
      </div>
    </Container>
  );
}
