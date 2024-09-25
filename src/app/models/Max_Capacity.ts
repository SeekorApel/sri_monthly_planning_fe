export interface ApiResponse<T> {
  message?: string;
  data: T;
}

export interface IMax_Capacity {
  max_Cap_ID?: number;        
  product_ID: string;
  type_Code: string;
  cycle_TIME: number;
  capacity_Shift_1: number;
  capacity_Shift_2: number;
  capacity_Shift_3: number;
  status: number;           
  creation_DATE: Date;     
  created_BY: string;       
  last_UPDATE_DATE: Date;  
  last_UPDATED_BY: string;   
}


