"use client";

import { useState } from "react";
import { convertToNew, convertToOld, convertCyrillicToLatin, convertLatinToCyrillic, type ConversionDirection } from "@imlogram/core";
import { convertDocx, convertXlsx } from "@/lib/office-files";

const MODES: { value: ConversionDirection; label: string }[] = [
  { value: "old_to_new", label: "Eski → Yangi" },
  { value: "new_to_old", label: "Yangi → Eski" },
  { value: "cyrillic_to_latin", label: "Kirilça → Yangi" },
  { value: "latin_to_cyrillic", label: "Yangi → Kirilça" },
];

function converterFor(direction: ConversionDirection): (text: string) => string {
  switch (direction) {
    case "old_to_new":
      return (t) => convertToNew(t).text;
    case "new_to_old":
      return (t) => convertToOld(t).text;
    case "cyrillic_to_latin":
      return (t) => convertCyrillicToLatin(t).text;
    case "latin_to_cyrillic":
      return (t) => convertLatinToCyrillic(t).text;
  }
}

function withSuffix(fileName: string, suffix: string): string {
  const dot = fileName.lastIndexOf(".");
  if (dot === -1) return `${fileName}-${suffix}`;
  return `${fileName.slice(0, dot)}-${suffix}${fileName.slice(dot)}`;
}

type Status = { kind: "idle" } | { kind: "busy" } | { kind: "error"; message: string } | { kind: "done"; url: string; fileName: string };

export function FileConverter() {
  const [mode, setMode] = useState<ConversionDirection>("old_to_new");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function handleFile(file: File) {
    setStatus({ kind: "busy" });
    const convert = converterFor(mode);
    const ext = file.name.toLowerCase().split(".").pop();

    try {
      let blob: Blob;
      let outName: string;

      if (ext === "txt") {
        const text = await file.text();
        blob = new Blob([convert(text)], { type: "text/plain;charset=utf-8" });
        outName = withSuffix(file.name, "yangi");
      } else if (ext === "docx") {
        const buf = await file.arrayBuffer();
        const out = await convertDocx(buf, convert);
        blob = new Blob([out as BlobPart], { type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" });
        outName = withSuffix(file.name, "yangi");
      } else if (ext === "xlsx") {
        const buf = await file.arrayBuffer();
        const out = await convertXlsx(buf, convert);
        blob = new Blob([out as BlobPart], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        outName = withSuffix(file.name, "yangi");
      } else {
        setStatus({ kind: "error", message: "Qöllab-quvvatlanmaydigan format. Faqat .txt, .docx, .xlsx." });
        return;
      }

      const url = URL.createObjectURL(blob);
      setStatus({ kind: "done", url, fileName: outName });
    } catch {
      setStatus({ kind: "error", message: "Faylni oçib bölmadi — buzilgan yoki qöllab-quvvatlanmaydigan fayl bölişi mumkin." });
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {MODES.map((m) => (
          <button
            key={m.value}
            type="button"
            onClick={() => setMode(m.value)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
              mode === m.value
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-slate-300 text-slate-600 hover:border-brand-400 hover:text-brand-600 dark:border-slate-700 dark:text-slate-300"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <label className="flex cursor-pointer flex-col items-center gap-1 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/60 p-6 text-center transition hover:border-brand-400 dark:border-slate-700 dark:bg-slate-900/30">
        <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Fayl tanlang yoki şu yerga taşlang</span>
        <span className="text-xs text-slate-400">.txt · .docx · .xlsx</span>
        <input
          type="file"
          accept=".txt,.docx,.xlsx"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
            e.target.value = "";
          }}
        />
      </label>

      {status.kind === "busy" && <p className="text-sm text-slate-500">İşlanmoqda...</p>}
      {status.kind === "error" && <p className="text-sm text-rose-600 dark:text-rose-400">{status.message}</p>}
      {status.kind === "done" && (
        <a
          href={status.url}
          download={status.fileName}
          className="inline-flex items-center gap-1.5 rounded-md bg-brand-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-brand-700"
        >
          Yuklab oliş: {status.fileName}
        </a>
      )}
    </div>
  );
}
