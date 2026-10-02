import { Component } from '@angular/core';
import { AppHeaderComponent, Breadcrumb } from '../../components/app-header.component';

interface AuditEntry {
  id: string;
  ts: string;
  tsShort: string;
  user: string;
  userInitials: string;
  role: string;
  action: 'CREATE' | 'UPDATE' | 'DELETE' | 'VIEW' | 'LOGIN' | 'EXPORT';
  type: 'lookup-type' | 'value-set' | 'user-roles' | 'system' | 'security';
  entity: string;
  summary: string;
  ip: string;
  status: 'success' | 'failed' | 'warning';
  before: string;
  after: string;
  sessionId: string;
}

@Component({
  selector: 'app-audit-log',
  standalone: true,
  imports: [AppHeaderComponent],
  template: `
    <app-header [breadcrumbs]="breadcrumbs" title="Audit Log" />

    <div class="flex flex-col gap-6 p-8 w-full">

      <!-- Stats row -->
      <div class="flex gap-4 w-full">
        <div class="bg-white border border-[#E7E4DB] flex flex-col gap-2 p-5 rounded-xl flex-1">
          <p class="font-normal text-[#837976] text-[12px]">Total Events Today</p>
          <div class="flex items-end gap-2">
            <p class="font-bold text-[#101921] text-2xl leading-none">{{ allEntries.length }}</p>
            <p class="font-normal text-[#309C46] text-[11px] mb-0.5">across all modules</p>
          </div>
        </div>
        <div class="bg-white border border-[#E7E4DB] flex flex-col gap-2 p-5 rounded-xl flex-1">
          <p class="font-normal text-[#837976] text-[12px]">Changes Made</p>
          <div class="flex items-end gap-2">
            <p class="font-bold text-[#101921] text-2xl leading-none">{{ changeCount }}</p>
            <p class="font-normal text-[#309C46] text-[11px] mb-0.5">create / update / delete</p>
          </div>
        </div>
        <div class="bg-white border border-[#E7E4DB] flex flex-col gap-2 p-5 rounded-xl flex-1">
          <p class="font-normal text-[#837976] text-[12px]">Failed Attempts</p>
          <div class="flex items-end gap-2">
            <p class="font-bold text-[#101921] text-2xl leading-none">{{ failedCount }}</p>
            @if (failedCount > 0) {
              <p class="font-normal text-red-500 text-[11px] mb-0.5">requires review</p>
            }
          </div>
        </div>
        <div class="bg-white border border-[#E7E4DB] flex flex-col gap-2 p-5 rounded-xl flex-1">
          <p class="font-normal text-[#837976] text-[12px]">Unique Users</p>
          <div class="flex items-end gap-2">
            <p class="font-bold text-[#101921] text-2xl leading-none">{{ uniqueUsers }}</p>
            <p class="font-normal text-[#309C46] text-[11px] mb-0.5">active today</p>
          </div>
        </div>
      </div>

      <!-- Filters + Tabs card -->
      <div class="bg-white border border-[#E7E4DB] flex flex-col rounded-xl w-full overflow-clip">

        <!-- Filter bar -->
        <div class="flex items-center gap-3 px-6 py-4 flex-wrap">
          <!-- Search -->
          <div class="bg-[#F9F8F4] border border-[#E7E4DB] flex gap-2 items-center px-3 py-2 rounded-lg flex-1 min-w-[220px]">
            <img src="/assets/af928.svg" class="block size-4 shrink-0" alt="" />
            <p class="font-normal text-[#309C46] text-[13px]">Search user, entity, or summary...</p>
          </div>

          <!-- Date range buttons -->
          <div class="flex gap-1 bg-[#F9F8F4] border border-[#E7E4DB] p-1 rounded-lg shrink-0">
            @for (range of dateRanges; track range.key) {
              <button
                (click)="activeDateRange = range.key"
                [class]="activeDateRange === range.key
                  ? 'bg-white shadow-sm px-3 py-1.5 rounded-md font-semibold text-[#101921] text-[12px] transition-all'
                  : 'px-3 py-1.5 rounded-md font-normal text-[#837976] text-[12px] hover:text-[#101921] transition-all cursor-pointer'"
              >{{ range.label }}</button>
            }
          </div>

          <!-- Action filter -->
          <div class="relative shrink-0">
            <select
              (change)="onActionFilter($event)"
              class="border border-[#E7E4DB] rounded-lg px-3 py-2 text-[13px] text-[#837976] font-normal bg-white outline-none focus:border-[#007044] appearance-none cursor-pointer pr-8 transition-colors"
            >
              <option value="">All Actions</option>
              <option value="CREATE">Create</option>
              <option value="UPDATE">Update</option>
              <option value="DELETE">Delete</option>
              <option value="LOGIN">Login</option>
              <option value="EXPORT">Export</option>
              <option value="VIEW">View</option>
            </select>
            <img src="/assets/21990.svg" class="block size-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" alt="" />
          </div>

          <!-- Status filter -->
          <div class="relative shrink-0">
            <select
              (change)="onStatusFilter($event)"
              class="border border-[#E7E4DB] rounded-lg px-3 py-2 text-[13px] text-[#837976] font-normal bg-white outline-none focus:border-[#007044] appearance-none cursor-pointer pr-8 transition-colors"
            >
              <option value="">All Statuses</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="warning">Warning</option>
            </select>
            <img src="/assets/21990.svg" class="block size-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" alt="" />
          </div>

          <!-- Export -->
          <button class="bg-white border border-[#E7E4DB] flex gap-2 items-center px-4 py-2 rounded-lg cursor-pointer hover:bg-[#F9F8F4] transition-colors shrink-0">
            <img src="/assets/4cd30.svg" class="block size-4 opacity-60" alt="" />
            <p class="font-semibold text-[#837976] text-[13px]">Export</p>
          </button>
        </div>

        <div class="border-t border-[#E7E4DB]"></div>

        <!-- Tab bar -->
        <div class="flex items-end gap-0 px-6">
          @for (tab of tabs; track tab.key) {
            <button
              (click)="setTab(tab.key)"
              [class]="activeTab === tab.key
                ? 'flex items-center gap-2 px-4 py-3.5 border-b-2 border-[#007044] cursor-pointer'
                : 'flex items-center gap-2 px-4 py-3.5 border-b-2 border-transparent hover:border-[#E7E4DB] cursor-pointer transition-colors'"
            >
              <span [class]="activeTab === tab.key ? 'font-semibold text-[#007044] text-[13px]' : 'font-normal text-[#837976] text-[13px]'">{{ tab.label }}</span>
              <span [class]="activeTab === tab.key
                ? 'bg-[#007044] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none'
                : 'bg-[#E7E4DB] text-[#837976] text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none'">
                {{ tab.count }}
              </span>
            </button>
          }
        </div>
      </div>

      <!-- Audit table -->
      <div class="bg-white border border-[#E7E4DB] flex flex-col rounded-xl w-full overflow-clip">

        <!-- Table header -->
        <div class="bg-[#F9F8F4] flex gap-4 items-center px-6 py-3 w-full text-[#837976] text-[11px] font-bold min-w-[900px]">
          <p class="w-[160px] shrink-0">TIMESTAMP</p>
          <p class="w-[160px] shrink-0">USER</p>
          <p class="w-[90px] shrink-0">ACTION</p>
          <p class="w-[200px] shrink-0">ENTITY</p>
          <p class="flex-1 min-w-0">SUMMARY</p>
          <p class="w-[110px] shrink-0">IP ADDRESS</p>
          <p class="w-[90px] shrink-0">STATUS</p>
          <p class="w-[32px] shrink-0"></p>
        </div>

        <div class="flex flex-col w-full overflow-x-auto">
          @for (entry of displayedEntries; track entry.id; let last = $last) {
            <div [class]="'flex flex-col w-full min-w-[900px]' + (!last ? ' border-b border-[#E7E4DB]' : '')">

              <!-- Main row -->
              <button
                (click)="toggleExpand(entry.id)"
                [class]="'flex gap-4 items-center px-6 py-4 w-full text-left hover:bg-[#FCFBF8] transition-colors cursor-pointer' + (expandedId === entry.id ? ' bg-[#F9F8F4]' : '')"
              >
                <!-- Timestamp -->
                <div class="w-[160px] shrink-0 flex flex-col gap-0.5">
                  <p class="font-semibold text-[#101921] text-[12px] leading-tight">{{ entry.tsShort }}</p>
                  <p class="font-normal text-[#309C46] text-[10px] leading-tight">{{ entry.ts.split(' ')[2] }}</p>
                </div>

                <!-- User -->
                <div class="w-[160px] shrink-0 flex items-center gap-2">
                  <div [class]="'flex items-center justify-center rounded-full size-7 shrink-0 text-[11px] font-bold ' + userBgClass(entry.user)">
                    {{ entry.userInitials }}
                  </div>
                  <div class="flex flex-col gap-0.5 min-w-0">
                    <p class="font-semibold text-[#101921] text-[12px] leading-tight truncate">{{ entry.user }}</p>
                    <p class="font-normal text-[#837976] text-[10px] leading-tight">{{ entry.role }}</p>
                  </div>
                </div>

                <!-- Action badge -->
                <div class="w-[90px] shrink-0">
                  <div [class]="'inline-flex items-center px-2.5 py-1 rounded-full ' + actionClass(entry.action)">
                    <p class="font-bold text-[10px] leading-none">{{ entry.action }}</p>
                  </div>
                </div>

                <!-- Entity -->
                <div class="w-[200px] shrink-0 flex flex-col gap-0.5">
                  <p class="font-semibold text-[#101921] text-[12px] leading-tight">{{ entity(entry.entity) }}</p>
                  <p class="font-normal text-[#309C46] text-[10px] leading-tight uppercase tracking-wide">{{ typeLabel(entry.type) }}</p>
                </div>

                <!-- Summary -->
                <div class="flex-1 min-w-0">
                  <p class="font-normal text-[#837976] text-[13px] leading-normal overflow-hidden text-ellipsis whitespace-nowrap">{{ entry.summary }}</p>
                </div>

                <!-- IP -->
                <div class="w-[110px] shrink-0">
                  <p class="font-mono text-[#837976] text-[11px]">{{ entry.ip }}</p>
                </div>

                <!-- Status -->
                <div class="w-[90px] shrink-0">
                  @if (entry.status === 'success') {
                    <div class="bg-[#F9F8F4] inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full">
                      <div class="size-1.5 rounded-full bg-[#007044]"></div>
                      <p class="font-semibold text-[#007044] text-[10px]">Success</p>
                    </div>
                  } @else if (entry.status === 'failed') {
                    <div class="bg-red-50 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-red-100">
                      <div class="size-1.5 rounded-full bg-red-500"></div>
                      <p class="font-semibold text-red-700 text-[10px]">Failed</p>
                    </div>
                  } @else {
                    <div class="bg-amber-50 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-amber-100">
                      <div class="size-1.5 rounded-full bg-amber-400"></div>
                      <p class="font-semibold text-amber-700 text-[10px]">Warning</p>
                    </div>
                  }
                </div>

                <!-- Expand toggle -->
                <div class="w-[32px] shrink-0 flex justify-center">
                  <svg
                    [class]="'size-4 text-[#309C46] transition-transform ' + (expandedId === entry.id ? 'rotate-180' : '')"
                    viewBox="0 0 16 16" fill="currentColor"
                  >
                    <path fill-rule="evenodd" d="M4.22 6.22a.75.75 0 011.06 0L8 8.94l2.72-2.72a.75.75 0 111.06 1.06l-3.25 3.25a.75.75 0 01-1.06 0L4.22 7.28a.75.75 0 010-1.06z" clip-rule="evenodd"/>
                  </svg>
                </div>
              </button>

              <!-- Expanded detail panel -->
              @if (expandedId === entry.id) {
                <div class="bg-[#F9F8F4] border-t border-[#E7E4DB] px-6 py-5 flex gap-6 items-start">

                  <!-- Before -->
                  <div class="flex flex-col gap-2 flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                      <div class="size-2 rounded-full bg-red-400"></div>
                      <p class="font-bold text-[#101921] text-[12px] uppercase tracking-wide">Before</p>
                    </div>
                    <div class="bg-white border border-[#E7E4DB] rounded-lg px-4 py-3">
                      <p class="font-mono text-[#837976] text-[12px] leading-relaxed">{{ entry.before }}</p>
                    </div>
                  </div>

                  <!-- After -->
                  <div class="flex flex-col gap-2 flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                      <div class="size-2 rounded-full bg-[#007044]"></div>
                      <p class="font-bold text-[#101921] text-[12px] uppercase tracking-wide">After</p>
                    </div>
                    <div class="bg-white border border-[#E7E4DB] rounded-lg px-4 py-3">
                      <p class="font-mono text-[#837976] text-[12px] leading-relaxed">{{ entry.after }}</p>
                    </div>
                  </div>

                  <!-- Meta -->
                  <div class="flex flex-col gap-3 w-[220px] shrink-0">
                    <p class="font-bold text-[#101921] text-[12px] uppercase tracking-wide">Event Details</p>
                    <div class="flex flex-col gap-2">
                      <div class="flex items-start justify-between gap-2">
                        <p class="text-[11px] text-[#837976] shrink-0">Event ID</p>
                        <p class="font-mono text-[#101921] text-[11px] text-right">EVT-{{ entry.id.padStart(6, '0') }}</p>
                      </div>
                      <div class="flex items-start justify-between gap-2">
                        <p class="text-[11px] text-[#837976] shrink-0">Session</p>
                        <p class="font-mono text-[#101921] text-[11px] text-right">{{ entry.sessionId }}</p>
                      </div>
                      <div class="flex items-start justify-between gap-2">
                        <p class="text-[11px] text-[#837976] shrink-0">IP Address</p>
                        <p class="font-mono text-[#101921] text-[11px] text-right">{{ entry.ip }}</p>
                      </div>
                      <div class="flex items-start justify-between gap-2">
                        <p class="text-[11px] text-[#837976] shrink-0">Module</p>
                        <p class="font-semibold text-[#101921] text-[11px] text-right">{{ typeLabel(entry.type) }}</p>
                      </div>
                      <div class="flex items-start justify-between gap-2">
                        <p class="text-[11px] text-[#837976] shrink-0">Full Timestamp</p>
                        <p class="text-[#101921] text-[11px] text-right">{{ entry.ts }}</p>
                      </div>
                    </div>
                  </div>
                </div>
              }

            </div>
          }
        </div>

        <!-- Footer / pagination -->
        <div class="bg-[#F9F8F4] border-t border-[#E7E4DB] flex items-center justify-between px-6 py-4">
          <p class="font-normal text-[#837976] text-[13px]">Showing {{ displayedEntries.length }} of {{ allEntries.length }} events</p>
          <div class="flex gap-2 items-center">
            <button class="bg-white border border-[#E7E4DB] flex items-center px-3 py-2 rounded-md cursor-pointer hover:bg-[#E7E4DB] transition-colors">
              <p class="font-semibold text-[#837976] text-xs">Previous</p>
            </button>
            <button class="bg-[#007044] flex items-center justify-center rounded-md size-8">
              <p class="font-bold text-white text-xs">1</p>
            </button>
            @for (n of [2, 3, 4]; track n) {
              <button class="bg-white border border-[#E7E4DB] flex items-center justify-center rounded-md size-8 cursor-pointer hover:bg-[#F9F8F4] transition-colors">
                <p class="font-semibold text-[#837976] text-xs">{{ n }}</p>
              </button>
            }
            <button class="bg-white border border-[#E7E4DB] flex items-center px-3 py-2 rounded-md cursor-pointer hover:bg-[#E7E4DB] transition-colors">
              <p class="font-semibold text-[#837976] text-xs">Next</p>
            </button>
          </div>
        </div>
      </div>

    </div>
  `,
})
export class AuditLogComponent {
  breadcrumbs: Breadcrumb[] = [
    { label: 'Herbalife Lookup Management System', green: true },
    { label: 'Audit Log' },
  ];

