/* eslint-disable @typescript-eslint/no-explicit-any */
import { afterEach, vi } from "vitest";

const activeSpies = new Set<ReturnType<typeof vi.spyOn>>();

afterEach(() => {
  for (const spy of activeSpies) {
    spy.mockRestore();
  }
  activeSpies.clear();
});

export function vimic<T extends Record<string, any>, TKey extends keyof T>(
  module: T,
  functionName: TKey,
  implementation: T[TKey]
) {
  if (typeof module[functionName] !== "function") {
    throw new Error(
      `${String(functionName)} is not a function in the provided module.`
    );
  }

  const spy = vi
    .spyOn(module, functionName as any)
    .mockImplementation(implementation as T[TKey]);
  activeSpies.add(spy);

  return spy;
}
