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
      initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
      transition={{ duration: 0.35, ease: "easeOut" }}
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
