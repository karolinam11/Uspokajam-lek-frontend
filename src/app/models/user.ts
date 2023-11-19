import {Role} from "./role";

export class User{
  id: number;
  email: string;
  name: string;
  surname: string;
  birthDate: Date;
  role: Role


  constructor(id: number, email: string, name: string, surname: string, birthDate: Date, role: Role) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.surname = surname;
    this.birthDate = birthDate;
    this.role = role;
  }
}
