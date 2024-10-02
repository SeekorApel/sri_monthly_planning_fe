import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MachineTassType } from 'src/app/models/machine-tass-type';
import { ApiResponse } from 'src/app/response/Response';
import { MachineTassTypeService } from 'src/app/services/master-data/machine-tass-type/machine-tass-type.service';
import Swal from 'sweetalert2';
declare var $: any;
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-view-plant',
  templateUrl: './view-machine-tass-type.component.html',
  styleUrls: ['./view-machine-tass-type.component.scss'],
})
export class ViewMachineTassTypeComponent implements OnInit {
  //Variable Declaration
  mtt: MachineTassType[] = [];
  searchText: string = '';
  errorMessage: string | null = null;
  edtMachineTassTypeObject: MachineTassType = new MachineTassType();
  isEditMode: boolean = false;
  file: File | null = null;
  editMachineTassTypeForm: FormGroup;

  // Pagination
  pageOfItems: Array<any>;
  pageSize: number = 5;
  totalPages: number = 5;

  constructor(private mttService: MachineTassTypeService, private fb: FormBuilder) {
    this.editMachineTassTypeForm = this.fb.group({
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getAllMachineTassType();
  }

  getAllMachineTassType(): void {
    this.mttService.getAllMachineTassType().subscribe(
      (response: ApiResponse<MachineTassType[]>) => {
        this.mtt = response.data;
        console.log(this.mtt);
        this.onChangePage(this.mtt.slice(0, this.pageSize));
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
    // Lakukan filter berdasarkan nama MachineTASSType yang mengandung text pencarian (case-insensitive)
    const filteredPlants = this.mtt.filter((mtType) => mtType.description.toLowerCase().includes(this.searchText.toLowerCase()) || mtType.machinetasstype_ID.toString().includes(this.searchText));

    // Tampilkan hasil filter pada halaman pertama
    this.onChangePage(filteredPlants.slice(0, this.pageSize));
  }

  resetSearch(): void {
    this.searchText = '';
    this.onChangePage(this.mtt.slice(0, this.pageSize));
  }

  updateMachineTassType(): void {
    this.mttService.updateMachineTassType(this.edtMachineTassTypeObject).subscribe(
      (response) => {
        // SweetAlert setelah update berhasil
        Swal.fire({
          title: 'Success!',
          text: 'Data Machine Tass Type successfully updated.',
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

  openModalEdit(idMachineTassType: number): void {
    this.isEditMode = true;
    this.getPlantById(idMachineTassType);
    $('#editModal').modal('show');
  }

  getPlantById(idMachineTassType: number): void {
    this.mttService.getMachineTassTypeById(idMachineTassType).subscribe(
      (response: ApiResponse<MachineTassType>) => {
        this.edtMachineTassTypeObject = response.data;
      },
      (error) => {
        this.errorMessage = 'Failed to load Machine Tass Types: ' + error.message;
      }
    );
  }

  deleteData(machinetasstype: MachineTassType): void {
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
        this.mttService.deleteMachineTassType(machinetasstype).subscribe(
          (response) => {
            Swal.fire('Deleted!', 'Data Machine Tass Type has been deleted', 'success').then(() => {
              window.location.reload();
            });
          },
          (err) => {
            Swal.fire('Error!', 'Failed to delete the Machine Tass Type.', 'error');
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
    link.href = 'assets/Template Excel/Layout_Master_Machine_Tass_Type.xlsx';
    link.download = 'Layout_Master_Machine_Tass_Type.xlsx';
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
      this.mttService.uploadFileExcel(formData).subscribe(
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
