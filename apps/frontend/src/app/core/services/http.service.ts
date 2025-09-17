import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { APP_CONFIG, AppConfig } from '../config/app-config.token';

export interface HttpRequestOptions {
  params?: Record<string, string | number | boolean>;
  headers?: HttpHeaders | Record<string, string>;
}

@Injectable({ providedIn: 'root' })
export class HttpService {
  private readonly config = inject(APP_CONFIG);

  constructor(private readonly http: HttpClient) {}

  get<T>(path: string, options?: HttpRequestOptions) {
    return this.http.get<T>(this.resolveUrl(path), this.mapOptions(options));
  }

  post<T>(path: string, body: unknown, options?: HttpRequestOptions) {
    return this.http.post<T>(this.resolveUrl(path), body, this.mapOptions(options));
  }

  put<T>(path: string, body: unknown, options?: HttpRequestOptions) {
    return this.http.put<T>(this.resolveUrl(path), body, this.mapOptions(options));
  }

  delete<T>(path: string, options?: HttpRequestOptions) {
    return this.http.delete<T>(this.resolveUrl(path), this.mapOptions(options));
  }

  private resolveUrl(path: string): string {
    if (/^https?:\/\//i.test(path)) {
      return path;
    }

    const base = this.config.apiUrl.replace(/\/$/, '');
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${base}${normalizedPath}`;
  }

  private mapOptions(options?: HttpRequestOptions) {
    if (!options) {
      return {};
    }

    const { params, headers } = options;
    const mapped: {
      params?: Record<string, string | number | boolean>;
      headers?: HttpHeaders;
    } = {};

    if (params) {
      const filtered: Record<string, string | number | boolean> = {};
      for (const [key, value] of Object.entries(params)) {
        if (value === undefined || value === null || value === '') {
          continue;
        }
        filtered[key] = value;
      }
      if (Object.keys(filtered).length) {
        mapped.params = filtered;
      }
    }

    if (headers instanceof HttpHeaders) {
      mapped.headers = headers;
    } else if (headers) {
      mapped.headers = new HttpHeaders(headers);
    }

    return mapped;
  }
}
