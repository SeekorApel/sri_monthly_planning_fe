export interface ApiResponse<T> {
  message?: string;
  data: T;
}

export interface IPattern {
  pattern_id?: number;        
  patrern_name: string;
  status: number;           
  creation_DATE: Date;     
  created_BY: string;       
}


