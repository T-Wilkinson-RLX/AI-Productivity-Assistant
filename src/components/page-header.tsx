import { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  description,
  icon,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="mb-6 flex items-start gap-4">
      {icon && (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-brand shadow-glow text-white">
          {icon}
        </div>
      )}
      <div>
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-1 text-3xl font-bold text-foreground">{title}</h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}

export function AIDisclaimer() {
  return (
    <p className="mt-4 text-xs text-muted-foreground">
      ⚠ AI-generated content may be inaccurate. Always review and edit before using in
      professional contexts.
    </p>
  );
}
