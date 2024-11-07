import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-add-monthly-planning',
  templateUrl: './add-monthly-planning.component.html',
  styleUrls: ['./add-monthly-planning.component.scss'],
})
export class AddMonthlyPlanningComponent implements OnInit {

  // Variable declaration
  selectedDetail: { idDetailDaily: number; countProduction: number } | null = null;
  dateHeadersTass: any[] = [];
  dateHeadersCurring: any[] = [];
  monthlyPlanningTass: any[] = [];
  dailyMonthlyPlanningTass: any[] = [];


  monthlyPlanningsCurring: any[] = [];
  marketingOrders: any[] = [];
  showMonthlyPlanning: boolean = false;

  generateMonthlyPlanning() {
    this.showMonthlyPlanning = true;
  }
  constructor(private router: Router) { }

  ngOnInit(): void {
    this.fillDataMo();
    this.fillDataHeaderDateTass();
    this.fillBodyTableMp();
  }

  // MP section

  openDmpModal(dailyMp: { idDetailDaily: number; countProduction: number }): void {
    this.selectedDetail = dailyMp; // Simpan detail yang dipilih
    // Tampilkan modal (jika Anda menggunakan jQuery)
    $('#dmpModal').modal('show');
  }

  fillBodyTableMp(): void {
    const mockData = [
      {
        partNumber: 1030304034035,
        size: "FED TR TT 2.50-17",
        pattern: "FF 135F",
        detailDaily: [
          {
            idDetailDaily: 684,
            countProduction: 373
          },
          {
            idDetailDaily: 260,
            countProduction: 416
          },
          {
            idDetailDaily: 491,
            countProduction: 123
          },
          {
            idDetailDaily: 299,
            countProduction: 233
          },
          {
            idDetailDaily: 712,
            countProduction: 2
          },
          {
            idDetailDaily: 863,
            countProduction: 341
          },
          {
            idDetailDaily: 945,
            countProduction: 168
          },
          {
            idDetailDaily: 971,
            countProduction: 211
          },
          {
            idDetailDaily: 793,
            countProduction: 132
          },
          {
            idDetailDaily: 245,
            countProduction: 477
          },
          {
            idDetailDaily: 812,
            countProduction: 276
          },
          {
            idDetailDaily: 614,
            countProduction: 178
          },
          {
            idDetailDaily: 520,
            countProduction: 449
          },
          {
            idDetailDaily: 242,
            countProduction: 468
          },
          {
            idDetailDaily: 55,
            countProduction: 5
          },
          {
            idDetailDaily: 411,
            countProduction: 198
          },
          {
            idDetailDaily: 443,
            countProduction: 417
          },
          {
            idDetailDaily: 537,
            countProduction: 339
          },
          {
            idDetailDaily: 188,
            countProduction: 228
          },
          {
            idDetailDaily: 410,
            countProduction: 37
          },
          {
            idDetailDaily: 353,
            countProduction: 335
          },
          {
            idDetailDaily: 150,
            countProduction: 10
          },
          {
            idDetailDaily: 430,
            countProduction: 125
          },
          {
            idDetailDaily: 352,
            countProduction: 121
          },
          {
            idDetailDaily: 364,
            countProduction: 476
          },
          {
            idDetailDaily: 701,
            countProduction: 138
          },
          {
            idDetailDaily: 173,
            countProduction: 14
          },
          {
            idDetailDaily: 261,
            countProduction: 3
          },
          {
            idDetailDaily: 400,
            countProduction: 399
          },
          {
            idDetailDaily: 844,
            countProduction: 255
          },
          {
            idDetailDaily: 658,
            countProduction: 35
          }
        ]
      }
    ];

    this.monthlyPlanningTass = mockData.map(item => ({
      partNumber: item.partNumber,
      size: item.size,
      pattern: item.pattern,
      detailDailyMp: item.detailDaily
    }));
  }

