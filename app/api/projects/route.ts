import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';
import { ProjectStatus } from '@prisma/client';

// Validation schema for creating a project
const createProjectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().optional(),
  location: z.string().optional(),
  category: z.string().optional(),
  capturedAt: z.string().optional().nullable(),
  coverImage: z.string().url().optional().nullable(),
  status: z.nativeEnum(ProjectStatus).default(ProjectStatus.DRAFT),
  isFeatured: z.boolean().optional().default(false),
  images: z.array(z.object({
    url: z.string().url(),
    title: z.string().optional(),
    description: z.string().optional(),
    width: z.number().optional(),
    height: z.number().optional(),
    size: z.number().optional(),
    position: z.number().default(0),
  })).optional().default([]),
});

/**
 * POST /api/projects
 * Create a new project
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = createProjectSchema.parse(body);

    // Create project with images
    const project = await prisma.project.create({
      data: {
        title: validatedData.title,
        description: validatedData.description || null,
        location: validatedData.location || null,
        category: validatedData.category || null,
        capturedAt: validatedData.capturedAt ? new Date(validatedData.capturedAt) : null,
        coverImage: validatedData.coverImage || null,
        status: validatedData.status,
        isFeatured: validatedData.isFeatured,
        images: {
          create: validatedData.images.map((img, index) => ({
            url: img.url,
            title: img.title || null,
            description: img.description || null,
            width: img.width || null,
            height: img.height || null,
            size: img.size || null,
            position: img.position ?? index,
          })),
        },
      },
      include: {
        images: {
          orderBy: {
            position: 'asc',
          },
        },
      },
    });

    return NextResponse.json(
      { success: true, data: project },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error creating project:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/projects
 * Get all projects (admin only)
 */
export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const projects = await prisma.project.findMany({
      include: {
        images: {
          select: {
            id: true,
            url: true,
            title: true,
            description: true,
            width: true,
            height: true,
            size: true,
            position: true,
            createdAt: true,
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

    return NextResponse.json(
      { success: true, data: projects },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
