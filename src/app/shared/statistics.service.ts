import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "./auth.service";
import {Mood} from "../models/mood";

@Injectable()
export class StatisticsService{

  constructor(private http: HttpClient,
              private authService: AuthService) {
  }

  getMoods(numOfDays: number, userId?: number){
    if(userId === null){
      userId = this.authService.user.value.id
    }
    return this.http.post<Mood[]>("http://localhost:8080/daily-reports/moods",{numOfDays: numOfDays, userId: userId})
  }

  getMoodsQuantity(days: number, userId ?: number){
    if(userId === null){
      userId = this.authService.user.value.id
    }
    return this.http.get<number[]>("http://localhost:8080/daily-reports/moods-quantity?userId=" + userId +"&days=" + days)
  }

  getLongestStreak(){
    return this.http.get<number>("http://localhost:8080/daily-reports/longest-streak?userId=" + this.authService.user.value.id)
  }

  getCurrentStreak(){
    return this.http.get<number>("http://localhost:8080/daily-reports/current-streak?userId=" + this.authService.user.value.id)
  }

}
