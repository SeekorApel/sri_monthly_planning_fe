import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Item_Curing } from 'src/app/models/Item_Curing';
import { ApiResponse } from 'src/app/response/Response';
import { ItemCuringService } from 'src/app/services/master-data/item-curing/item-curing.service';
import Swal from 'sweetalert2';
declare var $: any;
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-view-item-curing',
  templateUrl: './view-item-curing.component.html',
  styleUrls: ['./view-item-curing.component.scss']
})
export class ViewItemCuringComponent implements OnInit {

  //Variable Declaration
  itemcurings: Item_Curing[] = [];
  searchText: string = '';
  errorMessage: string | null = null;
  edtItemCuringObject: Item_Curing = new Item_Curing();
  isEditMode: boolean = false;
  file: File | null = null;
  editItemCuringForm: FormGroup;

  // Pagination
  pageOfItems: Array<any>;
  pageSize: number = 5;
  totalPages: number = 5;
  sortBuffer: Array<any>;
  displayedColumns: string[] = ['no', 'item_CURING', 'machine_TYPE','kapa_PER_MOULD','number_OF_MOULD', 'spare_MOULD', 'mould_MONTHLY_PLAN',  'status', 'action'];
  dataSource: MatTableDataSource<Item_Curing>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private itemcuringService: ItemCuringService, private fb: FormBuilder) { 
    this.editItemCuringForm = this.fb.group({
      machineType: ['', Validators.required],
      kapaPerMould: ['', Validators.required],
      numberOfMould: ['', Validators.required],
      spareMould: ['', Validators.required],
      mouldMonthlyPlan: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getAllItemCuring();
  }

  allowOnlyNumbers(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault(); // Prevent non-numeric input
    }
  }
  
  getAllItemCuring(): void {
    Swal.fire({
      title: 'Loading...',
      html: 'Please wait while fetching data Item Curing.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.itemcuringService.getAllItemCuring().subscribe(
      (response: ApiResponse<Item_Curing[]>) => {
        this.itemcurings = response.data;
        Swal.close();
        this.dataSource = new MatTableDataSource(this.itemcurings);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.onChangePage(this.dataSource.data.slice(0, this.pageSize));
      },
      (error) => {
        this.errorMessage = 'Failed to load item curings: ' + error.message;
      }
    );
  }

  onChangePage(pageOfItems: Array<any>) {
    this.pageOfItems = pageOfItems;
  }

  onSearchChange(): void {
    this.dataSource.filter = this.searchText.trim().toLowerCase();
    // Lakukan filter berdasarkan nama plant yang mengandung text pencarian (case-insensitive)
    // const filteredItemCurings = this.itemcurings.filter(
    //   (itemcuring) =>
    //     itemcuring.item_CURING
    //       .toLowerCase()
    //       .includes(this.searchText.toLowerCase()) ||
    //       itemcuring.machine_TYPE.toLowerCase().includes(this.searchText.toLowerCase())||
    //       itemcuring.kapa_PER_MOULD.toString().includes(this.searchText)||
    //       itemcuring.number_OF_MOULD.toString().includes(this.searchText)
    // );

    // // Tampilkan hasil filter pada halaman pertama
    // this.onChangePage(filteredItemCurings.slice(0, this.pageSize));
  }

  resetSearch(): void {
    this.searchText = '';
    this.dataSource.filter = this.searchText.trim().toLowerCase();
    this.onChangePage(this.itemcurings.slice(0, this.pageSize));
  }

  updateItemCuring(): void {
    this.itemcuringService.updateItemCuring(this.edtItemCuringObject).subscribe(
      (response) => {
        // SweetAlert setelah update berhasil
        Swal.fire({
          title: 'Success!',
          text: 'Data item curing successfully updated.',
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

  openModalEdit(idItemCuring: string): void {
    this.isEditMode = true;
    this.getItemCuringById(idItemCuring);
    $('#editModal').modal('show');
  }

  getItemCuringById(idItemCuring: string): void {
    this.itemcuringService.getItemCuringById(idItemCuring).subscribe(
      (response: ApiResponse<Item_Curing>) => {
        this.edtItemCuringObject = response.data;
      },
      (error) => {
        this.errorMessage = 'Failed to load item curings: ' + error.message;
      }
    );
  }

  deleteData(itemcuring: Item_Curing): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This data item curing will be deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.itemcuringService.deleteItemCuring(itemcuring).subscribe(
          (response) => {
            Swal.fire('Deleted!', 'Data item curing has been deleted', 'success').then(() => {
              window.location.reload();
            });
          },
          (err) => {
            Swal.fire('Error!', 'Failed to delete the item curing.', 'error');
          }
        );
      }
    });
  }

  activateData(item_curing: Item_Curing): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This data item curing will be Activated!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) { 
        this.itemcuringService.activateItemCuring(item_curing).subscribe(
          (response) => {
            Swal.fire('Activated!', 'Data item curing has been Activated', 'success').then(() => {
              window.location.reload();
            });
          },
          (err) => {
            Swal.fire('Error!', 'Failed to Activated the item curing.', 'error');
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
    link.href = 'assets/Template Excel/Layout_Item_Curing.xlsx';
    link.download = 'Layout_Item_Curing.xlsx';
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
            html: 'Please wait while fetching data Item Curing.',
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });
      const formData = new FormData();
      formData.append('file', this.file);
      // unggah file Excel
      this.itemcuringService.uploadFileExcel(formData).subscribe(
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
      html: 'Please wait while fetching data Item Curing.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.itemcuringService.exportItemCuringsExcel().subscribe({
      next: (response) => {
        Swal.close();
        // Menggunakan nama file yang sudah ditentukan di backend
        const filename = 'ITEM_CURING_DATA.xlsx'; // Nama file bisa dinamis jika diperlukan
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
      html: 'Please wait while fetching data Item Curing.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.itemcuringService.templateItemCuringsExcel().subscribe({
      next: (response) => {
        Swal.close();
        // Menggunakan nama file yang sudah ditentukan di backend
        const filename = 'LAYOUT_ITEM_CURING.xlsx'; // Nama file bisa dinamis jika diperlukan
        saveAs(response, filename); // Mengunduh file
      },
      error: (err) => {
        console.error('Download error:', err);
      }
    });
  }
}
