export interface ApiResponse<T> {
  message?: string;
  data: T;
}

export interface IBuilding {
  building_ID?: number;
  plant_ID?: number;        
  building_NAME: string;
  status: number;           
  creation_DATE: Date;     
  created_BY: string;       
  last_UPDATE_DATE: Date;  
  last_UPDATED_BY: string;   r
}


