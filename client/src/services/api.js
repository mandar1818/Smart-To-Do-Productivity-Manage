const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

async function request(endpoint, options = {}) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  // Bearer token fallback if cookie is unavailable
  const token = localStorage.getItem('auth_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
    credentials: 'include', // Send and receive HTTP-only cookies
  };

  try {
    const response = await fetch(url, config);
    const result = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMsg = result?.message || `Request failed with status ${response.status}`;
      const err = new Error(errorMsg);
      err.status = response.status;
      err.data = result;
      throw err;
    }

    return result;
  } catch (error) {
    // If backend isn't reachable (e.g. offline dev), provide clear message
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      const offlineError = new Error('Backend server is not reachable. Please ensure the API is running on port 5000.');
      offlineError.status = 503;
      throw offlineError;
    }
    throw error;
  }
}

// Authentication API
export const authAPI = {
  register: (name, email, password) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  logout: () =>
    request('/auth/logout', {
      method: 'POST',
    }),

  getCurrentUser: () =>
    request('/auth/me', {
      method: 'GET',
    }),
};

// Task Management API
export const taskAPI = {
  getTasks: (params = {}) => {
    const query = new URLSearchParams();
    if (params.status && params.status !== 'all') query.append('status', params.status);
    if (params.priority && params.priority !== 'all') query.append('priority', params.priority);
    if (params.category && params.category !== 'all') query.append('category', params.category);
    if (params.search) query.append('search', params.search);
    if (params.sortBy) query.append('sortBy', params.sortBy);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    return request(`/tasks${queryString}`, { method: 'GET' });
  },

  createTask: (taskData) =>
    request('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    }),

  getTaskById: (id) =>
    request(`/tasks/${id}`, {
      method: 'GET',
    }),

  updateTask: (id, taskData) =>
    request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    }),

  deleteTask: (id) =>
    request(`/tasks/${id}`, {
      method: 'DELETE',
    }),

  updateTaskStatus: (id, statusData) =>
    request(`/tasks/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(statusData),
    }),
};

// Analytics API
export const analyticsAPI = {
  getOverview: () =>
    request('/analytics/overview', {
      method: 'GET',
    }),

  getWeekly: () =>
    request('/analytics/weekly', {
      method: 'GET',
    }),

  getPriority: () =>
    request('/analytics/priority', {
      method: 'GET',
    }),
};
