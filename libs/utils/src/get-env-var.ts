export function getEnvVar(name: string): string;
export function getEnvVar(name: string, fallback: string): string;
export function getEnvVar(name: string, fallback: null): string | null;
export function getEnvVar(
  name: string,
  fallback: string | null | undefined = undefined
): string | null {
  const value = process.env[name] || fallback;
  if (value === undefined) {
    throw new Error(`Missing env variable ${name}`);
  }
  return value;
}
