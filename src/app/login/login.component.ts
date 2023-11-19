import { Component } from '@angular/core';
import {FormControl, FormGroup, NgForm, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../shared/auth.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm: FormGroup
  loginFailed = false;
  constructor(private router: Router,
              private authService: AuthService) {
    this.loginForm = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", Validators.required)
    });
    this.authService.errorOccured.subscribe(
      (error) => {
        this.loginFailed = error
      }
    )
  }

  onSubmit(){
    this.authService.login(this.loginForm.value["email"], this.loginForm.value["password"])
  }


}
