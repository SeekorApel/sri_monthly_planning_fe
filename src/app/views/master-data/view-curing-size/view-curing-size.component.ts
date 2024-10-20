import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Curing_Size } from 'src/app/models/curingSize';
import { ApiResponse } from 'src/app/response/Response';
import { CuringSizeService } from 'src/app/services/master-data/curing-size/curing-size.service';
import Swal from 'sweetalert2';
declare var $: any;
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-view-curing-size',
  templateUrl: './view-curing-size.component.html',
  styleUrls: ['./view-curing-size.component.scss'],
})
export class ViewCuringSizeComponent implements OnInit {
  //Variable Declaration
  curingSizes: Curing_Size[] = [];
  searchText: string = '';
  errorMessage: string | null = null;
  edtCuringSizeObject: Curing_Size = new Curing_Size();
  isEditMode: boolean = false;
  file: File | null = null;
  editCuringSizeForm: FormGroup;

  // Pagination
  pageOfItems: Array<any>;
  pageSize: number = 5;
  totalPages: number = 5;

  constructor(private curingSizeService: CuringSizeService, private fb: FormBuilder) {
    this.editCuringSizeForm = this.fb.group({
      machineCuringSizeID: ['', Validators.required],
      sizeID: ['', Validators.required],
      capacity: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getAllCuringSize();
  }

  getAllCuringSize(): void {
    this.curingSizeService.getAllCuringSize().subscribe(
      (response: ApiResponse<Curing_Size[]>) => {
        this.curingSizes = response.data;
        this.onChangePage(this.curingSizes.slice(0, this.pageSize));
      },
      (error) => {
        this.errorMessage = 'Failed to load curing sizes: ' + error.message;
      }
    );
  }

  onChangePage(pageOfItems: Array<any>) {
    this.pageOfItems = pageOfItems;
  }

  onSearchChange(): void {
    // Lakukan filter berdasarkan nama plant yang mengandung text pencarian (case-insensitive)
    const filteredCuringSizes = this.curingSizes.filter((curingSizes) => 
      curingSizes.size_ID.toLowerCase().includes(this.searchText.toLowerCase()) ||
      curingSizes.machinecuringtype_ID.toString().includes(this.searchText) ||
      curingSizes.capacity.toString().includes(this.searchText) 
    );

    // Tampilkan hasil filter pada halaman pertama
    this.onChangePage(filteredCuringSizes.slice(0, this.pageSize));
  }

  resetSearch(): void {
    this.searchText = '';
    this.onChangePage(this.curingSizes.slice(0, this.pageSize));
  }

  updateCuringSize(): void {
    this.curingSizeService.updateCuringSize(this.edtCuringSizeObject).subscribe(
      (response) => {
        // SweetAlert setelah update berhasil
        Swal.fire({
          title: 'Success!',
          text: 'Data curing size successfully updated.',
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

  openModalEdit(idCuringSize: number): void {
    this.isEditMode = true;
    this.getCuringSizeById(idCuringSize);
    $('#editModal').modal('show');
  }

  getCuringSizeById(idCuringSize: number): void {
    this.curingSizeService.getCuringSizeById(idCuringSize).subscribe(
      (response: ApiResponse<Curing_Size>) => {
        this.edtCuringSizeObject = response.data;
      },
      (error) => {
        this.errorMessage = 'Failed to load curing size: ' + error.message;
      }
    );
  }

  deleteData(curingSize: Curing_Size): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This data curing size will be deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.curingSizeService.deleteCuringSize(curingSize).subscribe(
          (response) => {
            Swal.fire('Deleted!', 'Data curing size has been deleted', 'success').then(() => {
              window.location.reload();
            });
          },
          (err) => {
            Swal.fire('Error!', 'Failed to delete the curing size.', 'error');
          }
        );
      }
    });
  }

  activateData(curingSize: Curing_Size): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This data curing size will be Activated!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.curingSizeService.activateCuringSize(curingSize).subscribe(
          (response) => {
            Swal.fire('Activated!', 'Data curing size has been Activated', 'success').then(() => {
              window.location.reload();
            });
          },
          (err) => {
            Swal.fire('Error!', 'Failed to Activated the curing size.', 'error');
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
    link.href = 'assets/Template Excel/Layout_Curing_Size.xlsx';
    link.download = 'Layout_Curing_Size.xlsx';
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
      this.curingSizeService.uploadFileExcel(formData).subscribe(
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
    this.curingSizeService.exportCuringSizeExcel().subscribe({
      next: (response) => {
        // Menggunakan nama file yang sudah ditentukan di backend
        const filename = 'CURING_SIZE_DATA.xlsx'; // Nama file bisa dinamis jika diperlukan
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
