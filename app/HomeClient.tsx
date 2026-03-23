"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { loadPublicProjectsData, type PublicProject } from "@/lib/public-project-session";
import { getProjectImageUrl } from "@/lib/utils/image-helpers";
import { ProjectDetailModal } from "@/components/ProjectDetailModal";
import { Header } from "@/components/Header";
import { ProjectCard } from "@/components/ProjectCard.public";

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

export default function HomeClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [projects, setProjects] = useState<PublicProject[]>([]);
  const [selectedProject, setSelectedProject] = useState<PublicProject | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.3]);
  const blurOverlayOpacity = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const blurOverlayFilter = useTransform(scrollYProgress, [0, 1], ["blur(0px)", "blur(14px)"]);

  useEffect(() => {
    let isActive = true;

    const loadProjects = async () => {
      try {
        const data = await loadPublicProjectsData();
        if (!isActive) {
          return;
        }

        setProjects(data.featuredProjects);
      } catch (error) {
        console.error("Error loading featured projects:", error);
      }
    };

    loadProjects();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <>
      <main ref={containerRef} className="relative bg-[#0a0f0d] text-[#f5f3f0] selection:bg-[#6b8e6f]/30">
      {/* Hero Section */}
      <section ref={heroRef} className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {/* Background Image with Parallax */}
        <motion.div 
          style={{ y, opacity }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute inset-0">
            <Image
              src="/entreprise.png"
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>

          <motion.div
            style={{
              opacity: blurOverlayOpacity,
              filter: blurOverlayFilter,
              maskImage: "linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.25) 30%, black 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.25) 30%, black 100%)",
            }}
            className="absolute inset-0"
          >
            <Image
              src="/entreprise.png"
              alt=""
              fill
              priority
              sizes="100vw"
              className="scale-105 object-cover"
            />
          </motion.div>
          
          {/* Vignette overlay - Enhanced for better text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f0d]/95 via-[#0a0f0d]/30 to-[#0a0f0d]/60" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f0d]/70 via-transparent to-[#0a0f0d]/70" />
          <div className="absolute inset-0 bg-black/30" />
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center sm:px-8">
          
          {/* Text Content with enhanced readability */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="relative"
          >
            <motion.p variants={fadeInUp} className="relative mb-6 font-display text-sm tracking-[0.3em] text-[#6b8e6f] sm:text-base drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              EXEMPLE BTP
            </motion.p>
            
              <motion.h2 variants={fadeInUp} className="relative mb-8 font-display text-5xl leading-[1.1] tracking-tight text-[#f5f3f0] sm:text-6xl md:text-7xl lg:text-8xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
              Le bâtiment 
              <br />
              <div className="relative inline-flex items-center gap-2">
                <div className=" flex flex-col justify-center">
                  <span className="block leading-none text-3xl sm:text-5xl">par des</span>
                  <span className="block leading-none text-3xl sm:text-5xl">pour des</span>
                </div>
                <span className="italic text-[#6b8e6f]">Pro</span>
              </div>
              </motion.h2>
            
            <motion.p variants={fadeInUp} className="relative mx-auto mb-12 max-w-2xl text-base leading-relaxed text-[#f5f3f0]/90 sm:text-lg drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                experts du BTP à votre service pour tous vos projets de construction, rénovation et aménagement. Avec plus de 20 ans d'expérience, nous sommes votre partenaire de confiance pour concrétiser vos idées en réalité.
            </motion.p>

            <motion.div variants={fadeInUp} className="relative flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="#portfolio"
                className="group relative overflow-hidden rounded-full bg-[#6b8e6f] px-8 py-4 text-sm font-medium text-[#0a0f0d] transition-all hover:bg-[#7a9d7e] hover:shadow-[0_0_40px_-10px_rgba(107,142,111,0.6)]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  Voir nos projets
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              </a>
              <a
                href="#contact"
                className="rounded-full border border-[#3d4d43] bg-[#0a0f0d]/80 px-8 py-4 text-sm font-medium text-[#f5f3f0] backdrop-blur-sm transition-all hover:border-[#6b8e6f]/50 hover:bg-[#2d3c33]/80 shadow-[0_2px_8px_rgba(0,0,0,0.5)]"
              >
                Nous contacter
              </a>
            </motion.div>
          </motion.div>
        </div>
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
                <Image
                  src="/artisan.png"
                  alt="Portrait artisan"
                  width={900}
                  height={1200}
                  className="h-full w-full object-cover"
                  priority={false}
                />
              </div>
              <div className="absolute -bottom-6 -right-6 -z-10 h-full w-full rounded-3xl bg-[#6b8e6f]/10 blur-3xl" />
            </motion.div>

            {/* Bio */}
            <motion.div variants={fadeInUp} className="flex flex-col justify-center">
              <motion.p variants={fadeInUp} className="mb-4 font-display text-sm tracking-[0.3em] text-[#6b8e6f]">À propos de l'entreprise</motion.p>
              <h2 className="mb-6 font-display text-4xl tracking-tight text-[#f5f3f0] sm:text-5xl lg:text-6xl">
                Une passion pour la construction durable et l'innovation
              </h2>
              <div className="space-y-6 text-base leading-relaxed text-[#f5f3f0]/70 sm:text-lg">
                <p>
                  Depuis plus de 20 ans, notre enterprise réalise des chantiers de travaux publics et privés, en mettant l'accent sur la qualité, la durabilité et la satisfaction client. Nous croyons que chaque projet est une opportunité de créer quelque chose de durable et d'impactant pour les générations à venir.
                </p>
                <p>
                  La qualité de notre travail repose sur une équipe d'experts passionnés, des méthodes de construction innovantes et un engagement envers les pratiques durables. Nous sommes fiers de notre héritage et de notre contribution à la transformation du paysage urbain et rural.
                </p>
                <p>
                  Tout nos chantiers sont réalisés en Bretagne, avec des artisans Bretons, et avec des matériaux locaux. Nous sommes profondément enracinés dans notre communauté et nous nous engageons à soutenir l'économie locale tout en créant des espaces qui inspirent et améliorent la vie de nos clients.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-6 border-t border-[#3d4d43]/30 pt-8">
                <div>
                  <p className="text-2xl font-medium text-[#6b8e6f]">Plus de 150 </p>
                  <p className="text-sm text-[#f5f3f0]/50">Chantiers en cours en Bretagne</p>
                </div>
                <div>
                  <p className="text-2xl font-medium text-[#6b8e6f]">Plus de 20</p>
                  <p className="text-sm text-[#f5f3f0]/50">Années d'expérience</p>
                </div>
                <div>
                  <p className="text-2xl font-medium text-[#6b8e6f]">Plus de 500</p>
                  <p className="text-sm text-[#f5f3f0]/50">Chantiers terminés en Bretagne</p>
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
              Jetez un coup d'oeil à nos projets récents
            </motion.p>
            <motion.h2 variants={fadeInUp} className="font-display text-4xl tracking-tight text-[#f5f3f0] sm:text-5xl lg:text-6xl">
              Nos projets
            </motion.h2>
          </motion.div>

          {/* Masonry Grid */}
          {projects.length === 0 ? (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              className="col-span-full text-center py-20"
            >
              <div className="mx-auto max-w-md">
                <svg
                  className="mx-auto h-24 w-24 text-[#6b8e6f]/30 mb-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <h3 className="font-display text-2xl text-[#f5f3f0] mb-3">Pas de projets disponibles</h3>
                <p className="text-[#f5f3f0]/60">
                  Nous travaillons dur pour ajouter de nouveaux projets à notre portfolio. Restez à l'écoute pour découvrir nos dernières réalisations en matière de construction et de rénovation.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {projects.map((project, i) => {
                const imageUrl = getProjectImageUrl(project);

                return (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    imageUrl={imageUrl}
                    index={i}
                    onClick={() => {
                      setSelectedProject(project);
                      setIsModalOpen(true);
                    }}
                  />
                );
              })}
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-16 text-center"
          >
            <Link

              href="/portfolio"
              className="inline-flex items-center gap-2 rounded-full border border-[#6b8e6f]/30 bg-[#6b8e6f]/10 px-6 py-3 text-sm font-medium text-[#6b8e6f] transition-all hover:border-[#6b8e6f]/50 hover:bg-[#6b8e6f]/20"
            >
              Voir la galerie entière
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
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
              CE QUE NOUS OFFRONS
            </motion.p>
            <motion.h2 variants={fadeInUp} className="font-display text-4xl tracking-tight text-[#f5f3f0] sm:text-5xl lg:text-6xl">
              Nos services
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
                title: "Construction Neuve",
                desc: "Realisation de maisons individuelles, locaux professionnels et extensions avec pilotage complet du chantier, des fondations aux finitions.",
                icon: "M3 10.5L12 3l9 7.5M5.25 9.75V20.25h13.5V9.75M9 20.25v-6h6v6"
              },
              {
                title: "Renovation Interieure",
                desc: "Reconfiguration des espaces, isolation, cloisons, sols, plafonds et remise a neuf pour moderniser durablement votre habitat ou vos bureaux.",
                icon: "M4.5 21V7.5A1.5 1.5 0 016 6h12a1.5 1.5 0 011.5 1.5V21M9 21v-6.75A2.25 2.25 0 0111.25 12h1.5A2.25 2.25 0 0115 14.25V21M8.25 9.75h7.5"
              },
              {
                title: "Terrassement et VRD",
                desc: "Preparation des terrains, reseaux, evacuations et raccordements pour garantir des bases solides et conformes avant construction.",
                icon: "M2.25 16.5h19.5M3.75 16.5l2.25-6h12l2.25 6M8.25 10.5V7.875A1.875 1.875 0 0110.125 6h3.75A1.875 1.875 0 0115.75 7.875V10.5"
              },
              {
                title: "Maçonnerie Generale",
                desc: "Murs porteurs, dalles, ouvertures, reprises structurelles et ouvrages en beton pour les projets neufs ou en rehabilitation.",
                icon: "M3 7.5h18M3 12h18M3 16.5h18M6.75 7.5v9M12 7.5v9M17.25 7.5v9"
              },
              {
                title: "Amelioration Energetique",
                desc: "Isolation thermique, remplacement de menuiseries, et optimisation des performances pour reduire durablement vos consommations.",
                icon: "M12 3v3m0 12v3m9-9h-3M6 12H3m15.364 6.364l-2.121-2.121M8.757 8.757L6.636 6.636m11.728 0l-2.121 2.121M8.757 15.243l-2.121 2.121M12 16.5A4.5 4.5 0 1012 7.5a4.5 4.5 0 000 9z"
              },
              {
                title: "Maintenance et SAV",
                desc: "Interventions rapides, contrats d'entretien et suivi apres chantier pour maintenir vos installations en parfait etat dans la duree.",
                icon: "M10.5 6h3m-6.75 3h10.5m-9 3h7.5m-8.25 9h8.25A2.25 2.25 0 0018 18.75V5.25A2.25 2.25 0 0015.75 3H8.25A2.25 2.25 0 006 5.25v13.5A2.25 2.25 0 008.25 21z"
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
              NOTRE APPROCHE
            </motion.p>
            <motion.h2 variants={fadeInUp} className="font-display text-4xl tracking-tight text-[#f5f3f0] sm:text-5xl lg:text-6xl">
              Une approche créative
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
              { num: "01", title: "Inspection & Planification", desc: "Nous étudions les lieux, analysons les conditions météorologiques et planifions le moment idéal pour obtenir la meilleure lumière." },
              { num: "02", title: "Construction", desc: "Nous construisons le bâtiment comme convenu avec soin et précision. " },
              { num: "03", title: "Finition", desc: "Nous ajoutons toutes les finitions nécessaires pour assurer la qualité et la durabilité du projet." },
              { num: "04", title: "Livraison", desc: "Le bâtiment est livré et prêt à être utilisé." },
            ].map((step, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="relative"
              >
                <div className="mb-6 font-display text-5xl text-[#6b8e6f]/20">{step.num}</div>
                <h3 className="mb-4 font-display text-2xl text-[#f5f3f0]">{step.title}</h3>
                <p className="leading-relaxed text-[#f5f3f0]/60">{step.desc}</p>
                
                {i < 4 && (
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
              DES CLIENTS SATISFAITS
            </motion.p>
            <motion.h2 variants={fadeInUp} className="font-display text-4xl tracking-tight text-[#f5f3f0] sm:text-5xl lg:text-6xl">
              Ce que les clients disent de nous
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
                quote: "L'attention au détail et le professionnalisme de l'équipe ont été exceptionnels. Notre projet a été réalisé dans les délais et a dépassé nos attentes en termes de qualité.",
                author: "Exemple hôtelier",
                role: "Hôtelier Breton"
              },
              { 
                quote: "Cette enterprise a vraiment fourni un travail de qualité supérieure. Leur expertise en matière de construction durable et leur engagement envers la satisfaction du client sont évidents dans chaque aspect du projet.",
                author: "Exemple cinéma",
                role: "Cinéaste Breton"
              },
              { 
                quote: "Nos nouveaux locaux sont magnifiques et fonctionnels, grâce à l'expertise de cette entreprise. Leur équipe a été un plaisir de travailler avec, et nous sommes ravis du résultat final.",
                author: "Exemple Menuiserie",
                role: "Menuiserie Bretonne"
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
              CONTACTEZ NOUS
            </motion.p>
            <motion.h2 variants={fadeInUp} className="mb-8 font-display text-4xl tracking-tight text-[#f5f3f0] sm:text-5xl lg:text-6xl">
              Prêt à discuter de votre projet ?
            </motion.h2>
            <motion.p variants={fadeInUp} className="mx-auto mb-12 max-w-2xl text-lg leading-relaxed text-[#f5f3f0]/70">
              Nous sommes impatients de collaborer avec vous pour concrétiser votre vision. Que vous ayez une idée précise ou que vous souhaitiez simplement en savoir plus sur nos services, n'hésitez pas à nous contacter. Notre équipe d'experts est là pour répondre à toutes vos questions et vous guider à chaque étape du processus.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col items-center justify-center gap-6 sm:flex-row">
              <a
                href="mailto:contact@exemple.btp"
                className="group flex items-center gap-3 rounded-full bg-[#6b8e6f] px-8 py-4 font-medium text-[#0a0f0d] transition-all hover:bg-[#7a9d7e] hover:shadow-[0_0_40px_-10px_rgba(107,142,111,0.6)]"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Envoyez un email
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

      </main>

      <ProjectDetailModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProject(null);
        }}
      />
    </>
  );
}
