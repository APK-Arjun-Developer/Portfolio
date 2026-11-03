import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, renderHook, screen, waitFor } from '@testing-library/react';
import PullCord from '../../themes/terminal/components/PullCord';
import { useMode } from '../../themes/terminal/theme';
import { setPrefersDark } from '../setup';

const themeColor = () =>
  document.querySelector('meta[name="theme-color"]')?.getAttribute('content');

const stubReducedMotion = () => {
  const original = window.matchMedia;
  window.matchMedia = vi.fn((query: string) => ({
    ...original(query),
    matches: query.includes('prefers-reduced-motion'),
  })) as unknown as typeof window.matchMedia;
};

describe('useMode (terminal)', () => {
  it('follows the OS colour scheme live until a choice is made', () => {
    const { result } = renderHook(() => useMode());

    expect(result.current.mode).toBe('light');
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(themeColor()).toBe('#e9e5e0');

    act(() => setPrefersDark(true));
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(themeColor()).toBe('#1a1818');
  });

  it('persists an explicit choice and then ignores the OS', () => {
    const { result } = renderHook(() => useMode());

    act(() => result.current.toggle());
    expect(result.current.mode).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');

    act(() => setPrefersDark(false));
    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('ignores unknown stored values', () => {
    localStorage.setItem('theme', 'sepia');
    const { result } = renderHook(() => useMode());
    expect(result.current.mode).toBe('light');
  });

  it('still works when storage is unavailable', () => {
    const getItem = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });

    const { result } = renderHook(() => useMode());
    act(() => result.current.toggle());
    expect(document.documentElement.dataset.theme).toBe('dark');

    getItem.mockRestore();
    setItem.mockRestore();
  });

  describe('view transition', () => {
    const stubTransition = () => {
      const start = vi.fn((update: () => void) => update());
      Object.defineProperty(document, 'startViewTransition', {
        configurable: true,
        value: start,
      });
      return start;
    };
    const removeTransition = () => {
      delete (document as unknown as Record<string, unknown>).startViewTransition;
    };

    it('crossfades the change where the browser supports it', () => {
      const start = stubTransition();
      const { result } = renderHook(() => useMode());

      act(() => result.current.toggle());
      expect(start).toHaveBeenCalledOnce();
      expect(document.documentElement.dataset.theme).toBe('dark');
      removeTransition();
    });

    it('skips the crossfade for reduced motion', () => {
      const start = stubTransition();
      stubReducedMotion();
      const { result } = renderHook(() => useMode());

      act(() => result.current.toggle());
      expect(start).not.toHaveBeenCalled();
      expect(document.documentElement.dataset.theme).toBe('dark');
      removeTransition();
    });
  });
});

describe('PullCord', () => {
  const cord = () => screen.getByRole('switch', { name: /dark mode/i });

  it('toggles on click, which also covers Enter and Space on a button', () => {
    render(<PullCord />);
    expect(cord()).toHaveAttribute('aria-checked', 'false');

    fireEvent.click(cord());
    expect(cord()).toHaveAttribute('aria-checked', 'true');

    fireEvent.click(cord());
    expect(cord()).toHaveAttribute('aria-checked', 'false');
  });

  it('switches once when pulled past the click point, and ignores the closing click', async () => {
    render(<PullCord />);

    fireEvent.pointerDown(cord(), { clientX: 40, clientY: 300 });
    fireEvent.pointerMove(cord(), { clientX: 40, clientY: 900 });
    await waitFor(() => expect(cord()).toHaveAttribute('aria-checked', 'true'));

    // Holding the pull doesn't switch back, and the click that ends the drag is ignored.
    await new Promise((resolve) => setTimeout(resolve, 60));
    fireEvent.pointerUp(cord());
    fireEvent.click(cord());
    expect(cord()).toHaveAttribute('aria-checked', 'true');
  });

  it('lets go if the browser takes the pointer away mid-drag', async () => {
    render(<PullCord />);

    fireEvent.pointerDown(cord(), { clientX: 40, clientY: 100 });
    fireEvent.lostPointerCapture(cord());
    fireEvent.pointerMove(cord(), { clientX: 40, clientY: 900 });
    await new Promise((resolve) => setTimeout(resolve, 60));
    expect(cord()).toHaveAttribute('aria-checked', 'false');
  });

  it('swings without switching on a sideways drag', async () => {
    render(<PullCord />);

    fireEvent.pointerDown(cord(), { clientX: 40, clientY: 100 });
    fireEvent.pointerMove(cord(), { clientX: 120, clientY: 100 });
    await new Promise((resolve) => setTimeout(resolve, 60));
    fireEvent.pointerCancel(cord());
    expect(cord()).toHaveAttribute('aria-checked', 'false');
  });

  it('ignores small movements and movement with no pointer down', () => {
    render(<PullCord />);

    fireEvent.pointerMove(cord(), { clientX: 40, clientY: 900 });
    fireEvent.pointerDown(cord(), { clientX: 40, clientY: 100 });
    fireEvent.pointerMove(cord(), { clientX: 41, clientY: 101 });
    fireEvent.pointerUp(cord());
    expect(cord()).toHaveAttribute('aria-checked', 'false');
  });

  it('skips the swing for reduced motion', () => {
    stubReducedMotion();
    render(<PullCord />);

    fireEvent.click(cord());
    expect(cord()).toHaveAttribute('aria-checked', 'true');
  });
});
