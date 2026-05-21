export function vibrate(pattern: number | number[] = 10) {
  if (typeof window !== "undefined" && "vibrate" in navigator) {
    navigator.vibrate(pattern);
  }
}

export const haptics = {
  tap:     () => vibrate(8),
  success: () => vibrate([15, 60, 15]),
  error:   () => vibrate([30, 40, 30]),
  complete: () => vibrate([20, 30, 20, 30, 60]),
};
