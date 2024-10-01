import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-monthly-planning',
  templateUrl: './add-monthly-planning.component.html',
  styleUrls: ['./add-monthly-planning.component.scss'],
})
export class AddMonthlyPlanningComponent implements OnInit {
  // Variable declaration
  currentMonthDays: { date: number; isSunday: boolean; isOvertime: boolean; randomNumber: number }[] = [];
  monthlyPlanningsTass: any[] = [];
  monthlyPlanningsCurring: any[] = [];
  marketingOrders: any[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.marketingOrders = [
      { no: 1, orderId: 'MO-001', type: 'FED', date: '2024-09-01', revision: 1, month1: 'AUG', month2: 'SEP', month3: 'OCT' },
      { no: 2, orderId: 'MO-002', type: 'FDR', date: '2024-08-15', revision: 2, month1: 'NOV', month2: 'DEC', month3: 'JAN' },
      { no: 3, orderId: 'MO-003', type: 'FED', date: '2024-09-05', revision: 1, month1: 'FEB', month2: 'MAR', month3: 'APR' },
      { no: 4, orderId: 'MO-004', type: 'FDR', date: '2024-08-25', revision: 3, month1: 'AUG', month2: 'SEP', month3: 'OCT' },
      { no: 5, orderId: 'MO-005', type: 'FED', date: '2024-09-10', revision: 1, month1: 'AUG', month2: 'SEP', month3: 'OCT' },
    ];

    this.monthlyPlanningsTass = [{ no: 1, partNumber: 1030304034035, size: 'FED TR TT 2.50-17', pattern: 'FF 135F' }];

    this.generateCurrentMonthDays();
  }

  selectAll(event: any) {
    const checked = event.target.checked;
    this.marketingOrders.forEach((order) => {
      order.selected = checked;
    });
  }

  // Method untuk mendapatkan hari dalam bulan ini dan menandai hari Minggu serta hari lembur
  generateCurrentMonthDays() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth(); // Bulan saat ini (0 = Januari, 11 = Desember)
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // Dapatkan jumlah hari dalam bulan

    this.currentMonthDays = [];

    for (let i = 1; i <= daysInMonth; i++) {
      const currentDay = new Date(year, month, i);
      const isSunday = currentDay.getDay() === 0; // 0 berarti Minggu
      const randomNumber = Math.floor(Math.random() * 100); // Angka acak antara 0 dan 99
      this.currentMonthDays.push({ date: i, isSunday, isOvertime: false, randomNumber });
    }

    // Pilih 5 hari acak untuk lembur
    this.assignRandomOvertimeDays();
  }

  // Method untuk memilih 5 hari lembur secara acak
  assignRandomOvertimeDays() {
    const selectedDays = new Set<number>();
    while (selectedDays.size < 5) {
      const randomDay = Math.floor(Math.random() * this.currentMonthDays.length);
      selectedDays.add(randomDay);
    }

    // Tandai hari lembur
    selectedDays.forEach((dayIndex) => {
      this.currentMonthDays[dayIndex].isOvertime = true; // Tandai hari lembur
    });
  }

  navigateToViewMp() {
    this.router.navigate(['/transaksi/view-monthly-planning']);
  }
}
