"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/layout/Logo";
import { MobileNavigation } from "@/components/layout/MobileNavigation";

export function Header({ shortName }: { shortName: string }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 border-b bg-white/95 backdrop-blur transition-shadow duration-200 ${
          scrolled ? "border-brand/10 shadow-sm" : "border-transparent"
        }`}
      >
        <Container
          className={`flex items-center justify-between transition-[padding] duration-200 ${
            scrolled ? "py-2.5" : "py-4"
          }`}
        >
          <Logo shortName={shortName} />

          <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "text-brand-deep bg-brand-light"
                      : "text-brand-ink/80 hover:text-brand-deep hover:bg-brand-light/60"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Button href="/get-involved" size="sm" className="hidden md:inline-flex">
              Join Us
            </Button>
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="flex h-10 w-10 items-center justify-center rounded-full text-brand-deep hover:bg-brand-light md:hidden"
            >
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </Container>
      </header>

      {/*
       * Rendered as a sibling of <header>, not a descendant — the header's
       * `backdrop-blur` (backdrop-filter) establishes a new containing
       * block for `position: fixed` descendants per the CSS spec, which
       * was shrinking this dialog down to the header's own height instead
       * of the full viewport.
       */}
      <MobileNavigation open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
