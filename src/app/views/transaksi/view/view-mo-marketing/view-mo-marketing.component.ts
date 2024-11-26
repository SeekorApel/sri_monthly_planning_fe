import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MarketingOrder } from 'src/app/models/MarketingOrder';
import { ApiResponse } from 'src/app/response/Response';
import { MarketingOrderService } from 'src/app/services/transaksi/marketing order/marketing-order.service';
import { ParsingDate } from 'src/app/utils/ParsingDate';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { ParsingDateService } from 'src/app/utils/parsing-date/parsing-date.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-view-mo-marketing',
  templateUrl: './view-mo-marketing.component.html',
  styleUrls: ['./view-mo-marketing.component.scss'],
})
export class ViewMoMarketingComponent implements OnInit {
  //Variable Declaration
  searchText: string = '';
  marketingOrders: MarketingOrder[] = [];
  dateUtil: typeof ParsingDate;
  public role;

  // Pagination
  pageOfItems: Array<any>;
  pageSize: number = 5;
  totalPages: number = 5;
  headersColumns: string[] = ['no', 'moId', 'type', 'dateValid', 'revisionPpc', 'revisionMarketing', 'month0', 'month1', 'month2', 'action'];
  dataSource: MatTableDataSource<MarketingOrder>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private router: Router, private moService: MarketingOrderService, private parseDateService: ParsingDateService) {
    let currentUserSubject = JSON.parse(localStorage.getItem('currentUser'));
    this.role = currentUserSubject.roles.role_name;
  }

  ngOnInit(): void {
    this.getAllMarketingOrderMarketing(this.role);
  }

  parseDate(dateParse: string): string {
    return this.parseDateService.convertDateToString(dateParse);
  }

  getAllMarketingOrderMarketing(role: string): void {
    this.moService.getAllMarketingOrderMarketing(role).subscribe(
      (response: ApiResponse<MarketingOrder[]>) => {
        if (response.data.length === 0) {
          Swal.fire({
            icon: 'info',
            title: 'No Data',
            text: 'There are no marketing orders available.',
          });
        } else {
          this.marketingOrders = response.data;
          this.dataSource = new MatTableDataSource(this.marketingOrders);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
        }
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Failed to Load Data',
          text: 'Failed to load marketing orders: ' + error.message,
        });
      }
    );
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

  navigateToAdd(idMo: String) {
    this.router.navigate(['/transaksi/add-mo-marketing', idMo]);
  }

  navigateToEdit(idMo: String) {
    this.router.navigate(['/transaksi/edit-mo-marketing', idMo]);
  }

  navigateToDetail(m0: any, m1: any, m3: any, typeProduct: string) {
    const formatDate = (date: any): string => {
      const dateObj = date instanceof Date ? date : new Date(date);

      // Pastikan dateObj adalah tanggal yang valid
      if (isNaN(dateObj.getTime())) {
        throw new Error('Invalid date provided');
      }

      const day = String(dateObj.getDate()).padStart(2, '0');
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const year = dateObj.getFullYear();

      return `${day}-${month}-${year}`;
    };

    // Mengonversi ketiga tanggal
    const month0 = formatDate(m0);
    const month1 = formatDate(m1);
    const month2 = formatDate(m3);
    const type = typeProduct;

    // Menggunakan string tanggal yang sudah dikonversi
    this.router.navigate(['/transaksi/view-revisi-mo-marketing/', month0, month1, month2, type]);
  }
}
