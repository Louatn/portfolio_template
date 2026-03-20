"use client";

import Link from "next/link";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { SignOutButton } from "@/components/SignOutButton";
import { useRef } from "react";

interface HomeClientProps {
  isAdmin: boolean;
  firstName: string;
}

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 1, ease: [0.22, 1, 0.36, 1] } }
};

export default function HomeClient({ isAdmin, firstName }: HomeClientProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.3]);

  return (
    <main ref={containerRef} className="relative bg-[#0a0f0d] text-[#f5f3f0] selection:bg-[#6b8e6f]/30">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 px-6 pt-6 sm:px-8 lg:px-12"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between rounded-2xl border border-[#3d4d43]/30 bg-[#0a0f0d]/80 px-6 py-4 shadow-2xl backdrop-blur-xl">
            <h1 className="font-display text-lg tracking-tight text-[#f5f3f0] sm:text-xl">
              Alex Morgan <span className="ml-2 text-[#6b8e6f]">•</span>
            </h1>

            <div className="flex items-center gap-6">
              <a href="#portfolio" className="hidden text-sm text-[#f5f3f0]/70 transition-colors hover:text-[#f5f3f0] sm:block">
                Portfolio
              </a>
              <a href="#about" className="hidden text-sm text-[#f5f3f0]/70 transition-colors hover:text-[#f5f3f0] sm:block">
                About
              </a>
              <a href="#contact" className="hidden text-sm text-[#f5f3f0]/70 transition-colors hover:text-[#f5f3f0] sm:block">
                Contact
              </a>
              
              {isAdmin ? (
                <div className="flex items-center gap-3">
                  <Link
                    href="/dashboard"
                    className="rounded-lg border border-[#6b8e6f]/30 bg-[#6b8e6f]/10 px-3 py-1.5 text-xs text-[#6b8e6f] transition-all hover:bg-[#6b8e6f]/20"
                  >
                    Dashboard
                  </Link>
                  <SignOutButton className="text-xs text-[#f5f3f0]/50 hover:text-[#f5f3f0]" />
                </div>
              ) : (
                <Link
                  href="/login"
                  className="text-xs text-[#f5f3f0]/50 transition-colors hover:text-[#f5f3f0]"
                >
                  Admin
                </Link>
              )}
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section ref={heroRef} className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {/* Background Image with Parallax */}
        <motion.div 
          style={{ y, opacity }}
          className="absolute inset-0 z-0"
        >
          {/* Placeholder landscape gradient - replace with actual image */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#2d3c33] via-[#1a2520] to-[#0a0f0d]" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJhIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxjaXJjbGUgY3g9IjIwIiBjeT0iMjAiIHI9IjEiIGZpbGw9IiNmNWYzZjAiIG9wYWNpdHk9IjAuMDUiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjYSkiLz48L3N2Zz4=')] opacity-40" />
          
          {/* Vignette overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f0d] via-transparent to-[#0a0f0d]/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f0d]/60 via-transparent to-[#0a0f0d]/60" />
        </motion.div>

        {/* Hero Content */}
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative z-10 mx-auto max-w-5xl px-6 text-center sm:px-8"
        >
          <motion.p variants={fadeInUp} className="mb-6 font-display text-sm tracking-[0.3em] text-[#6b8e6f] sm:text-base">
            LANDSCAPE ARTIST
          </motion.p>
          
          <motion.h2 variants={fadeInUp} className="mb-8 font-display text-5xl leading-[1.1] tracking-tight text-[#f5f3f0] sm:text-6xl md:text-7xl lg:text-8xl">
            Where Earth
            <br />
            Meets <span className="italic text-[#6b8e6f]">Artistry</span>
          </motion.h2>
          
          <motion.p variants={fadeInUp} className="mx-auto mb-12 max-w-2xl text-base leading-relaxed text-[#f5f3f0]/70 sm:text-lg">
            Capturing the sublime beauty of nature through the lens. Each landscape tells a story of light, texture, and timeless moments frozen in time.
          </motion.p>

          <motion.div variants={fadeInUp} className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#portfolio"
              className="group relative overflow-hidden rounded-full bg-[#6b8e6f] px-8 py-4 text-sm font-medium text-[#0a0f0d] transition-all hover:bg-[#7a9d7e] hover:shadow-[0_0_40px_-10px_rgba(107,142,111,0.6)]"
            >
              <span className="relative z-10 flex items-center gap-2">
                View Portfolio
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </a>
            <a
              href="#contact"
              className="rounded-full border border-[#3d4d43] bg-[#0a0f0d]/50 px-8 py-4 text-sm font-medium text-[#f5f3f0] backdrop-blur-sm transition-all hover:border-[#6b8e6f]/50 hover:bg-[#2d3c33]/50"
            >
              Get in Touch
            </a>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            variants={fadeInUp}
            className="absolute bottom-12 left-1/2 -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center gap-2"
            >
              <span className="text-xs tracking-[0.2em] text-[#f5f3f0]/50">SCROLL</span>
              <svg className="h-6 w-4 text-[#6b8e6f]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="relative z-10 overflow-hidden bg-[#0a0f0d] py-32">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid gap-16 lg:grid-cols-2 lg:gap-24"
          >
            {/* Portrait */}
            <motion.div variants={scaleIn} className="relative">
              <div className="aspect-[3/4] overflow-hidden rounded-3xl border border-[#3d4d43]/30 bg-gradient-to-br from-[#2d3c33] to-[#1a2520]">
                {/* Placeholder for artist portrait */}
                <div className="flex h-full items-center justify-center">
                  <p className="text-[#f5f3f0]/30">Artist Portrait</p>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 -z-10 h-full w-full rounded-3xl bg-[#6b8e6f]/10 blur-3xl" />
            </motion.div>

            {/* Bio */}
            <motion.div variants={fadeInUp} className="flex flex-col justify-center">
              <motion.p variants={fadeInUp} className="mb-4 font-display text-sm tracking-[0.3em] text-[#6b8e6f]">ABOUT THE ARTIST</motion.p>
              <h2 className="mb-6 font-display text-4xl tracking-tight text-[#f5f3f0] sm:text-5xl lg:text-6xl">
                Inspired by Nature&apos;s Grand Theatre
              </h2>
              <div className="space-y-6 text-base leading-relaxed text-[#f5f3f0]/70 sm:text-lg">
                <p>
                  For over a decade, I&apos;ve traveled to remote corners of the world, seeking moments where light dances across landscapes in ways that stop time itself.
                </p>
                <p>
                  My work explores the intersection of natural beauty and human emotion—capturing not just what I see, but what I feel in the presence of mountains, valleys, and endless horizons.
                </p>
                <p>
                  Each photograph is an invitation to pause, breathe, and reconnect with the wild spaces that ground us.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-6 border-t border-[#3d4d43]/30 pt-8">
                <div>
                  <p className="text-2xl font-medium text-[#6b8e6f]">150+</p>
                  <p className="text-sm text-[#f5f3f0]/50">Exhibitions</p>
                </div>
                <div>
                  <p className="text-2xl font-medium text-[#6b8e6f]">25+</p>
                  <p className="text-sm text-[#f5f3f0]/50">Awards</p>
                </div>
                <div>
                  <p className="text-2xl font-medium text-[#6b8e6f]">500+</p>
                  <p className="text-sm text-[#f5f3f0]/50">Prints Sold</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Portfolio Gallery Section */}
      <section id="portfolio" className="relative z-10 bg-gradient-to-b from-[#0a0f0d] to-[#0f1512] py-32">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mb-20 text-center"
          >
            <motion.p variants={fadeInUp} className="mb-4 font-display text-sm tracking-[0.3em] text-[#6b8e6f]">
              FEATURED WORK
            </motion.p>
            <motion.h2 variants={fadeInUp} className="font-display text-4xl tracking-tight text-[#f5f3f0] sm:text-5xl lg:text-6xl">
              Portfolio
            </motion.h2>
          </motion.div>

          {/* Masonry Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            {[
              { title: "Misty Mountain Dawn", location: "Swiss Alps", aspect: "aspect-[4/5]" },
              { title: "Golden Hour Valley", location: "Yosemite", aspect: "aspect-[4/3]" },
              { title: "Northern Lights", location: "Iceland", aspect: "aspect-square" },
              { title: "Desert Dunes", location: "Sahara", aspect: "aspect-[3/4]" },
              { title: "Coastal Serenity", location: "Big Sur", aspect: "aspect-[4/3]" },
              { title: "Forest Path", location: "Pacific Northwest", aspect: "aspect-[4/5]" },
            ].map((item, i) => (
              <motion.article
                key={i}
                variants={scaleIn}
                whileHover={{ y: -8 }}
                className="group relative overflow-hidden rounded-2xl border border-[#3d4d43]/20 bg-[#1a2520] transition-all hover:border-[#6b8e6f]/30 hover:shadow-2xl hover:shadow-[#6b8e6f]/10"
              >
                <div className={`${item.aspect} w-full overflow-hidden bg-gradient-to-br from-[#2d3c33] to-[#1a2520]`}>
                  {/* Placeholder - replace with actual images */}
                  <div className="flex h-full items-center justify-center transition-transform duration-700 group-hover:scale-110">
                    <p className="text-[#f5f3f0]/20">Landscape {i + 1}</p>
                  </div>
                </div>
                
                {/* Overlay */}
                <div className="image-overlay absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                
                {/* Info */}
                <div className="absolute bottom-0 left-0 right-0 translate-y-4 p-6 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  <h3 className="mb-1 font-display text-xl text-[#f5f3f0]">{item.title}</h3>
                  <p className="flex items-center gap-2 text-sm text-[#6b8e6f]">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {item.location}
                  </p>
                </div>
              </motion.article>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-16 text-center"
          >
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-[#6b8e6f]/30 bg-[#6b8e6f]/10 px-6 py-3 text-sm font-medium text-[#6b8e6f] transition-all hover:border-[#6b8e6f]/50 hover:bg-[#6b8e6f]/20"
            >
              View Full Collection
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section className="relative z-10 bg-[#0f1512] py-32">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mb-20 text-center"
          >
            <motion.p variants={fadeInUp} className="mb-4 font-display text-sm tracking-[0.3em] text-[#6b8e6f]">
              WHAT I OFFER
            </motion.p>
            <motion.h2 variants={fadeInUp} className="font-display text-4xl tracking-tight text-[#f5f3f0] sm:text-5xl lg:text-6xl">
              Services
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {[
              {
                title: "Fine Art Prints",
                desc: "Museum-quality giclée prints on archival paper or canvas. Each piece is signed, numbered, and comes with a certificate of authenticity.",
                icon: "M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              },
              {
                title: "Limited Editions",
                desc: "Exclusive limited edition series, available in carefully curated quantities. Collectible pieces for the discerning art enthusiast.",
                icon: "M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              },
              {
                title: "Commissioned Work",
                desc: "Custom landscape photography for specific locations or themes. I'll work with you to capture the perfect scene that speaks to your vision.",
                icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              },
              {
                title: "Exhibitions",
                desc: "Available for gallery shows, public exhibitions, and private viewings. Past exhibitions in renowned galleries worldwide.",
                icon: "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              },
              {
                title: "Licensing",
                desc: "Commercial licensing available for publications, advertising, and corporate use. Rights-managed and royalty-free options.",
                icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              },
              {
                title: "Workshops",
                desc: "Private and group photography workshops in stunning locations. Learn the art of landscape photography from planning to post-processing.",
                icon: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              },
            ].map((service, i) => (
              <motion.article
                key={i}
                variants={fadeInUp}
                className="group relative overflow-hidden rounded-2xl border border-[#3d4d43]/20 bg-[#0a0f0d]/50 p-8 backdrop-blur-sm transition-all hover:border-[#6b8e6f]/30 hover:bg-[#1a2520]/50"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[#6b8e6f]/10 text-[#6b8e6f] transition-all group-hover:bg-[#6b8e6f]/20">
                  <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={service.icon} />
                  </svg>
                </div>
                <h3 className="mb-4 font-display text-2xl text-[#f5f3f0]">{service.title}</h3>
                <p className="leading-relaxed text-[#f5f3f0]/60">{service.desc}</p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Process Section */}
      <section className="relative z-10 bg-gradient-to-b from-[#0f1512] to-[#0a0f0d] py-32">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mb-20 text-center"
          >
            <motion.p variants={fadeInUp} className="mb-4 font-display text-sm tracking-[0.3em] text-[#6b8e6f]">
              MY APPROACH
            </motion.p>
            <motion.h2 variants={fadeInUp} className="font-display text-4xl tracking-tight text-[#f5f3f0] sm:text-5xl lg:text-6xl">
              The Creative Process
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid gap-12 lg:grid-cols-4"
          >
            {[
              { num: "01", title: "Scout & Plan", desc: "Research locations, study weather patterns, and plan the perfect timing for optimal light conditions." },
              { num: "02", title: "Capture", desc: "Patient observation and technical precision to capture the scene exactly as envisioned, often waiting hours for the perfect moment." },
              { num: "03", title: "Refine", desc: "Careful post-processing to enhance the natural beauty while maintaining authenticity and emotional impact." },
              { num: "04", title: "Print & Frame", desc: "Museum-quality printing on archival materials, professionally framed to preserve the work for generations." },
            ].map((step, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="relative"
              >
                <div className="mb-6 font-display text-5xl text-[#6b8e6f]/20">{step.num}</div>
                <h3 className="mb-4 font-display text-2xl text-[#f5f3f0]">{step.title}</h3>
                <p className="leading-relaxed text-[#f5f3f0]/60">{step.desc}</p>
                
                {i < 3 && (
                  <div className="absolute right-0 top-8 hidden h-px w-full bg-gradient-to-r from-[#6b8e6f]/30 to-transparent lg:block" />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 bg-[#0a0f0d] py-32">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="mb-20 text-center"
          >
            <motion.p variants={fadeInUp} className="mb-4 font-display text-sm tracking-[0.3em] text-[#6b8e6f]">
              KIND WORDS
            </motion.p>
            <motion.h2 variants={fadeInUp} className="font-display text-4xl tracking-tight text-[#f5f3f0] sm:text-5xl lg:text-6xl">
              Client Testimonials
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {[
              { 
                quote: "The attention to detail and emotional depth in every photograph is extraordinary. The print we commissioned has become the centerpiece of our home.",
                author: "Sarah Williams",
                role: "Private Collector"
              },
              { 
                quote: "Working with Alex was an absolute pleasure. The final images exceeded our expectations and perfectly captured the essence of our brand's connection to nature.",
                author: "Michael Chen",
                role: "Creative Director, EcoLux"
              },
              { 
                quote: "Each piece tells a story that resonates deeply. The craftsmanship and artistic vision are unparalleled. A true master of the craft.",
                author: "Emma Thompson",
                role: "Gallery Owner"
              },
            ].map((testimonial, i) => (
              <motion.article
                key={i}
                variants={fadeInUp}
                className="rounded-2xl border border-[#3d4d43]/20 bg-[#1a2520]/30 p-8 backdrop-blur-sm"
              >
                <svg className="mb-6 h-8 w-8 text-[#6b8e6f]/30" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="mb-6 leading-relaxed text-[#f5f3f0]/80">{testimonial.quote}</p>
                <div>
                  <p className="font-medium text-[#f5f3f0]">{testimonial.author}</p>
                  <p className="text-sm text-[#f5f3f0]/50">{testimonial.role}</p>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative z-10 bg-gradient-to-b from-[#0a0f0d] to-[#0f1512] py-32">
        <div className="mx-auto max-w-4xl px-6 sm:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center"
          >
            <motion.p variants={fadeInUp} className="mb-4 font-display text-sm tracking-[0.3em] text-[#6b8e6f]">
              GET IN TOUCH
            </motion.p>
            <motion.h2 variants={fadeInUp} className="mb-8 font-display text-4xl tracking-tight text-[#f5f3f0] sm:text-5xl lg:text-6xl">
              Let&apos;s Create Something Beautiful
            </motion.h2>
            <motion.p variants={fadeInUp} className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-[#f5f3f0]/70">
              Interested in purchasing a print, commissioning a piece, or collaborating on a project? I&apos;d love to hear from you.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col items-center justify-center gap-6 sm:flex-row">
              <a
                href="mailto:hello@alexmorgan.art"
                className="group flex items-center gap-3 rounded-full bg-[#6b8e6f] px-8 py-4 font-medium text-[#0a0f0d] transition-all hover:bg-[#7a9d7e] hover:shadow-[0_0_40px_-10px_rgba(107,142,111,0.6)]"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send Email
              </a>
              
              <div className="flex items-center gap-4">
                {[
                  { icon: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z", label: "Twitter" },
                  { icon: "M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 2a2 2 0 11-2 2 2 2 0 012-2z", label: "LinkedIn" },
                  { icon: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z", label: "Instagram" },
                ].map((social, i) => (
                  <a
                    key={i}
                    href="#"
                    aria-label={social.label}
                    className="flex h-12 w-12 items-center justify-center rounded-full border border-[#3d4d43]/30 text-[#f5f3f0]/50 transition-all hover:border-[#6b8e6f]/50 hover:text-[#6b8e6f]"
                  >
                    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d={social.icon} />
                    </svg>
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[#3d4d43]/20 bg-[#0f1512] py-12">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <p className="text-sm text-[#f5f3f0]/40">
              © {new Date().getFullYear()} Alex Morgan. All rights reserved.
            </p>
            <div className="flex gap-8 text-sm">
              <a href="#" className="text-[#f5f3f0]/40 transition-colors hover:text-[#6b8e6f]">
                Privacy Policy
              </a>
              <a href="#" className="text-[#f5f3f0]/40 transition-colors hover:text-[#6b8e6f]">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
