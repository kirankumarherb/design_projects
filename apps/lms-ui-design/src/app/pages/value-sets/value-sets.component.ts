import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AppHeaderComponent, Breadcrumb } from '../../components/app-header.component';

@Component({
  selector: 'app-value-sets',
  standalone: true,
  imports: [AppHeaderComponent],
  template: `
    <app-header [breadcrumbs]="breadcrumbs" title="Value Sets Management" />
    <div class="flex flex-1 gap-6 items-start min-h-0 p-8 w-full">
      <div class="flex flex-1 flex-col gap-5 items-start min-w-0">
        <div class="flex items-center justify-between w-full">
          <div class="bg-white border border-[#E7E4DB] flex gap-2 items-center px-3 py-2 rounded-lg w-[300px]">
            <img alt="" class="block size-4 shrink-0" src="/assets/af928.svg" />
            <p class="font-normal text-[#309C46] text-[13px] leading-normal">Search Value Sets...</p>
          </div>
          <button (click)="createValueSet()" class="bg-[#007044] flex gap-2 items-center px-4 py-2.5 rounded-lg cursor-pointer hover:bg-[#163E35] transition-colors">
            <p class="font-semibold text-white text-[13px] leading-normal">Create Value Set</p>
          </button>
        </div>

        <div class="bg-white border border-[#E7E4DB] flex flex-col items-start overflow-clip rounded-xl w-full">
          <div class="bg-[#F9F8F4] flex font-bold gap-3 items-start px-5 py-3 w-full text-[#837976] text-[11px] leading-normal">
            <p class="w-[150px] shrink-0">VALUE SET CODE</p>
            <p class="flex-1 min-w-0">NAME</p>
            <p class="w-[130px] shrink-0">VALIDATION TYPE</p>
            <p class="w-[100px] shrink-0">FORMAT TYPE</p>
            <p class="w-20 shrink-0">MAX LEN</p>
            <p class="w-[70px] shrink-0 text-right">ACTIONS</p>
          </div>
          <div [class]="'flex flex-col items-start w-full' + (scrollMode ? ' max-h-[1000px] overflow-y-auto' : '')">
            @for (vs of visibleValueSets; track vs.code) {
              <div
                (click)="selectValueSet(vs.code)"
                [class]="'border-b border-[#E7E4DB] flex gap-3 items-center px-5 py-3.5 w-full last:border-b-0 transition-colors cursor-pointer ' + (selectedCode === vs.code ? 'bg-[#F9F8F4] hover:bg-[#E3F1E6]' : 'hover:bg-[#FCFBF8]')"
              >
                <p [class]="'font-bold text-xs leading-normal w-[150px] shrink-0 ' + (selectedCode === vs.code ? 'text-[#007044]' : 'text-[#101921]')">{{ vs.code }}</p>
                <p class="font-normal text-[#101921] text-xs leading-normal flex-1 min-w-0">{{ vs.name }}</p>
                <div class="w-[130px] shrink-0">
                  <div [class]="'inline-flex items-start px-2 py-1 rounded-md ' + vs.typeColor">
                    <p class="font-semibold text-[11px] leading-normal">{{ vs.type }}</p>
                  </div>
                </div>
                <p class="font-normal text-[#837976] text-xs leading-normal w-[100px] shrink-0">{{ vs.format }}</p>
                <p class="font-normal text-[#837976] text-xs leading-normal w-20 shrink-0">{{ vs.maxLen }}</p>
                <div class="flex gap-2 items-center justify-end w-[70px] shrink-0">
                  <img alt="Edit" class="block size-4 cursor-pointer opacity-60 hover:opacity-100" (click)="editValueSet(vs.code, $event)" src="/assets/45ef0.svg" />
                  <img alt="Delete" class="block size-4 cursor-pointer opacity-60 hover:opacity-100" (click)="deleteValueSet(vs.code, $event)" src="/assets/36ce3.svg" />
                </div>
              </div>
            }
          </div>
          <div class="bg-[#F9F8F4] border-t border-[#E7E4DB] flex items-center justify-between px-5 py-4 w-full">
            <p class="font-normal text-[#837976] text-[13px] leading-normal">Showing 1-{{ visibleValueSets.length }} of {{ valueSets.length }} value sets</p>
            <div class="flex gap-2 items-center">
              @if (canShowMore) {
                <button (click)="showMore()" class="bg-white border border-[#E7E4DB] flex gap-1.5 items-center px-3 py-2 rounded-md cursor-pointer hover:bg-[#E7E4DB] transition-colors">
                  <img alt="" class="block size-3.5" src="/assets/c6ee6.svg" />
                  <p class="font-semibold text-[#837976] text-xs leading-normal">{{ nextStepLabel }}</p>
                </button>
              }
              @if (scrollMode || visibleCount > 10) {
                <button (click)="showLess()" class="bg-white border border-[#E7E4DB] flex gap-1.5 items-center px-3 py-2 rounded-md cursor-pointer hover:bg-[#E7E4DB] transition-colors">
                  <img alt="" class="block size-3.5 rotate-180" src="/assets/c6ee6.svg" />
                  <p class="font-semibold text-[#837976] text-xs leading-normal">Show less</p>
                </button>
              }
            </div>
          </div>
        </div>
      </div>

      @if (isDependentSelected) {
        <div class="bg-white border border-[#E7E4DB] flex flex-col gap-5 items-start p-6 rounded-xl w-[420px] shrink-0 self-start">
          <div class="flex flex-col gap-1.5 items-start w-full">
            <p class="font-semibold text-[#007044] text-[11px] leading-normal uppercase">Selected Value Set Hierarchy</p>
            <p class="font-bold text-[#101921] text-base leading-normal">{{ selectedCode }} Values</p>
            <p class="font-normal text-[#837976] text-xs leading-normal">{{ selectedValueSet.description }}</p>
          </div>

          <div class="border-t border-[#E7E4DB] w-full"></div>

          <div class="flex flex-col gap-1.5 items-start w-full">
            @for (node of selectedValueSet.nodes; track node.label) {
              <div class="flex gap-2 items-center w-full">
                @if (node.children.length) {
                  <button (click)="toggleNode(node.label)" class="flex gap-2 items-center cursor-pointer text-left">
                    <img
                      alt=""
                      [class]="'block size-4 transition-transform' + (isNodeExpanded(node.label) ? '' : ' -rotate-90')"
                      src="/assets/c6ee6.svg"
                    />
                    <img alt="" class="block size-4" src="/assets/d9e87.svg" />
                    <p class="font-bold text-[#101921] text-[13px] leading-normal">{{ node.label }}</p>
                  </button>
                } @else {
                  <img alt="" class="block size-4" src="/assets/71b74.svg" />
                  <img alt="" class="block size-4" src="/assets/d9e87.svg" />
                  <p class="font-bold text-[#101921] text-[13px] leading-normal">{{ node.label }}</p>
                }
              </div>
              @if (node.children.length && isNodeExpanded(node.label)) {
                <div class="flex flex-col gap-1.5 items-start pl-6 w-full">
                  @for (child of node.children; track child) {
                    <div class="flex gap-2 items-center w-full">
                      <img alt="" class="block size-4" src="/assets/2ab79.svg" />
                      <img alt="" class="block size-4" src="/assets/c7e31.svg" />
                      <p class="font-normal text-[#837976] text-[13px] leading-normal">{{ child }}</p>
                    </div>
                  }
                </div>
              }
            }
          </div>
        </div>
      }
    </div>
  `,
})
export class ValueSetsComponent {
  private router = inject(Router);

