import { ProjectWithImages } from "@/app/actions/get-projects";

/**
 * Helper to get image URL for a project
 * Returns coverImage if available, otherwise first project image, or null
 */
export function getProjectImageUrl(project: ProjectWithImages): string | null {
  if (project.coverImage) {
    return project.coverImage;
  }
  
  if (project.images.length > 0) {
    return `/api/images/${project.images[0].id}`;
  }
  
  return null;
}
