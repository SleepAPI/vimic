import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { vimic } from './vimic.js'; // Adjust path as necessary

const mockModule = {
  myFunction: (arg: string) => `Original implementation: ${arg}`
};

describe('vimic', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();

    expect(mockModule.myFunction('Test1')).toBe('Original implementation: Test1');
  });

  it('should mock a single implementation', () => {
    const spy = vimic(mockModule, 'myFunction', (arg: string) => `Mocked with: ${arg}`);

    expect(mockModule.myFunction('Test1')).toBe('Mocked with: Test1');
    expect(spy).toHaveBeenCalledWith('Test1');
    expect(mockModule.myFunction('Test2')).toBe('Mocked with: Test2');
    expect(spy).toHaveBeenCalledWith('Test2');
  });

  it('should mock multiple implementations in sequence', () => {
    const mock1 = (arg: string) => `First call: ${arg}`;
    const mock2 = (arg: string) => `Second call: ${arg}`;
    const mock3 = (arg: string) => `Third call: ${arg}`;

    vimic(mockModule, 'myFunction', mock1, mock2, mock3);

    expect(mockModule.myFunction('Test1')).toBe('First call: Test1');
    expect(mockModule.myFunction('Test2')).toBe('Second call: Test2');
    expect(mockModule.myFunction('Test3')).toBe('Third call: Test3');
    expect(mockModule.myFunction('Test4')).toBe('Original implementation: Test4');
  });

  it('should throw an error if the specified property is not a function', () => {
    const mockModuleWithNonFunction = { notAFunction: 'This is not a function' };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(() => vimic(mockModuleWithNonFunction, 'notAFunction' as any, () => {})).toThrowError(
      'notAFunction is not a function in the provided module.'
    );
  });
});
