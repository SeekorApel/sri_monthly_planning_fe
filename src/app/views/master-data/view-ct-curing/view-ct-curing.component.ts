import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CT_Curing } from 'src/app/models/CT_Curing';
import { ApiResponse } from 'src/app/response/Response';
import { CTCuringService } from 'src/app/services/master-data/ct-curing/ct-curing.service';
import Swal from 'sweetalert2';
declare var $: any;
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Product } from 'src/app/models/Product';
import { ProductService } from 'src/app/services/master-data/product/product.service';

@Component({
  selector: 'app-view-ct-curing',
  templateUrl: './view-ct-curing.component.html',
  styleUrls: ['./view-ct-curing.component.scss'],
})
export class ViewCtCuringComponent implements OnInit {
  //Variable Declaration
  ctcurings: CT_Curing[] = [];
  searchText: string = '';
  errorMessage: string | null = null;
  edtCTCuringObject: CT_Curing = new CT_Curing();
  isEditMode: boolean = false;
  file: File | null = null;
  editCTCuringForm: FormGroup;
  products: Product[];

  // Pagination
  pageOfItems: Array<any>;
  pageSize: number = 5;
  totalPages: number = 5;
  displayedColumns: string[] = ['no', 'ct_CURING_ID', 'wip', 'Part Number', 'group_COUNTER', 'var_GROUP_COUNTER', 'sequence', 'wct', 'operation_SHORT_TEXT', 'operation_UNIT', 'base_QUANTITY', 'standart_VALUE_UNIT', 'ct_SEC1', 'ct_HR1000', 'wh_NORMAL_SHIFT_0', 'wh_NORMAL_SHIFT_1', 'wh_NORMAL_SHIFT_2', 'wh_SHIFT_FRIDAY', 'wh_TOTAL_NORMAL_SHIFT', 'wh_TOTAL_SHIFT_FRIDAY', 'allow_NORMAL_SHIFT_0', 'allow_NORMAL_SHIFT_1', 'allow_NORMAL_SHIFT_2', 'allow_TOTAL', 'op_TIME_NORMAL_SHIFT_0', 'op_TIME_NORMAL_SHIFT_1', 'op_TIME_NORMAL_SHIFT_2', 'op_TIME_SHIFT_FRIDAY', 'op_TIME_NORMAL_SHIFT', 'op_TIME_TOTAL_SHIFT_FRIDAY', 'kaps_NORMAL_SHIFT_0', 'kaps_NORMAL_SHIFT_1', 'kaps_NORMAL_SHIFT_2', 'kaps_SHIFT_FRIDAY', 'kaps_TOTAL_NORMAL_SHIFT', 'kaps_TOTAL_SHIFT_FRIDAY', 'waktu_TOTAL_CT_NORMAL', 'waktu_TOTAL_CT_FRIDAY', 'status', 'action'];
  dataSource: MatTableDataSource<CT_Curing>;
  public uomOptionData: Array<Select2OptionData>;
  public options: Options = {
    width: '100%',
    minimumResultsForSearch: 0,
  };

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private ctcuringService: CTCuringService, private fb: FormBuilder,
    private productService: ProductService 
  ) {
    this.editCTCuringForm = this.fb.group({
      wip: ['', Validators.required],
      partNumber: ['', Validators.required],
      groupcounter: ['', Validators.required],
      vargroupcounter: ['', Validators.required],
      sequence: ['', Validators.required],
      wct: ['', Validators.required],
      operationshorttext: ['', Validators.required],
      operationunit: ['', Validators.required],
      basequantity: ['', Validators.required],
      standardvalueunit: ['', Validators.required],
      ctsec1: ['', Validators.required],
      cthr1000: ['', Validators.required],
      whnormalshift0: ['', Validators.required],
      whnormalshift1: ['', Validators.required],
      whnormalshift2: ['', Validators.required],
      whshiftfriday: ['', Validators.required],
      whtotalnormalshift: ['', Validators.required],
      whtotalshiftfriday: ['', Validators.required],
      allownormalshift0: ['', Validators.required],
      allownormalshift1: ['', Validators.required],
      allownormalshift2: ['', Validators.required],
      allowtotal: ['', Validators.required],
      optimenormalshift0: ['', Validators.required],
      optimenormalshift1: ['', Validators.required],
      optimenormalshift2: ['', Validators.required],
      optimeshiftfriday: ['', Validators.required],
      optimenormalshift: ['', Validators.required],
      optimetotalshiftfriday: ['', Validators.required],
      kapsnormalshift0: ['', Validators.required],
      kapsnormalshift1: ['', Validators.required],
      kapsnormalshift2: ['', Validators.required],
      kapsshiftfriday: ['', Validators.required],
      kapstotalnormalshift: ['', Validators.required],
      kapstotalshiftfriday: ['', Validators.required],
      waktutotalctnormal: ['', Validators.required],
      waktutotalctfriday: ['', Validators.required],
    });
    this.loadProduct();
  }

  ngOnInit(): void {
    this.getAllCTCuring();
  }

  private loadProduct(): void {
    this.productService.getAllProduct().subscribe(
      (response: ApiResponse<Product[]>) => {
        this.products = response.data;

        if (!this.uomOptionData) {
          this.uomOptionData = [];
        }

        this.uomOptionData = this.products.map((element) => ({
          id: element.part_NUMBER.toString(), // Ensure the ID is a string
          text: element.part_NUMBER.toString(), // Set the text to the name (or other property)
        }));
      },
      (error) => {
        this.errorMessage = 'Failed to load Setting: ' + error.message;
      }
    );
  }

  getAllCTCuring(): void {
    this.ctcuringService.getAllCTCuring().subscribe(
      (response: ApiResponse<CT_Curing[]>) => {
        this.ctcurings = response.data;
        this.dataSource = new MatTableDataSource(this.ctcurings);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        // this.onChangePage(this.ctcurings.slice(0, this.pageSize));
      },
      (error) => {
        this.errorMessage = 'Failed to load CT Curing: ' + error.message;
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

  updateCTCuring(): void {
    this.ctcuringService.updateCTCuring(this.edtCTCuringObject).subscribe(
      (response) => {
        // SweetAlert setelah update berhasil
        Swal.fire({
          title: 'Success!',
          text: 'Data CT Curing successfully updated.',
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

  openModalEdit(idCTCuring: number): void {
    this.isEditMode = true;
    this.getCTCuringById(idCTCuring);
    $('#editModal').modal('show');
  }

  getCTCuringById(idCTCuring: number): void {
    this.ctcuringService.getCTCuringById(idCTCuring).subscribe(
      (response: ApiResponse<CT_Curing>) => {
        this.edtCTCuringObject = response.data;
      },
      (error) => {
        this.errorMessage = 'Failed to load CT Curings: ' + error.message;
      }
    );
  }

  deleteData(ctcuring: CT_Curing): void {
    console.log(ctcuring);
    Swal.fire({
      title: 'Are you sure?',
      text: 'This data CT Curing will be deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.ctcuringService.deleteCTCuring(ctcuring).subscribe(
          (response) => {
            Swal.fire('Deleted!', 'Data CT Curing has been deleted', 'success').then(() => {
              window.location.reload();
            });
          },
          (err) => {
            Swal.fire('Error!', 'Failed to delete the CT Curing.', 'error');
          }
        );
      }
    });
  }

  activateData(ct_curing: CT_Curing): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This data CT Curing will be Activated!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.ctcuringService.activateCTCuring(ct_curing).subscribe(
          (response) => {
            Swal.fire('Activated!', 'Data CT Curing has been Activated', 'success').then(() => {
              window.location.reload();
            });
          },
          (err) => {
            Swal.fire('Error!', 'Failed to Activated the CT Curing.', 'error');
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
    link.href = 'assets/Template Excel/Layout_CT_Curing.xlsx';
    link.download = 'Layout_CT_Curing.xlsx';
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
      this.ctcuringService.uploadFileExcel(formData).subscribe(
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
    this.ctcuringService.exportCTCuringsExcel().subscribe({
      next: (response) => {
        // Menggunakan nama file yang sudah ditentukan di backend
        const filename = 'CT_CURING_DATA.xlsx'; // Nama file bisa dinamis jika diperlukan
        saveAs(response, filename); // Mengunduh file
      },
      error: (err) => {
        console.error('Download error:', err);
      },
    });
  }
}
