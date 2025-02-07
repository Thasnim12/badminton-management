// Admin/Auth/useAuth.js
export const useAuth = () => {
    // Check if the admin is authenticated in localStorage
    const isAuthenticated = localStorage.getItem('isAdminAuthenticated') === 'true';
    return isAuthenticated;
  };
  