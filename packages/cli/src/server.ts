import { createServer } from "node:http";
import type { Candidate } from "./scan.js";
import { applyCandidates } from "./apply.js";
import { renderReviewPage } from "./ui.js";

export function startServer(candidates: Candidate[], rootDir: string, port: number): void {
  const server = createServer(async (req, res) => {
    if (req.method === "GET" && req.url === "/") {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(renderReviewPage(candidates, rootDir));
      return;
    }

    if (req.method === "POST" && req.url === "/api/apply") {
      let body = "";
      for await (const chunk of req) body += chunk;
      let approvedIds: string[] = [];
      try {
        approvedIds = JSON.parse(body).approvedIds ?? [];
      } catch {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Notöğri sörov tanasi." }));
        return;
      }

      const approvedSet = new Set(approvedIds);
      for (const c of candidates) c.approved = approvedSet.has(c.id);

      const summaries = applyCandidates(candidates);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ files: summaries.map((s) => ({ file: s.file, count: s.count })) }));
      return;
    }

    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not found");
  });

  server.listen(port, () => {
    console.log(`\nKörib çiqiş uçun brauzerda oçing: http://localhost:${port}\n`);
  });
}