  breadcrumbs: Breadcrumb[] = [{ label: 'Herbalife Lookup Management System', green: true }, { label: 'Value Sets' }];

  valueSets = [
    { code: 'FND_YES_NO', name: 'Standard Yes No Values', type: 'INDEPENDENT', typeColor: 'bg-[#F9F8F4] text-[#007044]', format: 'Char', maxLen: '1', navigable: false },
    { code: 'DEPT_HIERARCHY', name: 'Corporate Department Tree', type: 'TRANSLATABLE_INDEPENDENT', typeColor: 'bg-[#F9F8F4] text-[#007044]', format: 'Char', maxLen: '15', navigable: true },
    { code: 'GL_ACCOUNTS', name: 'General Ledger Accounts', type: 'TABLE', typeColor: 'bg-[#F9F8F4] text-[#2D68CB]', format: 'Number', maxLen: '6', navigable: false },
    { code: 'EMP_REGIONS', name: 'Regional Employee Codes', type: 'DEPENDENT', typeColor: 'bg-[#FDF3D9] text-[#7A4B00]', format: 'Char', maxLen: '5', navigable: false },
    ...Array.from({ length: 22 }, (_, i) => ({
      code: `VS_SAMPLE_${String(i + 1).padStart(2, '0')}`,
      name: `Sample Value Set ${i + 1}`,
      type: 'INDEPENDENT',
      typeColor: 'bg-[#F9F8F4] text-[#007044]',
      format: 'Char',
      maxLen: '10',
      navigable: false,
    })),
  ];

