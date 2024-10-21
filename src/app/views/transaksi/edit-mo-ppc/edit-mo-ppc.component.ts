import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import * as ExcelJS from 'exceljs/dist/exceljs.min.js';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { DetailMarketingOrder } from 'src/app/models/DetailMarketingOrder';
import { MarketingOrderService } from 'src/app/services/transaksi/marketing order/marketing-order.service';
import { ApiResponse } from 'src/app/response/Response';
import { MarketingOrder } from 'src/app/models/MarketingOrder';
import { HeaderMarketingOrder } from 'src/app/models/HeaderMarketingOrder';

@Component({
  selector: 'app-edit-mo-ppc',
  templateUrl: './edit-mo-ppc.component.html',
  styleUrls: ['./edit-mo-ppc.component.scss'],
})
export class EditMoPpcComponent implements OnInit {
  //Variable Declaration
  idMo: String;
  formHeaderMo: FormGroup;
  isReadOnly: boolean = true;
  monthNames: string[] = ['', '', ''];
  allData: any;
  lastIdMo: string = '';

  marketingOrder: MarketingOrder = new MarketingOrder();
  headerMarketingOrder: any[] = [];
  detailMarketingOrder: DetailMarketingOrder[];

  constructor(private router: Router, private activeRoute: ActivatedRoute, private fb: FormBuilder, private moService: MarketingOrderService) {
    this.formHeaderMo = this.fb.group({
      date: [null, []],
      type: [null, []],
      revision: [null, []],
      month_0: [null, Validators.required],
      month_1: [null, []],
      month_2: [null, []],
      nwd_0: [null, Validators.required],
      nwd_1: [null, Validators.required],
      nwd_2: [null, Validators.required],
      tl_ot_wd_0: [null, [Validators.required, Validators.min(0)]],
      tt_ot_wd_0: [null, [Validators.required, Validators.min(0)]],
      tl_ot_wd_1: [null, [Validators.required, Validators.min(0)]],
      tt_ot_wd_1: [null, [Validators.required, Validators.min(0)]],
      tl_ot_wd_2: [null, [Validators.required, Validators.min(0)]],
      tt_ot_wd_2: [null, [Validators.required, Validators.min(0)]],
      total_tlwd_0: [null, []],
      total_ttwd_0: [null, []],
      total_tlwd_1: [null, []],
      total_ttwd_1: [null, []],
      total_tlwd_2: [null, []],
      total_ttwd_2: [null, []],
      max_tube_capa_0: [null, [Validators.required, Validators.min(0)]],
      max_tube_capa_1: [null, [Validators.required, Validators.min(0)]],
      max_tube_capa_2: [null, [Validators.required, Validators.min(0)]],
      max_capa_tl_0: [null, [Validators.required, Validators.min(0)]],
      max_capa_tt_0: [null, [Validators.required, Validators.min(0)]],
      max_capa_tl_1: [null, [Validators.required, Validators.min(0)]],
      max_capa_tt_1: [null, [Validators.required, Validators.min(0)]],
      max_capa_tl_2: [null, [Validators.required, Validators.min(0)]],
      max_capa_tt_2: [null, [Validators.required, Validators.min(0)]],
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
      upload_file_m0: [null, [Validators.required]],
      upload_file_m1: [null, [Validators.required]],
      upload_file_m2: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.idMo = this.activeRoute.snapshot.paramMap.get('idMo');
    this.getAllData(this.idMo);
    this.getLastIdMo();
  }

  getAllData(idMo: String) {
    this.moService.getDetailMarketingOrderById(idMo).subscribe(
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

  getLastIdMo(): void {
    this.moService.getLastIdMo().subscribe(
      (response: ApiResponse<string>) => {
        this.lastIdMo = response.data;
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load data: ' + error.message,
        });
      }
    );
  }

  fillAllData(data: any) {
    this.headerMarketingOrder = data.dataHeaderMo;
    this.detailMarketingOrder = data.dataDetailMo;

    let typeProduct = data.type;
    this.formHeaderMo.patchValue({
      date: new Date(data.dateValid).toISOString().split('T')[0],
      type: data.type,
      revision: data.revisionPpc,

      // Header Month 1
      month_0: this.formatDateToString(this.headerMarketingOrder[1].month),
      nwd_0: this.headerMarketingOrder[1].wdNormal,
      tl_ot_wd_0: this.headerMarketingOrder[1].wdOtTl,
      tt_ot_wd_0: this.headerMarketingOrder[1].wdOtTt,
      total_tlwd_0: this.headerMarketingOrder[1].totalWdTl,
      total_ttwd_0: this.headerMarketingOrder[1].totalWdTt,
      max_tube_capa_0: this.headerMarketingOrder[1].maxCapTube,
      max_capa_tl_0: this.headerMarketingOrder[1].maxCapTl,
      max_capa_tt_0: this.headerMarketingOrder[1].maxCapTt,
      looping_m0: this.headerMarketingOrder[1].looping,
      machine_airbag_m0: this.headerMarketingOrder[1].airbagMachine,
      fed_tl_m0: typeProduct === 'FED' ? this.headerMarketingOrder[1].tl : null,
      fed_tt_m0: typeProduct === 'FED' ? this.headerMarketingOrder[1].tt : null,
      fdr_tl_m0: typeProduct === 'FDR' ? this.headerMarketingOrder[1].tl : null,
      fdr_tt_m0: typeProduct === 'FDR' ? this.headerMarketingOrder[1].tt : null,
      fed_TL_percentage_m0: typeProduct === 'FED' ? this.headerMarketingOrder[1].tlPercentage : null,
      fed_TT_percentage_m0: typeProduct === 'FED' ? this.headerMarketingOrder[1].ttPercentage : null,
      fdr_TL_percentage_m0: typeProduct === 'FDR' ? this.headerMarketingOrder[1].tlPercentage : null,
      fdr_TT_percentage_m0: typeProduct === 'FDR' ? this.headerMarketingOrder[1].ttPercentage : null,
      total_mo_m0: this.headerMarketingOrder[1].totalMo,
      note_tl_m0: this.headerMarketingOrder[1].noteOrderTl,
      // Header Month 2
      month_1: this.formatDateToString(this.headerMarketingOrder[2].month),
      nwd_1: this.headerMarketingOrder[2].wdNormal,
      tl_ot_wd_1: this.headerMarketingOrder[2].wdOtTl,
      tt_ot_wd_1: this.headerMarketingOrder[2].wdOtTt,
      total_tlwd_1: this.headerMarketingOrder[2].totalWdTl,
      total_ttwd_1: this.headerMarketingOrder[2].totalWdTt,
      max_tube_capa_1: this.headerMarketingOrder[2].maxCapTube,
      max_capa_tl_1: this.headerMarketingOrder[2].maxCapTl,
      max_capa_tt_1: this.headerMarketingOrder[2].maxCapTt,
      looping_m1: this.headerMarketingOrder[2].looping,
      machine_airbag_m1: this.headerMarketingOrder[2].airbagMachine,
      fed_tl_m1: typeProduct === 'FED' ? this.headerMarketingOrder[2].tl : null,
      fed_tt_m1: typeProduct === 'FED' ? this.headerMarketingOrder[2].tt : null,
      fdr_tl_m1: typeProduct === 'FDR' ? this.headerMarketingOrder[2].tl : null,
      fdr_tt_m1: typeProduct === 'FDR' ? this.headerMarketingOrder[2].tt : null,
      fed_TL_percentage_m1: typeProduct === 'FED' ? this.headerMarketingOrder[2].tlPercentage : null,
      fed_TT_percentage_m1: typeProduct === 'FED' ? this.headerMarketingOrder[2].ttPercentage : null,
      fdr_TL_percentage_m1: typeProduct === 'FDR' ? this.headerMarketingOrder[2].tlPercentage : null,
      fdr_TT_percentage_m1: typeProduct === 'FDR' ? this.headerMarketingOrder[2].ttPercentage : null,
      total_mo_m1: this.headerMarketingOrder[2].totalMo,
      note_tl_m1: this.headerMarketingOrder[2].noteOrderTl,
      // Header Month 3
      month_2: this.formatDateToString(this.headerMarketingOrder[0].month),
      nwd_2: this.headerMarketingOrder[0].wdNormal,
      tl_ot_wd_2: this.headerMarketingOrder[0].wdOtTl,
      tt_ot_wd_2: this.headerMarketingOrder[0].wdOtTt,
      total_tlwd_2: this.headerMarketingOrder[0].totalWdTl,
      total_ttwd_2: this.headerMarketingOrder[0].totalWdTt,
      max_tube_capa_2: this.headerMarketingOrder[0].maxCapTube,
      max_capa_tl_2: this.headerMarketingOrder[0].maxCapTl,
      max_capa_tt_2: this.headerMarketingOrder[0].maxCapTt,
      looping_m2: this.headerMarketingOrder[0].looping,
      machine_airbag_m2: this.headerMarketingOrder[0].airbagMachine,
      fed_tl_m2: typeProduct === 'FED' ? this.headerMarketingOrder[2].tl : null,
      fed_tt_m2: typeProduct === 'FED' ? this.headerMarketingOrder[2].tt : null,
      fdr_tl_m2: typeProduct === 'FDR' ? this.headerMarketingOrder[2].tl : null,
      fdr_tt_m2: typeProduct === 'FDR' ? this.headerMarketingOrder[2].tt : null,
      fed_TL_percentage_m2: typeProduct === 'FED' ? this.headerMarketingOrder[2].tlPercentage : null,
      fed_TT_percentage_m2: typeProduct === 'FED' ? this.headerMarketingOrder[2].ttPercentage : null,
      fdr_TL_percentage_m2: typeProduct === 'FDR' ? this.headerMarketingOrder[2].tlPercentage : null,
      fdr_TT_percentage_m2: typeProduct === 'FDR' ? this.headerMarketingOrder[2].ttPercentage : null,
      total_mo_m2: this.headerMarketingOrder[0].totalMo,
      note_tl_m2: this.headerMarketingOrder[0].noteOrderTl,
    });

    this.updateMonthNames(this.headerMarketingOrder);
  }

  editMo(): void {
    const type = this.formHeaderMo.get('type')?.value;

    //Set data Save MO
    this.marketingOrder.moId = this.lastIdMo;
    this.marketingOrder.dateValid = this.formHeaderMo.get('date')?.value;
    this.marketingOrder.type = this.formHeaderMo.get('type')?.value;
    this.marketingOrder.revisionPpc = this.formHeaderMo.get('revision')?.value;
    this.marketingOrder.month0 = new Date(this.formHeaderMo.get('month_0')?.value);
    this.marketingOrder.month1 = new Date(this.formHeaderMo.get('month_1')?.value);
    this.marketingOrder.month2 = new Date(this.formHeaderMo.get('month_2')?.value);

    //Set data save Header Mo
    this.headerMarketingOrder = [];
    for (let i = 0; i < 3; i++) {
      const tlField = type === 'FDR' ? `fdr_tl_m${i}` : `fed_tl_m${i}`;
      const ttField = type === 'FDR' ? `fdr_tt_m${i}` : `fed_tt_m${i}`;

      const tlFieldPercentage = type === 'FDR' ? `fdr_TL_percentage_m${i}` : `fed_TL_percentage_m${i}`;
      const ttFieldPercentage = type === 'FDR' ? `fdr_TT_percentage_m${i}` : `fed_TT_percentage_m${i}`;

      this.headerMarketingOrder.push({
        moId: this.lastIdMo,
        month: new Date(this.formHeaderMo.get(`month_${i}`)?.value),
        wdNormal: this.formHeaderMo.get(`nwd_${i}`)?.value,
        wdOtTl: this.formHeaderMo.get(`tl_ot_wd_${i}`)?.value,
        wdOtTt: this.formHeaderMo.get(`tt_ot_wd_${i}`)?.value,
        totalWdTl: this.formHeaderMo.get(`total_tlwd_${i}`)?.value,
        totalWdTt: this.formHeaderMo.get(`total_ttwd_${i}`)?.value,
        maxCapTube: this.formHeaderMo.get(`max_tube_capa_${i}`)?.value,
        maxCapTl: this.formHeaderMo.get(`max_capa_tl_${i}`)?.value,
        maxCapTt: this.formHeaderMo.get(`max_capa_tt_${i}`)?.value,
        looping: this.formHeaderMo.get(`looping_m${i}`)?.value,
        airbagMachine: this.formHeaderMo.get(`machine_airbag_m${i}`)?.value,
        tl: this.formHeaderMo.get(tlField)?.value,
        tt: this.formHeaderMo.get(ttField)?.value,
        totalMo: this.formHeaderMo.get(`total_mo_m${i}`)?.value,
        tlPercentage: this.formHeaderMo.get(tlFieldPercentage)?.value,
        ttPercentage: this.formHeaderMo.get(ttFieldPercentage)?.value,
        noteOrderTl: this.formHeaderMo.get(`note_tl_m${i}`)?.value,
      });
    }

    //Set data save Detail Mo
    this.detailMarketingOrder.forEach((item) => {
      item.moId = this.lastIdMo;
    });

    const saveMo = {
      marketingOrder: this.marketingOrder,
      headerMarketingOrder: this.headerMarketingOrder,
      detailMarketingOrder: this.detailMarketingOrder,
    };

    this.moService.saveMarketingOrderPPC(saveMo).subscribe(
      (response) => {
        Swal.fire({
          title: 'Success!',
          text: 'Data Marketing Order successfully Revision.',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then((result) => {
          if (result.isConfirmed) {
            this.navigateToViewMo();
          }
        });
      },
      (err) => {
        Swal.fire('Error!', 'Error insert data Marketing Order.', 'error');
      }
    );
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

  navigateToViewMo() {
    this.router.navigate(['/transaksi/view-mo-ppc']);
  }

  temptMtheod() {
    const type = this.formHeaderMo.get('type')?.value;
    const lastIdMo = 'MO-002';
    //Marketing Order
    this.marketingOrder.dateValid = this.formHeaderMo.get('date')?.value;
    this.marketingOrder.type = type;
    this.marketingOrder.month0 = new Date(this.formHeaderMo.get('month_0')?.value);
    this.marketingOrder.month1 = new Date(this.formHeaderMo.get('month_1')?.value);
    this.marketingOrder.month2 = new Date(this.formHeaderMo.get('month_2')?.value);

    //Update Header Mo
    this.headerMarketingOrder = [];
    for (let i = 0; i < 3; i++) {
      const tlField = type === 'FDR' ? `fdr_tl_m${i}` : `fed_tl_m${i}`;
      const ttField = type === 'FDR' ? `fdr_tt_m${i}` : `fed_tt_m${i}`;

      const tlFieldPercentage = type === 'FDR' ? `fdr_TL_percentage_m${i}` : `fed_TL_percentage_m${i}`;
      const ttFieldPercentage = type === 'FDR' ? `fdr_TT_percentage_m${i}` : `fed_TT_percentage_m${i}`;

      this.headerMarketingOrder.push({
        moId: lastIdMo,
        month: new Date(this.formHeaderMo.get(`month_${i}`)?.value),
        wdNormal: this.formHeaderMo.get(`nwd_${i}`)?.value,
        wdOtTl: this.formHeaderMo.get(`tl_ot_wd_${i}`)?.value,
        wdOtTt: this.formHeaderMo.get(`tt_ot_wd_${i}`)?.value,
        totalWdTl: this.formHeaderMo.get(`total_tlwd_${i}`)?.value,
        totalWdTt: this.formHeaderMo.get(`total_ttwd_${i}`)?.value,
        maxCapTube: this.formHeaderMo.get(`max_tube_capa_${i}`)?.value,
        maxCapTl: this.formHeaderMo.get(`max_capa_tl_${i}`)?.value,
        maxCapTt: this.formHeaderMo.get(`max_capa_tt_${i}`)?.value,
        looping: this.formHeaderMo.get(`looping_m${i}`)?.value,
        airbagMachine: this.formHeaderMo.get(`machine_airbag_m${i}`)?.value,
        tl: this.formHeaderMo.get(tlField)?.value,
        tt: this.formHeaderMo.get(ttField)?.value,
        totalMo: this.formHeaderMo.get(`total_mo_m${i}`)?.value,
        tlPercentage: this.formHeaderMo.get(tlFieldPercentage)?.value,
        ttPercentage: this.formHeaderMo.get(ttFieldPercentage)?.value,
        noteOrderTl: this.formHeaderMo.get(`note_tl_m${i}`)?.value,
      });
    }

    // Update moId in detailMarketingOrder
    this.detailMarketingOrder.forEach((detail) => {
      detail.moId = lastIdMo;
      detail.detailId = null;
    });

    Swal.fire({
      title: 'Success!',
      text: 'Data Marketing Order Success edit.',
      icon: 'success',
      confirmButtonText: 'OK',
    }).then((result) => {
      if (result.isConfirmed) {
        console.log('data marketing order', this.marketingOrder);
        console.log('data header marketing order', this.headerMarketingOrder);
        console.log('data detail marketing order', this.detailMarketingOrder);
        this.navigateToViewMo();
      }
    });
  }
}
