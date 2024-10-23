import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MarketingOrder } from 'src/app/models/MarketingOrder';
import { ApiResponse } from 'src/app/response/Response';
import { MarketingOrderService } from 'src/app/services/transaksi/marketing order/marketing-order.service';
import { ParsingDate } from 'src/app/utils/ParsingDate';
import Swal from 'sweetalert2';

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

  // Pagination
  pageOfItems: Array<any>;
  pageSize: number = 5;
  totalPages: number = 5;

  constructor(private router: Router, private moService: MarketingOrderService) {
    this.dateUtil = ParsingDate;
  }

  ngOnInit(): void {
    this.getAllMarketingOrder();
  }


  getAllMarketingOrder(): void {
    this.moService.getAllMarketingOrder().subscribe(
      (response: ApiResponse<MarketingOrder[]>) => {
        if (response.data.length === 0) {
          // Tampilkan SweetAlert ketika tidak ada data
          Swal.fire({
            icon: 'info',
            title: 'No Data',
            text: 'There are no marketing orders available.',
          });
        } else {
          console.log('data', response.data);
          this.marketingOrders = response.data;
          this.onChangePage(this.marketingOrders.slice(0, this.pageSize));
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

  resetSearch(): void {
    this.searchText = '';
    this.onChangePage(this.marketingOrders.slice(0, this.pageSize));
  }

  onSearchChange(): void {
    const filteredSearch = this.marketingOrders.filter((mo) => mo.moId.toString().includes(this.searchText) || mo.type.toLowerCase().includes(this.searchText.toLowerCase()));
    this.onChangePage(filteredSearch.slice(0, this.pageSize));
  }

  navigateToAdd(idMo: String) {
    this.router.navigate(['/transaksi/add-mo-marketing', idMo]);
  }

  navigateToEdit(idMo: String) {
    this.router.navigate(['/transaksi/edit-mo-marketing', idMo]);
  }

  navigateToDetail(m0: any, m1: any, m3: any, typeProduct: string) {
    const formatDate = (date: any): string => {
      const dateObj = (date instanceof Date) ? date : new Date(date);

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
    const type = typeProduct

    // Menggunakan string tanggal yang sudah dikonversi
    this.router.navigate(['/transaksi/view-revisi-mo-marketing/', month0, month1, month2, type]);
  }
}
