import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MachineExtruding } from 'src/app/models/machine-extruding';
import { ApiResponse } from 'src/app/response/Response';
import { MachineExtrudingService } from 'src/app/services/master-data/machine-extruding/machine-extruding.service';
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver';
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';
import { Building } from 'src/app/models/Building';
import { BuildingService } from 'src/app/services/master-data/building/building.service';

declare var $: any;
import * as XLSX from 'xlsx';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

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
  public uomOptionData: Array<Select2OptionData>;
  public options: Options = {
    width: '100%',
    minimumResultsForSearch: 0,
  };

  // Pagination
  pageOfItems: Array<any>;
  pageSize: number = 5;
  totalPages: number = 5;
  displayedColumns: string[] = ['no', 'id_MACHINE_EXT', 'building_ID', 'type', 'status', 'action'];
  dataSource: MatTableDataSource<MachineExtruding>;
  buildings: Building[];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private MEService: MachineExtrudingService, private fb: FormBuilder, private buildingService: BuildingService) {
    this.editMachineExtrudingTypeForm = this.fb.group({
      buildingID: ['', Validators.required],
      Type: ['', Validators.required],
    });
    this.loadBuilding();
  }

  ngOnInit(): void {
    this.getAllMachineExtruding();
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

  getAllMachineExtruding(): void {
    Swal.fire({
      title: 'Loading...',
      html: 'Please wait while fetching data Machine Extruding.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.MEService.getAllMachineExtruding().subscribe(
      (response: ApiResponse<MachineExtruding[]>) => {
        Swal.close();
        this.machineExtudings = response.data.map((machineEx) => {
          const building = this.buildings.find((b) => b.building_ID === machineEx.building_ID);
          return {
            ...machineEx,
            building_Name: building ? building.building_NAME : 'Unknown',
          };
        });
        this.dataSource = new MatTableDataSource(this.machineExtudings);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        // this.onChangePage(this.machineExtudings.slice(0, this.pageSize));
      },
      (error) => {
        Swal.close();
        Swal.fire('Error!', 'Failed to load Machine Extruding.', 'error');
        this.errorMessage = 'Failed to load machine extruding: ' + error.message;
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
  downloadExcel(): void {
    Swal.fire({
      icon: 'info',
      title: 'Processing...',
      html: 'Please wait while downloading Machine Extruding data.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.MEService.exportMachineExtrudingExcel().subscribe({
      next: (response) => {
        Swal.close();
        // Menggunakan nama file yang sudah ditentukan di backend
        const filename = 'MACHINE_EXTRUDING_DATA.xlsx'; // Nama file bisa dinamis jika diperlukan
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
      html: 'Please wait while downloading Machine Extruding layout.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.MEService.tamplateMachineExtrudingExcel().subscribe({
      next: (response) => {
        Swal.close();
        // Menggunakan nama file yang sudah ditentukan di backend
        const filename = 'Layout_MACHINE_EXTRUDING.xlsx'; // Nama file bisa dinamis jika diperlukan
        saveAs(response, filename); // Mengunduh file
      },
      error: (err) => {
        Swal.close();
        Swal.fire('Error', 'Error Downloading Layout.', 'error');
        console.error('Download error:', err);
      },
    });
  }
  activateData(me: MachineExtruding): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This data Machine Extruding will be Activated!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.MEService.activateMachineExtruding(me).subscribe(
          (response) => {
            Swal.fire('Activated!', 'Data Machine Extruding has been Activated', 'success').then(() => {
              window.location.reload();
            });
          },
          (err) => {
            Swal.fire('Error!', 'Failed to Activated the Machine Extruding.', 'error');
          }
        );
      }
    });
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
        icon: 'info',
        title: 'Processing...',
        html: 'Please wait while Saving Data Machine Extruding.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const formData = new FormData();
      formData.append('file', this.file);
      // unggah file Excel
      this.MEService.uploadFileExcel(formData).subscribe(
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
}
