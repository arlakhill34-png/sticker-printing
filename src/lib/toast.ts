import { toast, type ToastOptions } from "sonner";

export function showSuccessToast(message: string, options?: ToastOptions) {
  return toast.success(message, {
    duration: 2500,
    position: "top-right",
    ...options,
  });
}

export function showErrorToast(message: string, options?: ToastOptions) {
  return toast.error(message, {
    duration: 4000,
    position: "top-right",
    ...options,
  });
}

export function showInfoToast(message: string, options?: ToastOptions) {
  return toast.info(message, {
    duration: 3500,
    position: "top-right",
    ...options,
  });
}
