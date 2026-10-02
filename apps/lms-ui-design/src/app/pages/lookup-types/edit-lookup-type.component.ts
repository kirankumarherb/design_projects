import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppHeaderComponent, Breadcrumb } from '../../components/app-header.component';
import { LOOKUP_EXTRA_FIELDS, LookupFieldDef, LookupValue, emptyLookupAttrs, newLookupValue, setLookupAttr } from './lookup-value-fields';

@Component({
  selector: 'app-edit-lookup-type',
  standalone: true,
  imports: [AppHeaderComponent],
  template: `
    <app-header [breadcrumbs]="breadcrumbs" [title]="'Edit: ' + typeCode" />

    <div class="flex flex-col gap-6 p-8 w-full">

      <!-- Last-modified banner -->
      <div class="bg-[#F9F8F4] border border-[#E7E4DB] flex items-center justify-between px-5 py-3 rounded-xl w-full">
        <div class="flex items-center gap-3">
          <div class="size-2 rounded-full bg-[#007044]"></div>
          <p class="font-normal text-[#837976] text-[13px]">
            Last modified <span class="font-semibold text-[#101921]">Oct 23, 2024</span> by
            <span class="font-semibold text-[#101921]">Emily Watson</span>
          </p>
        </div>
        <div class="flex items-center gap-2">
          <div class="bg-[#F9F8F4] flex items-center gap-1.5 px-2.5 py-1 rounded-full">
            <div class="size-1.5 rounded-full bg-[#007044]"></div>
            <p class="font-semibold text-[#007044] text-[11px]">Active</p>
          </div>
          <p class="font-normal text-[#837976] text-[11px]">v12 · Access: User</p>
        </div>
      </div>

      <!-- Top row: Definition + Configuration -->
      <div class="flex gap-6 items-start w-full">

        <!-- Lookup Type Definition -->
        <div class="bg-white border border-[#E7E4DB] flex flex-col gap-5 p-6 rounded-xl flex-1 min-w-0">
          <div class="flex flex-col gap-1">
            <div class="flex items-center gap-2">
              <div class="size-2 rounded-full bg-[#007044]"></div>
              <p class="font-bold text-[#101921] text-base leading-normal">Lookup Type Definition</p>
            </div>
            <p class="text-xs text-[#837976] font-normal pl-4">Core identifier and metadata for this lookup type.</p>
          </div>

          <div class="border-t border-[#E7E4DB]"></div>

          <div class="flex flex-col gap-4">
            <!-- Type Code (read-only) + Meaning -->
            <div class="flex gap-4">
              <div class="flex flex-col gap-1.5 flex-1 min-w-0">
                <div class="flex items-center gap-1.5">
                  <p class="font-semibold text-[#837976] text-[13px]">Type Code</p>
                  <span class="bg-[#F9F8F4] border border-[#E7E4DB] px-2 py-0.5 rounded text-[10px] font-semibold text-[#309C46]">READ-ONLY</span>
                </div>
                <div class="border border-[#E7E4DB] bg-[#F9F8F4] rounded-lg px-3 py-2.5 flex items-center gap-2">
                  <img src="/assets/63366.svg" class="block size-3.5 opacity-50" alt="" />
                  <p class="font-bold text-[#007044] text-[13px] tracking-wide">{{ typeCode }}</p>
                </div>
                <p class="text-[11px] text-[#309C46] font-normal">Type code cannot be changed after creation</p>
              </div>
              <div class="flex flex-col gap-1.5 flex-1 min-w-0">
                <div class="flex items-center gap-1">
                  <p class="font-semibold text-[#837976] text-[13px]">Meaning</p>
                  <span class="text-red-400 text-[11px]">*</span>
                </div>
                <input
                  type="text"
                  [value]="meaning"
                  (input)="meaning = $any($event.target).value"
                  class="border border-[#E7E4DB] rounded-lg px-3 py-2.5 text-[13px] text-[#101921] font-normal bg-white outline-none focus:border-[#007044] focus:ring-2 focus:ring-[#007044]/10 w-full transition-colors"
                />
              </div>
            </div>

            <!-- Description -->
            <div class="flex flex-col gap-1.5">
              <p class="font-semibold text-[#837976] text-[13px]">Description</p>
              <textarea
                rows="3"
                class="border border-[#E7E4DB] rounded-lg px-3 py-2.5 text-[13px] text-[#101921] font-normal bg-white outline-none focus:border-[#007044] focus:ring-2 focus:ring-[#007044]/10 w-full resize-none transition-colors"
              >Active tax tiers mapped across international regions for financial reporting and compliance workflows.</textarea>
            </div>

            <!-- Module + Application -->
            <div class="flex gap-4">
              <div class="flex flex-col gap-1.5 flex-1 min-w-0">
                <p class="font-semibold text-[#837976] text-[13px]">Module</p>
                <div class="relative">
                  <select class="border border-[#E7E4DB] rounded-lg px-3 py-2.5 text-[13px] text-[#101921] font-normal bg-white outline-none focus:border-[#007044] w-full appearance-none cursor-pointer pr-8 transition-colors">
                    <option>Human Resources</option>
                    <option selected>Financials</option>
                    <option>Order Management</option>
                    <option>Supply Chain</option>
                    <option>General Ledger</option>
                  </select>
                  <img src="/assets/21990.svg" class="block size-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" alt="" />
                </div>
              </div>
              <div class="flex flex-col gap-1.5 flex-1 min-w-0">
                <p class="font-semibold text-[#837976] text-[13px]">Application</p>
                <div class="relative">
                  <select class="border border-[#E7E4DB] rounded-lg px-3 py-2.5 text-[13px] text-[#101921] font-normal bg-white outline-none focus:border-[#007044] w-full appearance-none cursor-pointer pr-8 transition-colors">
                    <option>Oracle HRMS</option>
                    <option selected>Oracle Financials</option>
                    <option>Oracle SCM</option>
                    <option>Custom Application</option>
                  </select>
                  <img src="/assets/21990.svg" class="block size-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Configuration -->
        <div class="bg-white border border-[#E7E4DB] flex flex-col gap-5 p-6 rounded-xl w-[300px] shrink-0">
          <div class="flex flex-col gap-1">
            <div class="flex items-center gap-2">
              <div class="size-2 rounded-full bg-[#007044]"></div>
              <p class="font-bold text-[#101921] text-base leading-normal">Configuration</p>
            </div>
            <p class="text-xs text-[#837976] font-normal pl-4">Lifecycle and access settings.</p>
          </div>

          <div class="border-t border-[#E7E4DB]"></div>

          <div class="flex flex-col gap-4">
            
            <!-- Enabled toggle -->
            <div class="flex items-center justify-between gap-3">
              <div class="flex flex-col gap-0.5">
                <p class="font-semibold text-[#101921] text-[13px]">Enabled</p>
                <p class="text-[11px] text-[#837976] font-normal">Active and visible to users</p>
              </div>
              <button
                (click)="enabled = !enabled"
                [class]="enabled ? 'bg-[#007044]' : 'bg-[#DAD5D0]'"
                class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors shrink-0 cursor-pointer"
              >
                <span
                  [class]="enabled ? 'translate-x-6' : 'translate-x-1'"
                  class="inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm"
                ></span>
              </button>
            </div>

            <!-- Start Date -->
            <div class="flex flex-col gap-1.5">
              <div class="flex items-center gap-1">
                <p class="font-semibold text-[#837976] text-[13px]">Start Date Active</p>
                <span class="text-red-400 text-[11px]">*</span>
              </div>
              <input
                type="date"
                [value]="startDate"
                (input)="startDate = $any($event.target).value"
                class="border border-[#E7E4DB] rounded-lg px-3 py-2.5 text-[13px] text-[#101921] font-normal bg-white outline-none focus:border-[#007044] w-full transition-colors"
              />
            </div>

            <!-- End Date -->
            <div class="flex flex-col gap-1.5">
              <p class="font-semibold text-[#837976] text-[13px]">End Date Active</p>
              <input
                type="date"
                class="border border-[#E7E4DB] rounded-lg px-3 py-2.5 text-[13px] text-[#837976] font-normal bg-white outline-none focus:border-[#007044] w-full transition-colors"
              />
              <p class="text-[11px] text-[#309C46] font-normal">Leave blank for no expiry</p>
            </div>

            <!-- Audit info -->
            <div class="border-t border-[#E7E4DB] pt-3 flex flex-col gap-2">
              <p class="font-semibold text-[#837976] text-[11px] uppercase tracking-wide">Audit Info</p>
              <div class="flex flex-col gap-1.5">
                <div class="flex items-center justify-between">
                  <p class="text-[11px] text-[#837976]">Created by</p>
                  <p class="text-[11px] text-[#101921] font-semibold">James Liu</p>
                </div>
                <div class="flex items-center justify-between">
                  <p class="text-[11px] text-[#837976]">Created on</p>
                  <p class="text-[11px] text-[#101921] font-semibold">Jan 1, 2024</p>
                </div>
                <div class="flex items-center justify-between">
                  <p class="text-[11px] text-[#837976]">Version</p>
                  <p class="text-[11px] text-[#101921] font-semibold">v12</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Lookup Values -->
      <div class="bg-white border border-[#E7E4DB] flex flex-col gap-5 p-6 rounded-xl w-full">
        <div class="flex items-center justify-between w-full">
          <div class="flex flex-col gap-1">
            <div class="flex items-center gap-2">
              <div class="size-2 rounded-full bg-[#007044]"></div>
              <p class="font-bold text-[#101921] text-base leading-normal">Lookup Values</p>
            </div>
            <p class="text-xs text-[#837976] font-normal pl-4">{{ values.length }} value{{ values.length === 1 ? "" : "s" }} — edit inline or add new rows.</p>
          </div>
          <button
            (click)="addValue()"
            [disabled]="!canAddValue"
            class="bg-[#007044] flex gap-2 items-center px-4 py-2.5 rounded-lg cursor-pointer hover:bg-[#163E35] transition-colors disabled:bg-[#B3ACA8] disabled:hover:bg-[#B3ACA8] disabled:cursor-not-allowed disabled:opacity-70"
          >
            <img src="/assets/3c14a.svg" class="block size-4" alt="" />
            <p class="font-semibold text-white text-[13px]">Add Value</p>
          </button>
        </div>

        <div class="border-t border-[#E7E4DB] w-full"></div>

        <div class="flex flex-col w-full overflow-x-auto">
          <div class="bg-[#F9F8F4] flex gap-3 items-center px-4 py-3 rounded-t-lg w-full text-[#837976] text-[11px] font-bold min-w-max">
            <p class="w-[160px] shrink-0">VALUE CODE <span class="text-red-400">*</span></p>
            <p class="w-[190px] shrink-0">MEANING <span class="text-red-400">*</span></p>
            <p class="w-[220px] shrink-0">DESCRIPTION</p>
            <p class="w-[80px] shrink-0 text-center">ENABLED</p>
            <p class="w-[130px] shrink-0">START DATE</p>
            <p class="w-[130px] shrink-0">END DATE</p>
            @for (f of extraFields; track f.key) {
              <p [class]="f.width + ' shrink-0'">{{ f.label }}</p>
            }
            <p class="w-[36px] shrink-0"></p>
          </div>
          @for (val of values; let i = $index; track i) {
            <div [class]="'flex gap-3 items-center px-4 py-3 border-t border-[#E7E4DB] min-w-max ' + (i % 2 === 1 ? 'bg-[#FCFBF8]' : 'bg-white')">
              <div class="w-[160px] shrink-0">
                <input
                  type="text"
                  [value]="val.code"
                  (input)="val.code = $any($event.target).value"
                  class="border border-[#E7E4DB] rounded-md px-2.5 py-2 text-[12px] text-[#101921] font-semibold bg-white outline-none focus:border-[#007044] w-full transition-colors uppercase tracking-wide"
                />
              </div>
              <div class="w-[190px] shrink-0">
                <input
                  type="text"
                  [value]="val.meaning"
                  (input)="val.meaning = $any($event.target).value"
                  class="border border-[#E7E4DB] rounded-md px-2.5 py-2 text-[12px] text-[#101921] font-normal bg-white outline-none focus:border-[#007044] w-full transition-colors"
                />
              </div>
              <div class="w-[220px] shrink-0">
                <input
                  type="text"
                  [value]="val.description"
                  class="border border-[#E7E4DB] rounded-md px-2.5 py-2 text-[12px] text-[#101921] font-normal bg-white outline-none focus:border-[#007044] w-full transition-colors"
                />
              </div>
              <div class="w-[80px] shrink-0 flex justify-center">
                <button
                  (click)="val.enabled = !val.enabled"
                  [class]="val.enabled ? 'bg-[#007044]' : 'bg-[#DAD5D0]'"
                  class="relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer"
                >
                  <span
                    [class]="val.enabled ? 'translate-x-4' : 'translate-x-1'"
                    class="inline-block h-3 w-3 transform rounded-full bg-white transition-transform shadow-sm"
                  ></span>
                </button>
              </div>
              <div class="w-[130px] shrink-0">
                <input
                  type="date"
                  [value]="val.startDate"
                  class="border border-[#E7E4DB] rounded-md px-2 py-2 text-[12px] text-[#101921] font-normal bg-white outline-none focus:border-[#007044] w-full transition-colors"
                />
              </div>
              <div class="w-[130px] shrink-0">
                <input
                  type="date"
                  [value]="val.endDate"
                  class="border border-[#E7E4DB] rounded-md px-2 py-2 text-[12px] text-[#837976] font-normal bg-white outline-none focus:border-[#007044] w-full transition-colors"
                />
              </div>
              @for (f of extraFields; track f.key) {
                <div [class]="f.width + ' shrink-0'">
                  <input
                    [type]="f.type"
                    [attr.maxlength]="f.maxLength ?? null"
                    [readOnly]="!!f.readOnly"
                    [tabIndex]="f.readOnly ? -1 : 0"
                    [value]="val.attrs[f.key] ?? ''"
                    (input)="setAttr(val, f, $any($event.target).value)"
                    [class]="'border border-[#E7E4DB] rounded-md px-2.5 py-2 text-[12px] font-normal outline-none w-full transition-colors ' + (f.readOnly ? 'bg-[#F9F8F4] text-[#837976] cursor-not-allowed' : 'bg-white text-[#101921] focus:border-[#007044]')"
                  />
                </div>
              }
              <div class="w-[36px] shrink-0 flex justify-center">
                <button (click)="removeValue(i)" class="hover:opacity-70 transition-opacity cursor-pointer p-1 rounded">
                  <img src="/assets/36ce3.svg" class="block size-4" alt="Remove" />
                </button>
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Action bar -->
      <div class="bg-white border border-[#E7E4DB] flex items-center justify-between px-6 py-4 rounded-xl w-full">
        <p class="font-normal text-[#837976] text-[13px]">
          <span class="text-red-400">*</span> Required fields
        </p>
        <div class="flex gap-3 items-center">
          <button
            (click)="cancel()"
            class="bg-white border border-[#E7E4DB] px-5 py-2.5 rounded-lg font-semibold text-[#837976] text-[13px] hover:bg-[#F9F8F4] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            (click)="save()"
            [disabled]="!canSave"
            class="bg-[#007044] px-5 py-2.5 rounded-lg font-semibold text-white text-[13px] hover:bg-[#163E35] transition-colors cursor-pointer flex items-center gap-2 disabled:bg-[#B3ACA8] disabled:cursor-not-allowed disabled:opacity-70"
          >
            
            Save
          </button>
        </div>
      </div>

    </div>
  `,
})
export class EditLookupTypeComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  typeCode = 'FIN_TAX_CODES';

  breadcrumbs: Breadcrumb[] = [
    { label: 'Herbalife Lookup Management System', green: true },
    { label: 'Lookup Types' },
    { label: this.typeCode },
    { label: 'Edit' },
  ];

  enabled = true;
  meaning = 'Financial Tax Rate Codes';
  startDate = '2024-01-01';

  get canSave(): boolean {
    return this.canAddValue && this.values.every(v => !!v.code.trim() && !!v.meaning.trim());
  }

  get canAddValue(): boolean {
    return !!this.typeCode && !!this.meaning.trim() && !!this.startDate;
  }

  values: LookupValue[] = [
    { code: 'TAX_STANDARD', meaning: 'Standard VAT Rate', description: '15% default corporate tax rate', enabled: true, startDate: '2024-01-01', endDate: '',
      attrs: { ...emptyLookupAttrs(), DISPLAY_SEQUENCE: 10, CREATION_DATE: '2024-01-01', CREATED_BY: 'Emily Watson', LAST_UPDATE_DATE: '2024-10-23', LAST_UPDATED_BY: 'Emily Watson', LAST_UPDATE_LOGIN: 1001 } },
    { code: 'TAX_REDUCED', meaning: 'Reduced VAT Rate', description: '5% micro-enterprise rate', enabled: true, startDate: '2024-01-01', endDate: '',
      attrs: { ...emptyLookupAttrs(), DISPLAY_SEQUENCE: 20, CREATION_DATE: '2024-01-01', CREATED_BY: 'Emily Watson', LAST_UPDATE_DATE: '2024-10-23', LAST_UPDATED_BY: 'Emily Watson', LAST_UPDATE_LOGIN: 1001 } },
  ];

  readonly extraFields = LOOKUP_EXTRA_FIELDS;

  setAttr(val: LookupValue, field: LookupFieldDef, raw: string) {
    setLookupAttr(val, field, raw);
  }

  ngOnInit() {
    const code = this.route.snapshot.paramMap.get('code');
    if (code) {
      this.typeCode = code;
      this.breadcrumbs = [
        { label: 'Herbalife Lookup Management System', green: true },
        { label: 'Lookup Types' },
        { label: this.typeCode },
        { label: 'Edit' },
      ];
    }
  }

  addValue() {
    if (!this.canAddValue) return;
    this.values.push(newLookupValue());
  }

  removeValue(i: number) {
    this.values.splice(i, 1);
  }

  cancel() {
    this.router.navigate(['/lookup-types']);
  }

  save() {
    if (!this.canSave) return;
    this.router.navigate(['/lookup-types']);
  }
}
