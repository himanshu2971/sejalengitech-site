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

      {noindex && (
        <meta key="robots" name="robots" content="noindex,nofollow" />
      )}

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

      <script
        key="jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            {
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Organization",
                  "@id": "https://www.sejalengitech.in/#organization",
                  name: "Sejal Engitech Private Limited",
                  url: "https://www.sejalengitech.in/",
                  logo: "https://www.sejalengitech.in/logo.png",
                  email: "info.sejalengitech@gmail.com",
                  telephone: "+91-7004767198",
                  contactPoint: [
                    {
                      "@type": "ContactPoint",
                      contactType: "customer service",
                      email: "info.sejalengitech@gmail.com",
                      telephone: "+91-7004767198",
                    },
                  ],
                },
                {
                  "@type": "LocalBusiness",
                  "@id": "https://www.sejalengitech.in/#localbusiness",
                  name: "Sejal Engitech Private Limited",
                  url: "https://www.sejalengitech.in/",
                  telephone: "+91-7004767198",
                  email: "info.sejalengitech@gmail.com",
                  address: {
                    "@type": "PostalAddress",
                    streetAddress:
                      "Abhiyanta Nagar, Ranjan Path, Bailey Road, Danapur",
                    addressLocality: "Danapur",
                    addressRegion: "Bihar",
                    addressCountry: "IN",
                  },
                },
                {
                  "@type": "WebSite",
                  "@id": "https://www.sejalengitech.in/#website",
                  url: "https://www.sejalengitech.in/",
                  name: "Sejal Engitech",
                  publisher: {
                    "@id": "https://www.sejalengitech.in/#organization",
                  },
                },
              ],
            },
            null,
            0
          ).replace(/</g, "\\u003c"),
        }}
      />
            {/* Favicons */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <meta name="theme-color" content="#1e293b" />

    </Head>
  );
}
