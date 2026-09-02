import { Container } from "@/components/ui/Container";

export default function ProgramsLoading() {
  return (
    <Container className="flex flex-col gap-8 py-16 sm:py-20">
      <div className="h-10 w-64 animate-pulse rounded-full bg-brand-light/60" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-3 overflow-hidden rounded-2xl border border-brand-ink/8">
            <div className="aspect-[16/10] w-full animate-pulse bg-brand-light/50" />
            <div className="flex flex-col gap-2 p-5">
              <div className="h-4 w-20 animate-pulse rounded bg-brand-light/60" />
              <div className="h-5 w-3/4 animate-pulse rounded bg-brand-light/60" />
              <div className="h-4 w-full animate-pulse rounded bg-brand-light/40" />
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
