import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import {AppRoutingModule} from "./app-routing.module";
import { AboutUsComponent } from './about-us/about-us.component';
import { ReactiveFormsModule} from "@angular/forms";
import { ContactComponent } from './contact/contact.component';
import { LoginComponent } from './login/login.component';
import { UserPageComponent } from './user-page/user-page.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import {AuthService} from "./shared/auth.service";
import { AccountComponent } from './account/account.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { ExercisesComponent } from './exercises/exercises.component';
import {ExerciseService} from "./shared/exercise.service";
import { DoctorRegisterComponent } from './doctor-register/doctor-register.component';
import { StatisticsComponent } from './statistics/statistics.component';
import {NgChartsConfiguration, NgChartsModule} from "ng2-charts";
import {config} from "rxjs";
import {DatePipe} from "@angular/common";
import {ActivityService} from "./shared/activity.service";
import {DailyReportService} from "./shared/daily.report.service";
import { DoctorPageComponent } from './doctor-page/doctor-page.component';
import {StatisticsService} from "./shared/statistics.service";
import { AccountDoctorComponent } from './account-doctor/account-doctor.component';
import { PatientSiteComponent } from './patient-site/patient-site.component';
import {DoctorService} from "./shared/doctor.service";
import {PatientService} from "./shared/patient.service";
import {FullCalendarModule} from "@fullcalendar/angular";
import { AddAppointmentComponent } from './add-appointment/add-appointment.component';
import { AssignExerciseComponent } from './assign-exercise/assign-exercise.component';
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';
import {MatDialogModule, MatDialogRef} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {NotificationService} from "./shared/notification.service";
import { NotificationsComponent } from './notifications/notifications.component';
import {UserGuard} from "./shared/guards/user.guard";
import { ArchiveComponent } from './archive/archive.component';
import {ExerciseDialogComponent} from "./exercises/exercise-dialog/exercise-dialog.component";
import {AuthInterceptor} from "./shared/auth/auth.interceptor";
import {MatInputModule} from "@angular/material/input";
import {MatIconModule} from "@angular/material/icon";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    AboutUsComponent,
    ContactComponent,
    LoginComponent,
    UserPageComponent,
    SignUpComponent,
    AccountComponent,
    ExercisesComponent,
    DoctorRegisterComponent,
    StatisticsComponent,
    DoctorPageComponent,
    AccountDoctorComponent,
    PatientSiteComponent,
    AddAppointmentComponent,
    AssignExerciseComponent,
    ConfirmationDialogComponent,
    NotificationsComponent,
    ArchiveComponent,
    ExerciseDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgChartsModule,
    FullCalendarModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule
  ],
  providers: [AuthService,
    ExerciseService,
    ActivityService,
    DailyReportService,
    StatisticsService,
    DoctorService,
    PatientService,
    NotificationService,
    UserGuard,
    { provide: NgChartsConfiguration, useValue: config },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  DatePipe],
  bootstrap: [AppComponent],

})
export class AppModule { }
