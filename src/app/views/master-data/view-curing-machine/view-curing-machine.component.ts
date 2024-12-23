import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Curing_Machine } from 'src/app/models/Curing_Machine';
import { ApiResponse } from 'src/app/response/Response';
import { CuringMachineService } from 'src/app/services/master-data/curing-machine/curing-machine.service';
import Swal from 'sweetalert2';
declare var $: any;
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { BuildingService } from 'src/app/services/master-data/building/building.service';
import { Building } from 'src/app/models/Building';
import { MachineCuringType } from 'src/app/models/machine-curing-type';
import { MachineCuringTypeService } from 'src/app/services/master-data/machine-curing-type/machine-curing-type.service';

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
  sortBuffer: Array<any>;
  displayedColumns: string[] = ['no', 'work_CENTER_TEXT', 'building_ID', 'cavity', 'machine_TYPE', 'status_USAGE', 'status', 'action'];
  dataSource: MatTableDataSource<Curing_Machine>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public uomOptions: Array<Array<Select2OptionData>>;
  public options: Options = { width: '100%'};
  uom: any;
  building: Building[] =[];
  machineCuringType: MachineCuringType[] =[];

  constructor(private curingmachineService: CuringMachineService, private fb: FormBuilder, private buildingService: BuildingService, private machineCuringTypeService: MachineCuringTypeService) { 
    this.editCuringMachineForm = this.fb.group({
      machine_TYPE: ['', Validators.required],
      buildingID: ['', Validators.required],
      cavity: ['', Validators.required],
      statusUsage: ['', Validators.required],
    });
    
    this.loadBuilding();
    this.loadMachineCuringType();
  }

  private loadBuilding(): void {
    this.buildingService.getAllBuilding().subscribe(
      (response: ApiResponse<Building[]>) => {
        this.building = response.data;
        if (!this.uomOptions) {
          this.uomOptions = [];
        }
        this.uomOptions[0] = this.building.map((element) => ({
          id: element.building_ID.toString(), // Ensure the ID is a string
          text: element.building_NAME // Set the text to the plant name
        }));
      },
      (error) => {
        this.errorMessage = 'Failed to load building: ' + error.message;
      }
    );
  }

  private loadMachineCuringType(): void {
    this.machineCuringTypeService.getAllMCT().subscribe(
      (response: ApiResponse<MachineCuringType[]>) => {
        this.machineCuringType = response.data;
        if (!this.uomOptions) {
          this.uomOptions = [];
        }
        this.uomOptions[1] = this.machineCuringType.map((element) => ({
          id: element.machinecuringtype_ID.toString(), // Ensure the ID is a string
          text: element.machinecuringtype_ID.toString() // Set the text to the plant name
        }));
      },
      (error) => {
        this.errorMessage = 'Failed to load machine curing type: ' + error.message;
      }
    );
  }

  getBuildingName(building_ID: number): string {
    const building = this.building.find(b => b.building_ID === building_ID);
    return building ? building.building_NAME : 'Unknown';
  }

  ngOnInit(): void {
    this.getAllCuringMachines();
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault(); // Prevent non-numeric input
    }
  }

  getAllCuringMachines(): void {
    Swal.fire({
      title: 'Loading...',
      html: 'Please wait while fetching data Machine Curing.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.curingmachineService.getAllMachineCuring().subscribe(
      (response: ApiResponse<Curing_Machine[]>) => {
        this.curingmachines = response.data.map((curingmachine) => {
          const building = this.building.find(
            (b)=> b.building_ID === curingmachine.building_ID
          );

          return {
            ...curingmachine,
            building_id: building ? building.building_NAME : null
          };
        });

        Swal.close();
        this.dataSource = new MatTableDataSource(this.curingmachines);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.onChangePage(this.dataSource.data.slice(0, this.pageSize));
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
    this.dataSource.filter = this.searchText.trim().toLowerCase();
    // const filteredCuringMachines = this.curingmachines.filter(
    //   (curingmachine) =>
    //     curingmachine.machine_TYPE
    //       .toLowerCase()
    //       .includes(this.searchText.toLowerCase()) ||
    //       curingmachine.building_ID.toString().includes(this.searchText)||
    //       curingmachine.cavity.toString().includes(this.searchText)||
    //       curingmachine.work_CENTER_TEXT.includes(this.searchText)||
    //       curingmachine.status_USAGE.toString().includes(this.searchText)
    // );

    // // Tampilkan hasil filter pada halaman pertama
    // this.onChangePage(filteredCuringMachines.slice(0, this.pageSize));
  }

  resetSearch(): void {
    this.searchText = '';
    this.dataSource.filter = this.searchText.trim().toLowerCase();
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
      Swal.fire({
            title: 'Loading...',
            html: 'Please wait while fetching data Machine Curing.',
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });
      const formData = new FormData();
      formData.append('file', this.file);
      // unggah file Excel
      this.curingmachineService.uploadFileExcel(formData).subscribe(
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
      html: 'Please wait while fetching data Machine Curing.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.curingmachineService.exportMachineCuringsExcel().subscribe({
      next: (response) => {
        Swal.close();
        // Menggunakan nama file yang sudah ditentukan di backend
        const filename = 'MACHINE_CURING_DATA.xlsx'; // Nama file bisa dinamis jika diperlukan
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
      html: 'Please wait while fetching data Machine Curing.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.curingmachineService.templateMachineCuringsExcel().subscribe({
      next: (response) => {
        Swal.close();
        // Menggunakan nama file yang sudah ditentukan di backend
        const filename = 'LAYOUT_MACHINE_CURING.xlsx'; // Nama file bisa dinamis jika diperlukan
        saveAs(response, filename); // Mengunduh file
      },
      error: (err) => {
        console.error('Download error:', err);
      }
    });
  }
}
