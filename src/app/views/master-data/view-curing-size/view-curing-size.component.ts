import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Curing_Size } from 'src/app/models/curingSize';
import { ApiResponse } from 'src/app/response/Response';
import { CuringSizeService } from 'src/app/services/master-data/curing-size/curing-size.service';
import Swal from 'sweetalert2';
declare var $: any;
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MachineCuringType } from 'src/app/models/machine-curing-type';
import { MachineCuringTypeService } from 'src/app/services/master-data/machine-curing-type/machine-curing-type.service';
import { Size } from 'src/app/models/Size';
import { SizeService } from 'src/app/services/master-data/size/size.service';

@Component({
  selector: 'app-view-curing-size',
  templateUrl: './view-curing-size.component.html',
  styleUrls: ['./view-curing-size.component.scss'],
})
export class ViewCuringSizeComponent implements OnInit {
  //Variable Declaration
  curingSizes: Curing_Size[] = [];
  searchText: string = '';
  errorMessage: string | null = null;
  edtCuringSizeObject: Curing_Size = new Curing_Size();
  isEditMode: boolean = false;
  file: File | null = null;
  editCuringSizeForm: FormGroup;

  // Pagination
  pageOfItems: Array<any>;
  pageSize: number = 5;
  totalPages: number = 5;
  sortBuffer: Array<any>;
  displayedColumns: string[] = ['no', 'curingsize_ID', 'machinecuringtype_ID','size_ID', 'capacity', 'status', 'action'];
  dataSource: MatTableDataSource<Curing_Size>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public uomOptions: Array<Array<Select2OptionData>>;
  public options: Options = { width: '100%'};
  uom: any;
  machineCuringType: MachineCuringType[] =[];
  size: Size[] =[];

  constructor(private curingSizeService: CuringSizeService, private fb: FormBuilder, private machineCuringTypeService: MachineCuringTypeService, private sizeService: SizeService) { 
    this.editCuringSizeForm = this.fb.group({
      machineCuringTypeID: ['', Validators.required],
      sizeID: ['', Validators.required],
      capacity: ['', Validators.required]
    });
    
    this.loadMachineCuringType();
    this.loadSize();
  }

  private loadMachineCuringType(): void {
    this.machineCuringTypeService.getAllMCT().subscribe(
      (response: ApiResponse<MachineCuringType[]>) => {
        this.machineCuringType = response.data;
        if (!this.uomOptions) {
          this.uomOptions = [];
        }
        this.uomOptions[0] = this.machineCuringType.map((element) => ({
          id: element.machinecuringtype_ID.toString(), // Ensure the ID is a string
          text: element.machinecuringtype_ID.toString() // Set the text to the plant name
        }));
      },
      (error) => {
        this.errorMessage = 'Failed to load machine Curing type: ' + error.message;
      }
    );
  }
  private loadSize(): void {
    this.sizeService.getAllSize().subscribe(
      (response: ApiResponse<Size[]>) => {
        this.size = response.data;
        if (!this.uomOptions) {
          this.uomOptions = [];
        }
        this.uomOptions[1] = this.size.map((element) => ({
          id: element.size_ID, // Ensure the ID is a string
          text: element.size_ID, // Set the text to the name (or other property)
        }));
      },
      (error) => {
        this.errorMessage = 'Failed to load size: ' + error.message;
      }
    );
  }

