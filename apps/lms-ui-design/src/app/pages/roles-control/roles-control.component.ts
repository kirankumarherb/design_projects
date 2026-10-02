import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { AppHeaderComponent, Breadcrumb } from '../../components/app-header.component';

interface RoleAssignment {
  id: string;
  user: string;
  initials: string;
  email: string;
  role: string;
  scope: string[];
  assignedBy: string;
  assignedDate: string;
  status: 'active' | 'inactive';
}

type PermissionKey = 'read' | 'create' | 'update' | 'delete';

interface PermissionRow extends Record<PermissionKey, boolean> {
  role: string;
  scope: string;
  condition: string;
  saving: boolean;
  original: Record<PermissionKey, boolean>;
}

@Component({
  selector: 'app-roles-control',
  standalone: true,
  imports: [AppHeaderComponent],
  template: `
    <app-header [breadcrumbs]="breadcrumbs" title="Role Control Policies" />
    <div class="flex flex-1 flex-col gap-6 items-start min-h-0 p-8 w-full relative">

      <!-- Tab bar -->
      <div class="border-b border-[#E7E4DB] flex gap-6 items-start w-full">
        

        <div class="bg-white border border-[#E7E4DB] flex flex-col items-start overflow-clip rounded-xl w-full">
          <div class="bg-[#F9F8F4] flex font-bold gap-4 items-center px-6 py-3.5 w-full text-[#837976] text-xs leading-normal">
            <p class="w-[180px] shrink-0">ROLE CODE</p>
            <p class="w-[150px] shrink-0">SCOPE MODULE</p>
            <p class="w-[100px] shrink-0 text-center">READ</p>
            <p class="w-[100px] shrink-0 text-center">CREATE</p>
            <p class="w-[100px] shrink-0 text-center">UPDATE</p>
            <p class="w-[100px] shrink-0 text-center">DELETE</p>
            <p class="flex-1 min-w-0">CONDITION / SPECIFIC TARGETS</p>
            <p class="w-[72px] shrink-0"></p>
          </div>
          <div class="flex flex-col items-start w-full">
            @for (row of rows; track row.role) {
              <div [class]="'border-b border-[#E7E4DB] flex gap-4 items-center px-6 py-4 w-full last:border-b-0 transition-colors ' + (isRowDirty(row) ? 'bg-[#FDF3D9]/40' : '')">
                <p class="font-bold text-[#101921] text-[13px] leading-normal w-[180px] shrink-0">{{ row.role }}</p>
                <p class="font-medium text-[#837976] text-[13px] leading-normal w-[150px] shrink-0">{{ row.scope }}</p>
                @for (perm of permissions; track perm) {
                  <div class="w-[100px] shrink-0 flex justify-center">
                    <input
                      type="checkbox"
                      [checked]="row[perm]"
                      (change)="togglePermission(row, perm, $event)"
                      [attr.aria-label]="perm + ' permission for ' + row.role"
                      class="size-4 cursor-pointer accent-[#007044]"
                    />
                  </div>
                }
                <p class="font-normal text-[#837976] text-[13px] leading-normal flex-1 min-w-0">{{ row.condition }}</p>
                <div class="w-[72px] shrink-0 flex gap-1 justify-end">
                  @if (isRowDirty(row)) {
                    <button
                      (click)="revertRow(row)"
                      [disabled]="row.saving"
                      [attr.title]="'Revert changes for ' + row.role"
                      [attr.aria-label]="'Revert permissions for ' + row.role"
                      class="flex items-center justify-center rounded-md size-8 transition-colors text-[#837976] hover:bg-[#F9F8F4] hover:text-[#101921] cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 5v6h6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        <path d="M3.5 13a8.5 8.5 0 1 0 2.2-7.3L3 11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </button>
                  }
                  <button
                    (click)="saveRow(row)"
                    [disabled]="!isRowDirty(row) || row.saving"
                    [attr.title]="isRowDirty(row) ? 'Save changes for ' + row.role : 'No changes to save'"
                    [attr.aria-label]="'Save permissions for ' + row.role"
                    [class]="isRowDirty(row) && !row.saving
                      ? 'text-[#007044] hover:bg-[#E3F1E6] cursor-pointer'
                      : 'text-[#B3ACA8] cursor-not-allowed opacity-60'"
                    class="flex items-center justify-center rounded-md size-8 transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" [class]="row.saving ? 'animate-pulse' : ''">
                      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
                      <path d="M17 21v-8H7v8M7 3v5h8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
            }
          </div>
        </div>
      </div>

      

      <!-- ───────────────── PERMISSIONS MATRIX TAB ───────────────── -->
      @if (activeTab === 'matrix') {
        
      }

      <!-- ───────────────── ASSIGN ROLE MODAL ───────────────── -->
      @if (showModal) {
        <div class="fixed inset-0 bg-[rgba(15,23,42,0.4)] z-40" (click)="showModal = false"></div>
        <div class="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white drop-shadow-[0px_24px_24px_rgba(15,23,42,0.1)] flex flex-col gap-6 items-start p-8 rounded-2xl w-[540px] z-50">
          <div class="flex items-center justify-between w-full">
            <div class="flex flex-col gap-1 items-start">
              <p class="font-bold text-[#101921] text-lg leading-normal">{{ editingId ? 'Edit Role Assignment' : 'Assign Security Role' }}</p>
              <p class="font-normal text-[#837976] text-[13px] leading-normal">{{ editingId ? 'Modify role or scope for this user' : 'Grant reference lookup administrative roles to users' }}</p>
            </div>
            <button (click)="closeModal()" class="cursor-pointer hover:opacity-70 transition-opacity">
              <img alt="Close" class="block size-5" src="/assets/04391.svg" />
            </button>
          </div>

          <div class="border-t border-[#E7E4DB] w-full"></div>

          <div class="flex flex-col gap-4 items-start w-full">
            <!-- User field -->
            <div class="flex flex-col gap-2 items-start w-full">
              <p class="font-semibold text-[#837976] text-[13px] leading-normal">Target Enterprise User</p>
              <div class="relative w-full">
                <select class="border border-[#E7E4DB] rounded-lg px-3 py-2.5 text-[13px] text-[#101921] font-normal bg-white outline-none focus:border-[#007044] appearance-none w-full transition-colors pr-8">
                  <option>Emily Watson — emily.watson&#64;herbalife.internal</option>
                  <option>James Liu — james.liu&#64;herbalife.internal</option>
                  <option>Ana Costa — ana.costa&#64;herbalife.internal</option>
                  <option>Sophie Martin — sophie.martin&#64;herbalife.internal</option>
                  <option>Robert Chen — robert.chen&#64;herbalife.internal</option>
                  <option>Maria Garcia — maria.garcia&#64;herbalife.internal</option>
                  <option>David Kim — david.kim&#64;herbalife.internal</option>
                </select>
                <img src="/assets/21990.svg" class="block size-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" alt="" />
              </div>
            </div>
            <!-- Role field -->
            <div class="flex flex-col gap-2 items-start w-full">
              <p class="font-semibold text-[#837976] text-[13px] leading-normal">Select System Role</p>
              <div class="relative w-full">
                <select class="border border-[#E7E4DB] rounded-lg px-3 py-2.5 text-[13px] text-[#101921] font-normal bg-white outline-none focus:border-[#007044] appearance-none w-full transition-colors pr-8">
                  @for (role of roleOptions; track role) {
                    <option>{{ role }}</option>
                  }
                </select>
                <img src="/assets/21990.svg" class="block size-3.5 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" alt="" />
              </div>
            </div>
            <!-- Scope field (multi-select) -->
            <div class="flex flex-col gap-2 items-start w-full">
              <p class="font-semibold text-[#837976] text-[13px] leading-normal">Scope / Functional Module</p>
              <div class="border border-[#E7E4DB] rounded-lg p-3 w-full flex flex-wrap gap-2">
                @for (module of scopeOptions; track module) {
                  <button
                    type="button"
                    (click)="toggleScopeModule(module)"
                    [class]="'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[12px] font-semibold cursor-pointer transition-colors border ' + (isScopeSelected(module) ? 'bg-[#007044] border-[#007044] text-white' : 'bg-white border-[#E7E4DB] text-[#837976] hover:bg-[#F9F8F4]')"
                  >
                    @if (isScopeSelected(module)) {
                      <svg viewBox="0 0 8 8" class="size-2.5" fill="none"><path d="M1.5 4L3.5 6L6.5 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                    }
                    {{ module }}
                  </button>
                }
              </div>
              <p class="font-normal text-[#837976] text-[11px] leading-normal">Select one or more modules. Selected: {{ selectedScopeModules.length ? selectedScopeModules.join(', ') : 'None' }}</p>
            </div>
          </div>

          <div class="bg-[#F9F8F4] border border-[#E7E4DB] flex gap-3 items-start p-4 rounded-lg w-full">
            <div class="size-4 shrink-0 mt-0.5 bg-[#007044] rounded-full flex items-center justify-center">
              <svg viewBox="0 0 8 8" class="size-2.5" fill="white"><path d="M1.5 4L3.5 6L6.5 2" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
            </div>
            <div class="flex flex-col gap-0.5">
              <p class="font-semibold text-[#101921] text-[12px] leading-normal">Effective immediately upon save</p>
              <p class="font-normal text-[#837976] text-[11px] leading-relaxed">Assignment will be logged to the Audit Log and the user will be notified by email.</p>
            </div>
          </div>

          <div class="border-t border-[#E7E4DB] w-full"></div>

          <div class="flex gap-3 items-center justify-end w-full">
            <button
              (click)="closeModal()"
              class="bg-white border border-[#E7E4DB] px-4 py-2.5 rounded-md cursor-pointer hover:bg-[#F9F8F4] transition-colors"
            >
              <p class="font-semibold text-[#837976] text-[13px] leading-normal">Cancel</p>
            </button>
            <button
              (click)="closeModal()"
              class="bg-[#007044] px-4 py-2.5 rounded-md cursor-pointer hover:bg-[#163E35] transition-colors"
            >
              <p class="font-semibold text-white text-[13px] leading-normal">{{ editingId ? 'Save Changes' : 'Apply Assignment' }}</p>
            </button>
          </div>
        </div>
      }
    </div>
  `,
})
export class RolesControlComponent {
  private cdr = inject(ChangeDetectorRef);

