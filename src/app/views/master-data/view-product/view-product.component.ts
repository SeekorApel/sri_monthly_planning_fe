import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Product } from 'src/app/models/Product';
import { ApiResponse } from 'src/app/response/Response';
import { ProductService } from 'src/app/services/master-data/product/product.service';
import Swal from 'sweetalert2';
declare var $: any;
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';
import { PatternService } from 'src/app/services/master-data/pattern/pattern.service';
import { Pattern } from 'src/app/models/Pattern';
import { ItemCuringService } from 'src/app/services/master-data/item-curing/item-curing.service';
import { Item_Curing } from 'src/app/models/Item_Curing';
import { Size } from 'src/app/models/Size';
import { SizeService } from 'src/app/services/master-data/size/size.service';
import { ProductType } from 'src/app/models/ProductType';
import { ProductTypeService } from 'src/app/services/master-data/productType/productType.service';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

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
  editProductObject: Product = new Product();
  isEditMode: boolean = false;
  file: File | null = null;
  editProductTypeForm: FormGroup;
  public uomOptionData: Array<Array<Select2OptionData>>;
  public options: Options = {
    width: '100%',
    minimumResultsForSearch: 0,
  };
  itemCurings: Item_Curing[];
  patterns: Pattern[];
  sizes: Size[];
  productTypes: ProductType[];

  // Pagination
  pageOfItems: Array<any>;
  pageSize: number = 5;
  totalPages: number = 5;
  displayedColumns: string[] = ['no', 'part_NUMBER', 'item_CURING', 'pattern_ID', 'size_ID', 'product_TYPE_ID', 'description', 'qty_PER_RAK', 'upper_CONSTANT', 'lower_CONSTANT', 'ext_DESCRIPTION', 'item_EXT', 'item_ASSY', 'wib_TUBE', 'rim', 'status', 'action'];
  dataSource: MatTableDataSource<Product>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private productService: ProductService, private fb: FormBuilder, private itemCuring: ItemCuringService, private pattern: PatternService, private size: SizeService, private productType: ProductTypeService) {
    this.editProductTypeForm = this.fb.group({
      curing: ['', Validators.required],
      pattern: ['', Validators.required],
      size: ['', Validators.required],
      productType: ['', Validators.required],
      description: ['', Validators.required],
      qty: ['', Validators.required],
      upper: ['', Validators.required],
      lower: ['', Validators.required],
      desc: ['', Validators.required],
      itemExt: ['', Validators.required],
      itemAssy: ['', Validators.required],
      wibTube: ['', Validators.required],
      rim: ['', Validators.required],
    });

    this.loadItemCuring();
    this.loadPattern();
    this.loadSize();
    this.loadProductType();
  }

  validateNumberInput(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);

    // Kode ASCI 48 - 57 angka (0-9) yang bisa diketik
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  private loadItemCuring(): void {
    this.itemCuring.getAllItemCuring().subscribe(
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

  private loadSize(): void {
    this.size.getAllSize().subscribe(
      (response: ApiResponse<Size[]>) => {
        this.sizes = response.data;
        if (!this.uomOptionData) {
          this.uomOptionData = [];
        }
        this.uomOptionData[2] = this.sizes.map((element) => ({
          id: element.size_ID.toString(), // Ensure the ID is a string
          text: element.size_ID, // Set the text to the name (or other property)
        }));
      },
      (error) => {
        this.errorMessage = 'Failed to load size: ' + error.message;
      }
    );
  }
  
  private loadProductType(): void {
    this.productType.getAllProductType().subscribe(
      (response: ApiResponse<ProductType[]>) => {
        this.productTypes = response.data;
        if (!this.uomOptionData) {
          this.uomOptionData = [];
        }
        this.uomOptionData[3] = this.productTypes.map((element) => ({
          id: element.product_TYPE_ID.toString(), // Ensure the ID is a string
          text: element.category, // Set the text to the name (or other property)
        }));
      },
      (error) => {
        this.errorMessage = 'Failed to load product type: ' + error.message;
      }
    );
  }

  private loadPattern(): void {
    this.pattern.getAllPattern().subscribe(
      (response: ApiResponse<Pattern[]>) => {
        this.patterns = response.data;
        if (!this.uomOptionData) {
          this.uomOptionData = [];
        }
        this.uomOptionData[1] = this.patterns.map((element) => ({
          id: element.pattern_ID.toString(), // Ensure the ID is a string
          text: element.pattern_NAME, // Set the text to the name
        }));
      },
      (error) => {
        this.errorMessage = 'Failed to load patterns: ' + error.message;
      }
    );
  }
  getPatternName(patternID: number): string {
    const pattern = this.patterns.find((p) => p.pattern_ID === patternID);
    return pattern ? pattern.pattern_NAME : 'Unknown';
  }

  activateData(product: Product): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This data product will be Activated!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.productService.activateProduct(product).subscribe(
          (response) => {
            Swal.fire('Activated!', 'Data product has been Activated', 'success').then(() => {
              window.location.reload();
            });
          },
          (err) => {
            Swal.fire('Error!', 'Failed to Activated the product.', 'error');
          }
        );
      }
    });
  }

  ngOnInit(): void {
    this.getAllProduct();
  }

  getAllProduct(): void {
    Swal.fire({
      title: 'Loading...',
      html: 'Please wait while fetching data Product.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.productService.getAllProduct().subscribe(
      (response: ApiResponse<Product[]>) => {
        Swal.close();
        this.products = response.data.map((produk) => {
          const pattern2 = this.patterns.find((p) => p.pattern_ID == Number(produk.pattern_ID));
          const size_id = this.sizes.find((s) => Number(s.size_ID) === produk.size_ID);
          const product_type = this.productTypes.find((pt) => pt.product_TYPE_ID === produk.product_TYPE_ID);
          return {
            ...produk,
            pattern_name: pattern2 ? pattern2.pattern_NAME : 'Unknow',
            size_name: size_id ? size_id.description : 'Unknow',
            product_type_name: product_type ? product_type.category : 'Unknow',
          };
        });
        this.dataSource = new MatTableDataSource(this.products);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      (error) => {
        Swal.close();
        Swal.fire('Error!', 'Failed to load product.', 'error');
        this.errorMessage = 'Failed to load product: ' + error.message;
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
    // this.onChangePage(this.products.slice(0, this.pageSize));
  }

  updateProduct(): void {
    this.productService.updateProduct(this.editProductObject).subscribe(
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
        this.editProductObject = response.data;
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
        html: 'Please wait while saving Product Data.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const formData = new FormData();
      formData.append('file', this.file);
      // unggah file Excel
      this.productService.uploadFileExcel(formData).subscribe(
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

  downloadExcel(): void {
    Swal.fire({
      icon: 'info',
      title: 'Processing...',
      html: 'Please wait while downloading Product Data.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.productService.exportExcel().subscribe({
      next: (response) => {
        Swal.close();
        // Menggunakan nama file yang sudah ditentukan di backend
        const filename = 'PRODUCT_DATA.xlsx'; // Nama file bisa dinamis jika diperlukan
        saveAs(response, filename); // Mengunduh file
      },
      error: (err) => {
        Swal.close();
        Swal.fire('Error!', 'Error downloading Data.', 'error');
        console.error('Download error:', err);
      },
    });
  }
  tamplateExcel(): void {
    Swal.fire({
      icon: 'info',
      title: 'Processing...',
      html: 'Please wait while downloading Product layout.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.productService.tamplateExcel().subscribe({
      next: (response) => {
        Swal.close();
        // Menggunakan nama file yang sudah ditentukan di backend
        const filename = 'Layout_PRODUCT.xlsx'; // Nama file bisa dinamis jika diperlukan
        saveAs(response, filename); // Mengunduh file
      },
      error: (err) => {
        Swal.close();
        Swal.fire('Error!', 'Error downloading layout.', 'error');
        console.error('Download error:', err);
      },
    });
  }
}
