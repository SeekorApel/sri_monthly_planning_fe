import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Quadrant } from 'src/app/models/quadrant';
import { ApiResponse } from 'src/app/response/Response';
import { QuadrantService } from 'src/app/services/master-data/quadrant/quadrant.service';
import Swal from 'sweetalert2';
declare var $: any;
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-view-quadrant',
  templateUrl: './view-quadrant.component.html',
  styleUrls: ['./view-quadrant.component.scss'],
})
export class ViewQuadrantComponent implements OnInit {
  //Variable Declaration
  quadrants: Quadrant[] = [];
  searchText: string = '';
  errorMessage: string | null = null;
  edtQuadrantObject: Quadrant = new Quadrant();
  isEditMode: boolean = false;
  file: File | null = null;
  editQuadrantForm: FormGroup;

  // Pagination
  pageOfItems: Array<any>;
  pageSize: number = 5;
  totalPages: number = 5;

  constructor(private quadrantService: QuadrantService, private fb: FormBuilder) {
    this.editQuadrantForm = this.fb.group({
      quadrantName: ['', Validators.required],
      buildingID: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getAllQuadrant();
  }

  getAllQuadrant(): void {
    this.quadrantService.getAllQuadrant().subscribe(
      (response: ApiResponse<Quadrant[]>) => {
        this.quadrants = response.data;
        this.onChangePage(this.quadrants.slice(0, this.pageSize));
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
    const filteredQuadrant = this.quadrants.filter((quadrant) => 
    quadrant.quadrant_NAME.toLowerCase().includes(this.searchText.toLowerCase()) || 
    quadrant.quadrant_ID.toString().includes(this.searchText) ||
    quadrant.building_ID.toString().includes(this.searchText));

    // Tampilkan hasil filter pada halaman pertama
    this.onChangePage(filteredQuadrant.slice(0, this.pageSize));
  }

  resetSearch(): void {
    this.searchText = '';
    this.onChangePage(this.quadrants.slice(0, this.pageSize));
  }

  updateQuadrant(): void {
    this.quadrantService.updateQuadrant(this.edtQuadrantObject).subscribe(
      (response) => {
        // SweetAlert setelah update berhasil
        Swal.fire({
          title: 'Success!',
          text: 'Data plant successfully updated.',
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

  openModalEdit(idQuadrant: number): void {
    this.isEditMode = true;
    this.getQuadrantById(idQuadrant);
    $('#editModal').modal('show');
  }

  getQuadrantById(idQuadrant: number): void {
    this.quadrantService.getQuadrantById(idQuadrant).subscribe(
      (response: ApiResponse<Quadrant>) => {
        this.edtQuadrantObject = response.data;
      },
      (error) => {
        this.errorMessage = 'Failed to load quadrants: ' + error.message;
      }
    );
  }

  deleteData(quadrant: Quadrant): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This data plant will be deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.quadrantService.deleteQuadrant(quadrant).subscribe(
          (response) => {
            Swal.fire('Deleted!', 'Data quadrant has been deleted', 'success').then(() => {
              window.location.reload();
            });
          },
          (err) => {
            Swal.fire('Error!', 'Failed to delete the quadrant.', 'error');
          }
        );
      }
    });
  }

  activateData(quadrant: Quadrant): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This data plant will be Activated!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.quadrantService.activateQuadrant(quadrant).subscribe(
          (response) => {
            Swal.fire('Activated!', 'Data quadrant has been Activated', 'success').then(() => {
              window.location.reload();
            });
          },
          (err) => {
            Swal.fire('Error!', 'Failed to Activated the quadrant.', 'error');
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
    link.href = 'assets/Template Excel/Layout_Quadrant.xlsx';
    link.download = 'Layout_Quadrant.xlsx';
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
      this.quadrantService.uploadFileExcel(formData).subscribe(
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
    this.quadrantService.exportQuadrantsExcel().subscribe({
      next: (response) => {
        // Menggunakan nama file yang sudah ditentukan di backend
        const filename = 'QUADRANT_DATA.xlsx'; // Nama file bisa dinamis jika diperlukan
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
