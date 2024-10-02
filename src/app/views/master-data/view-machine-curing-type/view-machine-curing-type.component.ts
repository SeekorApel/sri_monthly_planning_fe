import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MachineCuringType } from 'src/app/models/machine-curing-type';
import { ApiResponse } from 'src/app/response/Response';
import { MachineCuringTypeService } from 'src/app/services/master-data/machine-curing-type/machine-curing-type.service';
import Swal from 'sweetalert2';
declare var $: any;
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-view-machine-curing-type',
  templateUrl: './view-machine-curing-type.component.html',
  styleUrls: ['./view-machine-curing-type.component.scss'],
})
export class ViewMachineCuringTypeComponent implements OnInit {
  //Variable Declaration
  machineCuringTypes: MachineCuringType[] = [];
  searchText: string = '';
  errorMessage: string | null = null;
  edtMCTObject: MachineCuringType = new MachineCuringType();
  isEditMode: boolean = false;
  file: File | null = null;
  editMCTForm: FormGroup;

  // Pagination
  pageOfItems: Array<any>;
  pageSize: number = 5;
  totalPages: number = 5;

  constructor(private machineCuringTypeService: MachineCuringTypeService, private fb: FormBuilder) {
    this.editMCTForm = this.fb.group({
      description: ['', Validators.required],
      cavity: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getAllMachineCuringType();
  }

  getAllMachineCuringType(): void {
    this.machineCuringTypeService.getAllMCT().subscribe(
      (response: ApiResponse<MachineCuringType[]>) => {
        this.machineCuringTypes = response.data;
        this.onChangePage(this.machineCuringTypes.slice(0, this.pageSize));
      },
      (error) => {
        this.errorMessage = 'Failed to load Machine Curing Type: ' + error.message;
      }
    );
  }

  onChangePage(pageOfItems: Array<any>) {
    this.pageOfItems = pageOfItems;
  }

  onSearchChange(): void {
    // Lakukan filter berdasarkan nama MCT yang mengandung text pencarian (case-insensitive)
    const filteredMCT = this.machineCuringTypes.filter((mct) => mct.description.toLowerCase().includes(this.searchText.toLowerCase()) || mct.machinecuringtype_ID.toString().includes(this.searchText));

    // Tampilkan hasil filter pada halaman pertama
    this.onChangePage(filteredMCT.slice(0, this.pageSize));
  }

  resetSearch(): void {
    this.searchText = '';
    this.onChangePage(this.machineCuringTypes.slice(0, this.pageSize));
  }

  updateMCT(): void {
    this.machineCuringTypeService.updateMCT(this.edtMCTObject).subscribe(
      (response) => {
        // SweetAlert setelah update berhasil
        Swal.fire({
          title: 'Success!',
          text: 'Data Machine Curing Type successfully updated.',
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

  openModalEdit(idMCT: number): void {
    this.isEditMode = true;
    this.getMCTById(idMCT);
    $('#editModal').modal('show');
  }

  getMCTById(idMCT: number): void {
    this.machineCuringTypeService.getMctById(idMCT).subscribe(
      (response: ApiResponse<MachineCuringType>) => {
        this.edtMCTObject = response.data;
      },
      (error) => {
        this.errorMessage = 'Failed to load plants: ' + error.message;
      }
    );
  }

  deleteData(Mct: MachineCuringType): void {
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
        this.machineCuringTypeService.deleteMct(Mct).subscribe(
          (response) => {
            Swal.fire('Deleted!', 'Data plant has been deleted', 'success').then(() => {
              window.location.reload();
            });
          },
          (err) => {
            Swal.fire('Error!', 'Failed to delete the plant.', 'error');
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
    link.href = 'assets/Template Excel/Layout_Master_Machine_Curing_Type.xlsx';
    link.download = 'Layout_Master_Machine_Curing_Type.xlsx';
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
      this.machineCuringTypeService.uploadFileExcel(formData).subscribe(
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
