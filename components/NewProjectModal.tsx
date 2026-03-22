"use client";

import React, { useState, useRef, useEffect } from "react";
import { ProjectStatus } from "@prisma/client";
import { uploadImageToCloudinary, type UploadProgress } from "@/lib/upload-cloudinary";
import { 
  saveProjectDraft, 
  getProjectDraft, 
  clearProjectDraft, 
  updateCachedProject,
  type ProjectImageDraft 
} from "@/lib/project-storage";
import { syncPublicProjectsCacheWithProject } from "@/lib/public-project-session";
import { useRouter } from "next/navigation";

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId?: string;
}

export function NewProjectModal({ isOpen, onClose, projectId }: NewProjectModalProps) {
  const router = useRouter();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [capturedAt, setCapturedAt] = useState<string>("");
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [coverUploading, setCoverUploading] = useState(false);
  const [coverUploadProgress, setCoverUploadProgress] = useState(0);
  
  const [gallery, setGallery] = useState<ProjectImageDraft[]>([]);
  
  const [isModified, setIsModified] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [newImageTitle, setNewImageTitle] = useState("");
  const [newImageDescription, setNewImageDescription] = useState("");
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [newImagePreview, setNewImagePreview] = useState<string>("");

  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (projectId) {
        // Load existing project for editing
        loadProjectForEditing(projectId);
      } else {
        // Load draft for new project
        const draft = getProjectDraft();
        if (draft) {
          setTitle(draft.title || "");
          setDescription(draft.description || "");
          setLocation(draft.location || "");
          setCategory(draft.category || "");
          setCapturedAt(draft.capturedAt || "");
          setCoverImageUrl(draft.coverImage);
          setGallery(draft.images || []);
          setIsModified(draft.isModified);
        }
      }
    }
  }, [isOpen, projectId]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const scrollY = window.scrollY;
    const originalStyle = {
      overflow: document.body.style.overflow,
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
    };

    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";

    return () => {
      document.body.style.overflow = originalStyle.overflow;
      document.body.style.position = originalStyle.position;
      document.body.style.top = originalStyle.top;
      document.body.style.width = originalStyle.width;
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  const loadProjectForEditing = async (id: string) => {
    try {
      const response = await fetch(`/api/projects/${id}`);
      const result = await response.json();
      
      if (result.success && result.data) {
        const project = result.data;
        setTitle(project.title || "");
        setDescription(project.description || "");
        setLocation(project.location || "");
        setCategory(project.category || "");
        setCapturedAt(project.capturedAt ? new Date(project.capturedAt).toISOString().split('T')[0] : "");
        setCoverImageUrl(project.coverImage || null);
        
        // Load gallery images
        if (project.images && project.images.length > 0) {
          const loadedImages: ProjectImageDraft[] = project.images.map((img: any, index: number) => ({
            id: img.id,
            url: img.url,
            title: img.title || "",
            description: img.description || "",
            position: img.position !== undefined ? img.position : index,
            width: img.width,
            height: img.height,
            size: img.size,
            uploadStatus: 'completed' as const,
            uploadProgress: 100,
          }));
          setGallery(loadedImages);
        }
        
        setIsModified(false);
      }
    } catch (error) {
      console.error("Error loading project:", error);
      setSaveError("Erreur lors du chargement du projet");
    }
  };

  useEffect(() => {
    if (isOpen && isModified && !projectId) {
      const draft = {
        id: projectId,
        title,
        description,
        location,
        category,
        capturedAt,
        coverImage: coverImageUrl,
        images: gallery,
        status: ProjectStatus.DRAFT,
        isModified,
      };
      saveProjectDraft(draft);
    }
  }, [title, description, location, category, capturedAt, coverImageUrl, gallery, isModified, isOpen, projectId]);

  const handleFieldChange = <T,>(setter: React.Dispatch<React.SetStateAction<T>>) => {
    return (value: T) => {
      setter(value);
      setIsModified(true);
    };
  };

  if (!isOpen) return null;

  const handleCoverSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setCoverUploading(true);
      setCoverUploadProgress(0);
      
      const response = await uploadImageToCloudinary(file, (progress: UploadProgress) => {
        setCoverUploadProgress(progress.percentage);
      });

      setCoverImageUrl(response.secure_url);
      setIsModified(true);
    } catch (error) {
      console.error("Error uploading cover image:", error);
      alert("Erreur lors de l'upload de l'image de couverture");
    } finally {
      setCoverUploading(false);
      setCoverUploadProgress(0);
    }
  };

  const handleNewImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImageFile(file);
      setNewImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddImageToGallery = async () => {
    if (!newImageFile) return;

    const tempId = Math.random().toString(36).substring(7);
    
    const newImage: ProjectImageDraft = {
      id: tempId,
      url: "",
      title: newImageTitle,
      description: newImageDescription,
      position: gallery.length,
      uploadStatus: 'uploading',
      uploadProgress: 0,
    };

    setGallery([...gallery, newImage]);
    setIsImageModalOpen(false);
    setIsModified(true);

    const currentFile = newImageFile;
    setNewImageFile(null);
    setNewImagePreview("");
    setNewImageTitle("");
    setNewImageDescription("");

    try {
      const response = await uploadImageToCloudinary(currentFile, (progress: UploadProgress) => {
        setGallery(prev => prev.map(img => 
          img.id === tempId 
            ? { ...img, uploadProgress: progress.percentage }
            : img
        ));
      });

      setGallery(prev => prev.map(img => 
        img.id === tempId 
          ? {
              ...img,
              url: response.secure_url,
              width: response.width,
              height: response.height,
              size: response.bytes,
              uploadStatus: 'completed' as const,
              uploadProgress: 100,
            }
          : img
      ));
    } catch (error) {
      console.error("Error uploading image:", error);
      setGallery(prev => prev.map(img => 
        img.id === tempId 
          ? { ...img, uploadStatus: 'error' as const }
          : img
      ));
    }
  };

  const removeGalleryImage = (id: string) => {
    setGallery(gallery.filter(img => img.id !== id));
    setIsModified(true);
  };

  const handleSave = async (publish: boolean) => {
    setSaveError(null);
    setIsSaving(true);

    try {
      if (!title.trim()) {
        throw new Error("Le titre est requis");
      }

      const hasUploadingImages = gallery.some(img => img.uploadStatus === 'uploading');
      if (hasUploadingImages) {
        throw new Error("Veuillez attendre que toutes les images soient téléchargées");
      }

      const projectData = {
        title: title.trim(),
        description: description.trim() || undefined,
        location: location.trim() || undefined,
        category: category.trim() || undefined,
        capturedAt: capturedAt || undefined,
        coverImage: coverImageUrl || undefined,
        status: publish ? ProjectStatus.PUBLISHED : ProjectStatus.DRAFT,
        images: gallery
          .filter(img => img.uploadStatus === 'completed' && img.url)
          .map(img => ({
            url: img.url,
            title: img.title || undefined,
            description: img.description || undefined,
            width: img.width,
            height: img.height,
            size: img.size,
            position: img.position,
          })),
      };

      const endpoint = projectId 
        ? `/api/projects/${projectId}` 
        : '/api/projects';
      const method = projectId ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Erreur lors de la sauvegarde');
      }

      if (result.data) {
        const cachedProject = {
          ...result.data,
          createdAt: result.data.createdAt.toString(),
          updatedAt: result.data.updatedAt.toString(),
          capturedAt: result.data.capturedAt?.toString() || null,
        };

        updateCachedProject(cachedProject);
        syncPublicProjectsCacheWithProject(cachedProject);
      }

      clearProjectDraft();
      
      setTitle("");
      setDescription("");
      setLocation("");
      setCategory("");
      setCapturedAt("");
      setCoverImageUrl(null);
      setGallery([]);
      setIsModified(false);

      onClose();
      if (publish) {
        router.push('/');
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error("Error saving project:", error);
      setSaveError(error instanceof Error ? error.message : "Erreur inconnue");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-end justify-center p-0 sm:items-center sm:p-4">
        <div 
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        ></div>

        <div className="relative z-50 w-full max-w-4xl max-h-[100dvh] overflow-y-auto overscroll-contain rounded-t-3xl border border-white/10 bg-(--site-ink) p-4 pb-6 shadow-2xl sm:max-h-[90vh] sm:rounded-3xl sm:p-8">
          <button
            onClick={onClose}
            className="absolute right-6 top-6 rounded-full bg-white/5 p-2 text-white/50 transition hover:bg-white/10 hover:text-white"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <h2 className="mb-6 text-2xl font-semibold text-(--site-gold)">
            {projectId ? 'Modifier le Projet' : 'Nouveau Projet'}
          </h2>

          {saveError && (
            <div className="mb-4 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
              {saveError}
            </div>
          )}

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label htmlFor="project-title" className="mb-2 block text-sm font-medium text-(--site-sand)">
                Titre du projet *
              </label>
              <input
                id="project-title"
                type="text"
                value={title}
                onChange={(e) => handleFieldChange(setTitle)(e.target.value)}
                placeholder="Ex: Rénovation d'un salon nantais..."
                className="w-full rounded-xl border border-white/20 bg-black/30 px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition focus:border-(--site-gold) focus:ring-1 focus:ring-(--site-gold)"
                required
              />
            </div>

            <div>
              <label htmlFor="project-description" className="mb-2 block text-sm font-medium text-(--site-sand)">
                Description
              </label>
              <textarea
                id="project-description"
                value={description}
                onChange={(e) => handleFieldChange(setDescription)(e.target.value)}
                placeholder="Décrivez votre projet..."
                rows={4}
                className="w-full rounded-xl border border-white/20 bg-black/30 px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition focus:border-(--site-gold) focus:ring-1 focus:ring-(--site-gold) resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="project-location" className="mb-2 block text-sm font-medium text-(--site-sand)">
                  Localisation
                </label>
                <input
                  id="project-location"
                  type="text"
                  value={location}
                  onChange={(e) => handleFieldChange(setLocation)(e.target.value)}
                  placeholder="Ex: Nantes, France"
                  className="w-full rounded-xl border border-white/20 bg-black/30 px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition focus:border-(--site-gold) focus:ring-1 focus:ring-(--site-gold)"
                />
              </div>

              <div>
                <label htmlFor="project-category" className="mb-2 block text-sm font-medium text-(--site-sand)">
                  Catégorie
                </label>
                <input
                  id="project-category"
                  type="text"
                  value={category}
                  onChange={(e) => handleFieldChange(setCategory)(e.target.value)}
                  placeholder="Ex: Rénovation intérieure"
                  className="w-full rounded-xl border border-white/20 bg-black/30 px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition focus:border-(--site-gold) focus:ring-1 focus:ring-(--site-gold)"
                />
              </div>
            </div>

            <div>
              <label htmlFor="project-captured-at" className="mb-2 block text-sm font-medium text-(--site-sand)">
                Date de réalisation
              </label>
              <input
                id="project-captured-at"
                type="date"
                value={capturedAt}
                onChange={(e) => handleFieldChange(setCapturedAt)(e.target.value)}
                className="w-full rounded-xl border border-white/20 bg-black/30 px-4 py-3 text-sm text-white placeholder-white/40 outline-none transition focus:border-(--site-gold) focus:ring-1 focus:ring-(--site-gold)"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-(--site-sand)">
                Image de couverture
              </label>
              <input 
                type="file" 
                ref={coverInputRef} 
                onChange={handleCoverSelect} 
                className="hidden" 
                accept="image/*" 
              />
              <div 
                onClick={() => !coverUploading && coverInputRef.current?.click()}
                className={`group relative flex h-48 cursor-pointer overflow-hidden flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/20 bg-black/20 transition ${
                  coverUploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-(--site-gold)/50 hover:bg-black/40'
                }`}
              >
                {coverImageUrl && !coverUploading ? (
                  <img src={coverImageUrl} alt="Cover preview" className="absolute inset-0 h-full w-full object-cover opacity-60 group-hover:opacity-40 transition" />
                ) : null}
                
                {coverUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/80">
                    <div className="text-center">
                      <div className="mb-2 h-8 w-8 animate-spin rounded-full border-4 border-white/20 border-t-(--site-gold) mx-auto"></div>
                      <p className="text-sm text-white">{coverUploadProgress}%</p>
                    </div>
                  </div>
                )}
                
                <div className="text-center relative z-10">
                  <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 group-hover:bg-(--site-gold)/20 transition">
                    <svg className="h-6 w-6 text-(--site-mist) group-hover:text-(--site-gold)" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-white">
                    {coverImageUrl ? "Modifier l'image de couverture" : "Cliquez pour ajouter une image de couverture"}
                  </p>
                  <p className="mt-1 text-xs text-(--site-mist)">PNG, JPG ou WEBP</p>
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 flex items-center justify-between text-sm font-medium text-(--site-sand)">
                <span>Galerie du projet</span>
                <span className="text-xs text-white/50">
                  {gallery.filter(img => img.uploadStatus === 'completed').length} / {gallery.length} image{gallery.length > 1 ? "s" : ""}
                </span>
              </label>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div 
                  onClick={() => setIsImageModalOpen(true)}
                  className="group flex aspect-square cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/20 bg-black/20 hover:border-(--site-gold)/50 hover:bg-black/40 transition"
                >
                  <svg className="mb-2 h-8 w-8 text-(--site-mist) group-hover:text-(--site-gold)" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="text-xs font-medium text-white/70 group-hover:text-white">Ajouter</span>
                </div>
                
                {gallery.map((img) => (
                  <div key={img.id} className={`group relative aspect-square rounded-2xl border border-white/10 bg-white/5 overflow-hidden ${
                    img.uploadStatus === 'uploading' ? 'opacity-50' : ''
                  }`}>
                    {img.url && img.uploadStatus === 'completed' && (
                      <img src={img.url} alt={img.title} className="h-full w-full object-cover" />
                    )}
                    
                    {img.uploadStatus === 'uploading' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                        <div className="text-center">
                          <div className="mb-1 h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-(--site-gold) mx-auto"></div>
                          <p className="text-xs text-white">{img.uploadProgress || 0}%</p>
                        </div>
                      </div>
                    )}

                    {img.uploadStatus === 'error' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-red-900/60">
                        <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    )}
                    
                    {img.uploadStatus === 'completed' && (
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex flex-col justify-between p-2">
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(img.id)}
                          className="self-end rounded-full bg-red-500/80 p-1.5 text-white hover:bg-red-500 transition"
                        >
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        {img.title && (
                          <span className="text-xs text-white font-medium truncate bg-black/60 px-2 py-1 rounded w-full text-center">
                            {img.title}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col-reverse justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-full px-5 py-2.5 text-sm font-semibold text-(--site-mist) transition hover:bg-white/10 hover:text-white sm:w-auto"
              >
                Annuler
              </button>
              
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <button
                  type="button"
                  onClick={() => handleSave(false)}
                  disabled={isSaving || !title.trim()}
                  className="w-full rounded-full bg-white/10 px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  {isSaving ? 'Sauvegarde...' : 'Sauvegarder et visualiser'}
                </button>
                
                <button
                  type="button"
                  onClick={() => handleSave(true)}
                  disabled={isSaving || !title.trim()}
                  className="w-full rounded-full bg-(--site-gold) px-6 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-(--site-gold)/20 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  {isSaving ? 'Publication...' : 'Sauvegarder et publier'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {isImageModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setIsImageModalOpen(false)}
          ></div>
          <div className="relative z-[70] w-full max-w-md rounded-3xl border border-white/10 bg-[#16202c] p-6 shadow-2xl">
            <h3 className="mb-4 text-xl font-semibold text-white">Ajouter une Image</h3>
            
            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-(--site-sand)">Fichier image *</label>
                <input 
                  type="file" 
                  ref={galleryInputRef} 
                  onChange={handleNewImageSelect} 
                  className="hidden" 
                  accept="image/*" 
                />
                <div 
                  onClick={() => galleryInputRef.current?.click()}
                  className="group relative flex h-32 cursor-pointer overflow-hidden flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/20 bg-black/30 hover:border-(--site-gold)/50 hover:bg-black/50 transition"
                >
                  {newImagePreview ? (
                    <img src={newImagePreview} alt="Preview" className="absolute inset-0 h-full w-full object-cover opacity-80" />
                  ) : (
                    <div className="text-center">
                      <svg className="mx-auto mb-2 h-6 w-6 text-white/50 group-hover:text-(--site-gold)" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <span className="text-sm text-white/70">Cliquez pour sélectionner</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="image-title" className="mb-2 block text-sm font-medium text-(--site-sand)">
                  Titre de l'image
                </label>
                <input
                  id="image-title"
                  type="text"
                  value={newImageTitle}
                  onChange={(e) => setNewImageTitle(e.target.value)}
                  placeholder="Ex: Avant la rénovation..."
                  className="w-full rounded-xl border border-white/20 bg-black/30 px-3 py-2 text-sm text-white placeholder-white/40 outline-none transition focus:border-(--site-gold) focus:ring-1 focus:ring-(--site-gold)"
                />
              </div>

              <div>
                <label htmlFor="image-description" className="mb-2 block text-sm font-medium text-(--site-sand)">
                  Description
                </label>
                <textarea
                  id="image-description"
                  value={newImageDescription}
                  onChange={(e) => setNewImageDescription(e.target.value)}
                  placeholder="Description de l'image..."
                  rows={3}
                  className="w-full rounded-xl border border-white/20 bg-black/30 px-3 py-2 text-sm text-white placeholder-white/40 outline-none transition focus:border-(--site-gold) focus:ring-1 focus:ring-(--site-gold) resize-none"
                />
              </div>
              
              <div className="flex justify-end gap-2 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setIsImageModalOpen(false);
                    setNewImageFile(null);
                    setNewImagePreview("");
                    setNewImageTitle("");
                    setNewImageDescription("");
                  }}
                  className="rounded-full px-4 py-2 text-sm font-medium text-(--site-mist) hover:text-white hover:bg-white/10 transition"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleAddImageToGallery}
                  disabled={!newImageFile}
                  className="rounded-full bg-(--site-gold) px-5 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
