export interface ApiResponse<T> {
  message?: string;
  data: T;
}
export interface IMachineCuringTypeCavity {
  cavity_ID: number;
  machine_NUM: number;  
  cavity_NAME: number;   
  work_center_text: string;
  setting_ID: number;
  status: number;
  CREABY: number;       
  CREADATE: Date;
  MODIBY: number;       
  MODIDATE: Date;
}


