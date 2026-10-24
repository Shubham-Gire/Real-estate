import { ApiError, ApiResponse } from '../types/api';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

export class ApiClient {
  private static getToken(): string | null {
    return localStorage.getItem('estatehub_token');
  }

  public static async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;
    const token = this.getToken();

    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    if (token && !headers['Authorization']) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Special handling for 204 No Content
      if (response.status === 204) {
        return {} as T;
      }

      const json = await response.json();

      if (!response.ok) {
        const error: ApiError = {
          status: response.status,
          code: json.code || 'UNKNOWN_ERROR',
          message: json.message || 'Request failed',
          fieldErrors: json.fieldErrors,
          path: json.path,
        };
        throw error;
      }

      // Check if wrapped in standard ApiResponse { success, message, data }
      if (json && typeof json === 'object' && 'data' in json && 'success' in json) {
        return json.data as T;
      }

      return json as T;
    } catch (err: any) {
      if (err.status && err.message) {
        throw err;
      }
      throw {
        status: 0,
        code: 'NETWORK_ERROR',
        message: err.message || 'Unable to connect to EstateHub API server.',
      } as ApiError;
    }
  }

  public static get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    let url = endpoint;
    if (params) {
      const query = new URLSearchParams();
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          if (Array.isArray(val)) {
            val.forEach(item => query.append(key, item));
          } else {
            query.append(key, String(val));
          }
        }
      });
      const queryString = query.toString();
      if (queryString) {
        url += (url.includes('?') ? '&' : '?') + queryString;
      }
    }
    return this.request<T>(url, { method: 'GET' });
  }

  public static post<T>(endpoint: string, data?: any): Promise<T> {
    const isFormData = data instanceof FormData;
    return this.request<T>(endpoint, {
      method: 'POST',
      body: isFormData ? data : JSON.stringify(data),
    });
  }

  public static put<T>(endpoint: string, data?: any): Promise<T> {
    const isFormData = data instanceof FormData;
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: isFormData ? data : JSON.stringify(data),
    });
  }

  public static patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  public static delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}
