export class UserRequest {
  username: string;
  password: string;
  name: string;
  email: string;
  phone: string;
  roles: any[]; 

  constructor(username: string, password: string, name: string, email: string, phone: string, roles: any[]) {
    this.username = username;
    this.password = password;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.roles = roles;
  }
}
