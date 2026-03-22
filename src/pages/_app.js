import "../styles/globals.css";
import { Analytics } from "@vercel/analytics/next";
import Layout from "@/components/Layout";
import SEO from "@/components/seo/SEO";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const noLayout = Component.noLayout === true;

  const page = (
    <motion.div
      key={router.asPath}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      <Component {...pageProps} />
    </motion.div>
  );

  return (
    <>
      <SEO />
      <AnimatePresence mode="wait">
        {noLayout ? page : <Layout seo={pageProps?.seo}>{page}</Layout>}
      </AnimatePresence>
      <Analytics />
    </>
  );
}
