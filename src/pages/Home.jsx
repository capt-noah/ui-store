import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const revealGroup = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.2, delayChildren: 0.2 },
  },
};

const delayedListGroup = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.3, delayChildren: 0.8 },
  },
};

const delayedCardGroup = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.3, delayChildren: 1.0 },
  },
};

const flyUp = {
  hidden: { opacity: 0, y: 36 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

const titleFlyUp = {
  hidden: { opacity: 0, y: 42 },
  show: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.3, duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

const descriptionFlyUp = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { delay: 0.6, duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
};

const slideIn = {
  hidden: { opacity: 0, x: -34 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.66, ease: [0.16, 1, 0.3, 1] },
  },
};

const cardReveal = {
  hidden: { opacity: 0, x: -22, y: 24, scale: 0.98 },
  show: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    transition: { duration: 0.66, ease: [0.16, 1, 0.3, 1] },
  },
};

const SectionIntro = ({ eyebrow, title, copy, inverted = false }) => (
  <motion.div
    variants={revealGroup}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, margin: "-120px" }}
  >
    <motion.div
      variants={flyUp}
      className={`text-xs font-black uppercase tracking-[0.22em] mb-5 ${inverted ? "text-gray-500" : "text-gray-400"}`}
    >
      {eyebrow}
    </motion.div>
    <motion.h2
      variants={titleFlyUp}
      className="text-5xl md:text-6xl font-bold tracking-tighter leading-none mb-6"
    >
      {title}
    </motion.h2>
    {copy && (
      <motion.p
        variants={descriptionFlyUp}
        className={`text-xl font-medium leading-relaxed max-w-2xl ${inverted ? "text-gray-400" : "text-gray-500"}`}
      >
        {copy}
      </motion.p>
    )}
  </motion.div>
);

