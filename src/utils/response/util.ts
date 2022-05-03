export function success(status: number, message: string, data?: unknown) {
  return {
    status,
    success: true,
    message,
    data,
  };
}
