import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { machineAllowence } from 'src/app/models/machineAllowance';
import { ApiResponse } from 'src/app/response/Response';
import { MachineAllowenceService } from 'src/app/services/master-data/machine-allowance/machine-allowance.service';
import Swal from 'sweetalert2';
declare var $: any;
import * as XLSX from 'xlsx';
import {saveAs} from 'file-saver';
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Curing_Machine } from 'src/app/models/Curing_Machine';
import { CuringMachineService } from 'src/app/services/master-data/curing-machine/curing-machine.service';
import { MachineTass } from 'src/app/models/machine-tass';
import { MachineTassService } from 'src/app/services/master-data/machine-tass/machine-tass.service';
import { MachineExtruding } from 'src/app/models/machine-extruding';
import { MachineExtrudingService } from 'src/app/services/master-data/machine-extruding/machine-extruding.service';

@Component({
  selector: 'app-view-machine-allowence',
  templateUrl: './view-machine-allowence.component.html',
  styleUrls: ['./view-machine-allowance.component.scss'],
})
export class ViewMachineAllowenceComponent implements OnInit {

  //Variable Declaration
  machineAllowences: machineAllowence[] = [];
  searchText: string = '';
  errorMessage: string | null = null;
  edtMachineAllowenceObject: machineAllowence = new machineAllowence();
  isEditMode: boolean = false;
  file: File | null = null;
  editMachineAllowenceForm: FormGroup;

  // Pagination
  pageOfItems: Array<any>;
  pageSize: number = 5;
  totalPages: number = 5;
  sortBuffer: Array<any>;
  displayedColumns: string[] = ['no', 'machine_ALLOW_ID', 'id_MACHINE','person_RESPONSIBLE', 'shift_1', 'shift_2','shift_3', 'shift_1_FRIDAY', 'total_SHIFT_123', 'status', 'action'];
  dataSource: MatTableDataSource<machineAllowence>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public uomOptions: Array<Select2OptionData>;
  public options: Options = { width: '100%'};
  uom: any;
  curingMachine: Curing_Machine[] =[];
  tassMachine: MachineTass[] =[];
  extrudingMachine: MachineExtruding[] =[];

  constructor(private machineAllowenceService: MachineAllowenceService, private fb: FormBuilder, private curingMachineService: CuringMachineService, private tassMachineService: MachineTassService, private extrudingMachineService: MachineExtrudingService) { 
    this.editMachineAllowenceForm = this.fb.group({
      idMachine: ['', Validators.required],
      personResponsible: ['', Validators.required],
      shift1: ['', Validators.required],
      shift2: ['', Validators.required],
      shift3: ['', Validators.required],
      shift1Friday: ['', Validators.required],
      totalShift123: ['', Validators.required]
    });
    curingMachineService.getAllMachineCuring().subscribe(
      (response: ApiResponse<Curing_Machine[]>) => {
        const curingOptions = response.data.map((element) => ({
          id: element.work_CENTER_TEXT, // Ensure the ID is a string
          text: element.work_CENTER_TEXT // Set the text to the work center text
        }));
    
        tassMachineService.getAllMachineTass().subscribe(
          (response: ApiResponse<MachineTass[]>) => {
            const tassOptions = response.data.map((element) => ({
              id: element.id_MACHINE_TASS, // Ensure the ID is a string
              text: element.id_MACHINE_TASS // Set the text to the machine ID
            }));
    
            extrudingMachineService.getAllMachineExtruding().subscribe(
              (response: ApiResponse<MachineExtruding[]>) => {
                const extrudingOptions = response.data.map((element) => ({
                  id: element.ID_machine_ext, // Ensure the ID is a string
                  text: element.type // Set the text to the machine ID
                }));
        
                // Combine both options into uomOptions
                this.uomOptions = [...curingOptions, ...tassOptions, ...extrudingOptions];
              },
              (error) => {
                this.errorMessage = 'Failed to load tass machine: ' + error.message;
              }
            );
          },
          (error) => {
            this.errorMessage = 'Failed to load tass machine: ' + error.message;
          }
        );
      },
      (error) => {
        this.errorMessage = 'Failed to load curing machine: ' + error.message;
      }
    );    
  }

