import { resolve } from "node:path";
import type { ConversionDirection } from "@imlogram/core";
import { scanProject } from "./scan.js";
import { startServer } from "./server.js";

interface ParsedArgs {
  command: string;
  path: string;
  direction: ConversionDirection;
  port: number;
}

function parseArgs(argv: string[]): ParsedArgs {
  const args = argv.slice(2);
  const command = args[0] ?? "help";
  let path = ".";
  let direction: ConversionDirection = "old_to_new";
  let port = 4321;

  // Accepts both `--flag=value` and `--flag value` — a flag that consumes the
  // next token must never fall through to the positional-path branch below.
  const rest = args.slice(1);
  for (let i = 0; i < rest.length; i++) {
    const arg = rest[i];
    if (arg.startsWith("--to=")) {
      direction = arg.slice("--to=".length) === "old" ? "new_to_old" : "old_to_new";
    } else if (arg === "--to") {
      direction = rest[++i] === "old" ? "new_to_old" : "old_to_new";
    } else if (arg.startsWith("--port=")) {
      port = Number(arg.slice("--port=".length)) || port;
    } else if (arg === "--port") {
      port = Number(rest[++i]) || port;
    } else if (!arg.startsWith("--")) {
      path = arg;
    }
  }

  return { command, path, direction, port };
}

function printHelp(): void {
  console.log(
    [
      "imlogram — özbek lotin alifbosini kodingizda toping va konvertatsiya qiling",
      "",
      "Foydalaniş:",
      "  npx @imlogram/cli migrate [papka] [--to=new|old] [--port=4321]",
      "",
      "Misollar:",
      "  npx @imlogram/cli migrate .                 # joriy papkani eski->yangi skanerlaş",
      "  npx @imlogram/cli migrate ./src --to=old     # yangi->eski",
      "",
      "Skanerlaşdan song brauzerda lokal sahifa oçiladi — u yerda har bir topilgan",
      "matnni ko'rib çiqib, tanlab tasdiqlaysiz. Faqat tasdiqlangan özgarişlar",
      "fayllarga yoziladi.",
    ].join("\n"),
  );
}

async function main(): Promise<void> {
  const { command, path, direction, port } = parseArgs(process.argv);

  if (command !== "migrate") {
    printHelp();
    process.exit(command === "help" ? 0 : 1);
  }

  const rootDir = resolve(path);
  console.log(`Skanerlanmoqda: ${rootDir}`);

  const candidates = scanProject(rootDir, direction);
  const fileCount = new Set(candidates.map((c) => c.file)).size;
  console.log(`${candidates.length} ta matn topildi (${fileCount} ta faylda).`);

  if (candidates.length === 0) {
    console.log("Konvertatsiya qilinadigan narsa topilmadi.");
    return;
  }

  startServer(candidates, rootDir, port);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
