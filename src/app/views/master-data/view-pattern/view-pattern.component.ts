import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Pattern } from 'src/app/models/Pattern';
import { ApiResponse } from 'src/app/response/Response';
import { PatternService } from 'src/app/services/master-data/pattern/pattern.service';
import Swal from 'sweetalert2';
declare var $: any;
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-view-pattern',
  templateUrl: './view-pattern.component.html',
  styleUrls: ['./view-pattern.component.scss'],
})
export class ViewPatternComponent implements OnInit {
  //Variable Declaration
  patterns: Pattern[] = [];
  searchText: string = '';
  errorMessage: string | null = null;
  edtPatternObject: Pattern = new Pattern();
  isEditMode: boolean = false;
  file: File | null = null;
  editPatternForm: FormGroup;

  // Pagination
  pageOfItems: Array<any>;
  pageSize: number = 5;
  totalPages: number = 5;
  displayedColumns: string[] = ['no', 'pattern_ID', 'pattern_NAME', 'status', 'action'];
  dataSource: MatTableDataSource<Pattern>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private patternService: PatternService, private fb: FormBuilder) {
    this.editPatternForm = this.fb.group({
      patternName: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getAllPattern();
  }
  activateData(pattern: Pattern): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This data pattern will be Activated!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.patternService.activatePattern(pattern).subscribe(
          (response) => {
            Swal.fire('Activated!', 'Data pattern has been Activated', 'success').then(() => {
              window.location.reload();
            });
          },
          (err) => {
            Swal.fire('Error!', 'Failed to Activated the pattern.', 'error');
          }
        );
      }
    });
  }

  getAllPattern(): void {
    Swal.fire({
      title: 'Loading...',
      html: 'Please wait while fetching data Pattern.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.patternService.getAllPattern().subscribe(
      (response: ApiResponse<Pattern[]>) => {
        Swal.close();
        this.patterns = response.data;
        this.dataSource = new MatTableDataSource(this.patterns);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        // this.onChangePage(this.patterns.slice(0, this.pageSize));
      },
      (error) => {
        Swal.close();
        Swal.fire('Error!', 'Failed to load patterns.', 'error');
        this.errorMessage = 'Failed to load patterns: ' + error.message;
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
    this.dataSource.filter = this.searchText.trim().toLowerCase();
  }

  updatePattern(): void {
    this.patternService.updatePattern(this.edtPatternObject).subscribe(
      (response) => {
        // SweetAlert setelah update berhasil
        Swal.fire({
          title: 'Success!',
          text: 'Data Pattern successfully updated.',
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

  openModalEdit(idPattern: number): void {
    this.isEditMode = true;
    this.getPatternByID(idPattern);
    $('#editModal').modal('show');
  }

  getPatternByID(idPattern: number): void {
    this.patternService.getPatternById(idPattern).subscribe(
      (response: ApiResponse<Pattern>) => {
        this.edtPatternObject = response.data;
      },
      (error) => {
        this.errorMessage = 'Failed to load patterns: ' + error.message;
      }
    );
  }

  deleteData(pattern: Pattern): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This data pattern will be deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.patternService.deletePattern(pattern).subscribe(
          (response) => {
            Swal.fire('Deleted!', 'Data pattern has been deleted', 'success').then(() => {
              window.location.reload();
            });
          },
          (err) => {
            Swal.fire('Error!', 'Failed to delete the pattern.', 'error');
          }
        );
      }
    });
  }

  openModalUpload(): void {
    $('#uploadModal').modal('show');
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
      Swal.fire({
        icon: 'info',
        title: 'Processing...',
        html: 'Please wait while saving data patterns.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const formData = new FormData();
      formData.append('file', this.file);
      // unggah file Excel
      this.patternService.uploadFileExcel(formData).subscribe(
        (response) => {
          Swal.close();
          if(response.status === 200) {
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'Excel file uploaded successfully.',
              confirmButtonText: 'OK',
            }).then(() => {
              $('#editModal').modal('hide');
              window.location.reload();
            });
          }else {
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: response.message,
              confirmButtonText: 'OK',
            }).then(() => {
              $('#editModal').modal('hide');
              window.location.reload();
            });
          }
        },
        (error) => {
          Swal.close();
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
      Swal.close();
      Swal.fire({
        icon: 'warning',
        title: 'Warning!',
        text: 'Please select a file to upload.',
        confirmButtonText: 'OK',
      });
    }
  }
  downloadExcel(): void {
    Swal.fire({
      icon: 'info',
      title: 'Processing...',
      html: 'Please wait while downloading pattern data.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.patternService.exportExcel().subscribe({
      next: (response) => {
        Swal.close();
        // Menggunakan nama file yang sudah ditentukan di backend
        const filename = 'PATTERN_DATA.xlsx'; // Nama file bisa dinamis jika diperlukan
        saveAs(response, filename); // Mengunduh file
      },
      error: (err) => {
        Swal.close();
        Swal.fire('Error!', 'Error Downloading Data.', 'error');
        console.error('Download error:', err);
      },
    });
  }
  tamplateExcel(): void {
    Swal.fire({
      icon: 'info',
      title: 'Processing...',
      html: 'Please wait while downloading pattern layout.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.patternService.tamplateExcel().subscribe({
      next: (response) => {
        Swal.close();
        const filename = 'Layout_PATTERN.xlsx'; // Nama file bisa dinamis jika diperlukan
        saveAs(response, filename); // Mengunduh file
      },
      error: (err) => {
        Swal.close();
        Swal.fire('Error!', 'Error Downloading layout.', 'error');
        console.error('Download error:', err);
      },
    });
  }
}
