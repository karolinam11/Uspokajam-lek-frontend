import {RouterModule, Routes} from "@angular/router";
import {NgModule} from "@angular/core";
import {HomeComponent} from "./home/home.component";
import {AboutUsComponent} from "./about-us/about-us.component";
import {ContactComponent} from "./contact/contact.component";
import {LoginComponent} from "./login/login.component";
import {UserPageComponent} from "./user-page/user-page.component";
import {SignUpComponent} from "./sign-up/sign-up.component";
import {AccountComponent} from "./account/account.component";
import {ExercisesComponent} from "./exercises/exercises.component";
import {DoctorRegisterComponent} from "./doctor-register/doctor-register.component";
import {StatisticsComponent} from "./statistics/statistics.component";
import {DoctorPageComponent} from "./doctor-page/doctor-page.component";
import {AccountDoctorComponent} from "./account-doctor/account-doctor.component";
import {PatientSiteComponent} from "./patient-site/patient-site.component";
import {AddAppointmentComponent} from "./add-appointment/add-appointment.component";
import {AssignExerciseComponent} from "./assign-exercise/assign-exercise.component";
import {ArchiveComponent} from "./archive/archive.component";

const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'about-us', component: AboutUsComponent},
  {path: 'login', component: LoginComponent},
  {path: 'contact', component: ContactComponent},
  {path: 'user-page', component: UserPageComponent},
  {path: 'signup', component: SignUpComponent},
  {path: 'account', component: AccountComponent},
  {path: 'exercises/:id', component: ExercisesComponent},
  {path: 'exercises', component: ExercisesComponent},
  {path: 'doctor-register', component: DoctorRegisterComponent},
  {path: 'statistics', component: StatisticsComponent},
  {path: 'statistics/:id', component: StatisticsComponent},
  {path: 'doctor-page', component: DoctorPageComponent},
  {path: 'account-doctor', component: AccountDoctorComponent},
  {path: 'patient-site/:id', component: PatientSiteComponent},
  {path: 'add-appointment', component: AddAppointmentComponent},
  {path: 'assign-exercise', component: AssignExerciseComponent},
  {path: 'archive', component: ArchiveComponent},
  {path: 'archive/:id', component: ArchiveComponent}
]

@NgModule({
  imports:[
    RouterModule.forRoot(appRoutes)
  ],
  exports:[
    RouterModule
  ]
})

export class AppRoutingModule{

}
