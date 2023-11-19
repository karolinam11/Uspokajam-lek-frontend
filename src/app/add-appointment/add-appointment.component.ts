import { Component } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {DoctorService} from "../shared/doctor.service";

@Component({
  selector: 'app-add-appointment',
  templateUrl: './add-appointment.component.html',
  styleUrls: ['./add-appointment.component.css']
})
export class AddAppointmentComponent {
  addAppointmentForm: FormGroup
  addAppointmentFailed = false;
  constructor(private router: Router,
              private doctorService: DoctorService ) {
    this.addAppointmentForm = new FormGroup({
      date: new FormControl(""),
      startHour: new FormControl(""),
      endHour: new FormControl("")
    });
  }

  onSubmit(){
    const startVisitDate = new Date(this.addAppointmentForm.value['date'] + 'T' + this.addAppointmentForm.value['startHour'])
    const endVisitDate = new Date(this.addAppointmentForm.value['date'] + 'T' + this.addAppointmentForm.value['endHour'])
    if(startVisitDate > endVisitDate){
      this.addAppointmentFailed = true;
    }
    else if(startVisitDate < new Date(Date.now()) || endVisitDate < new Date(Date.now())){
      this.addAppointmentFailed = true;
    }
    else{
      this.doctorService.addAppointment(startVisitDate, endVisitDate).subscribe(
        (response) => {
          this.router.navigate(["patient-site/"+this.doctorService.selectedPatient.id])
        }
      )
    }
  }

}
