import { APIRequestContext, request } from '@playwright/test';

/**
 * ApiHelper — wraps Playwright APIRequestContext cho UI ↔ API cross-validation.
 */
export class ApiHelper {
  constructor(private readonly api: APIRequestContext) {}

  static async create(baseURL?: string): Promise<ApiHelper> {
    const ctx = await request.newContext({
      baseURL: baseURL || process.env.API_BASE_URL,
      extraHTTPHeaders: {
        'Content-Type': 'application/json',
      },
    });
    return new ApiHelper(ctx);
  }

  async get<T>(path: string, headers?: Record<string, string>): Promise<T> {
    const res = await this.api.get(path, { headers });
    if (!res.ok()) throw new Error(`GET ${path} failed: ${res.status()}`);
    return res.json() as Promise<T>;
  }

  async post<T>(path: string, body: unknown, headers?: Record<string, string>): Promise<T> {
    const res = await this.api.post(path, { data: body, headers });
    if (!res.ok()) throw new Error(`POST ${path} failed: ${res.status()}`);
    return res.json() as Promise<T>;
  }

  async dispose(): Promise<void> {
    await this.api.dispose();
  }
}
