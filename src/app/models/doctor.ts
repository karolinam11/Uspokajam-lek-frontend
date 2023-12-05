import {User} from "./user";
import {Role} from "./role";

export class Doctor extends User{
  specialization: string
  address: string
  phoneNumber: string
  invitationCode: string


  constructor(id: number, email: string, name: string, surname: string, birthDate: Date, role: Role, token: string, specialization: string, address: string, phoneNumber: string, invitationCode: string) {
    super(id, email, name, surname, birthDate, role, token);
    this.specialization = specialization;
    this.address = address;
    this.phoneNumber = phoneNumber;
    this.invitationCode = invitationCode;
  }
}
