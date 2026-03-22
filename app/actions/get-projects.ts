"use server";

import { prisma } from "@/lib/prisma";
import { ProjectStatus } from "@prisma/client";

export type ProjectWithImages = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  category: string | null;
  coverImage: string | null;
  status: ProjectStatus;
  isFeatured: boolean;
  position: number;
  createdAt: Date;
  updatedAt: Date;
  images: {
    id: string;
    url: string | null;
    title: string | null;
    description: string | null;
    position: number;
  }[];
};

/**
 * Get featured projects for homepage
 * Returns featured projects first, then fills with published projects by creation date if needed
 */
export async function getFeaturedProjects(limit: number = 6): Promise<ProjectWithImages[]> {
  // First, get featured projects
  const featuredProjects = await prisma.project.findMany({
    where: {
      isFeatured: true,
      status: ProjectStatus.PUBLISHED,
    },
    orderBy: {
      position: 'asc',
    },
    take: limit,
    include: {
      images: {
        select: {
          id: true,
          url: true,
          title: true,
          description: true,
          position: true,
        },
        orderBy: {
          position: 'asc',
        },
        take: 1, // Only need first image as fallback
      },
    },
  });

  // If we have enough featured projects, return them
  if (featuredProjects.length >= limit) {
    return featuredProjects;
  }

  // Otherwise, fill the remaining slots with published (non-featured) projects
  const remaining = limit - featuredProjects.length;
  const featuredIds = featuredProjects.map(p => p.id);

  const additionalProjects = await prisma.project.findMany({
    where: {
      status: ProjectStatus.PUBLISHED,
      isFeatured: false,
      id: {
        notIn: featuredIds,
      },
    },
    orderBy: {
      createdAt: 'asc', // Oldest first
    },
    take: remaining,
    include: {
      images: {
        select: {
          id: true,
          url: true,
          title: true,
          description: true,
          position: true,
        },
        orderBy: {
          position: 'asc',
        },
        take: 1,
      },
    },
  });

  return [...featuredProjects, ...additionalProjects];
}

/**
 * Get all published projects for portfolio page
 */
export async function getAllPublishedProjects(): Promise<ProjectWithImages[]> {
  const projects = await prisma.project.findMany({
    where: {
      status: ProjectStatus.PUBLISHED,
    },
    orderBy: {
      position: 'asc',
    },
    include: {
      images: {
        select: {
          id: true,
          url: true,
          title: true,
          description: true,
          position: true,
        },
        orderBy: {
          position: 'asc',
        },
        take: 1,
      },
    },
  });

  return projects;
}

/**
 * Get all unique categories from published projects
 */
export async function getCategories(): Promise<string[]> {
  const projects = await prisma.project.findMany({
    where: {
      status: ProjectStatus.PUBLISHED,
      category: {
        not: null,
      },
    },
    select: {
      category: true,
    },
    distinct: ['category'],
  });

  return projects
    .map(p => p.category)
    .filter((cat): cat is string => cat !== null)
    .sort();
}

/**
 * Get all projects (admin only)
 */
export async function getAllProjects(): Promise<ProjectWithImages[]> {
  const projects = await prisma.project.findMany({
    include: {
      images: {
        select: {
          id: true,
          url: true,
          title: true,
          description: true,
          position: true,
        },
        orderBy: {
          position: 'asc',
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return projects;
}

/**
 * Get projects by status
 */
export async function getProjectsByStatus(status: ProjectStatus): Promise<ProjectWithImages[]> {
  const projects = await prisma.project.findMany({
    where: {
      status,
    },
    include: {
      images: {
        select: {
          id: true,
          url: true,
          title: true,
          description: true,
          position: true,
        },
        orderBy: {
          position: 'asc',
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return projects;
}

/**
 * Get a single project by ID
 */
export async function getProjectById(id: string): Promise<ProjectWithImages | null> {
  const project = await prisma.project.findUnique({
    where: {
      id,
    },
    include: {
      images: {
        select: {
          id: true,
          url: true,
          title: true,
          description: true,
          position: true,
        },
        orderBy: {
          position: 'asc',
        },
      },
    },
  });

  return project;
}
