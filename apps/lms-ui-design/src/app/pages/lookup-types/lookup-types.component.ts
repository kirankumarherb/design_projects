import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AppHeaderComponent, Breadcrumb } from '../../components/app-header.component';

interface LookupValueApiDto {
  lookupCode: string;
  meaning: string;
  description?: string;
  enabledFlag: 'Y' | 'N';
  startDateActive?: string;
  endDateActive?: string;
}

interface LookupValueRow {
  value: string;
  meaning: string;
  desc: string;
  enabled: boolean;
  start: string;
  end: string;
}

const MOCK_LOOKUP_VALUES: Record<string, LookupValueApiDto[]> = {
  HR_JOB_BAND: [
    { lookupCode: 'BAND_1', meaning: 'Entry Level', description: 'Individual contributor entry band', enabledFlag: 'Y', startDateActive: '01-01-2024' },
    { lookupCode: 'BAND_2', meaning: 'Mid Level', description: 'Experienced individual contributor', enabledFlag: 'Y', startDateActive: '01-01-2024' },
    { lookupCode: 'BAND_3', meaning: 'Senior Level', description: 'Senior leadership band', enabledFlag: 'N', startDateActive: '01-01-2024', endDateActive: '12-31-2025' },
    { lookupCode: 'BAND_4', meaning: 'Lead Level', description: 'Team lead band', enabledFlag: 'Y', startDateActive: '01-01-2024' },
    { lookupCode: 'BAND_5', meaning: 'Manager Level', description: 'People manager band', enabledFlag: 'Y', startDateActive: '01-01-2024' },
    { lookupCode: 'BAND_6', meaning: 'Director Level', description: 'Director band', enabledFlag: 'Y', startDateActive: '01-01-2024' },
    { lookupCode: 'BAND_7', meaning: 'Executive Level', description: 'Executive leadership band', enabledFlag: 'Y', startDateActive: '01-01-2024' },
  ],
  FIN_TAX_CODES: [
    { lookupCode: 'TAX_STANDARD', meaning: 'Standard VAT Rate', description: '15% default corporate tax rate', enabledFlag: 'Y', startDateActive: '01-01-2024' },
    { lookupCode: 'TAX_REDUCED', meaning: 'Reduced VAT Rate', description: '5% micro-enterprise rate', enabledFlag: 'Y', startDateActive: '01-01-2024' },
  ],
  OM_ORDER_STATUS: [
    { lookupCode: 'BOOKED', meaning: 'Booked', description: 'Order entered and booked', enabledFlag: 'Y', startDateActive: '01-01-2024' },
    { lookupCode: 'SHIPPED', meaning: 'Shipped', description: 'Order shipped to customer', enabledFlag: 'Y', startDateActive: '01-01-2024' },
    { lookupCode: 'CLOSED', meaning: 'Closed', description: 'Order fulfilled and closed', enabledFlag: 'Y', startDateActive: '01-01-2024' },
  ],
};

const MOCK_MODULES = ['Human Resources', 'Financials', 'Order Management', 'Supply Chain', 'General Ledger'];
const MOCK_EXTRA_TYPES = Array.from({ length: 29 }, (_, i) => ({
  code: `LKP_TYPE_${String(i + 1).padStart(2, '0')}`,
  meaning: `Sample Lookup Type ${i + 1}`,
  desc: 'Sample lookup type for listing demonstration',
  module: MOCK_MODULES[i % MOCK_MODULES.length],
  updated: 'Oct 01, 2024',
}));

