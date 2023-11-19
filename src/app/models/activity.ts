export class Activity{
  name: string;
  date: Date;
  mood: string;


  constructor(name: string, date: Date, mood: string) {
    this.name = name;
    this.date = date;
    this.mood = mood;
  }
}
