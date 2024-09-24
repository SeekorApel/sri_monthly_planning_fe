export interface ApiResponse<T> {
  message?: string;
  data: T;
}

export interface ICuring_Machine {
  curing_ID?: number;        
  quadrant_ID?: number;        
  type_CODE: string;
  status: number;           
  creation_DATE: Date;     
  created_BY: string;       
  last_UPDATE_DATE: Date;  
  last_UPDATED_BY: string;   
}


