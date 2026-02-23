import { create } from "zustand";

type ToastType = "success" | "error" | "info";

type ToastState = {
  visible: boolean;
  type: ToastType;
  title: string;
  message?: string;
  show: (input: { type: ToastType; title: string; message?: string }) => void;
  hide: () => void;
};

export const useToastStore = create<ToastState>((set) => ({
  visible: false,
  type: "info",
  title: "",
  message: undefined,
  show: ({ type, title, message }) =>
    set({
      visible: true,
      type,
      title,
      message,
    }),
  hide: () =>
    set({
      visible: false,
    }),
}));

export function useToastActions() {
  const show = useToastStore((state) => state.show);
  const hide = useToastStore((state) => state.hide);
  return { show, hide };
}
