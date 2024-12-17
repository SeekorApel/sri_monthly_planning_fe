import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MachineTass } from 'src/app/models/machine-tass';
import { ApiResponse } from 'src/app/response/Response';
import { MachineTassService } from 'src/app/services/master-data/machine-tass/machine-tass.service';
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver';
declare var $: any;
import * as XLSX from 'xlsx';
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';
import { Building } from 'src/app/models/Building';
import { BuildingService } from 'src/app/services/master-data/building/building.service';
import { MachineTassType } from 'src/app/models/machine-tass-type';
import { MachineTassTypeService } from 'src/app/services/master-data/machine-tass-type/machine-tass-type.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-view-machine-tass',
  templateUrl: './view-machine-tass.component.html',
  styleUrls: ['./view-machine-tass.component.scss'],
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
  public uomOptionData: Array<Array<Select2OptionData>>;
  public options: Options = {
    width: '100%',
    minimumResultsForSearch: 0,
  };

  // Pagination
  pageOfItems: Array<any>;
  pageSize: number = 5;
  totalPages: number = 5;
  displayedColumns: string[] = ['no', 'id_MACHINE_TASS', 'building_ID', 'floor', 'machine_NUMBER', 'machinetasstype_ID', 'work_CENTER_TEXT', 'status', 'action'];
  dataSource: MatTableDataSource<MachineTass>;
  buildings: Building[];
  tassTypes: MachineTassType[];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private machineTassService: MachineTassService, private fb: FormBuilder, private buildingService: BuildingService, private machineTassTypeService: MachineTassTypeService) {
    this.editMachineTassForm = this.fb.group({
      tassType: ['', Validators.required],
      building: ['', Validators.required],
      floor: ['', Validators.required],
      machineNum: ['', Validators.required],
      wct: ['', Validators.required],
    });
    this.loadBuilding();
    this.loadMachineTassType();
  }

  getBuildingName(buildingId: number): string {
    const building = this.buildings.find((b) => b.building_ID === buildingId);
    return building ? building.building_NAME : 'Unknown';
  }
  validateNumberInput(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);

    // Kode ASCI 48 - 57 angka (0-9) yang bisa diketik
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  ngOnInit(): void {
    this.getAllMachineTass();
  }

  private loadMachineTassType(): void {
    this.machineTassTypeService.getAllMachineTassType().subscribe(
      (response: ApiResponse<MachineTassType[]>) => {
        this.tassTypes = response.data;

        if (!this.uomOptionData) {
          this.uomOptionData = [];
        }

        this.uomOptionData[1] = this.tassTypes.map((element) => ({
          id: element.machinetasstype_ID.toString(), // Ensure the ID is a string
          text: element.machinetasstype_ID, // Set the text to the name (or other property)
        }));
      },
      (error) => {
        this.errorMessage = 'Failed to load Macine Tass Type: ' + error.message;
      }
    );
  }
  private loadBuilding(): void {
    this.buildingService.getAllBuilding().subscribe(
      (response: ApiResponse<Building[]>) => {
        this.buildings = response.data;

        if (!this.uomOptionData) {
          this.uomOptionData = [];
        }

        this.uomOptionData[0] = this.buildings.map((element) => ({
          id: element.building_ID.toString(), // Ensure the ID is a string
          text: element.building_NAME, // Set the text to the name (or other property)
        }));
      },
      (error) => {
        this.errorMessage = 'Failed to load Building: ' + error.message;
      }
    );
  }
  getAllMachineTass(): void {
    Swal.fire({
      title: 'Loading...',
      html: 'Please wait while fetching data Machine Tass.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.machineTassService.getAllMachineTass().subscribe(
      (response: ApiResponse<MachineTass[]>) => {

          Swal.close();
          this.machineTasss = response.data.map((machine) => {
          const building = this.buildings.find((b) => b.building_ID === machine.building_ID);
          return {
            ...machine,
            building_Name: building ? building.building_NAME : 'Unknown',
          };
        });

        // Initialize the data table
        this.dataSource = new MatTableDataSource(this.machineTasss);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      (error) => {
        Swal.close();
        Swal.fire('Error!', 'Failed to load machine Tass.', 'error');
        this.errorMessage = 'Failed to load machine Tass: ' + error.message;
      }
    );
  }

  onChangePage(pageOfItems: Array<any>) {
    this.pageOfItems = pageOfItems;
  }

  onSearchChange(): void {
    // this.getBuildingName()
    this.dataSource.filter = this.searchText.trim().toLowerCase();
  }

  resetSearch(): void {
    this.searchText = '';
    this.dataSource.filter = this.searchText.trim().toLowerCase();
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
          console.log(response);
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
      text: 'This data machine tass will be deleted!',
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

  downloadExcel(): void {
    Swal.fire({
      icon: 'info',
      title: 'Processing...',
      html: 'Please wait while downloading Machine Tass data.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.machineTassService.exportMachineTassExcel().subscribe({
      next: (response) => {
        Swal.close();
        // Menggunakan nama file yang sudah ditentukan di backend
        const filename = 'MACHINETASS_DATA.xlsx'; // Nama file bisa dinamis jika diperlukan
        saveAs(response, filename); // Mengunduh file
      },
      error: (err) => {
        Swal.close();
        Swal.fire('Error!', 'Failed to download the data.', 'error');
        console.error('Download error:', err);
      },
    });
  }
  tamplateExcel(): void {
    Swal.fire({
      icon: 'info',
      title: 'Processing...',
      html: 'Please wait while downloading Machine Tass layout.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.machineTassService.tamplateMachineTassExcel().subscribe({
      next: (response) => {
        Swal.close();
        // Menggunakan nama file yang sudah ditentukan di backend
        const filename = 'Layout_MACHINETASS.xlsx'; // Nama file bisa dinamis jika diperlukan
        saveAs(response, filename); // Mengunduh file
      },
      error: (err) => {
        Swal.close();
        Swal.fire('Error!', 'Failed to download the layout.', 'error');
        console.error('Download error:', err);
      },
    });
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
    Swal.fire({
      icon: 'info',
      title: 'Processing...',
      html: 'Please wait while saving data Machine Tass.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    if (this.file) {
      const formData = new FormData();
      formData.append('file', this.file);
      console.log('File yang diunggah:', this.file);
      // unggah file Excel
      this.machineTassService.uploadFileExcel(formData).subscribe(
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
          Swal.close();
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
  activateData(machineTass: MachineTass): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This data Machine Tass will be Activated!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.machineTassService.activateMachineTass(machineTass).subscribe(
          (response) => {
            Swal.fire('Activated!', 'Data Machine Tass has been Activated', 'success').then(() => {
              window.location.reload();
            });
          },
          (err) => {
            Swal.fire('Error!', 'Failed to Activated the Machine Tass.', 'error');
          }
        );
      }
    });
  }
}
