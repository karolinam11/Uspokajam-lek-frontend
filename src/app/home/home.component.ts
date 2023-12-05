import { Component } from '@angular/core';
import {AuthService} from "../shared/auth.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  loggedIn = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.loggedIn = this.authService.user.value !== null;
      }
  onLogout() {
    this.authService.logout()
  }

}
