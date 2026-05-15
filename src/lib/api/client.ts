export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

export async function apiClient<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.message || response.statusText || "Unknown Error";
      throw new Error(`API Error [${response.status}] at ${url}: ${errorMessage}`);
    }

    return response.json();
  } catch (error: any) {
    if (error.name === 'Error' && error.message.startsWith('API Error')) {
      throw error;
    }
    throw new Error(`Network Error at ${url}: ${error.message}`);
  }
}
