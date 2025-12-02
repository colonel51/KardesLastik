/**
 * API Configuration
 */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export const API_ENDPOINTS = {
  // Customer endpoints
  CUSTOMERS: '/customers/',
  CUSTOMER: (id: number) => `/customers/${id}/`,
  CUSTOMER_DEBTS: (id: number) => `/customers/${id}/debts/`,
  
  // Debt endpoints
  DEBTS: '/debts/',
  DEBT: (id: number) => `/debts/${id}/`,
  DEBT_MARK_PAID: (id: number) => `/debts/${id}/mark_paid/`,
  DEBT_MARK_UNPAID: (id: number) => `/debts/${id}/mark_unpaid/`,
  
  // Gallery endpoints
  GALLERY: '/gallery/',
  GALLERY_ITEM: (id: number) => `/gallery/${id}/`,
  
  // Contact endpoints
  CONTACT: '/contact/',
  CONTACT_ITEM: (id: number) => `/contact/${id}/`,
  CONTACT_MARK_AS_READ: (id: number) => `/contact/${id}/mark_as_read/`,
  
  // Auth endpoints (Django admin)
  ADMIN_LOGIN: '/admin/login/',
};

