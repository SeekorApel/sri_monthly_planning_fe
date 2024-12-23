import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CtKapa } from 'src/app/models/ct-kapa';
import { ApiResponse } from 'src/app/response/Response';
import { CtKapaService } from 'src/app/services/master-data/ct-kapa/ctkapa.service';
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver';
declare var $: any;
import * as XLSX from 'xlsx';
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';
import { ItemCuringService } from 'src/app/services/master-data/item-curing/item-curing.service';
import { Item_Curing } from 'src/app/models/Item_Curing';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MachineCuringType } from 'src/app/models/machine-curing-type';
import { MachineCuringTypeService } from 'src/app/services/master-data/machine-curing-type/machine-curing-type.service';

@Component({
  selector: 'app-view-ct-kapa',
  templateUrl: './view-ct-kapa.component.html',
  styleUrls: ['./view-ct-kapa.component.scss'],
})
export class ViewCtKapaComponent implements OnInit {
  //Variable Declaration
  ctkapas: CtKapa[] = [];
  searchText: string = '';
  errorMessage: string | null = null;
  editCtKapaObject: CtKapa = new CtKapa();
  isEditMode: boolean = false;
  file: File | null = null;
  editCtKapaForm: FormGroup;
  public uomOptionData: Array<Array<Select2OptionData>>;
  public options: Options = {
    width: '100%',
    minimumResultsForSearch: 0,
  };
  itemCurings: Item_Curing[];
  CuringType: MachineCuringType[];
  // Pagination
  pageOfItems: Array<any>;
  pageSize: number = 5;
  totalPages: number = 5;
  displayedColumns: string[] = ['no', 'id_CT_KAPA', 'item_CURING', 'type_CURING', 'description', 'cycle_TIME', 'shift', 'kapa_PERSHIFT', 'last_UPDATE_DATA', 'machine', 'status', 'action'];
  dataSource: MatTableDataSource<CtKapa>;

  constructor(private ctkapaService: CtKapaService, private ItemCuring: ItemCuringService, private CuringStypeService: MachineCuringTypeService, private fb: FormBuilder) {
    this.editCtKapaForm = this.fb.group({
      itemCuring: ['', Validators.required],
      typeCuring: ['', Validators.required],
      deskripsi: ['', Validators.required],
      cycleTime: ['', Validators.required],
      shift: ['', Validators.required],
      kapaPershift: ['', Validators.required],
      lastUpdateData: ['', Validators.required],
      machine: ['', Validators.required],
    });
    this.loadItemCuring();
    this.loadCuringType();
  }
  private loadItemCuring(): void {
    this.ItemCuring.getAllItemCuring().subscribe(
      (response: ApiResponse<Item_Curing[]>) => {
        this.itemCurings = response.data;

        if (!this.uomOptionData) {
          this.uomOptionData = [];
        }

        this.uomOptionData[0] = this.itemCurings.map((element) => ({
          id: element.item_CURING.toString(), // Ensure the ID is a string
          text: element.item_CURING, // Set the text to the name (or other property)
        }));
      },
      (error) => {
        this.errorMessage = 'Failed to load item curing: ' + error.message;
      }
    );
  }
  validateNumberInput(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);

    // Kode ASCI 48 - 57 angka (0-9) yang bisa diketik
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
  validateNumberInputTitik(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);

