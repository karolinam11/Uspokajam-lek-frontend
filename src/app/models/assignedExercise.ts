import {Exercise} from "./exercise";
import {User} from "./user";
import {Doctor} from "./doctor";

export class AssignedExercise{
  id: number
  exercise: Exercise
  dueDate: Date
  assignedTo: User
  assignedBy: Doctor
  isDone: boolean


  constructor(id: number, exercise: Exercise, dueDate: Date, assignedTo: User, assignedBy: Doctor, isDone: boolean) {
    this.id = id;
    this.exercise = exercise;
    this.dueDate = dueDate;
    this.assignedTo = assignedTo;
    this.assignedBy = assignedBy;
    this.isDone = isDone;
  }
}
