import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  MessageSquare,
  Menu,
  X,
  ArrowRight,
  ChevronRight,
  Sparkles,
  Rocket,
  Bell,
  Check,
  Clock,
} from "lucide-react";
import FaqExplorer, { SearchBox } from "./FaqExplorer";
import { FAQS } from "./faqData";
import { CATEGORIES, OFFICES, POPULAR } from "./faqMeta";
import logo from "./assets/logo.png";

// Lightweight count-up animation for hero stats.
function CountUp({ end, duration = 1300 }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf;
    let start;
    const step = (t) => {
      if (start === undefined) start = t;
      const p = Math.min((t - start) / duration, 1);
      // easeOutCubic for a satisfying finish
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * end));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [end, duration]);
  return <>{val}</>;
}

// "Coming soon" panel shown in place of the (not-yet-live) AI assistant.
function ComingSoon({ onClose }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const submit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setDone(true);
  };
  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-hilcoe-blue text-white">
      {/* animated glow */}
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-hilcoe-bright/40 blur-3xl"
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute -bottom-20 -left-12 h-56 w-56 rounded-full bg-hilcoe-red/40 blur-3xl"
      />

      <div className="flex items-center justify-between px-5 pt-4">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white/80">
          <Clock size={12} /> Coming soon
        </span>
        <button
          onClick={onClose}
          aria-label="Close"
          className="rounded-full p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          <X size={18} />
        </button>
      </div>

      <div className="relative flex flex-1 flex-col items-center justify-center px-6 text-center">
        <motion.div
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 14 }}
          className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br from-hilcoe-red to-hilcoe-bright shadow-2xl"
        >
          <motion.span
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Rocket size={38} />
          </motion.span>
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute -right-2 -top-2 text-yellow-300"
          >
            <Sparkles size={20} />
          </motion.span>
        </motion.div>

        <h3 className="mt-6 text-2xl font-black tracking-tight">
          The AI Assistant is on its way
        </h3>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/70">
          Soon you'll be able to ask anything and get instant, personalized
          answers. For now, use the searchable Help Center — it already has every
          answer.
        </p>

        {!done ? (
          <form onSubmit={submit} className="mt-6 w-full max-w-xs">
            <p className="mb-2 text-[11px] font-bold uppercase tracking-widest text-white/50">
              Get notified at launch
            </p>
            <div className="flex items-center gap-2 rounded-2xl border-2 border-white/15 bg-white/5 p-1.5 focus-within:border-white/40">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@hilcoe.net"
                className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder:text-white/40 focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Notify me"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-hilcoe-red text-white transition hover:brightness-110"
              >
                <Bell size={16} />
              </button>
            </div>
          </form>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-hilcoe-green/20 px-4 py-2 text-sm font-bold text-white"
          >
            <Check size={16} className="text-hilcoe-green" /> You're on the list!
          </motion.div>
        )}
      </div>

      <button
        onClick={onClose}
        className="relative m-4 rounded-2xl bg-white/10 py-3 text-xs font-black uppercase tracking-widest text-white transition hover:bg-white/20"
      >
        Browse the Help Center instead
      </button>
    </div>
  );
}

const chipStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.3 } },
};
const chipItem = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

