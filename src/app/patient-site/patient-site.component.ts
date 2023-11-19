import {Component} from '@angular/core';
import {DoctorService} from "../shared/doctor.service";
import {ActivatedRoute, Router} from "@angular/router";
import {User} from "../models/user";
import {PatientService} from "../shared/patient.service";
import {Appointment} from "../models/appointment";
import {ExerciseService} from "../shared/exercise.service";
import { MatDialog } from '@angular/material/dialog';
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog.component";
import {AssignedExercise} from "../models/assignedExercise";

@Component({
  selector: 'app-patient-site',
  templateUrl: './patient-site.component.html',
  styleUrls: ['./patient-site.component.css']
})
export class PatientSiteComponent {

  patient: User | null = null;
  futureAppointments: Appointment[] = [];
  pastAppointments: Appointment[] = [];
  isContentLoaded = false;
  assignedExercises: AssignedExercise[] = [];
  constructor(private doctorService: DoctorService,
              private patientService: PatientService,
              private activatedRoute: ActivatedRoute,
              private exerciseService: ExerciseService,
              private router: Router,
              private dialog: MatDialog
) {
    this.checkForId()
    this.getFutureAppointments()
    patientService.getPastAppointments().subscribe(
      (response) => {
        this.pastAppointments = response
      }
    )
    this.getAssignedExercises()
  }

  checkForId() {
    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      this.doctorService.getPatients().subscribe(
        (response) => {
          this.patient = response.filter(patient => {
            return +this.activatedRoute.snapshot.paramMap.get('id') === patient.id
          })[0]
          this.isContentLoaded=true
        }
      )
    }
  }

  onAddAppointment(){
    this.doctorService.selectedPatient = this.patient
    this.router.navigate(["add-appointment"])
  }

  onAssignExercise(){
    this.doctorService.selectedPatient = this.patient
    this.router.navigate(["assign-exercise"])
  }

  onCheckStatistics(){
    this.router.navigate(["statistics/" + this.patient.id ])
  }

  openConfirmationDialogAppointment(appointmentId: number) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: 'Czy na pewno chcesz odwołać wizytę?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
         this.doctorService.removeAppointment(appointmentId).subscribe(
           (response) => {
             this.getFutureAppointments()
           }
         )
      }
    });
  }

  openConfirmationDialogExercise(exerciseId: number) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: 'Czy na pewno chcesz usunąć ćwiczenie?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.doctorService.removeAssignedExercise(exerciseId).subscribe(
          (response) => {
            this.getAssignedExercises()
          }
        )
      }
    });
  }

  getFutureAppointments(){
    this.patientService.getFutureAppointments().subscribe(
      (response) => {
        this.futureAppointments = response
      }
    )
  }

  getAssignedExercises(){
    this.exerciseService.getPatientExercisesForToday(this.doctorService.selectedPatient.id).subscribe(
      (response) => {
        this.assignedExercises = response
      }
    )
  }

}
