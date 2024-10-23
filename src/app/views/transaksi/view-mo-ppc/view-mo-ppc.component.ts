import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MarketingOrder } from 'src/app/models/MarketingOrder';
import { ApiResponse } from 'src/app/response/Response';
import { MarketingOrderService } from 'src/app/services/transaksi/marketing order/marketing-order.service';
import { ParsingDate } from 'src/app/utils/ParsingDate';
import Swal from 'sweetalert2';

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

  dataTemp: any[];
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
    this.onChangePage(this.marketingOrders.slice(0, this.pageSize));
  }

  onChangePage(pageOfItems: Array<any>) {
    this.pageOfItems = pageOfItems;
  }

  onSearchChange(): void {
    const filteredSearch = this.marketingOrders.filter((mo) => mo.moId.toString().includes(this.searchText) || mo.type.toLowerCase().includes(this.searchText.toLowerCase()));
    this.onChangePage(filteredSearch.slice(0, this.pageSize));
  }

  resetSearch(): void {
    this.searchText = '';
    this.onChangePage(this.marketingOrders.slice(0, this.pageSize));
  }

  navigateToAdd() {
    this.router.navigate(['/transaksi/add-mo-ppc']);
  }

  navigateToDetail(idMo: String) {
    this.router.navigate(['/transaksi/view-revisi-mo-ppc', idMo]);
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
}
