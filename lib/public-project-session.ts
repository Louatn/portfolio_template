const VISITOR_SESSION_COOKIE = 'portfolio_visitor_session';
const PUBLIC_PROJECTS_CACHE_KEY = 'portfolio_public_projects_payload';
const SESSION_DURATION_SECONDS = 30 * 60;
const SESSION_DURATION_MS = SESSION_DURATION_SECONDS * 1000;

export type PublicProjectStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';

export interface PublicProject {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  category: string | null;
  coverImage: string | null;
  status: PublicProjectStatus;
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

export interface PublicProjectsPayload {
  featuredProjects: PublicProject[];
  publishedProjects: PublicProject[];
  categories: string[];
  cachedAt: number;
}

type PublicProjectInput = PublicProject | (PublicProject & { createdAt: Date | string; updatedAt: Date | string });

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function getCookieValue(name: string): string | null {
  if (!isBrowser()) {
    return null;
  }

  const cookies = document.cookie ? document.cookie.split('; ') : [];
  for (const cookie of cookies) {
    if (cookie.startsWith(`${name}=`)) {
      return cookie.slice(name.length + 1);
    }
  }

  return null;
}

function generateSessionValue(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

export function ensureVisitorSessionCookie(): void {
  if (!isBrowser()) {
    return;
  }

  if (getCookieValue(VISITOR_SESSION_COOKIE)) {
    return;
  }

  document.cookie = `${VISITOR_SESSION_COOKIE}=${generateSessionValue()}; Max-Age=${SESSION_DURATION_SECONDS}; Path=/; SameSite=Lax`;
}

export function isVisitorSessionValid(): boolean {
  return getCookieValue(VISITOR_SESSION_COOKIE) !== null;
}

export function clearPublicProjectsCache(): void {
  if (!isBrowser()) {
    return;
  }

  localStorage.removeItem(PUBLIC_PROJECTS_CACHE_KEY);
}

export function getCachedPublicProjects(): PublicProjectsPayload | null {
  if (!isBrowser()) {
    return null;
  }

  if (!isVisitorSessionValid()) {
    clearPublicProjectsCache();
    return null;
  }

  const rawCache = localStorage.getItem(PUBLIC_PROJECTS_CACHE_KEY);
  if (!rawCache) {
    return null;
  }

  try {
    const parsed = JSON.parse(rawCache) as PublicProjectsPayload;
    const age = Date.now() - parsed.cachedAt;

    if (age > SESSION_DURATION_MS) {
      clearPublicProjectsCache();
      return null;
    }

    return parsed;
  } catch (error) {
    console.error('Error reading public projects cache:', error);
    clearPublicProjectsCache();
    return null;
  }
}

export function setCachedPublicProjects(payload: Omit<PublicProjectsPayload, 'cachedAt'>): void {
  if (!isBrowser()) {
    return;
  }

  ensureVisitorSessionCookie();

  const cacheWithTimestamp: PublicProjectsPayload = {
    ...payload,
    cachedAt: Date.now(),
  };

  localStorage.setItem(PUBLIC_PROJECTS_CACHE_KEY, JSON.stringify(cacheWithTimestamp));
}

function normalizeProject(project: PublicProjectInput): PublicProject {
  return {
    ...project,
    createdAt: String(project.createdAt),
    updatedAt: String(project.updatedAt),
  };
}

function sortFeaturedProjects(projects: PublicProject[]): PublicProject[] {
  const featured = projects
    .filter((project) => project.isFeatured)
    .sort((a, b) => a.position - b.position);

  const featuredIds = new Set(featured.map((project) => project.id));
  const fallback = projects
    .filter((project) => !featuredIds.has(project.id))
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

  return [...featured, ...fallback].slice(0, 6);
}

function extractCategories(projects: PublicProject[]): string[] {
  return Array.from(
    new Set(
      projects
        .map((project) => project.category)
        .filter((category): category is string => Boolean(category && category.trim()))
    )
  ).sort();
}

export function syncPublicProjectsCacheWithProject(project: PublicProjectInput): void {
  const cached = getCachedPublicProjects();
  if (!cached) {
    return;
  }

  const normalizedProject = normalizeProject(project);
  const remaining = cached.publishedProjects.filter((item) => item.id !== normalizedProject.id);
  const updatedPublished =
    normalizedProject.status === 'PUBLISHED'
      ? [...remaining, normalizedProject].sort((a, b) => a.position - b.position)
      : remaining;

  setCachedPublicProjects({
    publishedProjects: updatedPublished,
    featuredProjects: sortFeaturedProjects(updatedPublished),
    categories: extractCategories(updatedPublished),
  });
}

export function removePublicProjectFromCache(projectId: string): void {
  const cached = getCachedPublicProjects();
  if (!cached) {
    return;
  }

  const updatedPublished = cached.publishedProjects.filter((project) => project.id !== projectId);

  setCachedPublicProjects({
    publishedProjects: updatedPublished,
    featuredProjects: sortFeaturedProjects(updatedPublished),
    categories: extractCategories(updatedPublished),
  });
}

export async function loadPublicProjectsData(): Promise<PublicProjectsPayload> {
  const cached = getCachedPublicProjects();
  if (cached) {
    return cached;
  }

  ensureVisitorSessionCookie();

  const response = await fetch('/api/public/projects', {
    method: 'GET',
    cache: 'no-store',
  });

  const result = await response.json();
  if (!result?.success || !result?.data) {
    throw new Error(result?.error || 'Failed to load public projects');
  }

  const payload = {
    featuredProjects: result.data.featuredProjects as PublicProject[],
    publishedProjects: result.data.publishedProjects as PublicProject[],
    categories: result.data.categories as string[],
  };

  setCachedPublicProjects(payload);

  return {
    ...payload,
    cachedAt: Date.now(),
  };
}