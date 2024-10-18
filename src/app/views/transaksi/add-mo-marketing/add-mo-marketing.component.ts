import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { DetailMarketingOrder } from 'src/app/models/DetailMarketingOrder';
import { HeaderMarketingOrder } from 'src/app/models/HeaderMarketingOrder';
import { MarketingOrder } from 'src/app/models/MarketingOrder';
import { ApiResponse } from 'src/app/response/Response';
import { MarketingOrderService } from 'src/app/services/transaksi/marketing order/marketing-order.service';
import Swal from 'sweetalert2';
import * as ExcelJS from 'exceljs/dist/exceljs.min.js';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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

  fillAllData(data: any): void {
    this.headerMarketingOrder = data.dataHeaderMo;
    this.detailMarketingOrder = data.dataDetailMo;

    this.formHeaderMo.patchValue({
      date: new Date(data.dateValid).toISOString().split('T')[0],
      type: data.type,
      revision: data.revision,

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
    });

    this.updateMonthNames(this.headerMarketingOrder);
  }

  downloadTemplate() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Form Input MO');

    console.log('Data download', this.detailMarketingOrder);

    // Menggabungkan sel B19 ke B20
    worksheet.mergeCells('B19:B20');
    worksheet.getCell('B19').value = 'Category';
    worksheet.getCell('B19').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('B').width = 20;

    worksheet.mergeCells('C19:C20');
    worksheet.getCell('C19').value = 'Item';
    worksheet.getCell('C19').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('C').width = 20;

    worksheet.mergeCells('D19:D20');
    worksheet.getCell('D19').value = 'Description';
    worksheet.getCell('D19').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('D').width = 41;

    worksheet.mergeCells('E19:E20');
    worksheet.getCell('E19').value = 'Machine Type';
    worksheet.getCell('E19').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('E').width = 15;

    worksheet.mergeCells('F19:F20');
    worksheet.getCell('F19').value = 'Capacity 99,5%';
    worksheet.getCell('F19').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('F').width = 18;

    worksheet.mergeCells('G19:G20');
    worksheet.getCell('G19').value = 'Qty Mould';
    worksheet.getCell('G19').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('G').width = 18;

    worksheet.mergeCells('H19:H20');
    worksheet.getCell('H19').value = 'Qty Per Rak';
    worksheet.getCell('H19').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('H').width = 18;

    worksheet.mergeCells('I19:I20');
    worksheet.getCell('I19').value = 'Minimal Order';
    worksheet.getCell('I19').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('I').width = 18;

    worksheet.mergeCells('J19:L19');
    worksheet.getCell('J19').value = 'Capacity Maximum';
    worksheet.getCell('J19').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('J').width = 15;

    worksheet.getCell('J20').value = 'Month 1';
    worksheet.getCell('J20').alignment = { vertical: 'middle', horizontal: 'center' };

    worksheet.getCell('K20').value = 'Month 2';
    worksheet.getCell('K20').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('K').width = 15;

    worksheet.getCell('L20').value = 'Month 3';
    worksheet.getCell('L20').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('L').width = 15;

    worksheet.mergeCells('M19:M20');
    worksheet.getCell('M19').value = 'Initial Stock';
    worksheet.getCell('M19').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('M').width = 20;

    worksheet.mergeCells('N19:P19');
    worksheet.getCell('N19').value = 'Sales Forecast';
    worksheet.getCell('N19').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('N').width = 20;

    worksheet.getCell('N20').value = 'Month 1';
    worksheet.getCell('N20').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('O').width = 20;

    worksheet.getCell('O20').value = 'Month 2';
    worksheet.getCell('O20').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('O').width = 20;

    worksheet.getCell('P20').value = 'Month 3';
    worksheet.getCell('P20').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('P').width = 20;

    worksheet.mergeCells('Q19:S19');
    worksheet.getCell('Q19').value = 'Marketing Order';
    worksheet.getCell('Q19').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('Q').width = 20;

    worksheet.getCell('Q20').value = 'Month 1';
    worksheet.getCell('Q20').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('Q').width = 20;

    worksheet.getCell('R20').value = 'Month 2';
    worksheet.getCell('R20').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('R').width = 20;

    worksheet.getCell('S20').value = 'Month 3';
    worksheet.getCell('S20').alignment = { vertical: 'middle', horizontal: 'center' };
    worksheet.getColumn('S').width = 20;

    let rowIndex = 21; // Starting row for data
    this.detailMarketingOrder.forEach((item) => {
      worksheet.getCell(`B${rowIndex}`).value = item.category;
      worksheet.getCell(`C${rowIndex}`).value = item.partNumber;
      worksheet.getCell(`D${rowIndex}`).value = item.description;
      worksheet.getCell(`E${rowIndex}`).value = item.machineType;
      worksheet.getCell(`F${rowIndex}`).value = item.capacity;
      worksheet.getCell(`G${rowIndex}`).value = item.qtyPerMould;
      worksheet.getCell(`H${rowIndex}`).value = item.qtyPerRak;
      worksheet.getCell(`I${rowIndex}`).value = item.minOrder;
      worksheet.getCell(`J${rowIndex}`).value = item.maxCapMonth0;
      worksheet.getCell(`K${rowIndex}`).value = item.maxCapMonth1;
      worksheet.getCell(`L${rowIndex}`).value = item.maxCapMonth2;
      worksheet.getCell(`M${rowIndex}`).value = item.initialStock;
      worksheet.getCell(`N${rowIndex}`).value = item.sfMonth0;
      worksheet.getCell(`O${rowIndex}`).value = item.sfMonth1;
      worksheet.getCell(`P${rowIndex}`).value = item.sfMonth2;
      worksheet.getCell(`Q${rowIndex}`).value = item.moMonth0;
      worksheet.getCell(`R${rowIndex}`).value = item.moMonth1;
      worksheet.getCell(`S${rowIndex}`).value = item.moMonth2;

      // Mengatur format number untuk kolom C
      worksheet.getCell(`C${rowIndex}`).numFmt = '0'; // format angka
      // Menyelaraskan semua sel di baris ini ke tengah dan tengah
      ['B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S'].forEach((col) => {
        const cell = worksheet.getCell(`${col}${rowIndex}`);
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });

      rowIndex++;
    });

    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const fileName = this.getFileNameExcel();
      saveAs(blob, fileName);
    });
  }

  getFileNameExcel(): string {
    const now = new Date();
    const indonesiaTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
    const monthFn = indonesiaTime.toLocaleDateString('en-US', { month: 'long' });
    const year = indonesiaTime.getFullYear();
    const timestamp = indonesiaTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }).replace(':', '');
    const fileName = `From_Marketing Order_${monthFn}_${year}_${timestamp}.xlsx`;
    return fileName;
  }

  navigateToViewMo() {
    this.router.navigate(['/transaksi/view-mo-marketing']);
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
    // if (item.sf_month_0 < item.minOrder) {
    //   Swal.fire({
    //     title: 'Warning!',
    //     text: `Item ${item.description} in ${month1} cannot be less than the Minimum Order.`,
    //     icon: 'warning',
    //     confirmButtonText: 'OK',
    //   });
    // }
    // if (item.sf_month_1 < item.minOrder) {
    //   Swal.fire({
    //     title: 'Warning!',
    //     text: `Item ${item.description} in ${month2} cannot be less than the Minimum Order.`,
    //     icon: 'warning',
    //     confirmButtonText: 'OK',
    //   });
    // }
    // if (item.sf_month_2 < item.minOrder) {
    //   Swal.fire({
    //     title: 'Warning!',
    //     text: `Item ${item.description} in ${month3} cannot be less than the Minimum Order.`,
    //     icon: 'warning',
    //     confirmButtonText: 'OK',
    //   });
    // }
    // if (item.sf_month_0 > item.kapasitasMaksimum1) {
    //   Swal.fire({
    //     title: 'Warning!',
    //     text: `Sales Forecast Item ${item.description} in ${month1} cannot be more than the Maximum capacity in ${month1}.`,
    //     icon: 'warning',
    //     confirmButtonText: 'OK',
    //   });
    // }
    // if (item.sf_month_1 > item.kapasitasMaksimum2) {
    //   Swal.fire({
    //     title: 'Warning!',
    //     text: `Sales Forecast Item ${item.description} in ${month2} cannot be more than the Maximum capacity in ${month2}.`,
    //     icon: 'warning',
    //     confirmButtonText: 'OK',
    //   });
    // }
    // if (item.sf_month_2 > item.kapasitasMaksimum3) {
    //   Swal.fire({
    //     title: 'Warning!',
    //     text: `Sales Forecast Item ${item.description} in ${month3} cannot be more than the Maximum capacity in ${month3}.`,
    //     icon: 'warning',
    //     confirmButtonText: 'OK',
    //   });
    // }
    // if (item.mo_month_0 > item.kapasitasMaksimum1) {
    //   Swal.fire({
    //     title: 'Warning!',
    //     text: `Marketing Order Item ${item.description} in ${month1} cannot be more than the Maximum capacity in ${month1}.`,
    //     icon: 'warning',
    //     confirmButtonText: 'OK',
    //   });
    // }
    // if (item.mo_month_1 > item.kapasitasMaksimum2) {
    //   Swal.fire({
    //     title: 'Warning!',
    //     text: `Marketing Order Item ${item.description} in ${month2} cannot be more than the Maximum capacity in ${month2}.`,
    //     icon: 'warning',
    //     confirmButtonText: 'OK',
    //   });
    // }
    // if (item.mo_month_2 > item.kapasitasMaksimum3) {
    //   Swal.fire({
    //     title: 'Warning!',
    //     text: `Marketing Order Item ${item.description} in ${month3} cannot be more than the Maximum capacity in ${month3}.`,
    //     icon: 'warning',
    //     confirmButtonText: 'OK',
    //   });
    // }

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

  navigateToView() {
    this.router.navigate(['/transaksi/view-mo-marketing']);
  }
}
