export function isUpper(ch: string): boolean {
  return ch !== ch.toLowerCase() && ch === ch.toUpperCase();
}

export function applySingleCharCase(replacement: string, sourceChar: string): string {
  return isUpper(sourceChar) ? replacement.toUpperCase() : replacement.toLowerCase();
}
