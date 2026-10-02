import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { AppHeaderComponent, Breadcrumb } from '../../components/app-header.component';

interface LookupTransRow {
  id: string;
  lookupType: string;
  valueCode: string;
  baseMeaning: string;
  language: string;
  languageName: string;
  translation: string;
  status: 'active' | 'needs-review' | 'draft';
  translatedBy: string;
  lastModified: string;
}

interface VSTransRow {
  id: string;
  valueSet: string;
  valueCode: string;
  baseValue: string;
  language: string;
  languageName: string;
  translation: string;
  status: 'active' | 'needs-review' | 'draft';
  translatedBy: string;
  lastModified: string;
}

interface TranslationForm {
  lookupType: string;
  valueSet: string;
  valueCode: string;
  language: string;
  translation: string;
  notes: string;
}

@Component({
  selector: 'app-translations',
  standalone: true,
  imports: [AppHeaderComponent],
  template: `
    <app-header [breadcrumbs]="breadcrumbs" title="LOOKUP VALUES TRANSLATIONS" />

    <div class="flex flex-1 flex-col gap-6 items-start min-h-0 p-8 w-full relative overflow-x-hidden">

      <!-- ════════════════ LOOKUP VALUES TRANSLATIONS ════════════════ -->
      
        <!-- Toolbar -->
        <div class="flex items-center gap-3 w-full flex-wrap">
          <div class="bg-white border border-[#E7E4DB] flex gap-2 items-center px-3 py-2 rounded-lg flex-1 min-w-[220px]">
            <img alt="" class="block size-4 shrink-0" src="/assets/af928.svg" />
            <p class="font-normal text-[#309C46] text-[13px]">Search value code or translation...</p>
          </div>
          <div class="relative shrink-0">
            <select (change)="onLookupTypeFilter($event)" class="border border-[#E7E4DB] rounded-lg px-3 py-2 text-[13px] text-[#837976] bg-white outline-none focus:border-[#007044] appearance-none cursor-pointer pr-8">
              <option value="">All Lookup Types</option>
              @for (lt of lookupTypeOptions; track lt) {
                <option [value]="lt">{{ lt }}</option>
              }
            </select>
            <img src="/assets/21990.svg" class="block size-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" alt="" />
          </div>
          <div class="relative shrink-0">
            <select (change)="onLookupLangFilter($event)" class="border border-[#E7E4DB] rounded-lg px-3 py-2 text-[13px] text-[#837976] bg-white outline-none focus:border-[#007044] appearance-none cursor-pointer pr-8">
              <option value="">All Languages</option>
              @for (lang of languageOptions; track lang.code) {
                <option [value]="lang.code">{{ lang.label }}</option>
              }
            </select>
            <img src="/assets/21990.svg" class="block size-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" alt="" />
          </div>
          <div class="relative shrink-0">
            <select (change)="onLookupStatusFilter($event)" class="border border-[#E7E4DB] rounded-lg px-3 py-2 text-[13px] text-[#837976] bg-white outline-none focus:border-[#007044] appearance-none cursor-pointer pr-8">
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="needs-review">Needs Review</option>
              <option value="draft">Draft</option>
            </select>
            <img src="/assets/21990.svg" class="block size-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" alt="" />
          </div>
          <button
            (click)="openPanel('lookup', null)"
            class="bg-[#007044] flex gap-2 items-center px-4 py-2 rounded-lg cursor-pointer hover:bg-[#163E35] transition-colors shrink-0"
          >
            <!--img alt="" class="block size-4" src="/assets/3c14a.svg" /-->
            <p class="font-semibold text-white text-[13px]">Add Translation</p>
          </button>
        </div>

        <!-- Lookup translations table -->
        <div class="bg-white border border-[#E7E4DB] flex flex-col rounded-xl w-full overflow-clip">
          <div class="bg-[#F9F8F4] flex font-bold gap-3 items-center px-6 py-3.5 w-full text-[#837976] text-[11px]">
            <p class="w-[130px] shrink-0">LOOKUP TYPE</p>
            <p class="w-[120px] shrink-0">VALUE CODE</p>
            <p class="w-[160px] shrink-0">BASE MEANING</p>
            <p class="w-[100px] shrink-0">LANGUAGE</p>
            <p class="flex-1 min-w-0">TRANSLATION</p>
            <p class="w-[110px] shrink-0">STATUS</p>
            <p class="w-[120px] shrink-0">TRANSLATED BY</p>
            <p class="w-[100px] shrink-0">MODIFIED</p>
            <p class="w-[80px] shrink-0 text-right">ACTIONS</p>
          </div>
          <div class="flex flex-col w-full">
            @for (row of pagedLookupRows; track row.id) {
              <div class="border-b border-[#E7E4DB] flex gap-3 items-center px-6 py-4 w-full last:border-b-0 hover:bg-[#FCFBF8] transition-colors group">
                <div class="w-[130px] shrink-0">
                  <p class="font-bold text-[#007044] text-[11px] leading-tight">{{ row.lookupType }}</p>
                </div>
                <div class="w-[120px] shrink-0">
                  <div class="bg-[#F9F8F4] border border-[#E7E4DB] inline-flex px-2 py-0.5 rounded-md">
                    <p class="font-mono text-[#101921] text-[11px]">{{ row.valueCode }}</p>
                  </div>
                </div>
                <p class="font-normal text-[#837976] text-[12px] leading-normal w-[160px] shrink-0">{{ row.baseMeaning }}</p>
                <div class="w-[100px] shrink-0 flex items-center gap-1.5">
                  <span class="font-mono font-semibold text-[#101921] text-[11px]">{{ row.language }}</span>
                  <span class="text-[#837976] text-[10px]">({{ row.languageName }})</span>
                </div>
                <p class="font-normal text-[#101921] text-[13px] leading-normal flex-1 min-w-0">{{ row.translation }}</p>
                <div class="w-[110px] shrink-0">
                  <div [class]="statusClass(row.status)">
                    <div [class]="'size-1.5 rounded-full ' + statusDotClass(row.status)"></div>
                    <p class="font-semibold text-[10px]">{{ statusLabel(row.status) }}</p>
                  </div>
                </div>
                <p class="font-normal text-[#837976] text-[11px] w-[120px] shrink-0">{{ row.translatedBy }}</p>
                <p class="font-normal text-[#309C46] text-[11px] w-[100px] shrink-0">{{ row.lastModified }}</p>
                <div class="w-[80px] shrink-0 flex gap-1.5 items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    (click)="openPanel('lookup', row)"
                    class="border border-[#E7E4DB] px-2 py-1 rounded-md text-[11px] font-semibold text-[#837976] hover:bg-[#F9F8F4] cursor-pointer transition-colors"
                  >Edit</button>
                  <button
                    (click)="deleteLookupRow(row.id)"
                    class="border border-red-100 px-2 py-1 rounded-md text-[11px] font-semibold text-red-500 hover:bg-red-50 cursor-pointer transition-colors"
                  >Del</button>
                </div>
              </div>
            }
            @if (displayedLookupRows.length === 0) {
              <div class="flex flex-col items-center gap-3 py-12">
                <p class="font-semibold text-[#837976] text-sm">No translations match your filters</p>
                <p class="font-normal text-[#309C46] text-[13px]">Try adjusting your search or filter criteria</p>
              </div>
            }
          </div>
          <div class="bg-[#F9F8F4] border-t border-[#E7E4DB] flex items-center justify-between px-6 py-3.5">
            <p class="font-normal text-[#837976] text-[13px]">Showing {{ rangeLabel(lookupPage, displayedLookupRows.length) }} of {{ displayedLookupRows.length }} translations</p>
            <div class="flex gap-2 items-center">
              <button (click)="lookupPage = lookupPage - 1" [disabled]="lookupPage <= 1" class="bg-white border border-[#E7E4DB] px-3 py-1.5 rounded-md font-semibold text-[#837976] text-xs cursor-pointer hover:bg-[#E7E4DB] disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
              @for (p of pageNumbers(displayedLookupRows.length); track p) {
                <button (click)="lookupPage = p" [class]="'flex items-center justify-center rounded-md size-7 font-bold text-xs cursor-pointer ' + (p === lookupPage ? 'bg-[#007044] text-white' : 'bg-white border border-[#E7E4DB] text-[#837976] hover:bg-[#E7E4DB]')">{{ p }}</button>
              }
              <button (click)="lookupPage = lookupPage + 1" [disabled]="lookupPage >= totalPages(displayedLookupRows.length)" class="bg-white border border-[#E7E4DB] px-3 py-1.5 rounded-md font-semibold text-[#837976] text-xs cursor-pointer hover:bg-[#E7E4DB] disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
            </div>
          </div>
        </div>
      

      <!-- ════════════════ VALUE SET VALUES TRANSLATIONS ════════════════ -->
      @if (activeTab === 'valueset') {

        <!-- Stats -->
        <div class="flex gap-4 w-full">
          <div class="bg-white border border-[#E7E4DB] flex flex-col gap-1.5 p-4 rounded-xl flex-1">
            <p class="font-normal text-[#837976] text-[11px]">Total Translations</p>
            <p class="font-bold text-[#101921] text-xl leading-none">{{ vsRows.length }}</p>
          </div>
          <div class="bg-white border border-[#E7E4DB] flex flex-col gap-1.5 p-4 rounded-xl flex-1">
            <p class="font-normal text-[#837976] text-[11px]">Active</p>
            <p class="font-bold text-[#007044] text-xl leading-none">{{ vsActiveCount }}</p>
          </div>
          <div class="bg-white border border-[#E7E4DB] flex flex-col gap-1.5 p-4 rounded-xl flex-1">
            <p class="font-normal text-[#837976] text-[11px]">Needs Review</p>
            <p class="font-bold text-amber-500 text-xl leading-none">{{ vsReviewCount }}</p>
          </div>
          <div class="bg-white border border-[#E7E4DB] flex flex-col gap-1.5 p-4 rounded-xl flex-1">
            <p class="font-normal text-[#837976] text-[11px]">Draft</p>
            <p class="font-bold text-[#837976] text-xl leading-none">{{ vsDraftCount }}</p>
          </div>
          <div class="bg-white border border-[#E7E4DB] flex flex-col gap-1.5 p-4 rounded-xl flex-1">
            <p class="font-normal text-[#837976] text-[11px]">Languages Covered</p>
            <p class="font-bold text-[#101921] text-xl leading-none">{{ vsLanguageCount }}</p>
          </div>
        </div>

        <!-- Toolbar -->
        <div class="flex items-center gap-3 w-full flex-wrap">
          <div class="bg-white border border-[#E7E4DB] flex gap-2 items-center px-3 py-2 rounded-lg flex-1 min-w-[220px]">
            <img alt="" class="block size-4 shrink-0" src="/assets/af928.svg" />
            <p class="font-normal text-[#309C46] text-[13px]">Search value code or translation...</p>
          </div>
          <div class="relative shrink-0">
            <select (change)="onVSFilter($event)" class="border border-[#E7E4DB] rounded-lg px-3 py-2 text-[13px] text-[#837976] bg-white outline-none focus:border-[#007044] appearance-none cursor-pointer pr-8">
              <option value="">All Value Sets</option>
              @for (vs of valueSetOptions; track vs) {
                <option [value]="vs">{{ vs }}</option>
              }
            </select>
            <img src="/assets/21990.svg" class="block size-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" alt="" />
          </div>
          <div class="relative shrink-0">
            <select (change)="onVSLangFilter($event)" class="border border-[#E7E4DB] rounded-lg px-3 py-2 text-[13px] text-[#837976] bg-white outline-none focus:border-[#007044] appearance-none cursor-pointer pr-8">
              <option value="">All Languages</option>
              @for (lang of languageOptions; track lang.code) {
                <option [value]="lang.code">{{ lang.label }}</option>
              }
            </select>
            <img src="/assets/21990.svg" class="block size-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" alt="" />
          </div>
          <div class="relative shrink-0">
            <select (change)="onVSStatusFilter($event)" class="border border-[#E7E4DB] rounded-lg px-3 py-2 text-[13px] text-[#837976] bg-white outline-none focus:border-[#007044] appearance-none cursor-pointer pr-8">
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="needs-review">Needs Review</option>
              <option value="draft">Draft</option>
            </select>
            <img src="/assets/21990.svg" class="block size-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" alt="" />
          </div>
          <button
            (click)="openPanel('valueset', null)"
            class="bg-[#007044] flex gap-2 items-center px-4 py-2 rounded-lg cursor-pointer hover:bg-[#163E35] transition-colors shrink-0"
          >
            <img alt="" class="block size-4" src="/assets/3c14a.svg" />
            <p class="font-semibold text-white text-[13px]">Add Translation</p>
          </button>
        </div>

        <!-- Value Set translations table -->
        <div class="bg-white border border-[#E7E4DB] flex flex-col rounded-xl w-full overflow-clip">
          <div class="bg-[#F9F8F4] flex font-bold gap-3 items-center px-6 py-3.5 w-full text-[#837976] text-[11px]">
            <p class="w-[140px] shrink-0">VALUE SET</p>
            <p class="w-[100px] shrink-0">VALUE CODE</p>
            <p class="w-[160px] shrink-0">BASE VALUE</p>
            <p class="w-[100px] shrink-0">LANGUAGE</p>
            <p class="flex-1 min-w-0">TRANSLATION</p>
            <p class="w-[110px] shrink-0">STATUS</p>
            <p class="w-[120px] shrink-0">TRANSLATED BY</p>
            <p class="w-[100px] shrink-0">MODIFIED</p>
            <p class="w-[80px] shrink-0 text-right">ACTIONS</p>
          </div>
          <div class="flex flex-col w-full">
            @for (row of pagedVSRows; track row.id) {
              <div class="border-b border-[#E7E4DB] flex gap-3 items-center px-6 py-4 w-full last:border-b-0 hover:bg-[#FCFBF8] transition-colors group">
                <div class="w-[140px] shrink-0">
                  <p class="font-bold text-[#007044] text-[11px] leading-tight">{{ row.valueSet }}</p>
                </div>
                <div class="w-[100px] shrink-0">
                  <div class="bg-[#F9F8F4] border border-[#E7E4DB] inline-flex px-2 py-0.5 rounded-md">
                    <p class="font-mono text-[#101921] text-[11px]">{{ row.valueCode }}</p>
                  </div>
                </div>
                <p class="font-normal text-[#837976] text-[12px] leading-normal w-[160px] shrink-0">{{ row.baseValue }}</p>
                <div class="w-[100px] shrink-0 flex items-center gap-1.5">
                  <span class="font-mono font-semibold text-[#101921] text-[11px]">{{ row.language }}</span>
                  <span class="text-[#837976] text-[10px]">({{ row.languageName }})</span>
                </div>
                <p class="font-normal text-[#101921] text-[13px] leading-normal flex-1 min-w-0">{{ row.translation }}</p>
                <div class="w-[110px] shrink-0">
                  <div [class]="statusClass(row.status)">
                    <div [class]="'size-1.5 rounded-full ' + statusDotClass(row.status)"></div>
                    <p class="font-semibold text-[10px]">{{ statusLabel(row.status) }}</p>
                  </div>
                </div>
                <p class="font-normal text-[#837976] text-[11px] w-[120px] shrink-0">{{ row.translatedBy }}</p>
                <p class="font-normal text-[#309C46] text-[11px] w-[100px] shrink-0">{{ row.lastModified }}</p>
                <div class="w-[80px] shrink-0 flex gap-1.5 items-center justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    (click)="openPanel('valueset', row)"
                    class="border border-[#E7E4DB] px-2 py-1 rounded-md text-[11px] font-semibold text-[#837976] hover:bg-[#F9F8F4] cursor-pointer transition-colors"
                  >Edit</button>
                  <button
                    (click)="deleteVSRow(row.id)"
                    class="border border-red-100 px-2 py-1 rounded-md text-[11px] font-semibold text-red-500 hover:bg-red-50 cursor-pointer transition-colors"
                  >Del</button>
                </div>
              </div>
            }
            @if (displayedVSRows.length === 0) {
              <div class="flex flex-col items-center gap-3 py-12">
                <p class="font-semibold text-[#837976] text-sm">No translations match your filters</p>
                <p class="font-normal text-[#309C46] text-[13px]">Try adjusting your search or filter criteria</p>
              </div>
            }
          </div>
          <div class="bg-[#F9F8F4] border-t border-[#E7E4DB] flex items-center justify-between px-6 py-3.5">
            <p class="font-normal text-[#837976] text-[13px]">Showing {{ rangeLabel(vsPage, displayedVSRows.length) }} of {{ displayedVSRows.length }} translations</p>
            <div class="flex gap-2 items-center">
              <button (click)="vsPage = vsPage - 1" [disabled]="vsPage <= 1" class="bg-white border border-[#E7E4DB] px-3 py-1.5 rounded-md font-semibold text-[#837976] text-xs cursor-pointer hover:bg-[#E7E4DB] disabled:opacity-50 disabled:cursor-not-allowed">Previous</button>
              @for (p of pageNumbers(displayedVSRows.length); track p) {
                <button (click)="vsPage = p" [class]="'flex items-center justify-center rounded-md size-7 font-bold text-xs cursor-pointer ' + (p === vsPage ? 'bg-[#007044] text-white' : 'bg-white border border-[#E7E4DB] text-[#837976] hover:bg-[#E7E4DB]')">{{ p }}</button>
              }
              <button (click)="vsPage = vsPage + 1" [disabled]="vsPage >= totalPages(displayedVSRows.length)" class="bg-white border border-[#E7E4DB] px-3 py-1.5 rounded-md font-semibold text-[#837976] text-xs cursor-pointer hover:bg-[#E7E4DB] disabled:opacity-50 disabled:cursor-not-allowed">Next</button>
            </div>
          </div>
        </div>
      }
    </div>

    <!-- ════════════════ RIGHT SLIDE PANEL ════════════════ -->
    @if (showPanel) {
      <div class="fixed inset-0 bg-[rgba(15,23,42,0.3)] z-40" (click)="closePanel()"></div>
    }
    <div [class]="'fixed top-0 right-0 h-full w-[480px] bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ' + (showPanel ? 'translate-x-0' : 'translate-x-full')">

      <!-- Panel header -->
      <div class="flex items-center justify-between px-7 py-5 border-b border-[#E7E4DB]">
        <div class="flex flex-col gap-0.5">
          <p class="font-bold text-[#101921] text-[17px] leading-tight">{{ editingRow ? 'Edit Translation' : 'Add Translation' }}</p>
          <p class="font-normal text-[#837976] text-[13px]">
            {{ panelContext === 'lookup' ? 'Lookup Values' : 'Value Set Values' }}
          </p>
        </div>
        <button (click)="closePanel()" class="cursor-pointer hover:opacity-60 transition-opacity p-1">
          <svg viewBox="0 0 20 20" class="size-5 text-[#837976]" fill="currentColor">
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"/>
          </svg>
        </button>
      </div>

      <!-- Panel body -->
      <div class="flex flex-col gap-5 flex-1 overflow-y-auto px-7 py-6">

        @if (panelContext === 'lookup') {
          <!-- Lookup Type -->
          <div class="flex flex-col gap-2">
            <p class="font-semibold text-[#837976] text-[13px]">Lookup Type <span class="text-red-400">*</span></p>
            <div class="relative">
              <select
                [value]="panelForm.lookupType"
                (change)="panelForm.lookupType = $any($event.target).value"
                class="border border-[#E7E4DB] rounded-lg px-3 py-2.5 text-[13px] text-[#101921] bg-white outline-none focus:border-[#007044] appearance-none w-full pr-8"
              >
                <option value="">Select lookup type...</option>
                @for (lt of lookupTypeOptions; track lt) {
                  <option [value]="lt">{{ lt }}</option>
                }
              </select>
              <img src="/assets/21990.svg" class="block size-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" alt="" />
            </div>
          </div>
          <!-- Value Code -->
          <div class="flex flex-col gap-2">
            <p class="font-semibold text-[#837976] text-[13px]">Value Code <span class="text-red-400">*</span></p>
            <div class="relative">
              <select
                [value]="panelForm.valueCode"
                (change)="panelForm.valueCode = $any($event.target).value"
                class="border border-[#E7E4DB] rounded-lg px-3 py-2.5 text-[13px] text-[#101921] bg-white outline-none focus:border-[#007044] appearance-none w-full pr-8"
              >
                <option value="">Select value code...</option>
                @for (vc of lookupValueCodeOptions; track vc.code) {
                  <option [value]="vc.code">{{ vc.label }}</option>
                }
              </select>
              <img src="/assets/21990.svg" class="block size-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" alt="" />
            </div>
          </div>
        } @else {
          <!-- Value Set -->
          <div class="flex flex-col gap-2">
            <p class="font-semibold text-[#837976] text-[13px]">Value Set <span class="text-red-400">*</span></p>
            <div class="relative">
              <select
                [value]="panelForm.valueSet"
                (change)="panelForm.valueSet = $any($event.target).value"
                class="border border-[#E7E4DB] rounded-lg px-3 py-2.5 text-[13px] text-[#101921] bg-white outline-none focus:border-[#007044] appearance-none w-full pr-8"
              >
                <option value="">Select value set...</option>
                @for (vs of valueSetOptions; track vs) {
                  <option [value]="vs">{{ vs }}</option>
                }
              </select>
              <img src="/assets/21990.svg" class="block size-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" alt="" />
            </div>
          </div>
          <!-- Value Code -->
          <div class="flex flex-col gap-2">
            <p class="font-semibold text-[#837976] text-[13px]">Value Code <span class="text-red-400">*</span></p>
            <div class="relative">
              <select
                [value]="panelForm.valueCode"
                (change)="panelForm.valueCode = $any($event.target).value"
                class="border border-[#E7E4DB] rounded-lg px-3 py-2.5 text-[13px] text-[#101921] bg-white outline-none focus:border-[#007044] appearance-none w-full pr-8"
              >
                <option value="">Select value code...</option>
                @for (vc of valueSetValueCodeOptions; track vc.code) {
                  <option [value]="vc.code">{{ vc.label }}</option>
                }
              </select>
              <img src="/assets/21990.svg" class="block size-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" alt="" />
            </div>
          </div>
        }

        <!-- Language -->
        <div class="flex flex-col gap-2">
          <p class="font-semibold text-[#837976] text-[13px]">Target Language <span class="text-red-400">*</span></p>
          <div class="relative">
            <select
              [value]="panelForm.language"
              (change)="panelForm.language = $any($event.target).value"
              class="border border-[#E7E4DB] rounded-lg px-3 py-2.5 text-[13px] text-[#101921] bg-white outline-none focus:border-[#007044] appearance-none w-full pr-8"
            >
              <option value="">Select target language...</option>
              @for (lang of languageOptions; track lang.code) {
                <option [value]="lang.code">{{ lang.label }}</option>
              }
            </select>
            <img src="/assets/21990.svg" class="block size-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" alt="" />
          </div>
        </div>

        <!-- Translation text -->
        <div class="flex flex-col gap-2">
          <p class="font-semibold text-[#837976] text-[13px]">Translated Text <span class="text-red-400">*</span></p>
          <input
            type="text"
            [value]="panelForm.translation"
            (input)="panelForm.translation = $any($event.target).value"
            placeholder="Enter translation in target language..."
            class="border border-[#E7E4DB] rounded-lg px-3 py-2.5 text-[13px] text-[#101921] bg-white outline-none focus:border-[#007044] w-full transition-colors"
          />
          <p class="font-normal text-[#309C46] text-[11px]">Use the native script of the target language</p>
        </div>

        <!-- Description (optional) -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between">
            <p class="font-semibold text-[#837976] text-[13px]">Contextual Notes</p>
            <p class="font-normal text-[#309C46] text-[11px]">Optional</p>
          </div>
          <textarea
            rows="3"
            [value]="panelForm.notes"
            (input)="panelForm.notes = $any($event.target).value"
            placeholder="Any context, regional notes, or reviewer comments..."
            class="border border-[#E7E4DB] rounded-lg px-3 py-2.5 text-[13px] text-[#101921] bg-white outline-none focus:border-[#007044] w-full resize-none transition-colors"
          ></textarea>
        </div>

        <!-- Base value preview card -->
        <div class="bg-[#F9F8F4] border border-[#E7E4DB] rounded-xl p-4 flex flex-col gap-3">
          <p class="font-semibold text-[#837976] text-[11px] uppercase tracking-wide">Base Value Reference</p>
          <div class="flex flex-col gap-1.5">
            <div class="flex items-center justify-between gap-4">
              <p class="text-[11px] text-[#837976]">Source Language</p>
              <p class="font-semibold text-[#101921] text-[11px]">EN-US (English)</p>
            </div>
            <div class="flex items-center justify-between gap-4">
              <p class="text-[11px] text-[#837976]">Base Text</p>
              <p class="font-semibold text-[#101921] text-[11px]">{{ editingRow ? baseTextOf(editingRow) : '— select a value code —' }}</p>
            </div>
            <div class="flex items-center justify-between gap-4">
              <p class="text-[11px] text-[#837976]">Character Count</p>
              <p class="font-normal text-[#837976] text-[11px]">{{ editingRow ? baseTextOf(editingRow).length : 0 }} chars</p>
            </div>
          </div>
        </div>

      </div>

      <!-- Panel footer -->
      <div class="flex items-center justify-end gap-3 px-7 py-5 border-t border-[#E7E4DB] bg-white">
        <div class="flex gap-2 items-center">
          @if (!editingRow) {
            <button
              (click)="saveAndAddAnother()"
              [disabled]="!isPanelValid || panelSaving"
              [class]="isPanelValid && !panelSaving
              ? 'bg-[#007044] text-white cursor-pointer hover:bg-[#163E35]'
              : 'bg-[#B3ACA8] text-white cursor-not-allowed opacity-70'"
            class="px-5 py-2.5 rounded-lg font-semibold text-[13px] transition-colors"
            >
              Save &amp; Add Another
            </button>
          }
          <button
            (click)="savePanel()"
            [disabled]="!isPanelValid || panelSaving"
            [class]="isPanelValid && !panelSaving
              ? 'bg-[#007044] text-white cursor-pointer hover:bg-[#163E35]'
              : 'bg-[#B3ACA8] text-white cursor-not-allowed opacity-70'"
            class="px-5 py-2.5 rounded-lg font-semibold text-[13px] transition-colors"
          >
            {{ panelSaving ? 'Saving...' : 'Save' }}
          </button>
        </div>
      </div>
    </div>
  `,
})
export class TranslationsComponent {
  private cdr = inject(ChangeDetectorRef);

