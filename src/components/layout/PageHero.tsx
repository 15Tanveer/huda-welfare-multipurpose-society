import type { ReactNode } from "react";
import { Container } from "@/components/ui/Container";

interface PageHeroProps {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
}

export function PageHero({ eyebrow, title, description, children }: PageHeroProps) {
  return (
    <section className="leaf-pattern relative overflow-hidden border-b border-brand/10 bg-brand-deep">
      <div
        className="absolute inset-0 bg-gradient-to-br from-brand-deep via-brand-deep to-brand"
        aria-hidden="true"
      />
      <Container className="relative flex flex-col gap-4 py-16 sm:py-20">
        {eyebrow ? (
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-brand-light">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-gold" aria-hidden="true" />
            {eyebrow}
          </span>
        ) : null}
        <h1 className="max-w-2xl text-balance text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="max-w-2xl text-balance text-base leading-relaxed text-white/80 sm:text-lg">
            {description}
          </p>
        ) : null}
        {children}
      </Container>
    </section>
  );
}
