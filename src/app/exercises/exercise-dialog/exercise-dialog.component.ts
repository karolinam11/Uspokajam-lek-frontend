import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Exercise} from "../../models/exercise";
import {FormControl, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-exercise-dialog',
  templateUrl: './exercise-dialog.component.html',
  styleUrls: ['./exercise-dialog.component.css']
})
export class ExerciseDialogComponent {
  addExerciseForm: FormGroup;
  constructor(@Inject(MAT_DIALOG_DATA) public data: {exercise ?: Exercise, mode: string},
              public dialogRef: MatDialogRef<ExerciseDialogComponent>) {
    if(data.mode !== "ADD"){
      data.exercise.description = data.exercise.description.replace(/\n/g, "<br>")
      this.addExerciseForm = new FormGroup({
        name: new FormControl(data.exercise.name),
        description: new FormControl(data.exercise.description),
        duration: new FormControl(data.exercise.duration),
        category: new FormControl(data.exercise.category),
      });
    }
    else{
      this.addExerciseForm = new FormGroup({
        name: new FormControl(''),
        description: new FormControl(''),
        duration: new FormControl(''),
        category: new FormControl(''),
      });
    }
  }

  onCloseDialog(action: string){
    if(action === "DELETE"){
      this.dialogRef.close('DELETE')
    } else if(action === "ADD") {
      const exercise = new Exercise(null, this.addExerciseForm.value['name'],
        this.addExerciseForm.value['description'],
        this.addExerciseForm.value['duration'],
        this.addExerciseForm.value['category'],
        null
        )
      this.dialogRef.close(exercise)
    }
    else if(action === "SAVE") {
      const updatedExercise = this.data.exercise
      updatedExercise.name = this.addExerciseForm.value['name']
      updatedExercise.description = this.addExerciseForm.value['description']
      updatedExercise.category = this.addExerciseForm.value['category']
      updatedExercise.duration = this.addExerciseForm.value['duration']
      this.dialogRef.close(updatedExercise)
    } else {
      this.dialogRef.close()
    }
  }


}
