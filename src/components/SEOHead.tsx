import { Helmet } from "react-helmet-async";

interface SEOHeadProps {
  title: string;
  description: string;
  canonical?: string;
  jsonLd?: object;
  noindex?: boolean;
  type?: "website" | "article";
}

const SEOHead = ({ title, description, canonical, jsonLd, noindex = false, type = "website" }: SEOHeadProps) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta name="robots" content={noindex ? "noindex, follow" : "index, follow"} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content={type} />
    <meta property="og:site_name" content="WildScatter" />
    <meta property="og:image" content="https://wildscatter.com/favicon.png" />
    <meta property="og:image:alt" content="WildScatter" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content="https://wildscatter.com/favicon.png" />
    {canonical && <link rel="canonical" href={canonical} />}
    {canonical && <meta property="og:url" content={canonical} />}
    {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd).replace(/</g, "\\u003c")}</script>}
  </Helmet>
);

export default SEOHead;