  ngOnInit(): void {
    this.getAllMachineAllowence();
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault(); // Prevent non-numeric input
    }
  }

  getAllMachineAllowence(): void {
    Swal.fire({
      title: 'Loading...',
      html: 'Please wait while fetching data Machine Allowance.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.machineAllowenceService.getAllMachineAllowence().subscribe(
      (response: ApiResponse<machineAllowence[]>) => {
        this.machineAllowences = response.data;
        Swal.close();
        this.dataSource = new MatTableDataSource(this.machineAllowences);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.onChangePage(this.dataSource.data.slice(0, this.pageSize));
      },
      (error) => {
        this.errorMessage = 'Failed to load machine allowences: ' + error.message;
      }
    );
  }

  onChangePage(pageOfItems: Array<any>) {
    this.pageOfItems = pageOfItems;
  }

  onSearchChange(): void {
    this.dataSource.filter = this.searchText.trim().toLowerCase();
    // Lakukan filter berdasarkan nama plant yang mengandung text pencarian (case-insensitive)
    // const filteredMachineAllowences = this.machineAllowences.filter(
    //   (machineAllowance) =>
    //     machineAllowance.id_MACHINE
    //       .toLowerCase()
    //       .includes(this.searchText.toLowerCase()) ||
    //       machineAllowance.machine_ALLOW_ID.toString().includes(this.searchText.toLowerCase()) ||
    //       machineAllowance.id_MACHINE.toString().includes(this.searchText.toLowerCase()) ||
    //       machineAllowance.person_RESPONSIBLE.toLowerCase().toString().includes(this.searchText.toLowerCase()) ||
    //       machineAllowance.shift_1.toString().includes(this.searchText) ||
    //       machineAllowance.shift_2.toString().includes(this.searchText) ||
    //       machineAllowance.shift_3.toString().includes(this.searchText) ||
    //       machineAllowance.shift_1_FRIDAY.toString().includes(this.searchText) ||
    //       machineAllowance.total_SHIFT_123.toString().includes(this.searchText)
    // );

    // // Tampilkan hasil filter pada halaman pertama
    // this.onChangePage(filteredMachineAllowences.slice(0, this.pageSize));
  }

  resetSearch(): void {
    this.searchText = '';
    this.dataSource.filter = this.searchText.trim().toLowerCase();
    this.onChangePage(this.machineAllowences.slice(0, this.pageSize));
  }

  updateMachineAllowence(): void {
    
    this.machineAllowenceService.updateMachineAllowence(this.edtMachineAllowenceObject).subscribe(
      (response) => {
        // SweetAlert setelah update berhasil
        Swal.fire({
          title: 'Success!',
          text: 'Data machine allowence successfully updated.',
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

  openModalEdit(idMachineAllowence: number): void {
    this.isEditMode = true;
    this.getMachineAllowenceById(idMachineAllowence);
    $('#editModal').modal('show');
  }

  getMachineAllowenceById(idMachineAllowence: number): void {
    this.machineAllowenceService.getMachineAllowenceById(idMachineAllowence).subscribe(
      (response: ApiResponse<machineAllowence>) => {
        this.edtMachineAllowenceObject = response.data;
      },
      (error) => {
        this.errorMessage = 'Failed to load machine Allowences: ' + error.message;
      }
    );
  }

  deleteData(machineAllowence: machineAllowence): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This data machine allowence will be deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.machineAllowenceService.deleteMachineAllowence(machineAllowence).subscribe(
          (response) => {
            Swal.fire('Deleted!', 'Data machine allowence has been deleted', 'success').then(() => {
              window.location.reload();
            });
          },
          (err) => {
            Swal.fire('Error!', 'Failed to delete the machine allowence.', 'error');
          }
        );
      }
    });
  }

  activateData(machineAllowense: machineAllowence): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This data machine allowence will be Activated!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.machineAllowenceService.activateMachineAllowence(machineAllowense).subscribe(
          (response) => {
            Swal.fire('Activated!', 'Data machine allowence has been Activated', 'success').then(() => {
              window.location.reload();
            });
          },
          (err) => {
            Swal.fire('Error!', 'Failed to Activated the machine allowence.', 'error');
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
    link.href = 'assets/Template Excel/Layout_Machine_Allowence.xlsx';
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
      Swal.fire({
            title: 'Loading...',
            html: 'Please wait while fetching data Machine Allowance.',
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });
      const formData = new FormData();
      formData.append('file', this.file);
      // unggah file Excel
      this.machineAllowenceService.uploadFileExcel(formData).subscribe(
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
      html: 'Please wait while fetching data Machine Allowance.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.machineAllowenceService.exportMachineAllowenceExcel().subscribe({
      next: (response) => {
        Swal.close();
        // Menggunakan nama file yang sudah ditentukan di backend
        const filename = 'MACHINE_ALLOWENCE_DATA.xlsx'; // Nama file bisa dinamis jika diperlukan
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
      html: 'Please wait while fetching data Machine Allowance.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.machineAllowenceService.templateMachineAllowenceExcel().subscribe({
      next: (response) => {
        Swal.close();
        // Menggunakan nama file yang sudah ditentukan di backend
        const filename = 'LAYOUT_MACHINE_ALLOWENCE.xlsx'; // Nama file bisa dinamis jika diperlukan
        saveAs(response, filename); // Mengunduh file
      },
      error: (err) => {
        console.error('Download error:', err);
      }
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(data, `${fileName}_export_${new Date().getTime()}.xlsx`);
  }
}