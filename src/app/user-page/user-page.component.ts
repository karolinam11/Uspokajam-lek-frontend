import {Component, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Router} from "@angular/router";
import {Activity} from "../models/activity";
import {ActivityService} from "../shared/activity.service";
import {DailyReportService} from "../shared/daily.report.service";
import {DailyReport} from "../models/dailyReport";
import {Appointment} from "../models/appointment";
import {PatientService} from "../shared/patient.service";
import {AssignedExercise} from "../models/assignedExercise";
import {ExerciseService} from "../shared/exercise.service";
import {AuthService} from "../shared/auth.service";
import {NotificationService} from "../shared/notification.service";
import {Exercise} from "../models/exercise";
import {ExerciseDialogComponent} from "../exercises/exercise-dialog/exercise-dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent {
  @ViewChild("dateInput") dateInput;
  @ViewChild("note") note;
  currentDate = new Date()
  activitiesForm: FormGroup;
  exercisesToDo: AssignedExercise[] = []
  exercisesDone: AssignedExercise[] = []
  selectedMood: string | null = null;
  dailyReportFailed = false;
  futureAppointments: Appointment[] = [];
  invalidDate = false;

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              private dialog: MatDialog,
              private activityService: ActivityService,
              private dailyReportService: DailyReportService,
              private exerciseService: ExerciseService,
              private patientService: PatientService,
              private authService: AuthService,
              private notificationService: NotificationService) {
    this.activitiesForm = this.formBuilder.group({
      moods: this.formBuilder.array([]),
    });
    this.addEntry();
    patientService.getFutureAppointments().subscribe(
      (response) => {
        this.futureAppointments = response
      }
    )
    exerciseService.getPatientExercisesForToday(this.authService.user.value.id).subscribe(
      (response) =>{
        this.exercisesToDo = response
      }
    )
    this.getExercisesDoneLastWeek();
  }

  // Create a getter for the entries FormArray
  get moodsArray() {
    return this.activitiesForm.get('moods') as FormArray;
  }

  // Function to add a new mood and action control to the FormArray
  addEntry() {
    const newEntry = this.formBuilder.group({
      mood: new FormControl(''),
      action: new FormControl('')
    });

    this.moodsArray.push(newEntry);
  }

  // Function to remove an entry from the FormArray
  removeEntry(index: number) {
    this.moodsArray.removeAt(index);
  }

  // Function to submit the form
  submitForm() {
    if (this.activitiesForm.valid && this.selectedMood !== null && !this.invalidDate) {
      const activities = this.moodsArray.controls.map((entry, index) => {
        return new Activity(
          entry.get('action').value!,
          this.currentDate,
          entry.get('mood').value!
        )
      });
      if (activities.every(this.arePropertiesPresent)) {
        this.dailyReportService.addDailyReport(new DailyReport(this.currentDate, this.selectedMood, this.note.nativeElement.value))
          .subscribe(
            (response) => {
              this.dailyReportFailed = false;
            },
            (error) => {
              this.dailyReportFailed = true;
            }
          )
        activities.forEach(activity => this.activityService.addActivity(activity)
          .subscribe((response) => {
            this.activitiesForm.reset()
            const moodsArray = this.activitiesForm.get('moods') as FormArray;
            moodsArray.clear();
          }));
        this.note.nativeElement.value = ''
      }
    }
  }

  goToExercise(exercise: number) {
    this.router.navigate(["exercises/" + exercise])
  }

  onDateChange() {
    var dateSplitted = this.dateInput.nativeElement.value.split("-");
    this.currentDate.setDate(dateSplitted[2])
    this.currentDate.setMonth(dateSplitted[1] - 1)
    this.currentDate.setFullYear(dateSplitted[0])
    this.invalidDate = this.currentDate >= new Date() ;
  }

  onSelectMood(mood: string) {
    this.selectedMood = mood;
  }

  setExerciseToDone(exercise: AssignedExercise){
    this.exerciseService.setExerciseToDone(exercise)
      .subscribe(
        (response) => {
          this.getPatientExercises();
        }
      )
  }

  arePropertiesPresent(activity: Activity): boolean {
    return activity.name !== '' && activity.mood !== '';
  }

  getPatientExercises(){
    this.exerciseService.getPatientExercisesForToday(this.authService.user.value.id).subscribe(
      (response) =>{
        this.exercisesToDo = response
      }
    )
  }

  getExercisesDoneLastWeek(){
    this.exerciseService.getPatientExercisesDoneLastWeek().subscribe(
      (response) => {
        this.exercisesDone = response
      }
    )
  }

  onSelectExercise(exercise: Exercise) {
    const userId = this.authService.user.value.id;
    var mode = "SHOW";
    let dialogRef = this.dialog.open(ExerciseDialogComponent, {
      data: {
        exercise: exercise,
        mode: mode
      }
    });
  }

  private dateTimeToDate(date: Date): Date{
    date.setHours(0, 0, 0, 0);
    return date;
  }


}
