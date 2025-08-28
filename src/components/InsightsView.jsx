import React, { useMemo } from "react";

function InsightsCard({ title, value, sub, accentClass = "bg-sky-500" }) {
  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-4 bg-white dark:bg-slate-900">
      <div className="flex items-center gap-3">
        <span className={`w-2 h-8 rounded-full ${accentClass}`}></span>
        <div className="flex-1">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {title}
          </div>
          <div className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            {value}
          </div>
          {sub && (
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {sub}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TopTags({ tagsCount }) {
  const items = Object.entries(tagsCount)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);
  if (items.length === 0)
    return (
      <div className="text-xs text-slate-500 dark:text-slate-400">
        No tags yet
      </div>
    );
  return (
    <div className="flex flex-wrap gap-2">
      {items.map(([tag, count]) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
        >
          #{tag}
          <span className="text-[10px] text-slate-500 dark:text-slate-400">
            {count}
          </span>
        </span>
      ))}
    </div>
  );
}

function UpcomingList({ items }) {
  if (items.length === 0)
    return (
      <div className="text-xs text-slate-500 dark:text-slate-400">
        Nothing scheduled
      </div>
    );
  return (
    <ul className="space-y-2">
      {items.map((n) => (
        <li key={n.id} className="flex items-center justify-between text-xs">
          <span className="truncate text-slate-700 dark:text-slate-200 max-w-[65%]">
            {n.title || "Untitled"}
          </span>
          <span className="text-slate-500 dark:text-slate-400">
            {new Date(n.dueAt).toLocaleDateString(undefined, {
              month: "short",
              day: "numeric",
            })}
          </span>
        </li>
      ))}
    </ul>
  );
}

function InsightsView({ notes }) {
  const data = useMemo(() => {
    const total = notes.length;
    const notesOnly = notes.filter((n) => (n.category || "notes") === "notes");
    const todos = notes.filter((n) => (n.category || "notes") === "todo");
    const done = todos.filter((n) => n.status === "done").length;
    const inProgress = todos.filter((n) => n.status === "in-progress").length;
    const todoOpen = todos.filter(
      (n) => (n.status || "todo") === "todo"
    ).length;
    const tagsCount = {};
    notes.forEach((n) =>
      (n.tags || []).forEach((t) => {
        tagsCount[t] = (tagsCount[t] || 0) + 1;
      })
    );
    const now = Date.now();
    const weekMs = 7 * 24 * 60 * 60 * 1000;
    const upcoming = notes
      .filter(
        (n) =>
          typeof n.dueAt === "number" &&
          n.dueAt &&
          n.dueAt >= now &&
          n.dueAt <= now + weekMs
      )
      .sort((a, b) => a.dueAt - b.dueAt)
      .slice(0, 8);
    const overdue = notes.filter(
      (n) => typeof n.dueAt === "number" && n.dueAt && n.dueAt < now
    ).length;
    return {
      total,
      notesOnly: notesOnly.length,
      todos: todos.length,
      done,
      inProgress,
      todoOpen,
      tagsCount,
      upcoming,
      overdue,
    };
  }, [notes]);

  return (
    <div className="h-full overflow-y-auto p-3 sm:p-4 md:p-6 bg-white dark:bg-slate-950">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4 mb-4">
        <InsightsCard
          title="All items"
          value={data.total}
          accentClass="bg-slate-500"
        />
        <InsightsCard
          title="Notes"
          value={data.notesOnly}
          accentClass="bg-purple-500"
        />
        <InsightsCard
          title="Todos"
          value={data.todos}
          accentClass="bg-sky-500"
        />
        <InsightsCard
          title="In Progress"
          value={data.inProgress}
          accentClass="bg-amber-500"
        />
        <InsightsCard
          title="Done"
          value={data.done}
          accentClass="bg-emerald-500"
        />
        <InsightsCard
          title="Overdue"
          value={data.overdue}
          accentClass="bg-rose-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
        <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-4 bg-white dark:bg-slate-900">
          <h3 className="text-sm font-medium mb-3 text-slate-900 dark:text-slate-100">
            Top Tags
          </h3>
          <TopTags tagsCount={data.tagsCount} />
        </div>

        <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-4 bg-white dark:bg-slate-900">
          <h3 className="text-sm font-medium mb-3 text-slate-900 dark:text-slate-100">
            Upcoming (7 days)
          </h3>
          <UpcomingList items={data.upcoming} />
        </div>
      </div>
    </div>
  );
}

export default InsightsView;
