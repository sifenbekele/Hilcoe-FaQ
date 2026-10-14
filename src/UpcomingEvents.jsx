import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  X,
  Bookmark,
  Plane,
} from "lucide-react";
import qatarPoster from "./assets/qatar-airways-poster.webp";

const EVENT = {
  id: "ev-qatar",
  title: "Qatar Airways Student Club Recruitment",
  subtitle:
    "Aim for the skies — Exclusive student fares, extra baggage & travel perks",
  date: "Pending",
  time: "To Be Announced",
  location: "HiLCoE Campus",
  category: "Campus Recruitment",
  badge: "Official Partner",
  badgeStyle: "bg-[#5C0632] text-white",
  gradient: "from-[#5C0632] via-[#741144] to-[#2b0419]",
  attendees: "Open to All HiLCoE Students",
  organizer: "Qatar Airways Privilege Club & HiLCoE Student Services",
  description:
    "HiLCoE students get exclusive access to the Qatar Airways Student Club: special fares up to 20% off, additional baggage allowance, flexible date changes, complimentary Super Wi-Fi, and an automatic Privilege Club tier upgrade upon graduation.",
  highlights: [
    "Exclusive student flight discounts (10% to 20% off)",
    "Complimentary +10kg or 1 extra piece baggage allowance",
    "Flexible travel dates with one free booking change",
    "Complimentary high-speed Super Wi-Fi onboard",
    "Privilege Club tier upgrade celebration gift upon graduation",
  ],
  status: "Coming Soon",
};

