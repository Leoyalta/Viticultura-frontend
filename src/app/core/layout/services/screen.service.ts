import { Injectable, computed, signal } from '@angular/core';
import {
  BreakpointObserver,
  Breakpoints,
  BreakpointState,
} from '@angular/cdk/layout';

type BreakpointSize =
  | 'XSmall'
  | 'Small'
  | 'Medium'
  | 'Large'
  | 'XLarge'
  | 'Unknown';

@Injectable({
  providedIn: 'root',
})
export class ScreenService {
  private readonly _breakpoint = signal<BreakpointSize>('Unknown');

  // === Signals ===
  readonly currentBreakpoint = computed(() => this._breakpoint());

  readonly isMobile = computed(() =>
    ['XSmall', 'Small'].includes(this._breakpoint())
  );

  readonly isTablet = computed(() => this._breakpoint() === 'Medium');

  readonly isDesktop = computed(() =>
    ['Large', 'XLarge'].includes(this._breakpoint())
  );

  readonly isSmallScreen = computed(() =>
    ['XSmall', 'Small', 'Medium'].includes(this._breakpoint())
  );

  readonly drawerMode = computed<'over' | 'side'>(() =>
    this.isSmallScreen() ? 'over' : 'side'
  );

  constructor(private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
        Breakpoints.Medium,
        Breakpoints.Large,
        Breakpoints.XLarge,
      ])
      .subscribe((state: BreakpointState) => {
        const bp = state.breakpoints;

        if (bp[Breakpoints.XSmall]) this._breakpoint.set('XSmall');
        else if (bp[Breakpoints.Small]) this._breakpoint.set('Small');
        else if (bp[Breakpoints.Medium]) this._breakpoint.set('Medium');
        else if (bp[Breakpoints.Large]) this._breakpoint.set('Large');
        else if (bp[Breakpoints.XLarge]) this._breakpoint.set('XLarge');
        else this._breakpoint.set('Unknown');
      });
  }
}
