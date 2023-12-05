import {HttpClient} from "@angular/common/http";
import {Subject} from "rxjs";
import {Exercise} from "../models/exercise";
import {Injectable} from "@angular/core";
import {AuthService} from "./auth.service";
import {AssignedExercise} from "../models/assignedExercise";
import {Activity} from "../models/activity";
import {ex} from "@fullcalendar/core/internal-common";
import {User} from "../models/user";

@Injectable()
export class ExerciseService {

  constructor(private http: HttpClient,
              private authService: AuthService) {
  }

  addExercise(exercise: Exercise) {
    return this.http.post("http://localhost:8080/exercises/add", {
      id: exercise.id,
      name: exercise.name,
      description: exercise.description,
      category: exercise.category,
      createdBy: this.authService.user.value.id,
      duration: exercise.duration
    });
  }

  editExercise(exercise: Exercise) {
    return this.http.put("http://localhost:8080/exercises", {
      id: exercise.id,
      name: exercise.name,
      description: exercise.description,
      category: exercise.category,
      createdBy: exercise.createdBy.id,
      duration: exercise.duration
    });
  }

  deleteExercise(name: string){
    return this.http.delete("http://localhost:8080/exercises/delete?name=" + name)
  }

  getExercises() {
    return this.http.get<Exercise[]>("http://localhost:8080/exercises")
  }


  getPatientExercises(patientId: string) {
    return this.http.get<AssignedExercise[]>("http://localhost:8080/patient-assigned-exercises?id=" + patientId)
  }

  getPatientExercisesForToday(patientId: number) {
    return this.http.get<AssignedExercise[]>("http://localhost:8080/patient-assigned-exercises-today?id=" + patientId)
  }

  getPatientExercisesDoneLastWeek() {
    return this.http.get<AssignedExercise[]>("http://localhost:8080/exercises-done-last-week?id=" + this.authService.user.value.id)
  }

  setExerciseToDone(exercise: AssignedExercise) {
    return this.http.put("http://localhost:8080/set-exercise-status?id=" + exercise.id, {})
  }
}
