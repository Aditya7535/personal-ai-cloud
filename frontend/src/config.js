// Determine the API Base URL dynamically
export const getApiBaseUrl = () => {
  const custom = typeof window !== 'undefined' ? localStorage.getItem('custom_backend_url') : null;
  if (custom && custom.trim()) {
    return custom.trim().replace(/\/+$/, '');
  }

  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && !envUrl.includes('your-backend-domain.com') && !envUrl.includes('your-backend-url.com')) {
    return envUrl.trim().replace(/\/+$/, '');
  }

  // If running locally, default to FastAPI port 8000
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    return 'http://localhost:8000';
  }

  // Deployed / production fallback (HTTPS tunnel to backend)
  return 'https://personal-ai-cloud-aditya.loca.lt';
};

export const setApiBaseUrl = (url) => {
  if (typeof window === 'undefined') return;
  if (!url || !url.trim()) {
    localStorage.removeItem('custom_backend_url');
  } else {
    localStorage.setItem('custom_backend_url', url.trim().replace(/\/+$/, ''));
  }
};

export const isPlaceholderUrl = (url) => {
  if (!url) return true;
  return url.includes('your-backend-domain.com') || url.includes('your-backend-url.com');
};

export const API_BASE_URL = getApiBaseUrl();
