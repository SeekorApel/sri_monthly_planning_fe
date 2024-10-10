import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Curing_Machine } from 'src/app/models/Curing_Machine';
import { ApiResponse } from 'src/app/response/Response';
import { CuringMachineService } from 'src/app/services/master-data/curing-machine/curing-machine.service';
import Swal from 'sweetalert2';
declare var $: any;
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-view-curing-machine',
  templateUrl: './view-curing-machine.component.html',
  styleUrls: ['./view-curing-machine.component.scss']
})
export class ViewCuringMachineComponent implements OnInit {

  //Variable Declaration
  curingmachines: Curing_Machine[] = [];
  searchText: string = '';
  errorMessage: string | null = null;
  edtCuringMachineObject: Curing_Machine = new Curing_Machine();
  isEditMode: boolean = false;
  file: File | null = null;
  editCuringMachineForm: FormGroup;

  // Pagination
  pageOfItems: Array<any>;
  pageSize: number = 5;
  totalPages: number = 5;

  constructor(private curingmachineService: CuringMachineService, private fb: FormBuilder) { 
    this.editCuringMachineForm = this.fb.group({
      buildingID: ['', Validators.required],
      machinetype: ['', Validators.required],
      cavity: ['', Validators.required],
      statusUsage: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getAllCuringMachines();
  }

  getAllCuringMachines(): void {
    this.curingmachineService.getAllMachineCuring().subscribe(
      (response: ApiResponse<Curing_Machine[]>) => {
        this.curingmachines = response.data;
        this.onChangePage(this.curingmachines.slice(0, this.pageSize));
      },
      (error) => {
        this.errorMessage = 'Failed to load curing machines: ' + error.message;
      }
    );
  }

  onChangePage(pageOfItems: Array<any>) {
    this.pageOfItems = pageOfItems;
  }

  onSearchChange(): void {
    const filteredCuringMachines = this.curingmachines.filter(
      (curingmachine) =>
        curingmachine.status_USAGE.toString()
          .toLowerCase()
          .includes(this.searchText.toLowerCase()) ||
          curingmachine.building_ID.toString().includes(this.searchText)||
          curingmachine.machine_TYPE.includes(this.searchText)||
          curingmachine.cavity.toString().includes(this.searchText)||
          curingmachine.work_CENTER_TEXT.includes(this.searchText)
    );

    // Tampilkan hasil filter pada halaman pertama
    this.onChangePage(filteredCuringMachines.slice(0, this.pageSize));
  }

  resetSearch(): void {
    this.searchText = '';
    this.onChangePage(this.curingmachines.slice(0, this.pageSize));
  }

  updateCuringMachine(): void {
    
    this.curingmachineService.updateMachineCuring(this.edtCuringMachineObject).subscribe(
      (response) => {
        // SweetAlert setelah update berhasil
        Swal.fire({
          title: 'Success!',
          text: 'Data curing machine successfully updated.',
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

  openModalEdit(idCuringMachine: string): void {
    this.isEditMode = true;
    this.getCuringMachineById(idCuringMachine);
    $('#editModal').modal('show');
  }

  getCuringMachineById(idCuringMachine: string): void {
    this.curingmachineService.getMachineCuringById(idCuringMachine).subscribe(
      (response: ApiResponse<Curing_Machine>) => {
        this.edtCuringMachineObject = response.data;
      },
      (error) => {
        this.errorMessage = 'Failed to load curing machines: ' + error.message;
      }
    );
  }

  deleteData(curingmachine: Curing_Machine): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This data curing machine will be deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.curingmachineService.deleteMachineCuring(curingmachine).subscribe(
          (response) => {
            Swal.fire('Deleted!', 'Data curing machine has been deleted', 'success').then(() => {
              window.location.reload();
            });
          },
          (err) => {
            Swal.fire('Error!', 'Failed to delete the curing machine.', 'error');
          }
        );
      }
    });
  }

  activateData(curingmachine: Curing_Machine): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This data curing machine will be Activated!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.curingmachineService.activateCuringMachine(curingmachine).subscribe(
          (response) => {
            Swal.fire('Activated!', 'Data curing machine has been Activated', 'success').then(() => {
              window.location.reload();
            });
          },
          (err) => {
            Swal.fire('Error!', 'Failed to Activated the curing machine.', 'error');
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
    link.href = 'assets/Template Excel/Layout_Machine_Curing.xlsx';
    link.download = 'Layout_Machine_Curing.xlsx';
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
      this.curingmachineService.uploadFileExcel(formData).subscribe(
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
    this.curingmachineService.exportMachineCuringsExcel().subscribe({
      next: (response) => {
        // Menggunakan nama file yang sudah ditentukan di backend
        const filename = 'MACHINE_CURING_DATA.xlsx'; // Nama file bisa dinamis jika diperlukan
        saveAs(response, filename); // Mengunduh file
      },
      error: (err) => {
        console.error('Download error:', err);
      }
    });
  }
}
