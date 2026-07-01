import { create } from "zustand"

export interface ConfirmOptions {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
}

interface ConfirmStore {
  pending: ConfirmOptions | null
  resolve: ((ok: boolean) => void) | null
  open: (opts: ConfirmOptions, resolve: (ok: boolean) => void) => void
  respond: (ok: boolean) => void
}

export const useConfirmStore = create<ConfirmStore>((set, get) => ({
  pending: null,
  resolve: null,
  open: (pending, resolve) => set({ pending, resolve }),
  respond: (ok) => {
    get().resolve?.(ok)
    set({ pending: null, resolve: null })
  },
}))

/**
 * Promise-based confirm. `await confirm({ ... })` resolves true on confirm and
 * false on cancel, so callers read like a native window.confirm without the
 * blocking or the browser chrome.
 */
export function confirm(opts: ConfirmOptions): Promise<boolean> {
  return new Promise((resolve) => useConfirmStore.getState().open(opts, resolve))
}
