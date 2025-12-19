// // API Configuration
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

// // Get auth token from localStorage
// const getAuthToken = () => {
//   return localStorage.getItem('authToken') || localStorage.getItem('token');
// };

// // Common headers with auth
// const getHeaders = (customHeaders = {}) => {
//   const token = getAuthToken();
//   return {
//     'Accept': 'application/json',
//     'Content-Type': 'application/json',
//     ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
//     ...customHeaders
//   };
// };

// // API Endpoints
// export const API_ENDPOINTS = {
//   // Authentication
//   AUTH: {
//     LOGIN: `${API_BASE_URL}/UserOperations/login`,
//     REGISTER: `${API_BASE_URL}/UserOperations/register`,
//     LOGOUT: `${API_BASE_URL}/UserOperations/logout`,
//     REFRESH: `${API_BASE_URL}/UserOperations/refresh-token`
//   },
  
//   // Banners Operations
//   BANNERS: {
//     CURRENT: `${API_BASE_URL}/banners/current`,
//     UPLOAD: `${API_BASE_URL}/banners/upload`,
//     ALL: `${API_BASE_URL}/banners`,
//     SINGLE: (id) => `${API_BASE_URL}/banners/${id}`,
//     ACTIVE: `${API_BASE_URL}/banners/active`
//   },
  
//   // Banners UI
//   BANNERS_UI: {
//     CURRENT: `${API_BASE_URL}/BannersUI/current1`,
//     UPLOAD: `${API_BASE_URL}/BannersUI/upload1`
//   },

//   // User Operations
//   USERS: {
//     ALL: `${API_BASE_URL}/UserOperations/getAllUsers`,
//     UPDATE: (userId) => `${API_BASE_URL}/UserOperations/update/${userId}`,
//     DELETE: (userId) => `${API_BASE_URL}/UserOperations/deleteUser/${userId}`,
//     PROFILE: `${API_BASE_URL}/UserOperations/profile`,
//     UPDATE_PROFILE: `${API_BASE_URL}/UserOperations/update-profile`
//   },

//   // Bookings
//   BOOKINGS: {
//     ALL: `${API_BASE_URL}/bookings`,
//     SINGLE: (id) => `${API_BASE_URL}/bookings/${id}`,
//     USER_BOOKINGS: (userId) => `${API_BASE_URL}/bookings/user/${userId}`,
//     CREATE: `${API_BASE_URL}/bookings`,
//     UPDATE: (id) => `${API_BASE_URL}/bookings/${id}`,
//     DELETE: (id) => `${API_BASE_URL}/bookings/${id}`,
//     WEDDING: `${API_BASE_URL}/bookings/wedding`,
//     PUBERTY: `${API_BASE_URL}/bookings/puberty`,
//     BIRTHDAY: `${API_BASE_URL}/bookings/birthday`
//   },

//   // Packages
//   PACKAGES: {
//     ALL: `${API_BASE_URL}/PackageOperation`,
//     SINGLE: (id) => `${API_BASE_URL}/PackageOperation/${id}`,
//     CREATE: `${API_BASE_URL}/PackageOperation`,
//     UPDATE: (id) => `${API_BASE_URL}/PackageOperation/${id}`,
//     DELETE: (id) => `${API_BASE_URL}/PackageOperation/${id}`,
//     GET_ALL: `${API_BASE_URL}/PackageOperation`,
//     GET_BY_ID: (id) => `${API_BASE_URL}/PackageOperation/${id}`
//   },

//   // Promotions
//   PROMOTIONS: {
//     ALL: `${API_BASE_URL}/promotions`,
//     SINGLE: (id) => `${API_BASE_URL}/promotions/${id}`,
//     CREATE: `${API_BASE_URL}/promotions`,
//     UPDATE: (id) => `${API_BASE_URL}/promotions/${id}`,
//     DELETE: (id) => `${API_BASE_URL}/promotions/${id}`,
//     ACTIVE: `${API_BASE_URL}/promotions/active`,
//     GET_ALL: `${API_BASE_URL}/promotions`,
//     GET_ACTIVE: `${API_BASE_URL}/promotions/active`
//   },