  breadcrumbs: Breadcrumb[] = [
    { label: 'Herbalife Lookup Management System', green: true },
    { label: 'Translations' },
  ];

  activeTab: 'lookup' | 'valueset' = 'lookup';

  showPanel = false;
  panelContext: 'lookup' | 'valueset' = 'lookup';
  editingRow: LookupTransRow | VSTransRow | null = null;
  panelSaving = false;
  panelForm: TranslationForm = { lookupType: '', valueSet: '', valueCode: '', language: '', translation: '', notes: '' };

  lookupValueCodeOptions = [
    { code: 'TAX_STANDARD', label: 'TAX_STANDARD — Standard Tax Rate' },
    { code: 'TAX_REDUCED', label: 'TAX_REDUCED — Reduced Tax Rate' },
    { code: 'TAX_EXEMPT', label: 'TAX_EXEMPT — Tax Exempt' },
    { code: 'TAX_ZERO', label: 'TAX_ZERO — Zero-Rated Tax' },
    { code: 'BAND_1', label: 'BAND_1 — Entry Level' },
    { code: 'BAND_2', label: 'BAND_2 — Mid Level' },
    { code: 'BAND_3', label: 'BAND_3 — Senior Level' },
  ];

  valueSetValueCodeOptions = [
    { code: '100', label: '100 — Corporate HQ' },
    { code: '110', label: '110 — Finance Dept' },
    { code: '120', label: '120 — Global HR Group' },
    { code: '200', label: '200 — US Operations' },
    { code: '300', label: '300 — EMEA Operations' },
    { code: 'Y', label: 'Y — Yes' },
    { code: 'N', label: 'N — No' },
  ];

