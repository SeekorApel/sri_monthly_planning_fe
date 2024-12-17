import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductType } from 'src/app/models/ProductType';
import { ApiResponse } from 'src/app/response/Response';
import { ProductTypeService } from 'src/app/services/master-data/productType/productType.service';
import Swal from 'sweetalert2';
declare var $: any;
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-view-product-type',
  templateUrl: './view-product-type.component.html',
  styleUrls: ['./view-product-type.component.scss'],
})
export class ViewProductTypeComponent implements OnInit {
  //Variable Declaration
  productTypes: ProductType[] = [];
  searchText: string = '';
  errorMessage: string | null = null;
  edtProductTypeObject: ProductType = new ProductType();
  isEditMode: boolean = false;
  file: File | null = null;
  editProductTypeForm: FormGroup;

  // Pagination
  pageOfItems: Array<any>;
  pageSize: number = 5;
  totalPages: number = 5;
  sortBuffer: Array<any>;
  displayedColumns: string[] = ['no', 'product_TYPE_ID', 'product_MERK','product_TYPE', 'category', 'status', 'action'];
  dataSource: MatTableDataSource<ProductType>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public uomOptions: Array<Select2OptionData>;
  public options: Options = { width: '100%'};

  constructor(private productTypeService: ProductTypeService, private fb: FormBuilder) {
    this.editProductTypeForm = this.fb.group({
      productMerk: ['', Validators.required],
      productType: ['', Validators.required],
      category: ['', Validators.required]
    });

    // this.uomOptions = [
    //   { id: 'FED', text: 'FED' },
    //   { id: 'FDR', text: 'FDR' }
    // ];
  }

  ngOnInit(): void {
    this.getAllProductType();
  }

  getAllProductType(): void {
    Swal.fire({
      title: 'Loading...',
      html: 'Please wait while fetching data Product Type.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.productTypeService.getAllProductType().subscribe(
      (response: ApiResponse<ProductType[]>) => {
        this.productTypes = response.data;
        Swal.close();

        this.dataSource = new MatTableDataSource(this.productTypes);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.onChangePage(this.dataSource.data.slice(0, this.pageSize));
      },
      (error) => {
        this.errorMessage = 'Failed to load product types: ' + error.message;
      }
    );
  }

  onChangePage(pageOfItems: Array<any>) {
    this.pageOfItems = pageOfItems;
  }

  onSearchChange(): void {

    this.dataSource.filter = this.searchText.trim().toLowerCase();
    // Lakukan filter berdasarkan nama plant yang mengandung text pencarian (case-insensitive)
    // const filteredProductType = this.productTypes.filter((productType) => 
    // productType.product_TYPE_ID.toString().includes(this.searchText.toLowerCase()) || 
    // productType.product_MERK.toLowerCase().includes(this.searchText.toLowerCase()) ||
    // productType.product_TYPE.toLowerCase().includes(this.searchText.toLowerCase()) ||
    // productType.category.toLowerCase().includes(this.searchText.toLowerCase()));

    // // Tampilkan hasil filter pada halaman pertama
    // this.onChangePage(filteredProductType.slice(0, this.pageSize));
  }

  resetSearch(): void {
    this.searchText = '';
    this.dataSource.filter = this.searchText.trim().toLowerCase();
    this.onChangePage(this.productTypes.slice(0, this.pageSize));
  }

  updateProductType(): void {
    this.productTypeService.updateProductType(this.edtProductTypeObject).subscribe(
      (response) => {
        // SweetAlert setelah update berhasil
        Swal.fire({
          title: 'Success!',
          text: 'Data Product Type successfully updated.',
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

  openModalEdit(idProductType: number): void {
    this.isEditMode = true;
    this.getProductTypeById(idProductType);
    $('#editModal').modal('show');
  }

  getProductTypeById(idProductType: number): void {
    this.productTypeService.getProductTypeById(idProductType).subscribe(
      (response: ApiResponse<ProductType>) => {
        this.edtProductTypeObject = response.data;
      },
      (error) => {
        this.errorMessage = 'Failed to load product types: ' + error.message;
      }
    );
  }

  deleteData(productType: ProductType): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This data product type will be deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.productTypeService.deleteProductType(productType).subscribe(
          (response) => {
            Swal.fire('Deleted!', 'Data product type has been deleted', 'success').then(() => {
              window.location.reload();
            });
          },
          (err) => {
            Swal.fire('Error!', 'Failed to delete the product type.', 'error');
          }
        );
      }
    });
  }

  activateData(productType: ProductType): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This data product type will be Activated!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.productTypeService.activateProductType(productType).subscribe(
          (response) => {
            Swal.fire('Activated!', 'Data product type has been Activated', 'success').then(() => {
              window.location.reload();
            });
          },
          (err) => {
            Swal.fire('Error!', 'Failed to Activated the product type.', 'error');
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
    link.href = 'assets/Template Excel/Layout_ProductType.xlsx';
    link.download = 'Layout_Product_Type.xlsx';
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
            html: 'Please wait while fetching data Product Type.',
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });
      const formData = new FormData();
      formData.append('file', this.file);
      // unggah file Excel
      this.productTypeService.uploadFileExcel(formData).subscribe(
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
      html: 'Please wait while fetching data Product Type.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.productTypeService.exportProductTypeExcel().subscribe({
      next: (response) => {
        Swal.close();
        // Menggunakan nama file yang sudah ditentukan di backend
        const filename = 'PRODUCT_TYPE_DATA.xlsx'; // Nama file bisa dinamis jika diperlukan
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
      html: 'Please wait while fetching data Product Type.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.productTypeService.templateProductTypeExcel().subscribe({
      next: (response) => {
        Swal.close();
        // Menggunakan nama file yang sudah ditentukan di backend
        const filename = 'LAYOUT_PRODUCT_TYPE.xlsx'; // Nama file bisa dinamis jika diperlukan
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

  // downloadExcel(): void {
  //   this.plantService.downloadPlantsExcel().subscribe(
  //     (response: Blob) => {
  //       const blobUrl = window.URL.createObjectURL(response);
  //       const a = document.createElement('a');
  //       a.href = blobUrl;
  //       a.download = 'MASTER_PLANT.xlsx';
  //       a.click();
  //       window.URL.revokeObjectURL(blobUrl);
  //     },
  //     (error) => {
  //       this.errorMessage = 'Failed to download Excel: ' + error.message;
  //     }
  //   );
  // }
}
