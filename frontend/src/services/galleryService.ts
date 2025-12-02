/**
 * Gallery Service - API calls for gallery images
 */
import api from './api';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

export interface GalleryImage {
  id: number;
  title: string;
  description?: string;
  image_url: string;
  is_active: boolean;
  order: number;
  created_at: string;
  updated_at?: string;
  created_by_id?: number;
}

export interface GalleryImageListResponse {
  count: number;
  results: GalleryImage[];
}

export interface CreateGalleryImageData {
  title: string;
  description?: string;
  image: File;
  is_active?: boolean;
  order?: number;
}

export interface UpdateGalleryImageData {
  title?: string;
  description?: string;
  is_active?: boolean;
  order?: number;
}

/**
 * Get all gallery images (public - no auth required)
 */
export const getGalleryImages = async (isActive?: boolean): Promise<GalleryImage[]> => {
  const params: any = {};
  if (isActive !== undefined) {
    params.is_active = isActive;
  }
  
  // Public endpoint için token göndermeden istek yap
  const response = await axios.get<GalleryImageListResponse>(
    `${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'}${API_ENDPOINTS.GALLERY}`,
    { params }
  );
  return response.data.results;
};

/**
 * Get a single gallery image by ID (public)
 */
export const getGalleryImage = async (id: number): Promise<GalleryImage> => {
  // Public endpoint için token göndermeden istek yap
  const response = await axios.get<GalleryImage>(
    `${import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api'}${API_ENDPOINTS.GALLERY_ITEM(id)}`
  );
  return response.data;
};

/**
 * Create a new gallery image (admin only)
 */
export const createGalleryImage = async (data: CreateGalleryImageData): Promise<GalleryImage> => {
  const formData = new FormData();
  formData.append('title', data.title);
  if (data.description) {
    formData.append('description', data.description);
  }
  formData.append('image', data.image);
  if (data.is_active !== undefined) {
    formData.append('is_active', String(data.is_active));
  }
  if (data.order !== undefined) {
    formData.append('order', String(data.order));
  }
  
  const response = await api.post<GalleryImage>(API_ENDPOINTS.GALLERY, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

/**
 * Update a gallery image (admin only)
 */
export const updateGalleryImage = async (
  id: number,
  data: UpdateGalleryImageData
): Promise<GalleryImage> => {
  const response = await api.patch<GalleryImage>(API_ENDPOINTS.GALLERY_ITEM(id), data);
  return response.data;
};

/**
 * Delete a gallery image (admin only)
 */
export const deleteGalleryImage = async (id: number): Promise<void> => {
  await api.delete(API_ENDPOINTS.GALLERY_ITEM(id));
};