  baseTextOf(row: LookupTransRow | VSTransRow): string {
    return ('baseMeaning' in row ? row.baseMeaning : row.baseValue) || '';
  }
  panelStatus: 'active' | 'needs-review' | 'draft' = 'draft';

  languageOptions = [
    { code: 'FR-FR', label: 'FR-FR — French (France)' },
    { code: 'DE-DE', label: 'DE-DE — German (Germany)' },
    { code: 'ES-MX', label: 'ES-MX — Spanish (Mexico)' },
    { code: 'PT-BR', label: 'PT-BR — Portuguese (Brazil)' },
    { code: 'ZH-CN', label: 'ZH-CN — Chinese (Simplified)' },
    { code: 'JA-JP', label: 'JA-JP — Japanese (Japan)' },
    { code: 'AR-SA', label: 'AR-SA — Arabic (Saudi Arabia)' },
    { code: 'IT-IT', label: 'IT-IT — Italian (Italy)' },
    { code: 'KO-KR', label: 'KO-KR — Korean (Korea)' },
  ];

  lookupTypeOptions = ['FIN_TAX_CODES', 'HR_JOB_BAND'];
  valueSetOptions = ['DEPT_HIERARCHY', 'FND_YES_NO'];

  statusOptions = [
    { value: 'active' as const, label: 'Active', dotClass: 'bg-[#007044]', activeClass: 'border-[#007044] bg-[#F9F8F4] text-[#007044]' },
    { value: 'needs-review' as const, label: 'Needs Review', dotClass: 'bg-amber-400', activeClass: 'border-amber-300 bg-amber-50 text-amber-700' },
    { value: 'draft' as const, label: 'Draft', dotClass: 'bg-slate-400', activeClass: 'border-slate-300 bg-slate-100 text-slate-600' },
  ];

