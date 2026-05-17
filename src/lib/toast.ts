import { toast as sonnerToast, type ToastOptions } from "sonner";

const DEFAULT_OPTS: ToastOptions = {
  position: "top-right",
};

export function toastSuccess(message: string, options?: ToastOptions) {
  return sonnerToast.success(message, { duration: 2500, ...DEFAULT_OPTS, ...options });
}

export function toastError(message: string, options?: ToastOptions) {
  return sonnerToast.error(message, { duration: 4000, ...DEFAULT_OPTS, ...options });
}

export function toastInfo(message: string, options?: ToastOptions) {
  return sonnerToast.info(message, { duration: 3500, ...DEFAULT_OPTS, ...options });
}

export function toastWarning(message: string, options?: ToastOptions) {
  return sonnerToast.warning(message, { duration: 3500, ...DEFAULT_OPTS, ...options });
}

export function toastPromise<T>(
  promise: Promise<T>,
  msgs: { loading: string; success: string; error: string },
  options?: ToastOptions,
) {
  return sonnerToast.promise(promise, {
    loading: msgs.loading,
    success: msgs.success,
    error: (err) => {
      const msg = err instanceof Error ? err.message : String(err);
      return msg || msgs.error;
    },
    ...DEFAULT_OPTS,
    ...options,
  });
}

export function getApiErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "response" in err) {
    const e = err as { response?: { data?: { message?: string } } };
    return e.response?.data?.message || "Something went wrong";
  }
  if (err instanceof Error) {
    return err.message;
  }
  return "Something went wrong";
}
