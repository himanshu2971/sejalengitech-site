import Head from "next/head";
import SEO_CONFIG from "@/config/seo.config";

const SEO = ({ title, description }) => {
  const pageTitle = title
    ? `${title} | ${SEO_CONFIG.siteName}`
    : SEO_CONFIG.defaultTitle;

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta
        name="description"
        content={description || SEO_CONFIG.description}
      />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
  );
};

export default SEO;
