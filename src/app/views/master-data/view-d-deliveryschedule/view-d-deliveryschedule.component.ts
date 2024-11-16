import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DDeliverySchedule } from 'src/app/models/d-deliveryschedule';
import { ApiResponse } from 'src/app/response/Response';
import { DDeliveryScheduleService } from 'src/app/services/master-data/DdeliverySchedule/DdeliverySchedule.service';
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver';
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';
import { DeliverySchedule } from 'src/app/models/DeliverySchedule';
import { DeliveryScheduleService } from 'src/app/services/master-data/deliverySchedule/deliverySchedule.service';

declare var $: any;
import * as XLSX from 'xlsx';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-view-d-deliveryschedule',
  templateUrl: './view-d-deliveryschedule.component.html',
  styleUrls: ['./view-d-deliveryschedule.component.scss'],
})
export class ViewDDeliveryScheduleComponent implements OnInit {
  //Variable Declaration
  ddeliveryScedules: DDeliverySchedule[] = [];
  searchText: string = '';
  errorMessage: string | null = null;
  editDDeliveryScheduleTypeObject: DDeliverySchedule = new DDeliverySchedule();
  isEditMode: boolean = false;
  file: File | null = null;
  editDDeliveryScheduleTypeForm: FormGroup;
  uom: any;
  public uomOptionData: Array<Select2OptionData>;
  public options: Options = {
    width: '100%',
    minimumResultsForSearch: 0,
  };
  DeliverySchedules: DeliverySchedule[];

  // getProductName(productID: number): string {
  //   const pattern = this..find(p => p.pattern_ID === patternID);
  //   return pattern ? pattern.pattern_NAME : 'Unknown';
  // }

