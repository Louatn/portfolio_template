"use client";

import React, { useState } from "react";
import { ProjectStatus } from "@prisma/client";
import { CachedProject } from "@/lib/project-storage";

interface ProjectCardProps {
  project: CachedProject;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onArchive?: (id: string) => void;
  onUnarchive?: (id: string) => void;
  onPublish?: (id: string) => void;
}

export function ProjectCard({ 
  project, 
  onEdit, 
  onDelete,
  onArchive,
  onUnarchive,
  onPublish
}: ProjectCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const statusColors = {
    DRAFT: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    PUBLISHED: "bg-green-500/20 text-green-400 border-green-500/30",
    ARCHIVED: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  };

  const statusLabels = {
    DRAFT: "Brouillon",
    PUBLISHED: "Publié",
    ARCHIVED: "Archivé",
  };

  const coverImage = project.coverImage || project.images[0]?.url;
  const formattedDate = new Date(project.createdAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const handleDelete = () => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      setIsDeleting(true);
      setTimeout(() => {
        onDelete?.(project.id);
      }, 300);
    }
  };

  return (
    <div className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm transition hover:border-white/20 hover:bg-white/10 ${
      isDeleting ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
    }`}
    style={{ transition: 'opacity 300ms ease-out, transform 300ms ease-out' }}
    >
      {/* Cover Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-black/30">
        {coverImage ? (
          <img 
            src={coverImage} 
            alt={project.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <svg className="h-12 w-12 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold backdrop-blur-sm ${statusColors[project.status]}`}>
            {statusLabels[project.status]}
          </span>
        </div>

        {/* Featured Badge */}
        {project.isFeatured && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center rounded-full border border-amber-500/30 bg-amber-500/20 px-2 py-1 text-xs font-semibold text-amber-400 backdrop-blur-sm">
              ⭐ Mis en avant
            </span>
          </div>
        )}

        {/* Hover Overlay with Actions */}
        <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition group-hover:opacity-100">
          {onEdit && (
            <button
              onClick={() => onEdit(project.id)}
              className="rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition hover:bg-white/20"
              title="Modifier"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}

          {project.status === ProjectStatus.ARCHIVED && onUnarchive && (
            <button
              onClick={() => onUnarchive(project.id)}
              className="rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition hover:bg-white/20"
              title="Désarchiver"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </button>
          )}

          {project.status === ProjectStatus.ARCHIVED && onPublish && (
            <button
              onClick={() => onPublish(project.id)}
              className="rounded-full bg-green-500/20 p-2 text-white backdrop-blur-sm transition hover:bg-green-500/40"
              title="Publier"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          )}

          {project.status !== ProjectStatus.ARCHIVED && onArchive && (
            <button
              onClick={() => onArchive(project.id)}
              className="rounded-full bg-white/10 p-2 text-white backdrop-blur-sm transition hover:bg-orange-500/20"
              title="Archiver"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
            </button>
          )}

          {onDelete && (
            <button
              onClick={handleDelete}
              className="rounded-full bg-red-500/20 p-2 text-white backdrop-blur-sm transition hover:bg-red-500/40"
              title="Supprimer"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-white">
          {project.title}
        </h3>
        
        {project.description && (
          <p className="mb-3 line-clamp-2 text-sm text-(--site-mist)">
            {project.description}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-white/50">
          <div className="flex items-center gap-4">
            {project.location && (
              <div className="flex items-center gap-1">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{project.location}</span>
              </div>
            )}
            
            {project.category && (
              <div className="flex items-center gap-1">
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                <span>{project.category}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Image count */}
        {project.images.length > 0 && (
          <div className="mt-3 flex items-center gap-1 text-xs text-white/40">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{project.images.length} image{project.images.length > 1 ? 's' : ''}</span>
          </div>
        )}
      </div>
    </div>
  );
}
