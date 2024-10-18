import { RoleDetails } from './RoleDetails';

export class UserDetails {
  id: number;
  userId: number;
  userName: number;
  password: string;
  passwordConf: string;
  fullName: string;
  organization: string;
  organizationId: string;
  email: string;
  userType: string;
  resetToken: string;
  pin: string;
  pinConf: string;
  roles: RoleDetails;
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