  activeTab = 'all';
  activeDateRange = 'today';
  expandedId: string | null = null;

  dateRanges = [
    { key: 'today', label: 'Today' },
    { key: 'week', label: 'Week' },
    { key: 'month', label: 'Month' },
    { key: 'custom', label: 'Custom' },
  ];

  allEntries: AuditEntry[] = [
    {
      id: '1', ts: 'Oct 24, 2024 14:32:11', tsShort: 'Oct 24, 14:32',
      user: 'Emily Watson', userInitials: 'EW', role: 'System Admin',
      action: 'UPDATE', type: 'lookup-type', entity: 'FIN_TAX_CODES',
      summary: 'Updated meaning; added TAX_REDUCED lookup value',
      ip: '10.0.1.45', status: 'success',
      before: 'meaning: "Financial Tax Codes"\nvalues_count: 1',
      after: 'meaning: "Financial Tax Rate Codes"\nvalues_count: 2',
      sessionId: 'SES-8291-AX',
    },
    {
      id: '2', ts: 'Oct 24, 2024 13:57:04', tsShort: 'Oct 24, 13:57',
      user: 'James Liu', userInitials: 'JL', role: 'Data Steward',
      action: 'CREATE', type: 'value-set', entity: 'HR_PAY_GRADES',
      summary: 'Created new independent value set for payroll grade classification',
      ip: '10.0.2.12', status: 'success',
      before: '— (new record)',
      after: 'format: Char(5)\nvalidation: INDEPENDENT\nmodule: Human Resources',
      sessionId: 'SES-7740-BQ',
    },
    {
      id: '3', ts: 'Oct 24, 2024 12:44:38', tsShort: 'Oct 24, 12:44',
      user: 'Ana Costa', userInitials: 'AC', role: 'Translator',
      action: 'CREATE', type: 'lookup-type', entity: 'FIN_TAX_CODES / PT-BR',
      summary: 'Added Portuguese (Brazil) translation for FIN_TAX_CODES',
      ip: '10.0.3.77', status: 'success',
      before: '— (new translation)',
      after: 'lang: PT-BR\nmeaning: "Codigos de Taxa de Imposto Financeiro"\nstatus: active',
      sessionId: 'SES-6612-CR',
    },
    {
      id: '4', ts: 'Oct 24, 2024 11:20:05', tsShort: 'Oct 24, 11:20',
      user: 'Robert Chen', userInitials: 'RC', role: 'System Admin',
      action: 'DELETE', type: 'user-roles', entity: 'LEGACY_VIEWER',
      summary: 'Removed deprecated viewer role; 0 active users affected',
      ip: '10.0.1.10', status: 'success',
      before: 'role: LEGACY_VIEWER\npermissions: 4\nactive_users: 0',
      after: '— (record deleted)',
      sessionId: 'SES-8291-AX',
    },
    {
      id: '5', ts: 'Oct 24, 2024 10:55:22', tsShort: 'Oct 24, 10:55',
      user: 'Unknown', userInitials: '??', role: '—',
      action: 'LOGIN', type: 'security', entity: 'Auth Service',
      summary: 'Failed login attempt — invalid credentials from external IP',
      ip: '185.220.101.9', status: 'failed',
      before: '— (unauthenticated)',
      after: 'result: FAILED\nattempt_count: 3\nlockout_triggered: false',
      sessionId: '—',
    },
    {
      id: '6', ts: 'Oct 24, 2024 10:31:47', tsShort: 'Oct 24, 10:31',
      user: 'Sophie Martin', userInitials: 'SM', role: 'Translator',
      action: 'UPDATE', type: 'lookup-type', entity: 'FIN_TAX_CODES / FR-FR',
      summary: 'Corrected French meaning spelling and promoted status to Active',
      ip: '10.0.4.22', status: 'success',
      before: 'meaning: "Codes de Taux Imposition"\nstatus: draft',
      after: "meaning: \"Codes de Taux d'Imposition Financiere\"\nstatus: active",
      sessionId: 'SES-5501-DM',
    },
    {
      id: '7', ts: 'Oct 24, 2024 09:48:16', tsShort: 'Oct 24, 09:48',
      user: 'James Liu', userInitials: 'JL', role: 'Data Steward',
      action: 'UPDATE', type: 'value-set', entity: 'DEPT_HIERARCHY',
      summary: 'Added 120 — Global HR Group node under Corporate HQ (100)',
      ip: '10.0.2.12', status: 'success',
      before: 'children_of_100: 1\ntotal_nodes: 4',
      after: 'children_of_100: 2\ntotal_nodes: 5',
      sessionId: 'SES-7740-BQ',
    },
    {
      id: '8', ts: 'Oct 24, 2024 09:14:03', tsShort: 'Oct 24, 09:14',
      user: 'Emily Watson', userInitials: 'EW', role: 'System Admin',
      action: 'UPDATE', type: 'user-roles', entity: 'DATA_STEWARD',
      summary: 'Granted export permission to DATA_STEWARD role',
      ip: '10.0.1.45', status: 'success',
      before: 'permissions: ["view","create","update","delete","translate","import"]',
      after: 'permissions: ["view","create","update","delete","translate","import","export"]',
      sessionId: 'SES-8291-AX',
    },
    {
      id: '9', ts: 'Oct 24, 2024 08:30:00', tsShort: 'Oct 24, 08:30',
      user: 'System', userInitials: 'SY', role: 'Scheduler',
      action: 'VIEW', type: 'system', entity: 'Backup Service',
      summary: 'Automated daily backup completed successfully — 4.2 GB',
      ip: '127.0.0.1', status: 'success',
      before: 'last_backup: Oct 23, 2024 08:30',
      after: 'last_backup: Oct 24, 2024 08:30\nsize: 4.2 GB\nduration: 3m 42s',
      sessionId: 'SCHED-DAILY',
    },
    {
      id: '10', ts: 'Oct 23, 2024 17:22:41', tsShort: 'Oct 23, 17:22',
      user: 'Robert Chen', userInitials: 'RC', role: 'System Admin',
      action: 'CREATE', type: 'lookup-type', entity: 'HR_JOB_BAND',
      summary: 'Created lookup type for HR job level bands with 0 initial values',
      ip: '10.0.1.10', status: 'success',
      before: '— (new record)',
      after: 'module: Human Resources\naccess_level: User\nstatus: enabled',
      sessionId: 'SES-9903-FZ',
    },
    {
      id: '11', ts: 'Oct 23, 2024 16:05:14', tsShort: 'Oct 23, 16:05',
      user: 'Emily Watson', userInitials: 'EW', role: 'System Admin',
      action: 'EXPORT', type: 'system', entity: 'Lookup Types Report',
      summary: 'Exported full lookup types registry to CSV (3 types, 4 values)',
      ip: '10.0.1.45', status: 'success',
      before: '—',
      after: 'format: CSV\nrows: 4\nfile: lookup_types_20241023.csv',
      sessionId: 'SES-8291-AX',
    },
  ];

