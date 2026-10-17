export type DocType = "pdf" | "image" | "note" | "doc";

export interface Doc {
  id: string;
  name: string;
  type: DocType;
  location: string;
  seen: string;
  ocr: boolean;
  page?: string;
  text: string; // the exact text in the file (or OCR output)
  tags: string[]; // hardcoded "semantic" concepts standing in for embeddings
}

export const DOCS: Doc[] = [
  {
    id: "1", name: "DB-Lecture-07-Normalization.pdf", type: "pdf", location: "Downloads / CS 301",
    seen: "Sep 12", ocr: false, page: "Slide 14",
    text: "Split tables so each fact is stored once. 1NF removes repeating groups, 2NF removes partial dependencies, 3NF removes transitive dependencies.",
    tags: ["database normalization", "repeating data", "redundancy", "duplicate", "tables", "schema design", "1NF 2NF 3NF"],
  },
  {
    id: "2", name: "IMG_4821.png", type: "image", location: "Photos / Screenshots",
    seen: "Oct 3", ocr: true,
    text: "Final defense: submit manuscript by Friday, Nov 21, 5:00 PM. Upload through the department portal.",
    tags: ["deadline", "due date", "defense", "submission", "thesis", "schedule", "when"],
  },
  {
    id: "3", name: "recursion-notes.md", type: "note", location: "Notes / Programming",
    seen: "Aug 28", ocr: false,
    text: "A function solves a big problem by solving a smaller copy of itself. Always define a base case or the stack overflows.",
    tags: ["recursion", "function calls itself", "base case", "call stack", "programming concept"],
  },
  {
    id: "4", name: "Screenshot 2026-09-30 whiteboard.jpg", type: "image", location: "Desktop",
    seen: "Sep 30", ocr: true,
    text: "TF-IDF = same words only. Embeddings = same meaning. Users forget the words, not the idea.",
    tags: ["vocabulary mismatch", "embeddings", "semantic search", "keyword search", "meaning", "forget the words"],
  },
  {
    id: "5", name: "Capstone-Proposal-v3.docx", type: "doc", location: "Documents / Capstone",
    seen: "Oct 9", ocr: false, page: "Chapter 1, p. 4",
    text: "The study aims to develop a system that lets users find stored files by describing what they remember instead of exact keywords.",
    tags: ["thesis", "proposal", "objectives", "personal information retrieval", "capstone", "find files"],
  },
  {
    id: "6", name: "HCI-Week5-Readings.pdf", type: "pdf", location: "Downloads / HCI",
    seen: "Sep 19", ocr: false, page: "Page 3",
    text: "Visibility of system status. Match between system and real world. User control and freedom. Error prevention.",
    tags: ["usability", "heuristics", "interface design", "nielsen", "user experience"],
  },
];

export const EXAMPLES = [
  "the slide about not repeating data in tables",
  "when is the defense due",
  "that function that calls itself",
  "why people can't find files by words",
];

const STOP = new Set("the a an of in on is it to that this about when what why how do i can't cant by for and or my saw see where was".split(" "));
const tokens = (q: string) =>
  q.toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((t) => t && !STOP.has(t));

export interface Hit { doc: Doc; score: number; matched: string[] }

export function search(query: string, mode: "semantic" | "keyword"): Hit[] {
  const toks = tokens(query);
  if (!toks.length) return [];

  if (mode === "keyword") {
    // Conventional behaviour: every word must appear literally in the file.
    return DOCS.filter((d) => {
      const hay = (d.text + " " + d.name).toLowerCase();
      return toks.every((t) => new RegExp(`\\b${t}\\b`).test(hay));
    }).map((doc) => ({ doc, score: 1, matched: toks }));
  }

  // Fake "semantic" scoring: prefix overlap against hand-written concept tags.
  return DOCS.map((doc) => {
    const matched = doc.tags.filter((tag) =>
      toks.some((t) => tag.toLowerCase().split(/\s+/).some((w) => w.slice(0, 5) === t.slice(0, 5)))
    );
    const textHits = toks.filter((t) => doc.text.toLowerCase().includes(t.slice(0, 5))).length;
    const raw = matched.length * 0.22 + textHits * 0.1;
    return { doc, score: Math.min(0.97, raw > 0 ? 0.4 + raw : 0), matched };
  })
    .filter((h) => h.score > 0)
    .sort((a, b) => b.score - a.score);
}