  readonly pageStep = 5;
  readonly maxStepped = 20;
  visibleCount = 10;
  scrollMode = false;

  get visibleValueSets() {
    return this.scrollMode ? this.valueSets : this.valueSets.slice(0, this.visibleCount);
  }

  get canShowMore(): boolean {
    return !this.scrollMode && this.valueSets.length > this.visibleCount;
  }

  get nextStepLabel(): string {
    return this.visibleCount >= this.maxStepped ? 'Show all (scroll)' : `Show ${Math.min(this.visibleCount + this.pageStep, this.valueSets.length)}`;
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

  hierarchies: Record<string, { description: string; nodes: { label: string; children: string[] }[] }> = {
    FND_YES_NO: {
      description: 'Fixed list of standard yes/no indicators.',
      nodes: [
        { label: 'Y — Yes', children: [] },
        { label: 'N — No', children: [] },
      ],
    },
    DEPT_HIERARCHY: {
      description: 'Hierarchical structure mapping department parents to cost centers.',
      nodes: [
        { label: '100 — Corporate HQ', children: ['110 — Finance Dept', '120 — Global HR Group'] },
        { label: '200 — US Operations', children: [] },
        { label: '300 — EMEA Operations', children: [] },
      ],
    },
    GL_ACCOUNTS: {
      description: 'Accounts sourced from the general ledger table.',
      nodes: [
        { label: '400100 — Revenue', children: [] },
        { label: '500200 — Cost of Sales', children: [] },
        { label: '600300 — Operating Expense', children: [] },
      ],
    },
    EMP_REGIONS: {
      description: 'Regional codes filtered by the parent department value set.',
      nodes: [
        { label: 'NA — North America', children: ['NA_EAST — Eastern US', 'NA_WEST — Western US'] },
        { label: 'EMEA — Europe & Middle East', children: ['EMEA_UK — United Kingdom'] },
        { label: 'APAC — Asia Pacific', children: [] },
      ],
    },
  };

  selectedCode = '';

  expandedNodes = new Set<string>();

  get selectedValueSet() {
    return this.hierarchies[this.selectedCode] ?? { description: 'No values defined for this value set.', nodes: [] };
  }

  get isDependentSelected(): boolean {
    const type = this.valueSets.find((vs) => vs.code === this.selectedCode)?.type;
    return type === 'DEPENDENT' || type === 'TRANSLATABLE_DEPENDENT';
  }

  selectValueSet(code: string) {
    this.selectedCode = code;
    this.expandedNodes = new Set(this.selectedValueSet.nodes.filter((n) => n.children.length).map((n) => n.label));
  }

  toggleNode(label: string) {
    if (this.expandedNodes.has(label)) {
      this.expandedNodes.delete(label);
    } else {
      this.expandedNodes.add(label);
    }
  }

  isNodeExpanded(label: string): boolean {
    return this.expandedNodes.has(label);
  }

  editValueSet(code: string, event: Event) {
    event.stopPropagation();
    this.router.navigate(['/value-sets/edit', code]);
  }

  deleteValueSet(code: string, event: Event) {
    event.stopPropagation();
    this.valueSets = this.valueSets.filter((vs) => vs.code !== code);
    if (this.selectedCode === code) {
      this.selectedCode = '';
      this.expandedNodes.clear();
    }
  }

  createValueSet() {
    this.router.navigate(['/value-sets/create']);
  }
}
