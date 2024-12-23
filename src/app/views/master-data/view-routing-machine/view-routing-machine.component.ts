import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoutingMachine } from 'src/app/models/RoutingMachine';
import { ApiResponse } from 'src/app/response/Response';
import { RoutingService } from 'src/app/services/master-data/routingMachine/routingMachine.service';
import Swal from 'sweetalert2';
declare var $: any;
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Item_Assy } from 'src/app/models/Item_Assy';
import { MachineTass } from 'src/app/models/machine-tass';
import { ItemAssyService } from 'src/app/services/master-data/item-assy/itemAssy.service';
import { MachineTassService } from 'src/app/services/master-data/machine-tass/machine-tass.service';

@Component({
  selector: 'app-view-routing-machine',
  templateUrl: './view-routing-machine.component.html',
  styleUrls: ['./view-routing-machine.component.scss'],
})
export class ViewRoutingMachineComponent implements OnInit {
  //Variable Declaration
  routingMachines: RoutingMachine[] = [];
  searchText: string = '';
  errorMessage: string | null = null;
  edtRoutingMachineObject: RoutingMachine = new RoutingMachine();
  isEditMode: boolean = false;
  file: File | null = null;
  editRoutingMachineForm: FormGroup;

  // Pagination
  pageOfItems: Array<any>;
  pageSize: number = 5;
  totalPages: number = 5;
  sortBuffer: Array<any>;
  displayedColumns: string[] = ['no', 'ct_ASSY_ID', 'wip', 'description', 'group_COUNTER', 'var_GROUP_COUNTER', 'sequence', 'wct', 'operation_SHORT_TEXT', 'operation_UNIT', 'base_QUANTITY', 'standard_VALUE_UNIT', 'ct_SEC_1', 'ct_HR_1000', 'wh_NORMAL_SHIFT_0', 'wh_NORMAL_SHIFT_1', 'wh_NORMAL_SHIFT_2', 'wh_SHIFT_FRIDAY', 'wh_TOTAL_NORMAL_SHIFT', 'wh_TOTAL_SHIFT_FRIDAY', 'allow_NORMAL_SHIFT_0', 'allow_NORMAL_SHIFT_1', 'allow_NORMAL_SHIFT_2', 'allow_TOTAL', 'op_TIME_NORMAL_SHIFT_0', 'op_TIME_NORMAL_SHIFT_1', 'op_TIME_NORMAL_SHIFT_2', 'op_TIME_SHIFT_FRIDAY', 'op_TIME_TOTAL_NORMAL_SHIFT', 'op_TIME_TOTAL_SHIFT_FRIDAY', 'kaps_NORMAL_SHIFT_0', 'kaps_NORMAL_SHIFT_1', 'kaps_NORMAL_SHIFT_2', 'kaps_SHIFT_FRIDAY', 'kaps_TOTAL_NORMAL_SHIFT', 'kaps_TOTAL_SHIFT_FRIDAY', 'waktu_TOTAL_CT_NORMAL', 'waktu_TOTAL_CT_FRIDAY', 'status', 'action'];
  dataSource: MatTableDataSource<RoutingMachine>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public uomOptions: Array<Array<Select2OptionData>>;
  public options: Options = { width: '100%', minimumResultsForSearch: 0 };
  uom: any;
  itemAssy: Item_Assy[] = [];
  machineTass: MachineTass[] = [];

  constructor(private RoutingMachineService: RoutingService, private fb: FormBuilder, private itemAssyService: ItemAssyService, private machineTassService: MachineTassService) {
    this.editRoutingMachineForm = this.fb.group({
      wip: ['', Validators.required],
      description: ['', Validators.required],
      group_counter: ['', Validators.required],
      var_group_counter: ['', Validators.required],
      sequence: ['', Validators.required],
      wct: ['', Validators.required],
      operation_SHORT_TEXT: ['', Validators.required],
      operation_unit: ['', Validators.required],
      base_quantity: ['', Validators.required],
      standard_value_unit: ['', Validators.required],
      CT_sec_1: ['', Validators.required],
      CT_hr_1000: ['', Validators.required],
      WH_normal_shift_1: ['', Validators.required],
      WH_normal_shift_2: ['', Validators.required],
      WH_normal_shift_3: ['', Validators.required],
      WH_shift_jumat: ['', Validators.required],
      WH_total_normal_shift: ['', Validators.required],
      WH_total_shift_jumat: ['', Validators.required],
      allow_normal_shift_1: ['', Validators.required],
      allow_normal_shift_2: ['', Validators.required],
      allow_normal_shift_3: ['', Validators.required],
      allow_total: ['', Validators.required],
      OP_time_normal_shift_1: ['', Validators.required],
      OP_time_normal_shift_2: ['', Validators.required],
      OP_time_normal_shift_3: ['', Validators.required],
      OP_time_shift_jumat: ['', Validators.required],
      OP_time_total_normal_shift: ['', Validators.required],
      OP_time_total_shift_jumat: ['', Validators.required],
      kaps_normal_shift_1: ['', Validators.required],
      kaps_normal_shift_2: ['', Validators.required],
      kaps_normal_shift_3: ['', Validators.required],
      kaps_shift_jumat: ['', Validators.required],
      kaps_total_normal_shift: ['', Validators.required],
      kaps_total_shift_jumat: ['', Validators.required],
      waktu_total_CT_normal: ['', Validators.required],
      waktu_total_CT_jumat: ['', Validators.required],
    });

    this.loadItemAssy();
    this.loadMachineTass();
  }

