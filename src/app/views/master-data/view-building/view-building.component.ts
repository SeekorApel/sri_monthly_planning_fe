import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Building } from 'src/app/models/Building';
import { ApiResponse } from 'src/app/response/Response';
import { BuildingService } from 'src/app/services/master-data/building/building.service';
import Swal from 'sweetalert2';
declare var $: any;
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-view-building',
  templateUrl: './view-building.component.html',
  styleUrls: ['./view-building.component.scss'],
})
export class ViewBuildingComponent implements OnInit {

  //Variable Declaration
  buildings: Building[] = [];
  searchText: string = '';
  errorMessage: string | null = null;
  edtBuildingObject: Building = new Building();
  isEditMode: boolean = false;
  file: File | null = null;
  editBuildingForm: FormGroup;

  // Pagination
  pageOfItems: Array<any>;
  pageSize: number = 5;
  totalPages: number = 5;

  constructor(private buildingService: BuildingService, private fb: FormBuilder) { 
    this.editBuildingForm = this.fb.group({
      plantID: ['', Validators.required],
      buildingName: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getAllBuilding();
  }

  getAllBuilding(): void {
    this.buildingService.getAllBuilding().subscribe(
      (response: ApiResponse<Building[]>) => {
        this.buildings = response.data;
        this.onChangePage(this.buildings.slice(0, this.pageSize));
      },
      (error) => {
        this.errorMessage = 'Failed to load buildings: ' + error.message;
      }
    );
  }

  onChangePage(pageOfItems: Array<any>) {
    this.pageOfItems = pageOfItems;
  }

  onSearchChange(): void {
    // Lakukan filter berdasarkan nama plant yang mengandung text pencarian (case-insensitive)
    const filteredBuildings = this.buildings.filter(
      (building) =>
        building.plant_ID.toString()
          .toLowerCase()
          .includes(this.searchText.toLowerCase()) ||
        building.building_NAME.toString().includes(this.searchText)
    );

    // Tampilkan hasil filter pada halaman pertama
    this.onChangePage(filteredBuildings.slice(0, this.pageSize));
  }

  resetSearch(): void {
    this.searchText = '';
    this.onChangePage(this.buildings.slice(0, this.pageSize));
  }

  updateBuilding(): void {
    
    this.buildingService.updateBuilding(this.edtBuildingObject).subscribe(
      (response) => {
        // SweetAlert setelah update berhasil
        Swal.fire({
          title: 'Success!',
          text: 'Data building successfully updated.',
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

  openModalEdit(idBuilding: number): void {
    this.isEditMode = true;
    this.getBuildingById(idBuilding);
    $('#editModal').modal('show');
  }

  getBuildingById(idBuilding: number): void {
    this.buildingService.getBuildingById(idBuilding).subscribe(
      (response: ApiResponse<Building>) => {
        this.edtBuildingObject = response.data;
      },
      (error) => {
        this.errorMessage = 'Failed to load buildings: ' + error.message;
      }
    );
  }

  deleteData(building: Building): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This data building will be deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.buildingService.deleteBuilding(building).subscribe(
          (response) => {
            Swal.fire('Deleted!', 'Data building has been deleted', 'success').then(() => {
              window.location.reload();
            });
          },
          (err) => {
            Swal.fire('Error!', 'Failed to delete the building.', 'error');
          }
        );
      }
    });
  }

  activateData(building: Building): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This data building will be Activated!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.buildingService.activateBuilding(building).subscribe(
          (response) => {
            Swal.fire('Activated!', 'Data building has been Activated', 'success').then(() => {
              window.location.reload();
            });
          },
          (err) => {
            Swal.fire('Error!', 'Failed to Activated the building.', 'error');
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
    link.href = 'assets/Template Excel/Layout_Building.xlsx';
    link.download = 'Layout_Building.xlsx';
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
      this.buildingService.uploadFileExcel(formData).subscribe(
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
    this.buildingService.exportExcel().subscribe({
      next: (response) => {
        // Menggunakan nama file yang sudah ditentukan di backend
        const filename = 'BUILDING_DATA.xlsx'; // Nama file bisa dinamis jika diperlukan
        saveAs(response, filename); // Mengunduh file
      },
      error: (err) => {
        console.error('Download error:', err);
      }
    });
  }
}