  lookupRows: LookupTransRow[] = [
    { id: 'lt1', lookupType: 'FIN_TAX_CODES', valueCode: 'TAX_STANDARD', baseMeaning: 'Standard Tax Rate', language: 'FR-FR', languageName: 'French', translation: 'Taux de Taxe Standard', status: 'active', translatedBy: 'Sophie Martin', lastModified: 'Oct 24, 2024' },
    { id: 'lt2', lookupType: 'FIN_TAX_CODES', valueCode: 'TAX_STANDARD', baseMeaning: 'Standard Tax Rate', language: 'PT-BR', languageName: 'Portuguese', translation: 'Taxa de Imposto Padrão', status: 'active', translatedBy: 'Ana Costa', lastModified: 'Oct 24, 2024' },
    { id: 'lt3', lookupType: 'FIN_TAX_CODES', valueCode: 'TAX_STANDARD', baseMeaning: 'Standard Tax Rate', language: 'DE-DE', languageName: 'German', translation: 'Standardsteuersatz', status: 'active', translatedBy: 'Klaus Meyer', lastModified: 'Oct 22, 2024' },
    { id: 'lt4', lookupType: 'FIN_TAX_CODES', valueCode: 'TAX_REDUCED', baseMeaning: 'Reduced Tax Rate', language: 'FR-FR', languageName: 'French', translation: 'Taux Réduit', status: 'needs-review', translatedBy: 'Sophie Martin', lastModified: 'Oct 23, 2024' },
    { id: 'lt5', lookupType: 'FIN_TAX_CODES', valueCode: 'TAX_REDUCED', baseMeaning: 'Reduced Tax Rate', language: 'DE-DE', languageName: 'German', translation: 'Reduzierter Steuersatz', status: 'draft', translatedBy: 'Klaus Meyer', lastModified: 'Oct 21, 2024' },
    { id: 'lt6', lookupType: 'FIN_TAX_CODES', valueCode: 'TAX_EXEMPT', baseMeaning: 'Tax Exempt', language: 'FR-FR', languageName: 'French', translation: 'Exonéré de Taxe', status: 'active', translatedBy: 'Sophie Martin', lastModified: 'Oct 20, 2024' },
    { id: 'lt7', lookupType: 'FIN_TAX_CODES', valueCode: 'TAX_EXEMPT', baseMeaning: 'Tax Exempt', language: 'ES-MX', languageName: 'Spanish', translation: 'Exento de Impuestos', status: 'active', translatedBy: 'Carlos Ruiz', lastModified: 'Oct 19, 2024' },
    { id: 'lt8', lookupType: 'HR_JOB_BAND', valueCode: 'BAND_1', baseMeaning: 'Entry Level', language: 'FR-FR', languageName: 'French', translation: 'Niveau Débutant', status: 'active', translatedBy: 'Sophie Martin', lastModified: 'Oct 18, 2024' },
    { id: 'lt9', lookupType: 'HR_JOB_BAND', valueCode: 'BAND_1', baseMeaning: 'Entry Level', language: 'ES-MX', languageName: 'Spanish', translation: 'Nivel de Entrada', status: 'active', translatedBy: 'Carlos Ruiz', lastModified: 'Oct 17, 2024' },
    { id: 'lt10', lookupType: 'HR_JOB_BAND', valueCode: 'BAND_2', baseMeaning: 'Mid Level', language: 'FR-FR', languageName: 'French', translation: 'Niveau Intermédiaire', status: 'needs-review', translatedBy: 'Sophie Martin', lastModified: 'Oct 16, 2024' },
    { id: 'lt11', lookupType: 'HR_JOB_BAND', valueCode: 'BAND_2', baseMeaning: 'Mid Level', language: 'ES-MX', languageName: 'Spanish', translation: 'Nivel Intermedio', status: 'active', translatedBy: 'Carlos Ruiz', lastModified: 'Oct 15, 2024' },
    { id: 'lt12', lookupType: 'HR_JOB_BAND', valueCode: 'BAND_3', baseMeaning: 'Senior Level', language: 'FR-FR', languageName: 'French', translation: 'Niveau Senior', status: 'draft', translatedBy: 'Sophie Martin', lastModified: 'Oct 14, 2024' },
  ];

