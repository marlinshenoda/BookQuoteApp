import { Injectable, signal } from '@angular/core';

const THEME_KEY = 'bookquote_theme';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly isDark = signal(localStorage.getItem(THEME_KEY) === 'dark');

  constructor() {
    this.applyTheme(this.isDark());
  }

  toggle(): void {
    this.setTheme(!this.isDark());
  }

  setTheme(dark: boolean): void {
    this.isDark.set(dark);
    localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
    this.applyTheme(dark);
  }

  private applyTheme(dark: boolean): void {
    document.documentElement.setAttribute('data-bs-theme', dark ? 'dark' : 'light');
  }
}
