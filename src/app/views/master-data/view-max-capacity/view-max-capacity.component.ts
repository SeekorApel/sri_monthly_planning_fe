import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Max_Capacity } from 'src/app/models/Max_Capacity';
import { ApiResponse } from 'src/app/response/Response';
import { MaxCapacityService } from 'src/app/services/master-data/max-capacity/max-capacity.service';
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
import { MachineCuringTypeService } from 'src/app/services/master-data/machine-curing-type/machine-curing-type.service';
import { MachineCuringType } from 'src/app/models/machine-curing-type';

@Component({
  selector: 'app-view-max-capacity',
  templateUrl: './view-max-capacity.component.html',
  styleUrls: ['./view-max-capacity.component.scss'],
})
export class ViewMaxCapacityComponent implements OnInit {
  //Variable Declaration
  maxCapacitys: Max_Capacity[] = [];
  searchText: string = '';
  errorMessage: string | null = null;
  edtMaxCapacityObject: Max_Capacity = new Max_Capacity();
  isEditMode: boolean = false;
  file: File | null = null;
  editMaxCapacityForm: FormGroup;

  // Pagination
  pageOfItems: Array<any>;
  pageSize: number = 5;
  totalPages: number = 5;
  sortBuffer: Array<any>;
  displayedColumns: string[] = ['no', 'max_CAP_ID', 'part_NUMBER', 'machine_curing_TYPE_ID', 'cycle_TIME', 'capacity_SHIFT_1', 'capacity_SHIFT_2', 'capacity_SHIFT_3', 'status', 'action'];
  dataSource: MatTableDataSource<Max_Capacity>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public uomOptions: Array<Array<Select2OptionData>>;
  public options: Options = { width: '100%' };
  uom: any;
  product: Product[] = [];
  machineCuringType: MachineCuringType[] = [];

  constructor(private maxCapacityService: MaxCapacityService, private fb: FormBuilder, private productService: ProductService, private machineCuringTypeService: MachineCuringTypeService) {
    this.editMaxCapacityForm = this.fb.group({
      product_ID: ['', Validators.required],
      machinecuringtype_ID: ['', Validators.required],
      cycle_TIME: ['', Validators.required],
      capacity_SHIFT_1: ['', Validators.required],
      capacity_SHIFT_2: ['', Validators.required],
      capacity_SHIFT_3: ['', Validators.required],
    });

    this.loadProduct();
    this.loadMachineCuringType();
  }

  private loadProduct(): void {
    this.productService.getAllProduct().subscribe(
      (response: ApiResponse<Product[]>) => {
        this.product = response.data;
        if (!this.uomOptions) {
          this.uomOptions = [];
        }
        this.uomOptions[0] = this.product.map((element) => ({
          id: element.part_NUMBER.toString(), // Ensure the ID is a string
          text: element.part_NUMBER.toString(), // Set the text to the plant name
        }));
      },
      (error) => {
        this.errorMessage = 'Failed to load product: ' + error.message;
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
        this.uomOptions[1] = this.machineCuringType?.map((element) => ({
          id: element.machinecuringtype_ID.toString(), // Ensure the ID is a string
          text: element.machinecuringtype_ID.toString(), // Set the text to the plant name
        }));
      },
      (error) => {
        this.errorMessage = 'Failed to load machine Curing type: ' + error.message;
      }
    );
  }