  displayedLookupRows: LookupTransRow[] = [...this.lookupRows];

  vsRows: VSTransRow[] = [
    { id: 'vt1', valueSet: 'DEPT_HIERARCHY', valueCode: '100', baseValue: 'Corporate HQ', language: 'FR-FR', languageName: 'French', translation: 'Siège Social', status: 'active', translatedBy: 'Sophie Martin', lastModified: 'Oct 24, 2024' },
    { id: 'vt2', valueSet: 'DEPT_HIERARCHY', valueCode: '100', baseValue: 'Corporate HQ', language: 'DE-DE', languageName: 'German', translation: 'Konzernzentrale', status: 'active', translatedBy: 'Klaus Meyer', lastModified: 'Oct 23, 2024' },
    { id: 'vt3', valueSet: 'DEPT_HIERARCHY', valueCode: '110', baseValue: 'Finance Dept', language: 'FR-FR', languageName: 'French', translation: 'Département Finances', status: 'active', translatedBy: 'Sophie Martin', lastModified: 'Oct 22, 2024' },
    { id: 'vt4', valueSet: 'DEPT_HIERARCHY', valueCode: '110', baseValue: 'Finance Dept', language: 'ES-MX', languageName: 'Spanish', translation: 'Departamento de Finanzas', status: 'active', translatedBy: 'Carlos Ruiz', lastModified: 'Oct 21, 2024' },
    { id: 'vt5', valueSet: 'DEPT_HIERARCHY', valueCode: '120', baseValue: 'Global HR Group', language: 'FR-FR', languageName: 'French', translation: 'Groupe RH Mondial', status: 'needs-review', translatedBy: 'Sophie Martin', lastModified: 'Oct 20, 2024' },
    { id: 'vt6', valueSet: 'DEPT_HIERARCHY', valueCode: '200', baseValue: 'US Operations', language: 'ES-MX', languageName: 'Spanish', translation: 'Operaciones EE.UU.', status: 'active', translatedBy: 'Carlos Ruiz', lastModified: 'Oct 19, 2024' },
    { id: 'vt7', valueSet: 'DEPT_HIERARCHY', valueCode: '200', baseValue: 'US Operations', language: 'PT-BR', languageName: 'Portuguese', translation: 'Operações EUA', status: 'draft', translatedBy: 'Ana Costa', lastModified: 'Oct 18, 2024' },
    { id: 'vt8', valueSet: 'DEPT_HIERARCHY', valueCode: '300', baseValue: 'EMEA Operations', language: 'FR-FR', languageName: 'French', translation: 'Opérations EMEA', status: 'draft', translatedBy: 'Sophie Martin', lastModified: 'Oct 17, 2024' },
    { id: 'vt9', valueSet: 'FND_YES_NO', valueCode: 'Y', baseValue: 'Yes', language: 'FR-FR', languageName: 'French', translation: 'Oui', status: 'active', translatedBy: 'Sophie Martin', lastModified: 'Oct 15, 2024' },
    { id: 'vt10', valueSet: 'FND_YES_NO', valueCode: 'Y', baseValue: 'Yes', language: 'DE-DE', languageName: 'German', translation: 'Ja', status: 'active', translatedBy: 'Klaus Meyer', lastModified: 'Oct 15, 2024' },
    { id: 'vt11', valueSet: 'FND_YES_NO', valueCode: 'Y', baseValue: 'Yes', language: 'ES-MX', languageName: 'Spanish', translation: 'Sí', status: 'active', translatedBy: 'Carlos Ruiz', lastModified: 'Oct 14, 2024' },
    { id: 'vt12', valueSet: 'FND_YES_NO', valueCode: 'N', baseValue: 'No', language: 'FR-FR', languageName: 'French', translation: 'Non', status: 'active', translatedBy: 'Sophie Martin', lastModified: 'Oct 15, 2024' },
    { id: 'vt13', valueSet: 'FND_YES_NO', valueCode: 'N', baseValue: 'No', language: 'DE-DE', languageName: 'German', translation: 'Nein', status: 'active', translatedBy: 'Klaus Meyer', lastModified: 'Oct 15, 2024' },
  ];

