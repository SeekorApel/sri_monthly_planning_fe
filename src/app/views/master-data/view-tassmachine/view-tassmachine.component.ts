import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MachineTass } from 'src/app/models/tass-machine';
import { ApiResponse } from 'src/app/response/Response';
import { MachineTassService } from 'src/app/services/master-data/tassMachine/tassMachine.service';
import Swal from 'sweetalert2';
declare var $: any;
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-view-tassmachine',
  templateUrl: './view-tassmachine.component.html',
  styleUrls: ['./view-tassmachine.component.scss'],
})
export class ViewMachineTassComponent implements OnInit {
  //Variable Declaration
  machineTasss: MachineTass[] = [];
  searchText: string = '';
  errorMessage: string | null = null;
  editMachineTassObject: MachineTass = new MachineTass();
  isEditMode: boolean = false;
  file: File | null = null;
  editMachineTassForm: FormGroup;

  // Pagination
  pageOfItems: Array<any>;
  pageSize: number = 5;
  totalPages: number = 5;

  constructor(private machineTassService: MachineTassService, private fb: FormBuilder) {
    this.editMachineTassForm = this.fb.group({
      type: ['', Validators.required],
      building: ['', Validators.required],
      floor: ['', Validators.required],
      machineNum: ['', Validators.required],
      wct: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getAllPattern();
  }

  getAllPattern(): void {
    this.machineTassService.getAllMachineTass().subscribe(
      (response: ApiResponse<MachineTass[]>) => {
        this.machineTasss = response.data;
        console.log(this.machineTasss);
        this.onChangePage(this.machineTasss.slice(0, this.pageSize));
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
    // Lakukan filter berdasarkan nama yang mengandung text pencarian (case-insensitive)
    const filteredMachineTass = this.machineTasss.filter((machineTass) => machineTass.type.toLowerCase().includes(this.searchText.toLowerCase()) || machineTass.id_MACHINE_TASS.toString().includes(this.searchText));

    // Tampilkan hasil filter pada halaman pertama
    this.onChangePage(filteredMachineTass.slice(0, this.pageSize));
  }

  resetSearch(): void {
    this.searchText = '';
    this.onChangePage(this.machineTasss.slice(0, this.pageSize));
  }

  updateMachineTass(): void {
    this.machineTassService.updateMachineTass(this.editMachineTassObject).subscribe(
      (response) => {
        // SweetAlert setelah update berhasil
        Swal.fire({
          title: 'Success!',
          text: 'Data Machine Tass successfully updated.',
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

  openModalEdit(idMachineTass: number): void {
    this.isEditMode = true;
    this.getMachineTassByID(idMachineTass);
    $('#editModal').modal('show');
  }

  getMachineTassByID(idMachineTass: number): void {
    this.machineTassService.getMachineTassByID(idMachineTass).subscribe(
      (response: ApiResponse<MachineTass>) => {
        this.editMachineTassObject = response.data;
      },
      (error) => {
        this.errorMessage = 'Failed to load Machine Tass: ' + error.message;
      }
    );
  }

  deleteData(mt: MachineTass): void {
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
        this.machineTassService.deleteMachineTass(mt).subscribe(
          (response) => {
            Swal.fire('Deleted!', 'Data Machine Tass has been deleted', 'success').then(() => {
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
    link.href = 'assets/Template Excel/Layout_Master_Machine_Tass.xlsx';
    link.download = 'Layout_Master_Machine_Tass.xlsx';
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
      this.machineTassService.uploadFileExcel(formData).subscribe(
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
