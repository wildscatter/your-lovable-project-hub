import { createRoot, hydrateRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";

const root = document.getElementById("root")!;
// Keep account and secondary-page code out of the initial homepage download.
const appModule = window.location.pathname === "/" ? import("./HomeApp") : import("./App");
appModule.then(({ default: App }) => {
  const app = <HelmetProvider><App /></HelmetProvider>;
  if (root.hasChildNodes()) {
    hydrateRoot(root, app);
  } else {
    createRoot(root).render(app);
  }
});
