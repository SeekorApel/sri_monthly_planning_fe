import { Component, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { MonthlyPlanCuringService } from 'src/app/services/transaksi/monthly plan curing/monthly-plan-curing.service';
import { MatTableDataSource } from '@angular/material/table';
import { ParsingDateService } from 'src/app/utils/parsing-date/parsing-date.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ApiResponse } from 'src/app/response/Response';
import { MonthlyPlanning } from 'src/app/models/MonthlyPlanning';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-view-monthly-planning',
  templateUrl: './view-monthly-planning.component.html',
  styleUrls: ['./view-monthly-planning.component.scss']
})
export class ViewMonthlyPlanningComponent implements OnInit {

  monthlyPlannings: MonthlyPlanning[] = [];
  searchText: string = '';

   // Pagination
   pageOfItems: Array<any>;
   pageSize: number = 5;
   totalPages: number = 5;
   displayedColumns: string[] = ['no', 'mpCuringId', 'docNumber', 'effectiveDate', 'revision', 'workDay', 'overtime', 'monthOf', 'kadept', 'kassiePp','section','issueDate','action'];
   dataSource: MatTableDataSource<MonthlyPlanning>;
   @ViewChild(MatSort) sort: MatSort;
   @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private router: Router, private mpService: MonthlyPlanCuringService, private parseDateService: ParsingDateService) { }

  ngOnInit(): void {
    this.getAllMarketingOrder();
  }

  navigateToAdd(){
    this.router.navigate(['/transaksi/add-monthly-planning'])
  }

  navigateToDetail(docNum: string): void {
    this.router.navigate(['/transaksi/view-detail-monthly-planning', docNum]);
  }  

  parseDate(dateParse: string): string {
    return this.parseDateService.convertDateToString(dateParse);
  }

  onSearchChange(): void {
    this.dataSource.filter = this.searchText.trim().toLowerCase();
  }

  resetSearch(): void {
    this.searchText = '';
    this.dataSource.filter = '';
  }

  getAllMarketingOrder(): void {
    this.mpService.getAllMonthlyPlanning().subscribe(
      (response: ApiResponse<MonthlyPlanning[]>) => {
        this.monthlyPlannings = response.data;
        console.table(this.monthlyPlannings)
        if (this.monthlyPlannings.length === 0) {
          Swal.fire({
            icon: 'info',
            title: 'No Data',
            text: 'No marketing orders found.',
            timer: null,
            showConfirmButton: true,
            confirmButtonText: 'Ok',
          });
        } else {
          this.monthlyPlannings = response.data;
          this.dataSource = new MatTableDataSource(this.monthlyPlannings);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        }
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load marketing orders: ' + error.message,
          timer: 3000,
          showConfirmButton: false,
        });
      }
    );
  }

}
