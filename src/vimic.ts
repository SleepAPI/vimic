/* eslint-disable @typescript-eslint/no-explicit-any */
import { afterEach, Awaitable, MockInstance, SpyInstance, vi } from 'vitest';

const activeSpies = new Set<SpyInstance<any[], any>>();

afterEach(() => {
  for (const spy of activeSpies) {
    spy.mockRestore();
  }
  activeSpies.clear();
});

export function vimic<T extends Record<string, any>, TKey extends keyof T>(
  module: T,
  functionName: TKey,
  ...implementations: Array<(...args: Parameters<T[TKey]>) => Awaitable<Awaited<ReturnType<T[TKey]>>>>
): MockInstance<Parameters<T[TKey]>, ReturnType<T[TKey]>> {
  if (typeof module[functionName] !== 'function') {
    throw new Error(`${String(functionName)} is not a property of the provided module.`);
  }

  const originalFunction = module[functionName];
  const isAsyncFunction = originalFunction.constructor.name === 'AsyncFunction';

  const spy = vi.spyOn(module, functionName as any) as unknown as MockInstance<
    Parameters<T[TKey]>,
    ReturnType<T[TKey]>
  >;

  if (implementations.length === 0) {
    spy.mockImplementation(() => undefined as Awaited<ReturnType<T[TKey]>>);
  } else if (implementations.length === 1) {
    spy.mockImplementation((...args: Parameters<T[TKey]>) => {
      const result = implementations[0](...args);
      if (isAsyncFunction) {
        return result instanceof Promise ? result : (Promise.resolve(result) as ReturnType<T[TKey]>);
      }
      return result as ReturnType<T[TKey]>;
    });
  } else {
    implementations.forEach((impl) => {
      spy.mockImplementationOnce((...args: Parameters<T[TKey]>) => {
        const result = impl(...args);
        if (isAsyncFunction) {
          return result instanceof Promise ? result : (Promise.resolve(result) as ReturnType<T[TKey]>);
        }
        return result as ReturnType<T[TKey]>;
      });
    });
  }

  activeSpies.add(spy);
  return spy;
}
