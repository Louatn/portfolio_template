"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { loadPublicProjectsData, type PublicProject } from "@/lib/public-project-session";
import { getProjectImageUrl } from "@/lib/utils/image-helpers";
import { ProjectDetailModal } from "@/components/ProjectDetailModal";

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
              COMPLETE COLLECTION
            </motion.p>
            <motion.h1 variants={fadeInUp} className="font-display text-5xl tracking-tight text-[#f5f3f0] sm:text-6xl lg:text-7xl mb-6">
              Portfolio
            </motion.h1>
            <motion.p variants={fadeInUp} className="mx-auto max-w-2xl text-lg text-[#f5f3f0]/70">
              Explore the full collection of landscape photography, capturing the raw beauty of nature across diverse locations.
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
                All
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
                // Vary aspect ratios for masonry effect
                const aspects = ["aspect-[4/5]", "aspect-[4/3]", "aspect-square", "aspect-[3/4]"];
                const aspect = aspects[i % aspects.length];

                return (
                  <motion.article
                    key={project.id}
                    variants={scaleIn}
                    whileHover={{ y: -8 }}
                    onClick={() => {
                      setSelectedProject(project);
                      setIsModalOpen(true);
                    }}
                    className="group relative cursor-pointer overflow-hidden rounded-2xl border border-[#3d4d43]/20 bg-[#1a2520] transition-all hover:border-[#6b8e6f]/30 hover:shadow-2xl hover:shadow-[#6b8e6f]/10"
                  >
                    <div className={`${aspect} w-full overflow-hidden bg-gradient-to-br from-[#2d3c33] to-[#1a2520]`}>
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={project.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <p className="text-[#f5f3f0]/20">No Image</p>
                        </div>
                      )}
                    </div>
                    
                    {/* Overlay */}
                    <div className="image-overlay absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    
                    {/* Info */}
                    <div className="absolute bottom-0 left-0 right-0 translate-y-4 p-6 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <h3 className="mb-1 font-display text-xl text-[#f5f3f0]">{project.title}</h3>
                      <div className="flex items-center gap-3 text-sm">
                        {project.location && (
                          <p className="flex items-center gap-1.5 text-[#6b8e6f]">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {project.location}
                          </p>
                        )}
                        {project.category && (
                          <p className="text-[#f5f3f0]/60">
                            {project.category}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.article>
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
              Interested in a print?
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-[#f5f3f0]/70 mb-8">
              All photographs are available as museum-quality fine art prints. Get in touch to discuss sizes, framing options, and availability.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 rounded-full border border-[#6b8e6f]/30 bg-[#6b8e6f]/10 px-8 py-4 text-sm font-medium text-[#6b8e6f] transition-all hover:border-[#6b8e6f]/50 hover:bg-[#6b8e6f]/20"
            >
              Get in Touch
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
