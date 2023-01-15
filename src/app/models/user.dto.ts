export class UserDTO {
  id?: string;
  email: string;
  password?: string;
  fullName: string;
  isActive?: boolean;
  roles?: string[];

  constructor(email: string, fullName: string) {
    this.email = email;
    this.fullName = fullName;
  }
}
