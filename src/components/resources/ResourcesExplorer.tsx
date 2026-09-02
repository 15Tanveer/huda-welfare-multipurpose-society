"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { ResourceRow } from "@/types/database";
import { RESOURCE_CATEGORIES, RESOURCE_SCOPES, RESOURCE_TYPES } from "@/lib/resources-config";
import { EmptyState } from "@/components/ui/EmptyState";
import { inputClasses } from "@/components/ui/FormField";
import { ResourceCard } from "@/components/resources/ResourceCard";

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
        r.category.toLowerCase().includes(query)
      );
    });
  }, [resources, search, category, type, scope]);

  if (resources.length === 0) {
    return (
      <EmptyState
        title="Resources are being curated"
        description="HUDA is putting together a verified list of useful schemes, scholarships and opportunities. Check back soon."
      />
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
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

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <label htmlFor="resource-category" className="sr-only">
              Filter by category
            </label>
            <select
              id="resource-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputClasses}
            >
              <option value="">All Categories</option>
              {RESOURCE_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="resource-type" className="sr-only">
              Filter by resource type
            </label>
            <select
              id="resource-type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={inputClasses}
            >
              <option value="">All Types</option>
              {RESOURCE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="resource-scope" className="sr-only">
              Filter by scope
            </label>
            <select
              id="resource-scope"
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              className={inputClasses}
            >
              <option value="">All Scopes</option>
              {RESOURCE_SCOPES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

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
    </div>
  );
}
