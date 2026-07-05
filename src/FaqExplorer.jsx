import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  X,
  ChevronDown,
  CornerDownLeft,
  Building2,
  Link2,
  Check,
  SlidersHorizontal,
  Sparkles,
  Inbox,
} from "lucide-react";
import { FAQS } from "./faqData";
import { CATEGORIES, OFFICES, getMeta, TRENDING } from "./faqMeta";
import {
  searchFaqs,
  suggest,
  relatedFaqs,
  highlightParts,
} from "./search";

/* ---------------- Highlighted text ---------------- */
function Highlight({ text, query }) {
  const parts = useMemo(() => highlightParts(text, query), [text, query]);
  return (
    <>
      {parts.map((p, i) =>
        p.hit ? (
          <mark
            key={i}
            className="rounded bg-yellow-200/80 px-0.5 text-hilcoe-text"
          >
            {p.text}
          </mark>
        ) : (
          <React.Fragment key={i}>{p.text}</React.Fragment>
        )
      )}
    </>
  );
}

/* ---------------- Reusable search box with autocomplete ---------------- */
export const SearchBox = forwardRef(function SearchBox(
  { query, setQuery, onPick, size = "md", placeholder = "Search questions…" },
  ref
) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const inputRef = useRef(null);
  const boxRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
  }));

  const suggestions = useMemo(() => suggest(query, 6), [query]);

  useEffect(() => {
    const onDocClick = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const choose = (faq) => {
    setOpen(false);
    setActive(-1);
    onPick?.(faq);
  };

  const onKeyDown = (e) => {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) setOpen(true);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, -1));
    } else if (e.key === "Enter") {
      if (active >= 0 && suggestions[active]) {
        e.preventDefault();
        choose(suggestions[active]);
      } else {
        setOpen(false);
        onPick?.(null); // submit: scroll to results
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setActive(-1);
    }
  };

  const big = size === "lg";

  return (
    <div ref={boxRef} className="relative w-full">
      <div
        className={`flex items-center gap-3 rounded-2xl border-2 bg-white transition-colors focus-within:border-hilcoe-bright ${
          big
            ? "border-white/0 px-5 py-4 shadow-2xl shadow-black/20"
            : "border-hilcoe-border px-4 py-3 shadow-sm"
        }`}
      >
        <Search
          size={big ? 24 : 20}
          className="shrink-0 text-hilcoe-muted"
          aria-hidden
        />
        <input
          ref={inputRef}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls="faq-suggestions"
          aria-autocomplete="list"
          aria-label="Search frequently asked questions"
          value={query}
          placeholder={placeholder}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActive(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={onKeyDown}
          className={`w-full bg-transparent font-medium text-hilcoe-text placeholder:text-hilcoe-muted/70 focus:outline-none ${
            big ? "text-lg" : "text-base"
          }`}
        />
        {query ? (
          <button
            aria-label="Clear search"
            onClick={() => {
              setQuery("");
              setActive(-1);
              inputRef.current?.focus();
            }}
            className="shrink-0 rounded-full p-1 text-hilcoe-muted transition hover:bg-hilcoe-soft hover:text-hilcoe-text"
          >
            <X size={big ? 22 : 18} />
          </button>
        ) : (
          <kbd className="hidden shrink-0 rounded-md border border-hilcoe-border bg-hilcoe-gray px-2 py-0.5 text-[11px] font-bold text-hilcoe-muted sm:block">
            /
          </kbd>
        )}
      </div>

      <AnimatePresence>
        {open && suggestions.length > 0 && (
          <motion.ul
            id="faq-suggestions"
            role="listbox"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-hilcoe-border bg-white text-left shadow-2xl shadow-hilcoe-blue/10"
          >
            {suggestions.map((f, i) => {
              const meta = getMeta(f.category);
              return (
                <li key={f.id} role="option" aria-selected={i === active}>
                  <button
                    onMouseEnter={() => setActive(i)}
                    onClick={() => choose(f)}
                    className={`flex w-full items-start gap-3 px-4 py-3 text-left transition ${
                      i === active ? "bg-hilcoe-soft" : "hover:bg-hilcoe-gray"
                    }`}
                  >
                    <span
                      className={`mt-1 h-2 w-2 shrink-0 rounded-full ${meta.dot}`}
                      aria-hidden
                    />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-bold text-hilcoe-text">
                        {f.question}
                      </span>
                      <span className="block truncate text-xs text-hilcoe-muted">
                        {f.category}
                      </span>
                    </span>
                    <CornerDownLeft
                      size={14}
                      className="ml-auto mt-1 shrink-0 text-hilcoe-muted/50"
                      aria-hidden
                    />
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
});

/* ---------------- Single FAQ accordion item ---------------- */
function FaqItem({ faq, query, isOpen, onToggle, onPick }) {
  const meta = getMeta(faq.category);
  const related = useMemo(() => relatedFaqs(faq, 3), [faq]);
  const [copied, setCopied] = useState(false);
  const panelId = `panel-${faq.id}`;

  const copyLink = (e) => {
    e.stopPropagation();
    const url = `${window.location.origin}${window.location.pathname}#${faq.id}`;
    navigator.clipboard?.writeText(url).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      },
      () => {}
    );
  };

  return (
    <div
      id={faq.id}
      className={`scroll-mt-28 overflow-hidden rounded-2xl border bg-white transition-colors ${
        isOpen ? "border-hilcoe-bright/50 shadow-lg shadow-hilcoe-blue/5" : "border-hilcoe-border"
      }`}
    >
      <h3>
        <button
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
          className="flex w-full items-center gap-4 px-5 py-4 text-left sm:px-6"
        >
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${meta.chip}`}
            aria-hidden
          >
            <meta.icon size={18} />
          </span>
          <span className="min-w-0 flex-1 text-[15px] font-bold leading-snug text-hilcoe-text sm:text-base">
            <Highlight text={faq.question} query={query} />
          </span>
          <ChevronDown
            size={20}
            className={`shrink-0 text-hilcoe-muted transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
            aria-hidden
          />
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            role="region"
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 sm:px-6 sm:pb-6">
              <div className="border-l-2 border-hilcoe-soft pl-4 sm:ml-12">
                <p className="text-[15px] leading-relaxed text-hilcoe-text/80">
                  <Highlight text={faq.answer} query={query} />
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold ${meta.chip}`}
                  >
                    {faq.category}
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-hilcoe-gray px-3 py-1 text-[11px] font-bold text-hilcoe-muted">
                    <Building2 size={12} /> {faq.office}
                  </span>
                  <button
                    onClick={copyLink}
                    className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-hilcoe-border px-3 py-1 text-[11px] font-bold text-hilcoe-muted transition hover:border-hilcoe-bright hover:text-hilcoe-bright"
                  >
                    {copied ? <Check size={12} /> : <Link2 size={12} />}
                    {copied ? "Copied" : "Copy link"}
                  </button>
                </div>

                {related.length > 0 && (
                  <div className="mt-5">
                    <p className="text-[11px] font-black uppercase tracking-widest text-hilcoe-muted">
                      Related questions
                    </p>
                    <div className="mt-2 flex flex-col gap-1.5">
                      {related.map((r) => (
                        <button
                          key={r.id}
                          onClick={() => onPick(r)}
                          className="group flex items-center gap-2 text-left text-sm font-semibold text-hilcoe-blue transition hover:text-hilcoe-red"
                        >
                          <span className="text-hilcoe-muted transition group-hover:translate-x-0.5 group-hover:text-hilcoe-red">
                            →
                          </span>
                          {r.question}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- Main explorer ---------------- */
const FaqExplorer = forwardRef(function FaqExplorer(
  { query, setQuery },
  ref
) {
  const [category, setCategory] = useState("All");
  const [office, setOffice] = useState("All");
  const [openIds, setOpenIds] = useState(() => new Set());
  const sectionRef = useRef(null);
  const stickySearchRef = useRef(null);

  useImperativeHandle(ref, () => ({
    scrollIntoView: () =>
      sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
    focusSearch: () => stickySearchRef.current?.focus(),
    pick: (faq) => focusFaq(faq),
    openCategory: (name) => {
      setQuery("");
      setOffice("All");
      setCategory(name);
      requestAnimationFrame(() =>
        sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      );
    },
  }));

  const results = useMemo(
    () => searchFaqs(query, { category, office }),
    [query, category, office]
  );
  const isSearching = query.trim() !== "";

  // Group results by category (used when not in relevance/search mode).
  const grouped = useMemo(() => {
    const map = new Map();
    for (const f of results) {
      if (!map.has(f.category)) map.set(f.category, []);
      map.get(f.category).push(f);
    }
    return CATEGORIES.map((c) => ({ ...c, items: map.get(c.name) || [] })).filter(
      (c) => c.items.length > 0
    );
  }, [results]);

  const toggle = (id) =>
    setOpenIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const focusFaq = (faq) => {
    if (!faq) {
      // plain submit → just reveal results
      sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    setQuery("");
    setCategory("All");
    setOffice("All");
    setOpenIds((prev) => new Set(prev).add(faq.id));
    requestAnimationFrame(() => {
      const el = document.getElementById(faq.id);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  const expandAll = () => setOpenIds(new Set(results.map((f) => f.id)));
  const collapseAll = () => setOpenIds(new Set());
  const clearFilters = () => {
    setQuery("");
    setCategory("All");
    setOffice("All");
  };

  // Deep-link: open the question referenced in the URL hash on load.
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && FAQS.some((f) => f.id === hash)) {
      setOpenIds(new Set([hash]));
      setTimeout(() => {
        document
          .getElementById(hash)
          ?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);
    }
  }, []);

  // "/" keyboard shortcut focuses the sticky search.
  useEffect(() => {
    const onKey = (e) => {
      if (
        e.key === "/" &&
        !["INPUT", "TEXTAREA"].includes(document.activeElement?.tagName)
      ) {
        e.preventDefault();
        stickySearchRef.current?.focus();
        sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const filtersActive = isSearching || category !== "All" || office !== "All";

  return (
    <section ref={sectionRef} id="faq" className="scroll-mt-20 bg-hilcoe-gray py-16 lg:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-[11px] font-black uppercase tracking-[0.35em] text-hilcoe-red">
            Help Center
          </p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-hilcoe-blue sm:text-4xl">
            How can we help you?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-hilcoe-muted sm:text-base">
            Search {FAQS.length} answered questions across {CATEGORIES.length}{" "}
            departments — or browse by topic below.
          </p>
        </div>

        {/* Sticky toolbar: search + filters */}
        <div className="sticky top-16 z-20 mt-8 rounded-3xl border border-hilcoe-border bg-white/95 p-3 shadow-lg shadow-hilcoe-blue/5 backdrop-blur sm:p-4">
          <SearchBox
            ref={stickySearchRef}
            query={query}
            setQuery={setQuery}
            onPick={focusFaq}
            placeholder="Search e.g. “reset password”, “transcript”, “GPA”…"
          />

          {/* Category pills */}
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <FilterPill
              active={category === "All"}
              onClick={() => setCategory("All")}
              label="All topics"
              count={FAQS.length}
            />
            {CATEGORIES.map((c) => (
              <FilterPill
                key={c.name}
                active={category === c.name}
                onClick={() => setCategory(category === c.name ? "All" : c.name)}
                label={c.name}
                count={c.count}
                dot={c.dot}
              />
            ))}
          </div>

          {/* Office filter + clear */}
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <label className="inline-flex items-center gap-2 text-xs font-bold text-hilcoe-muted">
              <SlidersHorizontal size={14} />
              Office
            </label>
            <div className="relative">
              <select
                value={office}
                onChange={(e) => setOffice(e.target.value)}
                aria-label="Filter by responsible office"
                className="appearance-none rounded-full border border-hilcoe-border bg-white py-1.5 pl-3 pr-8 text-xs font-bold text-hilcoe-text focus:border-hilcoe-bright focus:outline-none"
              >
                <option value="All">All offices</option>
                {OFFICES.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-hilcoe-muted"
              />
            </div>
            {filtersActive && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-1 rounded-full bg-hilcoe-soft px-3 py-1.5 text-xs font-bold text-hilcoe-blue transition hover:bg-hilcoe-blue hover:text-white"
              >
                <X size={12} /> Clear
              </button>
            )}
          </div>
        </div>

        {/* Trending chips (only when idle) */}
        {!filtersActive && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-hilcoe-muted">
              <Sparkles size={14} className="text-hilcoe-red" /> Trending
            </span>
            {TRENDING.map((t) => (
              <button
                key={t}
                onClick={() => setQuery(t)}
                className="rounded-full border border-hilcoe-border bg-white px-3 py-1.5 text-xs font-bold text-hilcoe-blue transition hover:border-hilcoe-bright hover:bg-hilcoe-soft"
              >
                {t}
              </button>
            ))}
          </div>
        )}

        {/* Results header */}
        <div className="mt-8 flex items-center justify-between gap-4">
          <p className="text-sm font-bold text-hilcoe-text">
            {results.length}{" "}
            <span className="text-hilcoe-muted">
              {results.length === 1 ? "result" : "results"}
              {isSearching && (
                <>
                  {" "}
                  for “<span className="text-hilcoe-blue">{query}</span>”
                </>
              )}
            </span>
          </p>
          {results.length > 0 && (
            <div className="flex items-center gap-3 text-xs font-bold">
              <button
                onClick={expandAll}
                className="text-hilcoe-muted transition hover:text-hilcoe-blue"
              >
                Expand all
              </button>
              <span className="text-hilcoe-border">|</span>
              <button
                onClick={collapseAll}
                className="text-hilcoe-muted transition hover:text-hilcoe-blue"
              >
                Collapse all
              </button>
            </div>
          )}
        </div>

        {/* Results */}
        {results.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-dashed border-hilcoe-border bg-white py-16 text-center">
            <Inbox size={40} className="mx-auto text-hilcoe-muted/40" />
            <p className="mt-4 text-lg font-black text-hilcoe-blue">
              No matching questions
            </p>
            <p className="mt-1 text-sm text-hilcoe-muted">
              Try different keywords or clear your filters.
            </p>
            <button
              onClick={clearFilters}
              className="mt-6 rounded-full bg-hilcoe-blue px-6 py-2.5 text-xs font-black uppercase tracking-widest text-white transition hover:bg-hilcoe-red"
            >
              Reset search
            </button>
          </div>
        ) : isSearching ? (
          // Flat, relevance-ranked list
          <div className="mt-5 flex flex-col gap-3">
            {results.map((f) => (
              <FaqItem
                key={f.id}
                faq={f}
                query={query}
                isOpen={openIds.has(f.id)}
                onToggle={() => toggle(f.id)}
                onPick={focusFaq}
              />
            ))}
          </div>
        ) : (
          // Grouped by category
          <div className="mt-5 flex flex-col gap-10">
            {grouped.map((c) => (
              <div key={c.name}>
                <div className="mb-3 flex items-center gap-3">
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-2xl ${c.chip}`}
                  >
                    <c.icon size={20} />
                  </span>
                  <div>
                    <h3 className="text-lg font-black tracking-tight text-hilcoe-blue">
                      {c.name}
                    </h3>
                    <p className="text-xs text-hilcoe-muted">{c.blurb}</p>
                  </div>
                  <span className="ml-auto rounded-full bg-hilcoe-soft px-2.5 py-1 text-xs font-bold text-hilcoe-blue">
                    {c.items.length}
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  {c.items.map((f) => (
                    <FaqItem
                      key={f.id}
                      faq={f}
                      query={query}
                      isOpen={openIds.has(f.id)}
                      onToggle={() => toggle(f.id)}
                      onPick={focusFaq}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
});

function FilterPill({ active, onClick, label, count, dot }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-bold transition ${
        active
          ? "border-hilcoe-blue bg-hilcoe-blue text-white"
          : "border-hilcoe-border bg-white text-hilcoe-text hover:border-hilcoe-bright hover:bg-hilcoe-soft"
      }`}
    >
      {dot && (
        <span
          className={`h-2 w-2 rounded-full ${active ? "bg-white" : dot}`}
          aria-hidden
        />
      )}
      {label}
      <span
        className={`rounded-full px-1.5 py-0.5 text-[10px] ${
          active ? "bg-white/20" : "bg-hilcoe-soft text-hilcoe-muted"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

export default FaqExplorer;
