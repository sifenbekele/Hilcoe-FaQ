import { FAQS } from "./faqData";

const STOP = new Set(
  "the a an and or to of for in on at is are do i my me you your can how what where when who why which with be may will it that this".split(
    " "
  )
);

export const tokenize = (s) =>
  (s || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP.has(w));

// Score a single FAQ against the query terms.
function scoreFaq(faq, terms, rawQuery) {
  const q = faq.question.toLowerCase();
  const a = faq.answer.toLowerCase();
  let score = 0;

  if (rawQuery && q.includes(rawQuery)) score += 60; // strong phrase match in question
  if (rawQuery && a.includes(rawQuery)) score += 20;

  for (const t of terms) {
    if (q.includes(t)) score += 10;
    if (faq.keywords.includes(t)) score += 6;
    if (a.includes(t)) score += 3;
    // prefix match (autocomplete-friendly)
    if (faq.keywords.some((k) => k.startsWith(t))) score += 2;
    if (q.split(/\s+/).some((w) => w.startsWith(t))) score += 2;
  }
  return score;
}

// Full search with optional category/office filters. Returns scored, sorted FAQs.
export function searchFaqs(query, { category = "All", office = "All" } = {}) {
  const rawQuery = (query || "").trim().toLowerCase();
  const terms = tokenize(rawQuery);

  let pool = FAQS;
  if (category !== "All") pool = pool.filter((f) => f.category === category);
  if (office !== "All") pool = pool.filter((f) => f.office === office);

  if (!rawQuery) return pool.map((f) => ({ ...f, _score: 0 }));

  return pool
    .map((f) => ({ ...f, _score: scoreFaq(f, terms, rawQuery) }))
    .filter((f) => f._score > 0)
    .sort((a, b) => b._score - a._score || a.question.localeCompare(b.question));
}

// Autocomplete suggestions (question-level), ranked.
export function suggest(query, limit = 6) {
  const rawQuery = (query || "").trim().toLowerCase();
  if (rawQuery.length < 2) return [];
  const terms = tokenize(rawQuery);
  return FAQS.map((f) => ({ faq: f, score: scoreFaq(f, terms, rawQuery) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.faq);
}

// Related questions: same category, highest keyword overlap, excluding self.
export function relatedFaqs(faq, limit = 3) {
  const set = new Set(faq.keywords);
  return FAQS.filter((f) => f.id !== faq.id && f.category === faq.category)
    .map((f) => ({
      faq: f,
      overlap: f.keywords.filter((k) => set.has(k)).length,
    }))
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, limit)
    .map((x) => x.faq);
}

// Split a string into segments marking matches of any term, for <mark> highlighting.
export function highlightParts(text, query) {
  const terms = Array.from(new Set(tokenize(query))).filter((t) => t.length > 1);
  if (!terms.length) return [{ text, hit: false }];
  const escaped = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const re = new RegExp(`(${escaped.join("|")})`, "gi");
  const termSet = new Set(terms);
  return text
    .split(re)
    .filter((p) => p !== "")
    .map((p) => ({ text: p, hit: termSet.has(p.toLowerCase()) }));
}
