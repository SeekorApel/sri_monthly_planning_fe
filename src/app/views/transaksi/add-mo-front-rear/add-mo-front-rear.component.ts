import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DetailMarketingOrder } from 'src/app/models/DetailMarketingOrder';
import { HeaderMarketingOrder } from 'src/app/models/HeaderMarketingOrder';
import { MarketingOrder } from 'src/app/models/MarketingOrder';
import { ApiResponse } from 'src/app/response/Response';
import { MarketingOrderService } from 'src/app/services/transaksi/marketing order/marketing-order.service';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { ParsingDateService } from 'src/app/utils/parsing-date/parsing-date.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-add-mo-front-rear',
  templateUrl: './add-mo-front-rear.component.html',
  styleUrls: ['./add-mo-front-rear.component.scss']
})
export class AddMoFrontRearComponent implements OnInit {

  //Variable Declaration
  idMo: String;
  formHeaderMo: FormGroup;
  isReadOnly: boolean = true;
  isDisabled: boolean = true;
  marketingOrderTable: DetailMarketingOrder[];
  monthNames: string[] = ['SEP', 'OCT', 'NOV'];
  allData: any;

  marketingOrders: any[] = [];
  headerMarketingOrder: HeaderMarketingOrder[];
  detailMarketingOrder: DetailMarketingOrder[];
  headerMO: any[] = [];



  searchText: string = '';

