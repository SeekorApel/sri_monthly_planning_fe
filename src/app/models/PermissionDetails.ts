export class PermissionDetails {
    
    id: number;
    permissionName: string;
    description: string;
    constructor(values: Object={}){
        Object.assign(this,values);
    }
}