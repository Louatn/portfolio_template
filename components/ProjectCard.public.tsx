"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import type { PublicProject } from "@/lib/public-project-session";

interface ProjectCardProps {
  project: PublicProject;
  imageUrl: string | null;
  index: number;
  onClick: () => void;
}

export function ProjectCard({ project, imageUrl, index, onClick }: ProjectCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Vary aspect ratios for visual interest
  const aspects = ["aspect-[4/5]", "aspect-[4/3]", "aspect-square", "aspect-[3/4]"];
  const aspect = aspects[index % aspects.length];

  return (
    <motion.article
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
      onClick={onClick}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-[#d1cdc7] bg-white shadow-md transition-all hover:border-[#d4a574] hover:shadow-2xl hover:shadow-[#d4a574]/20"
    >
      {/* Image Container with Fixed Aspect Ratio */}
      <div className={`${aspect} relative w-full overflow-hidden bg-gradient-to-br from-[#e8e4de] to-[#faf8f5]`}>
        {/* Skeleton Loader */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-[#e8e4de] via-[#d1cdc7] to-[#e8e4de] bg-[length:200%_100%]" 
               style={{ animation: 'shimmer 1.5s infinite' }} 
          />
        )}

        {/* Image */}
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={project.title}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              setImageLoaded(true);
            }}
            className={`h-full w-full object-cover transition-all duration-700 group-hover:scale-110 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-[#d1cdc7] mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-xs text-[#6b8a99]">Pas d'image</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Overlay Gradient */}
      <div className="image-overlay absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      
      {/* Info Panel */}
      <div className="absolute bottom-0 left-0 right-0 translate-y-4 p-6 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <h3 className="mb-1 font-display text-xl font-semibold text-white drop-shadow-lg">
          {project.title}
        </h3>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          {project.location && (
            <p className="flex items-center gap-1.5 text-[#d4a574] drop-shadow">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {project.location}
            </p>
          )}
          {project.category && (
            <p className="text-white/90 drop-shadow">
              {project.category}
            </p>
          )}
        </div>
      </div>

      {/* Featured Badge */}
      {project.isFeatured && (
        <div className="absolute top-3 right-3 z-10">
          <span className="inline-flex items-center rounded-full border border-[#d4a574]/50 bg-[#d4a574]/90 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-white shadow-lg">
            ⭐ En vedette
          </span>
        </div>
      )}
    </motion.article>
  );
}

// Add shimmer animation to globals.css or use inline style
