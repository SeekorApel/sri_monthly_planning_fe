import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Item_Assy } from 'src/app/models/Item_Assy';
import { ApiResponse } from 'src/app/response/Response';
import { ItemAssyService } from 'src/app/services/master-data/item-assy/itemAssy.service';
import Swal from 'sweetalert2';
declare var $: any;
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-view-item-assy',
  templateUrl: './view-item-assy.component.html',
  styleUrls: ['./view-item-assy.component.scss'],
})
export class ViewItemAssyComponent implements OnInit {

  //Variable Declaration
  itemAssys: Item_Assy[] = [];
  searchText: string = '';
  errorMessage: string | null = null;
  edtItemAssyObject: Item_Assy = new Item_Assy();
  isEditMode: boolean = false;
  file: File | null = null;
  editItemAssyForm: FormGroup;

  // Pagination
  pageOfItems: Array<any>;
  pageSize: number = 5;
  totalPages: number = 5;

  constructor(private itemAssyService: ItemAssyService, private fb: FormBuilder) { 
    this.editItemAssyForm = this.fb.group({
      itemAssy: ['', Validators.required]

    });
  }

  ngOnInit(): void {
    this.getAllItemAssy();
  }

  getAllItemAssy(): void {
    this.itemAssyService.getAllItemAssy().subscribe(
      (response: ApiResponse<Item_Assy[]>) => {
        this.itemAssys = response.data;
        this.onChangePage(this.itemAssys.slice(0, this.pageSize));
      },
      (error) => {
        this.errorMessage = 'Failed to load quadrants: ' + error.message;
      }
    );
  }

  onChangePage(pageOfItems: Array<any>) {
    this.pageOfItems = pageOfItems;
  }

  onSearchChange(): void {
    // Lakukan filter berdasarkan nama plant yang mengandung text pencarian (case-insensitive)
    const filteredPlants = this.itemAssys.filter(
      (itemAssy) =>
        itemAssy.item_ASSY
          .toString()
          .includes(this.searchText.toLowerCase()) ||
          itemAssy.item_ASSY.toString().includes(this.searchText)
    );

    // Tampilkan hasil filter pada halaman pertama
    this.onChangePage(filteredPlants.slice(0, this.pageSize));
  }

  resetSearch(): void {
    this.searchText = '';
    this.onChangePage(this.itemAssys.slice(0, this.pageSize));
  }

  updateItemAssy(): void {
    
    this.itemAssyService.updateItemAssy(this.edtItemAssyObject).subscribe(
      (response) => {
        // SweetAlert setelah update berhasil
        Swal.fire({
          title: 'Success!',
          text: 'Data item assy successfully updated.',
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
        console.log(err);
        Swal.fire('Error!', 'Error updating data.', 'error');
      }
    );
  }

  openModalEdit(idItemAssy: number): void {
    this.isEditMode = true;
    this.getItemAssyById(idItemAssy);
    $('#editModal').modal('show');
  }

  getItemAssyById(idItemAssy: number): void {
    this.itemAssyService.getItemAssyById(idItemAssy).subscribe(
      (response: ApiResponse<Item_Assy>) => {
        this.edtItemAssyObject = response.data;
      },
      (error) => {
        this.errorMessage = 'Failed to load item assys: ' + error.message;
      }
    );
  }

  deleteData(itemAssy: Item_Assy): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This data item assy will be deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.itemAssyService.deleteItemAssy(itemAssy).subscribe(
          (response) => {
            Swal.fire('Deleted!', 'Data item assy has been deleted', 'success').then(() => {
              window.location.reload();
            });
          },
          (err) => {
            Swal.fire('Error!', 'Failed to delete the item assy.', 'error');
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
    link.href = 'assets/Template Excel/Layout_Master_ItemAssy.xlsx';
    link.download = 'Layout_Master_ItemAssy.xlsx';
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
      this.itemAssyService.uploadFileExcel(formData).subscribe(
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
  };
}
