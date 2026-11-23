import { Head } from "vite-react-ssg";
import { site } from "../config/site";

export default function Seo({
  title,
  description,
  path = "/",
  image,
  type = "website",
  noindex = false,
  jsonLd,
}) {
  const clean = path === "/" ? "/" : path.replace(/\/$/, "");
  const url = `${site.url}${clean}`;
  const img = image || `${site.url}/og-image.png`;
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noindex ? <meta name="robots" content="noindex, nofollow" /> : null}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={site.legalName} />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={img} />
      {jsonLd ? (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      ) : null}
    </Head>
  );
}
