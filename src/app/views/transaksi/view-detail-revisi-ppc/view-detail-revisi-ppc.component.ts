import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DetailMarketingOrder } from 'src/app/models/DetailMarketingOrder';
import { HeaderMarketingOrder } from 'src/app/models/HeaderMarketingOrder';
import { MarketingOrder } from 'src/app/models/MarketingOrder';
import { ApiResponse } from 'src/app/response/Response';
import { MarketingOrderService } from 'src/app/services/transaksi/marketing order/marketing-order.service';
import { ParsingDate } from 'src/app/utils/ParsingDate';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-detail-revisi-ppc',
  templateUrl: './view-detail-revisi-ppc.component.html',
  styleUrls: ['./view-detail-revisi-ppc.component.scss'],
})
export class ViewDetailRevisiPpcComponent implements OnInit {
  //Declaration
  idMo: String;
  formHeaderMo: FormGroup;
  marketingOrders: MarketingOrder[] = [];
  errorMessage: string | null = null;
  searchText: string = '';
  dataTemp: any[];
  dateUtil: typeof ParsingDate;
  marketingOrder: MarketingOrder;
  headerMarketingOrder: HeaderMarketingOrder[];
  detailMarketingOrder: DetailMarketingOrder[];
  isReadOnly: boolean = true;
  monthNames: string[] = ['', '', ''];
  month0: string;
  month1: string;
  month2: string;
  type: string;
  allData: any;
  headerRevision: string;
  detailMoRevision: string;

  // Pagination
  pageOfItems: Array<any>;
  pageSize: number = 5;
  totalPages: number = 5;

  constructor(private router: Router, private moService: MarketingOrderService, private activeRoute: ActivatedRoute, private fb: FormBuilder) {
    this.dateUtil = ParsingDate;
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
    this.month0 = this.activeRoute.snapshot.paramMap.get('month0');
    this.month1 = this.activeRoute.snapshot.paramMap.get('month1');
    this.month2 = this.activeRoute.snapshot.paramMap.get('month2');
    this.type = this.activeRoute.snapshot.paramMap.get('type');
    this.getAllDetailRevision(this.month0, this.month1, this.month2, this.type);
    this.headerRevision = 'Header Marketing Order';
    this.detailMoRevision = 'Detail Marketing Order';
  }

