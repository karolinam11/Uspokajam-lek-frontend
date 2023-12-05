import {Component, ViewChild} from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";
import {ChartConfiguration, ChartData, ChartOptions} from "chart.js";
import {DatePipe} from "@angular/common";
import {BaseChartDirective} from "ng2-charts";
import {Activity} from "../models/activity";
import {ActivityService} from "../shared/activity.service";
import {StatisticsService} from "../shared/statistics.service";
import {ActivatedRoute} from "@angular/router";
import {AuthService} from "../shared/auth.service";

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css']
})
export class StatisticsComponent {
  statisticsForm: FormGroup;
  moodForm: FormGroup
  number: number = 1;
  longestStreakNumber: number = 1
  numOfDays = 7;
  selectedMood: string = ''
  activities: Activity[] = []
  moods = []
  moodsQuantity: number[] = []
  @ViewChild('myChart') myChart: BaseChartDirective;

  lineChartData: ChartConfiguration<'line'>['data'];
  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: number) => {
            // Replace the numeric values with corresponding string labels
            const labels = ['okropnie', 'źle', 'średnio', 'dobrze', 'wspaniale'];
            return labels[value] || '';
          }
        }
      }
    }
  };
  public barChartData: ChartData<'bar'> = {
    labels: ['okropnie', 'źle', 'średnio', 'dobrze', 'wspaniale'],
    datasets: [
      {data: this.moodsQuantity, label: 'Nastroje'},
    ],
  };
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        },
      },
    },
  };

  constructor(private datePipe: DatePipe,
              private activityService: ActivityService,
              private statisticsService: StatisticsService,
              private activatedRoute: ActivatedRoute,
              private authService: AuthService) {
    this.statisticsForm = new FormGroup({
      "time": new FormControl('week')
    })
    this.moodForm = new FormGroup({
      "mood": new FormControl('')
    })
    this.statisticsService.getMoods(this.numOfDays, +this.checkForId())
      .subscribe(
        (response) => {
          this.moods = response;
          this.moods = this.moods.sort( (a,b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            // @ts-ignore
            return dateA - dateB;
          })
          this.setupChartData();
        }
      )
    this.statisticsService.getMoodsQuantity(this.numOfDays, +this.checkForId()).subscribe(
      response => {
        console.log(response)
        this.moodsQuantity = response
        this.setupChartData();
      }
    )
  }

  checkForId() {
    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      return this.activatedRoute.snapshot.paramMap.get('id')
    }
    return this.authService.user.value.id
  }

  onSelectTime() {
    var choice = this.statisticsForm.value['time'];
    if (choice === 'week') {
      this.numOfDays = 7;
    } else {
      this.numOfDays = 30;
    }
    this.statisticsService.getMoods(this.numOfDays)
      .subscribe(
        (response) => {
          this.moods = response;
          this.moods = this.moods.sort( (a,b) => {
            const dateA = new Date(a.date);
            const dateB = new Date(b.date);
            // @ts-ignore
            return dateA - dateB;
          })
          this.setupChartData();
        }
      )
    this.getAssociatedActivities()
  }

  getLastWeek() {
    var lastWeek = []
    for (let i = 0; i < this.numOfDays; i++) {
      var date = this.getDateXDaysBefore(i)
      lastWeek.push(this.datePipe.transform(date, 'dd-MM-yyyy'));
    }
    return lastWeek.reverse();
  }

  getDateXDaysBefore(x: number){
    var date = new Date();
    var days = 86400000 //number of milliseconds in a day
    return new Date(date.getTime() - (x*days))
  }


  setupChartData() {
    this.lineChartData = {
      labels:
        this.getLastWeek()
      ,
      datasets: [
        {
          data: this.processMoods(),
          label: 'Nastroje w ostatnim tygodniu',
          fill: false,
          tension: 0.5,
          backgroundColor: 'rgba(255,0,0,0.3)',
          spanGaps: true
        }
      ]
    };

    this.barChartData = {
      labels: ['okropnie', 'źle', 'średnio', 'dobrze', 'wspaniale'],
      datasets: [
        {data: this.moodsQuantity, label: 'Nastroje'},
      ],
    };
  }

  onSelectMood() {
    this.selectedMood = this.moodForm.value['mood'];
    this.getAssociatedActivities();
  }

  getAssociatedActivities() {
    const daysBefore = new Date();
    daysBefore.setTime(daysBefore.getTime() - this.numOfDays * 86400000 );
    this.activityService.getActivities().subscribe(
      (response) => {
        this.activities = response.filter(activity => {
          return new Date(activity.date) >= new Date(daysBefore) && activity.mood === this.selectedMood;
        })
      }
    )
  }
  processMoods() {
    var moodsAsNumbers = []
    var begginingDay = this.getDateXDaysBefore(this.numOfDays-1);
    var startingIndex = 0;
    for(let i=0; i< this.numOfDays; i++){
      if(startingIndex < this.moods.length && this.datePipe.transform(this.moods[startingIndex].date, 'dd-MM-yyyy') === this.datePipe.transform(begginingDay,'dd-MM-yyyy')){
        moodsAsNumbers.push(this.mapMoodToNumber(this.moods[startingIndex].name))
        startingIndex++;
      }
      else{
        moodsAsNumbers.push(null);
      }
      begginingDay.setTime(begginingDay.getTime() + 86400000);
    }
    return moodsAsNumbers;
  }


  mapMoodToNumber(mood: string){
      if (mood === 'terrible') {
        return 0;
      }
      else if (mood === 'bad') {
        return 1;
      }
      else if (mood === 'neutral') {
        return 2;
      }
      else if (mood === 'good') {
        return 3;
      }
      else if (mood === 'excellent') {
        return 4;
      }
      return null;
    }

    getActivitiesWithQuantity(){
      const activityQuantityMap = new Map<string, number>();

      this.activities.forEach((activity) => {
        const activityName = activity.name;

        if (activityQuantityMap.has(activityName)) {
          activityQuantityMap.set(activityName, activityQuantityMap.get(activityName)! + 1);
        } else {
          activityQuantityMap.set(activityName, 1);
        }
      });

      return activityQuantityMap;
    }
}
