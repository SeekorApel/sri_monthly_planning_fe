import { PermissionDetails } from "./PermissionDetails";

export class Permission{
    timestamp: Date;
    status: any;
    error: string;  
    message: string;
    path: string;
    data: PermissionDetails;
    constructor(values: Object={}){
        Object.assign(this,values);
    }
}