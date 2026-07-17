const THEME_SCRIPT = `(function () {
  try {
    var stored = localStorage.getItem("imlogram:theme");
    var dark = stored === "dark" || (stored !== "light" && window.matchMedia("(prefers-color-scheme: dark)").matches);
    if (dark) document.documentElement.classList.add("dark");
  } catch (e) {}
})();`;

// Runs synchronously as the first thing in <body>, before the header paints,
// so the correct theme class is already set and there's no light-flash on a
// dark-mode visitor's first load (or vice versa).
export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />;
}
