export class MonthlyDailyPlan {
    no: number; // Untuk penomoran
    
    //detail monthly plan
    partNumber: number;
    size: string;
    pattern: string;
    total: number;
    netFulfilment: number;
    grossReq: number;
    netReq: number;
    reqAhmOem: number;
    reqAhmRem: number;
    reqFdr: number;
    differenceOfs: number;

    //detail daily monthly plan
    detailIdCuring:number;
    dateDailyMp: Date;
    workDay: number;
    totalPlan: number;
    
  }
  