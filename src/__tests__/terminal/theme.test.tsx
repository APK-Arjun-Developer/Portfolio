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

  it('restores a saved light theme when the system is dark', () => {
    setPrefersDark(true);
    localStorage.setItem('theme', 'light');
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

  it('draws and resizes the rope, then stops scheduling frames once it settles', () => {
    const context = {
      setTransform: vi.fn(),
      clearRect: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      save: vi.fn(),
      translate: vi.fn(),
      stroke: vi.fn(),
      restore: vi.fn(),
      setLineDash: vi.fn(),
      rotate: vi.fn(),
      fillRect: vi.fn(),
      createRadialGradient: vi.fn(() => ({ addColorStop: vi.fn() })),
      bezierCurveTo: vi.fn(),
      fill: vi.fn(),
    };
    const canvas = vi
      .spyOn(HTMLCanvasElement.prototype, 'getContext')
      .mockReturnValue(context as unknown as CanvasRenderingContext2D);
    const viewport = vi.spyOn(window, 'innerWidth', 'get');
    const originalPixelRatio = Object.getOwnPropertyDescriptor(window, 'devicePixelRatio')!;
    vi.useFakeTimers({ toFake: ['requestAnimationFrame', 'cancelAnimationFrame'] });
    try {
      viewport.mockReturnValue(500);
      const { unmount } = render(<PullCord />);
      expect(context.lineTo).toHaveBeenCalled();
      expect(context.fill).toHaveBeenCalled();
      viewport.mockReturnValue(1200);
      Object.defineProperty(window, 'devicePixelRatio', { configurable: true, value: 0 });
      fireEvent.resize(window);
      expect(context.setTransform).toHaveBeenCalledTimes(2);
      expect(context.setTransform).toHaveBeenLastCalledWith(1, 0, 0, 1, 0, 0);

      // Bringing the tip to the ceiling anchor must keep the rope coordinates finite.
      fireEvent.pointerDown(cord(), { clientX: 1120, clientY: 0 });
      fireEvent.pointerMove(cord(), { clientX: 1120, clientY: -70 });
      act(() => vi.advanceTimersToNextFrame());
      expect(cord().style.transform).toMatch(/^translate\(-?[\d.]+px, -?[\d.]+px\)$/);
      fireEvent.pointerUp(cord());
      fireEvent.click(cord());
      expect(cord()).toHaveAttribute('aria-checked', 'false');

      fireEvent.click(cord());
      expect(cord()).toHaveAttribute('aria-checked', 'true');
      act(() => {
        for (let frame = 0; frame < 600 && vi.getTimerCount(); frame += 1) {
          vi.advanceTimersToNextFrame();
        }
      });
      expect(vi.getTimerCount()).toBe(0);
      unmount();
    } finally {
      vi.useRealTimers();
      Object.defineProperty(window, 'devicePixelRatio', originalPixelRatio);
      viewport.mockRestore();
      canvas.mockRestore();
    }
  });

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
