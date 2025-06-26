import { Injectable, signal, effect } from '@angular/core';
import { Theme } from '../../models/themeModel';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  constructor() {}
  private readonly themes: Theme[] = [
    {
      id: 'green',
      primary: '#ecf6de',
      displayName: 'Green',
    },
    {
      id: 'dark',
      primary: '#4b1e4f',
      displayName: 'Dark',
    },
  ];
  currentTheme = signal<Theme>(this.themes[0]);
  getThemes(): Theme[] {
    return this.themes;
  }
  setTheme(themeId: string): void {
    const theme = this.themes.find((t) => t.id === themeId);
    if (theme) {
      this.currentTheme.set(theme);
    }
  }
  updeteThemeClass = effect(() => {
    const theme = this.currentTheme();
    document.body.classList.remove(...this.themes.map((t) => `${t.id}-theme`));
    document.body.classList.add(`${theme.id}-theme`);
  });
}
