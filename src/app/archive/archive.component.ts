import {Component} from '@angular/core';
import {DailyReport} from "../models/dailyReport";
import {DailyReportService} from "../shared/daily.report.service";
import {ActivityService} from "../shared/activity.service";
import {Activity} from "../models/activity";
import {ConfirmationDialogComponent} from "../confirmation-dialog/confirmation-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../shared/auth.service";

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.css']
})
export class ArchiveComponent {

  reports: DailyReport[] = [];
  selectedReport: DailyReport| null = null;
  activities: Activity[] = [];

  constructor(private dailyReportService: DailyReportService,
              private activityService: ActivityService,
              private dialog: MatDialog,
              private activatedRoute: ActivatedRoute,
              private authService: AuthService) {
    this.checkForId();
    this.getDailyReports();
    this.activityService.getActivities().subscribe(
      (response) =>{
        this.activities = response;
      }
    )
  }

  onClickDailyReport(report: DailyReport){
    this.selectedReport = report;
  }

  mapEmotionNameToEmoji(emotion: string){
    if (emotion === "terrible"){
      return ["😣", 'Okropnie']
    }
    else if (emotion === "bad"){
      return ["🙁", 'Źle']
    }
     else if (emotion === "neutral"){
      return ["🫤", 'Średnio']
    }
    else if (emotion === "good"){
      return ["🙂", 'Dobrze']
    }
    else if (emotion === "excellent"){
      return ["😄", 'Wspaniale']
    }
    else {
      return []
    }
  }

  filterActivities(){
    let list = this.activities.filter(activity => {
      return activity.date == this.selectedReport.date
    })
    return list;
  }

  getDailyReports(){
    this.dailyReportService.getDailyReportsForUser().subscribe(
      (response) =>{
        this.reports = response;
        if(this.reports.length >=1){
          this.selectedReport = this.reports[0];
        }
      }
    )
  }

  openConfirmationDialogDailyReport(reportId: number) {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: 'Czy na pewno chcesz usunąć raport?'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        this.dailyReportService.removeDailyReport(reportId).subscribe(
          (res) => {
            this.getDailyReports();
          }
        )
      }
    });
  }

  checkForId() {
    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      return this.activatedRoute.snapshot.paramMap.get('id')
    }
    return this.authService.user.value.id
  }

}
