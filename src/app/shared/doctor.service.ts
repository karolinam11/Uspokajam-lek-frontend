import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {User} from "../models/user";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {Appointment} from "../models/appointment";
import {DatePipe, Time} from "@angular/common";

@Injectable()
export class DoctorService{

  selectedPatient: User | null = null;
  constructor(private http: HttpClient,
              private datePipe: DatePipe,
              private authService: AuthService) {

    const user = localStorage.getItem("selectedPatient");
    if(user !== null){
      this.selectedPatient = JSON.parse(user);
    }
  }

  onSelectPatient(patient: User){
    this.selectedPatient = patient
    localStorage.setItem("selectedPatient", JSON.stringify(patient))

  }

  getPatients(){
    return this.http.get<User[]>("http://localhost:8080/doctor/patients?id=" + this.authService.user.value.id)
  }

  getFutureAppointments(){
    return this.http.get<Appointment[]>("http://localhost:8080/doctor-appointments?id="+ this.authService.user.value.id)
  }

  addAppointment(startVisitDate: Date, endVisitDate: Date){
    return this.http.post("http://localhost:8080/add-appointment", {
      doctorId: this.authService.user.value.id,
        patientId: this.selectedPatient.id,
      visitStartDate: this.datePipe.transform(startVisitDate, 'yyyy-MM-ddTHH:mm:ss'),
      visitEndDate: this.datePipe.transform(endVisitDate, 'yyyy-MM-ddTHH:mm:ss')})
  }

  assignExercise(exerciseId: number, date: Date){
    return this.http.post("http://localhost:8080/assign-exercise",{doctorId: this.authService.user.value.id, patientId: this.selectedPatient.id, dueDate: date, exerciseId: exerciseId})
  }

  removeAppointment(appointmentId: number){
    return this.http.delete("http://localhost:8080/remove-appointment?id="+ appointmentId);
  }

  removeAssignedExercise(exerciseId: number){
    return this.http.delete("http://localhost:8080/remove-assigned-exercise?id="+ exerciseId);
  }

  getPendingPatientRequests(){
    return this.http.get<User[]>("http://localhost:8080/doctor/pending-requests?id="+ this.authService.user.value.id);
  }

  acceptPatientRequest(patientId: number){
    return this.http.post("http://localhost:8080/doctor/accept-pending-request", {patientId: patientId, doctorId: this.authService.user.value.id});
  }

 declinePatientRequest(patientId: number){
    return this.http.post("http://localhost:8080/decline-pending-request", {patientId: patientId, doctorId: this.authService.user.value.id});
  }

}
