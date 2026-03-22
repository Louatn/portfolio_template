"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { PublicProject } from "@/lib/public-project-session";

interface ProjectDetailModalProps {
  project: PublicProject | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectDetailModal({ project, isOpen, onClose }: ProjectDetailModalProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setImageLoaded(false);
    } else {
      document.body.style.overflow = 'unset';
      setSelectedImage(null);
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!project) return null;

  const coverImage = project.coverImage || project.images[0]?.url;
  const galleryImages = project.images.filter(img => img.url);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-[#0a0f0d]/95 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ 
              duration: 0.4, 
              ease: [0.22, 1, 0.36, 1]
            }}
            className="fixed inset-0 z-50 overflow-y-auto"
            onClick={onClose}
          >
            <div className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
              <div 
                className="mx-auto max-w-6xl"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  onClick={onClose}
                  className="fixed right-4 top-4 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-[#3d4d43]/30 bg-[#1a2520]/90 text-[#f5f3f0] backdrop-blur-sm transition-all hover:scale-110 hover:border-[#6b8e6f]/50 hover:bg-[#1a2520] hover:text-[#6b8e6f]"
                  aria-label="Fermer"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>

                {/* Content Container */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="rounded-3xl border border-[#3d4d43]/20 bg-[#1a2520]/80 backdrop-blur-xl shadow-2xl shadow-black/40"
                >
                  {/* Cover Image */}
                  {coverImage && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: imageLoaded ? 1 : 0 }}
                      transition={{ duration: 0.6 }}
                      className="relative aspect-[21/9] w-full overflow-hidden rounded-t-3xl bg-[#0a0f0d]"
                    >
                      <img
                        src={coverImage}
                        alt={project.title}
                        className="h-full w-full object-cover"
                        onLoad={() => setImageLoaded(true)}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1a2520] via-transparent to-transparent" />
                    </motion.div>
                  )}

                  {/* Content */}
                  <div className="p-8 sm:p-12">
                    {/* Header */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="mb-8"
                    >
                      <div className="mb-4 flex flex-wrap items-center gap-3">
                        {project.category && (
                          <span className="inline-flex items-center rounded-full border border-[#6b8e6f]/30 bg-[#6b8e6f]/10 px-4 py-1.5 text-sm font-medium text-[#6b8e6f]">
                            {project.category}
                          </span>
                        )}
                        {project.location && (
                          <span className="flex items-center gap-1.5 text-sm text-[#f5f3f0]/60">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {project.location}
                          </span>
                        )}
                      </div>

                      <h2 className="mb-4 font-display text-4xl font-semibold leading-tight text-[#f5f3f0] sm:text-5xl">
                        {project.title}
                      </h2>

                      {project.description && (
                        <p className="text-lg leading-relaxed text-[#f5f3f0]/70">
                          {project.description}
                        </p>
                      )}
                    </motion.div>

                    {/* Gallery */}
                    {galleryImages.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                      >
                        <h3 className="mb-6 font-display text-2xl font-semibold text-[#f5f3f0]">
                          Galerie
                        </h3>

                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                          {galleryImages.map((image, index) => (
                            <motion.div
                              key={image.id}
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ 
                                delay: 0.4 + index * 0.05, 
                                duration: 0.4 
                              }}
                              whileHover={{ scale: 1.03 }}
                              className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl border border-[#3d4d43]/20 bg-[#0a0f0d] transition-all hover:border-[#6b8e6f]/40 hover:shadow-xl hover:shadow-[#6b8e6f]/10"
                              onClick={() => setSelectedImage(image.url!)}
                            >
                              <img
                                src={image.url!}
                                alt={image.title || `Image ${index + 1}`}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f0d]/80 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                              
                              {image.title && (
                                <div className="absolute bottom-0 left-0 right-0 translate-y-2 p-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                                  <p className="font-medium text-[#f5f3f0]">{image.title}</p>
                                  {image.description && (
                                    <p className="mt-1 text-sm text-[#f5f3f0]/70">{image.description}</p>
                                  )}
                                </div>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Image Lightbox */}
          <AnimatePresence>
            {selectedImage && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[60] bg-[#0a0f0d]/98 backdrop-blur-lg"
                  onClick={() => setSelectedImage(null)}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="fixed inset-0 z-[60] flex items-center justify-center p-4"
                  onClick={() => setSelectedImage(null)}
                >
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    onClick={() => setSelectedImage(null)}
                    className="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-full border border-[#3d4d43]/30 bg-[#1a2520]/90 text-[#f5f3f0] backdrop-blur-sm transition-all hover:scale-110 hover:border-[#6b8e6f]/50 hover:text-[#6b8e6f]"
                    aria-label="Fermer"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                  
                  <img
                    src={selectedImage}
                    alt="Vue agrandie"
                    className="max-h-[90vh] max-w-full rounded-2xl border border-[#3d4d43]/20 object-contain shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                  />
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
