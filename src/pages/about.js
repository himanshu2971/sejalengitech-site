import Head from "next/head";

import AboutHero from "@/components/about/AboutHero";
import MissionAndAtAGlance from "@/components/about/MissionAndAtAGlance";
import WhyChooseUs from "@/components/about/WhyChooseUs";
import LeadershipTeam from "@/components/about/LeadershipTeam";

export default function About() {
  return (
    <>
      <Head>
        <title>About | Sejal Engitech & Alambana</title>
      </Head>

      <AboutHero />
      <MissionAndAtAGlance />
      <WhyChooseUs />
      <LeadershipTeam />
    </>
  );
}
