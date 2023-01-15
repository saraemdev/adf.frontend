import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../guards/auth.guard';
import { ActiveAgencyComponent } from './agencies/active-agency/active-agency.component';
import { AgencyFormComponent } from './agencies/agency-form/agency-form.component';
import { AgencyListComponent } from './agencies/agency-list/agency-list.component';
import { MyAgencyComponent } from './agencies/my-agency/my-agency.component';
import { DashboardComponent } from './dashboard.component';
import { ActiveProcedureComponent } from './procedures/active-procedure/active-procedure.component';
import { MyProcedureComponent } from './procedures/my-procedure/my-procedure.component';
import { ProcedureFormComponent } from './procedures/procedure-form/procedure-form.component';
import { ProcedureListComponent } from './procedures/procedure-list/procedure-list.component';
import { ProfileComponent } from './profile/profile.component';
import { ActiveUserComponent } from './users/active-user/active-user.component';
import { UserFormComponent } from './users/user-form/user-form.component';
import { UserListComponent } from './users/user-list/user-list.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: ProfileComponent, canActivate: [AuthGuard] },
      {
        path: 'procedures',
        component: ProcedureListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'myprocedures',
        component: MyProcedureComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'activeprocedures',
        component: ActiveProcedureComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'procedure',
        component: ProcedureFormComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'procedure/:id',
        component: ProcedureFormComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'agencies',
        component: AgencyListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'myagencies',
        component: MyAgencyComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'activeagencies',
        component: ActiveAgencyComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'agency',
        component: AgencyFormComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'agency/:id',
        component: AgencyFormComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'management',
        component: UserListComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'activeusers',
        component: ActiveUserComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'user',
        component: UserFormComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'user/:id',
        component: UserFormComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
