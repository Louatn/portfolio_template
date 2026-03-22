"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
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
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

export default function PortfolioClient() {
  const [projects, setProjects] = useState<PublicProject[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<PublicProject | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let isActive = true;

    const loadProjects = async () => {
      try {
        const data = await loadPublicProjectsData();
        if (!isActive) {
          return;
        }

        setProjects(data.publishedProjects);
        setCategories(data.categories);
      } catch (error) {
        console.error("Error loading portfolio projects:", error);
      }
    };

    loadProjects();

    return () => {
      isActive = false;
    };
  }, []);

  const filteredProjects = selectedCategory
    ? projects.filter(p => p.category === selectedCategory)
    : projects;

  return (
    <main className="relative min-h-screen bg-[#0a0f0d] text-[#f5f3f0] selection:bg-[#6b8e6f]/30">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-6 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center mb-12"
          >
            <motion.p variants={fadeInUp} className="mb-4 font-display text-sm tracking-[0.3em] text-[#6b8e6f]">
              PORTFOLIO
            </motion.p>
            <motion.h1 variants={fadeInUp} className="font-display text-5xl tracking-tight text-[#f5f3f0] sm:text-6xl lg:text-7xl mb-6">
              Nos projets
            </motion.h1>
            <motion.p variants={fadeInUp} className="mx-auto max-w-2xl text-lg text-[#f5f3f0]/70">
              Découvrez une sélection de nos réalisations récentes, mettant en avant notre savoir-faire et notre engagement envers l'excellence dans le secteur du BTP.
            </motion.p>
          </motion.div>

          {/* Category Filters */}
          {categories.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center gap-3 mb-16"
            >
              <button
                onClick={() => setSelectedCategory(null)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                  selectedCategory === null
                    ? "bg-[#6b8e6f] text-[#0a0f0d] shadow-lg shadow-[#6b8e6f]/20"
                    : "border border-[#3d4d43]/30 bg-[#1a2520]/50 text-[#f5f3f0]/70 hover:border-[#6b8e6f]/30 hover:text-[#f5f3f0]"
                }`}
              >
                Tout
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? "bg-[#6b8e6f] text-[#0a0f0d] shadow-lg shadow-[#6b8e6f]/20"
                      : "border border-[#3d4d43]/30 bg-[#1a2520]/50 text-[#f5f3f0]/70 hover:border-[#6b8e6f]/30 hover:text-[#f5f3f0]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="relative pb-32 px-6 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          {filteredProjects.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
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
                <h3 className="font-display text-2xl text-[#f5f3f0] mb-3">
                  {selectedCategory ? `No projects in ${selectedCategory}` : "No projects yet"}
                </h3>
                <p className="text-[#f5f3f0]/60">
                  {selectedCategory ? "Try selecting a different category." : "Check back soon for new work."}
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={selectedCategory || "all"}
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {filteredProjects.map((project, i) => {
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
        </div>
      </section>

      {/* Footer CTA */}
      <section className="relative border-t border-[#3d4d43]/30 bg-[#0f1512] py-20 px-6 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-display text-3xl tracking-tight text-[#f5f3f0] sm:text-4xl mb-6">
              Intéréssé par nos services ? 
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-[#f5f3f0]/70 mb-8">
              Découvrez une sélection de nos réalisations récentes, mettant en avant notre savoir-faire et notre engagement envers l'excellence dans le secteur du BTP.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 rounded-full border border-[#6b8e6f]/30 bg-[#6b8e6f]/10 px-8 py-4 text-sm font-medium text-[#6b8e6f] transition-all hover:border-[#6b8e6f]/50 hover:bg-[#6b8e6f]/20"
            >
              Contactez nous
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </div>
      </section>

      <ProjectDetailModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedProject(null);
        }}
      />
    </main>
  );
}
