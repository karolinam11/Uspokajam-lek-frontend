import {Router} from "@angular/router";
import {Injectable} from "@angular/core";
import {BehaviorSubject, Subject} from "rxjs";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {User} from "../models/user";
import {Doctor} from "../models/doctor";
import {co} from "@fullcalendar/core/internal-common";

@Injectable()
export class AuthService {
  loggedIn: Subject<boolean> = new Subject();
  user = new BehaviorSubject<User | Doctor>(null) //emituje user albo doktor
  errorOccured: Subject<boolean> = new Subject();
  editSucceded: Subject<boolean>= new Subject(); //wysyła true albo false w zależności od tego czy udało się edytować
  constructor(private router: Router,
              private http: HttpClient) {
    const user = localStorage.getItem("loggedInUser");
    if (user === null) {
      this.loggedIn.next(false)
    } else {
      this.user.next(JSON.parse(user));
      this.loggedIn.next(true)
    }
    this.errorOccured.next(false);
  }

  login(email: string, password: string) {
    return this.http.post("http://localhost:8080/login", {email, password}, {observe: 'response'})
      .subscribe(
        (response: HttpResponse<any>) => {
          this.loggedIn.next(true);
          let user: User | Doctor = null;
          if(response.body.user.role === 'PATIENT'){
            user = new User(response.body.user.id, response.body.user.email, response.body.user.name, response.body.user.surname, response.body.user.birthDate, response.body.user.role, response.body.token)
            this.router.navigate(["user-page"])
          }
          else{
            user = new Doctor(response.body.user.id, response.body.user.email, response.body.user.name, response.body.user.surname, response.body.user.birthDate, response.body.user.role, response.body.token, response.body.user.specialization, response.body.user.address,response.body.user.phoneNumber, response.body.user.invitationCode)
            this.router.navigate(["doctor-page"])
          }
          localStorage.setItem("loggedInUser", JSON.stringify(user))
          this.user.next(user);
        },
        (error) => {
          this.errorOccured.next(true);
        });
  }

  register(email: string, password: string, name: string, surname: string, birthDate: Date, role: string) {
    this.http.post("http://localhost:8080/signup", {
      email,
      password,
      name,
      surname,
      birthDate,
      role
    }, {observe: 'response'})
      .subscribe(
        (response: HttpResponse<any>) => {
          this.loggedIn.next(true);
          const user = new User(response.body.id, response.body.email, response.body.name, response.body.surname, response.body.birthDate, response.body.role, response.body.token)
          localStorage.setItem("loggedInUser", JSON.stringify(user))
          this.router.navigate(["user-page"])
          this.user.next(user);
        },
        (error) => {
          this.errorOccured.next(true);
        });
  }

  registerDoctor(email: string, password: string, name: string, surname: string, birthDate: Date, specialization: string, address: string, phoneNumber: string, role: string) {
    this.http.post("http://localhost:8080/doctor/signup-doctor", {
      email,
      password,
      name,
      surname,
      birthDate,
      specialization,
      address,
      phoneNumber,
      role
    }, {observe: 'response'})
      .subscribe(
        (response: HttpResponse<any>) => {
          this.loggedIn.next(true);
          const user = new Doctor(response.body.id, response.body.email, response.body.name, response.body.surname, response.body.birthDate, response.body.role, response.body.token, response.body.specialization, response.body.address,response.body.phoneNumber, response.body.invitationCode)
          localStorage.setItem("loggedInUser", JSON.stringify(user))
          this.router.navigate(["doctor-page"])
          this.user.next(user)
        },
        (error) => {
          this.errorOccured.next(true);
        });
  }

  logout() {
    this.loggedIn.next(false);
    this.user.next(null);
    this.router.navigate([""])
    localStorage.removeItem("loggedInUser")
  }

  editAccount(name, surname, email, birthDate) {
    this.http.put("http://localhost:8080/edit-account", {
      userId: this.user.value,
      name: name,
      surname: surname,
      email: email,
      birthDate: birthDate
    },{observe: 'response'}) //sprawdzam status odpowiedzi, ok, not found...
      .subscribe(
        (response: HttpResponse<any>) => {
          const user = new User(response.body.id, response.body.email, response.body.name, response.body.surname, response.body.birthDate, response.body.role, response.body.token)
          localStorage.setItem("loggedInUser", JSON.stringify(user)) //zapisuję w pamięci przeglądarki żeby przy odświeżaniu dalej było zapisane
          this.user.next(user)
          this.editSucceded.next(true);
        },
        (error) => {
          this.errorOccured.next(true);
        });
  }

  editDoctorAccount(name, surname, email, birthDate, specialization, address, phoneNumber) {
    this.http.put("http://localhost:8080/edit-doctor-account", {
      userId: this.user.value,
      name: name,
      surname: surname,
      email: email,
      birthDate: birthDate,
      specialization: specialization,
      address: address,
      phoneNumber: phoneNumber
    },{observe: 'response'})
      .subscribe(
        (response: HttpResponse<any>) => {
          const user = new Doctor(response.body.id, response.body.email, response.body.name, response.body.surname, response.body.birthDate, response.body.role, response.body.token, response.body.specialization, response.body.address,response.body.phoneNumber, response.body.invitationCode)
          localStorage.setItem("loggedInUser", JSON.stringify(user))
          this.user.next(user)
          this.editSucceded.next(true);
        },
        (error) => {
          this.errorOccured.next(true);
        });
  }
}