  ngOnInit(): void {
    this.getAllMaxCapacity();
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault(); // Prevent non-numeric input
    }
  }

  getAllMaxCapacity(): void {
    Swal.fire({
      title: 'Loading...',
      html: 'Please wait while fetching data Max Capacity.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.maxCapacityService.getAllMaxCapacity().subscribe(
      (response: ApiResponse<Max_Capacity[]>) => {
        this.maxCapacitys = response.data;
        Swal.close();
        this.maxCapacitys = this.maxCapacitys.map((maxCapacity) => {
          const matchedProduct = this.product.find((b) => b.part_NUMBER === maxCapacity.product_ID);
          const matchedCuringType = this.machineCuringType.find((c) => c.machinecuringtype_ID === maxCapacity.machinecuringtype_ID);

          return {
            ...maxCapacity, // Salin semua properti quadrant
            part_NUMBER: matchedProduct ? matchedProduct.part_NUMBER : null, // Tambahkan building_NAME jika ada kecocokan
            machine_curing_TYPE_ID: matchedCuringType ? matchedCuringType.machinecuringtype_ID : null, // Tambahkan building_NAME jika ada kecocokan
          };
        });

        this.dataSource = new MatTableDataSource(this.maxCapacitys);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.onChangePage(this.dataSource.data.slice(0, this.pageSize));
      },
      (error) => {
        this.errorMessage = 'Failed to load max capacity: ' + error.message;
      }
    );
  }

  onChangePage(pageOfItems: Array<any>) {
    this.pageOfItems = pageOfItems;
  }

  onSearchChange(): void {
    this.dataSource.filter = this.searchText.trim().toLowerCase();
    // Lakukan filter berdasarkan nama plant yang mengandung text pencarian (case-insensitive)
    // const filteredMaxCapacity = this.maxCapacitys.filter(
    //   (maxCapacity) =>
    //     maxCapacity.max_CAP_ID
    //       .toString()
    //       .includes(this.searchText.toLowerCase()) ||
    //       maxCapacity.product_ID.toString().includes(this.searchText)||
    //       maxCapacity.machinecuringtype_ID.toLowerCase().toString().includes(this.searchText.toLowerCase()) ||
    //       maxCapacity.cycle_TIME.toString().includes(this.searchText) ||
    //       maxCapacity.capacity_SHIFT_1.toString().includes(this.searchText) ||
    //       maxCapacity.capacity_SHIFT_2.toString().includes(this.searchText) ||
    //       maxCapacity.capacity_SHIFT_3.toString().includes(this.searchText)
    // );

    // // Tampilkan hasil filter pada halaman pertama
    // this.onChangePage(filteredMaxCapacity.slice(0, this.pageSize));
  }

  resetSearch(): void {
    this.searchText = '';
    this.dataSource.filter = this.searchText.trim().toLowerCase();
    this.onChangePage(this.maxCapacitys.slice(0, this.pageSize));
  }

  updateMaxCapacity(): void {
    this.maxCapacityService.updateMaxCapacity(this.edtMaxCapacityObject).subscribe(
      (response) => {
        // SweetAlert setelah update berhasil
        Swal.fire({
          title: 'Success!',
          text: 'Data max capacity successfully updated.',
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

  openModalEdit(idMaxCapacity: number): void {
    this.isEditMode = true;
    this.getMaxCapacityById(idMaxCapacity);
    $('#editModal').modal('show');
  }

  getMaxCapacityById(idMaxCapacity: number): void {
    this.maxCapacityService.getMaxCapacityById(idMaxCapacity).subscribe(
      (response: ApiResponse<Max_Capacity>) => {
        this.edtMaxCapacityObject = response.data;
      },
      (error) => {
        this.errorMessage = 'Failed to load max capacity: ' + error.message;
      }
    );
  }

  deleteData(maxCapacity: Max_Capacity): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This data Max Capacity will be deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.maxCapacityService.deleteMaxCapacity(maxCapacity).subscribe(
          (response) => {
            Swal.fire('Deleted!', 'Data max capacity has been deleted', 'success').then(() => {
              window.location.reload();
            });
          },
          (err) => {
            Swal.fire('Error!', 'Failed to delete the max Capacity.', 'error');
          }
        );
      }
    });
  }

  activateData(maxCapacity: Max_Capacity): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This data plant will be Activated!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.maxCapacityService.activateMaxCapacity(maxCapacity).subscribe(
          (response) => {
            Swal.fire('Activated!', 'Data max capacity has been Activated', 'success').then(() => {
              window.location.reload();
            });
          },
          (err) => {
            Swal.fire('Error!', 'Failed to Activated the max capacity.', 'error');
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
    link.href = 'assets/Template Excel/Layout_Max_Capacity.xlsx';
    link.download = 'Layout_Max_Capacity.xlsx';
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

  downloadExcel(): void {
    Swal.fire({
      title: 'Loading...',
      html: 'Please wait while fetching data Max Capacity.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.maxCapacityService.exportMaxCapacitiesExcel().subscribe({
      next: (response) => {
        Swal.close();
        // Menggunakan nama file yang sudah ditentukan di backend
        const filename = 'MAX_CAPACITY_DATA.xlsx'; // Nama file bisa dinamis jika diperlukan
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
      html: 'Please wait while fetching data Max Capacity.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.maxCapacityService.templateMaxCapacitiesExcel().subscribe({
      next: (response) => {
        Swal.close();
        // Menggunakan nama file yang sudah ditentukan di backend
        const filename = 'LAYOUT_MAX_CAPACITY.xlsx'; // Nama file bisa dinamis jika diperlukan
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

  uploadFileExcel() {
    if (this.file) {
      Swal.fire({
        title: 'Loading...',
        html: 'Please wait while fetching data Max capacity.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const formData = new FormData();
      formData.append('file', this.file);
      // unggah file Excel
      this.maxCapacityService.uploadFileExcel(formData).subscribe(
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
