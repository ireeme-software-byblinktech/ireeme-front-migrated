// Remove any trailing /api/v1 and any trailing slashes to prevent double-prefixing
export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001")
  .replace(/\/api\/v1\/?$/, '')
  .replace(/\/+$/, '');

// Get auth token from storage (your colleague will implement this)
const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("accessToken");
};

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = getAuthToken();
  
  console.log("[API CLIENT] Request:", { endpoint, hasToken: !!token });

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options?.headers,
    },
  });

  console.log("[API CLIENT] Response status:", response.status, "for endpoint:", endpoint);

  // Handle 401 Unauthorized - redirect to login
  if (response.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    }
    throw new Error("Session expired. Please login again.");
  }

  if (!response.ok) {
    let error: any;
    try {
      const text = await response.text();
      error = text ? JSON.parse(text) : {};
    } catch (e) {
      error = {};
    }
    
    const errorMessage = error?.message || error?.error || response.statusText;
    console.error("[API CLIENT] Error response:", { 
      status: response.status, 
      endpoint,
      error,
      errorMessage 
    });
    
    throw new Error(errorMessage || `API Error: ${response.status}`);
  }

  if (response.status === 204 || response.headers.get("content-length") === "0") {
    console.log("[API CLIENT] No content response for:", endpoint);
    return undefined as T;
  }

  const data = await response.json();
  console.log("[API CLIENT] Response data for", endpoint, ":", data);
  return data;
}

// Upload file to Cloudinary
export async function uploadToCloudinary(file: File): Promise<string> {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Cloudinary configuration missing");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to upload image");
  }

  const data = await response.json();
  return data.secure_url;
}
