export interface ApiResponse<T> {
  message?: string;
  data: T;
}
export interface IMachineCuringType {
  machine_curing_type_ID: string;
  setting_ID: number;  
  description: string;   
  cavity: number;
  status: number;
  CREABY: number;       
  CREADATE: Date;
  MODIBY: number;       
  MODIDATE: Date;
}