  ngOnInit(): void {
    this.getAllCuringSize();
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault(); // Prevent non-numeric input
    }
  }
  
  getAllCuringSize(): void {
    Swal.fire({
      title: 'Loading...',
      html: 'Please wait while fetching data Curing Size.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.curingSizeService.getAllCuringSize().subscribe(
      (response: ApiResponse<Curing_Size[]>) => {
        this.curingSizes = response.data;
        Swal.close();

        this.curingSizes = this.curingSizes.map((curingSize) => {
          const matchedSize = this.size.find(
            (b) => b.size_ID === (curingSize.size_ID)
          );
  
          return {
            ...curingSize,
            size_ID: matchedSize ? matchedSize.size_ID : null
          };
        });
        this.dataSource = new MatTableDataSource(this.curingSizes);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.onChangePage(this.dataSource.data.slice(0, this.pageSize));
      },
      (error) => {
        this.errorMessage = 'Failed to load curing sizes: ' + error.message;
      }
    );
  }

  onChangePage(pageOfItems: Array<any>) {
    this.pageOfItems = pageOfItems;
  }

  onSearchChange(): void {
    this.dataSource.filter = this.searchText.trim().toLowerCase();
    // Lakukan filter berdasarkan nama plant yang mengandung text pencarian (case-insensitive)
    // const filteredCuringSizes = this.curingSizes.filter((curingSizes) => 
    //   curingSizes.size_ID.toLowerCase().includes(this.searchText.toLowerCase()) ||
    //   curingSizes.machinecuringtype_ID.toString().includes(this.searchText) ||
    //   curingSizes.capacity.toString().includes(this.searchText) 
    // );

    // // Tampilkan hasil filter pada halaman pertama
    // this.onChangePage(filteredCuringSizes.slice(0, this.pageSize));
  }

  resetSearch(): void {
    this.searchText = '';
    this.dataSource.filter = this.searchText.trim().toLowerCase();
    this.onChangePage(this.curingSizes.slice(0, this.pageSize));
  }

  updateCuringSize(): void {
    this.curingSizeService.updateCuringSize(this.edtCuringSizeObject).subscribe(
      (response) => {
        // SweetAlert setelah update berhasil
        Swal.fire({
          title: 'Success!',
          text: 'Data curing size successfully updated.',
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

  openModalEdit(idCuringSize: number): void {
    this.isEditMode = true;
    this.getCuringSizeById(idCuringSize);
    $('#editModal').modal('show');
  }

  getCuringSizeById(idCuringSize: number): void {
    this.curingSizeService.getCuringSizeById(idCuringSize).subscribe(
      (response: ApiResponse<Curing_Size>) => {
        this.edtCuringSizeObject = response.data;
      },
      (error) => {
        this.errorMessage = 'Failed to load curing size: ' + error.message;
      }
    );
  }

  deleteData(curingSize: Curing_Size): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This data curing size will be deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.curingSizeService.deleteCuringSize(curingSize).subscribe(
          (response) => {
            Swal.fire('Deleted!', 'Data curing size has been deleted', 'success').then(() => {
              window.location.reload();
            });
          },
          (err) => {
            Swal.fire('Error!', 'Failed to delete the curing size.', 'error');
          }
        );
      }
    });
  }

  activateData(curingSize: Curing_Size): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This data curing size will be Activated!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.curingSizeService.activateCuringSize(curingSize).subscribe(
          (response) => {
            Swal.fire('Activated!', 'Data curing size has been Activated', 'success').then(() => {
              window.location.reload();
            });
          },
          (err) => {
            Swal.fire('Error!', 'Failed to Activated the curing size.', 'error');
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
    link.href = 'assets/Template Excel/Layout_Curing_Size.xlsx';
    link.download = 'Layout_Curing_Size.xlsx';
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
            html: 'Please wait while fetching data Curing Size.',
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });
      const formData = new FormData();
      formData.append('file', this.file);
      // unggah file Excel
      this.curingSizeService.uploadFileExcel(formData).subscribe(
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
      html: 'Please wait while fetching data Curing Size.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.curingSizeService.exportCuringSizeExcel().subscribe({
      next: (response) => {
        Swal.close();
        // Menggunakan nama file yang sudah ditentukan di backend
        const filename = 'CURING_SIZE_DATA.xlsx'; // Nama file bisa dinamis jika diperlukan
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
      html: 'Please wait while fetching data Curing Size.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.curingSizeService.templateCuringSizeExcel().subscribe({
      next: (response) => {
        Swal.close();
        // Menggunakan nama file yang sudah ditentukan di backend
        const filename = 'LAYOUT_CURING_SIZE.xlsx'; // Nama file bisa dinamis jika diperlukan
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
