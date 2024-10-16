import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { DetailMarketingOrder } from 'src/app/models/DetailMarketingOrder';
import { HeaderMarketingOrder } from 'src/app/models/HeaderMarketingOrder';
import { MarketingOrder } from 'src/app/models/MarketingOrder';
import { ApiResponse } from 'src/app/response/Response';
import { MarketingOrderService } from 'src/app/services/transaksi/marketing order/marketing-order.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-mo-marketing',
  templateUrl: './add-mo-marketing.component.html',
  styleUrls: ['./add-mo-marketing.component.scss'],
})
export class AddMoMarketingComponent implements OnInit {
  //Variable Declaration
  idMo: String;
  monthNames: string[] = ['', '', ''];
  formHeaderMo: FormGroup;
  isReadOnly: Boolean = true;
  allData: any;
  marketingOrder: MarketingOrder;
  detailMarketingOrder: DetailMarketingOrder[];
  headerMarketingOrder: HeaderMarketingOrder[];

  constructor(private router: Router, private activeRoute: ActivatedRoute, private moService: MarketingOrderService, private fb: FormBuilder) {
    this.formHeaderMo = this.fb.group({
      date: [null, []],
      type: [null, []],
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
      fed_TL_percentage_m0: [null, []],
      fdr_TL_percentage_m0: [null, []],
      fed_TT_percentage_m0: [null, []],
      fdr_TT_percentage_m0: [null, []],
      note_tl_m0: [null, []],
      looping_m1: [null, []],
      machine_airbag_m1: [null, []],
      fed_tl_m1: [null, []],
      fed_tt_m1: [null, []],
      fdr_tl_m1: [null, []],
      fdr_tt_m1: [null, []],
      total_mo_m1: [null, []],
      fed_TL_percentage_m1: [null, []],
      fdr_TL_percentage_m1: [null, []],
      fed_TT_percentage_m1: [null, []],
      fdr_TT_percentage_m1: [null, []],
      note_tl_m1: [null, []],
      looping_m2: [null, []],
      machine_airbag_m2: [null, []],
      fed_tl_m2: [null, []],
      fed_tt_m2: [null, []],
      fdr_tl_m2: [null, []],
      fdr_tt_m2: [null, []],
      total_mo_m2: [null, []],
      fed_TL_percentage_m2: [null, []],
      fdr_TL_percentage_m2: [null, []],
      fed_TT_percentage_m2: [null, []],
      fdr_TT_percentage_m2: [null, []],
      note_tl_m2: [null, []],
      upload_file_m0: [null, []],
      upload_file_m1: [null, []],
      upload_file_m2: [null, []],
    });
  }

  ngOnInit(): void {
    this.idMo = this.activeRoute.snapshot.paramMap.get('idMo');
    console.log('Ini id mo edit', this.idMo);
    this.getAllData(this.idMo);
  }

