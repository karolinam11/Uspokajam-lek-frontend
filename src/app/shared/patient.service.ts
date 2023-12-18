import {Injectable} from "@angular/core";
import {Appointment} from "../models/appointment";
import {BehaviorSubject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {Doctor} from "../models/doctor";

@Injectable()
export class PatientService {
  constructor(private http: HttpClient,
              private authService: AuthService) {
  }

  getFutureAppointments(id ?: string) {
    if(id){
      return this.http.get<Appointment[]>("http://localhost:8080/patient-appointments?id=" + id)
    } else {
      return this.http.get<Appointment[]>("http://localhost:8080/patient-appointments?id=" + this.authService.user.value.id)
    }
  }

  getPastAppointments(id ?: string) {
    if(id){
      return this.http.get<Appointment[]>("http://localhost:8080/patient-past-appointments?id=" + id)
    } else {
      return this.http.get<Appointment[]>("http://localhost:8080/patient-past-appointments?id=" + this.authService.user.value.id)
    }
  }

  createDoctorRequest(invitationCode: string) {
    return this.http.post("http://localhost:8080/add-doctor-request", {
      patientId: this.authService.user.value.id,
      invitationCode: invitationCode
    })
  }

  getMyDoctors() {
    return this.http.get<Doctor[]>("http://localhost:8080/my-doctors/" + this.authService.user.value.id)
  }


}
