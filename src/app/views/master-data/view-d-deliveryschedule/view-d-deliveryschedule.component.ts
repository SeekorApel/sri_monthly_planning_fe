import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DDeliverySchedule } from 'src/app/models/d-deliveryschedule';
import { ApiResponse } from 'src/app/response/Response';
import { DDeliveryScheduleService } from 'src/app/services/master-data/DdeliverySchedule/DdeliverySchedule.service';
import Swal from 'sweetalert2';
declare var $: any;
import * as XLSX from 'xlsx';

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

  // Pagination
  pageOfItems: Array<any>;
  pageSize: number = 5;
  totalPages: number = 5;

  constructor(private ddeliveryschedule: DDeliveryScheduleService, private fb: FormBuilder) {
    this.editDDeliveryScheduleTypeForm = this.fb.group({
      dsID: ['', Validators.required],
      partNum: ['', Validators.required],
      date: ['', Validators.required],
      totalDelvery: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getAllDDeliverySchedule();
  }

  getAllDDeliverySchedule(): void {
    this.ddeliveryschedule.getAllDDeliverySchedule().subscribe(
      (response: ApiResponse<DDeliverySchedule[]>) => {
        this.ddeliveryScedules = response.data;
        console.log(this.ddeliveryScedules);
        this.onChangePage(this.ddeliveryScedules.slice(0, this.pageSize));
      },
      (error) => {
        this.errorMessage = 'Failed to load Detail Delivery Schedule: ' + error.message;
      }
    );
  }

  onChangePage(pageOfItems: Array<any>) {
    this.pageOfItems = pageOfItems;
  }

  onSearchChange(): void {
    // Lakukan filter berdasarkan nama detail DeliverySchedule yang mengandung text pencarian (case-insensitive)
    const filteredDDeliverySchedule = this.ddeliveryScedules.filter((dds) => dds.part_NUM.toLowerCase().includes(this.searchText.toLowerCase()) || dds.detail_DS_ID.toString().includes(this.searchText));

    // Tampilkan hasil filter pada halaman pertama
    this.onChangePage(filteredDDeliverySchedule.slice(0, this.pageSize));
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
    link.href = 'assets/Template Excel/Layout_Master_DDelivery_Schedule.xlsx';
    link.download = 'Layout_Master_DDelivery_Schedule.xlsx';
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
