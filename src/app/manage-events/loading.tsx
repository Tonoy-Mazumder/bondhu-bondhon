export default function Loading() {
  const rows = Array.from({ length: 5 });

  return (
    <main className="min-h-screen bg-background px-4 py-8 sm:px-6 md:py-12">
      <div className="mx-auto w-full max-w-5xl">
        <h1 className="font-serif text-4xl font-bold text-foreground">
          Manage Events
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Edit or remove events you created.
        </p>

        <div
          role="status"
          aria-label="Loading your events"
          className="mt-6 overflow-hidden rounded-2xl border border-border bg-card"
        >
          {/* Header */}
          <div className="grid grid-cols-3 gap-4 bg-muted px-6 py-4 text-xs font-semibold text-muted-foreground">
            <span>Title</span>
            <span>Category</span>
            <span className="text-right">Actions</span>
          </div>

          {/* Rows */}
          <div className="divide-y divide-border">
            {rows.map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-4 px-6 py-4"
              >
                <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />

                <div className="h-4 w-24 animate-pulse rounded bg-muted" />

                <div className="ml-auto flex gap-2">
                  <div className="h-10 w-16 animate-pulse rounded-lg bg-muted" />

                  <div className="h-10 w-16 animate-pulse rounded-lg bg-muted" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
