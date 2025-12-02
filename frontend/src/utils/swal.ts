/**
 * SweetAlert2 utility functions
 */
import Swal from 'sweetalert2';

/**
 * Success alert
 */
export const showSuccess = (message: string, title: string = 'Başarılı!') => {
  return Swal.fire({
    icon: 'success',
    title,
    text: message,
    confirmButtonText: 'Tamam',
    confirmButtonColor: '#0d6efd',
  });
};

/**
 * Error alert
 */
export const showError = (message: string, title: string = 'Hata!') => {
  return Swal.fire({
    icon: 'error',
    title,
    text: message,
    confirmButtonText: 'Tamam',
    confirmButtonColor: '#dc3545',
  });
};

/**
 * Warning alert
 */
export const showWarning = (message: string, title: string = 'Uyarı!') => {
  return Swal.fire({
    icon: 'warning',
    title,
    text: message,
    confirmButtonText: 'Tamam',
    confirmButtonColor: '#ffc107',
  });
};

/**
 * Info alert
 */
export const showInfo = (message: string, title: string = 'Bilgi') => {
  return Swal.fire({
    icon: 'info',
    title,
    text: message,
    confirmButtonText: 'Tamam',
    confirmButtonColor: '#0dcaf0',
  });
};

/**
 * Confirmation dialog
 */
export const showConfirm = (
  message: string,
  title: string = 'Emin misiniz?',
  confirmText: string = 'Evet',
  cancelText: string = 'Hayır'
) => {
  return Swal.fire({
    icon: 'question',
    title,
    text: message,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    confirmButtonColor: '#0d6efd',
    cancelButtonColor: '#6c757d',
  });
};

/**
 * Delete confirmation dialog
 */
export const showDeleteConfirm = (message: string = 'Bu işlem geri alınamaz!') => {
  return Swal.fire({
    icon: 'warning',
    title: 'Silmek istediğinize emin misiniz?',
    text: message,
    showCancelButton: true,
    confirmButtonText: 'Evet, Sil',
    cancelButtonText: 'İptal',
    confirmButtonColor: '#dc3545',
    cancelButtonColor: '#6c757d',
  });
};

