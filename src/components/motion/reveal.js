export const REVEAL = {
  initial: { opacity: 0, y: 16, filter: "blur(6px)" },
  whileInView: { opacity: 1, y: 0, filter: "blur(0px)" },
  viewport: { once: true, amount: 0.35 },
  transition: { duration: 0.5, ease: "easeOut" },
};
