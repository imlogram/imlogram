export type SegmentKind =
  | "text"
  | "url"
  | "email"
  | "code-block"
  | "inline-code"
  | "html-tag"
  | "html-entity"
  | "front-matter";

export interface Segment {
  kind: SegmentKind;
  raw: string;
  start: number;
  end: number;
}

export interface ProtectorMatch {
  kind: Exclude<SegmentKind, "text">;
  start: number;
  end: number;
}

export type Protector = (text: string) => ProtectorMatch[];
