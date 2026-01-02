import React from "react";

export default function PathCards({ paths }) {
  return (
    <div className="mx-auto mt-6 grid w-full max-w-5xl gap-4 md:grid-cols-2">
      {paths.map((path) => (
        <div
          key={path.title}
          className="rounded-none border border-black/15 dark:border-white/15 p-5 transition hover:shadow-md relative"
        >
          <span className="absolute left-0 top-0 h-2 w-2 border-l border-t border-black/40 dark:border-white/40" />
          <div className="text-xs uppercase tracking-[0.2em] text-slate-500">
            {path.audience}
          </div>
          <h3 className="mt-2 font-semibold text-lg">{path.title}</h3>
          <div className="mt-2 text-sm opacity-80">
            {path.steps.join(" → ")}
          </div>
        </div>
      ))}
    </div>
  );
}
