export class DetailMarketingOrder {
  detailId: Number;
  moId: String;
  category: String;
  partNumber: number;
  description: String;
  machineType: String;
  capacity: Number;
  qtyPerMould: Number;
  spareMould: number;
  mouldMonthlyPlan: number;
  qtyPerRak: number;
  minOrder: number;
  maxCapMonth0: number;
  maxCapMonth1: number;
  maxCapMonth2: number;
  initialStock: Number;
  sfMonth0: Number;
  sfMonth1: Number;
  sfMonth2: Number;
  moMonth0: number;
  moMonth1: Number;
  moMonth2: Number;
  ppd: Number;
  cav: Number;
  status: Number;
  lockStatusM0: number;
  lockStatusM1: number;
  lockStatusM2: number;
  // Optional properties for tracking input state
  isTouchedM0?: boolean = false;
  isTouchedM1?: boolean = false;
  isTouchedM2?: boolean = false;
}
