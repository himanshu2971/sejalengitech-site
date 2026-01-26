import Head from "next/head";

import ServicesHero from "@/components/services/ServicesHero";
import ServicesGrid from "@/components/services/ServicesGrid";
import ServicesCrossSell from "@/components/services/ServicesCrossSell";

export default function Services() {
  return (
    <>
      <Head>
        <title>IT Services | Sejal Engitech</title>
      </Head>

      <ServicesHero />
      <ServicesGrid />
      <ServicesCrossSell />
    </>
  );
}
