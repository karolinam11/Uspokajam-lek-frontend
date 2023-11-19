import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {PatientService} from "./patient.service";
import {DatePipe} from "@angular/common";
import {AuthService} from "./auth.service";
import {ExerciseService} from "./exercise.service";
import {AssignedExercise} from "../models/assignedExercise";
import {BehaviorSubject} from "rxjs";

@Injectable()
export class NotificationService {
  notifications: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);

  constructor(private http: HttpClient,
              private patientService: PatientService,
              private datePipe: DatePipe,
              private authService: AuthService,
              private exerciseService: ExerciseService) {
    if(this.authService.user.value !== null){ //jeśli użytkownik jest zalogowany to pobieram notifications
      this.getNotifications();
    }
  }


  private getDateXDaysBefore(x: number) {
    var date = new Date();
    var days = 86400000 //liczba sekund w dniu
    return new Date(date.getTime() - (x * days)) //nowa data to data powiększona albo zmniejszona o ilość dni
  }

  getNotifications(){
    this.patientService.getFutureAppointments() //dla danego pacjenta biorę wizyty
      .subscribe(
        (response) => {
          const futureAppointemnts = response.filter(appointment => new Date(appointment.visitStartDate) < this.getDateXDaysBefore(-2)) //pobieram tylko takie wizyty które są 2 dni do przodu
          const notificationText = futureAppointemnts.map(appointment => 'Przypominamy o nadchodzącej wizycie lekarskiej: ' +
            'Data: ' + this.datePipe.transform(appointment.visitStartDate, 'dd-MM-YYYY') +
            ' Godzina: ' + this.datePipe.transform(appointment.visitStartDate, 'hh:MM') +
            ' Lekarz: ' + appointment.doctor.name + ' ' + appointment.doctor.surname)
          const updatedNotifications = this.notifications.value
          updatedNotifications.push(...notificationText) //do wcześniejszych powiadomień dodaję powiadomienia o przyszłych wizytach
          this.notifications.next(updatedNotifications) //wysyłam do headera
        }
      )
    this.http.get<boolean>("http://localhost:8080/daily-reports-today?id=" + this.authService.user.value.id) //zwraca prawdę albo fałsz w zależności od tego czy użytkownik już zrobił raport
      .subscribe(
        (response) => {
          if(response){ //jesli nie został zrobioy raport wysyłane jest powiadomienie
            const updatedNotifications = this.notifications.value
            updatedNotifications.push('Pamiętaj o uzupełnieniu raportu codziennego!')
            this.notifications.next(updatedNotifications)
          }
        }
      )
    this.exerciseService.getPatientExercisesForToday(this.authService.user.value.id)
      .subscribe(
        (response) => {
          const exercisesAssigned = response.length //liczba zadanych ćwiczeń na dzisiejszy dzień
          const exercisesToDo = response.filter( exercise => !exercise.isDone) //filtruje liste zadań i bierzemy tylko niezrobione
          const updatedNotifications = this.notifications.value
          if(exercisesToDo.length == 0 && exercisesAssigned >0) { //jeżeli są zrobione wszystkie na dzisiaj więc sprawdzamy czy były jakieś na dzisiaj do zrobienia
            updatedNotifications.push('Świetna robota, wszystkie zadania na dziś zostały wykonane!')
            this.notifications.next(updatedNotifications)
          }
          else{
            updatedNotifications.push(...exercisesToDo.map(exercise => {
              return "Pamiętaj o wykonaniu dzisiaj ćwiczenia o nazwie: " + exercise.exercise.name + " zadanego przez "  + exercise.assignedBy.name + " " + exercise.assignedBy.surname
            }))
            this.notifications.next(updatedNotifications)
          }
        }
      )
    this.http.get<AssignedExercise[]>("http://localhost:8080/patient-new-assigned-exercises?id=" + this.authService.user.value.id)
      .subscribe(
        (response) => {
          const notificationText = response.map(assignedExercise => 'Lekarz ' + assignedExercise.assignedBy.name +  ' '
            + assignedExercise.assignedBy.surname + ' zadał ci nowe ćwiczenie. ' +
            + 'Ćwiczenie: ' + assignedExercise.exercise.name +
            ' Termin: ' + this.datePipe.transform(assignedExercise.dueDate, 'DD-MM-YYYY HH:mm'))
          const updatedNotifications = this.notifications.value
          notificationText.forEach( notification => updatedNotifications.push(notification));
          this.notifications.next(updatedNotifications)
        }
      )
  }

}
