import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DetailMarketingOrder } from 'src/app/models/DetailMarketingOrder';
import { HeaderMarketingOrder } from 'src/app/models/HeaderMarketingOrder';
import { MarketingOrder } from 'src/app/models/MarketingOrder';
import { ApiResponse } from 'src/app/response/Response';
import { MarketingOrderService } from 'src/app/services/transaksi/marketing order/marketing-order.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detail-view-mo-ppc',
  templateUrl: './detail-view-mo-ppc.component.html',
  styleUrls: ['./detail-view-mo-ppc.component.scss'],
})
export class DetailViewMoPpcComponent implements OnInit {
  //Variable Declaration
  idMo: String;
  formHeaderMo: FormGroup;
  isReadOnly: boolean = true;
  isDisabled: boolean = true;
  marketingOrderTable: DetailMarketingOrder[];
  monthNames: string[] = ['', '', ''];
  allData: any;

  marketingOrder: MarketingOrder;
  headerMarketingOrder: HeaderMarketingOrder[];
  detailMarketingOrder: DetailMarketingOrder[];

  constructor(private router: Router, private activeRoute: ActivatedRoute, private fb: FormBuilder, private moService: MarketingOrderService) {
    this.formHeaderMo = this.fb.group({
      date: [null, []],
      type: ["FED", []],
      revision: [null, []],
      month_0: [null, []],
      month_1: [null, []],
      month_2: [null, []],
      nwd_0: [null, []],
      nwd_1: [null, []],
      nwd_2: [null, []],
      tl_ot_wd_0: [null, []],
      tt_ot_wd_0: [null, []],
      tl_ot_wd_1: [null, []],
      tt_ot_wd_1: [null, []],
      tl_ot_wd_2: [null, []],
      tt_ot_wd_2: [null, []],
      total_tlwd_0: [null, []],
      total_ttwd_0: [null, []],
      total_tlwd_1: [null, []],
      total_ttwd_1: [null, []],
      total_tlwd_2: [null, []],
      total_ttwd_2: [null, []],
      max_tube_capa_0: [null, []],
      max_tube_capa_1: [null, []],
      max_tube_capa_2: [null, []],
      max_capa_tl_0: [null, []],
      max_capa_tt_0: [null, []],
      max_capa_tl_1: [null, []],
      max_capa_tt_1: [null, []],
      max_capa_tl_2: [null, []],
      max_capa_tt_2: [null, []],
      looping_m0: [null, []],
      machine_airbag_m0: [null, []],
      fed_tl_m0: [null, []],
      fed_tt_m0: [null, []],
      fdr_tl_m0: [null, []],
      fdr_tt_m0: [null, []],
      total_mo_m0: [null, []],
      note_tl_m0: [null, []],
      looping_m1: [null, []],
      machine_airbag_m1: [null, []],
      fed_tl_m1: [null, []],
      fed_tt_m1: [null, []],
      total_mo_m1: [null, []],
      note_tl_m1: [null, []],
      looping_m2: [null, []],
      machine_airbag_m2: [null, []],
      fed_tl_m2: [null, []],
      fed_tt_m2: [null, []],
      total_mo_m2: [null, []],
      note_tl_m2: [null, []],
      upload_file_m0: [null, []],
      upload_file_m1: [null, []],
      upload_file_m2: [null, []],
    });
  }

  ngOnInit(): void {
    this.idMo = this.activeRoute.snapshot.paramMap.get('idMo');
    this.getAllData(this.idMo);


  }

