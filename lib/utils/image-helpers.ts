type ProjectImageLike = {
  id: string;
  url: string | null;
};

type ProjectLike = {
  coverImage: string | null;
  images: ProjectImageLike[];
};

/**
 * Helper to get image URL for a project
 * Returns coverImage if available, otherwise first project image, or null
 */
export function getProjectImageUrl(project: ProjectLike): string | null {
  if (project.coverImage) {
    return project.coverImage;
  }
  
  if (project.images.length > 0) {
    if (project.images[0].url) {
      return project.images[0].url;
    }

    return `/api/images/${project.images[0].id}`;
  }
  
  return null;
}