  // Pagination
  pageOfItems: Array<any>;
  pageSize: number = 5;
  totalPages: number = 5;
  displayedColumns: string[] = ['no', 'detail_DS_ID', 'ds_ID', 'part_NUM', 'date_DS', 'total_DELIVERY', 'status', 'action'];
  dataSource: MatTableDataSource<DDeliverySchedule>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private ddeliveryschedule: DDeliveryScheduleService, private fb: FormBuilder, private DeliveryScheduleService: DeliveryScheduleService) {
    this.editDDeliveryScheduleTypeForm = this.fb.group({
      dsID: ['', Validators.required],
      partNum: ['', Validators.required],
      date: ['', Validators.required],
      totalDelvery: ['', Validators.required],
    });
    this.loadDeliverySchedule();
  }

  ngOnInit(): void {
    this.getAllDDeliverySchedule();
  }

  getAllDDeliverySchedule(): void {
    this.ddeliveryschedule.getAllDDeliverySchedule().subscribe(
      (response: ApiResponse<DDeliverySchedule[]>) => {
        this.ddeliveryScedules = response.data;
        this.dataSource = new MatTableDataSource(this.ddeliveryScedules);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        // this.onChangePage(this.ddeliveryScedules.slice(0, this.pageSize));
      },
      (error) => {
        this.errorMessage = 'Failed to load Detail Delivery Schedule: ' + error.message;
      }
    );
  }
  private loadDeliverySchedule(): void {
    this.DeliveryScheduleService.getAllDeliverySchedule().subscribe(
      (response: ApiResponse<DeliverySchedule[]>) => {
        this.DeliverySchedules = response.data;

        if (!this.uomOptionData) {
          this.uomOptionData = [];
        }

        this.uomOptionData = this.DeliverySchedules.map((element) => ({
          id: element.ds_ID.toString(), // Ensure the ID is a string
          text: element.ds_ID.toString(), // Set the text to the name (or other property)
        }));
      },
      (error) => {
        this.errorMessage = 'Failed to load delivery schedule: ' + error.message;
      }
    );
  }
  downloadExcel(): void {
    this.ddeliveryschedule.exportDDeliveryScheduleExcel().subscribe({
      next: (response) => {
        // Menggunakan nama file yang sudah ditentukan di backend
        const filename = 'DETAIL_DELIVERY_SCHEDULE.xlsx'; // Nama file bisa dinamis jika diperlukan
        saveAs(response, filename); // Mengunduh file
      },
      error: (err) => {
        console.error('Download error:', err);
      },
    });
  }
  activateData(dDeliverySchedule: DDeliverySchedule): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This data Detail delivery schedule will be Activated!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.ddeliveryschedule.activateDdeliverySchedule(dDeliverySchedule).subscribe(
          (response) => {
            Swal.fire('Activated!', 'Data Detail delivery schedule has been Activated', 'success').then(() => {
              window.location.reload();
            });
          },
          (err) => {
            Swal.fire('Error!', 'Failed to Activated the detail delivery schedule.', 'error');
          }
        );
      }
    });
  }

  onChangePage(pageOfItems: Array<any>) {
    this.pageOfItems = pageOfItems;
  }

  onSearchChange(): void {
    this.dataSource.filter = this.searchText.trim().toLowerCase();
  }

  resetSearch(): void {
    this.searchText = '';
    this.onChangePage(this.ddeliveryScedules.slice(0, this.pageSize));
  }

  updateDDeliverySchedule(): void {
    this.ddeliveryschedule.updateDDeliverySchedule(this.editDDeliveryScheduleTypeObject).subscribe(
      (response) => {
        // SweetAlert setelah update berhasil
        Swal.fire({
          title: 'Success!',
          text: 'Data Detail Delivery Schedule successfully updated.',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then((result) => {
          if (result.isConfirmed) {
            $('#editModal').modal('hide');
            window.location.reload();
          }
        });
      },
      (err) => {
        Swal.fire('Error!', 'Error updating data.', 'error');
      }
    );
  }

  openModalEdit(idDetail: number): void {
    this.isEditMode = true;
    this.getDDeliveryScheduleByID(idDetail);
    $('#editModal').modal('show');
  }

  getDDeliveryScheduleByID(idDetail: number): void {
    this.ddeliveryschedule.getDDeliveryScheduleByID(idDetail).subscribe(
      (response: ApiResponse<DDeliverySchedule>) => {
        this.editDDeliveryScheduleTypeObject = response.data;
      },
      (error) => {
        this.errorMessage = 'Failed to load Detail Delivery Schedule: ' + error.message;
      }
    );
  }

  deleteData(ddeliveryschedulee: DDeliverySchedule): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This data Detail Delivery Schedule will be deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.ddeliveryschedule.deleteDDeliverySchedule(ddeliveryschedulee).subscribe(
          (response) => {
            Swal.fire('Deleted!', 'Data Detail Delivery Schelude has been deleted', 'success').then(() => {
              window.location.reload();
            });
          },
          (err) => {
            Swal.fire('Error!', 'Failed to delete the Delivery Schedule.', 'error');
          }
        );
      }
    });
  }

  openModalUpload(): void {
    $('#uploadModal').modal('show');
  }

  downloadTemplate() {
    const link = document.createElement('a');
    link.href = 'assets/Template Excel/Layout_Detail_Delivery_Schedule.xlsx';
    link.download = 'Layout_Master_Detail_Delivery_Schedule.xlsx';
    link.click();
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const fileName = file.name.toLowerCase();

      // Validasi ekstensi file
      if (fileName.endsWith('.xls') || fileName.endsWith('.xlsx')) {
        this.file = file; // Hanya simpan file jika ekstensi valid
      } else {
        Swal.fire({
          icon: 'warning',
          title: 'Invalid File Type',
          text: 'Please upload a valid Excel file (.xls or .xlsx).',
          confirmButtonText: 'OK',
        });
        // Kosongkan file jika ekstensi tidak valid
        this.file = null;
        input.value = '';
      }
    }
  }

  uploadFileExcel() {
    if (this.file) {
      const formData = new FormData();
      formData.append('file', this.file);
      // unggah file Excel
      this.ddeliveryschedule.uploadFileExcel(formData).subscribe(
        (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Success!',
            text: 'Excel file uploaded successfully.',
            confirmButtonText: 'OK',
          }).then(() => {
            $('#editModal').modal('hide');
            window.location.reload();
          });
        },
        (error) => {
          console.error('Error uploading file', error);
          Swal.fire({
            icon: 'error',
            title: 'Failed!',
            text: 'An error occurred while uploading the file.',
            confirmButtonText: 'OK',
          });
        }
      );
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Warning!',
        text: 'Please select a file to upload.',
        confirmButtonText: 'OK',
      });
    }
  }
}
