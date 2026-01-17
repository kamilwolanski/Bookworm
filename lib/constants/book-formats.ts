import { MediaFormat } from "@prisma/client";

export const BOOK_FORMATS: {
  value: MediaFormat;
  label: string;
  icon: string;
  meta: string;
}[] = [
  {
    value: "HARDCOVER",
    label: "Twarda oprawa",
    icon: "📕",
    meta: "(HARDCOVER)",
  },
  {
    value: "PAPERBACK",
    label: "Miękka oprawa",
    icon: "📗",
    meta: "(PAPERBACK)",
  },
  { value: "EBOOK", label: "E-book", icon: "📱", meta: "(EBOOK)" },
  { value: "AUDIOBOOK", label: "Audiobook", icon: "🎧", meta: "(AUDIOBOOK)" },
] as const;
