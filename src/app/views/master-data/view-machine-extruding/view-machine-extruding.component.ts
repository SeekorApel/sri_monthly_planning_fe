import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MachineExtruding } from 'src/app/models/machine-extruding';
import { ApiResponse } from 'src/app/response/Response';
import { MachineExtrudingService } from 'src/app/services/master-data/machine-extruding/machine-extruding.service';
import Swal from 'sweetalert2';
declare var $: any;
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-view-machine-extruding',
  templateUrl: './view-machine-extruding.component.html',
  styleUrls: ['./view-machine-extruding.component.scss'],
})
export class ViewMachineExtrudingComponent implements OnInit {
  //Variable Declaration
  machineExtudings: MachineExtruding[] = [];
  searchText: string = '';
  errorMessage: string | null = null;
  editMachineExtrudingTypeObject: MachineExtruding = new MachineExtruding();
  isEditMode: boolean = false;
  file: File | null = null;
  editMachineExtrudingTypeForm: FormGroup;

  // Pagination
  pageOfItems: Array<any>;
  pageSize: number = 5;
  totalPages: number = 5;

  constructor(private MEService: MachineExtrudingService, private fb: FormBuilder) {
    this.editMachineExtrudingTypeForm = this.fb.group({
      buildingID: ['', Validators.required],
      Type: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getAllMachineExtruding();
  }

  getAllMachineExtruding(): void {
    this.MEService.getAllMachineExtruding().subscribe(
      (response: ApiResponse<MachineExtruding[]>) => {
        this.machineExtudings = response.data;
        console.log(this.machineExtudings);
        this.onChangePage(this.machineExtudings.slice(0, this.pageSize));
      },
      (error) => {
        this.errorMessage = 'Failed to load machine extruding: ' + error.message;
      }
    );
  }

  onChangePage(pageOfItems: Array<any>) {
    this.pageOfItems = pageOfItems;
  }

  onSearchChange(): void {
    // Lakukan filter berdasarkan nama MachineTASSType yang mengandung text pencarian (case-insensitive)
    const filteredmachineExtruding = this.machineExtudings.filter((meType) => meType.type.toLowerCase().includes(this.searchText.toLowerCase()) || meType.ID_machine_ext.toString().includes(this.searchText));

    // Tampilkan hasil filter pada halaman pertama
    this.onChangePage(filteredmachineExtruding.slice(0, this.pageSize));
  }

  resetSearch(): void {
    this.searchText = '';
    this.onChangePage(this.machineExtudings.slice(0, this.pageSize));
  }

  updateMachineExtruding(): void {
    this.MEService.updateMachineExtruding(this.editMachineExtrudingTypeObject).subscribe(
      (response) => {
        // SweetAlert setelah update berhasil
        Swal.fire({
          title: 'Success!',
          text: 'Data Machine Extruding successfully updated.',
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

  openModalEdit(idMachineExtruding: number): void {
    this.isEditMode = true;
    this.getMachineExtrudingById(idMachineExtruding);
    $('#editModal').modal('show');
  }

  getMachineExtrudingById(idMachineExtruding: number): void {
    this.MEService.getMachineExtrudingByID(idMachineExtruding).subscribe(
      (response: ApiResponse<MachineExtruding>) => {
        this.editMachineExtrudingTypeObject = response.data;
      },
      (error) => {
        this.errorMessage = 'Failed to load Machine Extruding: ' + error.message;
      }
    );
  }

  deleteData(machineExtruding: MachineExtruding): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This data machine extruding will be deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.MEService.deleteMachineExtruding(machineExtruding).subscribe(
          (response) => {
            Swal.fire('Deleted!', 'Data Machine Extruding has been deleted', 'success').then(() => {
              window.location.reload();
            });
          },
          (err) => {
            Swal.fire('Error!', 'Failed to delete the Machine Extruding.', 'error');
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
    link.href = 'assets/Template Excel/Layout_Master_Machine_Extruding.xlsx';
    link.download = 'Layout_Master_Machine_Extruding.xlsx';
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
      this.MEService.uploadFileExcel(formData).subscribe(
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
