import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AppHeaderComponent, Breadcrumb } from '../../components/app-header.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AppHeaderComponent],
  template: `
    <app-header [breadcrumbs]="breadcrumbs" title="Overview Dashboard" />
    <div class="flex flex-col gap-8 items-start p-8 w-full">
      <div class="flex gap-6 items-start w-full">
        @for (card of statCards; track card.label) {
          <div class="bg-white border border-[#E7E4DB] flex flex-1 flex-col gap-4 items-start p-6 rounded-xl">
            <div class="flex items-center justify-between w-full">
              <p class="font-semibold text-[#837976] text-[13px] leading-normal uppercase">{{ card.label }}</p>
              <div [class]="card.iconBg + ' flex items-center justify-center rounded-lg size-10'">
                <img alt="" class="block size-5" [src]="card.icon" />
              </div>
            </div>
            <div class="flex flex-col gap-1 items-start w-full">
              <p class="font-bold text-[#101921] text-[32px] leading-normal">{{ card.value }}</p>
              <p class="font-normal text-[#309C46] text-xs leading-normal">{{ card.sub }}</p>
            </div>
          </div>
        }
      </div>

      <div class="flex gap-6 items-start w-full">
        <div class="bg-white border border-[#E7E4DB] flex flex-1 flex-col gap-5 items-start p-6 rounded-xl">
          <div class="flex items-center justify-between w-full">
            <p class="font-bold text-[#101921] text-base leading-normal">Recently Modified Lookups</p>
            <button (click)="viewAll()" class="font-semibold text-[#007044] text-[13px] leading-normal cursor-pointer hover:underline">View all</button>
          </div>
          <div class="flex flex-col gap-3 items-start w-full">
            @for (item of recentItems; track item.code) {
              <div class="bg-[#F9F8F4] border border-[#E7E4DB] flex gap-4 items-center p-4 rounded-lg w-full">
                <div class="bg-white border border-[#E7E4DB] flex items-center justify-center rounded-lg size-10 shrink-0">
                  <img alt="" class="block size-[18px]" src="/assets/edd2e.svg" />
                </div>
                <div class="flex flex-1 flex-col gap-1 items-start min-w-0">
                  <div class="flex gap-2 items-center">
                    <p class="font-bold text-[#101921] text-sm leading-normal">{{ item.code }}</p>
                    <p class="font-normal text-[#837976] text-xs leading-normal">— {{ item.desc }}</p>
                  </div>
                  <div class="flex gap-3 items-center">
                    <p class="font-normal text-[#309C46] text-xs leading-normal">{{ item.module }}</p>
                    <div class="size-1 rounded-full bg-[#309C46]"></div>
                    <p class="font-normal text-[#309C46] text-xs leading-normal">Updated by {{ item.by }}</p>
                  </div>
                </div>
                <p class="font-medium text-[#837976] text-xs leading-normal whitespace-nowrap">{{ item.time }}</p>
              </div>
            }
          </div>
        </div>

        <div class="bg-white border border-[#E7E4DB] flex flex-col gap-5 items-start p-6 rounded-xl w-[450px] self-stretch shrink-0">
          <p class="font-bold text-[#101921] text-base leading-normal">System Audit Log Activity</p>
          <div class="flex flex-col gap-5 items-start w-full">
            @for (act of auditItems; track act.title; let last = $last) {
              <div class="flex gap-4 items-start w-full">
                <div class="flex flex-col gap-1 items-center shrink-0">
                  <div class="bg-[#F9F8F4] flex items-center justify-center rounded-[14px] size-7">
                    <img alt="" class="block size-3.5" src="/assets/687f3.svg" />
                  </div>
                  @if (!last) { <div class="w-px h-10 bg-[#E7E4DB]"></div> }
                </div>
                <div class="flex flex-1 flex-col gap-1 items-start min-w-0">
                  <div class="flex items-start justify-between w-full">
                    <p class="font-bold text-[#101921] text-[13px] leading-normal">{{ act.title }}</p>
                    <p class="font-normal text-[#309C46] text-xs leading-normal whitespace-nowrap">{{ act.time }}</p>
                  </div>
                  <p class="font-normal text-[#837976] text-xs leading-[1.4]">{{ act.desc }}</p>
                  <p class="font-medium text-[#309C46] text-[11px] leading-normal">{{ act.by }}</p>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class DashboardComponent {
  private router = inject(Router);

  breadcrumbs: Breadcrumb[] = [{ label: 'Herbalife Lookup Management System', green: true }];

  statCards = [
    { label: 'TOTAL LOOKUP TYPES', value: '24', sub: '+3 created this month', icon: '/assets/e9f93.svg', iconBg: 'bg-[#F9F8F4]' },
    { label: 'TOTAL VALUE SETS', value: '18', sub: '+1 modified last 24h', icon: '/assets/c575b.svg', iconBg: 'bg-[#F9F8F4]' },
  ];

  recentItems = [
    { code: 'HR_JOB_BAND', desc: 'HR Job Level Bands', module: 'Human Resources', by: 'Robert Chen', time: '10 mins ago' },
    { code: 'FIN_TAX_CODES', desc: 'Financial Tax Rate Codes', module: 'Financials', by: 'Emily Watson', time: '2 hours ago' },
    { code: 'OM_ORDER_STATUS', desc: 'Order Status Indicators', module: 'Order Management', by: 'System Automation', time: 'Yesterday' },
    { code: 'SCM_SHIPPING_MODE', desc: 'Shipping Carrier Methods', module: 'Supply Chain', by: 'Robert Chen', time: '2 days ago' },
  ];

  auditItems = [
    { title: 'Value Added', time: '10 mins ago', desc: "Added value 'SENIOR_MGR' to HR_JOB_BAND value set.", by: 'By Robert Chen' },
    { title: 'Translation Updated', time: '45 mins ago', desc: "Added Spanish translation for 'FIN_TAX_CODES' (Impuesto).", by: 'By Sophia Miller' },
    { title: 'Permissions Granted', time: '3 hours ago', desc: 'Assigned LOOKUP_ADMIN role to user Emily Watson.', by: 'By Security Audit' },
    { title: 'Value Set Altered', time: 'Yesterday', desc: "Modified maximum length constraint for 'GL_ACCOUNT_CODES'.", by: 'By System Process' },
  ];

  viewAll() {
    this.router.navigate(['/lookup-types']);
  }
}
