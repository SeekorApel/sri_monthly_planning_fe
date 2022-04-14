import { UserDetails } from "./UserDetails";

export class User{
    timestamp: Date;
    status: any;
    error: string;  
    message: string;
    path: string;
    data: UserDetails;
    constructor(values: Object={}){
        Object.assign(this,values);
    }
}