export interface ApiResponse<T> {
  message?: string;
  data: T;
}

export interface IRoutingMachine {
  CT_ID?: number;        
  WIP: string;
  group_counter: string;           
  var_group_counter: string;     
  sequence: number;       
  WCT: string;  
  operation_short_text: string;
  operation_unit: string;
  base_quantity: number;
  standard_value_unit: string;
  CT_sec_1: number;
  CT_HR_1000: number;
  WH_normal_shift_1: number;
  WH_normal_shift_2: number;
  WH_normal_shift_3: number;
  WH_shift_jumat: number;
  WH_total_normal_shift: number;
  WH_total_shift_jumat: number;
  allow_normal_shift_1: number;
  allow_normal_shift_2: number;
  allow_normal_shift_3: number;
  allow_total: number;
  OP_time_normal_shift_1: number;
  OP_time_normal_shift_2: number;
  OP_time_normal_shift_3: number;
  OP_time_shift_jumat: number;
  OP_time_total_normal_shift: number;
  OP_time_total_shift_jumat: number;
  kaps_normal_shift_1: number;
  kaps_normal_shift_2: number;
  kaps_normal_shift_3: number;
  kaps_shift_jumat: number;
  kaps_total_normal_shift: number;
  kaps_total_shift_jumat: number;
  waktu_total_CT_normal: number;
  waktu_total_CT_jumat: number;
}


