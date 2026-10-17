"use client";

import { useMemo, useState } from "react";
import { FileText, ImageIcon, NotebookPen, Presentation, Search, ScanText, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { DOCS, EXAMPLES, search, type DocType } from "@/lib/data";

const ICON: Record<DocType, typeof FileText> = {
  pdf: Presentation,
  image: ImageIcon,
  note: NotebookPen,
  doc: FileText,
};
const LABEL: Record<DocType, string> = { pdf: "PDFs", image: "Screenshots", note: "Notes", doc: "Documents" };

export default function SearchApp() {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<"semantic" | "keyword">("semantic");
  const [filter, setFilter] = useState<DocType | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const hits = useMemo(
    () => search(query, mode).filter((h) => !filter || h.doc.type === filter),
    [query, mode, filter],
  );
  const open = hits.find((h) => h.doc.id === openId) ?? null;
  const run = (q: string) => {
    setInput(q);
    setQuery(q);
    setOpenId(null);
  };

  return (
    <div className="min-h-screen bg-[#F3F5F7] text-[#16212E]">
      <header className="flex items-center justify-between border-b border-[#D5DBE1] bg-white px-6 py-3">
        <div className="font-serif text-xl font-semibold tracking-tight">Where Did I See That?</div>
        <Button variant="outline" size="sm">
          <Upload className="mr-2 size-4" />
          Add files
        </Button>
      </header>

      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-8 lg:grid-cols-[220px_1fr_340px]">
        <aside className="space-y-4">
          <div>
            <h2 className="text-sm font-medium">Your library</h2>
            <p className="text-sm text-[#5B6876]">{DOCS.length} files indexed</p>
          </div>
          <div className="space-y-1">
            {(Object.keys(LABEL) as DocType[]).map((t) => {
              const Icon = ICON[t];
              const n = DOCS.filter((d) => d.type === t).length;
              return (
                <button
                  key={t}
                  onClick={() => setFilter(filter === t ? null : t)}
                  className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors ${filter === t ? "bg-[#16212E] text-white" : "hover:bg-[#E5EAEE]"}`}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="size-4" />
                    {LABEL[t]}
                  </span>
                  <span>{n}</span>
                </button>
              );
            })}
          </div>
          <Separator />
          <p className="flex items-start gap-2 text-sm text-[#5B6876]">
            <ScanText className="mt-0.5 size-4 shrink-0" />
            Text in {DOCS.filter((d) => d.ocr).length} screenshots was read automatically so you can search it.
          </p>
        </aside>

        <main className="min-w-0 space-y-6">
          <div className="space-y-3">
            <h1 className="font-serif text-3xl font-semibold tracking-tight">What do you remember about it?</h1>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                run(input);
              }}
              className="flex gap-2"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#5B6876]" />
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Describe it the way you'd tell a friend"
                  className="h-12 bg-white pl-10 text-base"
                />
              </div>
              <Button type="submit" className="h-12 bg-[#0E7C7B] px-6 hover:bg-[#0B6362]">
                Find it
              </Button>
            </form>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                {EXAMPLES.map((e) => (
                  <button
                    key={e}
                    onClick={() => run(e)}
                    className="rounded-full border border-[#D5DBE1] bg-white px-3 py-1 text-sm text-[#3C4957] hover:border-[#0E7C7B]"
                  >
                    {e}
                  </button>
                ))}
              </div>
              <ToggleGroup
                type="single"
                value={mode}
                onValueChange={(v) => v && setMode(v as typeof mode)}
                variant="outline"
                size="sm"
              >
                <ToggleGroupItem value="semantic">By meaning</ToggleGroupItem>
                <ToggleGroupItem value="keyword">By exact words</ToggleGroupItem>
              </ToggleGroup>
            </div>
          </div>

          {!query && (
            <div className="rounded-lg border border-dashed border-[#BFC8D0] p-10 text-center text-[#5B6876]">
              Try one of the examples above, then switch to “By exact words” to see what a normal file search would
              miss.
            </div>
          )}

          {query && (
            <p className="text-sm text-[#5B6876]">
              {hits.length} {hits.length === 1 ? "result" : "results"} · 0.{mode === "semantic" ? "18" : "04"} s
            </p>
          )}

          {query && hits.length === 0 && (
            <div className="rounded-lg border border-[#D5DBE1] bg-white p-8">
              <p className="font-medium">
                {mode === "keyword" ? "No file contains all of those words." : "Nothing matches that description."}
              </p>
              <p className="mt-1 text-sm text-[#5B6876]">
                {mode === "keyword"
                  ? "Exact-word search only finds files that use your wording. Switch to “By meaning” to search by what the file is about."
                  : "Try describing the topic differently, or add the files you expected to find."}
              </p>
              {mode === "keyword" && (
                <Button className="mt-4" variant="outline" onClick={() => setMode("semantic")}>
                  Search by meaning
                </Button>
              )}
            </div>
          )}

          <ul className="space-y-3">
            {hits.map(({ doc, score, matched }) => {
              const Icon = ICON[doc.type];
              const active = doc.id === openId;
              return (
                <li key={doc.id}>
                  <button
                    onClick={() => setOpenId(doc.id)}
                    className={`w-full rounded-lg border bg-white p-4 text-left transition-colors ${active ? "border-[#0E7C7B]" : "border-[#D5DBE1] hover:border-[#9AA7B3]"}`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className="mt-1 size-5 shrink-0 text-[#5B6876]" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <span className="truncate font-medium">{doc.name}</span>
                          {mode === "semantic" && (
                            <div className="flex shrink-0 items-center gap-2">
                              <div className="h-1.5 w-20 rounded-full bg-[#E5EAEE]">
                                <div
                                  className="h-full rounded-full bg-[#0E7C7B]"
                                  style={{ width: `${score * 100}%` }}
                                />
                              </div>
                              <span className="w-9 text-right text-sm tabular-nums">{Math.round(score * 100)}%</span>
                            </div>
                          )}
                        </div>
                        <p className="mt-0.5 text-sm text-[#5B6876]">
                          {doc.location} · {doc.page ? doc.page + " · " : ""}seen {doc.seen}
                        </p>
                        <p className="mt-2 line-clamp-2 text-sm">{doc.text}</p>
                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {doc.ocr && <Badge variant="secondary">Read from image</Badge>}
                          {mode === "semantic" &&
                            matched.slice(0, 3).map((m) => (
                              <Badge key={m} variant="outline">
                                {m}
                              </Badge>
                            ))}
                        </div>
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </main>

        <aside className="lg:sticky lg:top-6 lg:self-start">
          {open ? (
            <div className="rounded-lg border border-[#D5DBE1] bg-white p-5">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-medium">{open.doc.name}</h3>
                <button onClick={() => setOpenId(null)} aria-label="Close preview">
                  <X className="size-4" />
                </button>
              </div>
              <p className="mt-1 text-sm text-[#5B6876]">{open.doc.location}</p>
              <div
                className={`mt-4 rounded-md p-4 text-sm leading-relaxed ${open.doc.ocr ? "bg-[#FFF1BF]" : "bg-[#EEF1F4]"}`}
              >
                {open.doc.ocr && <p className="mb-2 text-xs font-medium text-[#6B5400]">Text read from this image</p>}
                {open.doc.text}
              </div>
              {mode === "semantic" && open.matched.length > 0 && (
                <p className="mt-4 text-sm text-[#3C4957]">
                  Matched because this file is about <b>{open.matched[0]}</b>, even though your search used different
                  words.
                </p>
              )}
              <div className="mt-5 flex gap-2">
                <Button size="sm" className="bg-[#0E7C7B] hover:bg-[#0B6362]">
                  Open file
                </Button>
                <Button size="sm" variant="outline">
                  Show in folder
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-[#5B6876]">Select a result to preview it here.</p>
          )}
        </aside>
      </div>
    </div>
  );
}
