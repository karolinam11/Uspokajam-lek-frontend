import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../shared/auth.service";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {

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
    });
    this.authService.errorOccured.subscribe(
      (error) => {
        this.registerFailed = error
      }
    )
  }

  onSubmit() {
    this.authService.register(this.signUpForm.value["email"],
      this.signUpForm.value["password"],
      this.signUpForm.value["name"],
      this.signUpForm.value["surname"],
      this.signUpForm.value["birthDate"],
      "PATIENT")
  }

  checkDate(){
    const date = new Date(this.signUpForm.value["birthDate"])
    if(date < new Date('01-01-1900') || date > new Date(Date.now())){
     return true;
    }
    else{
      return false;
    }
  }

}