  displayedEntries: AuditEntry[] = [...this.allEntries];

  tabs = [
    { key: 'all', label: 'All Events', count: this.allEntries.length },
    { key: 'lookup-type', label: 'Lookup Types', count: this.allEntries.filter(e => e.type === 'lookup-type').length },
    { key: 'value-set', label: 'Value Sets', count: this.allEntries.filter(e => e.type === 'value-set').length },
    { key: 'user-roles', label: 'User Roles', count: this.allEntries.filter(e => e.type === 'user-roles').length },
    { key: 'system', label: 'System', count: this.allEntries.filter(e => e.type === 'system').length },
    { key: 'security', label: 'Security', count: this.allEntries.filter(e => e.type === 'security').length },
  ];

  get changeCount(): number {
    return this.allEntries.filter(e => e.action === 'CREATE' || e.action === 'UPDATE' || e.action === 'DELETE').length;
  }

  get failedCount(): number {
    return this.allEntries.filter(e => e.status === 'failed').length;
  }

  get uniqueUsers(): number {
    return new Set(this.allEntries.filter(e => e.user !== 'Unknown' && e.user !== 'System').map(e => e.user)).size;
  }

  setTab(tab: string) {
    this.activeTab = tab;
    this.expandedId = null;
    this.displayedEntries = tab === 'all'
      ? [...this.allEntries]
      : this.allEntries.filter(e => e.type === tab);
  }

