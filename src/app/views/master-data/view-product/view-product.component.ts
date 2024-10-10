import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/models/Product';
import { ApiResponse } from 'src/app/response/Response';
import { ProductService } from 'src/app/services/master-data/product/product.service';
import Swal from 'sweetalert2';
declare var $: any;
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-view-product',
  templateUrl: './view-product.component.html',
  styleUrls: ['./view-product.component.scss'],
})
export class ViewProductComponent implements OnInit {
  //Variable Declaration
  products: Product[] = [];
  searchText: string = '';
  errorMessage: string | null = null;
  editProductTypeObject: Product = new Product();
  isEditMode: boolean = false;
  file: File | null = null;
  editProductTypeForm: FormGroup;

  // Pagination
  pageOfItems: Array<any>;
  pageSize: number = 5;
  totalPages: number = 5;

  constructor(private productService: ProductService, private fb: FormBuilder) {
    this.editProductTypeForm = this.fb.group({
      curing: ['', Validators.required],
      pattern: ['', Validators.required],
      size: ['', Validators.required],
      productType: ['', Validators.required],
      qty: ['', Validators.required],
      upper: ['', Validators.required],
      lower: ['', Validators.required],
      desc: ['', Validators.required],
      itemExt: ['', Validators.required],
      itemAssy: ['', Validators.required],
      wibTube: ['', Validators.required],
      rim: ['', Validators.required],
      description: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getAllMachineTassType();
  }

  getAllMachineTassType(): void {
    this.productService.getAllProduct().subscribe(
      (response: ApiResponse<Product[]>) => {
        this.products = response.data;
        console.log(this.products);
        this.onChangePage(this.products.slice(0, this.pageSize));
      },
      (error) => {
        this.errorMessage = 'Failed to load product: ' + error.message;
      }
    );
  }

  onChangePage(pageOfItems: Array<any>) {
    this.pageOfItems = pageOfItems;
  }

  onSearchChange(): void {
    // Lakukan filter berdasarkan nama Product yang mengandung text pencarian (case-insensitive)
    const filteredProduct = this.products.filter((descriptions) => descriptions.description.toLowerCase().includes(this.searchText.toLowerCase()) || descriptions.part_NUMBER.toString().includes(this.searchText));

    // Tampilkan hasil filter pada halaman pertama
    this.onChangePage(filteredProduct.slice(0, this.pageSize));
  }

  resetSearch(): void {
    this.searchText = '';
    this.onChangePage(this.products.slice(0, this.pageSize));
  }

  updateProduct(): void {
    this.productService.updateProduct(this.editProductTypeObject).subscribe(
      (response) => {
        // SweetAlert setelah update berhasil
        Swal.fire({
          title: 'Success!',
          text: 'Data Product successfully updated.',
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

  openModalEdit(partNum: number): void {
    this.isEditMode = true;
    this.getProductById(partNum);
    $('#editModal').modal('show');
  }

  getProductById(partNum: number): void {
    this.productService.getProductById(partNum).subscribe(
      (response: ApiResponse<Product>) => {
        this.editProductTypeObject = response.data;
      },
      (error) => {
        this.errorMessage = 'Failed to load Product: ' + error.message;
      }
    );
  }

  deleteData(product: Product): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This data product will be deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.deleteProduct(product).subscribe(
          (response) => {
            Swal.fire('Deleted!', 'Data product has been deleted', 'success').then(() => {
              window.location.reload();
            });
          },
          (err) => {
            Swal.fire('Error!', 'Failed to delete the Machine Tass Type.', 'error');
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
    link.href = 'assets/Template Excel/Layout_Product.xlsx';
    link.download = 'Layout_Product.xlsx';
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
      this.productService.uploadFileExcel(formData).subscribe(
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
    this.productService.exportExcel().subscribe({
      next: (response) => {
        // Menggunakan nama file yang sudah ditentukan di backend
        const filename = 'PRODUCT_DATA.xlsx'; // Nama file bisa dinamis jika diperlukan
        saveAs(response, filename); // Mengunduh file
      },
      error: (err) => {
        console.error('Download error:', err);
      }
    });
  }
}
