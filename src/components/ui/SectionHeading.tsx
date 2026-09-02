interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  as: Tag = "h2",
}: SectionHeadingProps) {
  const alignClasses = align === "center" ? "text-center mx-auto items-center" : "text-left";

  return (
    <div className={`flex max-w-2xl flex-col gap-3 ${alignClasses}`}>
      {eyebrow ? (
        <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-brand">
          <span className="h-px w-6 bg-brand-gold" aria-hidden="true" />
          {eyebrow}
        </span>
      ) : null}
      <Tag className="text-balance text-3xl font-semibold text-brand-ink sm:text-4xl">
        {title}
      </Tag>
      {description ? (
        <p className="text-balance text-base leading-relaxed text-brand-muted sm:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