//   // Products
//   PRODUCTS: {
//     ALL: `${API_BASE_URL}/ProductOperation`,
//     SINGLE: (id) => `${API_BASE_URL}/ProductOperation/${id}`,
//     CREATE: `${API_BASE_URL}/ProductOperation`,
//     UPDATE: (id) => `${API_BASE_URL}/ProductOperation/${id}`,
//     DELETE: (id) => `${API_BASE_URL}/ProductOperation/${id}`,
//     GET_ALL: `${API_BASE_URL}/ProductOperation`,
//     GET_BY_ID: (id) => `${API_BASE_URL}/ProductOperation/${id}`
//   },
  
//   // Gallery
//   GALLERY: {
//     UPLOAD: `${API_BASE_URL}/gallery/upload`,
//     ALL: `${API_BASE_URL}/gallery`,
//     SINGLE: (id) => `${API_BASE_URL}/gallery/${id}`,
//     DELETE: (id) => `${API_BASE_URL}/gallery/${id}`,
//     BY_CATEGORY: (category) => `${API_BASE_URL}/gallery/category/${category}`
//   },
  
//   // Events
//   EVENTS: {
//     ALL: `${API_BASE_URL}/events`,
//     SINGLE: (id) => `${API_BASE_URL}/events/${id}`,
//     CREATE: `${API_BASE_URL}/events`,
//     UPDATE: (id) => `${API_BASE_URL}/events/${id}`,
//     DELETE: (id) => `${API_BASE_URL}/events/${id}`,
//     FEATURED: `${API_BASE_URL}/events/featured`
//   },

//   // Expenses
//   EXPENSES: {
//     ALL: `${API_BASE_URL}/expenses`,
//     SINGLE: (id) => `${API_BASE_URL}/expenses/${id}`,
//     CREATE: `${API_BASE_URL}/expenses`,
//     UPDATE: (id) => `${API_BASE_URL}/expenses/${id}`,
//     DELETE: (id) => `${API_BASE_URL}/expenses/${id}`,
//     SUMMARY: `${API_BASE_URL}/expenses/summary`,
//     BY_CATEGORY: `${API_BASE_URL}/expenses/by-category`,
//     BY_DATE_RANGE: `${API_BASE_URL}/expenses/by-date-range`
//   }
// };

// // Common API functions
// export const api = {
//   get: async (url, options = {}) => {
//     const response = await fetch(url, {
//       method: 'GET',
//       headers: getHeaders(options.headers),
//       credentials: 'include',
//       ...options
//     });
    
//     const data = await response.json();
    
//     if (!response.ok) {
//       const error = new Error(data.message || 'API request failed');
//       error.status = response.status;
//       error.data = data;
//       throw error;
//     }
    
//     return data;
//   },

//   post: async (url, data, options = {}) => {
//     const isFormData = data instanceof FormData;
//     const headers = isFormData 
//       ? { ...options.headers, 'Authorization': `Bearer ${getAuthToken()}` }
//       : getHeaders(options.headers);

//     const response = await fetch(url, {
//       method: 'POST',
//       headers,
//       credentials: 'include',
//       body: isFormData ? data : JSON.stringify(data),
//       ...options
//     });

//     const responseData = await response.json().catch(() => ({}));
    
//     if (!response.ok) {
//       const error = new Error(responseData.message || 'API request failed');
//       error.status = response.status;
//       error.data = responseData;
//       throw error;
//     }
    
//     return responseData;
//   },

//   put: async (url, data, options = {}) => {
//     const response = await fetch(url, {
//       method: 'PUT',
//       headers: getHeaders(options.headers),
//       body: JSON.stringify(data),
//       ...options
//     });

//     const responseData = await response.json();
    
//     if (!response.ok) {
//       const error = new Error(responseData.message || 'Update failed');
//       error.status = response.status;
//       error.data = responseData;
//       throw error;
//     }
    
//     return responseData;
//   },

//   delete: async (url, options = {}) => {
//     const response = await fetch(url, {
//       method: 'DELETE',
//       headers: getHeaders(options.headers),
//       ...options
//     });

//     if (!response.ok) {
//       const errorData = await response.json().catch(() => ({}));
//       const error = new Error(errorData.message || 'Delete failed');
//       error.status = response.status;
//       error.data = errorData;
//       throw error;
//     }
    
