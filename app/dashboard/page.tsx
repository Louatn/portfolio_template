"use client";

import React, { useState, useEffect } from "react";
import { ProjectStatus } from "@prisma/client";
import { NewProjectModal } from "@/components/NewProjectModal";
import { ProjectCard } from "@/components/ProjectCard";
import { 
  getCachedProjects, 
  cacheProjects, 
  isCacheFresh,
  removeCachedProject,
  type CachedProject 
} from "@/lib/project-storage";

type FilterType = ProjectStatus | 'ALL';

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState<CachedProject[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<CachedProject[]>([]);
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load projects on mount
  useEffect(() => {
    loadProjects();
  }, []);

  // Apply filter when projects or filter changes
  useEffect(() => {
    if (filter === 'ALL') {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(p => p.status === filter));
    }
  }, [projects, filter]);

  const loadProjects = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Check cache first
      const cached = getCachedProjects();
      if (cached && isCacheFresh()) {
        setProjects(cached);
        setIsLoading(false);
        return;
      }

      // Fetch from server
      const response = await fetch('/api/projects');
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to load projects');
      }

      const projectsData: CachedProject[] = result.data.map((p: any) => ({
        ...p,
        createdAt: p.createdAt.toString(),
        updatedAt: p.updatedAt.toString(),
        capturedAt: p.capturedAt?.toString() || null,
      }));

      setProjects(projectsData);
      cacheProjects(projectsData);
    } catch (err) {
      console.error('Error loading projects:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      
      // Try to use stale cache as fallback
      const cached = getCachedProjects();
      if (cached) {
        setProjects(cached);
        setError('Affichage depuis le cache (données possiblement obsolètes)');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleArchive = async (id: string) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: ProjectStatus.ARCHIVED }),
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error);
      }

      // Update local state
      setProjects(prev => prev.map(p => 
        p.id === id ? { ...p, status: ProjectStatus.ARCHIVED } : p
      ));
    } catch (err) {
      alert('Erreur lors de l\'archivage du projet');
      console.error(err);
    }
  };

  const handleUnarchive = async (id: string) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: ProjectStatus.DRAFT }),
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error);
      }

      // Update local state
      setProjects(prev => prev.map(p => 
        p.id === id ? { ...p, status: ProjectStatus.DRAFT } : p
      ));
    } catch (err) {
      alert('Erreur lors de la désarchivage du projet');
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error);
      }

      // Remove from local state and cache
      setProjects(prev => prev.filter(p => p.id !== id));
      removeCachedProject(id);
    } catch (err) {
      alert('Erreur lors de la suppression du projet');
      console.error(err);
    }
  };

  const filterCounts = {
    ALL: projects.length,
    DRAFT: projects.filter(p => p.status === ProjectStatus.DRAFT).length,
    PUBLISHED: projects.filter(p => p.status === ProjectStatus.PUBLISHED).length,
    ARCHIVED: projects.filter(p => p.status === ProjectStatus.ARCHIVED).length,
  };

  return (
    <div className="mx-auto max-w-7xl px-6 py-12">
      <header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Gestion des Projets</h1>
          <p className="mt-2 text-sm text-(--site-mist)">
            Gérez vos projets, brouillons et publications
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => loadProjects()}
            className="rounded-full bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
            disabled={isLoading}
          >
            {isLoading ? 'Chargement...' : '🔄 Actualiser'}
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="rounded-full bg-(--site-gold) px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-(--site-gold)/20"
          >
            + Nouveau projet
          </button>
        </div>
      </header>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-3">
        <button
          onClick={() => setFilter('ALL')}
          className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
            filter === 'ALL'
              ? 'bg-(--site-gold) text-white'
              : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
          }`}
        >
          Tous ({filterCounts.ALL})
        </button>
        <button
          onClick={() => setFilter(ProjectStatus.DRAFT)}
          className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
            filter === ProjectStatus.DRAFT
              ? 'bg-yellow-500 text-white'
              : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
          }`}
        >
          Brouillons ({filterCounts.DRAFT})
        </button>
        <button
          onClick={() => setFilter(ProjectStatus.PUBLISHED)}
          className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
            filter === ProjectStatus.PUBLISHED
              ? 'bg-green-500 text-white'
              : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
          }`}
        >
          Publiés ({filterCounts.PUBLISHED})
        </button>
        <button
          onClick={() => setFilter(ProjectStatus.ARCHIVED)}
          className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
            filter === ProjectStatus.ARCHIVED
              ? 'bg-gray-500 text-white'
              : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
          }`}
        >
          Archivés ({filterCounts.ARCHIVED})
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Projects Grid */}
      <section>
        {isLoading ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-(--site-gold) mx-auto"></div>
              <p className="text-sm text-white/50">Chargement des projets...</p>
            </div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm">
            <svg className="mb-4 h-16 w-16 text-white/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h2 className="text-xl font-medium text-white">
              {filter === 'ALL' ? 'Aucun projet' : `Aucun projet ${
                filter === ProjectStatus.DRAFT ? 'brouillon' :
                filter === ProjectStatus.PUBLISHED ? 'publié' :
                'archivé'
              }`}
            </h2>
            <p className="mt-2 text-sm text-(--site-mist)">
              {filter === 'ALL' 
                ? "Commencez par créer votre premier projet"
                : "Essayez un autre filtre ou créez un nouveau projet"
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={(id) => {
                  // TODO: Implement edit functionality
                  console.log('Edit project', id);
                }}
                onDelete={handleDelete}
                onArchive={handleArchive}
                onUnarchive={handleUnarchive}
              />
            ))}
          </div>
        )}
      </section>

      <NewProjectModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          // Refresh projects after closing modal
          loadProjects();
        }} 
      />
    </div>
  );
}
