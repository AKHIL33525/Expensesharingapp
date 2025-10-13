// Frontend api.ts - Ensure this configuration is used in your React frontend

const API_BASE_URL = 'http://localhost:8080';

// Auth API calls
export const authAPI = {
  register: async (userData: { username: string; email: string; password: string }) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important for session cookies
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  login: async (credentials: { username: string; password: string }) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important for session cookies
      body: JSON.stringify(credentials),
    });
    return response.json();
  },

  getCurrentUser: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important for session cookies
    });
    return response.json();
  },

  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Important for session cookies
    });
    return response.json();
  },
};

// Example usage in your React components:
/*
// Login component
const handleLogin = async (credentials) => {
  try {
    const result = await authAPI.login(credentials);
    if (result.success) {
      console.log('Login successful:', result.data);
      // Handle successful login
    } else {
      console.error('Login failed:', result.message);
      // Handle login error
    }
  } catch (error) {
    console.error('Network error:', error);
  }
};

// Check current user (e.g., in App.js useEffect)
const checkCurrentUser = async () => {
  try {
    const result = await authAPI.getCurrentUser();
    if (result.success) {
      console.log('Current user:', result.data);
      // Set user state
    } else {
      console.log('User not authenticated');
      // Handle unauthenticated state
    }
  } catch (error) {
    console.error('Error checking user:', error);
  }
};
*/