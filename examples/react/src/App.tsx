import { useMemo, useState } from "react";
import { convertToNew, convertToOld, type ConversionDirection } from "@imlogram/core";

const styles = {
  page: { fontFamily: "system-ui, sans-serif", maxWidth: 720, margin: "3rem auto", padding: "0 1rem", lineHeight: 1.5 },
  lead: { color: "#666" },
  modes: { display: "flex", gap: "0.5rem", margin: "1rem 0" },
  button: (active: boolean): React.CSSProperties => ({
    border: "1px solid #4f46e5",
    background: active ? "#4f46e5" : "white",
    color: active ? "white" : "#4f46e5",
    borderRadius: 999,
    padding: "0.4rem 1rem",
    cursor: "pointer",
    fontSize: "0.9rem",
  }),
  field: { width: "100%", boxSizing: "border-box" as const, minHeight: "8rem", padding: "0.75rem", border: "1px solid #ccc", borderRadius: 8, fontSize: "1rem", fontFamily: "inherit" },
  label: { display: "block", fontSize: "0.75rem", textTransform: "uppercase" as const, color: "#888", margin: "1rem 0 0.25rem" },
};

export function App() {
  const [input, setInput] = useState("Bu shahar juda chiroyli va go'zal. Batafsil: https://example.com/Shop");
  const [direction, setDirection] = useState<ConversionDirection>("old_to_new");

  const result = useMemo(() => {
    return direction === "old_to_new" ? convertToNew(input) : convertToOld(input);
  }, [input, direction]);

  return (
    <div style={styles.page}>
      <h1>@imlogram/core — React misoli</h1>
      <p style={styles.lead}>
        Bu Vite + React ilovasi <code>@imlogram/core</code>ni haqiqiy npm registry'dan (
        <code>npm install @imlogram/core</code>) o'rnatadi — monorepo'ning ichki{" "}
        <code>workspace:*</code> havolasidan emas. Maqsad: nashr qilingan paket real
        loyihada, real bundler bilan to'g'ri ishlashini tekshirish.
      </p>

      <div style={styles.modes}>
        <button style={styles.button(direction === "old_to_new")} onClick={() => setDirection("old_to_new")}>
          Eski → Yangi
        </button>
        <button style={styles.button(direction === "new_to_old")} onClick={() => setDirection("new_to_old")}>
          Yangi → Eski
        </button>
      </div>

      <label style={styles.label}>Kiriş matni</label>
      <textarea style={styles.field} value={input} onChange={(e) => setInput(e.target.value)} />

      <label style={styles.label}>Natija</label>
      <pre style={{ ...styles.field, background: "#fafafa", whiteSpace: "pre-wrap" }}>{result.text}</pre>

      <p style={styles.lead}>
        {result.stats.charCount} belgi · {result.stats.wordCount} söz · {result.stats.changedCount} özgariş
      </p>
    </div>
  );
}
