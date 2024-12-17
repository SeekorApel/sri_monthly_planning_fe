import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Building } from 'src/app/models/Building';
import { ApiResponse } from 'src/app/response/Response';
import { BuildingService } from 'src/app/services/master-data/building/building.service';
import Swal from 'sweetalert2';
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';
declare var $: any;
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { PlantService } from 'src/app/services/master-data/plant/plant.service';
import { Plant } from 'src/app/models/Plant';

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
  
  public uomOptions: Array<Select2OptionData>;
  public options: Options = {
    width: '100%'
  };
  uom: any;
  plant:Plant[];

  // Pagination
  pageOfItems: Array<any>;
  pageSize: number = 5;
  totalPages: number = 5;
  sortBuffer: Array<any>;
  displayedColumns: string[] = ['no', 'building_ID', 'plant_NAME','building_NAME','status', 'action'];
  dataSource: MatTableDataSource<Building>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private buildingService: BuildingService, private fb: FormBuilder, private plantService: PlantService) { 
    this.editBuildingForm = this.fb.group({
      buildingName: ['', Validators.required],
      plantID: ['', Validators.required],
    });
  
  }
  
  private loadPlants(): void {
    this.plantService.getAllPlant().subscribe(
      (response: ApiResponse<Plant[]>) => {
        if(response.data){
          this.plant = response.data;
          this.uomOptions = this.plant.map((element) => ({
            id: element.plant_ID.toString(), // Ensure the ID is a string
            text: element.plant_NAME // Set the text to the plant name
          }));
              this.getAllBuilding();
        }
      },
      (error) => {
        this.errorMessage = 'Failed to load plants: ' + error.message;
      }
    );
    console.log(this.uomOptions);
  }
  
  getPlantName(plant_ID: number): string {
    const plant = this.plant.find(b => b.plant_ID === plant_ID);
    return plant ? plant.plant_NAME : 'Unknown';
  }

  ngOnInit(): void {
    this.loadPlants();
  }

  getAllBuilding(): void {
    Swal.fire({
      title: 'Loading...',
      html: 'Please wait while fetching data Building.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.buildingService.getAllBuilding().subscribe(
      (response: ApiResponse<Building[]>) => {
        if (response && response.data) {
          this.buildings = response.data;
          Swal.close();
        
          this.buildings = this.buildings.map((plant) => {
            const matchedPlant = this.plant.find(
              (b) => b.plant_ID === Number(plant.plant_ID)
            );
    
            return {
              ...plant, // Salin semua properti quadrant
              plant_NAME: matchedPlant ? matchedPlant.plant_NAME : null // Tambahkan building_NAME jika ada kecocokan
            };
          });
  
          this.dataSource = new MatTableDataSource(this.buildings);
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
  
          // Update the current page data
          const initialPageData = this.dataSource.data.slice(0, this.pageSize);
          this.onChangePage(initialPageData);
        } else {
          this.errorMessage = 'No building data received.';
        }
      },
      (error) => {
        this.errorMessage = `Failed to load buildings: ${error.message || 'Unknown error'}`;
      }
    );
  }
  

  onChangePage(pageOfItems: Array<any>) {
    this.pageOfItems = pageOfItems;
  }

  onSearchChange(): void {
    this.dataSource.filter = this.searchText.trim().toLowerCase();
  }

  resetSearch(): void {
    this.searchText = '';
    this.dataSource.filter = this.searchText.trim().toLowerCase();
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
      Swal.fire({
            title: 'Loading...',
            html: 'Please wait while fetching data Building.',
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });
      const formData = new FormData();
      formData.append('file', this.file);
      // unggah file Excel
      this.buildingService.uploadFileExcel(formData).subscribe(
        (response) => {
          Swal.close();
          if(response.status === 200) {
            Swal.fire({
              icon: 'success',
              title: 'Success!',
              text: 'Excel file uploaded successfully.',
              confirmButtonText: 'OK',
            }).then(() => {
              $('#editModal').modal('hide');
              window.location.reload();
            });
          }else {
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: response.message,
              confirmButtonText: 'OK',
            }).then(() => {
              $('#editModal').modal('hide');
              window.location.reload();
            });
          }
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
      Swal.close();
      Swal.fire({
        icon: 'warning',
        title: 'Warning!',
        text: 'Please select a file to upload.',
        confirmButtonText: 'OK',
      });
    }
  }

  downloadExcel(): void {
    Swal.fire({
          title: 'Loading...',
          html: 'Please wait while fetching data Building.',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
    this.buildingService.exportExcel().subscribe({
      next: (response) => {
        Swal.close();
        // Menggunakan nama file yang sudah ditentukan di backend
        const filename = 'BUILDING_DATA.xlsx'; // Nama file bisa dinamis jika diperlukan
        saveAs(response, filename); // Mengunduh file
      },
      error: (err) => {
        console.error('Download error:', err);
      }
    });
  }
  templateExcel(): void {
    Swal.fire({
          title: 'Loading...',
          html: 'Please wait while fetching data Building.',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
    this.buildingService.templateExcel().subscribe({
      next: (response) => {
        Swal.close();
        // Menggunakan nama file yang sudah ditentukan di backend
        const filename = 'LAYOUT_BUILDING.xlsx'; // Nama file bisa dinamis jika diperlukan
        saveAs(response, filename); // Mengunduh file
      },
      error: (err) => {
        console.error('Download error:', err);
      }
    });
  }
}
