import {Component, ViewChild} from '@angular/core';
import {User} from "../models/user";
import {DoctorService} from "../shared/doctor.service";
import {Appointment} from "../models/appointment";
import {CalendarOptions} from "fullcalendar";
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid';


import plLocale from '@fullcalendar/core/locales/pl';
import {Router} from "@angular/router";

@Component({
  selector: 'app-doctor-page',
  templateUrl: './doctor-page.component.html',
  styleUrls: ['./doctor-page.component.css']
})
export class DoctorPageComponent {
  @ViewChild("calendar") calendar;
  patients: User[] = []
  futureAppointments: Appointment[] = [];

  calendarOptions: CalendarOptions = {
    themeSystem: 'standard',
    plugins: [timeGridPlugin, listPlugin, dayGridPlugin],
    locale: plLocale,
    slotMinTime: '07:00:00',
    slotMaxTime: '21:00:00',
    initialView: 'timeGridWeek',
    aspectRatio: 3,
    handleWindowResize: true,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek'
    },

  };

  constructor(private doctorService: DoctorService,
              private router: Router) {
    doctorService.getPatients().subscribe(
      (response) => {
        this.patients = response
      }
    )
    doctorService.getFutureAppointments().subscribe(
      (response) => {
        this.futureAppointments = response
        this.calendarOptions.events = this.mapAppointmentsToCalendar()
      }
    )
  }

  mapAppointmentsToCalendar(){
    return this.futureAppointments.map( appointment => {
      return {title: appointment.patient.name + ' ' + appointment.patient.surname, start: appointment.visitStartDate, end: appointment.visitEndDate}
    })
  }

  onSelectPatient(patientId: number){
    this.doctorService.onSelectPatient(this.patients.filter(patient => patient.id === patientId)[0])
    this.router.navigate(["patient-site/" + patientId])
  }
}
