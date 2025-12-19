const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text();
    const error = new Error(text || `Request failed with status ${response.status}`) as Error & {
      status?: number;
    };
    error.status = response.status;
    throw error;
  }
  return response.json() as Promise<T>;
}

export async function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  const url = new URL(path, API_BASE_URL);
  console.log("[apiGet] GET", url.toString());
  const response = await fetch(url.toString(), { signal });
  console.log("[apiGet] Response", response.status, response.statusText);
  return parseResponse<T>(response);
}
