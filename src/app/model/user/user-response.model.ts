import { RoleResponse } from "../role/role-response.model";

export class UserResponse {
  userID: number;
  username: string;
  name: string;
  email: string;
  phone: string;
  roles: RoleResponse[];

  constructor(userID: number, username: string, name: string, email: string, phone: string, roles: RoleResponse[]) {
    this.userID = userID;
    this.username = username;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.roles = roles;
  }
}