    // Kode ASCI 48 - 57 angka (0-9) yang bisa diketik
    if ((charCode < 48 || charCode > 57) && charCode !== 46) {
      event.preventDefault();
    }
  }
  private loadCuringType(): void {
    this.CuringStypeService.getAllMCT().subscribe(
      (response: ApiResponse<MachineCuringType[]>) => {
        this.CuringType = response.data;

        if (!this.uomOptionData) {
          this.uomOptionData = [];
        }

        this.uomOptionData[1] = this.CuringType.map((element) => ({
          id: element.machinecuringtype_ID.toString(), // Ensure the ID is a string
          text: element.machinecuringtype_ID.toString(), // Set the text to the name (or other property)
        }));
      },
      (error) => {
        this.errorMessage = 'Failed to load item curing: ' + error.message;
      }
    );
  }
  activateData(ctkapa: CtKapa): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This data CT Kapa will be Activated!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.ctkapaService.activateCtKapa(ctkapa).subscribe(
          (response) => {
            Swal.fire('Activated!', 'Data CT KAPA has been Activated', 'success').then(() => {
              window.location.reload();
            });
          },
          (err) => {
            Swal.fire('Error!', 'Failed to Activated the CT KAPA.', 'error');
          }
        );
      }
    });
  }
  saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    saveAs(data, `${fileName}_export_${new Date().getTime()}.xlsx`);
  }
  downloadExcel(): void {
    Swal.fire({
      icon: 'info',
      title: 'Processing...',
      html: 'Please wait while downloading CT Kapa data.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.ctkapaService.exportCtKapaExcel().subscribe({
      next: (response) => {
        Swal.close();
        // Menggunakan nama file yang sudah ditentukan di backend
        const filename = 'CTKAPA_DATA.xlsx'; // Nama file bisa dinamis jika diperlukan
        saveAs(response, filename); // Mengunduh file
      },
      error: (err) => {
        Swal.close();
        Swal.fire('Error!', 'Error Downloading Data.', 'error');
        console.error('Download error:', err);
      },
    });
  }
  tamplateExcel(): void {
    Swal.fire({
      icon: 'info',
      title: 'Processing...',
      html: 'Please wait while downloading CT Kapa Layout.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.ctkapaService.tamplateCtKapaExcel().subscribe({
      next: (response) => {
        Swal.close();
        const filename = 'Layout_CT_KAPA.xlsx'; // Nama file bisa dinamis jika diperlukan
        saveAs(response, filename); // Mengunduh file
      },
      error: (err) => {
        Swal.close();
        Swal.fire('Error!', 'Error Downloading Layout.', 'error');
        console.error('Download error:', err);
      },
    });
  }
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    this.getAllCtKapa();
  }

  getAllCtKapa(): void {
    Swal.fire({
      title: 'Loading...',
      html: 'Please wait while fetching data CT Kapa.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.ctkapaService.getAllCtKapa().subscribe(
      (response: ApiResponse<CtKapa[]>) => {
        Swal.close();
        this.ctkapas = response.data;
        this.dataSource = new MatTableDataSource(this.ctkapas);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      (error) => {
        Swal.close();
        Swal.fire('Error!', 'Failed to load Ct Kapa.', 'error');
        this.errorMessage = 'Failed to load Ct Kapa: ' + error.message;
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

  updatePattern(): void {
    console.log(this.editCtKapaObject);
    this.ctkapaService.updateCtKapa(this.editCtKapaObject).subscribe(
      (response) => {
        // SweetAlert setelah update berhasil
        Swal.fire({
          title: 'Success!',
          text: 'Data CT Kapa successfully updated.',
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

  openModalEdit(idCtkapa: number): void {
    this.isEditMode = true;
    this.getCtKapaByID(idCtkapa);
    $('#editModal').modal('show');
  }
  getItemCuringType(itemCuring: number): string {
    const item_curing = this.itemCurings.find((c) => c.item_CURING === itemCuring.toString());
    return item_curing ? item_curing.machine_TYPE : 'Tidak Ada';
  }

  getCtKapaByID(idCtkapa: number): void {
    this.ctkapaService.getCtKapaById(idCtkapa).subscribe(
      (response: ApiResponse<CtKapa>) => {
        this.editCtKapaObject = response.data;
      },
      (error) => {
        this.errorMessage = 'Failed to load CT KAPA: ' + error.message;
      }
    );
  }

  deleteData(ctkapa: CtKapa): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This data CT Kapa will be deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.ctkapaService.deleteCtKapa(ctkapa).subscribe(
          (response) => {
            Swal.fire('Deleted!', 'Data CT Kapa has been deleted', 'success').then(() => {
              window.location.reload();
            });
          },
          (err) => {
            Swal.fire('Error!', 'Failed to delete the CT Kapa.', 'error');
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
        html: 'Please wait while saving data CT Kapa.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const formData = new FormData();
      formData.append('file', this.file);
      // unggah file Excel
      this.ctkapaService.uploadFileExcel(formData).subscribe(
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
