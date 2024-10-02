import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Pattern } from 'src/app/models/Pattern';
import { ApiResponse } from 'src/app/response/Response';
import { PatternService } from 'src/app/services/master-data/pattern/pattern.service';
import Swal from 'sweetalert2';
declare var $: any;
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-view-plant',
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

  constructor(private patternService: PatternService, private fb: FormBuilder) {
    this.editPatternForm = this.fb.group({
      patternName: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getAllPattern();
  }

  getAllPattern(): void {
    this.patternService.getAllPattern().subscribe(
      (response: ApiResponse<Pattern[]>) => {
        this.patterns = response.data;
        console.log(this.patterns);
        this.onChangePage(this.patterns.slice(0, this.pageSize));
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
    const filteredPlants = this.patterns.filter((pattern) => pattern.pattern_NAME.toLowerCase().includes(this.searchText.toLowerCase()) || pattern.pattern_ID.toString().includes(this.searchText));

    // Tampilkan hasil filter pada halaman pertama
    this.onChangePage(filteredPlants.slice(0, this.pageSize));
  }

  resetSearch(): void {
    this.searchText = '';
    this.onChangePage(this.patterns.slice(0, this.pageSize));
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
    this.getPlantById(idPattern);
    $('#editModal').modal('show');
  }

  getPlantById(idPattern: number): void {
    this.patternService.getPatternById(idPattern).subscribe(
      (response: ApiResponse<Pattern>) => {
        this.edtPatternObject = response.data;
      },
      (error) => {
        this.errorMessage = 'Failed to load plants: ' + error.message;
      }
    );
  }

  deleteData(pattern: Pattern): void {
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

  downloadTemplate() {
    const link = document.createElement('a');
    link.href = 'assets/Template Excel/Layout_Master_Pattern.xlsx';
    link.download = 'Layout_Master_Pattern.xlsx';
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
      this.patternService.uploadFileExcel(formData).subscribe(
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
