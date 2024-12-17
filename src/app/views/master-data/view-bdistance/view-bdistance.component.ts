import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BDistance } from 'src/app/models/BDistance';
import { ApiResponse } from 'src/app/response/Response';
import { BDistanceService } from 'src/app/services/master-data/Bdistance/Bdistance.service';
import Swal from 'sweetalert2';
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';
import { Building } from 'src/app/models/Building';
import { BuildingService } from 'src/app/services/master-data/building/building.service';

declare var $: any;
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-view-bdistance',
  templateUrl: './view-bdistance.component.html',
  styleUrls: ['./view-bdistance.component.scss'],
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
  buildings: Building[];
  public uomOptionData: Array<Select2OptionData>;
  public options: Options = {
    width: '100%',
    minimumResultsForSearch: 0,
  };

  // Pagination
  pageOfItems: Array<any>;
  pageSize: number = 5;
  totalPages: number = 5;
  displayedColumns: string[] = ['no', 'id_B_DISTANCE', 'building_ID_1', 'building_ID_2', 'distance', 'status', 'action'];
  dataSource: MatTableDataSource<BDistance>;
  isDataEmpty: boolean = true; // Flag untuk mengecek apakah data kosong
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private bdistanceService: BDistanceService, private fb: FormBuilder, private buildingService: BuildingService) {
    this.editBDistanceForm = this.fb.group({
      building1: ['', Validators.required],
      building2: ['', Validators.required],
      distance: ['', Validators.required],
    });
    this.loadBuilding();
  }
  getBuildingName(buildingId: number): string {
    const building = this.buildings.find((b) => b.building_ID === buildingId);
    return building ? building.building_NAME : 'Unknown';
  }

  ngOnInit(): void {
    this.getAllBuildingDistance();
  }

  validateNumberInput(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);

    // Kode ASCI 48 - 57 angka (0-9) yang bisa diketik
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  getAllBuildingDistance(): void {
    Swal.fire({
      title: 'Loading...',
      html: 'Please wait while fetching data Building Distance.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    this.bdistanceService.getAllBuildingDistance().subscribe(
      (response: ApiResponse<BDistance[]>) => {
        Swal.close();
        this.bdistances = response.data.map(bdistance => {
          const building1 = this.buildings.find(
            bd => bd.building_ID === bdistance.building_ID_1
          );
          const building2 = this.buildings.find(
            bd => bd.building_ID === bdistance.building_ID_2
          );
          return {
            ...bdistance,
            building_1: building1 ? building1.building_NAME : 'Unknown',
            building_2: building2 ? building2.building_NAME : 'Unknown',
          };
        });
        this.isDataEmpty = this.bdistances.length === 0; // Update status data kosong
        this.dataSource = new MatTableDataSource(this.bdistances);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        // this.onChangePage(this.bdistances.slice(0, this.pageSize));
      },
      (error) => {
        Swal.close();
        Swal.fire('Error!', 'Failed to load building distances.', 'error');
        this.errorMessage = 'Failed to load building distances: ' + error.message;
        this.isDataEmpty = true; // Set data kosong jika terjadi error
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
  }
  private loadBuilding(): void {
    this.buildingService.getAllBuilding().subscribe(
      (response: ApiResponse<Building[]>) => {
        this.buildings = response.data;

        if (!this.uomOptionData) {
          this.uomOptionData = [];
        }

        this.uomOptionData = this.buildings.map((element) => ({
          id: element.building_ID.toString(), // Ensure the ID is a string
          text: element.building_NAME, // Set the text to the name (or other property)
        }));
      },
      (error) => {
        this.errorMessage = 'Failed to load Building: ' + error.message;
      }
    );
  }

  updateBuildingDistance(): void {
    this.bdistanceService.updateBuildingDistance(this.edtBDistanceObject).subscribe(
      (response) => {
        // SweetAlert setelah update berhasil
        Swal.fire({
          title: 'Success!',
          text: 'Data building distance successfully updated.',
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
        this.errorMessage = 'Failed to load building distances: ' + error.message;
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
      Swal.fire({
        icon: 'info',
        title: 'Processing...',
        html: 'Please wait while save data Building Distance.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      // unggah file Excel
      this.bdistanceService.uploadFileExcel(formData).subscribe(
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
          Swal.close();
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

  activateData(qdistance: BDistance): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This data building distance will be Activated!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.bdistanceService.activateBuildingDistance(qdistance).subscribe(
          (response) => {
            Swal.fire('Activated!', 'Data building distance has been Activated', 'success').then(() => {
              window.location.reload();
            });
          },
          (err) => {
            Swal.fire('Error!', 'Failed to Activated the building distance.', 'error');
          }
        );
      }
    });
  }

  downloadExcel(): void {
    Swal.fire({
      icon: 'info',
      title: 'Processing...',
      html: 'Please wait while downloading Building distance data.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.bdistanceService.exportExcel().subscribe({
      next: (response) => {
        Swal.close();
        // Menggunakan nama file yang sudah ditentukan di backend
        const filename = 'BUILDING_DISTANCE_DATA.xlsx'; // Nama file bisa dinamis jika diperlukan
        saveAs(response, filename); // Mengunduh file
      },
      error: (err) => {
        Swal.close();
        Swal.fire('Error', 'Error Downloading Data.', 'error');
        console.error('Download error:', err);
      },
    });
  }
  tamplateExcel(): void {
    Swal.fire({
      icon: 'info',
      title: 'Processing...',
      html: 'Please wait while downloading Building distance layout.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.bdistanceService.tamplateExcel().subscribe({
      next: (response) => {
        Swal.close();
        // Menggunakan nama file yang sudah ditentukan di backend
        const filename = 'Layout_Building_Distance.xlsx'; // Nama file bisa dinamis jika diperlukan
        saveAs(response, filename); // Mengunduh file
      },
      error: (err) => {
        Swal.close();
        Swal.fire('Error!', 'Error Downloading Layout.', 'error');
        console.error('Download error:', err);
      },
    });
  }
}
