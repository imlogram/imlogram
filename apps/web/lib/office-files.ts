import { unzipSync, zipSync, strFromU8, strToU8 } from "fflate";

type Convert = (text: string) => string;

function unescapeXml(s: string): string {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Replaces every non-empty `<tag ...>text</tag>` body in `xml` with `convert(text)`,
 * XML-entity-safe. `tagRe` must have its capture group around the inner text and the
 * global flag set. */
function convertXmlTextNodes(xml: string, tagRe: RegExp, convert: Convert): string {
  return xml.replace(tagRe, (whole, inner: string) => {
    if (inner.trim().length === 0) return whole;
    const converted = escapeXml(convert(unescapeXml(inner)));
    return whole.replace(inner, converted);
  });
}

const DOCX_TEXT_RE = /<w:t(?:\s[^>]*)?>([^<]*)<\/w:t>/g;
const XLSX_TEXT_RE = /<t(?:\s[^>]*)?>([^<]*)<\/t>/g;

const DOCX_TEXT_FILE_RE = /^word\/(document|header\d*|footer\d*)\.xml$/;
const XLSX_TEXT_FILE_RE = /^(xl\/sharedStrings\.xml|xl\/worksheets\/sheet\d+\.xml)$/;

/** Converts every text run inside a .docx's document/header/footer XML parts, leaving
 * every other part (styles, media, relationships, ...) byte-for-byte untouched. */
export async function convertDocx(buffer: ArrayBuffer, convert: Convert): Promise<Uint8Array> {
  const files = unzipSync(new Uint8Array(buffer));
  for (const [name, data] of Object.entries(files)) {
    if (!DOCX_TEXT_FILE_RE.test(name)) continue;
    const xml = convertXmlTextNodes(strFromU8(data), DOCX_TEXT_RE, convert);
    files[name] = strToU8(xml);
  }
  return zipSync(files, { level: 6 });
}

/** Converts every shared-string and inline-string text run inside a .xlsx, leaving
 * formulas, formatting, and every other part untouched. */
export async function convertXlsx(buffer: ArrayBuffer, convert: Convert): Promise<Uint8Array> {
  const files = unzipSync(new Uint8Array(buffer));
  for (const [name, data] of Object.entries(files)) {
    if (!XLSX_TEXT_FILE_RE.test(name)) continue;
    const xml = convertXmlTextNodes(strFromU8(data), XLSX_TEXT_RE, convert);
    files[name] = strToU8(xml);
  }
  return zipSync(files, { level: 6 });
}
