import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeliverySchedule } from 'src/app/models/DeliverySchedule';
import { ApiResponse } from 'src/app/response/Response';
import { DeliveryScheduleService } from 'src/app/services/master-data/deliverySchedule/deliverySchedule.service';
import Swal from 'sweetalert2';
declare var $: any;
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-view-delivery-schedule',
  templateUrl: './view-delivery-schedule.component.html',
  styleUrls: ['./view-delivery-schedule.component.scss'],
})
export class ViewDeliveryScheduleComponent implements OnInit {
  //Variable Declaration
  deliverySchedules: DeliverySchedule[] = [];
  searchText: string = '';
  errorMessage: string | null = null;
  edtDeliveryScheduleObject: DeliverySchedule = new DeliverySchedule();
  isEditMode: boolean = false;
  file: File | null = null;
  editDeliveryScheduleForm: FormGroup;

  // Pagination
  pageOfItems: Array<any>;
  pageSize: number = 5;
  totalPages: number = 5;

  constructor(private deliveryScheduleService: DeliveryScheduleService, private fb: FormBuilder) {
    this.editDeliveryScheduleForm = this.fb.group({
      effectiveTime: [null, Validators.required],
      dataIssue: ['', Validators.required],
      category: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getAllDeliverySchedule();
  }

  getAllDeliverySchedule(): void {
    this.deliveryScheduleService.getAllDeliverySchedule().subscribe(
      (response: ApiResponse<DeliverySchedule[]>) => {
        this.deliverySchedules = response.data;
        this.onChangePage(this.deliverySchedules.slice(0, this.pageSize));
      },
      (error) => {
        this.errorMessage = 'Failed to load delivery schedule: ' + error.message;
      }
    );
  }

  onChangePage(pageOfItems: Array<any>) {
    this.pageOfItems = pageOfItems;
  }

  onSearchChange(): void {
    // Lakukan filter berdasarkan nama plant yang mengandung text pencarian (case-insensitive)
    const filteredDeliverySchedul = this.deliverySchedules.filter((deliverySchedule) => 
    deliverySchedule.effective_TIME.toString().includes(this.searchText) ||
    deliverySchedule.date_ISSUED.toString().includes(this.searchText) ||
    deliverySchedule.category.toLowerCase().includes(this.searchText.toLowerCase()));

    // Tampilkan hasil filter pada halaman pertama
    this.onChangePage(filteredDeliverySchedul.slice(0, this.pageSize));
  }

  resetSearch(): void {
    this.searchText = '';
    this.onChangePage(this.deliverySchedules.slice(0, this.pageSize));
  }

  updateDeliverySchedule(): void {
    this.deliveryScheduleService.updateDeliverySchedule(this.edtDeliveryScheduleObject).subscribe(
      (response) => {
        // SweetAlert setelah update berhasil
        Swal.fire({
          title: 'Success!',
          text: 'Data delivery schedule successfully updated.',
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

  openModalEdit(iddDeliverySchedule: number): void {
    this.isEditMode = true;
    this.getDeliveryScheduleById(iddDeliverySchedule);
    $('#editModal').modal('show');
  }

  getDeliveryScheduleById(iddDeliverySchedule: number): void {
    this.deliveryScheduleService.getDeliveryScheduleById(iddDeliverySchedule).subscribe(
      (response: ApiResponse<DeliverySchedule>) => {
        this.edtDeliveryScheduleObject = response.data;
      },
      (error) => {
        this.errorMessage = 'Failed to load delivery schedules: ' + error.message;
      }
    );
  }

  deleteData(deliverySchedule: DeliverySchedule): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This data delivery schedule will be deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.deliveryScheduleService.deleteDeliverySchedule(deliverySchedule).subscribe(
          (response) => {
            Swal.fire('Deleted!', 'Data delivery schedule has been deleted', 'success').then(() => {
              window.location.reload();
            });
          },
          (err) => {
            Swal.fire('Error!', 'Failed to delete the delivery schedule.', 'error');
          }
        );
      }
    });
  }

  activateData(deliverySchedule: DeliverySchedule): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This data delivery schedule will be Activated!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.deliveryScheduleService.activateDeliverySchedule(deliverySchedule).subscribe(
          (response) => {
            Swal.fire('Activated!', 'Data delivery schedule has been Activated', 'success').then(() => {
              window.location.reload();
            });
          },
          (err) => {
            Swal.fire('Error!', 'Failed to Activated the delivery schedule.', 'error');
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
    link.href = 'assets/Template Excel/Layout_Delivery_Schedule.xlsx';
    link.download = 'Layout_Delivery_Schedule.xlsx';
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
      this.deliveryScheduleService.uploadFileExcel(formData).subscribe(
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

  downloadExcel(): void {
    this.deliveryScheduleService.exportDeliveryScheduleExcel().subscribe({
      next: (response) => {
        // Menggunakan nama file yang sudah ditentukan di backend
        const filename = 'DELIVERY_SCHEDULE_DATA.xlsx'; // Nama file bisa dinamis jika diperlukan
        saveAs(response, filename); // Mengunduh file
      },
      error: (err) => {
        console.error('Download error:', err);
      }
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(data, `${fileName}_export_${new Date().getTime()}.xlsx`);
  }

  // downloadExcel(): void {
  //   this.plantService.downloadPlantsExcel().subscribe(
  //     (response: Blob) => {
  //       const blobUrl = window.URL.createObjectURL(response);
  //       const a = document.createElement('a');
  //       a.href = blobUrl;
  //       a.download = 'MASTER_PLANT.xlsx';
  //       a.click();
  //       window.URL.revokeObjectURL(blobUrl);
  //     },
  //     (error) => {
  //       this.errorMessage = 'Failed to download Excel: ' + error.message;
  //     }
  //   );
  // }
}