  private loadItemAssy(): void {
    this.itemAssyService.getAllItemAssy().subscribe(
      (response: ApiResponse<Item_Assy[]>) => {
        this.itemAssy = response.data;
        if (!this.uomOptions) {
          this.uomOptions = [];
        }
        this.uomOptions[0] = this.itemAssy.map((element) => ({
          id: element.item_ASSY.toString(),
          text: element.item_ASSY.toString(),
        }));
      },
      (error) => {
        this.errorMessage = 'Failed to load item assy: ' + error.message;
      }
    );
  }

  private loadMachineTass(): void {
    this.machineTassService.getAllMachineTass().subscribe(
      (response: ApiResponse<MachineTass[]>) => {
        this.machineTass = response.data;
        if (!this.uomOptions) {
          this.uomOptions = [];
        }
        this.uomOptions[1] = this.machineTass.map((element) => ({
          id: element.work_CENTER_TEXT.toString(),
          text: element.work_CENTER_TEXT.toString(),
        }));
      },
      (error) => {
        this.errorMessage = 'Failed to load  machine tass : ' + error.message;
      }
    );
  }

  ngOnInit(): void {
    this.getAllCTAssy();
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault(); // Prevent non-numeric input
    }
  }

  getAllCTAssy(): void {
    Swal.fire({
      title: 'Loading...',
      html: 'Please wait while fetching data CT Assy.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.RoutingMachineService.getAllCTAssy().subscribe(
      (response: ApiResponse<RoutingMachine[]>) => {
        this.routingMachines = response.data;
        Swal.close();

        this.dataSource = new MatTableDataSource(this.routingMachines);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.onChangePage(this.dataSource.data.slice(0, this.pageSize));
      },
      (error) => {
        this.errorMessage = 'Failed to load CT Assy: ' + error.message;
      }
    );
  }

  onChangePage(pageOfItems: Array<any>) {
    this.pageOfItems = pageOfItems;
  }

  onSearchChange(): void {
    this.dataSource.filter = this.searchText.trim().toLowerCase();
    // Lakukan filter berdasarkan nama plant yang mengandung text pencarian (case-insensitive)
    // const filteredPlants = this.routingMachines.filter(
    //   (routingMachine) =>
    //     routingMachine.ct_ASSY_ID
    //       .toString()
    //       .includes(this.searchText.toLowerCase()) ||
    //       routingMachine.wip.toLowerCase().toString().includes(this.searchText.toLowerCase())||
    //       routingMachine.description.toLowerCase().toString().includes(this.searchText.toLowerCase()) ||
    //       routingMachine.group_COUNTER.toLowerCase().toString().includes(this.searchText.toLowerCase()) ||
    //       routingMachine.var_GROUP_COUNTER.toLowerCase().toString().includes(this.searchText.toLowerCase()) ||
    //       routingMachine.sequence.toString().includes(this.searchText) ||
    //       routingMachine.wct.toLowerCase().toString().includes(this.searchText.toLowerCase()) ||
    //       routingMachine.operation_SHORT_TEXT.toLowerCase().toString().includes(this.searchText.toLowerCase()) ||
    //       routingMachine.operation_UNIT.toLowerCase().toString().includes(this.searchText.toLowerCase()) ||
    //       routingMachine.base_QUANTITY.toString().includes(this.searchText) ||
    //       routingMachine.standard_VALUE_UNIT.toLowerCase().toString().includes(this.searchText.toLowerCase()) ||
    //       routingMachine.ct_SEC_1.toString().includes(this.searchText) ||
    //       routingMachine.ct_HR_1000.toString().includes(this.searchText) ||
    //       routingMachine.wh_NORMAL_SHIFT_0.toString().includes(this.searchText) ||
    //       routingMachine.wh_NORMAL_SHIFT_1.toString().includes(this.searchText) ||
    //       routingMachine.wh_NORMAL_SHIFT_2.toString().includes(this.searchText) ||
    //       routingMachine.wh_SHIFT_FRIDAY.toString().includes(this.searchText) ||
    //       routingMachine.wh_TOTAL_NORMAL_SHIFT.toString().includes(this.searchText) ||
    //       routingMachine.wh_TOTAL_SHIFT_FRIDAY.toString().includes(this.searchText) ||
    //       routingMachine.allow_NORMAL_SHIFT_0.toString().includes(this.searchText) ||
    //       routingMachine.allow_NORMAL_SHIFT_1.toString().includes(this.searchText) ||
    //       routingMachine.allow_NORMAL_SHIFT_2.toString().includes(this.searchText) ||
    //       routingMachine.allow_TOTAL.toString().includes(this.searchText) ||
    //       routingMachine.op_TIME_NORMAL_SHIFT_0.toString().includes(this.searchText) ||
    //       routingMachine.op_TIME_NORMAL_SHIFT_1.toString().includes(this.searchText) ||
    //       routingMachine.op_TIME_NORMAL_SHIFT_2.toString().includes(this.searchText) ||
    //       routingMachine.op_TIME_SHIFT_FRIDAY.toString().includes(this.searchText) ||
    //       routingMachine.op_TIME_TOTAL_NORMAL_SHIFT.toString().includes(this.searchText) ||
    //       routingMachine.op_TIME_TOTAL_SHIFT_FRIDAY.toString().includes(this.searchText) ||
    //       routingMachine.kaps_NORMAL_SHIFT_0.toString().includes(this.searchText) ||
    //       routingMachine.kaps_NORMAL_SHIFT_1.toString().includes(this.searchText) ||
    //       routingMachine.kaps_NORMAL_SHIFT_2.toString().includes(this.searchText) ||
    //       routingMachine.kaps_SHIFT_FRIDAY.toString().includes(this.searchText) ||
    //       routingMachine.kaps_TOTAL_NORMAL_SHIFT.toString().includes(this.searchText) ||
    //       routingMachine.kaps_TOTAL_SHIFT_FRIDAY.toString().includes(this.searchText) ||
    //       routingMachine.waktu_TOTAL_CT_NORMAL.toString().includes(this.searchText) ||
    //       routingMachine.waktu_TOTAL_CT_FRIDAY.toString().includes(this.searchText) ||
    //       routingMachine.status.toString().includes(this.searchText)
    // );

    // // Tampilkan hasil filter pada halaman pertama
    // this.onChangePage(filteredPlants.slice(0, this.pageSize));
  }

  resetSearch(): void {
    this.searchText = '';
    this.dataSource.filter = this.searchText.trim().toLowerCase();
    this.onChangePage(this.routingMachines.slice(0, this.pageSize));
  }

  updateCtAssy(): void {
    this.RoutingMachineService.updateCTAssy(this.edtRoutingMachineObject).subscribe(
      (response) => {
        // SweetAlert setelah update berhasil
        Swal.fire({
          title: 'Success!',
          text: 'Data CT Assy successfully updated.',
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

  openModalEdit(idCtAssy: number): void {
    this.isEditMode = true;
    this.getCTAssyById(idCtAssy);
    $('#editModal').modal('show');
  }

  getCTAssyById(idCtAssy: number): void {
    this.RoutingMachineService.getCTAssyById(idCtAssy).subscribe(
      (response: ApiResponse<RoutingMachine>) => {
        this.edtRoutingMachineObject = response.data;
      },
      (error) => {
        this.errorMessage = 'Failed to load plants: ' + error.message;
      }
    );
  }

  deleteData(CtAssy: RoutingMachine): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This data CT Assy will be deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.RoutingMachineService.deleteCTAssy(CtAssy).subscribe(
          (response) => {
            Swal.fire('Deleted!', 'Data CT Assy has been deleted', 'success').then(() => {
              window.location.reload();
            });
          },
          (err) => {
            Swal.fire('Error!', 'Failed to delete the CT Assy.', 'error');
          }
        );
      }
    });
  }

  activateData(routingMachine: RoutingMachine): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This data CT Assy will be Activated!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.RoutingMachineService.activateCTAssy(routingMachine).subscribe(
          (response) => {
            Swal.fire('Activated!', 'Data CT Assy has been Activated', 'success').then(() => {
              window.location.reload();
            });
          },
          (err) => {
            Swal.fire('Error!', 'Failed to Activated the CT Assy.', 'error');
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
    link.href = 'assets/Template Excel/Layout_CT_Assy.xlsx';
    link.download = 'Layout_CT_Assy.xlsx';
    link.click();
  }

  downloadExcel(): void {
    Swal.fire({
      title: 'Loading...',
      html: 'Please wait while fetching data CT Assy.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.RoutingMachineService.exportRoutingMachineExcel().subscribe({
      next: (response) => {
        Swal.close();
        // Menggunakan nama file yang sudah ditentukan di backend
        const filename = 'CT_ASSY_DATA.xlsx'; // Nama file bisa dinamis jika diperlukan
        saveAs(response, filename); // Mengunduh file
      },
      error: (err) => {
        console.error('Download error:', err);
      },
    });
  }
  templateExcel(): void {
    Swal.fire({
      title: 'Loading...',
      html: 'Please wait while fetching data CT Assy.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.RoutingMachineService.templateRoutingMachineExcel().subscribe({
      next: (response) => {
        Swal.close();
        // Menggunakan nama file yang sudah ditentukan di backend
        const filename = 'LAYOUT_CT_ASSY.xlsx'; // Nama file bisa dinamis jika diperlukan
        saveAs(response, filename); // Mengunduh file
      },
      error: (err) => {
        console.error('Download error:', err);
      },
    });
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(data, `${fileName}_export_${new Date().getTime()}.xlsx`);
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
            html: 'Please wait while fetching data CT Assy.',
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });
      const formData = new FormData();
      formData.append('file', this.file);
      // unggah file Excel
      this.RoutingMachineService.uploadFileExcel(formData).subscribe(
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
}