const JoinCommunityCard = () => (
  <motion.div
    variants={cardReveal}
    className="bento-card !p-16 bg-gray-950 text-white overflow-hidden relative min-h-screen w-full"
  >
    <div className="absolute inset-x-0 top-0 h-px bg-white/20"></div>
    <motion.div variants={flyUp} className="flex items-center gap-4 mb-10">
      <div className="w-14 h-14 rounded-3xl bg-white text-black flex items-center justify-center font-black text-xl">
        U
      </div>
      <div>
        <div className="text-2xl md:text-3xl font-black tracking-tight">
          UIStore Community
        </div>
        <div className="text-sm md:text-base text-gray-400 font-bold uppercase tracking-widest mt-2">
          Free contributor access
        </div>
      </div>
    </motion.div>
    <motion.h3
      variants={titleFlyUp}
      className="text-4xl md:text-5xl font-bold tracking-tighter mb-6 leading-tight"
    >
      Share working components with developers shipping real products.
    </motion.h3>
    <motion.p
      variants={descriptionFlyUp}
      className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-3xl mb-10"
    >
      Create an account to publish free components, follow contributors, and
      submit premium releases for review.
    </motion.p>
    <motion.div
      variants={delayedListGroup}
      className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10"
    >
      {["Submit JSX", "Earn credits", "Join Discord", "Review drops"].map(
        (item, i) => (
          <motion.div
            key={item}
            variants={slideIn}
            className="rounded-3xl border border-white/10 bg-white/[0.06] px-5 py-4 text-base md:text-lg font-bold text-gray-200"
          >
            {item}
          </motion.div>
        ),
      )}
    </motion.div>
    <motion.div
      variants={descriptionFlyUp}
      className="flex flex-col sm:flex-row gap-4"
    >
      <Link
        to="/auth"
        className="bg-white text-black px-6 py-4 rounded-[28px] font-black text-base md:text-lg text-center hover:bg-gray-100 transition-colors"
      >
        Create account
      </Link>
      <Link
        to="/auth?mode=login"
        className="border border-white/15 px-6 py-4 rounded-[28px] font-black text-base md:text-lg text-center text-gray-300 hover:text-white hover:border-white/30 transition-colors"
      >
        Login
      </Link>
    </motion.div>
  </motion.div>
);

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative px-8 pt-32 pb-60 overflow-hidden">
        <div className="max-w-6xl mx-auto text-center relative z-20">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-7xl md:text-9xl font-bold tracking-tighter leading-[0.85] mb-12"
          >
            Production Ready <br />
            <span className="text-gray-300">React Components.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.46,
              duration: 0.72,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="text-2xl text-gray-500 font-medium max-w-3xl mx-auto leading-relaxed mb-16"
          >
            Premium building blocks for developers who value quality and speed.
            Styled with Tailwind, powered by React, and logic-complete.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.68, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link
              to="/marketplace"
              className="bg-black text-white px-10 py-5 rounded-[24px] font-bold text-lg hover:scale-105 transition-all shadow-2xl shadow-black/20"
            >
              Explore Components
            </Link>
            <Link
              to="/pricing"
              className="bg-white text-gray-900 border border-gray-100 px-10 py-5 rounded-[24px] font-bold text-lg hover:bg-gray-50 transition-all"
            >
              Buy Credits
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-12 max-w-4xl mx-auto"
          >
            {["Responsive", "Accessible", "Vite Ready", "Logic Included"].map(
              (item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.98 + i * 0.16,
                    duration: 0.58,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="flex items-center gap-3 text-xs font-black uppercase tracking-widest text-gray-400"
                >
                  <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                  {item}
                </motion.div>
              ),
            )}
          </motion.div>
        </div>

        {/* Background Floating Elements */}
        <motion.div
          animate={{ y: [0, -40, 0], rotate: [0, 5, 0] }}
          transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
          className="floating-mockup w-96 h-64 top-40 -left-20 bg-gray-50/50 backdrop-blur-xl opacity-40 p-8"
        >
          <div className="w-full h-4 bg-gray-200 rounded-full mb-4"></div>
          <div className="w-3/4 h-4 bg-gray-200 rounded-full mb-8"></div>
          <div className="w-full h-24 bg-black/5 rounded-2xl"></div>
        </motion.div>

        <motion.div
          animate={{ y: [0, 40, 0], rotate: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
          className="floating-mockup w-80 h-96 top-60 -right-20 bg-white/70 backdrop-blur-xl opacity-50 p-10"
        >
          <div className="flex gap-2 mb-8">
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
          </div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded-full w-full"></div>
            <div className="h-4 bg-gray-200 rounded-full w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded-full w-full"></div>
            <div className="h-4 bg-gray-200 rounded-full w-1/2"></div>
          </div>
        </motion.div>
      </section>

      {/* Community Section */}
      <section id="community" className="px-8 py-40 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-16 items-center">
            <motion.div
              variants={revealGroup}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-120px" }}
            >
              <motion.h2
                variants={titleFlyUp}
                className="text-6xl font-bold tracking-tighter mb-8"
              >
                Built by us. <br />
                <span className="text-gray-200">Powered by you.</span>
              </motion.h2>
              <motion.p
                variants={descriptionFlyUp}
                className="text-xl text-gray-500 font-medium mb-12 leading-relaxed"
              >
                Join 50,000+ developers contributing to a practical React
                component library. Share your work, earn credits, and build
                together.
              </motion.p>
              <motion.ul
                variants={delayedListGroup}
                className="space-y-5 mb-12"
              >
                {[
                  "Access thousands of free community components",
                  "Earn credits by publishing your own premium work",
                  "Get peer-reviewed and verified by UIStore experts",
                  "Fork and customize anything in one click",
                ].map((item, i) => (
                  <motion.li
                    key={i}
                    variants={slideIn}
                    className="flex items-center gap-4 text-lg font-bold"
                  >
                    <div className="w-8 h-8 bg-gray-100 text-gray-500 rounded-2xl flex items-center justify-center text-xs font-black">
                      {String(i + 1).padStart(2, "0")}
                    </div>
                    {item}
                  </motion.li>
                ))}
              </motion.ul>
              <motion.div
                variants={slideIn}
                transition={{
                  delay: 2.2,
                  duration: 0.66,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="inline-block"
              >
                <Link to="/auth" className="btn-primary text-lg inline-flex">
                  Join the Ecosystem
                </Link>
              </motion.div>
            </motion.div>
            <motion.div
              variants={delayedCardGroup}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-120px" }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              <div className="space-y-8">
                <motion.div
                  variants={cardReveal}
                  className="bento-card bg-gray-50 border-gray-100 !p-8"
                >
                  <div className="text-4xl font-bold mb-2">50k+</div>
                  <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                    Developers
                  </div>
                </motion.div>
                <motion.div
                  variants={cardReveal}
                  className="bento-card bg-white !p-8 h-64 flex flex-col justify-end"
                >
                  <div className="text-4xl font-bold mb-2">12k+</div>
                  <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                    Components
                  </div>
                </motion.div>
              </div>
              <div className="space-y-8 pt-12">
                <motion.div
                  variants={cardReveal}
                  className="bento-card bg-white !p-8 h-80 flex flex-col justify-end"
                >
                  <div className="text-4xl font-bold mb-2">99%</div>
                  <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                    Satisfaction
                  </div>
                </motion.div>
                <motion.div
                  variants={cardReveal}
                  className="bento-card bg-black text-white !p-8"
                >
                  <div className="text-4xl font-bold mb-2">24/7</div>
                  <div className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                    Support
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Components */}
      <section className="px-8 py-40 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={revealGroup}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-120px" }}
            className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16"
          >
            <div>
              <motion.div
                variants={flyUp}
                className="text-xs font-black uppercase tracking-[0.22em] text-gray-400 mb-5"
              >
                Featured drops
              </motion.div>
              <motion.h2
                variants={titleFlyUp}
                className="text-6xl font-bold tracking-tighter leading-none mb-6"
              >
                Components that feel shipped.
              </motion.h2>
              <motion.p
                variants={descriptionFlyUp}
                className="text-xl text-gray-500 font-medium max-w-2xl leading-relaxed"
              >
                Start with real component patterns: buttons, auth forms,
                loaders, cards, dashboards, data tables, charts, navigation,
                pricing, and hero sections.
              </motion.p>
            </div>
            <Link
              to="/marketplace"
              className="bg-black text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-all inline-flex items-center gap-3 w-max"
            >
              Browse gallery
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </motion.div>

          <motion.div
            variants={delayedCardGroup}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                title: "Primary Action Button",
                meta: "Free community component",
                color: "bg-black text-white",
                preview: "button",
              },
              {
                title: "Modern Login Form",
                meta: "15 credits · logic included",
                color: "bg-white text-black",
                preview: "form",
              },
              {
                title: "Pulse Loader",
                meta: "Free community component",
                color: "bg-white text-black",
                preview: "loader",
              },
              {
                title: "Analytics Area Chart",
                meta: "25 credits · SVG tooltip",
                color: "bg-gray-50 text-gray-800",
                preview: "chart",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                variants={cardReveal}
                className={`bento-card !p-6 !rounded-[28px] min-h-[330px] flex flex-col justify-between group ${item.color}`}
              >
                <div className="h-44 rounded-[22px] bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                  {item.preview === "button" && (
                    <button className="bg-black text-white px-6 py-3 rounded-xl font-bold group-hover:scale-105 transition-transform">
                      Click me
                    </button>
                  )}
                  {item.preview === "form" && (
                    <div className="w-44 bg-white rounded-2xl border border-gray-100 p-4 shadow-sm space-y-2">
                      <div className="h-2 bg-gray-100 rounded-full w-24"></div>
                      <div className="h-8 bg-gray-50 border border-gray-100 rounded-lg"></div>
                      <div className="h-8 bg-black rounded-lg"></div>
                    </div>
                  )}
                  {item.preview === "loader" && (
                    <div className="flex gap-2">
                      {[0, 0.2, 0.4].map((delay) => (
                        <motion.div
                          key={delay}
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [1, 0.45, 1],
                          }}
                          transition={{
                            repeat: Infinity,
                            duration: 1.1,
                            delay,
                          }}
                          className="w-4 h-4 rounded-full bg-black"
                        />
                      ))}
                    </div>
                  )}
                  {item.preview === "chart" && (
                    <svg viewBox="0 0 180 90" className="w-44 h-24">
                      <path
                        d="M8 72 C42 28, 62 56, 88 36 S138 30, 172 12"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M8 72 C42 28, 62 56, 88 36 S138 30, 172 12 L172 86 L8 86 Z"
                        fill="currentColor"
                        opacity="0.08"
                      />
                    </svg>
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold tracking-tight mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                    {item.meta}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="px-8 py-40 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-20 items-start">
          <motion.div
            variants={revealGroup}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-120px" }}
            className="lg:sticky lg:top-32"
          >
            <motion.div
              variants={flyUp}
              className="text-xs font-black uppercase tracking-[0.22em] text-gray-400 mb-5"
            >
              Credit workflow
            </motion.div>
            <motion.h2
              variants={titleFlyUp}
              className="text-6xl font-bold tracking-tighter leading-none mb-8"
            >
              Unlock once. Ship everywhere.
            </motion.h2>
            <motion.p
              variants={descriptionFlyUp}
              className="text-xl text-gray-500 font-medium leading-relaxed"
            >
              UIStore keeps the purchase flow simple: preview the real
              component, spend credits only when it fits, then copy JSX or
              download the package.
            </motion.p>
          </motion.div>
          <motion.div
            variants={delayedListGroup}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="space-y-5"
          >
            {[
              [
                "01",
                "Buy credits",
                "Choose a package for your team or solo workflow.",
              ],
              [
                "02",
                "Browse components",
                "Filter by category, popularity, cost, or free community releases.",
              ],
              [
                "03",
                "Preview live",
                "Interact with the real component before spending credits.",
              ],
              [
                "04",
                "Unlock source",
                "Copy JSX, download source, and review dependencies.",
              ],
              [
                "05",
                "Integrate fast",
                "Drop Tailwind-ready React code into your Vite app.",
              ],
            ].map((step, i) => (
              <motion.div
                key={step[0]}
                variants={slideIn}
                className="grid grid-cols-[72px_1fr] gap-8 p-8 rounded-[28px] border border-gray-100 hover:border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <div className="text-sm font-black text-gray-400 tracking-widest">
                  {step[0]}
                </div>
                <div>
                  <h3 className="text-2xl font-bold tracking-tight mb-2">
                    {step[1]}
                  </h3>
                  <p className="text-gray-500 font-medium">{step[2]}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Proof and FAQ */}
      <section className="px-8 py-40 bg-gray-950 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl mb-16">
            <SectionIntro
              eyebrow="Developer proof"
              title="Premium enough for paid work. Open enough for community."
              copy="Use official premium components for client-ready builds, and pull from free community submissions when you need fast utility patterns."
              inverted
            />
          </div>
          <motion.div
            variants={delayedCardGroup}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-20"
          >
            {[
              [
                "Maya Chen",
                "Frontend lead",
                "The source is clean enough to paste into a production repo without rewriting the architecture.",
              ],
              [
                "Aaron Patel",
                "Indie founder",
                "Credits make sense. I only spend when the preview proves the component will save real time.",
              ],
              [
                "Lena Morris",
                "Design engineer",
                "The free community layer keeps discovery fun while the official library feels trustworthy.",
              ],
            ].map((quote, i) => (
              <motion.figure
                key={quote[0]}
                variants={cardReveal}
                className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8"
              >
                <blockquote className="text-lg font-medium leading-relaxed mb-8 text-gray-100">
                  "{quote[2]}"
                </blockquote>
                <figcaption>
                  <div className="font-bold">{quote[0]}</div>
                  <div className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-1">
                    {quote[1]}
                  </div>
                </figcaption>
              </motion.figure>
            ))}
          </motion.div>
          <motion.div
            variants={delayedListGroup}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {[
              [
                "Do free components require credits?",
                "No. Free community components can be previewed, copied, and downloaded without an unlock step.",
              ],
              [
                "What do premium purchases include?",
                "React JSX source, JavaScript logic, Tailwind styling, responsive behavior, dependencies, and integration notes.",
              ],
              [
                "Can I contribute components?",
                "Yes. Community contributors can publish free components and apply for premium credit-earning releases.",
              ],
              [
                "Is this Vite-ready?",
                "Yes. UIStore components are designed around React, JavaScript, Tailwind CSS, and Vite-ready setup.",
              ],
            ].map((faq, i) => (
              <motion.div
                key={faq[0]}
                variants={slideIn}
                className="rounded-[24px] border border-white/10 p-7"
              >
                <h3 className="font-bold text-lg mb-3">{faq[0]}</h3>
                <p className="text-gray-400 leading-relaxed">{faq[1]}</p>
              </motion.div>
            ))}
          </motion.div>
          <motion.div
            variants={revealGroup}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-120px" }}
            className="mt-16"
          >
            <JoinCommunityCard />
          </motion.div>
        </div>
      </section>

      <footer className="px-8 py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold tracking-tighter mb-8">
            Build Faster. Ship Sooner.
          </h2>
          <p className="text-gray-400 text-sm font-bold uppercase tracking-[0.2em] mb-12">
            © 2026 UIStore. All rights reserved.
          </p>
          <div className="flex justify-center gap-12 text-sm font-bold text-gray-400 uppercase tracking-widest">
            <a href="#" className="hover:text-black transition-colors">
              Twitter
            </a>
            <a href="#" className="hover:text-black transition-colors">
              GitHub
            </a>
            <a href="#" className="hover:text-black transition-colors">
              Discord
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
