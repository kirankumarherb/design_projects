import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AppLayoutComponent } from './layouts/app-layout.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LookupTypesComponent } from './pages/lookup-types/lookup-types.component';
import { CreateLookupTypeComponent } from './pages/lookup-types/create-lookup-type.component';
import { EditLookupTypeComponent } from './pages/lookup-types/edit-lookup-type.component';
import { ValueSetsComponent } from './pages/value-sets/value-sets.component';
import { CreateValueSetComponent } from './pages/value-sets/create-value-set.component';
import { RolesControlComponent } from './pages/roles-control/roles-control.component';
import { AuditLogComponent } from './pages/audit-log/audit-log.component';
import { TranslationsComponent } from './pages/translations/translations.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      {
        path: 'lookup-types',
        children: [
          { path: '', component: LookupTypesComponent },
          { path: 'create', component: CreateLookupTypeComponent },
          { path: 'edit/:code', component: EditLookupTypeComponent },
        ],
      },
      {
        path: 'value-sets',
        children: [
          { path: '', component: ValueSetsComponent },
          { path: 'create', component: CreateValueSetComponent },
          { path: 'edit/:code', component: CreateValueSetComponent },
        ],
      },
      { path: 'translations', component: TranslationsComponent },
      { path: 'roles-control', component: RolesControlComponent },
      { path: 'audit-log', component: AuditLogComponent },
      { path: '**', redirectTo: 'dashboard' },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
