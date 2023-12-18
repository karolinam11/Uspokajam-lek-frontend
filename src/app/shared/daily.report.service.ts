import {HttpClient} from "@angular/common/http";
import {DailyReport} from "../models/dailyReport";
import {Injectable} from "@angular/core";
import {AuthService} from "./auth.service";

@Injectable()
export class DailyReportService{
  constructor(private http: HttpClient,
              private authService: AuthService) {
  }

  addDailyReport(dailyReport: DailyReport){
    return this.http.post("http://localhost:8080/daily-reports/add", {mood: dailyReport.mood, date: dailyReport.date, note: dailyReport.note})
  }

  getDailyReportsForUser(){
    return this.http.get<DailyReport[]>("http://localhost:8080/daily-reports?id=" + this.authService.user.value.id);
  }f

  remove
  removeDailyReport(reportId: number){
    return this.http.delete("http://localhost:8080/daily-reports/delete?id=" + reportId)
}
}
