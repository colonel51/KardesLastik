/**
 * Contact Service - API calls for contact messages
 */
import api from './api';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface ContactMessageListResponse {
  count: number;
  results: ContactMessage[];
}

export interface CreateContactMessageData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

/**
 * Create a new contact message (public - no auth required)
 */
export const createContactMessage = async (data: CreateContactMessageData): Promise<ContactMessage> => {
  // Public endpoint için token göndermeden istek yap
  const response = await axios.post<ContactMessage>(
    `${import.meta.env.VITE_API_BASE_URL || '/api'}${API_ENDPOINTS.CONTACT}`,
    data
  );
  return response.data;
};

/**
 * Get all contact messages (admin only)
 */
export const getContactMessages = async (isRead?: boolean): Promise<ContactMessage[]> => {
  const params: any = {};
  if (isRead !== undefined) {
    params.is_read = isRead;
  }
  
  const response = await api.get<ContactMessageListResponse>(API_ENDPOINTS.CONTACT, { params });
  return response.data.results;
};

/**
 * Get a single contact message by ID (admin only)
 */
export const getContactMessage = async (id: number): Promise<ContactMessage> => {
  const response = await api.get<ContactMessage>(API_ENDPOINTS.CONTACT_ITEM(id));
  return response.data;
};

/**
 * Mark a contact message as read (admin only)
 */
export const markContactMessageAsRead = async (id: number): Promise<ContactMessage> => {
  const response = await api.post<ContactMessage>(API_ENDPOINTS.CONTACT_MARK_AS_READ(id));
  return response.data;
};

/**
 * Delete a contact message (admin only)
 */
export const deleteContactMessage = async (id: number): Promise<void> => {
  await api.delete(API_ENDPOINTS.CONTACT_ITEM(id));
};