  exportExcelMo(id: string): void {
    this.moService.downloadExcelMo(id).subscribe(
      (response: Blob) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Marketing_Order_${id}.xlsx`; // Nama file yang diinginkan
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Gagal mendownload file. Silakan coba lagi!',
        });
        console.error('Error downloading file:', error);
      }
    );
  }

  getAllDetailRevision(month0: string, month1: string, month2: string, type: string): void {
    this.moService.getAllDetailRevision(month0, month1, month2, type).subscribe(
      (response: ApiResponse<MarketingOrder[]>) => {
        this.marketingOrders = response.data;
        this.onChangePage(this.marketingOrders.slice(0, this.pageSize));
      },
      (error) => {
        this.errorMessage = 'Failed to load plants: ' + error.message;
      }
    );
    this.onChangePage(this.marketingOrders.slice(0, this.pageSize));
  }

  showDataRevision(idMo: string) {
    this.moService.getAllMoById(idMo).subscribe(
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

  fillAllData(data: any) {
    this.headerMarketingOrder = data.dataHeaderMo;
    this.detailMarketingOrder = data.dataDetailMo;
    let typeProduct = data.type;

    if (this.allData) {
      this.headerRevision = `Header Marketing Order Rev ${data.revisionPpc}`;
      this.detailMoRevision = `Detail Marketing Order Rev ${data.revisionPpc}`;
    }

    this.formHeaderMo.patchValue({
      date: new Date(data.dateValid).toISOString().split('T')[0],
      type: data.type,
      revision: data.revisionPpc,

      // Header Month 1
      month_0: this.formatDateToString(this.headerMarketingOrder[0].month),
      nwd_0: this.formatNumber(this.headerMarketingOrder[0].wdNormalTire),
      tl_ot_wd_0: this.formatNumber(this.headerMarketingOrder[0].wdOtTl),
      tt_ot_wd_0: this.formatNumber(this.headerMarketingOrder[0].wdOtTt),
      total_tlwd_0: this.formatNumber(this.headerMarketingOrder[0].totalWdTl),
      total_ttwd_0: this.formatNumber(this.headerMarketingOrder[0].totalWdTt),
      max_tube_capa_0: this.formatNumber(this.headerMarketingOrder[0].maxCapTube),
      max_capa_tl_0: this.formatNumber(this.headerMarketingOrder[0].maxCapTl),
      max_capa_tt_0: this.formatNumber(this.headerMarketingOrder[0].maxCapTt),
      looping_m0: this.formatNumber(this.headerMarketingOrder[0].looping),
      machine_airbag_m0: this.formatNumber(this.headerMarketingOrder[0].airbagMachine),
      fed_tl_m0: typeProduct === 'FED' ? this.formatNumber(this.headerMarketingOrder[0].tl) : null,
      fed_tt_m0: typeProduct === 'FED' ? this.formatNumber(this.headerMarketingOrder[0].tt) : null,
      fdr_tl_m0: typeProduct === 'FDR' ? this.formatNumber(this.headerMarketingOrder[0].tl) : null,
      fdr_tt_m0: typeProduct === 'FDR' ? this.formatNumber(this.headerMarketingOrder[0].tt) : null,
      fed_TL_percentage_m0: typeProduct === 'FED' ? this.formatNumber(this.headerMarketingOrder[0].tlPercentage) : null,
      fed_TT_percentage_m0: typeProduct === 'FED' ? this.formatNumber(this.headerMarketingOrder[0].ttPercentage) : null,
      fdr_TL_percentage_m0: typeProduct === 'FDR' ? this.formatNumber(this.headerMarketingOrder[0].tlPercentage) : null,
      fdr_TT_percentage_m0: typeProduct === 'FDR' ? this.formatNumber(this.headerMarketingOrder[0].ttPercentage) : null,
      total_mo_m0: this.formatNumber(this.headerMarketingOrder[0].totalMo),
      note_tl_m0: this.headerMarketingOrder[0].noteOrderTl,
      // Header Month 2
      month_1: this.formatDateToString(this.headerMarketingOrder[1].month),
      nwd_1: this.formatNumber(this.headerMarketingOrder[1].wdNormalTire),
      tl_ot_wd_1: this.formatNumber(this.headerMarketingOrder[1].wdOtTl),
      tt_ot_wd_1: this.formatNumber(this.headerMarketingOrder[1].wdOtTt),
      total_tlwd_1: this.formatNumber(this.headerMarketingOrder[1].totalWdTl),
      total_ttwd_1: this.formatNumber(this.headerMarketingOrder[1].totalWdTt),
      max_tube_capa_1: this.formatNumber(this.headerMarketingOrder[1].maxCapTube),
      max_capa_tl_1: this.formatNumber(this.headerMarketingOrder[1].maxCapTl),
      max_capa_tt_1: this.formatNumber(this.headerMarketingOrder[1].maxCapTt),
      looping_m1: this.formatNumber(this.headerMarketingOrder[1].looping),
      machine_airbag_m1: this.formatNumber(this.headerMarketingOrder[1].airbagMachine),
      fed_tl_m1: typeProduct === 'FED' ? this.formatNumber(this.headerMarketingOrder[1].tl) : null,
      fed_tt_m1: typeProduct === 'FED' ? this.formatNumber(this.headerMarketingOrder[1].tt) : null,
      fdr_tl_m1: typeProduct === 'FDR' ? this.formatNumber(this.headerMarketingOrder[1].tl) : null,
      fdr_tt_m1: typeProduct === 'FDR' ? this.formatNumber(this.headerMarketingOrder[1].tt) : null,
      fed_TL_percentage_m1: typeProduct === 'FED' ? this.formatNumber(this.headerMarketingOrder[1].tlPercentage) : null,
      fed_TT_percentage_m1: typeProduct === 'FED' ? this.formatNumber(this.headerMarketingOrder[1].ttPercentage) : null,
      fdr_TL_percentage_m1: typeProduct === 'FDR' ? this.formatNumber(this.headerMarketingOrder[1].tlPercentage) : null,
      fdr_TT_percentage_m1: typeProduct === 'FDR' ? this.formatNumber(this.headerMarketingOrder[1].ttPercentage) : null,
      total_mo_m1: this.formatNumber(this.headerMarketingOrder[1].totalMo),
      note_tl_m1: this.headerMarketingOrder[1].noteOrderTl,
      // Header Month 3
      month_2: this.formatDateToString(this.headerMarketingOrder[2].month),
      nwd_2: this.formatNumber(this.headerMarketingOrder[2].wdNormalTire),
      tl_ot_wd_2: this.formatNumber(this.headerMarketingOrder[2].wdOtTl),
      tt_ot_wd_2: this.formatNumber(this.headerMarketingOrder[2].wdOtTt),
      total_tlwd_2: this.formatNumber(this.headerMarketingOrder[2].totalWdTl),
      total_ttwd_2: this.formatNumber(this.headerMarketingOrder[2].totalWdTt),
      max_tube_capa_2: this.formatNumber(this.headerMarketingOrder[2].maxCapTube),
      max_capa_tl_2: this.formatNumber(this.headerMarketingOrder[2].maxCapTl),
      max_capa_tt_2: this.formatNumber(this.headerMarketingOrder[2].maxCapTt),
      looping_m2: this.formatNumber(this.headerMarketingOrder[2].looping),
      machine_airbag_m2: this.formatNumber(this.headerMarketingOrder[2].airbagMachine),
      fed_tl_m2: typeProduct === 'FED' ? this.formatNumber(this.headerMarketingOrder[2].tl) : null,
      fed_tt_m2: typeProduct === 'FED' ? this.formatNumber(this.headerMarketingOrder[2].tt) : null,
      fdr_tl_m2: typeProduct === 'FDR' ? this.formatNumber(this.headerMarketingOrder[2].tl) : null,
      fdr_tt_m2: typeProduct === 'FDR' ? this.formatNumber(this.headerMarketingOrder[2].tt) : null,
      fed_TL_percentage_m2: typeProduct === 'FED' ? this.formatNumber(this.headerMarketingOrder[2].tlPercentage) : null,
      fed_TT_percentage_m2: typeProduct === 'FED' ? this.formatNumber(this.headerMarketingOrder[2].ttPercentage) : null,
      fdr_TL_percentage_m2: typeProduct === 'FDR' ? this.formatNumber(this.headerMarketingOrder[2].tlPercentage) : null,
      fdr_TT_percentage_m2: typeProduct === 'FDR' ? this.formatNumber(this.headerMarketingOrder[2].ttPercentage) : null,
      total_mo_m2: this.formatNumber(this.headerMarketingOrder[2].totalMo),
      note_tl_m2: this.headerMarketingOrder[2].noteOrderTl,
    });
    this.updateMonthNames(this.headerMarketingOrder);
  }

  formatNumber(value: number): string {
    if (value !== null && value !== undefined) {
      // Mengubah angka menjadi string
      let strValue = value.toString();

      // Memisahkan bagian desimal dan bagian bulat
      const parts = strValue.split('.');
      const integerPart = parts[0];
      const decimalPart = parts[1] ? ',' + parts[1] : '';

      // Menambahkan separator ribuan
      const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

      return formattedInteger + decimalPart;
    }
    return '';
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

  onChangePage(pageOfItems: Array<any>) {
    this.pageOfItems = pageOfItems;
  }

  onSearchChange(): void {
    const filteredSearch = this.marketingOrders.filter((mo) => mo.moId.toString().includes(this.searchText) || mo.type.toLowerCase().includes(this.searchText.toLowerCase()));
    this.onChangePage(filteredSearch.slice(0, this.pageSize));
  }

  resetSearch(): void {
    this.searchText = '';
    this.onChangePage(this.marketingOrders.slice(0, this.pageSize));
  }

  navigateToViewMo() {
    this.router.navigate(['/transaksi/view-mo-ppc']);
  }
}