  toggleExpand(id: string) {
    this.expandedId = this.expandedId === id ? null : id;
  }

  onActionFilter(event: Event) {
    const action = (event.target as HTMLSelectElement).value;
    const base = this.activeTab === 'all' ? this.allEntries : this.allEntries.filter(e => e.type === this.activeTab);
    this.displayedEntries = action ? base.filter(e => e.action === action) : [...base];
  }

  onStatusFilter(event: Event) {
    const status = (event.target as HTMLSelectElement).value;
    const base = this.activeTab === 'all' ? this.allEntries : this.allEntries.filter(e => e.type === this.activeTab);
    this.displayedEntries = status ? base.filter(e => e.status === status) : [...base];
  }

  actionClass(action: string): string {
    const map: Record<string, string> = {
      CREATE: 'bg-[#F9F8F4] text-[#007044]',
      UPDATE: 'bg-blue-50 text-blue-700',
      DELETE: 'bg-red-50 text-red-700',
      VIEW: 'bg-slate-100 text-slate-600',
      LOGIN: 'bg-amber-50 text-amber-700',
      EXPORT: 'bg-purple-50 text-purple-700',
    };
    return map[action] ?? 'bg-slate-100 text-slate-600';
  }

  userBgClass(user: string): string {
    const map: Record<string, string> = {
      'Emily Watson': 'bg-[#F9F8F4] text-[#007044]',
      'James Liu': 'bg-blue-100 text-blue-700',
      'Robert Chen': 'bg-purple-100 text-purple-700',
      'Ana Costa': 'bg-amber-100 text-amber-700',
      'Sophie Martin': 'bg-pink-100 text-pink-700',
      'System': 'bg-slate-100 text-slate-600',
      'Unknown': 'bg-red-100 text-red-600',
    };
    return map[user] ?? 'bg-[#F9F8F4] text-[#007044]';
  }

  typeLabel(type: string): string {
    const map: Record<string, string> = {
      'lookup-type': 'Lookup Type',
      'value-set': 'Value Set',
      'user-roles': 'User Roles',
      'system': 'System',
      'security': 'Security',
    };
    return map[type] ?? type;
  }

  entity(val: string): string {
    return val.length > 24 ? val.slice(0, 22) + '…' : val;
  }
}
