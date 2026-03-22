/**
 * Project Storage Service (localStorage)
 * 
 * Manages local storage of project drafts and caching of all projects
 * to optimize performance and reduce server calls.
 */

import { ProjectStatus } from '@prisma/client';

// Storage keys
const STORAGE_KEYS = {
  PROJECT_DRAFT: 'portfolio_project_draft',
  PROJECTS_CACHE: 'portfolio_projects_cache',
  CACHE_TIMESTAMP: 'portfolio_cache_timestamp',
} as const;

// Cache expiration time (5 minutes)
const CACHE_EXPIRY_MS = 5 * 60 * 1000;

/**
 * Project Draft stored in localStorage
 */
export interface ProjectDraft {
  id?: string; // Only set if editing existing project
  title: string;
  description: string;
  location: string;
  category: string;
  capturedAt: string | null; // ISO date string
  coverImage: string | null; // Cloudinary URL
  images: ProjectImageDraft[];
  status: ProjectStatus;
  isModified: boolean;
}

/**
 * Image within a project draft
 */
export interface ProjectImageDraft {
  id: string; // Temporary ID for UI
  url: string; // Cloudinary URL
  title: string;
  description: string;
  width?: number;
  height?: number;
  size?: number;
  position: number;
  uploadStatus: 'pending' | 'uploading' | 'completed' | 'error';
  uploadProgress?: number; // 0-100
}

/**
 * Cached project from server
 */
export interface CachedProject {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  category: string | null;
  capturedAt: string | null;
  coverImage: string | null;
  status: ProjectStatus;
  isFeatured: boolean;
  position: number;
  createdAt: string;
  updatedAt: string;
  images: {
    id: string;
    url: string | null;
    title: string | null;
    description: string | null;
    position: number;
  }[];
}

/**
 * Check if localStorage is available
 */
function isLocalStorageAvailable(): boolean {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Save a project draft to localStorage
 */
export function saveProjectDraft(draft: ProjectDraft): boolean {
  if (!isLocalStorageAvailable()) {
    console.warn('localStorage is not available');
    return false;
  }

  try {
    const draftWithTimestamp = {
      ...draft,
      _savedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.PROJECT_DRAFT, JSON.stringify(draftWithTimestamp));
    return true;
  } catch (error) {
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      console.error('localStorage quota exceeded');
      // Try to clear old cache to make space
      clearProjectsCache();
      try {
        localStorage.setItem(STORAGE_KEYS.PROJECT_DRAFT, JSON.stringify(draft));
        return true;
      } catch {
        return false;
      }
    }
    console.error('Error saving project draft:', error);
    return false;
  }
}

/**
 * Get the current project draft from localStorage
 */
export function getProjectDraft(): ProjectDraft | null {
  if (!isLocalStorageAvailable()) {
    return null;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PROJECT_DRAFT);
    if (!stored) {
      return null;
    }

    const parsed = JSON.parse(stored);
    // Remove timestamp before returning
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _savedAt, ...draft } = parsed;
    return draft as ProjectDraft;
  } catch (error) {
    console.error('Error reading project draft:', error);
    // Clear corrupted data
    clearProjectDraft();
    return null;
  }
}

/**
 * Clear the current project draft from localStorage
 */
export function clearProjectDraft(): void {
  if (!isLocalStorageAvailable()) {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEYS.PROJECT_DRAFT);
  } catch (error) {
    console.error('Error clearing project draft:', error);
  }
}

/**
 * Cache all projects in localStorage
 */
export function cacheProjects(projects: CachedProject[]): boolean {
  if (!isLocalStorageAvailable()) {
    return false;
  }

  try {
    localStorage.setItem(STORAGE_KEYS.PROJECTS_CACHE, JSON.stringify(projects));
    localStorage.setItem(STORAGE_KEYS.CACHE_TIMESTAMP, Date.now().toString());
    return true;
  } catch (error) {
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      console.error('localStorage quota exceeded when caching projects');
      return false;
    }
    console.error('Error caching projects:', error);
    return false;
  }
}

/**
 * Get cached projects from localStorage
 * Returns null if cache is expired or unavailable
 */
export function getCachedProjects(): CachedProject[] | null {
  if (!isLocalStorageAvailable()) {
    return null;
  }

  try {
    const timestamp = localStorage.getItem(STORAGE_KEYS.CACHE_TIMESTAMP);
    if (!timestamp) {
      return null;
    }

    const age = Date.now() - parseInt(timestamp, 10);
    if (age > CACHE_EXPIRY_MS) {
      // Cache expired
      clearProjectsCache();
      return null;
    }

    const stored = localStorage.getItem(STORAGE_KEYS.PROJECTS_CACHE);
    if (!stored) {
      return null;
    }

    return JSON.parse(stored) as CachedProject[];
  } catch (error) {
    console.error('Error reading cached projects:', error);
    clearProjectsCache();
    return null;
  }
}

/**
 * Update a single project in the cache
 */
export function updateCachedProject(project: CachedProject): boolean {
  const cached = getCachedProjects();
  if (!cached) {
    // No cache to update
    return false;
  }

  const index = cached.findIndex((p) => p.id === project.id);
  if (index >= 0) {
    // Update existing project
    cached[index] = project;
  } else {
    // Add new project
    cached.push(project);
  }

  return cacheProjects(cached);
}

/**
 * Remove a project from the cache
 */
export function removeCachedProject(projectId: string): boolean {
  const cached = getCachedProjects();
  if (!cached) {
    return false;
  }

  const filtered = cached.filter((p) => p.id !== projectId);
  return cacheProjects(filtered);
}

/**
 * Clear the projects cache
 */
export function clearProjectsCache(): void {
  if (!isLocalStorageAvailable()) {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEYS.PROJECTS_CACHE);
    localStorage.removeItem(STORAGE_KEYS.CACHE_TIMESTAMP);
  } catch (error) {
    console.error('Error clearing projects cache:', error);
  }
}

/**
 * Check if cache is fresh (not expired)
 */
export function isCacheFresh(): boolean {
  if (!isLocalStorageAvailable()) {
    return false;
  }

  try {
    const timestamp = localStorage.getItem(STORAGE_KEYS.CACHE_TIMESTAMP);
    if (!timestamp) {
      return false;
    }

    const age = Date.now() - parseInt(timestamp, 10);
    return age <= CACHE_EXPIRY_MS;
  } catch {
    return false;
  }
}
