import {Component} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../shared/auth.service";
import {Exercise} from "../models/exercise";
import {ExerciseService} from "../shared/exercise.service";
import {PatientService} from "../shared/patient.service";
import {MatDialog} from "@angular/material/dialog";
import {ExerciseDialogComponent} from "./exercise-dialog/exercise-dialog.component";

@Component({
  selector: 'app-exercises',
  templateUrl: './exercises.component.html',
  styleUrls: ['./exercises.component.css']
})
export class ExercisesComponent {

  exerciseForm: FormGroup
  exercises: Exercise[] = []
  filteredExercises: Exercise[] = []
  role = null;
  myTherapists: number[] = []
  filterTherapist = false;
  isContentLoaded = false;

  constructor(private exerciseService: ExerciseService,
              private activatedRoute: ActivatedRoute,
              private authService: AuthService,
              private patientService: PatientService,
              private dialog: MatDialog) {
    this.getExercises();
    this.patientService.getMyDoctors()
      .subscribe(
        (res) => {
          this.myTherapists = res.map(doctor => doctor.id)
        }
      )
    this.exerciseForm = new FormGroup({
      name: new FormControl(""),
      duration: new FormControl(""),
      category: new FormControl(""),
    });
    this.authService.user.subscribe(response => {
      this.role = response.role
    })
  }

  onSelectExercise(exercise: Exercise) {
    const userId = this.authService.user.value.id;
    var mode = "SHOW";
    if (exercise.createdBy?.id !== undefined && userId === exercise.createdBy.id && this.role === "DOCTOR") {
      mode = "EDIT"
    }
    let dialogRef = this.dialog.open(ExerciseDialogComponent, {
      data: {
        exercise: exercise,
        mode: mode
      },
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (mode !== 'SHOW' && this.role === "DOCTOR" && exercise.createdBy.id === this.authService.user.value.id) {
        if (result === "DELETE") {
          this.exerciseService.deleteExercise(exercise.name).subscribe()
        } else if (mode == "EDIT") {
          this.exerciseService.editExercise(result).subscribe();
        }
      }
      this.getExercises();
    });
  }

  onAddExercise() {
    const mode = "ADD"
    let dialogRef = this.dialog.open(ExerciseDialogComponent, {
      data: {
        mode: mode
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== 'CLOSE') {
        this.exerciseService.addExercise(result).subscribe();
        this.getExercises();
      }
    });
  }


  onFilter() {
    const duration = this.exerciseForm.value['duration'];
    const name = this.exerciseForm.value['name'];
    const category = this.exerciseForm.value['category'];

    this.filteredExercises = this.exercises.filter(ex => {
      const filterByName = name === '' || ex.name.toLowerCase().includes(name.toLowerCase());
      const filterByCategory = category === '' || ex.category.toLowerCase() === category.toLowerCase();
      const filterByDuration = duration === '' || ex.duration === duration;
      const filterByTherapist = (!this.filterTherapist && this.myTherapists.length > 0) || (!!ex.createdBy && this.myTherapists.includes(ex.createdBy.id))

      return filterByName && filterByCategory && filterByDuration && filterByTherapist;
    });
  }

  onFilterTherapist() {
    this.filterTherapist = !this.filterTherapist
    this.onFilter()
  }

  getExercises() {
    setTimeout(() => {
      this.exerciseService.getExercises().subscribe(
        newValue => {
          this.exercises = newValue;
          this.filteredExercises = newValue;
          this.isContentLoaded = true;
        }
      );
    }, 500)
  }

  getCategories(){
    return new Set(this.exercises.map(ex => ex.category));
  }
}
