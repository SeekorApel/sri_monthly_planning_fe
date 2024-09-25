export interface ApiResponse<T> {
  message?: string;
  data: T;
}

export interface ITass_Machine_Type {
  tassMachineType_ID?: String;        
  setting_ID: number;
  description: string;
  status: number;           
  creation_DATE: Date;     
  created_BY: string;       
  last_UPDATE_DATE: Date;  
  last_UPDATED_BY: string;   
}