  breadcrumbs: Breadcrumb[] = [{ label: 'Herbalife Lookup Management System', green: true }, { label: 'Roles Control' }];

  showModal = false;
  editingId: string | null = null;
  activeTab: 'assignments' | 'matrix' = 'assignments';

  roleOptions = ['SYSTEM_ADMIN', 'LOOKUP_MANAGER', 'LOOKUP_VIEWER', 'SUPPORT_ADMIN'];

  scopeOptions = ['Global (All Modules)', 'Human Resources', 'Financials', 'Operations', 'Sales & Distribution'];

  selectedScopeModules: string[] = [];

  assignments: RoleAssignment[] = [
    {
      id: 'a1',
      user: 'Emily Watson', initials: 'EW',
      email: 'emily.watson@herbalife.internal',
      role: 'SYSTEM_ADMIN', scope: ['Global (All)'],
      assignedBy: 'System', assignedDate: 'Oct 01, 2024', status: 'active',
    },
    {
      id: 'a2',
      user: 'Robert Chen', initials: 'RC',
      email: 'robert.chen@herbalife.internal',
      role: 'LOOKUP_ADMIN', scope: ['Global (All)'],
      assignedBy: 'System', assignedDate: 'Oct 01, 2024', status: 'active',
    },
    {
      id: 'a3',
      user: 'James Liu', initials: 'JL',
      email: 'james.liu@herbalife.internal',
      role: 'LOOKUP_MANAGER', scope: ['Human Resources'],
      assignedBy: 'Emily Watson', assignedDate: 'Oct 05, 2024', status: 'active',
    },
    {
      id: 'a4',
      user: 'Ana Costa', initials: 'AC',
      email: 'ana.costa@herbalife.internal',
      role: 'LOOKUP_VIEWER', scope: ['Global (All)'],
      assignedBy: 'Emily Watson', assignedDate: 'Oct 07, 2024', status: 'active',
    },
    {
      id: 'a5',
      user: 'Sophie Martin', initials: 'SM',
      email: 'sophie.martin@herbalife.internal',
      role: 'LOOKUP_VIEWER', scope: ['Global (All)'],
      assignedBy: 'Emily Watson', assignedDate: 'Oct 07, 2024', status: 'active',
    },
    {
      id: 'a6',
      user: 'Maria Garcia', initials: 'MG',
      email: 'maria.garcia@herbalife.internal',
      role: 'FIN_ADMIN', scope: ['Financials', 'Operations'],
      assignedBy: 'Robert Chen', assignedDate: 'Oct 10, 2024', status: 'active',
    },
    {
      id: 'a7',
      user: 'David Kim', initials: 'DK',
      email: 'david.kim@herbalife.internal',
      role: 'HR_ADMIN', scope: ['Human Resources', 'Financials'],
      assignedBy: 'Emily Watson', assignedDate: 'Oct 12, 2024', status: 'active',
    },
    {
      id: 'a8',
      user: 'Priya Nair', initials: 'PN',
      email: 'priya.nair@herbalife.internal',
      role: 'LOOKUP_VIEWER', scope: ['Global (All)'],
      assignedBy: 'Robert Chen', assignedDate: 'Sep 20, 2024', status: 'inactive',
    },
  ];