  displayedVSRows: VSTransRow[] = [...this.vsRows];

  // ── Getters ──────────────────────────────────────────────────
  get lookupActiveCount(): number { return this.lookupRows.filter(r => r.status === 'active').length; }
  get lookupReviewCount(): number { return this.lookupRows.filter(r => r.status === 'needs-review').length; }
  get lookupDraftCount(): number { return this.lookupRows.filter(r => r.status === 'draft').length; }
  get lookupLanguageCount(): number { return new Set(this.lookupRows.map(r => r.language)).size; }

  get vsActiveCount(): number { return this.vsRows.filter(r => r.status === 'active').length; }
  get vsReviewCount(): number { return this.vsRows.filter(r => r.status === 'needs-review').length; }
  get vsDraftCount(): number { return this.vsRows.filter(r => r.status === 'draft').length; }
  get vsLanguageCount(): number { return new Set(this.vsRows.map(r => r.language)).size; }

  // ── Filters ──────────────────────────────────────────────────
  private lookupTypeFilter = '';
  private lookupLangFilter = '';
  private lookupStatusFilter = '';

  private vsFilter = '';
  private vsLangFilter = '';
  private vsStatusFilter = '';

  onLookupTypeFilter(e: Event) {
    this.lookupTypeFilter = (e.target as HTMLSelectElement).value;
    this.applyLookupFilters();
  }
  onLookupLangFilter(e: Event) {
    this.lookupLangFilter = (e.target as HTMLSelectElement).value;
    this.applyLookupFilters();
  }
  onLookupStatusFilter(e: Event) {
    this.lookupStatusFilter = (e.target as HTMLSelectElement).value;
    this.applyLookupFilters();
  }

