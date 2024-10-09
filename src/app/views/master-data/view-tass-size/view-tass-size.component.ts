import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Tass_Size } from 'src/app/models/Tass_Size';
import { ApiResponse } from 'src/app/response/Response';
import { TassSizeService } from 'src/app/services/master-data/tass-size/tass-size.service';
import Swal from 'sweetalert2';
declare var $: any;
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-view-tass-size',
  templateUrl: './view-tass-size.component.html',
  styleUrls: ['./view-tass-size.component.scss']
})
export class ViewTassSizeComponent implements OnInit {

  //Variable Declaration
  tass_sizes: Tass_Size[] = [];
  searchText: string = '';
  errorMessage: string | null = null;
  edtTassSizeObject: Tass_Size = new Tass_Size();
  isEditMode: boolean = false;
  file: File | null = null;
  editTassSizeForm: FormGroup;

  // Pagination
  pageOfItems: Array<any>;
  pageSize: number = 5;
  totalPages: number = 5;

  constructor(private tass_sizeService: TassSizeService, private fb: FormBuilder) { 
    this.editTassSizeForm = this.fb.group({
      machinetasstype: ['', Validators.required],
      sizeid: ['', Validators.required],
      capacity: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getAllTassSize();
  }

  getAllTassSize(): void {
    this.tass_sizeService.getAllTassSize().subscribe(
      (response: ApiResponse<Tass_Size[]>) => {
        this.tass_sizes = response.data;
        this.onChangePage(this.tass_sizes.slice(0, this.pageSize));
      },
      (error) => {
        this.errorMessage = 'Failed to load tass sizes: ' + error.message;
      }
    );
  }

  onChangePage(pageOfItems: Array<any>) {
    this.pageOfItems = pageOfItems;
  }

  onSearchChange(): void {
    const filteredTassSizes = this.tass_sizes.filter(
      (tass_size) =>
        tass_size.machinetasstype_ID
          .toLowerCase()
          .includes(this.searchText.toLowerCase()) ||
        tass_size.tassize_ID.toString().includes(this.searchText)
    );

    // Tampilkan hasil filter pada halaman pertama
    this.onChangePage(filteredTassSizes.slice(0, this.pageSize));
  }

  resetSearch(): void {
    this.searchText = '';
    this.onChangePage(this.tass_sizes.slice(0, this.pageSize));
  }

  updateTassSize(): void {
    
    this.tass_sizeService.updateTassSize(this.edtTassSizeObject).subscribe(
      (response) => {
        // SweetAlert setelah update berhasil
        Swal.fire({
          title: 'Success!',
          text: 'Data tass size successfully updated.',
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

  openModalEdit(idTassSize: number): void {
    this.isEditMode = true;
    this.getTassSizeById(idTassSize);
    $('#editModal').modal('show');
  }

  getTassSizeById(idTassSize: number): void {
    this.tass_sizeService.getTassSizeById(idTassSize).subscribe(
      (response: ApiResponse<Tass_Size>) => {
        this.edtTassSizeObject = response.data;
      },
      (error) => {
        this.errorMessage = 'Failed to load tass sizes: ' + error.message;
      }
    );
  }

  deleteData(tass_size: Tass_Size): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This data tass size will be deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.tass_sizeService.deleteTassSize(tass_size).subscribe(
          (response) => {
            Swal.fire('Deleted!', 'Data tass size has been deleted', 'success').then(() => {
              window.location.reload();
            });
          },
          (err) => {
            Swal.fire('Error!', 'Failed to delete the tass size.', 'error');
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
    link.href = 'assets/Template Excel/Layout_Master_Tass_Size.xlsx';
    link.download = 'Layout_Master_Tass_Size.xlsx';
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
      this.tass_sizeService.uploadFileExcel(formData).subscribe(
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