  displayedAssignments: RoleAssignment[] = [...this.assignments];

  get activeCount(): number {
    return this.assignments.filter(a => a.status === 'active').length;
  }

  get inactiveCount(): number {
    return this.assignments.filter(a => a.status === 'inactive').length;
  }

  get uniqueRoles(): number {
    return new Set(this.assignments.map(a => a.role)).size;
  }

  rows: PermissionRow[] = [
    { role: 'SYSTEM_ADMIN', scope: 'Global (All)', read: true, create: true, update: true, delete: true, condition: 'Unrestricted access across all enterprise value sets', saving: false, original: { read: true, create: true, update: true, delete: true } },
    { role: 'LOOKUP_MANAGER', scope: 'Human Resources', read: true, create: true, update: true, delete: false, condition: 'Limited to HR_ modules and specific value mappings', saving: false, original: { read: true, create: true, update: true, delete: false } },
    { role: 'LOOKUP_VIEWER', scope: 'Global (All)', read: true, create: false, update: false, delete: false, condition: 'Read-only access across standard business modules', saving: false, original: { read: true, create: false, update: false, delete: false } },
    { role: 'SUPPORT_ADMIN', scope: 'Support Admin', read: true, create: false, update: true, delete: false, condition: 'Limited to Support Admin modules and specific value mappings', saving: false, original: { read: true, create: true, update: true, delete: true } },
  ];

