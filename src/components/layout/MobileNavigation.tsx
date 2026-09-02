"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { X } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import { Button } from "@/components/ui/Button";

interface MobileNavigationProps {
  open: boolean;
  onClose: () => void;
}

export function MobileNavigation({ open, onClose }: MobileNavigationProps) {
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true">
      <button
        aria-label="Close menu"
        className="absolute inset-0 bg-brand-ink/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute inset-y-0 right-0 flex w-[86%] max-w-sm flex-col gap-8 bg-white px-6 py-6 shadow-xl">
        <div className="flex items-center justify-between">
          <span className="text-base font-semibold text-brand-deep">Menu</span>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-10 w-10 items-center justify-center rounded-full text-brand-deep hover:bg-brand-light"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <nav aria-label="Mobile" className="flex flex-col gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`rounded-lg px-3 py-3 text-base font-medium transition-colors ${
                  isActive
                    ? "bg-brand-light text-brand-deep"
                    : "text-brand-ink hover:bg-brand-light/70"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <Button href="/get-involved" size="lg" className="mt-auto justify-center">
          Join Us
        </Button>
      </div>
    </div>
  );
}
