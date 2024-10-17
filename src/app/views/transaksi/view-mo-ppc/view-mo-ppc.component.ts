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
  // pageOfItems: Array<any>;
  pageOfItems: any[] = [];
  pageSize: number = 5;
  totalPages: number = 5;

  constructor(private router: Router, private moService: MarketingOrderService) {
    this.dateUtil = ParsingDate;
  }

  ngOnInit(): void {
    //this.getAllMarketingOrder();
    this.dataTemp = [
      {
        moId: "MO-001",
        type: "Regular",
        dateValid: "17-10-2024",
        revisionPpc: 1,
        revisionMarketing: 2,
        month0: "01-10-2024",
        month1: "01-11-2024",
        month2: "01-12-2024",
        statusFilled: 1,
        status: 1,
        creationDate: "10-10-2024",
        createdBy: "user1",
        lastUpdateDate: "15-10-2024",
        lastUpdatedBy: "admin1"
      },
      {
        moId: "MO-002",
        type: "Urgent",
        dateValid: "18-10-2024",
        revisionPpc: 2,
        revisionMarketing: 3,
        month0: "01-11-2024",
        month1: "01-12-2024",
        month2: "01-01-2025",
        statusFilled: 2,
        status: 2,
        creationDate: "11-10-2024",
        createdBy: "user2",
        lastUpdateDate: "16-10-2024",
        lastUpdatedBy: "admin2"
      },
      {
        moId: "MO-003",
        type: "Special",
        dateValid: "19-10-2024",
        revisionPpc: 3,
        revisionMarketing: 4,
        month0: "01-12-2024",
        month1: "01-01-2025",
        month2: "01-02-2025",
        statusFilled: 3,
        status: 3,
        creationDate: "12-10-2024",
        createdBy: "user3",
        lastUpdateDate: "17-10-2024",
        lastUpdatedBy: "admin3"
      },
      {
        moId: "MO-004",
        type: "Emergency",
        dateValid: "20-10-2024",
        revisionPpc: 1,
        revisionMarketing: 5,
        month0: "01-01-2025",
        month1: "01-02-2025",
        month2: "01-03-2025",
        statusFilled: 2,
        status: 4,
        creationDate: "13-10-2024",
        createdBy: "user4",
        lastUpdateDate: "18-10-2024",
        lastUpdatedBy: "admin4"
      },
      {
        moId: "MO-005",
        type: "Routine",
        dateValid: "21-10-2024",
        revisionPpc: 5,
        revisionMarketing: 6,
        month0: "01-02-2025",
        month1: "01-03-2025",
        month2: "01-04-2025",
        statusFilled: 2,
        status: 5,
        creationDate: "14-10-2024",
        createdBy: "user5",
        lastUpdateDate: "19-10-2024",
        lastUpdatedBy: "admin5"
      },
      {
        moId: "MO-006",
        type: "Routine",
        dateValid: "21-10-2024",
        revisionPpc: 5,
        revisionMarketing: 6,
        month0: "01-02-2025",
        month1: "01-03-2025",
        month2: "01-04-2025",
        statusFilled: 3,
        status: 5,
        creationDate: "14-10-2024",
        createdBy: "user5",
        lastUpdateDate: "19-10-2024",
        lastUpdatedBy: "admin5"
      },
      {
        moId: "MO-007",
        type: "Routine",
        dateValid: "21-10-2024",
        revisionPpc: 5,
        revisionMarketing: 6,
        month0: "01-02-2025",
        month1: "01-03-2025",
        month2: "01-04-2025",
        statusFilled: 3,
        status: 5,
        creationDate: "14-10-2024",
        createdBy: "user5",
        lastUpdateDate: "19-10-2024",
        lastUpdatedBy: "admin5"
      }
    ];

  }

  getAllMarketingOrder(): void {
    // this.moService.getAllMarketingOrder().subscribe(
    //   (response: ApiResponse<MarketingOrder[]>) => {
    //     this.marketingOrders = response.data;
    //     this.onChangePage(this.marketingOrders.slice(0, this.pageSize));
    //   },
    //   (error) => {
    //     this.errorMessage = 'Failed to load plants: ' + error.message;
    //   }
    // );
    //this.onChangePage(this.dataTemp.slice(0, this.pageSize));
  }

  onChangePage(pageOfItems: Array<any>) {
    this.pageOfItems = pageOfItems;
  }

  onSearchChange(): void {
    const filteredSearch = this.marketingOrders.filter((mo) => mo.mo_ID.toString().includes(this.searchText) || mo.type.toLowerCase().includes(this.searchText.toLowerCase()));
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
    this.router.navigate(['/transaksi/detail-mo-ppc', idMo]);
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
