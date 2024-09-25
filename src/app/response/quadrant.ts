export interface ApiResponse<T> {
  message?: string;
  data: T;
}

export interface IQuadrant {
  quadrant_ID?: number;        
  building_NAME: string;
  quadrant_NAME: string;           
  status: number;    
}


