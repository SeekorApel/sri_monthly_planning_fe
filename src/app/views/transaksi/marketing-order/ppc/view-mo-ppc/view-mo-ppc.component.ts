import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MarketingOrder } from 'src/app/models/MarketingOrder';
import { ApiResponse } from 'src/app/response/Response';
import { MarketingOrderService } from 'src/app/services/transaksi/marketing order/marketing-order.service';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { ParsingDateService } from 'src/app/utils/parsing-date/parsing-date.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-view-mo-ppc',
  templateUrl: './view-mo-ppc.component.html',
  styleUrls: ['./view-mo-ppc.component.scss'],
})
export class ViewMoPpcComponent implements OnInit {
  //Declaration
  marketingOrders: MarketingOrder[] = [];
  searchText: string = '';

  // Pagination
  pageOfItems: Array<any>;
  pageSize: number = 5;
  totalPages: number = 5;
  displayedColumns: string[] = ['no', 'moId', 'type', 'dateValid', 'revisionPpc', 'revisionMarketing', 'month0', 'month1', 'month2', 'action'];
  dataSource: MatTableDataSource<MarketingOrder>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  loadingPrint: { [key: string]: boolean } = {};

  constructor(private router: Router, private moService: MarketingOrderService, private parseDateService: ParsingDateService) {
    localStorage.removeItem('capacityPpc');
  }

  ngOnInit(): void {
    this.getAllMarketingOrder();
  }

  parseDate(dateParse: string): string {
    return this.parseDateService.convertDateToString(dateParse);
  }

  getAllMarketingOrder(): void {
    this.moService.getAllMarketingOrder().subscribe(
      (response: ApiResponse<MarketingOrder[]>) => {
        this.marketingOrders = response.data;
        if (this.marketingOrders.length === 0) {
          Swal.fire({
            icon: 'info',
            title: 'No Data',
            text: 'No marketing orders found.',
            timer: null,
            showConfirmButton: true,
            confirmButtonText: 'Ok',
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
          title: 'Error',
          text: 'Failed to load marketing orders: ' + error.message,
          timer: 3000,
          showConfirmButton: false,
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

  navigateToAdd() {
    this.router.navigate(['/transaksi/add-mo-ppc']);
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
    this.router.navigate(['/transaksi/view-detail-mo-ppc/', month0, month1, month2, type]);
  }

  navigateToEdit(idMo: String) {
    this.router.navigate(['/transaksi/edit-mo-ppc', idMo]);
  }

  enableMo(mo: MarketingOrder): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This data Marketing Order will be enabled!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.moService.enableMarketingOrder(mo).subscribe(
          (response) => {
            Swal.fire('Enabled!', 'Data Marketing Order has been Enabled', 'success').then(() => {
              window.location.reload();
            });
          },
          (err) => {
            Swal.fire('Error!', 'Failed to Enable Marketing Order.', 'error');
          }
        );
      }
    });
  }

  disableMo(mo: MarketingOrder): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This data Marketing Order will be disabled!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.moService.disableMarketingOrder(mo).subscribe(
          (response) => {
            Swal.fire('Disabled!', 'Data Marketing Order has been Disabeled', 'success').then(() => {
              window.location.reload();
            });
          },
          (err) => {
            Swal.fire('Error!', 'Failed to Disabeled Marketing Order.', 'error');
          }
        );
      }
    });
  }

  exportExcelMo(id: string): void {
    this.loadingPrint[id] = true;
    this.moService.downloadExcelMo(id).subscribe(
      (response: Blob) => {
        const url = window.URL.createObjectURL(response);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Marketing_Order_${id}.xlsx`; // Nama file yang diinginkan
        a.click();
        window.URL.revokeObjectURL(url);
        this.loadingPrint[id] = false;
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Gagal mendownload file. Silakan coba lagi!',
        });
        this.loadingPrint[id] = false;
      }
    );
  }
}
