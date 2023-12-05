import {Role} from "./role";

export class User{
  id: number;
  email: string;
  name: string;
  surname: string;
  birthDate: Date;
  role: Role
  token: string


  constructor(id: number, email: string, name: string, surname: string, birthDate: Date, role: Role, token: string) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.surname = surname;
    this.birthDate = birthDate;
    this.role = role;
    this.token = token;
  }
}
