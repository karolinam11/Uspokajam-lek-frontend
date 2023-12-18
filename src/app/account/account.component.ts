import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../shared/auth.service";
import {User} from "../models/user";
import {PatientService} from "../shared/patient.service";
import {Doctor} from "../models/doctor";
import {Appointment} from "../models/appointment";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent {

  patientInfoForm: FormGroup;
  therapistCodeForm: FormGroup;
  addTherapist = false;
  user: User | null  = null;
  editSucceeded = false;
  therapists: Doctor[] = []
  pastAppointments: Appointment[] = []
  doctorRequestFailed = false;

  constructor(private authService: AuthService,
              private patientService: PatientService) {
    this.authService.editSucceded.subscribe(
      (response) => {
        this.editSucceeded = response;
      }
    )
    this.authService.user.subscribe(
      (response) => {
        this.user = response
        this.patientInfoForm = new FormGroup({
          name: new FormControl(this.user.name, Validators.required),
          surname: new FormControl(this.user.surname, Validators.required),
          email: new FormControl(this.user.email, [Validators.required, Validators.email]),
          birthDate: new FormControl(this.user.birthDate),
        });
        this.therapistCodeForm = new FormGroup({
          code: new FormControl("", Validators.required),
        });
        this.patientService.getMyDoctors()
          .subscribe(
            (res) => {
              this.therapists = res;
            }
          )
        this.patientService.getPastAppointments()
          .subscribe(
            (res) => {
              this.pastAppointments = res
            }
          )
      }
    )

  }
  onEdit(){
    this.authService.editAccount(this.patientInfoForm.value["name"],this.patientInfoForm.value["surname"],this.patientInfoForm.value["email"], this.patientInfoForm.value["birthDate"])
  }

  onAddTherapist(){
    this.addTherapist = true;
  }

  onSubmitTherapistCode(){
    this.addTherapist = false;
    this.patientService.createDoctorRequest(this.therapistCodeForm.value["code"])
      .subscribe(
        (res) => {
          this.doctorRequestFailed = false;
        },
        (error) => {
          this.doctorRequestFailed = true;
        }
      )
  }

}
