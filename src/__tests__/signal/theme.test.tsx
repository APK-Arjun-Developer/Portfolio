import { describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useTheme } from '../../themes/signal/theme';
import { setPrefersDark } from '../setup';

const themeColor = () =>
  document.querySelector('meta[name="theme-color"]')?.getAttribute('content');

describe('useTheme (signal)', () => {
  it('defaults to "system" and follows the OS colour scheme live', () => {
    const { result } = renderHook(() => useTheme());

    expect(result.current.preference).toBe('system');
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(themeColor()).toBe('#fbf7f2');

    act(() => setPrefersDark(true));
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(themeColor()).toBe('#0f1115');
  });

  it('applies and persists an explicit choice, ignoring the OS', () => {
    const { result } = renderHook(() => useTheme());

    act(() => result.current.setPreference('dark'));
    expect(result.current.preference).toBe('dark');
    expect(document.documentElement.dataset.theme).toBe('dark');
    expect(localStorage.getItem('theme')).toBe('dark');

    act(() => setPrefersDark(false));
    expect(document.documentElement.dataset.theme).toBe('dark');
  });

  it('forgets the stored choice when switching back to system', () => {
    localStorage.setItem('theme', 'light');
    const { result } = renderHook(() => useTheme());
    expect(result.current.preference).toBe('light');

    act(() => result.current.setPreference('system'));
    expect(localStorage.getItem('theme')).toBeNull();
  });

  it('ignores unknown stored values', () => {
    localStorage.setItem('theme', 'sepia');
    const { result } = renderHook(() => useTheme());
    expect(result.current.preference).toBe('system');
  });

  it('still works when storage is unavailable', () => {
    const getItem = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    const setItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });

    const { result } = renderHook(() => useTheme());
    expect(result.current.preference).toBe('system');

    act(() => result.current.setPreference('dark'));
    expect(document.documentElement.dataset.theme).toBe('dark');

    getItem.mockRestore();
    setItem.mockRestore();
  });
});
