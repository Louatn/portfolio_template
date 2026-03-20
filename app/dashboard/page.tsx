"use client";

import React, { useState } from "react";
import { NewProjectModal } from "@/components/NewProjectModal";

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // La liste des projets est vide par defaut
  const projects: any[] = [];

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <header className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Liste des Projets</h1>
          <p className="mt-2 text-sm text-(--site-mist)">Retrouvez l'ensemble des realisations affichees sur le site.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="rounded-full bg-(--site-gold) px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-(--site-gold)/20"
        >
          Ajouter un projet
        </button>
      </header>

      <section className="space-y-6">
        {projects.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-sm">
            <svg className="mb-4 h-12 w-12 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h2 className="text-xl font-medium text-white">Aucun projet pour le moment</h2>
            <p className="mt-2 text-sm text-(--site-mist)">
              Vous n'avez pas encore de realisation affichee dans votre portfolio.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
             {/* L'affichage des cartes projets viendra ici */}
          </div>
        )}
      </section>

      <NewProjectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
