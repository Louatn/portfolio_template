/**
 * Shared TypeScript types for Project management
 */

import { ProjectStatus } from '@prisma/client';

/**
 * Upload status for images
 */
export type UploadStatus = 'pending' | 'uploading' | 'completed' | 'error';

/**
 * Form data for creating/editing a project
 */
export interface ProjectFormData {
  title: string;
  description: string;
  location: string;
  category: string;
  capturedAt: Date | null;
  coverImage: string | null; // Cloudinary URL
  images: ProjectImageFormData[];
  status: ProjectStatus;
}

/**
 * Image form data
 */
export interface ProjectImageFormData {
  id: string; // Temporary ID for local state
  url: string; // Cloudinary URL
  title: string;
  description: string;
  width?: number;
  height?: number;
  size?: number;
  position: number;
  uploadStatus: UploadStatus;
  uploadProgress?: number; // 0-100
}

/**
 * Project data from the server (full)
 */
export interface ProjectWithImages {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  category: string | null;
  capturedAt: Date | null;
  coverImage: string | null;
  status: ProjectStatus;
  isFeatured: boolean;
  position: number;
  createdAt: Date;
  updatedAt: Date;
  images: ProjectImage[];
}

/**
 * Project image from server
 */
export interface ProjectImage {
  id: string;
  url: string | null;
  title: string | null;
  description: string | null;
  width: number | null;
  height: number | null;
  size: number | null;
  position: number;
  createdAt: Date;
}

/**
 * API request body for creating a project
 */
export interface CreateProjectRequest {
  title: string;
  description?: string;
  location?: string;
  category?: string;
  capturedAt?: string; // ISO date string
  coverImage?: string; // Cloudinary URL
  status: ProjectStatus;
  images?: {
    url: string;
    title?: string;
    description?: string;
    width?: number;
    height?: number;
    size?: number;
    position: number;
  }[];
}

/**
 * API request body for updating a project
 */
export interface UpdateProjectRequest extends CreateProjectRequest {
  id: string;
}

/**
 * API response for project operations
 */
export interface ProjectApiResponse {
  success: boolean;
  data?: ProjectWithImages;
  error?: string;
}

/**
 * Filter options for projects list
 */
export interface ProjectFilters {
  status?: ProjectStatus | 'ALL';
  category?: string;
  search?: string;
}

/**
 * Client-side enum for project status (matches Prisma enum)
 */
export const ProjectStatusEnum = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED',
} as const;

export type ProjectStatusType = typeof ProjectStatusEnum[keyof typeof ProjectStatusEnum];
