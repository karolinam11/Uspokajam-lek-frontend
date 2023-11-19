import {Injectable} from "@angular/core";
import {Activity} from "../models/activity";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {DatePipe} from "@angular/common";

@Injectable()
export class ActivityService {

  constructor(private http: HttpClient,
              private authService: AuthService) {
  }

  getActivities() {
    return this.http.get<Activity[]>("http://localhost:8080/activities?id=" + this.authService.user.value.id)
  }

  addActivity(activity: Activity) {
    return this.http.post("http://localhost:8080/activities/add", {name: activity.name, date: activity.date, mood: activity.mood, userId: this.authService.user.value.id})
  }
}
