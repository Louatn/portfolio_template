import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/prisma';
import { ProjectStatus } from '@prisma/client';

// Validation schema for updating a project
const updateProjectSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long').optional(),
  description: z.string().optional().nullable(),
  location: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  capturedAt: z.string().datetime().optional().nullable(),
  coverImage: z.string().url().optional().nullable(),
  status: z.nativeEnum(ProjectStatus).optional(),
  isFeatured: z.boolean().optional(),
  position: z.number().optional(),
  images: z.array(z.object({
    id: z.string().optional(), // If provided, update existing image
    url: z.string().url(),
    title: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    width: z.number().optional().nullable(),
    height: z.number().optional().nullable(),
    size: z.number().optional().nullable(),
    position: z.number().default(0),
  })).optional(),
});

/**
 * PUT /api/projects/[id]
 * Update an existing project
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id },
      include: { images: true },
    });

    if (!existingProject) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = updateProjectSchema.parse(body);

    // Update project
    const updateData: any = {};
    
    if (validatedData.title !== undefined) updateData.title = validatedData.title;
    if (validatedData.description !== undefined) updateData.description = validatedData.description;
    if (validatedData.location !== undefined) updateData.location = validatedData.location;
    if (validatedData.category !== undefined) updateData.category = validatedData.category;
    if (validatedData.capturedAt !== undefined) {
      updateData.capturedAt = validatedData.capturedAt ? new Date(validatedData.capturedAt) : null;
    }
    if (validatedData.coverImage !== undefined) updateData.coverImage = validatedData.coverImage;
    if (validatedData.status !== undefined) updateData.status = validatedData.status;
    if (validatedData.isFeatured !== undefined) updateData.isFeatured = validatedData.isFeatured;
    if (validatedData.position !== undefined) updateData.position = validatedData.position;

    // Handle images if provided
    if (validatedData.images !== undefined) {
      // Delete all existing images and create new ones
      // (Simpler than trying to diff and update)
      await prisma.projectImage.deleteMany({
        where: { projectId: id },
      });

      updateData.images = {
        create: validatedData.images.map((img, index) => ({
          url: img.url,
          title: img.title || null,
          description: img.description || null,
          width: img.width || null,
          height: img.height || null,
          size: img.size || null,
          position: img.position ?? index,
        })),
      };
    }

    const project = await prisma.project.update({
      where: { id },
      data: updateData,
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
      { status: 200 }
    );

  } catch (error) {
    console.error('Error updating project:', error);

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
 * DELETE /api/projects/[id]
 * Delete a project
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Check if project exists
    const existingProject = await prisma.project.findUnique({
      where: { id },
    });

    if (!existingProject) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      );
    }

    // Delete project (cascade will delete images)
    await prisma.project.delete({
      where: { id },
    });

    return NextResponse.json(
      { success: true, data: null },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
