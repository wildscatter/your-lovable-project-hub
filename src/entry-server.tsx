import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { HelmetProvider, type HelmetServerState } from "react-helmet-async";
import { AppContent } from "./App";
import { HomeContent } from "./HomeApp";
import { blogPosts } from "./data/blogPosts";

export const publicRoutes = [
  "/", "/about", "/support", "/blog", "/responsible-gambling", "/privacy-policy", "/terms",
  ...blogPosts.map(post => `/blog/${post.slug}`),
];
export const privateRoutes = ["/auth", "/reset-password", "/email-sent"];

export function render(url: string) {
  const context = {} as { helmet: HelmetServerState };
  const html = renderToString(
    <HelmetProvider context={context}>
      <StaticRouter location={url}>{url === "/" ? <HomeContent /> : <AppContent />}</StaticRouter>
    </HelmetProvider>
  );
  const { helmet } = context;
  const head = helmet.title.toString() + helmet.meta.toString() + helmet.link.toString() + helmet.script.toString();
  return { html, head };
}