//     return response.json().catch(() => ({}));
//   }
// };

// // Axios-like instance for components that might need it
// export const axiosInstance = {
//   get: (url, config = {}) => api.get(url, config),
//   post: (url, data, config = {}) => api.post(url, data, config),
//   put: (url, data, config = {}) => api.put(url, data, config),
//   delete: (url, config = {}) => api.delete(url, config)
// };
// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ;

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem("authToken") || localStorage.getItem("token");
};

/**
 * Build headers safely:
 * - Don't set Content-Type for GET/DELETE (avoids unnecessary preflight)
 * - Don't set Content-Type for FormData (browser adds correct boundary)
 */
const buildHeaders = ({ method = "GET", customHeaders = {}, isFormData = false } = {}) => {
  const token = getAuthToken();

  const headers = {
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...customHeaders,
  };

  // Only set JSON content type when sending JSON body
  const m = method.toUpperCase();
  const hasBody = !["GET", "HEAD", "DELETE"].includes(m);

  if (hasBody && !isFormData) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

// Safe JSON parse helper
const safeJson = async (response) => {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
};

// API Endpoints (keep yours; unchanged)
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/UserOperations/login`,
    REGISTER: `${API_BASE_URL}/UserOperations/register`,
    LOGOUT: `${API_BASE_URL}/UserOperations/logout`,
    REFRESH: `${API_BASE_URL}/UserOperations/refresh-token`,
  },

  BANNERS: {
    CURRENT: `${API_BASE_URL}/BannersOperations/current`,
    UPLOAD: `${API_BASE_URL}/Banner`,
    ALL: `${API_BASE_URL}/Banner`,
    SINGLE: (id) => `${API_BASE_URL}/Banner/${id}`,
    ACTIVE: `${API_BASE_URL}/Banner/active`,
  },
  

  BANNERS_UI: {
    CURRENT: `${API_BASE_URL}/BannersUI/current1`,
    UPLOAD: `${API_BASE_URL}/BannersUI/upload1`,
  },

  USERS: {
    ALL: `${API_BASE_URL}/UserOperations/getAllUsers`,
    UPDATE: (userId) => `${API_BASE_URL}/UserOperations/update/${userId}`,
    DELETE: (userId) => `${API_BASE_URL}/UserOperations/deleteUser/${userId}`,
    PROFILE: `${API_BASE_URL}/UserOperations/profile`,
    UPDATE_PROFILE: `${API_BASE_URL}/UserOperations/update-profile`,
  },

  BOOKINGS: {
    ALL: `${API_BASE_URL}/bookings`,
    SINGLE: (id) => `${API_BASE_URL}/bookings/${id}`,
    USER_BOOKINGS: (userId) => `${API_BASE_URL}/bookings/user/${userId}`,
    CREATE: `${API_BASE_URL}/bookings`,
    UPDATE: (id) => `${API_BASE_URL}/bookings/${id}`,
    DELETE: (id) => `${API_BASE_URL}/bookings/${id}`,
    WEDDING: `${API_BASE_URL}/bookings/wedding`,
    PUBERTY: `${API_BASE_URL}/bookings/puberty`,
    BIRTHDAY: `${API_BASE_URL}/bookings/birthday`,
  },

  PACKAGES: {
    ALL: `${API_BASE_URL}/PackageOperation`,
    SINGLE: (id) => `${API_BASE_URL}/PackageOperation/${id}`,
    CREATE: `${API_BASE_URL}/PackageOperation`,
    UPDATE: (id) => `${API_BASE_URL}/PackageOperation/${id}`,
    DELETE: (id) => `${API_BASE_URL}/PackageOperation/${id}`,
    GET_ALL: `${API_BASE_URL}/PackageOperation`,
    GET_BY_ID: (id) => `${API_BASE_URL}/PackageOperation/${id}`,
  },

  PROMOTIONS: {
    ALL: `${API_BASE_URL}/promotions`,
    SINGLE: (id) => `${API_BASE_URL}/promotions/${id}`,
    CREATE: `${API_BASE_URL}/promotions`,
    UPDATE: (id) => `${API_BASE_URL}/promotions/${id}`,
    DELETE: (id) => `${API_BASE_URL}/promotions/${id}`,
    ACTIVE: `${API_BASE_URL}/promotions/active`,
    GET_ALL: `${API_BASE_URL}/promotions`,
    GET_ACTIVE: `${API_BASE_URL}/promotions/active`,
  },

  PRODUCTS: {
    ALL: `${API_BASE_URL}/ProductOperation`,
    SINGLE: (id) => `${API_BASE_URL}/ProductOperation/${id}`,
    CREATE: `${API_BASE_URL}/ProductOperation`,
    UPDATE: (id) => `${API_BASE_URL}/ProductOperation/${id}`,
    DELETE: (id) => `${API_BASE_URL}/ProductOperation/${id}`,
    GET_ALL: `${API_BASE_URL}/ProductOperation`,
    GET_BY_ID: (id) => `${API_BASE_URL}/ProductOperation/${id}`,
  },

  GALLERY: {
    UPLOAD: `${API_BASE_URL}/gallery/upload`,
    ALL: `${API_BASE_URL}/gallery`,
    SINGLE: (id) => `${API_BASE_URL}/gallery/${id}`,
    DELETE: (id) => `${API_BASE_URL}/gallery/${id}`,
    BY_CATEGORY: (category) => `${API_BASE_URL}/gallery/category/${category}`,
  },

  EVENTS: {
    ALL: `${API_BASE_URL}/events`,
    SINGLE: (id) => `${API_BASE_URL}/events/${id}`,
    CREATE: `${API_BASE_URL}/events`,
    UPDATE: (id) => `${API_BASE_URL}/events/${id}`,
    DELETE: (id) => `${API_BASE_URL}/events/${id}`,
    FEATURED: `${API_BASE_URL}/events/featured`,
  },

  EXPENSES: {
    ALL: `${API_BASE_URL}/expenses`,
    SINGLE: (id) => `${API_BASE_URL}/expenses/${id}`,
    CREATE: `${API_BASE_URL}/expenses`,
    UPDATE: (id) => `${API_BASE_URL}/expenses/${id}`,
    DELETE: (id) => `${API_BASE_URL}/expenses/${id}`,
    SUMMARY: `${API_BASE_URL}/expenses/summary`,
    BY_CATEGORY: `${API_BASE_URL}/expenses/by-category`,
    BY_DATE_RANGE: `${API_BASE_URL}/expenses/by-date-range`,
  },
};

// Common API functions
export const api = {
  get: async (url, options = {}) => {
    const response = await fetch(url, {
      method: "GET",
      headers: buildHeaders({ method: "GET", customHeaders: options.headers }),
      credentials: "include",
      ...options,
    });

    const data = await safeJson(response);

    if (!response.ok) {
      const error = new Error(data.message || "API request failed");
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  },

  post: async (url, payload, options = {}) => {
    const isFormData = payload instanceof FormData;

    const response = await fetch(url, {
      method: "POST",
      headers: buildHeaders({
        method: "POST",
        customHeaders: options.headers,
        isFormData,
      }),
      credentials: "include",
      body: isFormData ? payload : JSON.stringify(payload),
      ...options,
    });

    const data = await safeJson(response);

    if (!response.ok) {
      const error = new Error(data.message || "API request failed");
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  },

  put: async (url, payload, options = {}) => {
    const response = await fetch(url, {
      method: "PUT",
      headers: buildHeaders({ method: "PUT", customHeaders: options.headers }),
      credentials: "include",
      body: JSON.stringify(payload),
      ...options,
    });

    const data = await safeJson(response);

    if (!response.ok) {
      const error = new Error(data.message || "Update failed");
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  },

  delete: async (url, options = {}) => {
    const response = await fetch(url, {
      method: "DELETE",
      headers: buildHeaders({ method: "DELETE", customHeaders: options.headers }),
      credentials: "include",
      ...options,
    });

    const data = await safeJson(response);

    if (!response.ok) {
      const error = new Error(data.message || "Delete failed");
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  },
};

// Axios-like instance
export const axiosInstance = {
  get: (url, config = {}) => api.get(url, config),
  post: (url, data, config = {}) => api.post(url, data, config),
  put: (url, data, config = {}) => api.put(url, data, config),
  delete: (url, config = {}) => api.delete(url, config),
};
