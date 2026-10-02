import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../components/sidebar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent],
  template: `
    <div class="flex h-full w-full bg-[#F9F8F4] overflow-hidden">
      <app-sidebar />
      <div class="flex flex-1 flex-col min-w-0 overflow-auto">
        <router-outlet />
      </div>
    </div>
  `,
})
export class AppLayoutComponent {}
