import { NextResponse } from 'next/server';
import { ProjectStatus } from '@prisma/client';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const [featuredProjects, additionalProjects, publishedProjects, categories] = await Promise.all([
      prisma.project.findMany({
        where: {
          isFeatured: true,
          status: ProjectStatus.PUBLISHED,
        },
        orderBy: {
          position: 'asc',
        },
        take: 6,
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
      }),
      prisma.project.findMany({
        where: {
          status: ProjectStatus.PUBLISHED,
          isFeatured: false,
        },
        orderBy: {
          createdAt: 'asc',
        },
        take: 6,
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
      }),
      prisma.project.findMany({
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
          },
        },
      }),
      prisma.project.findMany({
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
      }),
    ]);

    const featuredIds = featuredProjects.map((project) => project.id);
    const remainingSlots = Math.max(0, 6 - featuredProjects.length);
    const fallbackProjects = additionalProjects
      .filter((project) => !featuredIds.includes(project.id))
      .slice(0, remainingSlots);

    const normalizedCategories = categories
      .map((project) => project.category)
      .filter((category): category is string => category !== null)
      .sort();

    return NextResponse.json(
      {
        success: true,
        data: {
          featuredProjects: [...featuredProjects, ...fallbackProjects],
          publishedProjects,
          categories: normalizedCategories,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching public projects:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}