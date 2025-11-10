const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Helper function to handle 401 errors
const handleUnauthorized = () => {
  if (typeof window !== "undefined") {
    // Don't redirect if already on login page to avoid infinite loop
    const currentPath = window.location.pathname;
    if (currentPath !== "/login" && currentPath !== "/signup") {
      localStorage.removeItem("token");
      // Redirect to login page
      window.location.href = "/login";
    }
  }
};

// Helper function to check response
const checkResponse = async (response: Response, endpoint: string) => {
  // For auth endpoints (login/register), don't redirect on 401
  const isAuthEndpoint =
    endpoint.startsWith("/auth/login") || endpoint.startsWith("/auth/register");

  if (response.status === 401 && !isAuthEndpoint) {
    handleUnauthorized();
    throw new Error("Unauthorized - Please login again");
  }

  if (!response.ok) {
    // Try to parse error message from backend
    try {
      const errorData = await response.json();
      const errorMessage =
        errorData.message || errorData.error || response.statusText;
      throw new Error(errorMessage);
    } catch (parseError) {
      // If parseError is already our custom Error, re-throw it
      if (
        parseError instanceof Error &&
        parseError.message !== response.statusText
      ) {
        throw parseError;
      }
      // If can't parse JSON, use status text
      throw new Error(`API Error: ${response.statusText}`);
    }
  }

  const jsonResponse = await response.json();
  
  // Unwrap response from backend format: { success, data, timestamp }
  // If response has 'data' property, return it; otherwise return the whole response
  if (jsonResponse && typeof jsonResponse === 'object' && 'data' in jsonResponse) {
    return jsonResponse.data;
  }
  
  return jsonResponse;
};

export const apiClient = {
  async get(endpoint: string) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    return checkResponse(response, endpoint);
  },

  async post(endpoint: string, data: any) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    });

    return checkResponse(response, endpoint);
  },

  async put(endpoint: string, data: any) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api${endpoint}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    });

    return checkResponse(response, endpoint);
  },

  async patch(endpoint: string, data: any) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api${endpoint}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    });

    return checkResponse(response, endpoint);
  },

  async delete(endpoint: string) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_URL}/api${endpoint}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    return checkResponse(response, endpoint);
  },
};
