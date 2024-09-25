export interface ApiResponse<T> {
  message?: string;
  data: T;
}
export interface IMachineTassType {
  code: string;
  setting_ID: number;  
  description: string;   
  floor: number;
  status: number;
  CREABY: number;       
  CREADATE: Date;
  MODIBY: number;       
  MODIDATE: Date;
}


