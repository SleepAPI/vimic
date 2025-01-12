/* eslint-disable @typescript-eslint/no-explicit-any */
import { afterEach, Awaitable, MockInstance, SpyInstance, vi } from 'vitest';
import { UnwrapPromise } from './types/types.js';

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
  ...implementations: Array<(...args: Parameters<T[TKey]>) => Awaitable<UnwrapPromise<ReturnType<T[TKey]>>>>
): MockInstance<Parameters<T[TKey]>, ReturnType<T[TKey]>> {
  if (typeof module[functionName] !== 'function') {
    throw new Error(`${String(functionName)} is not a property of the provided module.`);
  }

  const originalFunction = module[functionName];
  const isAsyncFunction =
    typeof originalFunction === 'function' && originalFunction.constructor.name === 'AsyncFunction';

  const spy = vi.spyOn(module, functionName as any) as unknown as MockInstance<
    Parameters<T[TKey]>,
    ReturnType<T[TKey]>
  >;

  const wrapIfNeeded = (
    impl: (...args: Parameters<T[TKey]>) => Awaitable<UnwrapPromise<ReturnType<T[TKey]>>>
  ): ((...args: Parameters<T[TKey]>) => ReturnType<T[TKey]>) => {
    if (!isAsyncFunction) {
      return impl as (...args: Parameters<T[TKey]>) => ReturnType<T[TKey]>;
    }

    return (...args: Parameters<T[TKey]>): ReturnType<T[TKey]> => {
      const result = impl(...args);
      return result instanceof Promise
        ? (result as ReturnType<T[TKey]>)
        : (Promise.resolve(result) as ReturnType<T[TKey]>);
    };
  };

  if (implementations.length === 0) {
    spy.mockImplementation(() => undefined as ReturnType<T[TKey]>);
  } else if (implementations.length === 1) {
    spy.mockImplementation(wrapIfNeeded(implementations[0]));
  } else {
    implementations.forEach((impl) => {
      spy.mockImplementationOnce(wrapIfNeeded(impl));
    });
  }

  activeSpies.add(spy);
  return spy;
}
