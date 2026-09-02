import { Compass, Target } from "lucide-react";
import { Container } from "@/components/ui/Container";
import type { SiteSettings } from "@/types";

export function MissionVisionSection({ settings }: { settings: SiteSettings }) {
  if (!settings.mission && !settings.vision) return null;

  return (
    <section className="relative overflow-hidden bg-brand-deep py-16 sm:py-20">
      <div className="leaf-pattern pointer-events-none absolute inset-0 opacity-40" aria-hidden="true" />
      <Container className="relative grid grid-cols-1 gap-8 md:grid-cols-2">
        {settings.mission ? (
          <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gold/20 text-brand-gold">
              <Target className="h-5 w-5" aria-hidden="true" />
            </span>
            <h3 className="text-xl font-semibold text-white">Our Mission</h3>
            <p className="leading-relaxed text-white/80">{settings.mission}</p>
          </div>
        ) : null}

        {settings.vision ? (
          <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gold/20 text-brand-gold">
              <Compass className="h-5 w-5" aria-hidden="true" />
            </span>
            <h3 className="text-xl font-semibold text-white">Our Vision</h3>
            <p className="leading-relaxed text-white/80">{settings.vision}</p>
          </div>
        ) : null}
      </Container>
    </section>
  );
}
