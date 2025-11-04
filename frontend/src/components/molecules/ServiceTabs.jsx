import { useState } from "react";

export default function ServiceTabs({ description, features }) {
  const [tab, setTab] = useState("desc");

  return (
    <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
      <div className="flex gap-2 p-2">
        <button
          type="button"
          onClick={() => setTab("desc")}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium ${
            tab === "desc"
              ? "bg-[#1f5eff] text-white"
              : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
          }`}
        >
          Deskripsi
        </button>
        <button
          type="button"
          onClick={() => setTab("feat")}
          className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium ${
            tab === "feat"
              ? "bg-[#1f5eff] text-white"
              : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
          }`}
        >
          Fitur
        </button>
      </div>

      <div className="p-4 sm:p-5 text-sm leading-6 text-neutral-800">
        {tab === "desc" ? (
          <div>{description}</div>
        ) : (
          <ul className="list-disc pl-5 space-y-2">
            {features?.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
