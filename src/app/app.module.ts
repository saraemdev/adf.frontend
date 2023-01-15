import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgToggleModule } from 'ng-toggle-button';

import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { AgencyFormComponent } from './pages/dashboard/agencies/agency-form/agency-form.component';
import { AgencyListComponent } from './pages/dashboard/agencies/agency-list/agency-list.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProcedureFormComponent } from './pages/dashboard/procedures/procedure-form/procedure-form.component';
import { ProcedureListComponent } from './pages/dashboard/procedures/procedure-list/procedure-list.component';
import { UserFormComponent } from './pages/dashboard/users/user-form/user-form.component';
import { UserListComponent } from './pages/dashboard/users/user-list/user-list.component';
import { HomeComponent } from './pages/home/home.component';
import { ProcedureComponent } from './pages/home/procedure/procedure.component';
import { ProceduresComponent } from './pages/home/procedures/procedures.component';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { FooterComponent } from './shared/footer/footer.component';
import { HeaderComponent } from './shared/header/header.component';
import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';
import { MyProcedureComponent } from './pages/dashboard/procedures/my-procedure/my-procedure.component';
import { ActiveProcedureComponent } from './pages/dashboard/procedures/active-procedure/active-procedure.component';
import { MyAgencyComponent } from './pages/dashboard/agencies/my-agency/my-agency.component';
import { ActiveAgencyComponent } from './pages/dashboard/agencies/active-agency/active-agency.component';
import { ActiveUserComponent } from './pages/dashboard/users/active-user/active-user.component';
import { ProfileComponent } from './pages/dashboard/profile/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    DashboardComponent,
    SidebarComponent,
    ProcedureComponent,
    ProceduresComponent,
    PageNotFoundComponent,
    ProcedureFormComponent,
    ProcedureListComponent,
    AgencyListComponent,
    AgencyFormComponent,
    UserFormComponent,
    UserListComponent,
    MyProcedureComponent,
    ActiveProcedureComponent,
    MyAgencyComponent,
    ActiveAgencyComponent,
    ActiveUserComponent,
    ProfileComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    FontAwesomeModule,
    NgToggleModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
