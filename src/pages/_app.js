import { Analytics } from "@vercel/analytics/next";
import '../styles/globals.css';  // Line 2 - KEEP THIS
import { useState } from "react";
import SEO from "@/components/seo/SEO";

export default function App({ Component, pageProps }) {
  return (
    <>
      <SEO />
      <Component {...pageProps} />
      <Analytics />
    </>
  )
}
