import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppHeaderComponent, Breadcrumb } from '../../components/app-header.component';

interface ValueSetValue {
  value: string;
  meaning: string;
  description: string;
  parentValue: string;
  enabled: boolean;
  startDate: string;
  endDate: string;
}

@Component({
  selector: 'app-create-value-set',
  standalone: true,
  imports: [AppHeaderComponent],
  template: `
    <app-header [breadcrumbs]="breadcrumbs" [title]="pageTitle" />

    <div class="flex flex-col gap-6 p-8 w-full">

      <!-- Row 1: Definition + Validation Type -->
      <div class="flex gap-6 items-start w-full">

        <!-- Value Set Definition -->
        <div class="bg-white border border-[#E7E4DB] flex flex-col gap-5 p-6 rounded-xl flex-1 min-w-0">
          <div class="flex flex-col gap-1">
            <div class="flex items-center gap-2">
              <div class="size-2 rounded-full bg-[#007044]"></div>
              <p class="font-bold text-[#101921] text-base leading-normal">Value Set Definition</p>
            </div>
            <p class="text-xs text-[#837976] font-normal pl-4">Define the unique identifier and metadata for this value set.</p>
          </div>

          <div class="border-t border-[#E7E4DB]"></div>

          <div class="flex flex-col gap-4">
            <!-- Code + Name -->
            <div class="flex gap-4">
              <div class="flex flex-col gap-1.5 flex-1 min-w-0">
                <div class="flex items-center gap-1">
                  <p class="font-semibold text-[#837976] text-[13px]">Value Set Code</p>
                  <span class="text-red-400 text-[11px]">*</span>
                </div>
                <input
                  type="text"
                  [value]="valueSetCode"
                  (input)="valueSetCode = $any($event.target).value"
                  placeholder="e.g. MY_VALUE_SET"
                  class="border border-[#E7E4DB] rounded-lg px-3 py-2.5 text-[13px] text-[#101921] font-semibold bg-white outline-none focus:border-[#007044] focus:ring-2 focus:ring-[#007044]/10 w-full transition-colors placeholder:text-[#B3ACA8] uppercase tracking-wide"
                />
                <p class="text-[11px] text-[#309C46] font-normal">Uppercase letters, numbers, and underscores only</p>
              </div>
              <div class="flex flex-col gap-1.5 flex-1 min-w-0">
                <div class="flex items-center gap-1">
                  <p class="font-semibold text-[#837976] text-[13px]">Name</p>
                  <span class="text-red-400 text-[11px]">*</span>
                </div>
                <input
                  type="text"
                  [value]="valueSetName"
                  (input)="valueSetName = $any($event.target).value"
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
                placeholder="Describe the purpose and usage of this value set..."
                class="border border-[#E7E4DB] rounded-lg px-3 py-2.5 text-[13px] text-[#101921] font-normal bg-white outline-none focus:border-[#007044] focus:ring-2 focus:ring-[#007044]/10 w-full resize-none transition-colors placeholder:text-[#B3ACA8]"
              ></textarea>
            </div>

          </div>
        </div>

        <!-- Validation Configuration -->
        <div class="bg-white border border-[#E7E4DB] flex flex-col gap-5 p-6 rounded-xl w-[320px] shrink-0">
          <div class="flex flex-col gap-1">
            <div class="flex items-center gap-2">
              <div class="size-2 rounded-full bg-[#007044]"></div>
              <p class="font-bold text-[#101921] text-base leading-normal">Validation</p>
            </div>
            <p class="text-xs text-[#837976] font-normal pl-4">How values in this set are validated.</p>
          </div>

          <div class="border-t border-[#E7E4DB]"></div>

          <div class="flex flex-col gap-4">
            <!-- Validation Type -->
            <div class="flex flex-col gap-1.5">
              <div class="flex items-center gap-1">
                <p class="font-semibold text-[#837976] text-[13px]">Validation Type</p>
                <span class="text-red-400 text-[11px]">*</span>
              </div>
              <div class="relative">
                <select
                  [value]="validationType"
                  (change)="onValidationTypeChange($event)"
                  class="border border-[#E7E4DB] rounded-lg px-3 py-2.5 text-[13px] text-[#101921] font-normal bg-white outline-none focus:border-[#007044] w-full appearance-none cursor-pointer pr-8 transition-colors"
                >
                  <option value="INDEPENDENT">Independent — Fixed list</option>
                  <option value="DEPENDENT">Dependent — Based on parent</option>
                </select>
                <img src="/assets/21990.svg" class="block size-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" alt="" />
              </div>
              @if (validationType) {
                <div [class]="'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold ' + validationTypeBadgeClass">
                  <div class="size-1.5 rounded-full bg-current opacity-60"></div>
                  {{ validationTypeLabel }}
                </div>
              }
            </div>

            <!-- Dependent parent value set -->
            @if (validationType === 'DEPENDENT' || validationType === 'TRANSLATABLE_DEPENDENT') {
              <div class="flex flex-col gap-1.5">
                <div class="flex items-center gap-1">
                  <p class="font-semibold text-[#837976] text-[13px]">Parent Value Set</p>
                  <span class="text-red-400 text-[11px]">*</span>
                </div>
                <div class="relative">
                  <select
                    (change)="onParentValueSetChange($event)"
                    class="border border-[#E7E4DB] rounded-lg px-3 py-2.5 text-[13px] text-[#101921] font-normal bg-white outline-none focus:border-[#007044] w-full appearance-none cursor-pointer pr-8 transition-colors"
                  >
                    <option value="">Select parent value set...</option>
                    @for (ps of parentValueSets; track ps) {
                      <option [value]="ps" [selected]="ps === parentValueSet">{{ ps }}</option>
                    }
                  </select>
                  <img src="/assets/21990.svg" class="block size-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" alt="" />
                </div>
                <p class="text-[11px] text-[#309C46] font-normal">Values will be filtered based on the parent selection.</p>
              </div>
            }

            <!-- Table validation fields -->
            @if (validationType === 'TABLE') {
              <div class="flex flex-col gap-3">
                <div class="flex flex-col gap-1.5">
                  <div class="flex items-center gap-1">
                    <p class="font-semibold text-[#837976] text-[13px]">Table Name</p>
                    <span class="text-red-400 text-[11px]">*</span>
                  </div>
                  <input
                    type="text"
                    [value]="tableName"
                    (input)="tableName = $any($event.target).value"
                    placeholder="e.g. HR_EMPLOYEES"
                    class="border border-[#E7E4DB] rounded-lg px-3 py-2.5 text-[13px] text-[#101921] font-normal bg-white outline-none focus:border-[#007044] w-full transition-colors placeholder:text-[#B3ACA8] uppercase"
                  />
                </div>
                <div class="flex gap-3">
                  <div class="flex flex-col gap-1.5 flex-1 min-w-0">
                    <p class="font-semibold text-[#837976] text-[13px]">Value Column</p>
                    <input
                      type="text"
                      placeholder="COLUMN_NAME"
                      class="border border-[#E7E4DB] rounded-lg px-3 py-2.5 text-[13px] text-[#101921] font-normal bg-white outline-none focus:border-[#007044] w-full transition-colors placeholder:text-[#B3ACA8] uppercase"
                    />
                  </div>
                  <div class="flex flex-col gap-1.5 flex-1 min-w-0">
                    <p class="font-semibold text-[#837976] text-[13px]">Meaning Column</p>
                    <input
                      type="text"
                      placeholder="COLUMN_NAME"
                      class="border border-[#E7E4DB] rounded-lg px-3 py-2.5 text-[13px] text-[#101921] font-normal bg-white outline-none focus:border-[#007044] w-full transition-colors placeholder:text-[#B3ACA8] uppercase"
                    />
                  </div>
                </div>
                <div class="flex flex-col gap-1.5">
                  <p class="font-semibold text-[#837976] text-[13px]">Where Clause</p>
                  <textarea
                    rows="2"
                    placeholder="Optional SQL WHERE clause..."
                    class="border border-[#E7E4DB] rounded-lg px-3 py-2.5 text-[12px] text-[#101921] font-mono bg-white outline-none focus:border-[#007044] w-full resize-none transition-colors placeholder:text-[#B3ACA8]"
                  ></textarea>
                </div>
              </div>
            }

            
          </div>
        </div>
      </div>

      <!-- Row 2: Value Set Values -->
      <div class="bg-white border border-[#E7E4DB] flex flex-col gap-5 p-6 rounded-xl w-full">
        <div class="flex items-center justify-between w-full">
          <div class="flex flex-col gap-1">
            <div class="flex items-center gap-2">
              <div class="size-2 rounded-full bg-[#007044]"></div>
              <p class="font-bold text-[#101921] text-base leading-normal">Value Set Values</p>
            </div>
            <p class="text-xs text-[#837976] font-normal pl-4">
              {{ values.length === 0 ? "No values yet — add at least one to make this value set usable." : values.length + " value" + (values.length === 1 ? "" : "s") + " defined" }}
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

        @if (isDependent && !parentValueSet) {
          <div class="bg-[#FDF3D9] border border-[#F0E0B5] flex items-center gap-2 px-4 py-3 rounded-lg w-full">
            <p class="font-normal text-[#7A4B00] text-[12px]">Select a parent value set above to assign a parent value to each value.</p>
          </div>
        }

        @if (values.length === 0) {
          <div class="flex flex-col items-center gap-4 py-14">
            <div class="bg-[#F9F8F4] flex items-center justify-center rounded-2xl size-16 border border-[#E7E4DB]">
              <img src="/assets/f7b84.svg" class="block size-7" alt="" />
            </div>
            <div class="flex flex-col items-center gap-1 text-center">
              <p class="font-semibold text-[#101921] text-sm">No values defined</p>
              <p class="font-normal text-[#837976] text-xs max-w-[320px] leading-relaxed">
                Click "Add Value" above to define the valid values for this value set. At least one value is recommended before activating.
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
            <div class="bg-[#F9F8F4] flex gap-3 items-center px-4 py-3 rounded-t-lg w-full text-[#837976] text-[11px] font-bold min-w-[880px]">
              <p class="w-[160px] shrink-0">VALUE <span class="text-red-400">*</span></p>
              <p class="w-[190px] shrink-0">MEANING <span class="text-red-400">*</span></p>
              <p class="flex-1 min-w-0">DESCRIPTION</p>
              @if (isDependent) {
                <p class="w-[190px] shrink-0">PARENT VALUE <span class="text-red-400">*</span></p>
              }
              <p class="w-[80px] shrink-0 text-center">ENABLED</p>
              <p class="w-[130px] shrink-0">START DATE</p>
              <p class="w-[130px] shrink-0">END DATE</p>
              <p class="w-[36px] shrink-0"></p>
            </div>
            @for (val of values; track $index; let i = $index) {
              <div [class]="'flex gap-3 items-center px-4 py-3 border-t border-[#E7E4DB] min-w-[880px] ' + (i % 2 === 1 ? 'bg-[#FCFBF8]' : 'bg-white')">
                <div class="w-[160px] shrink-0">
                  <input
                    type="text"
                    [value]="val.value"
                    (input)="val.value = $any($event.target).value"
                    placeholder="VALUE"
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
                <div class="flex-1 min-w-0">
                  <input
                    type="text"
                    [value]="val.description"
                    (input)="val.description = $any($event.target).value"
                    placeholder="Optional description"
                    class="border border-[#E7E4DB] rounded-md px-2.5 py-2 text-[12px] text-[#101921] font-normal bg-white outline-none focus:border-[#007044] w-full transition-colors placeholder:text-[#B3ACA8]"
                  />
                </div>
                @if (isDependent) {
                  <div class="w-[190px] shrink-0 relative">
                    <select
                      (change)="val.parentValue = $any($event.target).value"
                      [disabled]="!parentValueSet"
                      class="border border-[#E7E4DB] rounded-md px-2.5 py-2 text-[12px] text-[#101921] font-normal bg-white outline-none focus:border-[#007044] w-full appearance-none cursor-pointer pr-7 transition-colors disabled:bg-[#F9F8F4] disabled:cursor-not-allowed"
                    >
                      <option value="">Select parent value...</option>
                      @for (pv of parentValues; track pv) {
                        <option [value]="pv" [selected]="pv === val.parentValue">{{ pv }}</option>
                      }
                    </select>
                    <img src="/assets/21990.svg" class="block size-3 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" alt="" />
                  </div>
                }
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
                    (input)="val.startDate = $any($event.target).value"
                    class="border border-[#E7E4DB] rounded-md px-2 py-2 text-[12px] text-[#101921] font-normal bg-white outline-none focus:border-[#007044] w-full transition-colors"
                  />
                </div>
                <div class="w-[130px] shrink-0">
                  <input
                    type="date"
                    [value]="val.endDate"
                    (input)="val.endDate = $any($event.target).value"
                    class="border border-[#E7E4DB] rounded-md px-2 py-2 text-[12px] text-[#837976] font-normal bg-white outline-none focus:border-[#007044] w-full transition-colors"
                  />
                </div>
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

      <!-- Row 3: Action bar -->
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
export class CreateValueSetComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  code = this.route.snapshot.paramMap.get('code');
  isEdit = !!this.code;
  pageTitle = this.isEdit ? `Edit Value Set: ${this.code}` : 'Create Value Set';

  breadcrumbs: Breadcrumb[] = [
    { label: 'Herbalife Lookup Management System', green: true },
    { label: 'Value Sets' },
    { label: this.isEdit ? 'Edit Value Set' : 'Create Value Set' },
  ];

  valueSetCode = this.code ?? '';
  valueSetName = this.code ?? '';
  tableName = '';
  validationType = 'INDEPENDENT';
  parentValueSet = '';
  formatType = 'Char';
  longList = false;
  uppercaseOnly = false;
  numericOnly = false;
  rightJustify = false;
  negativeAllowed = false;

  values: ValueSetValue[] = [];

  parentValueSets = ['FND_YES_NO', 'DEPT_HIERARCHY', 'GL_ACCOUNTS', 'EMP_REGIONS'];

  parentValuesByValueSet: Record<string, string[]> = {
    FND_YES_NO: ['Y — Yes', 'N — No'],
    DEPT_HIERARCHY: ['100 — Corporate HQ', '110 — Finance Dept', '120 — Global HR Group', '200 — US Operations', '300 — EMEA Operations'],
    GL_ACCOUNTS: ['400100 — Revenue', '500200 — Cost of Sales', '600300 — Operating Expense'],
    EMP_REGIONS: ['NA — North America', 'EMEA — Europe & Middle East', 'APAC — Asia Pacific'],
  };

  get isDependent(): boolean {
    return this.validationType === 'DEPENDENT' || this.validationType === 'TRANSLATABLE_DEPENDENT';
  }

  get canSave(): boolean {
    return this.canAddValue && this.values.every(v =>
      !!v.value.trim() && !!v.meaning.trim() && (!this.isDependent || !!v.parentValue));
  }

  get canAddValue(): boolean {
    if (!this.valueSetCode.trim() || !this.valueSetName.trim() || !this.validationType) return false;
    if (this.isDependent && !this.parentValueSet) return false;
    if (this.validationType === 'TABLE' && !this.tableName.trim()) return false;
    return true;
  }

  get parentValues(): string[] {
    return this.parentValuesByValueSet[this.parentValueSet] ?? [];
  }

  get validationTypeLabel(): string {
    const labels: Record<string, string> = {
      'NONE': 'No validation applied',
      'INDEPENDENT': 'Fixed list of values',
      'DEPENDENT': 'Values depend on a parent set',
      'TABLE': 'Values sourced from a table',
      'TRANSLATABLE_INDEPENDENT': 'Fixed list with translations',
      'TRANSLATABLE_DEPENDENT': 'Dependent list with translations',
    };
    return labels[this.validationType] ?? '';
  }

  get validationTypeBadgeClass(): string {
    const classes: Record<string, string> = {
      'NONE': 'bg-slate-100 text-slate-600',
      'INDEPENDENT': 'bg-[#F9F8F4] text-[#007044]',
      'DEPENDENT': 'bg-amber-50 text-amber-700',
      'TABLE': 'bg-blue-50 text-blue-700',
      'TRANSLATABLE_INDEPENDENT': 'bg-[#F9F8F4] text-[#007044]',
      'TRANSLATABLE_DEPENDENT': 'bg-[#F9F8F4] text-[#007044]',
    };
    return classes[this.validationType] ?? '';
  }

  onValidationTypeChange(event: Event) {
    this.validationType = (event.target as HTMLSelectElement).value;
    if (!this.isDependent) {
      this.parentValueSet = '';
      this.values.forEach((v) => (v.parentValue = ''));
    }
  }

  onParentValueSetChange(event: Event) {
    this.parentValueSet = (event.target as HTMLSelectElement).value;
    this.values.forEach((v) => (v.parentValue = ''));
  }

  addValue() {
    if (!this.canAddValue) return;
    this.values.push({ value: '', meaning: '', description: '', parentValue: '', enabled: true, startDate: '', endDate: '' });
  }

  removeValue(i: number) {
    this.values.splice(i, 1);
  }

  onFormatTypeChange(event: Event) {
    this.formatType = (event.target as HTMLSelectElement).value;
  }

  cancel() {
    this.router.navigate(['/value-sets']);
  }

  save() {
    if (!this.canSave) return;
    this.router.navigate(['/value-sets']);
  }
}
