import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../shared/auth.service";
import {Doctor} from "../models/doctor";
import {User} from "../models/user";
import {DoctorService} from "../shared/doctor.service";

@Component({
  selector: 'app-account-doctor',
  templateUrl: './account-doctor.component.html',
  styleUrls: ['./account-doctor.component.css']
})
export class AccountDoctorComponent {

  doctorInfoForm: FormGroup;
  user: Doctor | null  = null;
  editSucceded = false;
  pendingPatients: User[] = [];

  constructor(private authService: AuthService,
              private doctorService: DoctorService) {
    this.authService.editSucceded.subscribe(
      (response) => {
        this.editSucceded = response;
      }
    )
    this.authService.user.subscribe(
      (response) => {
          this.user = <Doctor> response
          this.doctorInfoForm = new FormGroup({
            name: new FormControl(this.user.name, Validators.required),
            surname: new FormControl(this.user.surname, Validators.required),
            email: new FormControl(this.user.email, [Validators.required, Validators.email]),
            birthDate: new FormControl(this.user.birthDate),
            specialization: new FormControl(this.user.specialization, Validators.required),
            address: new FormControl(this.user.address, Validators.required),
            phoneNumber: new FormControl(this.user.phoneNumber, Validators.required),
          });
        }
    )
    this.getPendingRequests();

  }
  onSubmit(){

  }

  onEdit(){
    this.authService.editDoctorAccount(this.doctorInfoForm.value["name"],this.doctorInfoForm.value["surname"],this.doctorInfoForm.value["email"], this.doctorInfoForm.value["birthDate"], this.doctorInfoForm.value["specialization"], this.doctorInfoForm.value["address"], this.doctorInfoForm.value["phoneNumber"]);
  }

  getPendingRequests(){
    this.doctorService.getPendingPatientRequests().subscribe(
      (response) => {
        this.pendingPatients = response;
      }
    )
  }

  onAccept(patientId: number){
    this.doctorService.acceptPatientRequest(patientId).subscribe(
      (response) => {
        this.getPendingRequests();
      }
    );
  }

  onDecline(patientId: number){
    this.doctorService.declinePatientRequest(patientId).subscribe(
      (response) => {
        this.getPendingRequests();
      }
    );
  }

  checkDate(){
    const date = new Date(this.doctorInfoForm.value["birthDate"])
    if(date < new Date('01-01-1900') || date > new Date(Date.now())){
      return true;
    }
    else{
      return false;
    }
  }
}
