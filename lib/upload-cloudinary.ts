/**
 * Cloudinary Upload Service (Client-side)
 * 
 * This service handles uploading images directly from the browser to Cloudinary
 * using the unsigned upload preset approach.
 */

export interface CloudinaryUploadResponse {
  public_id: string;
  version: number;
  signature: string;
  width: number;
  height: number;
  format: string;
  resource_type: string;
  created_at: string;
  tags: string[];
  bytes: number;
  type: string;
  etag: string;
  placeholder: boolean;
  url: string;
  secure_url: string;
  access_mode: string;
  original_filename: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

/**
 * Upload an image to Cloudinary
 * @param file - The image file to upload
 * @param onProgress - Optional callback for upload progress
 * @returns Promise with Cloudinary response containing the image URL
 */
export async function uploadImageToCloudinary(
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<CloudinaryUploadResponse> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      'Cloudinary configuration missing. Please set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET in your .env file.'
    );
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);
  formData.append('folder', 'portfolio'); // Optional: organize images in a folder

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // Track upload progress
    if (onProgress) {
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress: UploadProgress = {
            loaded: event.loaded,
            total: event.total,
            percentage: Math.round((event.loaded / event.total) * 100),
          };
          onProgress(progress);
        }
      });
    }

    // Handle successful upload
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response: CloudinaryUploadResponse = JSON.parse(xhr.responseText);
          resolve(response);
        } catch (error) {
          reject(new Error('Failed to parse Cloudinary response'));
        }
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}: ${xhr.statusText}`));
      }
    });

    // Handle network errors
    xhr.addEventListener('error', () => {
      reject(new Error('Network error during upload'));
    });

    // Handle timeout
    xhr.addEventListener('timeout', () => {
      reject(new Error('Upload timeout'));
    });

    // Set timeout to 60 seconds
    xhr.timeout = 60000;

    // Send the request
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`);
    xhr.send(formData);
  });
}

/**
 * Get an optimized URL for an image stored in Cloudinary
 * @param publicId - The public ID of the image in Cloudinary
 * @param transformations - Optional transformations (e.g., width, height, quality)
 * @returns Optimized image URL
 */
export function getCloudinaryUrl(
  publicId: string,
  transformations?: {
    width?: number;
    height?: number;
    quality?: number;
    crop?: 'fill' | 'fit' | 'scale' | 'limit';
    format?: 'auto' | 'webp' | 'jpg' | 'png';
  }
): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  
  if (!cloudName) {
    console.warn('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME not set');
    return '';
  }

  let transformString = '';
  
  if (transformations) {
    const parts: string[] = [];
    
    if (transformations.width) parts.push(`w_${transformations.width}`);
    if (transformations.height) parts.push(`h_${transformations.height}`);
    if (transformations.quality) parts.push(`q_${transformations.quality}`);
    if (transformations.crop) parts.push(`c_${transformations.crop}`);
    if (transformations.format) parts.push(`f_${transformations.format}`);
    
    if (parts.length > 0) {
      transformString = parts.join(',') + '/';
    }
  }

  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformString}${publicId}`;
}

/**
 * Delete an image from Cloudinary
 * Note: This requires server-side implementation with authenticated API
 * This is a placeholder for future implementation
 */
export async function deleteImageFromCloudinary(publicId: string): Promise<void> {
  // This should be implemented as a server action or API route
  // because deletion requires authentication
  throw new Error('Image deletion must be performed server-side');
}