function App() {
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hintDismissed, setHintDismissed] = useState(false);
  const explorerRef = useRef(null);

  // The AI assistant "comes up" on its own a few seconds after landing.
  useEffect(() => {
    if (hintDismissed) return;
    const t = setTimeout(() => setShowHint(true), 3500);
    return () => clearTimeout(t);
  }, [hintDismissed]);

  const openChat = () => {
    setChatOpen(true);
    setShowHint(false);
    setHintDismissed(true);
  };
  const dismissHint = () => {
    setShowHint(false);
    setHintDismissed(true);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goFaq = () => {
    setMobileMenu(false);
    explorerRef.current?.scrollIntoView();
  };
  const goTopics = () => {
    setMobileMenu(false);
    document.getElementById("topics")?.scrollIntoView({ behavior: "smooth" });
  };
  const goTop = () => {
    setMobileMenu(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const pick = (faq) => explorerRef.current?.pick(faq);

  const navLinks = [
    { label: "Home", onClick: goTop },
    { label: "Topics", onClick: goTopics },
    { label: "Help Center", onClick: goFaq },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-hilcoe-text">
      {/* Navbar */}
      <nav
        className={`fixed top-0 z-40 w-full transition-all duration-300 ${
          scrolled ? "bg-white/90 py-3 shadow-md backdrop-blur-md" : "bg-transparent py-4"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 lg:px-10">
          <button
            className="flex items-center gap-3"
            onClick={goTop}
            aria-label="HiLCoE home"
          >
            <img src={logo} alt="HiLCoE logo" className="h-10 w-auto lg:h-11" />
            <span className="hidden text-left sm:block">
              <span
                className={`block text-sm font-black tracking-tight lg:text-base ${
                  scrolled ? "text-hilcoe-blue" : "text-hilcoe-blue"
                }`}
              >
                HiLCoE
              </span>
              <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-hilcoe-muted">
                Help Center
              </span>
            </span>
          </button>

          <div className="hidden items-center gap-8 lg:flex">
            {navLinks.map((l) => (
              <button
                key={l.label}
                onClick={l.onClick}
                className="text-sm font-bold uppercase tracking-widest text-hilcoe-blue transition-colors hover:text-hilcoe-red"
              >
                {l.label}
              </button>
            ))}
            <button
              onClick={openChat}
              className="flex items-center gap-2 rounded-full bg-hilcoe-blue px-5 py-2.5 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-hilcoe-blue/20 transition-all hover:-translate-y-0.5 hover:bg-hilcoe-red"
            >
              <MessageSquare size={16} />
              Ask AI
              <span className="rounded-full bg-amber-400 px-1.5 py-0.5 text-[8px] font-black text-hilcoe-blue">
                SOON
              </span>
            </button>
          </div>

          <button
            onClick={() => setMobileMenu(true)}
            className="text-hilcoe-blue lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={28} />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 80 }}
            className="fixed inset-0 z-[60] bg-white p-7 lg:hidden"
          >
            <div className="flex items-center justify-between">
              <img src={logo} alt="HiLCoE logo" className="h-10" />
              <button onClick={() => setMobileMenu(false)} aria-label="Close menu">
                <X size={30} className="text-hilcoe-blue" />
              </button>
            </div>
            <div className="mt-12 flex flex-col gap-5">
              {navLinks.map((l) => (
                <button
                  key={l.label}
                  onClick={l.onClick}
                  className="text-left text-2xl font-black uppercase tracking-tight text-hilcoe-blue"
                >
                  {l.label}
                </button>
              ))}
              <button
                onClick={() => {
                  setMobileMenu(false);
                  openChat();
                }}
                className="mt-4 flex items-center gap-2 rounded-full bg-hilcoe-blue px-6 py-3 text-sm font-black uppercase tracking-widest text-white"
              >
                <MessageSquare size={18} /> Ask AI
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-hilcoe-blue px-5 pb-16 pt-28 text-white sm:pb-20 lg:pt-36">
          <div className="absolute inset-0 opacity-25" aria-hidden>
            <motion.div
              animate={{ x: [0, 50, 0], y: [0, 30, 0], scale: [1, 1.15, 1] }}
              transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-1/4 -top-1/3 h-[700px] w-[700px] rounded-full bg-hilcoe-bright blur-[120px]"
            />
            <motion.div
              animate={{ x: [0, -40, 0], y: [0, -30, 0], scale: [1.1, 1, 1.1] }}
              transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-1/2 -right-1/4 h-[700px] w-[700px] rounded-full bg-hilcoe-red blur-[120px]"
            />
          </div>

          <div className="relative mx-auto max-w-3xl text-center">
            
            <motion.p
             initial={{ opacity: 0, y: 16 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.3em] text-white/80 backdrop-blur-sm shadow-glow animate-glowPulse"
             >
             <motion.span
             animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.15, 1] }}
             transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
             >
             <Sparkles size={13} className="text-hilcoe-red" />
             </motion.span>
             These information are provided for guidance only and do not replace official campus policies or decisions.
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="mt-6 text-4xl font-black leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl"
            >
              Find answers in <span className="text-shimmer">seconds.</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mx-auto mt-5 max-w-xl text-base text-white/70 sm:text-lg"
            >
              Everything students ask about registration, courses, projects,
              e-learning and campus services — answered, searchable, and always up
              to date.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mx-auto mt-8 max-w-2xl"
            >
              <SearchBox
                query={query}
                setQuery={setQuery}
                size="lg"
                onPick={pick}
                placeholder="Search the help center…"
              />
            </motion.div>

            {/* Popular questions */}
            <motion.div
              variants={chipStagger}
              initial="hidden"
              animate="show"
              className="mx-auto mt-7 max-w-2xl"
            >
              <motion.p
                variants={chipItem}
                className="text-[11px] font-black uppercase tracking-[0.3em] text-white/40"
              >
                Popular right now
              </motion.p>
              <div className="mt-3 flex flex-wrap justify-center gap-2.5">
                {POPULAR.slice(0, 5).map((f) => (
                  <motion.button
                    key={f.id}
                    variants={chipItem}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => pick(f)}
                    className="rounded-full border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-semibold text-white/85 backdrop-blur-sm transition-colors hover:border-white/40 hover:bg-white/10"
                  >
                    {f.question}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mx-auto mt-12 flex max-w-md items-stretch justify-center divide-x divide-white/10 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
            >
              {[
                { n: FAQS.length, l: "Answers" },
                { n: CATEGORIES.length, l: "Topics" },
                { n: OFFICES.length, l: "Offices" },
              ].map((s) => (
                <div key={s.l} className="flex-1 px-6 py-4 text-center">
                  <p className="text-3xl font-black text-white">
                    <CountUp end={s.n} />
                  </p>
                  <p className="mt-0.5 text-[11px] font-bold uppercase tracking-widest text-white/50">
                    {s.l}
                  </p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Topic cards */}
        <section
          id="topics"
          className="scroll-mt-20 bg-gradient-to-b from-hilcoe-soft via-white to-hilcoe-soft py-16 lg:py-20"
        >
          <div className="mx-auto max-w-6xl px-5 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <p className="text-[11px] font-black uppercase tracking-[0.35em] text-hilcoe-red">
                Browse by topic
              </p>
              <h2 className="mt-3 text-2xl font-black tracking-tight text-hilcoe-blue sm:text-3xl">
                Pick a category to get started
              </h2>
            </motion.div>

            <motion.div
              variants={chipStagger}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            >
              {CATEGORIES.map((c) => (
                <motion.button
                  key={c.name}
                  variants={{
                    hidden: { opacity: 0, y: 24 },
                    show: { opacity: 1, y: 0 },
                  }}
                  whileHover={{ y: -6 }}
                  onClick={() => explorerRef.current?.openCategory(c.name)}
                  className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-hilcoe-border bg-white p-6 pt-7 text-left shadow-md shadow-hilcoe-blue/5 ring-1 ring-black/[0.03] transition-all hover:-translate-y-1 hover:border-hilcoe-bright/40 hover:shadow-2xl hover:shadow-hilcoe-blue/10"
                >
                  {/* colored top accent that grows on hover */}
                  <span
                    className={`absolute inset-x-0 top-0 h-1.5 ${c.dot} origin-left scale-x-100 opacity-70 transition-all duration-300 group-hover:opacity-100`}
                  />
                  <div className="flex items-center justify-between">
                    <span
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 ${c.chip}`}
                    >
                      <c.icon size={24} />
                    </span>
                    <span className="rounded-full bg-hilcoe-soft px-2.5 py-1 text-xs font-bold text-hilcoe-blue">
                      {c.count}
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-black tracking-tight text-hilcoe-blue">
                    {c.name}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-hilcoe-muted">
                    {c.blurb}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-black uppercase tracking-widest text-hilcoe-red">
                    View questions
                    <ChevronRight
                      size={14}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </span>
                </motion.button>
              ))}
            </motion.div>
          </div>
        </section>

        {/* The FAQ explorer */}
        <FaqExplorer ref={explorerRef} query={query} setQuery={setQuery} />

        {/* Coming soon / still need help CTA */}
        <section className="bg-white py-16 lg:py-24">
          <div className="mx-auto max-w-4xl px-5">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
              className="relative overflow-hidden rounded-[2.5rem] bg-hilcoe-blue px-8 py-14 text-center text-white sm:px-14"
            >
              <motion.div
                animate={{ scale: [1, 1.25, 1], opacity: [0.3, 0.5, 0.3] }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-hilcoe-bright/30 blur-3xl"
                aria-hidden
              />
              <span className="relative inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.25em] text-white/80">
                <Clock size={13} className="text-amber-300" /> Launching soon
              </span>
              <h2 className="relative mt-5 text-2xl font-black tracking-tight sm:text-3xl">
                Meet your HiLCoE AI Assistant
              </h2>
              <p className="relative mx-auto mt-3 max-w-md text-sm text-white/70 sm:text-base">
                Instant, personalized answers — any time, day or night. We're
                putting the finishing touches on it. Be the first to know when it
                goes live.
              </p>
              <button
                onClick={openChat}
                className="relative mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-black uppercase tracking-widest text-hilcoe-blue transition-all hover:-translate-y-0.5 hover:bg-hilcoe-red hover:text-white"
              >
                <Bell size={18} /> Get notified
              </button>
            </motion.div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-hilcoe-border bg-hilcoe-gray py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-4">
            <div className="col-span-1 lg:col-span-2">
              <div className="flex items-center gap-3">
                <img src={logo} alt="HiLCoE logo" className="h-12 w-auto" />
                <div>
                  <h2 className="text-lg font-black uppercase tracking-tight text-hilcoe-blue">
                    HiLCoE
                  </h2>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-hilcoe-muted">
                    School of Computer Science &amp; Tech
                  </p>
                </div>
              </div>
              <p className="mt-6 max-w-md text-sm leading-relaxed text-hilcoe-muted">
                Your one-stop help center for everything student life at HiLCoE —
                from admissions to graduation.
              </p>
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-hilcoe-red">
                Topics
              </h3>
              <div className="mt-5 flex flex-col gap-2.5">
                {CATEGORIES.slice(0, 5).map((c) => (
                  <button
                    key={c.name}
                    onClick={() => explorerRef.current?.openCategory(c.name)}
                    className="text-left text-sm font-bold text-hilcoe-muted transition-colors hover:text-hilcoe-blue"
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-hilcoe-red">
                Connect
              </h3>
              <div className="mt-5 flex flex-col gap-2.5">
                <p className="text-sm font-bold text-hilcoe-muted">Addis Ababa, Ethiopia</p>
                <p className="text-sm font-bold text-hilcoe-muted">+251 11 123 4567</p>
                <p className="text-sm font-bold text-hilcoe-muted">info@hilcoe.net</p>
              </div>
            </div>
          </div>
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-hilcoe-border pt-8 text-[10px] font-black uppercase tracking-widest text-hilcoe-muted/70 sm:flex-row">
            <p>© 2026 HiLCoE School of Computer Science &amp; Technology</p>
            <div className="flex gap-6">
              <span className="cursor-pointer transition-colors hover:text-hilcoe-blue">
                Privacy Policy
              </span>
              <span className="cursor-pointer transition-colors hover:text-hilcoe-blue">
                Terms of Service
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating chat launcher + auto-appearing hint */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
        <AnimatePresence>
          {showHint && !chatOpen && (
            <motion.div
              initial={{ opacity: 0, y: 16, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 320, damping: 22 }}
              className="relative max-w-[240px] rounded-2xl rounded-br-md border border-hilcoe-border bg-white px-4 py-3 shadow-2xl shadow-hilcoe-blue/15"
            >
              <button
                onClick={dismissHint}
                aria-label="Dismiss"
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-hilcoe-blue text-white shadow-md transition hover:bg-hilcoe-red"
              >
                <X size={13} />
              </button>
              <p className="flex items-center gap-1.5 text-sm font-black text-hilcoe-text">
                <span className="text-base">🚀</span> AI Assistant — coming soon
              </p>
              <p className="mt-1 text-xs leading-relaxed text-hilcoe-muted">
                Instant AI answers are on the way. Get notified the moment it goes
                live.
              </p>
              <button
                onClick={openChat}
                className="mt-2.5 inline-flex items-center gap-1 text-xs font-black uppercase tracking-wider text-hilcoe-red transition hover:gap-2"
              >
                Notify me <ArrowRight size={13} />
              </button>
              {/* little tail */}
              <span className="absolute -bottom-1.5 right-5 h-3 w-3 rotate-45 border-b border-r border-hilcoe-border bg-white" />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative self-end">
          {!chatOpen && (
            <span className="absolute inset-0 animate-ping rounded-full bg-hilcoe-red/40" />
          )}
          <motion.button
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.8 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={() => (chatOpen ? setChatOpen(false) : openChat())}
            aria-label={chatOpen ? "Close assistant" : "Open AI assistant"}
            className="relative flex items-center justify-center rounded-full bg-gradient-to-br from-hilcoe-red to-hilcoe-bright text-white shadow-2xl shadow-hilcoe-red/40"
            style={{ height: 60, width: 60 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {chatOpen ? (
                <motion.span
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                >
                  <X size={26} />
                </motion.span>
              ) : (
                <motion.span
                  key="chat"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                >
                  <MessageSquare size={26} />
                </motion.span>
              )}
            </AnimatePresence>
            {/* "soon" badge */}
            {!chatOpen && (
              <span className="absolute -right-1 -top-1 rounded-full border-2 border-white bg-amber-400 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider text-hilcoe-blue">
                Soon
              </span>
            )}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-3 left-3 z-50 h-[70vh] max-h-[560px] overflow-hidden rounded-[1.5rem] border border-hilcoe-border bg-white shadow-2xl shadow-hilcoe-blue/20 sm:left-auto sm:right-5 sm:w-[400px]"
          >
            <ComingSoon onClose={() => setChatOpen(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
