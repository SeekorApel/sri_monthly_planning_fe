export interface ApiResponse<T> {
  message?: string;
  data: T;
}

export interface ITass_Size {
  item_Curing_ID?: string;        
  kapa_Per_Mould?: number;        
  number_Of_Mould: number;                    
  creation_DATE: Date;     
  created_BY: string;       
  last_UPDATE_DATE: Date;  
  last_UPDATED_BY: string;   
}


