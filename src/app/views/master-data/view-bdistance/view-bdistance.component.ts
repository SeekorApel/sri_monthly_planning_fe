import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BDistance } from 'src/app/models/BDistance';
import { ApiResponse } from 'src/app/response/Response';
import { BDistanceService } from 'src/app/services/master-data/Bdistance/Bdistance.service';
import Swal from 'sweetalert2';
declare var $: any;
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-view-bdistance',
  templateUrl: './view-bdistance.component.html',
  styleUrls: ['./view-bdistance.component.scss']
})
export class ViewBDistanceComponent implements OnInit {

  //Variable Declaration
  bdistances: BDistance[] = [];
  searchText: string = '';
  errorMessage: string | null = null;
  edtBDistanceObject: BDistance = new BDistance();
  isEditMode: boolean = false;
  file: File | null = null;
  editBDistanceForm: FormGroup;

  // Pagination
  pageOfItems: Array<any>;
  pageSize: number = 5;
  totalPages: number = 5;

  constructor(private bdistanceService: BDistanceService, private fb: FormBuilder) { 
    this.editBDistanceForm = this.fb.group({
      building1: ['', Validators.required],
      building2: ['', Validators.required],
      distance: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getAllBuildingDistance();
  }

  getAllBuildingDistance(): void {
    this.bdistanceService.getAllBuildingDistance().subscribe(
      (response: ApiResponse<BDistance[]>) => {
        this.bdistances = response.data;
        this.onChangePage(this.bdistances.slice(0, this.pageSize));
      },
      (error) => {
        this.errorMessage = 'Failed to load building distances: ' + error.message;
      }
    );
  }

  onChangePage(pageOfItems: Array<any>) {
    this.pageOfItems = pageOfItems;
  }

  onSearchChange(): void {
    // Lakukan filter berdasarkan nama plant yang mengandung text pencarian (case-insensitive)
    const filteredBDistances = this.bdistances.filter(
      (bdistance) =>
        bdistance.id_B_DISTANCE.toString()
          .toLowerCase()
          .includes(this.searchText.toLowerCase()) ||
          bdistance.building_ID_1.toString().includes(this.searchText)||
          bdistance.building_ID_2.toString().includes(this.searchText)||
          bdistance.distance.toString().includes(this.searchText)
    );

    // Tampilkan hasil filter pada halaman pertama
    this.onChangePage(filteredBDistances.slice(0, this.pageSize));
  }

  resetSearch(): void {
    this.searchText = '';
    this.onChangePage(this.bdistances.slice(0, this.pageSize));
  }

  updateBuildingDistance(): void {
    
    this.bdistanceService.updateBuildingDistance(this.edtBDistanceObject).subscribe(
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

  openModalEdit(idBDistance: number): void {
    this.isEditMode = true;
    this.getBuildingDistanceById(idBDistance);
    $('#editModal').modal('show');
  }

  getBuildingDistanceById(idBDistance: number): void {
    this.bdistanceService.getlBuildingDistanceById(idBDistance).subscribe(
      (response: ApiResponse<BDistance>) => {
        this.edtBDistanceObject = response.data;
      },
      (error) => {
        this.errorMessage = 'Failed to load plants: ' + error.message;
      }
    );
  }

  deleteData(bdistance: BDistance): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This data building distance will be deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.bdistanceService.deletelBuildingDistance(bdistance).subscribe(
          (response) => {
            Swal.fire('Deleted!', 'Data building distance has been deleted', 'success').then(() => {
              window.location.reload();
            });
          },
          (err) => {
            Swal.fire('Error!', 'Failed to delete the building distance.', 'error');
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
    link.href = 'assets/Template Excel/Layout_Master_Building_Distance.xlsx';
    link.download = 'Layout_Master_Building_Distance.xlsx';
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
      this.bdistanceService.uploadFileExcel(formData).subscribe(
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