  getAllData(idMo: String) {
    this.moService.getDetailMarketingOrderMarketing(idMo).subscribe(
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
    this.router.navigate(['/transaksi/view-mo-marketing']);
  }

  fillAllData(data: any): void {
    this.headerMarketingOrder = data.dataHeaderMo;
    this.detailMarketingOrder = data.dataDetailMo;

    this.formHeaderMo.patchValue({
      date: new Date(data.datevalid).toISOString().split('T')[0],
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
    this.monthNames[0] = this.getMonthName(new Date(this.headerMarketingOrder[1].month));
    this.monthNames[1] = this.getMonthName(new Date(this.headerMarketingOrder[2].month));
    this.monthNames[2] = this.getMonthName(new Date(this.headerMarketingOrder[0].month));
  }

  getMonthName(monthValue: Date): string {
    if (monthValue) {
      return monthValue.toLocaleString('default', { month: 'short' }).toUpperCase();
    }
    return '';
  }

  formatMonthToString(date: Date) {
    const dateConvert = new Date(date);
    const options: Intl.DateTimeFormatOptions = { month: 'long' };
    const monthName = dateConvert.toLocaleString('en-US', options);
    return monthName;
  }

  saveMo(): void {
    const month1 = this.formatMonthToString(this.headerMarketingOrder[1].month);
    const month2 = this.formatMonthToString(this.headerMarketingOrder[2].month);
    const month3 = this.formatMonthToString(this.headerMarketingOrder[0].month);

    const item = this.detailMarketingOrder[0];
    if (item.sf_month_0 < item.minOrder) {
      Swal.fire({
        title: 'Warning!',
        text: `Item ${item.description} in ${month1} cannot be less than the Minimum Order.`,
        icon: 'warning',
        confirmButtonText: 'OK',
      });
    }
    if (item.sf_month_1 < item.minOrder) {
      Swal.fire({
        title: 'Warning!',
        text: `Item ${item.description} in ${month2} cannot be less than the Minimum Order.`,
        icon: 'warning',
        confirmButtonText: 'OK',
      });
    }
    if (item.sf_month_2 < item.minOrder) {
      Swal.fire({
        title: 'Warning!',
        text: `Item ${item.description} in ${month3} cannot be less than the Minimum Order.`,
        icon: 'warning',
        confirmButtonText: 'OK',
      });
    }
    if (item.sf_month_0 > item.kapasitasMaksimum1) {
      Swal.fire({
        title: 'Warning!',
        text: `Sales Forecast Item ${item.description} in ${month1} cannot be more than the Maximum capacity in ${month1}.`,
        icon: 'warning',
        confirmButtonText: 'OK',
      });
    }
    if (item.sf_month_1 > item.kapasitasMaksimum2) {
      Swal.fire({
        title: 'Warning!',
        text: `Sales Forecast Item ${item.description} in ${month2} cannot be more than the Maximum capacity in ${month2}.`,
        icon: 'warning',
        confirmButtonText: 'OK',
      });
    }
    if (item.sf_month_2 > item.kapasitasMaksimum3) {
      Swal.fire({
        title: 'Warning!',
        text: `Sales Forecast Item ${item.description} in ${month3} cannot be more than the Maximum capacity in ${month3}.`,
        icon: 'warning',
        confirmButtonText: 'OK',
      });
    }
    if (item.mo_month_0 > item.kapasitasMaksimum1) {
      Swal.fire({
        title: 'Warning!',
        text: `Marketing Order Item ${item.description} in ${month1} cannot be more than the Maximum capacity in ${month1}.`,
        icon: 'warning',
        confirmButtonText: 'OK',
      });
    }
    if (item.mo_month_1 > item.kapasitasMaksimum2) {
      Swal.fire({
        title: 'Warning!',
        text: `Marketing Order Item ${item.description} in ${month2} cannot be more than the Maximum capacity in ${month2}.`,
        icon: 'warning',
        confirmButtonText: 'OK',
      });
    }
    if (item.mo_month_2 > item.kapasitasMaksimum3) {
      Swal.fire({
        title: 'Warning!',
        text: `Marketing Order Item ${item.description} in ${month3} cannot be more than the Maximum capacity in ${month3}.`,
        icon: 'warning',
        confirmButtonText: 'OK',
      });
    }

    this.moService.addMarketingOrderMarketing(this.detailMarketingOrder).subscribe(
      (response) => {
        Swal.fire({
          title: 'Success!',
          text: 'Data Marketing Order Success added.',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then((result) => {
          if (result.isConfirmed) {
          }
        });
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to add marketing order details: ' + error.message,
          confirmButtonText: 'OK',
        });
      }
    );
    // this.detailMarketingOrder.forEach((item, index) => {
    //   console.log(`Index: ${index}, Item:`, item);
    // });
  }

  navigateToView(){
    this.router.navigate(['/transaksi/view-mo-marketing']);
  }
}
