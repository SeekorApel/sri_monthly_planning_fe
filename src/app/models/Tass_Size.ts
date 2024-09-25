export interface ApiResponse<T> {
  message?: string;
  data: T;
}

export interface ITass_Size {
  type_CODE?: string;        
  size_ID?: string;        
  capacity: number;                   
  setting_ID: number;                   
  creation_DATE: Date;     
  created_BY: string;       
  last_UPDATE_DATE: Date;  
  last_UPDATED_BY: string;   
}


