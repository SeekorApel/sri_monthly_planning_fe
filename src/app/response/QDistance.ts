export interface ApiResponse<T> {
  message?: string;
  data: T;
}

export interface IQDistance {
  quadrant_ID_1?: number;        
  quadrant_ID_2?: number;        
  distance: number;
  status: number;           
  creation_DATE: Date;     
  created_BY: string;       
  last_UPDATE_DATE: Date;  
  last_UPDATED_BY: string;   r
}


