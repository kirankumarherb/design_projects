import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AppHeaderComponent, Breadcrumb } from '../../components/app-header.component';
import { LOOKUP_EXTRA_FIELDS, LookupFieldDef, LookupValue, newLookupValue, setLookupAttr } from './lookup-value-fields';

@Component({
  selector: 'app-create-lookup-type',
  standalone: true,
  imports: [AppHeaderComponent],
  template: `
    <app-header [breadcrumbs]="breadcrumbs" title="Create Lookup Type" />

    <div class="flex flex-col gap-6 p-8 w-full">

      <!-- Top row: Definition + Configuration -->
      <div class="flex gap-6 items-start w-full">

        <!-- Lookup Type Definition -->
        <div class="bg-white border border-[#E7E4DB] flex flex-col gap-5 p-6 rounded-xl flex-1 min-w-0">
          <div class="flex flex-col gap-1">
            <div class="flex items-center gap-2">
              <div class="size-2 rounded-full bg-[#007044]"></div>
              <p class="font-bold text-[#101921] text-base leading-normal">Lookup Type Definition</p>
            </div>
            <p class="text-xs text-[#837976] font-normal pl-4">Define the core identifier and metadata for this lookup type.</p>
          </div>

          <div class="border-t border-[#E7E4DB]"></div>

          <div class="flex flex-col gap-4">
            <!-- Type Code + Meaning -->
            <div class="flex gap-4">
              <div class="flex flex-col gap-1.5 flex-1 min-w-0">
                <div class="flex items-center gap-1">
                  <p class="font-semibold text-[#837976] text-[13px]">Type Code</p>
                  <span class="text-red-400 text-[11px]">*</span>
                </div>
                <input
                  type="text"
                  [value]="typeCode"
                  (input)="typeCode = $any($event.target).value"
                  placeholder="e.g. MY_LOOKUP_CODE"
                  class="border border-[#E7E4DB] rounded-lg px-3 py-2.5 text-[13px] text-[#101921] font-semibold bg-white outline-none focus:border-[#007044] focus:ring-2 focus:ring-[#007044]/10 w-full transition-colors placeholder:text-[#B3ACA8] uppercase tracking-wide"
                />
                <p class="text-[11px] text-[#309C46] font-normal">Uppercase letters, numbers, and underscores only</p>
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
                  placeholder="Human-readable name"
                  class="border border-[#E7E4DB] rounded-lg px-3 py-2.5 text-[13px] text-[#101921] font-normal bg-white outline-none focus:border-[#007044] focus:ring-2 focus:ring-[#007044]/10 w-full transition-colors placeholder:text-[#B3ACA8]"
                />
              </div>
            </div>

            <!-- Description -->
            <div class="flex flex-col gap-1.5">
              <p class="font-semibold text-[#837976] text-[13px]">Description</p>
              <textarea
                rows="3"
                placeholder="Describe the purpose and usage of this lookup type..."
                class="border border-[#E7E4DB] rounded-lg px-3 py-2.5 text-[13px] text-[#101921] font-normal bg-white outline-none focus:border-[#007044] focus:ring-2 focus:ring-[#007044]/10 w-full resize-none transition-colors placeholder:text-[#B3ACA8]"
              ></textarea>
            </div>

            <!-- Module + Application -->
            <div class="flex gap-4">
              <div class="flex flex-col gap-1.5 flex-1 min-w-0">
                <div class="flex items-center gap-1">
                  <p class="font-semibold text-[#837976] text-[13px]">Module</p>
                  <span class="text-red-400 text-[11px]">*</span>
                </div>
                <div class="relative">
                  <select
                    [value]="module"
                    (change)="onModuleChange($any($event.target).value)"
                    class="border border-[#E7E4DB] rounded-lg px-3 py-2.5 text-[13px] text-[#837976] font-normal bg-white outline-none focus:border-[#007044] w-full appearance-none cursor-pointer pr-8 transition-colors"
                  >
                    <option value="">Select module...</option>
                    @for (m of moduleOptions; track m) {
                      <option [value]="m">{{ m }}</option>
                    }
                  </select>
                  <img src="/assets/21990.svg" class="block size-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" alt="" />
                </div>
              </div>
              <div class="flex flex-col gap-1.5 flex-1 min-w-0">
                <p class="font-semibold text-[#837976] text-[13px]">Application</p>
                <div class="relative">
                  <select
                    [value]="application"
                    [disabled]="!module"
                    (change)="application = $any($event.target).value"
                    class="border border-[#E7E4DB] rounded-lg px-3 py-2.5 text-[13px] text-[#837976] font-normal bg-white outline-none focus:border-[#007044] w-full appearance-none cursor-pointer pr-8 transition-colors disabled:bg-[#F9F8F4] disabled:cursor-not-allowed"
                  >
                    <option value="">{{ module ? 'Select application...' : 'Select module first...' }}</option>
                    @for (a of applicationOptions; track a) {
                      <option [value]="a">{{ a }}</option>
                    }
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
            <p class="text-xs text-[#837976] font-normal pl-4">
              {{ values.length === 0 ? "No values yet — add at least one to make this type usable." : values.length + " value" + (values.length === 1 ? "" : "s") + " defined" }}
            </p>
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

        @if (values.length === 0) {
          <div class="flex flex-col items-center gap-4 py-14">
            <div class="bg-[#F9F8F4] flex items-center justify-center rounded-2xl size-16 border border-[#E7E4DB]">
              <img src="/assets/f7b84.svg" class="block size-7" alt="" />
            </div>
            <div class="flex flex-col items-center gap-1 text-center">
              <p class="font-semibold text-[#101921] text-sm">No lookup values defined</p>
              <p class="font-normal text-[#837976] text-xs max-w-[320px] leading-relaxed">
                Click "Add Value" above to define the valid values for this lookup type. At least one value is recommended before activating.
              </p>
            </div>
            <button
              (click)="addValue()"
              [disabled]="!canAddValue"
              class="bg-white border border-[#E7E4DB] flex gap-2 items-center px-4 py-2.5 rounded-lg cursor-pointer hover:bg-[#F9F8F4] transition-colors mt-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
            >
              <img src="/assets/3c14a.svg" class="block size-3.5 opacity-60" alt="" />
              <p class="font-semibold text-[#837976] text-[13px]">Add first value</p>
            </button>
          </div>
        } @else {
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
            @for (val of values; track $index; let i = $index) {
              <div [class]="'flex gap-3 items-center px-4 py-3 border-t border-[#E7E4DB] min-w-max ' + (i % 2 === 1 ? 'bg-[#FCFBF8]' : 'bg-white')">
                <div class="w-[160px] shrink-0">
                  <input
                    type="text"
                    [value]="val.code"
                    (input)="val.code = $any($event.target).value"
                    placeholder="VAL_CODE"
                    class="border border-[#E7E4DB] rounded-md px-2.5 py-2 text-[12px] text-[#101921] font-semibold bg-white outline-none focus:border-[#007044] w-full transition-colors placeholder:text-[#B3ACA8] uppercase tracking-wide"
                  />
                </div>
                <div class="w-[190px] shrink-0">
                  <input
                    type="text"
                    [value]="val.meaning"
                    (input)="val.meaning = $any($event.target).value"
                    placeholder="Value meaning"
                    class="border border-[#E7E4DB] rounded-md px-2.5 py-2 text-[12px] text-[#101921] font-normal bg-white outline-none focus:border-[#007044] w-full transition-colors placeholder:text-[#B3ACA8]"
                  />
                </div>
                <div class="w-[220px] shrink-0">
                  <input
                    type="text"
                    placeholder="Optional description"
                    class="border border-[#E7E4DB] rounded-md px-2.5 py-2 text-[12px] text-[#101921] font-normal bg-white outline-none focus:border-[#007044] w-full transition-colors placeholder:text-[#B3ACA8]"
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
                    class="border border-[#E7E4DB] rounded-md px-2 py-2 text-[12px] text-[#101921] font-normal bg-white outline-none focus:border-[#007044] w-full transition-colors"
                  />
                </div>
                <div class="w-[130px] shrink-0">
                  <input
                    type="date"
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
        }
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
export class CreateLookupTypeComponent {
  private router = inject(Router);

  breadcrumbs: Breadcrumb[] = [
    { label: 'Herbalife Lookup Management System', green: true },
    { label: 'Lookup Types' },
    { label: 'Create Lookup Type' },
  ];

  enabled = true;

  module = '';
  typeCode = '';
  meaning = '';
  startDate = '2024-01-01';

  get canSave(): boolean {
    return this.canAddValue && this.values.every(v => !!v.code.trim() && !!v.meaning.trim());
  }

  get canAddValue(): boolean {
    return !!this.typeCode.trim() && !!this.meaning.trim() && !!this.module && !!this.startDate;
  }
  application = '';

  private readonly applicationsByModule: Record<string, string[]> = {
    'Human Resources': ['Oracle HRMS', 'Custom Application'],
    'Financials': ['Oracle Financials', 'Custom Application'],
    'Order Management': ['Oracle SCM', 'Custom Application'],
    'Supply Chain': ['Oracle SCM', 'Custom Application'],
    'General Ledger': ['Oracle Financials', 'Custom Application'],
  };

  readonly moduleOptions = Object.keys(this.applicationsByModule);

  get applicationOptions(): string[] {
    return this.module ? this.applicationsByModule[this.module] ?? [] : [];
  }

  onModuleChange(value: string) {
    this.module = value;
    this.application = '';
  }

  values: LookupValue[] = [];

  readonly extraFields = LOOKUP_EXTRA_FIELDS;

  setAttr(val: LookupValue, field: LookupFieldDef, raw: string) {
    setLookupAttr(val, field, raw);
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
    this.router.navigate
  }
}
