/**
 * Soft eco tints for topic cards (blog topics, community categories), cycled
 * by list position so neighbouring cards never share a colour. Topics carry no
 * imagery, so the tinted band is what gives each card its own face.
 *
 * `band` is the header gradient; `accent` is a text colour, so decorations
 * inside it can paint with `bg-current` / `border-current`.
 *
 * Usage:  const tone = topicToneAt(index);
 * ─────────────────────────────────────────────────────────────────
 */

export const topicTones = [
  { band: "from-lime-100 via-emerald-50 to-white", accent: "text-emerald-700" },
  { band: "from-cyan-100 via-sky-50 to-white", accent: "text-sky-700" },
  { band: "from-amber-100 via-orange-50 to-white", accent: "text-amber-700" },
  { band: "from-violet-100 via-fuchsia-50 to-white", accent: "text-violet-700" },
  { band: "from-teal-100 via-emerald-50 to-white", accent: "text-teal-700" },
  { band: "from-rose-100 via-orange-50 to-white", accent: "text-rose-700" },
] as const;

export type TopicTone = (typeof topicTones)[number];

export const topicToneAt = (index: number): TopicTone =>
  topicTones[index % topicTones.length];
