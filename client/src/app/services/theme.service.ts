import { Injectable } from '@angular/core';
import { EventEmitter } from 'events';
import { BehaviorSubject } from 'rxjs';

export enum Theme {
  DARK_THEME = 'dark-theme',
  LIGHT_THEME = '',
}

@Injectable()
export class ThemeService {
  private _currentTheme: Theme = localStorage.getItem('theme') || Theme.LIGHT_THEME;
  public readonly onChangeTheme = new BehaviorSubject<Theme>(this._currentTheme);

  public get currentTheme(): Theme {
    return this._currentTheme;
  }

  public toggleTheme(): void {
    this._currentTheme =
      this._currentTheme === Theme.LIGHT_THEME
        ? Theme.DARK_THEME
        : Theme.LIGHT_THEME;
    this.onChangeTheme.next(this._currentTheme);
    localStorage.setItem('theme', this._currentTheme);
  }
}
