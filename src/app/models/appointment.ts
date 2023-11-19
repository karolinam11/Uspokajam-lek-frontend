import {Doctor} from "./doctor";
import {User} from "./user";

export class Appointment{
  doctor: Doctor;
  patient: User;
  visitStartDate: Date
  visitEndDate: Date

  constructor(doctor: Doctor, patient: User, visitStartDate: Date, visitEndDate: Date) {
    this.doctor = doctor;
    this.patient = patient;
    this.visitStartDate = visitStartDate;
    this.visitEndDate = visitEndDate;
  }
}