  // Pagination
  pageOfItems: Array<any>;
  pageSize: number = 5;
  totalPages: number = 5;
  displayedColumns: string[] = ['no', 'moId', 'type', 'dateValid', 'revisionPpc', 'revisionMarketing', 'month0', 'month1', 'month2', 'action'];
  dataSource: MatTableDataSource<MarketingOrder>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private fb: FormBuilder,
    private moService: MarketingOrderService,
    private parseDateService: ParsingDateService) {
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
    // this.idMo = this.activeRoute.snapshot.paramMap.get('idMo');
    // this.getAllData(this.idMo);
    // this.fillBodyTableMo();
    this.fillDataDetailMo();
  }

  onChangePage(pageOfItems: Array<any>) {
    this.pageOfItems = pageOfItems;
  }

  onSearchChange(): void {
    this.dataSource.filter = this.searchText.trim().toLowerCase();
  }

  resetSearch(): void {
    this.searchText = '';
    this.dataSource.filter = '';
  }

  parseDate(dateParse: string): string {
    return this.parseDateService.convertDateToString(dateParse);
  }

  getAllData(idMo: String) {
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

  fillBodyTableMo(): void {
    console.log("assalamualaikum");
    const mockData = [
      {
        dataHeaderMo: [
          {
            date: 684,
            type: 373,
            revision:1,
            month_0: "SEP",
            month_1: "OCT",
            month_2: "NOV",
            nwd_0: 27,
            nwd_1: 25,
            nwd_2: 24,
            tl_ot_wd_0: 2,
            tl_ot_wd_1: 3,
            tl_ot_wd_2: 3,
            tt_ot_wd_0: 1,
            tt_ot_wd_1: 2,
            tt_ot_wd_2: 3,
            total_tlwd_0: 29,
            total_tlwd_1: 28,
            total_tlwd_2: 27,
            total_ttwd_0: 29,
            total_ttwd_1: 28,
            total_ttwd_2: 27,
            max_tube_capa_0: 560.483,
            max_tube_capa_1: 493.717,
            max_tube_capa_2: 577.300,
            max_capa_tl_0: 713.862,
            max_capa_tl_1: 714.762,
            max_capa_tl_2: 718.232,
            max_capa_tt_0: 713.862,
            max_capa_tt_1: 714.762,
            max_capa_tt_2: 718.232,
            machine_airbag_m0: 93.680,
            fed_tl_m0: 659.706, 
            fed_tt_m0: 276.840,
            fdr_tl_m0: 659.706, 
            fdr_tt_m0: 276.840,
            total_mo_m0:  936.546, 
            fed_TL_percentage_m0: "73,2%",
            fed_TT_percentage_m0: "26,8%",
            fdr_TL_percentage_m0: "73,2%",
            fdr_TT_percentage_m0: "26,8%",
          }
        ]
      }
    ];

  // // Menyimpan data ke dalam marketingOrder
  // this.marketingOrder = mockData.map(item => ({
  //   dataHeaderMo: item.dataHeaderMo,
  //   dataDetailMo: item.dataDetailMo
  // }));

  // // Set dataDetailMo ke dalam tabel
  // this.detailMarketingOrder = this.marketingOrder[0].dataDetailMo;
  // this.fillAllData(this.marketingOrder);
  }

  fillDataDetailMo(): void {
    this.marketingOrders = [
      { no: 1, category: 'HGP TT', partNumber: '1031003051033', description: 'FED TR TT 80/90-14 FT 235 H', machineType: "A/B", capacity: 197, qtyPerMould: 80, qtyPerRak: 200, minOrder: 400, maxCapMonth0: 345.000, maxCapMonth2: 340.400, maxCapMonth3: 382.800, initialStock: 11.270, sfMonth0:  99.860, sfMonth1:94.500, sfMonth2: 94.500, moMonth0: 100.640, moMonth1: 94.400, moMonth2: 92.640, PPD: 4137, gedung:null, mesin:null },
      { no: 2, category: 'HGP TT', partNumber: '1031103051032', description: 'FED TR TT 90/90-14 FT 235 H', machineType: "BOM", capacity: 178, qtyPerMould: 65, qtyPerRak: 160, minOrder: 480, maxCapMonth0: 253.280, maxCapMonth2: 249.760, maxCapMonth3: 281.120, initialStock: 13.980, sfMonth0: 125.510, sfMonth1: 115.500, sfMonth2: 115.000, moMonth0: 126.240, moMonth1: 115.520, moMonth2: 114.080, PPD:5189,gedung:null, mesin:null },
      { no: 3, category: 'OEM TL', partNumber: '1021103093057', description: 'FED TL 90/90-14 FT 235 L', machineType: "BOM", capacity: 149, qtyPerMould: 71, qtyPerRak: 60, minOrder: 480, maxCapMonth0: 257.040, maxCapMonth2: 253.920, maxCapMonth3: 257.040, initialStock: 23.097, sfMonth0: 129.100, sfMonth1: 119.750, sfMonth2: 120.000, moMonth0: 127.840, moMonth1: 117.920, moMonth2: 120.000, PPD:4735,gedung:null, mesin:null },
      { no: 4, category: 'OEM TL', partNumber: '1021703094058', description: 'FED TR TL 110/80-14 FT 297', machineType: "BOM", capacity: 133, qtyPerMould: 11, qtyPerRak: 40, minOrder: 440, maxCapMonth0: 35.520, maxCapMonth2: 35.080, maxCapMonth3: 35.520, initialStock: 4.495, sfMonth0: 15.150, sfMonth1: 13.800, sfMonth2: 15.200, moMonth0: 13.640, moMonth1: 13.840, moMonth2: 15.200, PPD:506, gedung:null, mesin:null },
      { no: 5, category: 'HGP TT', partNumber: '1031004064032', description: 'FED TR TT 80/90-17 FT 138 H', machineType: "A/B", capacity: 124, qtyPerMould: 44, qtyPerRak: 160, minOrder: 480, maxCapMonth0: 119.360, maxCapMonth2: 117.760, maxCapMonth3: 132.480, initialStock: 1.940, sfMonth0: 1.390, sfMonth1: 3.110, sfMonth2: 3.100, moMonth0: 1.280, moMonth1: 3.200, moMonth2: 3.040, PPD:53, gedung:null, mesin:null },
    ];
  }

  fillDataHeaderMo(): void {
    this.headerMO = [
      {
        date: 684,
        type: 373,
        revision:1,
        month_0: "SEP",
        month_1: "OCT",
        month_2: "NOV",
        nwd_0: 27,
        nwd_1: 25,
        nwd_2: 24,
        tl_ot_wd_0: 2,
        tl_ot_wd_1: 3,
        tl_ot_wd_2: 3,
        tt_ot_wd_0: 1,
        tt_ot_wd_1: 2,
        tt_ot_wd_2: 3,
        total_tlwd_0: 29,
        total_tlwd_1: 28,
        total_tlwd_2: 27,
        total_ttwd_0: 29,
        total_ttwd_1: 28,
        total_ttwd_2: 27,
        max_tube_capa_0: 560.483,
        max_tube_capa_1: 493.717,
        max_tube_capa_2: 577.300,
        max_capa_tl_0: 713.862,
        max_capa_tl_1: 714.762,
        max_capa_tl_2: 718.232,
        max_capa_tt_0: 713.862,
        max_capa_tt_1: 714.762,
        max_capa_tt_2: 718.232,
        machine_airbag_m0: 93.680,
        fed_tl_m0: 659.706, 
        fed_tt_m0: 276.840,
        fdr_tl_m0: 659.706, 
        fdr_tt_m0: 276.840,
        total_mo_m0:  936.546, 
        fed_TL_percentage_m0: "73,2%",
        fed_TT_percentage_m0: "26,8%",
        fdr_TL_percentage_m0: "73,2%",
        fdr_TT_percentage_m0: "26,8%",
      }  
    ];
  }

  fillAllData(data: any) {

    if (data && data.date) {
      let validDate = new Date(data.date);
      if (!isNaN(validDate.getTime())) {
        console.log(validDate.toISOString());
      } else {
        console.error('Invalid date value');
      }
    }
    console.log("assalamualaikum2");
    console.log(this.formHeaderMo.value);
    console.log(this.headerMarketingOrder);

    console.log(data);
    console.log("ini data " +data);

    // this.dataSource = new MatTableDataSource(this.marketingOrders);
    // this.dataSource.sort = this.sort;
    // this.dataSource.paginator = this.paginator;

    this.headerMarketingOrder = data.dataHeaderMo;
    this.detailMarketingOrder = data.dataDetailMo;
    
    let typeProduct = data.type;

    this.formHeaderMo.setValue({
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
    this.monthNames[0] = this.getMonthName(new Date(this.headerMarketingOrder[0].month));
    this.monthNames[1] = this.getMonthName(new Date(this.headerMarketingOrder[1].month));
    this.monthNames[2] = this.getMonthName(new Date(this.headerMarketingOrder[2].month));
  }

  getMonthName(monthValue: Date): string {
    if (monthValue) {
      return monthValue.toLocaleString('default', { month: 'short' }).toUpperCase();
    }
    return '';
  }
  selectedMarketingOrder: any;

  viewDetail(mo: any) {
    this.selectedMarketingOrder = mo;
  }
  navigateToViewMo() {
    this.router.navigate(['/transaksi/view-mo-ppc']);
  }

  navigateToEdit() {
    this.router.navigate(['/transaksi/edit-mo-ppc', this.idMo]);
  }

}
