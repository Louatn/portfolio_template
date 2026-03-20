"use server";

import { prisma } from "@/lib/prisma";

export type ProjectWithImages = {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  category: string | null;
  coverImage: string | null;
  isFeatured: boolean;
  position: number;
  createdAt: Date;
  images: {
    id: string;
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
      isPublished: true,
    },
    orderBy: {
      position: 'asc',
    },
    take: limit,
    include: {
      images: {
        select: {
          id: true,
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
      isPublished: true,
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
      isPublished: true,
    },
    orderBy: {
      position: 'asc',
    },
    include: {
      images: {
        select: {
          id: true,
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
      isPublished: true,
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
