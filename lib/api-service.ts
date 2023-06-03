export class ApiService {
  static async fetcher<JSON = any>(input: RequestInfo, init?: RequestInit): Promise<JSON> {
    const res = await fetch(input, init);

    if (!res.ok) {
      const json = await res.json();
      if (json.error) {
        const error = new Error(json.error) as Error & { status: number };
        error.status = res.status;
        throw error;
      } else {
        throw new Error("An unexpected error occurred");
      }
    }

    return res.json();
  }

  static get<T = any>(input: RequestInfo): Promise<T> {
    return this.fetcher(input);
  }

  static async post<T = any>(input: RequestInfo, body: Record<string, any>): Promise<T> {
    return this.fetcher(input, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  }

  static async put(input: RequestInfo, body: Record<string, any>) {
    return this.fetcher(input, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  }

  static async patch(input: RequestInfo, body: Record<string, any>) {
    return this.fetcher(input, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  }

  static async delete(input: RequestInfo) {
    return this.fetcher(input, {
      method: 'DELETE',
    });
  }
}
