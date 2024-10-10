import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { machineAllowance } from 'src/app/models/machineAllowance';
import { ApiResponse } from 'src/app/response/Response';
import { machineAllowanceService } from 'src/app/services/master-data/machine-allowance/machine-allowance.service';
import Swal from 'sweetalert2';
declare var $: any;
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-view-machine-allowance',
  templateUrl: './view-machine-allowance.component.html',
  styleUrls: ['./view-machine-allowance.component.scss'],
})
export class ViewMachineAllowanceComponent implements OnInit {

  //Variable Declaration
  machineAllowances: machineAllowance[] = [];
  searchText: string = '';
  errorMessage: string | null = null;
  edtMachineAllowanceObject: machineAllowance = new machineAllowance();
  isEditMode: boolean = false;
  file: File | null = null;
  editMachineAllowanceForm: FormGroup;

  // Pagination
  pageOfItems: Array<any>;
  pageSize: number = 5;
  totalPages: number = 5;

  constructor(private machineAllowanceService: machineAllowanceService, private fb: FormBuilder) { 
    this.editMachineAllowanceForm = this.fb.group({
      IDMachine: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getAllMachineAllowance();
  }

  getAllMachineAllowance(): void {
    this.machineAllowanceService.getAllMachineAllowance().subscribe(
      (response: ApiResponse<machineAllowance[]>) => {
        this.machineAllowances = response.data;
        this.onChangePage(this.machineAllowances.slice(0, this.pageSize));
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
    const filteredPlants = this.machineAllowances.filter(
      (machineAllowance) =>
        machineAllowance.ID_machine
          .toLowerCase()
          .includes(this.searchText.toLowerCase()) ||
          machineAllowance.machine_allow_ID.toString().includes(this.searchText)
    );

    // Tampilkan hasil filter pada halaman pertama
    this.onChangePage(filteredPlants.slice(0, this.pageSize));
  }

  resetSearch(): void {
    this.searchText = '';
    this.onChangePage(this.machineAllowances.slice(0, this.pageSize));
  }

  updateMachineAllowance(): void {
    
    this.machineAllowanceService.updateMachineAllowance(this.edtMachineAllowanceObject).subscribe(
      (response) => {
        // SweetAlert setelah update berhasil
        Swal.fire({
          title: 'Success!',
          text: 'Data machineAllowance successfully updated.',
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

  openModalEdit(idPlant: number): void {
    this.isEditMode = true;
    this.getMachineAllowanceById(idPlant);
    $('#editModal').modal('show');
  }

  getMachineAllowanceById(idMachineAllowance: number): void {
    this.machineAllowanceService.getMachineAllowanceById(idMachineAllowance).subscribe(
      (response: ApiResponse<machineAllowance>) => {
        this.edtMachineAllowanceObject = response.data;
      },
      (error) => {
        this.errorMessage = 'Failed to load plants: ' + error.message;
      }
    );
  }

  deleteData(plant: machineAllowance): void {
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
        this.machineAllowanceService.deleteMachineAllowance(plant).subscribe(
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
    link.href = 'assets/Template Excel/Layout_Machine_Allowance.xlsx';
    link.download = 'Layout_Machine_Allowance.xlsx';
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
      this.machineAllowanceService.uploadFileExcel(formData).subscribe(
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