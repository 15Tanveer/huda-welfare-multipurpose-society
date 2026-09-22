"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { ResourceRow } from "@/types/database";
import { RESOURCE_CATEGORIES, RESOURCE_SCOPES, RESOURCE_TYPES } from "@/lib/resources-config";
import { EmptyState } from "@/components/ui/EmptyState";
import { inputClasses } from "@/components/ui/FormField";
import { Container } from "@/components/ui/Container";
import { StickyFilterBar } from "@/components/ui/StickyFilterBar";
import { ChipScroller } from "@/components/ui/ChipScroller";
import { ResourceCard } from "@/components/resources/ResourceCard";

// Compact, auto-width variant of the shared field styling: these sit
// side by side in one scrollable row rather than stacking full-width.
const filterSelectClasses =
  "shrink-0 rounded-lg border border-brand-ink/15 bg-white px-3 py-2 text-sm text-brand-ink transition-colors focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20";

export function ResourcesExplorer({ resources }: { resources: ResourceRow[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [scope, setScope] = useState("");

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return resources.filter((r) => {
      if (category && r.category !== category) return false;
      if (type && r.resource_type !== type) return false;
      if (scope && r.scope !== scope) return false;
      if (!query) return true;
      return (
        r.title.toLowerCase().includes(query) ||
        r.short_description.toLowerCase().includes(query) ||
        (r.audience?.toLowerCase().includes(query) ?? false) ||
        r.audience_tags.some((tag) => tag.toLowerCase().includes(query)) ||
        r.category.toLowerCase().includes(query)
      );
    });
  }, [resources, search, category, type, scope]);

  if (resources.length === 0) {
    return (
      <Container className="py-16 sm:py-20">
        <EmptyState
          title="Resources are being curated"
          description="HUDA is putting together a verified list of useful schemes, scholarships and opportunities. Check back soon."
        />
      </Container>
    );
  }

  return (
    <>
      <StickyFilterBar>
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-brand-muted"
            aria-hidden="true"
          />
          <label htmlFor="resource-search" className="sr-only">
            Search resources
          </label>
          <input
            id="resource-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search schemes, scholarships and opportunities…"
            className={`${inputClasses} pl-10`}
          />
        </div>

        {/* One scrollable row rather than three stacked full-width
            selects, so the pinned bar stays shallow on a phone. */}
        <ChipScroller label="Filter resources">
          <label htmlFor="resource-category" className="sr-only">
            Filter by category
          </label>
          <select
            id="resource-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={filterSelectClasses}
          >
            <option value="">All Categories</option>
            {RESOURCE_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>

          <label htmlFor="resource-type" className="sr-only">
            Filter by resource type
          </label>
          <select
            id="resource-type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className={filterSelectClasses}
          >
            <option value="">All Types</option>
            {RESOURCE_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>

          <label htmlFor="resource-scope" className="sr-only">
            Filter by scope
          </label>
          <select
            id="resource-scope"
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            className={filterSelectClasses}
          >
            <option value="">All Scopes</option>
            {RESOURCE_SCOPES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </ChipScroller>
      </StickyFilterBar>

      <Container className="py-8 sm:py-12">
        {filtered.length === 0 ? (
          <EmptyState
            title="No matching resources"
            description="Try a different search term or clear the filters."
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
