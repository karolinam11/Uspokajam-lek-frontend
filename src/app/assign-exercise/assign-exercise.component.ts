import { Component } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {ExerciseService} from "../shared/exercise.service";
import {Exercise} from "../models/exercise";
import {DoctorService} from "../shared/doctor.service";

@Component({
  selector: 'app-assign-exercise',
  templateUrl: './assign-exercise.component.html',
  styleUrls: ['./assign-exercise.component.css']
})
export class AssignExerciseComponent {
  assignExerciseForm: FormGroup;
  exercises: Exercise[] = [];
  assignExerciseFailed = false;
  constructor(private router: Router,
              private exerciseService: ExerciseService,
              private doctorService: DoctorService) {
    this.assignExerciseForm = new FormGroup({
      exercise: new FormControl(""),
      date: new FormControl(""),
    });
    this.exerciseService.getExercises()
      .subscribe(
        (response) => {
          this.exercises = response
        }
      )
  }

  onAssignExercise() {
    const date = new Date(this.assignExerciseForm.value['date'])
    if (date.getDate() < new Date(Date.now()).getDate()) {
      this.assignExerciseFailed = true;
    } else {
      this.doctorService.assignExercise(this.assignExerciseForm.value["exercise"], this.assignExerciseForm.value["date"])
        .subscribe(
          (response) => {
            this.router.navigate(["patient-site/" + this.doctorService.selectedPatient.id])
          }
        )
    }
  }

}
