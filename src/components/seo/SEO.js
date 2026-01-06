import Head from "next/head";
import { useRouter } from "next/router";

const SITE_URL = "https://www.sejalengitech.in";
const SITE_NAME = "Sejal Engitech";
const DEFAULT_TITLE = "Sejal Engitech | IT Services Since 2014";
const DEFAULT_DESC =
  "A reliable IT partner for businesses, startups, and enterprises. Software, mobile apps, websites, networking, installations, and cyber security.";
const DEFAULT_OG_IMAGE = `${SITE_URL}/og.jpg`;

export default function SEO({
  title,
  description,
  canonical,
  ogImage,
  noindex = false,
}) {
  const router = useRouter();

  const metaTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
  const metaDesc = description || DEFAULT_DESC;

  const url =
    canonical || `${SITE_URL}${router.asPath === "/" ? "" : router.asPath}`;

  const image = ogImage || DEFAULT_OG_IMAGE;

  return (
    <Head>
      <title key="title">{metaTitle}</title>
      <meta key="description" name="description" content={metaDesc} />

      <link key="canonical" rel="canonical" href={url} />

      {noindex && <meta key="robots" name="robots" content="noindex,nofollow" />}

      {/* Open Graph */}
      <meta key="og:type" property="og:type" content="website" />
      <meta key="og:site_name" property="og:site_name" content={SITE_NAME} />
      <meta key="og:title" property="og:title" content={metaTitle} />
      <meta key="og:description" property="og:description" content={metaDesc} />
      <meta key="og:url" property="og:url" content={url} />
      <meta key="og:image" property="og:image" content={image} />

      {/* Twitter */}
      <meta
        key="twitter:card"
        name="twitter:card"
        content="summary_large_image"
      />
      <meta key="twitter:title" name="twitter:title" content={metaTitle} />
      <meta
        key="twitter:description"
        name="twitter:description"
        content={metaDesc}
      />
      <meta key="twitter:image" name="twitter:image" content={image} />
    </Head>
  );
}
