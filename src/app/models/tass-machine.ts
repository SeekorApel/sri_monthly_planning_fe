export interface ApiResponse<T> {
  message?: string;
  data: T;
}
export interface ITassMachine {
  machine_NUM: number;
  quadrant_ID: number;  
  type_CODE: string;   
  floor: number;
  type: string;         
  work_center_text: string; 
  servicer: number;
  status: number;
  CREABY: number;       
  CREADATE: Date;
  MODIBY: number;       
  MODIDATE: Date;
}