@Component({
  selector: 'app-lookup-types',
  standalone: true,
  imports: [AppHeaderComponent],
  template: `
    <app-header [breadcrumbs]="breadcrumbs" title="Lookup Types Management" />
    <div class="flex flex-col gap-6 items-start p-8 w-full">
      <div class="flex items-center justify-between w-full">
        <div class="flex gap-3 items-center">
          <div class="bg-white border border-[#E7E4DB] flex gap-2 items-center px-3 py-2 rounded-lg w-[280px]">
            <img alt="" class="block size-4 shrink-0" src="/assets/af928.svg" />
            <p class="font-normal text-[#309C46] text-[13px] leading-normal">Search Type Code or Meaning...</p>
          </div>
          <div class="bg-white border border-[#E7E4DB] flex gap-2 items-center px-3 py-2 rounded-lg">
            <p class="font-normal text-[#837976] text-[13px] leading-normal">Module: <span class="font-semibold">All Modules</span></p>
            <img alt="" class="block size-3.5 shrink-0" src="/assets/21990.svg" />
          </div>
        </div>
        <div class="flex gap-3 items-start">
          
          <button (click)="createLookupType()" class="bg-[#007044] flex gap-2 items-center px-4 py-2.5 rounded-lg cursor-pointer hover:bg-[#163E35] transition-colors">
            <!--img alt="" class="block size-4" src="/assets/3c14a.svg" /-->
            <p class="font-semibold text-white text-[13px] leading-normal">Create Lookup Type</p>
          </button>
        </div>
      </div>

      <div class="bg-white border border-[#E7E4DB] flex flex-col items-start overflow-clip rounded-xl w-full">
        <div class="bg-[#F9F8F4] flex font-bold gap-4 items-center px-6 py-3.5 w-full text-[#837976] text-xs leading-normal">
          <p class="w-[200px] shrink-0">TYPE CODE</p>
          <p class="w-[180px] shrink-0">MEANING</p>
          <p class="flex-1 min-w-0">DESCRIPTION</p>
          <p class="w-[150px] shrink-0">MODULE</p>
          <p class="w-[100px] shrink-0">ENABLED</p>
          <p class="w-[150px] shrink-0">LAST UPDATED</p>
          <p class="w-[100px] shrink-0 text-right">ACTIONS</p>
        </div>

        <div [class]="'flex flex-col items-start w-full' + (isScrollMode ? ' max-h-[1325px] overflow-y-auto' : '')">
          @for (row of visibleRows; track row.code) {
            <div class="flex flex-col items-start border-b border-[#E7E4DB] w-full last:border-b-0">
              <div [class]="'flex gap-4 items-center px-6 py-4 w-full' + (isExpanded(row.code) ? ' bg-[#F9F8F4]' : '')">
                <div class="w-[200px] shrink-0">
                  <button class="flex gap-1.5 items-center cursor-pointer" (click)="toggleExpand(row.code)">
                    <img alt="" [class]="'block size-4 transition-transform' + (isExpanded(row.code) ? '' : ' -rotate-90')" src="/assets/c6ee6.svg" />
                    <p class="font-bold text-[#007044] text-[13px] leading-normal">{{ row.code }}</p>
                  </button>
                </div>
                <p class="font-medium text-[#101921] text-[13px] leading-normal w-[180px] shrink-0">{{ row.meaning }}</p>
                <p class="font-normal text-[#837976] text-[13px] leading-normal flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">{{ row.desc }}</p>
                <p class="font-normal text-[#837976] text-[13px] leading-normal w-[150px] shrink-0">{{ row.module }}</p>
                <div class="w-[100px] shrink-0">
                  <div class="bg-[#F9F8F4] flex items-start px-2 py-1 rounded-md inline-flex">
                    <p class="font-semibold text-[#007044] text-[11px] leading-normal">Yes</p>
                  </div>
                </div>
                <p class="font-normal text-[#309C46] text-[13px] leading-normal w-[150px] shrink-0">{{ row.updated }}</p>
                <div class="flex gap-2 items-start justify-end w-[100px] shrink-0">
                  <img alt="" class="block size-4 cursor-pointer opacity-60 hover:opacity-100" (click)="editLookupType(row.code)" src="/assets/45ef0.svg" />
                  <img alt="" class="block size-4 cursor-pointer opacity-60 hover:opacity-100" src="/assets/36ce3.svg" />
                </div>
              </div>

              @if (isExpanded(row.code)) {
                <div class="bg-[#F9F8F4] flex flex-col gap-3 items-start pb-5 pl-14 pr-6 pt-4 w-full">
                  <div class="flex gap-2 items-center">
                    <img alt="" class="block size-3.5" src="/assets/f7b84.svg" />
                    <p class="font-bold text-[#007044] text-xs leading-normal uppercase">Lookup Values for: {{ row.code }}</p>
                  </div>
                  <div class="bg-white border border-[#E7E4DB] flex flex-col items-start overflow-clip rounded-lg w-full">
                    <div class="bg-[#F9F8F4] flex font-bold gap-4 items-start px-4 py-2.5 w-full text-[#837976] text-[11px] leading-normal">
                      <p class="w-[150px] shrink-0">LOOKUP VALUE</p>
                      <p class="w-[180px] shrink-0">MEANING</p>
                      <p class="flex-1 min-w-0">DESCRIPTION</p>
                      <p class="w-[100px] shrink-0">ENABLED</p>
                      <p class="w-[100px] shrink-0">START DATE</p>
                      <p class="w-[100px] shrink-0">END DATE</p>
                    </div>
                    @if (isLoading(row.code)) {
                      <p class="px-4 py-3 text-xs text-[#837976]">Loading lookup values...</p>
                    } @else if (valuesFor(row.code).length === 0) {
                      <p class="px-4 py-3 text-xs text-[#837976]">No lookup values found.</p>
                    }
                    <div class="flex flex-col w-full max-h-[205px] overflow-y-auto">
                    @for (sr of valuesFor(row.code); track sr.value; let last = $last) {
                      <div [class]="'flex gap-4 items-start px-4 py-2.5 w-full min-h-[41px]' + (!last ? ' border-b border-[#E7E4DB]' : '')">
                        <p class="font-semibold text-[#101921] text-xs leading-normal w-[150px] shrink-0">{{ sr.value }}</p>
                        <p class="font-normal text-[#101921] text-xs leading-normal w-[180px] shrink-0">{{ sr.meaning }}</p>
                        <p class="font-normal text-[#837976] text-xs leading-normal flex-1 min-w-0">{{ sr.desc }}</p>
                        <div class="w-[100px] shrink-0">
                          <div class="bg-[#F9F8F4] inline-flex items-start px-2 py-1 rounded-md">
                            <p [class]="'font-semibold text-[11px] leading-normal ' + (sr.enabled ? 'text-[#007044]' : 'text-[#837976]')">{{ sr.enabled ? 'Yes' : 'No' }}</p>
                          </div>
                        </div>
                        <p class="font-normal text-[#837976] text-xs leading-normal w-[100px] shrink-0">{{ sr.start || '—' }}</p>
                        <p class="font-normal text-[#309C46] text-xs leading-normal w-[100px] shrink-0">{{ sr.end || '—' }}</p>
                      </div>
                    }
                    </div>
                  </div>
                </div>
              }
            </div>
          }
        </div>

        <div class="bg-[#F9F8F4] flex items-center justify-between p-6 w-full border-t border-[#E7E4DB]">
          <p class="font-normal text-[#837976] text-[13px] leading-normal">Showing 1-{{ visibleRows.length }} of {{ rows.length }} lookup types</p>
          <div class="flex gap-2 items-center">
            @if (canShowMore) {
              <button (click)="showMore()" class="bg-white border border-[#E7E4DB] flex gap-1.5 items-center px-3 py-2 rounded-md cursor-pointer hover:bg-[#E7E4DB] transition-colors">
                <img alt="" class="block size-3.5" src="/assets/c6ee6.svg" />
                <p class="font-semibold text-[#837976] text-xs leading-normal">{{ nextStepLabel }}</p>
              </button>
            }
            @if (visibleCount > pageStep * 2) {
              <button (click)="showLess()" class="bg-white border border-[#E7E4DB] flex gap-1.5 items-center px-3 py-2 rounded-md cursor-pointer hover:bg-[#E7E4DB] transition-colors">
                <img alt="" class="block size-3.5 rotate-180" src="/assets/c6ee6.svg" />
                <p class="font-semibold text-[#837976] text-xs leading-normal">Show less</p>
              </button>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class LookupTypesComponent {
  private router = inject(Router);

  private cdr = inject(ChangeDetectorRef);

  breadcrumbs: Breadcrumb[] = [{ label: 'Herbalife Lookup Management System', green: true }, { label: 'Lookup Types' }];

  private expanded = new Set<string>();
  private loading = new Set<string>();
  private loadedValues = new Map<string, LookupValueRow[]>();

  rows = [
    { code: 'HR_JOB_BAND', meaning: 'HR Job Level Bands', desc: 'Defines senior leadership and individual contributor salary ranges', module: 'Human Resources', updated: 'Oct 24, 2024' },
    { code: 'FIN_TAX_CODES', meaning: 'Financial Tax Rate Codes', desc: 'Active tax tiers mapped across regions', module: 'Financials', updated: 'Oct 23, 2024' },
    { code: 'OM_ORDER_STATUS', meaning: 'Order Status Indicators', desc: 'Tracks lifecycles of fulfillment records', module: 'Order Management', updated: 'Oct 15, 2024' },
    ...MOCK_EXTRA_TYPES,
  ];

  readonly pageStep = 5;
  readonly maxStepped = 20;
  visibleCount = 10;
  private scrollMode = false;

  get isScrollMode(): boolean {
    return this.scrollMode;
  }

  get visibleRows() {
    return this.scrollMode ? this.rows : this.rows.slice(0, this.visibleCount);
  }

  get canShowMore(): boolean {
    return !this.scrollMode && this.rows.length > this.visibleCount;
  }

  get nextStepLabel(): string {
    return this.visibleCount >= this.maxStepped ? 'Show all (scroll)' : `Show ${Math.min(this.visibleCount + this.pageStep, this.rows.length)}`;
  }

  showMore() {
    if (this.visibleCount >= this.maxStepped) {
      this.scrollMode = true;
    } else {
      this.visibleCount = Math.min(this.visibleCount + this.pageStep, this.maxStepped);
    }
  }

  showLess() {
    this.scrollMode = false;
    this.visibleCount = 10;
  }

  isExpanded(code: string) {
    return this.expanded.has(code);
  }

  isLoading(code: string) {
    return this.loading.has(code);
  }

  valuesFor(code: string): LookupValueRow[] {
    return this.loadedValues.get(code) ?? [];
  }

  async toggleExpand(code: string) {
    if (this.expanded.has(code)) {
      this.expanded.delete(code);
      this.loading.delete(code);
      this.loadedValues.delete(code);
      return;
    }

    this.expanded.add(code);
    this.loading.add(code);
    try {
      const response = await this.fetchLookupValues(code);
      if (this.expanded.has(code)) {
        this.loadedValues.set(code, this.mapLookupValues(response));
      }
    } catch (err) {
      console.error(`Failed to load lookup values for ${code}`, err);
      this.loadedValues.set(code, []);
    } finally {
      this.loading.delete(code);
      this.cdr.markForCheck();
    }
  }

  // TODO: Replace with backend REST call, e.g. GET /api/lookup-types/{code}/values
  private async fetchLookupValues(code: string): Promise<LookupValueApiDto[]> {
    console.log(`[placeholder] GET /api/lookup-types/${code}/values`);
    await new Promise(resolve => setTimeout(resolve, 300));
    return MOCK_LOOKUP_VALUES[code] ?? [];
  }

  private mapLookupValues(response: LookupValueApiDto[]): LookupValueRow[] {
    return response.map(v => ({
      value: v.lookupCode,
      meaning: v.meaning,
      desc: v.description ?? '',
      enabled: v.enabledFlag === 'Y',
      start: v.startDateActive ?? '',
      end: v.endDateActive ?? '',
    }));
  }

  createLookupType() {
    this.router.navigate(['/lookup-types/create']);
  }

  editLookupType(code: string) {
    this.router.navigate(['/lookup-types/edit', code]);
  }
}
