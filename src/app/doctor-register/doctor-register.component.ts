import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../shared/auth.service";

@Component({
  selector: 'app-doctor-register',
  templateUrl: './doctor-register.component.html',
  styleUrls: ['./doctor-register.component.css']
})
export class DoctorRegisterComponent {
  signUpForm: FormGroup
  registerFailed = false;
  constructor(private router: Router,
              private authService: AuthService) {
    this.signUpForm = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", Validators.required),
      secondPassword: new FormControl("", Validators.required),
      name: new FormControl("", Validators.required),
      surname: new FormControl("", Validators.required),
      birthDate: new FormControl(""),
      specialization: new FormControl("", Validators.required),
      address: new FormControl("", Validators.required),
      phoneNumber: new FormControl("", Validators.required),
    });
    this.authService.errorOccured.subscribe(
      (error) => {
        this.registerFailed = error
      }
    )
  }

  onSubmit() {
    this.authService.registerDoctor(this.signUpForm.value["email"],
      this.signUpForm.value["password"],
      this.signUpForm.value["name"],
      this.signUpForm.value["surname"],
      this.signUpForm.value["birthDate"],
      this.signUpForm.value["specialization"],
      this.signUpForm.value["address"],
      this.signUpForm.value["phoneNumber"],
      "DOCTOR")
  }


}
