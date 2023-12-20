import {Doctor} from "./doctor";

export class Exercise {
  id: number;
  name: string;
  description: string;
  duration: string;
  time: number;
  category: string;
  createdBy: Doctor;


  constructor(id: number, name: string, description: string, duration: string, time: number, category: string, createdBy: Doctor) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.duration = duration;
    this.time = time
    this.category = category;
    this.createdBy = createdBy;
  }
}
