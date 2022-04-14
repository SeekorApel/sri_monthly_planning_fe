import { RoleDetails } from "./RoleDetails";

export class Role {
    timestamp: Date;
    status: any;
    error: string;  
    message: string;
    path: string;
    data: RoleDetails;
    constructor(values: Object={}){
        Object.assign(this,values);
    }
}