  permissions: PermissionKey[] = ['read', 'create', 'update', 'delete'];

  togglePermission(row: PermissionRow, perm: PermissionKey, event: Event) {
    row[perm] = (event.target as HTMLInputElement).checked;
  }

  isRowDirty(row: PermissionRow): boolean {
    return this.permissions.some(perm => row[perm] !== row.original[perm]);
  }

  revertRow(row: PermissionRow) {
    if (row.saving) {
      return;
    }
    this.permissions.forEach(perm => (row[perm] = row.original[perm]));
  }

  async saveRow(row: PermissionRow) {
    if (!this.isRowDirty(row) || row.saving) {
      return;
    }
    row.saving = true;
    try {
      await this.persistRolePermissions(row);
      row.original = { read: row.read, create: row.create, update: row.update, delete: row.delete };
    } finally {
      row.saving = false;
      this.cdr.markForCheck();
    }
  }

  // TODO: replace with the real backend call once the role permissions API is available.
  private persistRolePermissions(row: PermissionRow): Promise<void> {
    const payload = {
      role: row.role,
      scope: row.scope,
      read: row.read,
      create: row.create,
      update: row.update,
      delete: row.delete,
    };
    console.log('Saving role permissions', payload);
    return new Promise(resolve => setTimeout(resolve, 600));
  }

  onRoleFilter(event: Event) {
    const role = (event.target as HTMLSelectElement).value;
    this.displayedAssignments = role
      ? this.assignments.filter(a => a.role === role)
      : [...this.assignments];
  }

  toggleStatus(a: RoleAssignment) {
    a.status = a.status === 'active' ? 'inactive' : 'active';
  }

  openEdit(a: RoleAssignment) {
    this.editingId = a.id;
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editingId = null;
    this.selectedScopeModules = [];
  }

  isScopeSelected(module: string): boolean {
    return this.selectedScopeModules.includes(module);
  }

  toggleScopeModule(module: string): void {
    this.selectedScopeModules = this.isScopeSelected(module)
      ? this.selectedScopeModules.filter(m => m !== module)
      : [...this.selectedScopeModules, module];
  }

  userBgClass(user: string): string {
    const map: Record<string, string> = {
      'Emily Watson': 'bg-[#F9F8F4] text-[#007044]',
      'Robert Chen': 'bg-purple-100 text-purple-700',
      'James Liu': 'bg-blue-100 text-blue-700',
      'Ana Costa': 'bg-amber-100 text-amber-700',
      'Sophie Martin': 'bg-pink-100 text-pink-700',
      'Maria Garcia': 'bg-orange-100 text-orange-700',
      'David Kim': 'bg-cyan-100 text-cyan-700',
      'Priya Nair': 'bg-violet-100 text-violet-700',
    };
    return map[user] ?? 'bg-[#F9F8F4] text-[#007044]';
  }

  roleBadgeClass(role: string): string {
    const map: Record<string, string> = {
      LOOKUP_ADMIN: 'bg-[#F9F8F4] text-[#007044]',
      LOOKUP_MANAGER: 'bg-blue-50 text-blue-700',
      LOOKUP_VIEWER: 'bg-slate-100 text-slate-600',
      HR_ADMIN: 'bg-amber-50 text-amber-700',
      FIN_ADMIN: 'bg-purple-50 text-purple-700',
    };
    return map[role] ?? 'bg-slate-100 text-slate-600';
  }
}
