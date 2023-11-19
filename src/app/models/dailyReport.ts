export class DailyReport{
  date: Date;
  mood: string;
  note: string;


  constructor(date: Date, mood: string, note: string) {
    this.date = date;
    this.mood = mood;
    this.note = note;
  }
}
