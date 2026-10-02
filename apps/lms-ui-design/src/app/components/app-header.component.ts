import { Component, Input } from '@angular/core';

export interface Breadcrumb {
  label: string;
  green?: boolean;
}

@Component({
  selector: 'app-header',
  standalone: true,
  template: `
    <div class="bg-white border-b border-[#E7E4DB] flex items-center justify-between px-8 py-4 shrink-0 w-full">
      <div class="flex flex-col gap-1 items-start">
        <div class="flex font-normal gap-1.5 items-center text-xs">
          @for (crumb of breadcrumbs; track crumb.label; let i = $index) {
            <span class="flex gap-1.5 items-center">
              @if (i > 0) { <span class="text-[#309C46]">/</span> }
              <span [class]="crumb.green ? 'text-[#309C46]' : 'text-[#837976]'">{{ crumb.label }}</span>
            </span>
          }
        </div>
        <p class="font-bold text-[#101921] text-xl leading-normal">{{ title }}</p>
      </div>

      <div class="flex gap-4 items-center">
        <div class="bg-[#F9F8F4] flex gap-2 items-center px-3 py-2 rounded-lg w-60">
          <img alt="" class="block size-4 shrink-0" src="/assets/af928.svg" />
          <p class="font-normal text-[#309C46] text-[13px] leading-normal whitespace-nowrap">Search types, value sets...</p>
        </div>

        <div class="flex gap-3 items-center">
          <!--div class="overflow-clip rounded-[18px] size-9">
            <img alt="" class="object-cover size-full" src="/assets/e0dd3.png" />
          </div-->
          <div class="flex flex-col gap-0.5 items-start">
            <p class="font-semibold text-[#101921] text-[13px] leading-normal">Robert Chen</p>
            <p class="font-normal text-[#837976] text-[11px] leading-normal">System Administrator</p>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class AppHeaderComponent {
  @Input() breadcrumbs: Breadcrumb[] = [];
  @Input() title = '';
}
