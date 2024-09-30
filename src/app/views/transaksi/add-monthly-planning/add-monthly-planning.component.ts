import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-monthly-planning',
  templateUrl: './add-monthly-planning.component.html',
  styleUrls: ['./add-monthly-planning.component.scss'],
})
export class AddMonthlyPlanningComponent implements OnInit {
  monthlyPlannings: any[] = [];
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

    console.log(this.marketingOrders);
  }

  selectAll(event: any) {
    const checked = event.target.checked;
    this.marketingOrders.forEach(order => {
      order.selected = checked;
    });
  }


  navigateToViewMp() {
    this.router.navigate(['/transaksi/view-monthly-planning']);
  }
}
