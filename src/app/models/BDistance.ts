export interface ApiResponse<T> {
  message?: string;
  data: T;
}

export interface IBDistance {
  building_ID_1?: number;        
  building_ID_2?: number;        
  distance: number;
  status: number;           
  creation_DATE: Date;     
  created_BY: string;       
  last_UPDATE_DATE: Date;  
  last_UPDATED_BY: string;   
}