export default function UpcomingEvents() {
  const [modalOpen, setModalOpen] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <section
      id="events"
      className="relative scroll-mt-24 bg-gradient-to-b from-white via-hilcoe-soft/40 to-hilcoe-soft/80 py-10 lg:py-14"
    >
      {/* Subtle decorative background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-64 w-[800px] rounded-full bg-gradient-to-r from-hilcoe-bright/10 via-hilcoe-red/5 to-transparent blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-3xl px-5 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="mx-auto inline-flex items-center gap-1.5 rounded-full border border-hilcoe-red/20 bg-hilcoe-red/5 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-[0.3em] text-hilcoe-red">
            <Sparkles size={11} className="text-hilcoe-red animate-pulse" />
            Campus Happenings
          </div>
          <h2 className="mt-2 text-xl font-black tracking-tight text-hilcoe-blue sm:text-2xl">
            Upcoming Events
          </h2>
          <p className="mx-auto mt-1.5 max-w-md text-xs leading-relaxed text-hilcoe-muted sm:text-sm">
            Stay informed about the latest campus partnerships, recruitment
            drives, and student opportunities at HiLCoE.
          </p>
        </motion.div>

        {/* Single Event — Landscape Card */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-7"
        >
          <div
            onClick={() => setModalOpen(true)}
            className="group relative cursor-pointer overflow-hidden rounded-2xl border border-hilcoe-border bg-white shadow-md shadow-hilcoe-blue/5 transition-all hover:border-[#5C0632]/30 hover:shadow-lg hover:shadow-[#5C0632]/10"
          >
            {/* ── Poster image — fully visible, reduced size ── */}
            <div className="relative w-full overflow-hidden bg-[#f7f0f3]">
              <img
                src={qatarPoster}
                alt="Qatar Airways Student Club — Aim for the skies"
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />
            </div>

            {/* ── Card body ── */}
            <div className="px-5 pb-4 pt-3">
              {/* Top row: badges & bookmark */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#5C0632] px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest text-white shadow-sm">
                    <Plane size={10} />
                    {EVENT.badge}
                  </span>
                  <span className="rounded-full bg-hilcoe-soft px-2.5 py-0.5 text-[10px] font-bold text-hilcoe-blue">
                    {EVENT.category}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/60 bg-amber-50 px-2 py-0.5 text-[9px] font-bold text-amber-700">
                    <Clock size={10} />
                    Date: {EVENT.date}
                  </span>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setBookmarked((b) => !b);
                  }}
                  aria-label={bookmarked ? "Bookmarked" : "Bookmark event"}
                  className={`flex h-7 w-7 items-center justify-center rounded-lg transition-all ${
                    bookmarked
                      ? "bg-hilcoe-red text-white"
                      : "bg-hilcoe-soft text-hilcoe-muted hover:bg-hilcoe-blue/10 hover:text-hilcoe-blue"
                  }`}
                >
                  <Bookmark
                    size={13}
                    className={bookmarked ? "fill-current" : ""}
                  />
                </button>
              </div>

              {/* Title & description */}
              <h3 className="mt-2.5 text-base font-black leading-snug tracking-tight text-hilcoe-blue group-hover:text-[#5C0632] transition-colors sm:text-lg">
                {EVENT.title}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-hilcoe-muted sm:text-sm">
                {EVENT.subtitle}
              </p>

              {/* Meta info & CTA */}
              <div className="mt-3 flex flex-col gap-2 border-t border-hilcoe-border/70 pt-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-3 text-[11px] font-medium text-hilcoe-muted">
                  <span className="inline-flex items-center gap-1">
                    <Calendar size={11} className="text-hilcoe-blue" />
                    {EVENT.date}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={11} className="text-hilcoe-red" />
                    {EVENT.location}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[#5C0632]">
                    <Plane size={11} />
                    {EVENT.attendees}
                  </span>
                </div>

                <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-hilcoe-red transition-transform group-hover:translate-x-1">
                  View Details <ArrowRight size={12} />
                </span>
              </div>
            </div>
          </div>
        </motion.div>

      </div>

      {/* ── Event Details Modal ── */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl chat-scroll"
            >
              {/* Modal header with gradient */}
              <div className="relative overflow-hidden bg-gradient-to-r from-[#5C0632] via-[#741144] to-[#2b0419] p-7 text-white sm:p-8">
                <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />

                <button
                  onClick={() => setModalOpen(false)}
                  aria-label="Close dialog"
                  className="absolute right-5 top-5 z-10 rounded-full bg-white/10 p-2 text-white/80 transition-all hover:bg-white/20 hover:text-white"
                >
                  <X size={18} />
                </button>

                <div className="relative z-10">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-black uppercase tracking-widest text-white">
                      {EVENT.badge}
                    </span>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white/80">
                      {EVENT.category}
                    </span>
                  </div>

                  <h2 className="mt-4 text-2xl font-black tracking-tight text-white sm:text-3xl">
                    {EVENT.title}
                  </h2>
                  <p className="mt-2 text-sm text-white/80 leading-relaxed">
                    {EVENT.subtitle}
                  </p>

                  <div className="mt-6 flex flex-wrap gap-3 text-xs font-semibold text-white/90">
                    <span className="flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-1.5 backdrop-blur-sm">
                      <Calendar size={14} /> Date: {EVENT.date}
                    </span>
                    <span className="flex items-center gap-1.5 rounded-xl bg-white/10 px-3 py-1.5 backdrop-blur-sm">
                      <MapPin size={14} /> {EVENT.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Poster image in modal — full visibility */}
              <div className="border-b border-hilcoe-border bg-[#f7f0f3]">
                <img
                  src={qatarPoster}
                  alt="Qatar Airways Student Club poster"
                  className="w-full h-auto object-contain"
                />
              </div>

              {/* Body */}
              <div className="p-6 sm:p-8">
                <div>
                  <h4 className="text-xs font-black uppercase tracking-widest text-hilcoe-red">
                    About This Event
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed text-hilcoe-muted sm:text-base">
                    {EVENT.description}
                  </p>
                </div>

                <div className="mt-6">
                  <h4 className="text-xs font-black uppercase tracking-widest text-hilcoe-blue">
                    Organizer
                  </h4>
                  <p className="mt-1.5 text-sm font-semibold text-hilcoe-text">
                    {EVENT.organizer}
                  </p>
                </div>

                {/* Highlights */}
                <div className="mt-6">
                  <h4 className="text-xs font-black uppercase tracking-widest text-hilcoe-blue">
                    Student Club Benefits
                  </h4>
                  <ul className="mt-3 space-y-2">
                    {EVENT.highlights.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-xs text-hilcoe-text sm:text-sm"
                      >
                        <CheckCircle2
                          size={16}
                          className="mt-0.5 shrink-0 text-hilcoe-green"
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Registration note */}
                <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50/50 p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-amber-800">
                        Event Date: Pending
                      </p>
                      <p className="mt-0.5 text-xs text-amber-700/80">
                        The exact date and registration details will be
                        announced soon. Stay tuned for updates!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal footer */}
              <div className="flex items-center justify-end gap-3 border-t border-hilcoe-border bg-gray-50 px-6 py-4">
                <button
                  onClick={() => setModalOpen(false)}
                  className="rounded-xl border border-hilcoe-border bg-white px-4 py-2 text-xs font-bold text-hilcoe-muted transition hover:text-hilcoe-blue"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
