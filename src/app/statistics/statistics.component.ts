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
  activityForm: FormGroup
  moodForm: FormGroup
  selectedMood: string = ''
  number ?: number
  longestStreakNumber?: number
  numOfDays = 7;
  selectedActivity: string = ''
  activities: Activity[] = []
  associatedActivites: Activity[] = []
  moods = []
  moodsQuantity: number[] = []
  activityMoodsQuantity: number[] = []
  @ViewChild('myChart') myChart: BaseChartDirective;

  lineChartData: ChartConfiguration<'line'>['data'];
  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      tooltip: {
        enabled: false
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Data'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Emocja przewodnia'
        },
        beginAtZero: true,
        ticks: {
          callback: (value: number) => {
            const labels = ['okropnie', 'źle', 'średnio', 'dobrze', 'wspaniale'];
            return labels[value] || '';
          }
        }
      }
    },
  };
  public activityChartData: ChartData<'bar'> = {
    labels: ['okropnie', 'źle', 'średnio', 'dobrze', 'wspaniale'],
    datasets: [
      {data: this.activityMoodsQuantity, label: 'Nastroje'},
    ],
  };
  public activityChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Data'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Emocja przewodnia'
        },
      },
    },
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
      x: {
        title: {
          display: true,
          text: 'Data'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Emocja przewodnia'
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
    this.activityForm = new FormGroup({
      "name": new FormControl('')
    })
    this.moodForm = new FormGroup({
      "mood": new FormControl('')
    })
    this.getMoods();
    this.getMoodsQuantity();
    this.getLongestStreak();
    this.getCurrentStreak();
    this.getActivities();
  }

  checkForId() {
    if (this.activatedRoute.snapshot.paramMap.get('id')) {
      return this.activatedRoute.snapshot.paramMap.get('id')
    }
    return this.authService.user.value.id
  }

  getMoods(){
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
  }

  getMoodsQuantity(){
    this.statisticsService.getMoodsQuantity(this.numOfDays, +this.checkForId()).subscribe(
      response => {
        this.moodsQuantity = response
        this.setupChartData();
      }
    )
  }

  onSelectTime() {
    var choice = this.statisticsForm.value['time'];
    if (choice === 'week') {
      this.numOfDays = 7;
    } else {
      this.numOfDays = 30;
    }
    this.getMoods();
    this.getMoodsQuantity();
    this.setupChartData();
    this.getActivities()
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
        this.getLastWeek(),
      datasets: [
        {
          data: this.processMoods(),
          fill: false,
          tension: 0.5,
          backgroundColor: 'rgba(255,0,0,0.3)',
          spanGaps: true
        }
      ],
    };

    this.barChartData = {
      labels: ['okropnie', 'źle', 'średnio', 'dobrze', 'wspaniale'],
      datasets: [
        {data: this.moodsQuantity, label: 'Nastroje'},
      ],
    };

    this.activityChartData = {
      labels: ['okropnie', 'źle', 'średnio', 'dobrze', 'wspaniale'],
      datasets: [
        {data: this.activityMoodsQuantity, label: 'Nastroje'},
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
        this.associatedActivites = response.filter(activity => {
          return new Date(activity.date) >= new Date(daysBefore) && activity.mood === this.selectedMood;
        })
        console.log(this.associatedActivites)
      }
    )
  }

  onSelectActivity() {
    this.selectedActivity = this.activityForm.value['name'];
    this.activityMoodsQuantity = this.countMoodsOccurrences();
    this.setupChartData();
  }

  countMoodsOccurrences(){
    const moodCounts = [0, 0, 0, 0, 0];

    this.activities.forEach(activity => {
      if(activity.name === this.selectedActivity){
        switch (activity.mood) {
          case 'terrible': moodCounts[0]++; break;
          case 'bad': moodCounts[1]++; break;
          case 'neutral': moodCounts[2]++; break;
          case 'good': moodCounts[3]++; break;
          case 'excellent': moodCounts[4]++; break;
        }
      }
    });

    return moodCounts;
  }

  getActivities() {
    const daysBefore = new Date();
    daysBefore.setTime(daysBefore.getTime() - this.numOfDays * 86400000 );
    this.activityService.getActivities().subscribe(
      (response) => {
        this.activities = response.filter(activity => {
          return new Date(activity.date) >= new Date(daysBefore);
        })
      }
    )
  }

  getActivitiesWithQuantity(){
    const activityQuantityMap = new Map<string, number>();
    this.associatedActivites.forEach((activity) => {
      const activityName = activity.name;

      if (activityQuantityMap.has(activityName)) {
        activityQuantityMap.set(activityName, activityQuantityMap.get(activityName)! + 1);
      } else {
        activityQuantityMap.set(activityName, 1);
      }
    });

    return activityQuantityMap;
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

    getLongestStreak(){
    this.statisticsService.getLongestStreak().subscribe(
      (res) => {
        this.longestStreakNumber = res;
      }
    )
    }

  getCurrentStreak(){
    this.statisticsService.getCurrentStreak().subscribe(
      (res) => {
        this.number = res;
      }
    )
  }

  getUniqueActivities(){
    return new Set(this.activities.map(activity => activity.name));
  }
}
