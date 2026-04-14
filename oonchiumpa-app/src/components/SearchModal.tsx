import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchIndex, type SearchItem } from "../hooks/useSearchIndex";

const kindLabel: Record<SearchItem["kind"], string> = {
  page: "Page",
  service: "Service",
  blog: "Blog",
};

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { fuse, items } = useSearchIndex();
  const navigate = useNavigate();

  const results: SearchItem[] = query.trim().length < 2
    ? items.filter((i) => i.kind === "page").slice(0, 6)
    : fuse.search(query, { limit: 8 }).map((r) => r.item);

  useEffect(() => {
    if (open) {
      setQuery("");
      setHighlight(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  useEffect(() => setHighlight(0), [query]);

  if (!open) return null;

  const pick = (item: SearchItem) => {
    navigate(item.path);
    onClose();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => Math.min(h + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter" && results[highlight]) {
      e.preventDefault();
      pick(results[highlight]);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] bg-earth-950/60 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-earth-100 px-5 py-4">
          <svg className="w-5 h-5 text-earth-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search pages, services, articles…"
            className="flex-1 text-base text-earth-950 placeholder-earth-400 focus:outline-none"
          />
          <kbd className="hidden sm:inline-block text-xs text-earth-500 border border-earth-200 rounded px-1.5 py-0.5">Esc</kbd>
        </div>

        <ul className="max-h-96 overflow-y-auto py-2">
          {results.length === 0 ? (
            <li className="px-5 py-8 text-center text-earth-500 text-sm">
              No results for "{query}".
            </li>
          ) : (
            results.map((item, i) => (
              <li key={`${item.path}-${item.title}`}>
                <button
                  onClick={() => pick(item)}
                  onMouseEnter={() => setHighlight(i)}
                  className={`w-full text-left px-5 py-3 flex items-start gap-3 transition-colors ${
                    i === highlight ? "bg-ochre-50" : "hover:bg-earth-50"
                  }`}
                >
                  <span className="text-[10px] uppercase tracking-[0.18em] text-ochre-600 font-semibold pt-1 w-14 flex-none">
                    {kindLabel[item.kind]}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-semibold text-earth-950 truncate">
                      {item.title}
                    </span>
                    {item.summary && (
                      <span className="block text-xs text-earth-600 truncate mt-0.5">
                        {item.summary}
                      </span>
                    )}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>

        <div className="border-t border-earth-100 px-5 py-2.5 text-xs text-earth-500 flex items-center justify-between">
          <span>↑↓ navigate · ↵ open · esc close</span>
          <span>{results.length} result{results.length === 1 ? "" : "s"}</span>
        </div>
      </div>
    </div>
  );
}
