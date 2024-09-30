import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-monthly-planning',
  templateUrl: './view-monthly-planning.component.html',
  styleUrls: ['./view-monthly-planning.component.scss']
})
export class ViewMonthlyPlanningComponent implements OnInit {

  monthlyPlannings: any[] = [];

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.monthlyPlannings = [
      { no: 1, documentNo: 'CM-701-0001', effectiveDate: 'NOV-2022', revision: 1, kadept: "Poizy", kasiepp: "DIR", workDay: "4", overtime: 20, monthOf: "08/2022", section: "TIRE", issueDate:"16-Jul-2022", status: 1 },
      { no: 2, documentNo: 'CM-701-0002', effectiveDate: 'DEC-2022', revision: 2, kadept: "Aeronshiki", kasiepp: "DIR", workDay: "5", overtime: 11, monthOf: "09/2022", section: "TIRE", issueDate:"19-Dec-2022", status: 1 },
      { no: 3, documentNo: 'CM-701-0003', effectiveDate: 'JAN-2023', revision: 1, kadept: "Dogma", kasiepp: "DIR", workDay: "6", overtime: 11, monthOf: "10/2023", section: "TIRE", issueDate:"24-Sep-2024", status: 1 },
      { no: 4, documentNo: 'CM-701-0004', effectiveDate: 'FEB-2023', revision: 3, kadept: "Shakariki", kasiepp: "DIR", workDay: "7", overtime: 12, monthOf: "11/2023", section: "TIRE", issueDate:"30-Jul-2024", status: 1 },
      { no: 5, documentNo: 'CM-701-0005', effectiveDate: 'MAR-2023', revision: 1, kadept: "Shigaraki", kasiepp: "DIR", workDay: "9", overtime: 13, monthOf: "12/2023", section: "TIRE", issueDate:"31-Jul-2024", status: 1 }
    ];
  }

  navigateToAdd(){
    this.router.navigate(['/transaksi/add-monthly-planning'])
  }

}
