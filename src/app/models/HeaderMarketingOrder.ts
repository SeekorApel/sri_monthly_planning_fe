export class HeaderMarketingOrder {
  creation_DATE: Date | null;
  status: number;
  last_UPDATE_DATE: Date | null;
  last_UPDATED_BY: string | null;
  max_CAP_TL: number;
  fed_TL: number;
  fed_TT: number;
  airbag_MACHINE: number;
  total_MO: number;
  total_WD_TL: number;
  month: Date;
  wd_NORMAL: number;
  wd_OT_TT: number;
  max_CAP_TUBE: number;
  total_WD_TT: number;
  max_CAP_TT: number;
  wd_OT_TL: number;
  looping: number;
  header_ID: number;
  mo_ID: number;
  note_ORDER_TL: string;
  fed_TT_PERCENTAGE: number;
  fed_TL_PERCENTAGE: number;
  created_BY: string | null;
}
