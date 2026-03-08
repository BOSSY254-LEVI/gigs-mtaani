const PASSWORD_CHECKS = [
  { label: "At least 8 characters", test: (p: string) => p.length >= 8 },
  { label: "Contains uppercase", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Contains lowercase", test: (p: string) => /[a-z]/.test(p) },
  { label: "Contains number or special", test: (p: string) => /[0-9!@#$%^&*]/.test(p) }
];

export function getPasswordChecks(password: string) {
  return PASSWORD_CHECKS.map(check => ({
    label: check.label,
    pass: check.test(password)
  }));
}

export function getErrorMessage(error: unknown, defaultMessage: string): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  if (error && typeof error === "object" && "response" in error && "data" in (error as any).response) {
    const data = (error as any).response.data;
    if (typeof data === "object" && data !== null && "message" in data) {
      return data.message as string;
    }
  }
  return defaultMessage;
}

export function redactPII(value: string): string {
  if (!value) return "";
  if (value.includes("@")) {
    const [local] = value.split("@");
    return local.substring(0, 2) + "***@***";
  }
  if (value.startsWith("+")) {
    return value.substring(0, 4) + "***" + value.substring(value.length - 2);
  }
  return value.substring(0, 2) + "***" + value.substring(value.length - 2);
}
