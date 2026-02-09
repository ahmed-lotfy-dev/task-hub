"use client";

const integrations = [
  "Slack",
  "GitHub",
  "Linear",
  "Notion",
  "Figma",
  "Google Calendar",
  "Jira",
  "Zapier",
];

export function IntegrationsSection() {
  return (
    <section className="w-full flex flex-col gap-12">
      <div className="text-center flex flex-col gap-4">
        <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
          Connect to the tools you already use
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Keep your workflow intact with clean, reliable integrations.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        {integrations.map((name) => (
          <div
            key={name}
            className="px-4 py-2 rounded-full border border-border bg-muted text-sm font-medium text-foreground"
          >
            {name}
          </div>
        ))}
      </div>
    </section>
  );
}
