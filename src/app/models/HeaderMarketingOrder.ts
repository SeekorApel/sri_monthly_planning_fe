export class HeaderMarketingOrder {
  header_ID: number;
  mo_ID: number;
  status: number;
  max_CAP_TL: number;
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
  note_ORDER_TL: string;
  tl: number;
  tt: number;
  tl_PERCENTAGE: number;
  tt_PERCENTAGE: number;
  creation_DATE: Date | null;
  created_BY: string | null;
  last_UPDATED_BY: string | null;
  last_UPDATE_DATE: Date | null;
}
