import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { dirname } from "node:path";
import { render, publicRoutes, privateRoutes } from "../dist-ssr/entry-server.js";

const template = await readFile("dist/index.html", "utf8");
for (const route of [...publicRoutes, ...privateRoutes, "/404"]) {
  const { html, head } = render(route);
  const output = route === "/" ? "dist/index.html" : `dist${route}.html`;
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, template.replace("<!--seo-head-->", () => head).replace('<div id="root"></div>', () => `<div id="root">${html}</div>`));
}
const urls = publicRoutes.map(route => `  <url><loc>https://wildscatter.com${route}</loc></url>`).join("\n");
await writeFile("dist/sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
await rm("dist-ssr", { recursive: true, force: true });
console.log(`Prerendered ${publicRoutes.length} public pages, ${privateRoutes.length} utility pages and a 404 page.`);
