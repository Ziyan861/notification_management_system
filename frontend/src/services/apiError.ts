import { AxiosError } from 'axios';

export function getApiErrorMessage(
  error: unknown,
  fallback = 'Something went wrong. Please try again.',
): string {
  if (error instanceof AxiosError) {
    if (!error.response) {
      return 'Cannot reach the server. Is the backend running?';
    }

    const data = error.response.data as { message?: string | string[] };

    // NestJS returns a string for thrown exceptions and an array of
    // messages when the ValidationPipe rejects a request.
    if (Array.isArray(data?.message)) return data.message.join('. ');
    if (typeof data?.message === 'string') return data.message;
  }

  return fallback;
}