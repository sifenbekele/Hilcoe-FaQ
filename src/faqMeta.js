import {
  ClipboardList,
  GraduationCap,
  Briefcase,
  Award,
  MonitorPlay,
  Building2,
  HelpCircle,
} from "lucide-react";
import { FAQS } from "./faqData";

// ---- Category metadata (icons, blurbs, accent palette) ----
// Class strings are written out in full so Tailwind's JIT keeps them.
export const CATEGORY_META = {
  "Admission, Registration & Records": {
    icon: ClipboardList,
    blurb: "Registering, transcripts, exemptions, transfers & record changes.",
    dot: "bg-hilcoe-blue",
    chip: "bg-hilcoe-blue/10 text-hilcoe-blue",
    softBg: "bg-hilcoe-blue/5",
    text: "text-hilcoe-blue",
    ring: "ring-hilcoe-blue/30",
  },
  "Courses & Grading": {
    icon: GraduationCap,
    blurb: "Failing, repeating courses and how your GPA is calculated.",
    dot: "bg-indigo-500",
    chip: "bg-indigo-50 text-indigo-700",
    softBg: "bg-indigo-50/60",
    text: "text-indigo-700",
    ring: "ring-indigo-300",
  },
  "Internship & Senior Project": {
    icon: Briefcase,
    blurb: "Supervisors, timelines, grading and internship support letters.",
    dot: "bg-emerald-500",
    chip: "bg-emerald-50 text-emerald-700",
    softBg: "bg-emerald-50/60",
    text: "text-emerald-700",
    ring: "ring-emerald-300",
  },
  "Graduation & Clearance": {
    icon: Award,
    blurb: "Withdrawing and finishing your time at HiLCoE.",
    dot: "bg-amber-500",
    chip: "bg-amber-50 text-amber-700",
    softBg: "bg-amber-50/60",
    text: "text-amber-700",
    ring: "ring-amber-300",
  },
  "E-Learning (LMS)": {
    icon: MonitorPlay,
    blurb: "Moodle, the portal, HSIS, webmail, passwords & IT support.",
    dot: "bg-violet-500",
    chip: "bg-violet-50 text-violet-700",
    softBg: "bg-violet-50/60",
    text: "text-violet-700",
    ring: "ring-violet-300",
  },
  "Student Services & Campus Facilities": {
    icon: Building2,
    blurb: "Advising, office hours and campus support.",
    dot: "bg-rose-500",
    chip: "bg-rose-50 text-rose-700",
    softBg: "bg-rose-50/60",
    text: "text-rose-700",
    ring: "ring-rose-300",
  },
};

export const FALLBACK_META = {
  icon: HelpCircle,
  blurb: "",
  dot: "bg-hilcoe-muted",
  chip: "bg-slate-100 text-slate-600",
  softBg: "bg-slate-50",
  text: "text-slate-700",
  ring: "ring-slate-300",
};

export const getMeta = (category) => CATEGORY_META[category] || FALLBACK_META;

// Categories in display order, with live counts.
export const CATEGORIES = Object.keys(CATEGORY_META)
  .filter((c) => FAQS.some((f) => f.category === c))
  .map((name) => ({
    name,
    count: FAQS.filter((f) => f.category === name).length,
    ...CATEGORY_META[name],
  }));

export const OFFICES = Array.from(new Set(FAQS.map((f) => f.office))).sort();

// ---- Popular / trending ----
// Resolve "popular" questions by matching a phrase to the first FAQ that contains it.
const findByPhrase = (phrase) =>
  FAQS.find((f) => f.question.toLowerCase().includes(phrase.toLowerCase()));

export const POPULAR = [
  "register for my courses",
  "reset my webmail password",
  "get my transcript",
  "apply for course exemption",
  "requirements for new student admission",
  "request an internship support letter",
  "GPA",
  "withdraw from the university",
]
  .map(findByPhrase)
  .filter(Boolean);

export const TRENDING = [
  "Registration",
  "Transcript",
  "Password",
  "Course exemption",
  "Internship letter",
  "GPA",
  "Transfer students",
  "Moodle",
];
