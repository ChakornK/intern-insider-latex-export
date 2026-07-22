import { FilePen } from "lucide-solid";
import { render } from "solid-js/web";
// @ts-ignore
import appStyles from "./index.css" with { type: "css" };
import { exportCoverLetter, exportResume } from "./lib/exportLatex";
import { closeRadixPopover } from "./lib/helpers";

const ALLOWED_PATHS = ["/dashboard/resume-builder", "/dashboard/cover-letter-builder"];

let dispose = () => {};
const injectBtn = () => {
  try {
    dispose();
  } catch {}
  const injectionTarget = document.querySelector("[data-radix-popper-content-wrapper] > div");
  if (!injectionTarget) return;

  const isExportPopover = [...injectionTarget.querySelectorAll("*")].find((node) => node.textContent === "Export");
  if (!isExportPopover) return;

  const root = document.createElement("div");
  injectionTarget.appendChild(root);
  const shadowRoot = root.attachShadow({ mode: "closed" });

  const appStyleSheet = new CSSStyleSheet();
  appStyleSheet.replaceSync(appStyles);
  shadowRoot.adoptedStyleSheets = [...document.adoptedStyleSheets, appStyleSheet];

  if (window.location.pathname.startsWith("/dashboard/cover-letter-builder")) {
    dispose = render(() => <ExportLatexBtn exporter={exportCoverLetter} defaultName="cover_letter" />, shadowRoot);
  } else if (window.location.pathname.startsWith("/dashboard/resume-builder")) {
    dispose = render(() => <ExportLatexBtn exporter={exportResume} defaultName="resume" />, shadowRoot);
  }
};

let observer: MutationObserver;
const mountObserver = () => {
  try {
    observer.disconnect();
  } catch {}
  if (!ALLOWED_PATHS.find((p) => window.location.pathname.startsWith(p))) {
    try {
      dispose();
    } catch {}
    return;
  }
  observer = new MutationObserver(injectBtn);
  observer.observe(document.body, { childList: true, subtree: false });
  injectBtn();
};

const origPush = history.pushState;
history.pushState = function (...args) {
  origPush.apply(this, args);
  mountObserver();
};
const origReplace = history.replaceState;
history.replaceState = function (...args) {
  origReplace.apply(this, args);
  mountObserver();
};
window.addEventListener("popstate", mountObserver);

mountObserver();

const ExportLatexBtn = ({ exporter, defaultName }: { exporter: () => string; defaultName: string }) => {
  return (
    <button
      class="focus:bg-accent focus:text-accent-foreground hover:bg-accent hover:text-accent-foreground bg-opacity-100 relative flex w-full cursor-default items-center rounded-sm px-2 py-1.5 text-sm transition-colors outline-none select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
      type="button"
      on:click={() => {
        const latex = exporter();

        const blob = new Blob([latex], { type: "text/plain" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `${document.querySelector("h1")?.textContent ?? defaultName}.tex`;
        link.click();
        URL.revokeObjectURL(url);

        closeRadixPopover();
      }}
    >
      <FilePen class="mr-2 h-4 w-4" />
      Download LaTeX
    </button>
  );
};