  getAllData(idMo: String) {
    this.moService.getDetailMarketingOrderPpc(idMo).subscribe(
      (response: ApiResponse<any>) => {
        this.allData = response.data;
        this.fillAllData(this.allData);
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load marketing order details: ' + error.message,
          confirmButtonText: 'OK',
        });
      }
    );
  }

  navigateToViewMo() {
    this.router.navigate(['/transaksi/view-mo-ppc']);
  }

  navigateToEdit() {
    this.router.navigate(['/transaksi/edit-mo-ppc', this.idMo]);
  }

  showData() {
    console.log('Hasil Pencet', this.allData);
  }

  fillAllData(data: any) {
    this.headerMarketingOrder = data.dataHeaderMo;
    this.detailMarketingOrder = data.dataDetailMo;

    this.formHeaderMo.patchValue({
      type: data.type,
      revision: data.revision,

      // Header Month 1
      month_0: this.formatDateToString(this.headerMarketingOrder[1].month),
      nwd_0: this.headerMarketingOrder[1].wd_NORMAL,
      tl_ot_wd_0: this.headerMarketingOrder[1].wd_OT_TL,
      tt_ot_wd_0: this.headerMarketingOrder[1].wd_OT_TT,
      total_tlwd_0: this.headerMarketingOrder[1].total_WD_TL,
      total_ttwd_0: this.headerMarketingOrder[1].total_WD_TT,
      max_tube_capa_0: this.headerMarketingOrder[1].max_CAP_TUBE,
      max_capa_tl_0: this.headerMarketingOrder[1].max_CAP_TL,
      max_capa_tt_0: this.headerMarketingOrder[1].max_CAP_TT,
      looping_m0: this.headerMarketingOrder[1].looping,
      machine_airbag_m0: this.headerMarketingOrder[1].airbag_MACHINE,
      fed_tl_m0: this.headerMarketingOrder[1].fed_TL,
      fed_tt_m0: this.headerMarketingOrder[1].fed_TT,
      total_mo_m0: this.headerMarketingOrder[1].total_MO,
      note_tl_m0: this.headerMarketingOrder[1].note_ORDER_TL,
      // Header Month 2
      month_1: this.formatDateToString(this.headerMarketingOrder[2].month),
      nwd_1: this.headerMarketingOrder[2].wd_NORMAL,
      tl_ot_wd_1: this.headerMarketingOrder[2].wd_OT_TL,
      tt_ot_wd_1: this.headerMarketingOrder[2].wd_OT_TT,
      total_tlwd_1: this.headerMarketingOrder[2].total_WD_TL,
      total_ttwd_1: this.headerMarketingOrder[2].total_WD_TT,
      max_tube_capa_1: this.headerMarketingOrder[2].max_CAP_TUBE,
      max_capa_tl_1: this.headerMarketingOrder[2].max_CAP_TL,
      max_capa_tt_1: this.headerMarketingOrder[2].max_CAP_TT,
      looping_m1: this.headerMarketingOrder[2].looping,
      machine_airbag_m1: this.headerMarketingOrder[2].airbag_MACHINE,
      fed_tl_m1: this.headerMarketingOrder[2].fed_TL,
      fed_tt_m1: this.headerMarketingOrder[2].fed_TT,
      total_mo_m1: this.headerMarketingOrder[2].total_MO,
      note_tl_m1: this.headerMarketingOrder[2].note_ORDER_TL,
      // Header Month 3
      month_2: this.formatDateToString(this.headerMarketingOrder[0].month),
      nwd_2: this.headerMarketingOrder[0].wd_NORMAL,
      tl_ot_wd_2: this.headerMarketingOrder[0].wd_OT_TL,
      tt_ot_wd_2: this.headerMarketingOrder[0].wd_OT_TT,
      total_tlwd_2: this.headerMarketingOrder[0].total_WD_TL,
      total_ttwd_2: this.headerMarketingOrder[0].total_WD_TT,
      max_tube_capa_2: this.headerMarketingOrder[0].max_CAP_TUBE,
      max_capa_tl_2: this.headerMarketingOrder[0].max_CAP_TL,
      max_capa_tt_2: this.headerMarketingOrder[0].max_CAP_TT,
      looping_m2: this.headerMarketingOrder[0].looping,
      machine_airbag_m2: this.headerMarketingOrder[0].airbag_MACHINE,
      fed_tl_m2: this.headerMarketingOrder[0].fed_TL,
      fed_tt_m2: this.headerMarketingOrder[0].fed_TT,
      total_mo_m2: this.headerMarketingOrder[0].total_MO,
      note_tl_m2: this.headerMarketingOrder[0].note_ORDER_TL,
    });

    this.updateMonthNames(this.headerMarketingOrder);
  }

  formatDateToString(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }

  updateMonthNames(hm: HeaderMarketingOrder[]): void {
    this.monthNames[0] = this.getMonthName(this.headerMarketingOrder[0].month);
    this.monthNames[1] = this.getMonthName(this.headerMarketingOrder[1].month);
    this.monthNames[2] = this.getMonthName(this.headerMarketingOrder[2].month);
  }

  getMonthName(monthValue: Date): string {
    // Parameter monthValue adalah objek Date
    if (monthValue) {
      return monthValue.toLocaleString('default', { month: 'short' }).toUpperCase();
    }
    return '';
  }
}
