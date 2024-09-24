export interface ApiResponse<T> {
  message?: string;
  data: T;
}

export interface ISize {
  size_ID?: number;        
  description: string;
  status: number;           
  creation_DATE: Date;     
  created_BY: string;       
  last_UPDATE_DATE: Date;  
  last_UPDATED_BY: string;   r
}


