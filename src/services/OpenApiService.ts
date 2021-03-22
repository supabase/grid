import { Dictionary } from '../types';

class OpenApiService {
  constructor(protected supabaseUrl: string, protected supabaseKey: string) {}

  async fetchDescription(): Promise<{
    data: Dictionary<any> | null;
    error: Error | null;
  }> {
    const res = await fetch(`${this.supabaseUrl}/rest/v1/`, {
      headers: {
        apikey: this.supabaseKey,
      },
    });
    if (!res.ok) {
      return {
        data: null,
        error: new Error('Failed to get openAPI description'),
      };
    }

    const data = await res.json();
    return { data, error: null };
  }
}
export default OpenApiService;
