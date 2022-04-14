import { PermissionDetails } from "./PermissionDetails";

export class RoleDetails {

    id: number;
    roleName: string;
    description: string;
    permissions: PermissionDetails;
   constructor(values: Object={}){
    Object.assign(this,values);
    }
}