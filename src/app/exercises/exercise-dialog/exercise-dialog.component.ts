import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Exercise} from "../../models/exercise";
import {FormControl, FormGroup} from "@angular/forms";
import {interval, Subscription} from "rxjs";

@Component({
  selector: 'app-exercise-dialog',
  templateUrl: './exercise-dialog.component.html',
  styleUrls: ['./exercise-dialog.component.css']
})
export class ExerciseDialogComponent {
  addExerciseForm: FormGroup;
  timer: number = 0;
  timerSubscription: Subscription;
  timerFormatted: string = '00:00';
  constructor(@Inject(MAT_DIALOG_DATA) public data: {exercise ?: Exercise, mode: string},
              public dialogRef: MatDialogRef<ExerciseDialogComponent>) {
    if(data.mode !== "ADD"){
      data.exercise.description = data.exercise.description.replace(/\n/g, "<br>")
      this.addExerciseForm = new FormGroup({
        name: new FormControl(data.exercise.name),
        description: new FormControl(data.exercise.description),
        duration: new FormControl(data.exercise.duration),
        time: new FormControl(data.exercise.time),
        category: new FormControl(data.exercise.category),
      });
      this.timerFormatted = this.formatTime(data.exercise.time * 60)
      this.timer = data.exercise.time * 60
    }
    else{
      this.addExerciseForm = new FormGroup({
        name: new FormControl(''),
        description: new FormControl(''),
        duration: new FormControl(''),
        time: new FormControl(''),
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
        this.addExerciseForm.value['time'],
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
      updatedExercise.time = this.addExerciseForm.value['time']
      this.dialogRef.close(updatedExercise)
    } else {
      this.dialogRef.close()
    }
  }

  onStartTimer() {
    this.startTimer();
  }

  onStopTimer() {
    this.stopTimer();
  }

  private startTimer() {
    this.timerSubscription = interval(1000).subscribe(() => {
      if (this.timer > 0) {
        this.timer--;
        this.timerFormatted = this.formatTime(this.timer);
      } else {
        this.stopTimer();
        // Optionally, you can perform some action when the timer reaches 0
        console.log('Timer reached 0');
      }
    });
  }

  private stopTimer() {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  private formatTime(seconds: number): string {
    const minutes: number = Math.floor(seconds / 60);
    const remainingSeconds: number = seconds % 60;
    const minutesString: string = minutes < 10 ? '0' + minutes : minutes.toString();
    const secondsString: string = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds.toString();
    return `${minutesString}:${secondsString}`;
  }


}