  private applyLookupFilters() {
    this.displayedLookupRows = this.lookupRows.filter(r =>
      (!this.lookupTypeFilter || r.lookupType === this.lookupTypeFilter) &&
      (!this.lookupLangFilter || r.language === this.lookupLangFilter) &&
      (!this.lookupStatusFilter || r.status === this.lookupStatusFilter)
    );
    this.lookupPage = Math.min(this.lookupPage, this.totalPages(this.displayedLookupRows.length));
  }

  readonly pageSize = 20;
  lookupPage = 1;
  vsPage = 1;

  get pagedLookupRows(): LookupTransRow[] {
    const start = (this.lookupPage - 1) * this.pageSize;
    return this.displayedLookupRows.slice(start, start + this.pageSize);
  }

  get pagedVSRows(): VSTransRow[] {
    const start = (this.vsPage - 1) * this.pageSize;
    return this.displayedVSRows.slice(start, start + this.pageSize);
  }

  totalPages(count: number): number {
    return Math.max(1, Math.ceil(count / this.pageSize));
  }

  pageNumbers(count: number): number[] {
    return Array.from({ length: this.totalPages(count) }, (_, i) => i + 1);
  }

  rangeLabel(page: number, count: number): string {
    if (count === 0) return '0';
    const start = (page - 1) * this.pageSize + 1;
    return `${start}-${Math.min(page * this.pageSize, count)}`;
  }

