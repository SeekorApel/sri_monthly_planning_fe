import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MarketingOrder } from 'src/app/models/MarketingOrder';
import { ApiResponse } from 'src/app/response/Response';
import { MarketingOrderService } from 'src/app/services/transaksi/marketing order/marketing-order.service';
import { ParsingDate } from 'src/app/utils/ParsingDate'

@Component({
  selector: 'app-view-mo-ppc',
  templateUrl: './view-mo-ppc.component.html',
  styleUrls: ['./view-mo-ppc.component.scss'],
})
export class ViewMoPpcComponent implements OnInit {
  //Declaration
  marketingOrders: MarketingOrder[] = [];
  errorMessage: string | null = null;
  searchText: string = '';
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
        this.marketingOrders = response.data;
        this.onChangePage(this.marketingOrders.slice(0, this.pageSize));
      },
      (error) => {
        this.errorMessage = 'Failed to load plants: ' + error.message;
      }
    );
  }

  onChangePage(pageOfItems: Array<any>) {
    this.pageOfItems = pageOfItems;
  }

  onSearchChange(): void {
    // Lakukan filter berdasarkan nama plant yang mengandung text pencarian (case-insensitive)
    const filteredSearch = this.marketingOrders.filter(
      (mo) =>
        mo.mo_ID.toString().includes(this.searchText) ||
        mo.type.toLowerCase().includes(this.searchText.toLowerCase())
    );

    // Tampilkan hasil filter pada halaman pertama
    this.onChangePage(filteredSearch.slice(0, this.pageSize));
  }

  resetSearch(): void {
    this.searchText = '';
    this.onChangePage(this.marketingOrders.slice(0, this.pageSize));
  }

  navigateToAdd() {
    this.router.navigate(['/transaksi/add-mo-ppc']);
  }

  navigateToDetail(idMo: String){
    this.router.navigate(['/transaksi/detail-mo-ppc', idMo]);
  }

  navigateToEdit(idMo: String){
    this.router.navigate(['/transaksi/edit-mo-ppc', idMo]);
  }
}
