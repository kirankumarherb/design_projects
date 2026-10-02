import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

interface NavItem {
  label: string;
  route: string;
  iconDefault: string;
  iconActive: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink],
  styles: [`
    :host {
      display: flex;
      align-self: stretch;
    }
  `],
  template: `
    <div
      [class]="collapsed()
        ? 'bg-[#007044] border-r border-[#163E35] flex flex-col gap-8 items-start p-3 self-stretch shrink-0 w-[76px] transition-all duration-200'
        : 'bg-[#007044] border-r border-[#163E35] flex flex-col gap-8 items-start p-6 self-stretch shrink-0 w-[312px] transition-all duration-200'"
    >
      <div [class]="collapsed() ? 'flex flex-col gap-3 items-center w-full' : 'flex gap-3 items-center w-full'">
        <button
          type="button"
          (click)="toggleCollapsed()"
          [attr.aria-label]="collapsed() ? 'Expand navigation' : 'Collapse navigation'"
          class="flex items-center justify-center rounded-lg size-8 shrink-0 cursor-pointer text-white hover:bg-[#163E35] transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
        </button>
        <div class="bg-white flex items-center justify-center rounded-lg size-8 shrink-0">
          <img alt="Herbalife" class="block size-[18px]" src="/assets/herbalife-symbol.svg" />
        </div>
        @if (!collapsed()) {
          <div class="flex flex-col gap-0.5 items-start">
            <p class="font-bold text-white text-base leading-normal">Herbalife</p>
            <p class="font-medium text-[#F9F8F4] text-[11px] leading-normal uppercase">Lookup & Value Set Management System</p>
          </div>
        }
      </div>

      <nav class="flex flex-1 flex-col gap-1 items-start w-full">
        @for (item of navItems; track item.route) {
          <button
            [routerLink]="'/' + item.route"
            [attr.title]="collapsed() ? item.label : null"
            [class]="isActive(item.route)
              ? 'flex gap-3 items-center px-3 py-2.5 rounded-lg w-full text-left transition-colors cursor-pointer bg-[#163E35]' + (collapsed() ? ' justify-center' : '')
              : 'flex gap-3 items-center px-3 py-2.5 rounded-lg w-full text-left transition-colors cursor-pointer hover:bg-[#163E35]/50' + (collapsed() ? ' justify-center' : '')"
          >
            <img
              alt=""
              [class]="'block size-[18px] shrink-0' + (isActive(item.route) ? '' : ' brightness-0 invert')"
              [src]="isActive(item.route) ? item.iconActive : item.iconDefault"
            />
            @if (!collapsed()) {
              <span [class]="isActive(item.route) ? 'flex-1 text-sm leading-normal font-semibold text-white' : 'flex-1 text-sm leading-normal font-medium text-[#F9F8F4]'">
                {{ item.label }}
              </span>
            }
          </button>
        }
      </nav>
      
    </div>
  `,
})
export class SidebarComponent {
  private router = inject(Router);

  collapsed = signal(false);

  navItems: NavItem[] = [
    { label: 'Dashboard', route: 'dashboard', iconDefault: '/assets/dashboard-default.svg', iconActive: '/assets/dashboard-active.svg' },
    { label: 'Lookup Types', route: 'lookup-types', iconDefault: '/assets/lookup-types-default.svg', iconActive: '/assets/lookup-types-active.svg' },
    { label: 'Value Sets', route: 'value-sets', iconDefault: '/assets/value-sets-default.svg', iconActive: '/assets/value-sets-active.svg' },
    { label: 'Translations', route: 'translations', iconDefault: '/assets/translations-default.svg', iconActive: '/assets/translations-active.svg' },
    { label: 'Role Control Policies', route: 'roles-control', iconDefault: '/assets/e4e18.svg', iconActive: '/assets/6d2c5.svg' },
    { label: 'Audit Log', route: 'audit-log', iconDefault: '/assets/audit-log-default.svg', iconActive: '/assets/audit-log-active.svg' },
  ];

  toggleCollapsed(): void {
    this.collapsed.update((value) => !value);
  }

  isActive(route: string): boolean {
    return this.router.isActive('/' + route, {
      paths: 'subset',
      queryParams: 'ignored',
      fragment: 'ignored',
      matrixParams: 'ignored',
    });
  }
}