  // Fungsi untuk menghitung total countProduction
  calculateTotal(): number {
    return this.monthlyPlanningTass.reduce((acc, mpTass) => {
      return acc + mpTass.detailDailyMp.reduce((subAcc, dailyMp) => subAcc + dailyMp.countProduction, 0);
    }, 0);
  }

  fillDataHeaderDateTass(): void {
    const mockData = [
      { header_day: "1", status: "normal", working_day: 1 },
      { header_day: "2", status: "normal", working_day: 2 },
      { header_day: "3", status: "overtime", working_day: 3 },
      { header_day: "4", status: "normal", working_day: 4 },
      { header_day: "5", status: "overtime", working_day: 5 },
      { header_day: "6", status: "off", working_day: 5 },   // Minggu
      { header_day: "7", status: "normal", working_day: 6 },
      { header_day: "8", status: "overtime", working_day: 7 },
      { header_day: "9", status: "normal", working_day: 8 },
      { header_day: "10", status: "normal", working_day: 9 },
      { header_day: "11", status: "overtime", working_day: 10 },
      { header_day: "12", status: "normal", working_day: 11 },
      { header_day: "13", status: "off", working_day: 11 },   // Minggu
      { header_day: "14", status: "normal", working_day: 12 },
      { header_day: "15", status: "normal", working_day: 13 },
      { header_day: "16", status: "normal", working_day: 14 },
      { header_day: "17", status: "normal", working_day: 15 },
      { header_day: "18", status: "normal", working_day: 16 },
      { header_day: "19", status: "overtime", working_day: 17 },
      { header_day: "20", status: "off", working_day: 17 },   // Minggu
      { header_day: "21", status: "normal", working_day: 18 },
      { header_day: "22", status: "normal", working_day: 19 },
      { header_day: "23", status: "normal", working_day: 20 },
      { header_day: "24", status: "normal", working_day: 21 },
      { header_day: "25", status: "overtime", working_day: 22 },
      { header_day: "26", status: "normal", working_day: 23 },
      { header_day: "27", status: "off", working_day: 23 },   // Minggu
      { header_day: "28", status: "normal", working_day: 24 },
      { header_day: "29", status: "normal", working_day: 25 },
      { header_day: "30", status: "normal", working_day: 26 },
      { header_day: "31", status: "normal", working_day: 27 }
    ];

    //Mapping data header
    this.dateHeadersTass = mockData.map(header => ({
      date: header.header_day,
      isOff: header.status === "off",
      isOvertime: header.status === "overtime",
      status: header.status,
      workingDay: header.working_day
    }));
  }

  fillDataWorkDays(): void {

  }

  //End MP Section

  // Mo section
  fillDataMo(): void {
    this.marketingOrders = [
      { no: 1, orderId: 'MO-001', type: 'FED', date: '2024-09-01', revision: 1, month1: 'AUG', month2: 'SEP', month3: 'OCT' },
      { no: 2, orderId: 'MO-002', type: 'FDR', date: '2024-08-15', revision: 2, month1: 'NOV', month2: 'DEC', month3: 'JAN' },
      { no: 3, orderId: 'MO-003', type: 'FED', date: '2024-09-05', revision: 1, month1: 'FEB', month2: 'MAR', month3: 'APR' },
      { no: 4, orderId: 'MO-004', type: 'FDR', date: '2024-08-25', revision: 3, month1: 'AUG', month2: 'SEP', month3: 'OCT' },
      { no: 5, orderId: 'MO-005', type: 'FED', date: '2024-09-10', revision: 1, month1: 'AUG', month2: 'SEP', month3: 'OCT' },
    ];
  }

  selectAll(event: any) {
    const checked = event.target.checked;
    this.marketingOrders.forEach((order) => {
      order.selected = checked;
    });
  }
  // End Mo section

  navigateToViewMp() {
    this.router.navigate(['/transaksi/view-monthly-planning']);
  }

  navigateToViewMoFrontRear() {
    this.router.navigate(['/transaksi/add-mo-front-rear']);
  }
}