  onVSFilter(e: Event) {
    this.vsFilter = (e.target as HTMLSelectElement).value;
    this.applyVSFilters();
  }
  onVSLangFilter(e: Event) {
    this.vsLangFilter = (e.target as HTMLSelectElement).value;
    this.applyVSFilters();
  }
  onVSStatusFilter(e: Event) {
    this.vsStatusFilter = (e.target as HTMLSelectElement).value;
    this.applyVSFilters();
  }

  private applyVSFilters() {
    this.displayedVSRows = this.vsRows.filter(r =>
      (!this.vsFilter || r.valueSet === this.vsFilter) &&
      (!this.vsLangFilter || r.language === this.vsLangFilter) &&
      (!this.vsStatusFilter || r.status === this.vsStatusFilter)
    );
    this.vsPage = Math.min(this.vsPage, this.totalPages(this.displayedVSRows.length));
  }

  // ── CRUD ─────────────────────────────────────────────────────
  deleteLookupRow(id: string) {
    this.lookupRows.splice(this.lookupRows.findIndex(r => r.id === id), 1);
    this.applyLookupFilters();
  }

  deleteVSRow(id: string) {
    this.vsRows.splice(this.vsRows.findIndex(r => r.id === id), 1);
    this.applyVSFilters();
  }

  // ── Panel ─────────────────────────────────────────────────────
  openPanel(ctx: 'lookup' | 'valueset', row: LookupTransRow | VSTransRow | null) {
    this.panelContext = ctx;
    this.editingRow = row;
    this.panelStatus = row ? row.status : 'draft';
    this.panelForm = row ? this.formFromRow(row) : this.emptyPanelForm();
    this.showPanel = true;
  }

  closePanel() {
    this.showPanel = false;
    this.editingRow = null;
    this.panelForm = this.emptyPanelForm();
  }

  get isPanelValid(): boolean {
    const f = this.panelForm;
    const sourceSelected = this.panelContext === 'lookup' ? !!f.lookupType : !!f.valueSet;
    return sourceSelected && !!f.valueCode && !!f.language && !!f.translation.trim();
  }

  async savePanel() {
    if (!this.isPanelValid || this.panelSaving) {
      return;
    }
    this.panelSaving = true;
    try {
      await this.persistTranslation(this.panelForm);
      this.closePanel();
    } finally {
      this.panelSaving = false;
      this.cdr.markForCheck();
    }
  }

  async saveAndAddAnother() {
    if (!this.isPanelValid || this.panelSaving) {
      return;
    }
    this.panelSaving = true;
    try {
      await this.persistTranslation(this.panelForm);
      this.panelForm = this.emptyPanelForm();
      this.panelStatus = 'draft';
    } finally {
      this.panelSaving = false;
      this.cdr.markForCheck();
    }
  }

  // TODO: replace with the real backend REST API call once the translations endpoint is available.
  private persistTranslation(form: TranslationForm): Promise<void> {
    const payload = {
      context: this.panelContext,
      id: this.editingRow?.id ?? null,
      lookupType: this.panelContext === 'lookup' ? form.lookupType : null,
      valueSet: this.panelContext === 'valueset' ? form.valueSet : null,
      valueCode: form.valueCode,
      language: form.language,
      translation: form.translation.trim(),
      notes: form.notes.trim(),
      status: this.panelStatus,
    };
    console.log('Saving translation', payload);
    return new Promise(resolve => setTimeout(resolve, 400));
  }

  private emptyPanelForm(): TranslationForm {
    return { lookupType: '', valueSet: '', valueCode: '', language: '', translation: '', notes: '' };
  }

  private formFromRow(row: LookupTransRow | VSTransRow): TranslationForm {
    return {
      lookupType: 'lookupType' in row ? row.lookupType : '',
      valueSet: 'valueSet' in row ? row.valueSet : '',
      valueCode: row.valueCode,
      language: row.language,
      translation: row.translation,
      notes: '',
    };
  }

  // ── Status helpers ────────────────────────────────────────────
  statusClass(s: string): string {
    if (s === 'active') return 'bg-[#F9F8F4] inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full';
    if (s === 'needs-review') return 'bg-amber-50 border border-amber-100 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full';
    return 'bg-slate-100 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full';
  }

  statusDotClass(s: string): string {
    if (s === 'active') return 'bg-[#007044]';
    if (s === 'needs-review') return 'bg-amber-400';
    return 'bg-slate-400';
  }

  statusLabel(s: string): string {
    if (s === 'active') return 'Active';
    if (s === 'needs-review') return 'Needs Review';
    return 'Draft';
  }
}
