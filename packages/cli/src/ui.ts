import type { Candidate } from "./scan.js";

/** Self-contained review page: no build step, same zero-tooling approach as
 * examples/html — the browser just renders what the CLI serves. */
export function renderReviewPage(candidates: Candidate[], rootDir: string): string {
  const byFile = new Map<string, Candidate[]>();
  for (const c of candidates) {
    const list = byFile.get(c.file) ?? [];
    list.push(c);
    byFile.set(c.file, list);
  }

  const initialData = JSON.stringify(
    [...byFile.entries()].map(([file, items]) => ({
      file: file.startsWith(rootDir) ? file.slice(rootDir.length).replace(/^[/\\]/, "") : file,
      absFile: file,
      items: items.map((c) => ({
        id: c.id,
        original: c.original,
        converted: c.converted,
        line: c.line,
        column: c.column,
      })),
    })),
  );

  return `<!doctype html>
<html lang="uz">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>imlogram — kod tekşiruvi</title>
  <style>
    :root { color-scheme: light dark; }
    body { font-family: system-ui, sans-serif; max-width: 860px; margin: 2rem auto; padding: 0 1rem; line-height: 1.5; }
    h1 { font-size: 1.4rem; }
    p.lead { color: #666; }
    .file { border: 1px solid #ddd; border-radius: 10px; margin: 1rem 0; overflow: hidden; }
    .file-header { background: #f7f7fb; padding: 0.6rem 0.9rem; font-weight: 600; font-family: monospace; font-size: 0.9rem; display: flex; justify-content: space-between; align-items: center; gap: 0.6rem; }
    .file-header .file-actions { display: flex; gap: 0.5rem; font-family: system-ui, sans-serif; font-weight: 400; }
    .file-header .file-actions a { font-size: 0.8rem; color: #4f46e5; cursor: pointer; text-decoration: underline; }
    .file-header .file-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .item { display: flex; gap: 0.6rem; padding: 0.6rem 0.9rem; border-top: 1px solid #eee; align-items: flex-start; }
    .item code.original { color: #999; text-decoration: line-through; display: block; }
    .item code.converted { color: #111; display: block; }
    .item a.line-link { flex-shrink: 0; font-family: monospace; font-size: 0.8rem; color: #4f46e5; text-decoration: none; padding-top: 0.15rem; }
    .item a.line-link:hover { text-decoration: underline; }
    .toolbar { display: flex; gap: 1rem; align-items: center; margin: 1rem 0; }
    button { border: 1px solid #4f46e5; background: #4f46e5; color: white; border-radius: 8px; padding: 0.6rem 1.2rem; cursor: pointer; font-size: 0.95rem; }
    button.ghost { background: white; color: #4f46e5; }
    button:disabled { opacity: 0.4; cursor: default; }
    #summary { margin-top: 1rem; padding: 0.8rem; border-radius: 8px; background: #ecfdf5; color: #065f46; display: none; }
  </style>
</head>
<body>
  <h1>imlogram — kod tekşiruvi</h1>
  <p class="lead">
    Quyida loyihangizda topilgan, konvertatsiya qilinişi mumkin bölgan matnlar körsatilgan.
    Kerakmaganlarini bekor qiling, keyin "Tanlanganlarni qöllaş" tugmasini bosing — faqat
    belgilangan özgarişlar fayllarga yoziladi.
  </p>
  <div class="toolbar">
    <button class="ghost" id="select-all">Barçasini tanlaş</button>
    <button class="ghost" id="select-none">Barçasini bekor qiliş</button>
    <span id="count"></span>
  </div>
  <div id="files"></div>
  <div class="toolbar">
    <button id="apply">Tanlanganlarni qöllaş</button>
  </div>
  <div id="summary"></div>

  <script>
    const data = ${initialData};
    const approved = new Set();
    for (const group of data) for (const item of group.items) approved.add(item.id);

    function render() {
      const filesEl = document.getElementById("files");
      filesEl.innerHTML = "";
      let total = 0;
      for (const group of data) {
        total += group.items.length;
        const fileDiv = document.createElement("div");
        fileDiv.className = "file";
        fileDiv.innerHTML = \`<div class="file-header">
          <span class="file-name">\${group.file}</span>
          <span class="file-actions">
            <a data-act="all">barçasi</a>
            <a data-act="none">hiçbiri</a>
          </span>
          <span>\${group.items.length} ta</span>
        </div>\`;
        fileDiv.querySelector('[data-act="all"]').addEventListener("click", () => {
          for (const item of group.items) approved.add(item.id);
          render();
        });
        fileDiv.querySelector('[data-act="none"]').addEventListener("click", () => {
          for (const item of group.items) approved.delete(item.id);
          render();
        });
        for (const item of group.items) {
          const row = document.createElement("div");
          row.className = "item";
          const editorHref = "vscode://file/" + encodeURI(group.absFile) + ":" + item.line + ":" + item.column;
          const checkboxId = "c" + item.id;
          row.innerHTML = \`
            <input type="checkbox" id="\${checkboxId}" \${approved.has(item.id) ? "checked" : ""} data-id="\${item.id}" />
            <a class="line-link" href="\${editorHref}" title="VS Code'da şu qatorda oçiş">:\${item.line}</a>
            <label for="\${checkboxId}" style="flex:1; min-width:0; cursor:pointer;">
              <code class="original">\${escapeHtml(item.original)}</code>
              <code class="converted">\${escapeHtml(item.converted)}</code>
            </label>\`;
          row.querySelector("input").addEventListener("change", (e) => {
            if (e.target.checked) approved.add(item.id);
            else approved.delete(item.id);
            updateCount();
          });
          fileDiv.appendChild(row);
        }
        filesEl.appendChild(fileDiv);
      }
      document.getElementById("count").textContent = total + " ta matn topildi";
      updateCount();
    }

    function updateCount() {
      document.getElementById("apply").textContent =
        approved.size + " ta tanlangan özgarişni qöllaş";
      document.getElementById("apply").disabled = approved.size === 0;
    }

    function escapeHtml(s) {
      return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    }

    document.getElementById("select-all").addEventListener("click", () => {
      for (const group of data) for (const item of group.items) approved.add(item.id);
      render();
    });
    document.getElementById("select-none").addEventListener("click", () => {
      approved.clear();
      render();
    });

    document.getElementById("apply").addEventListener("click", async () => {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approvedIds: [...approved] }),
      });
      const summary = await res.json();
      const el = document.getElementById("summary");
      el.style.display = "block";
      const applied = summary.files.filter((f) => f.count > 0);
      const staleCount = summary.files.reduce((sum, f) => sum + f.stale, 0);
      const parts = [];
      if (applied.length > 0) {
        parts.push("Qöllandi: " + applied.map((f) => f.file + " (" + f.count + " ta)").join(", ") + ".");
      }
      if (staleCount > 0) {
        parts.push(
          staleCount + " ta özgariş eskirgan edi (fayl şu orada başqa yol bilan özgargan) — sahifani yangilab qayta körib çiqing.",
        );
      }
      if (parts.length === 0) parts.push("Heç narsa qöllanilmadi.");
      else parts.push("Endi bu oynani yopişingiz mumkin.");
      el.textContent = parts.join(" ");
    });

    render();
  </script>
</body>
</html>`;
}
