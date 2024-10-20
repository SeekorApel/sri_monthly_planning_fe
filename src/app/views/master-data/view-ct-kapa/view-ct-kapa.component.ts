import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CtKapa } from 'src/app/models/ct-kapa';
import { ApiResponse } from 'src/app/response/Response';
import { CtKapaService } from 'src/app/services/master-data/ct-kapa/ctkapa.service';
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver';
declare var $: any;
import * as XLSX from 'xlsx';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

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

  // Pagination
  pageOfItems: Array<any>;
  pageSize: number = 5;
  totalPages: number = 5;
  displayedColumns: string[] = ['no','id_CT_KAPA','item_CURING','type_CURING',
    'description','cycle_TIME','shift','kapa_PERSHIFT','last_UPDATE_DATA','machine',
    'status','action'
  ];
  dataSource: MatTableDataSource<CtKapa>;

  constructor(private ctkapaService: CtKapaService, private fb: FormBuilder) {
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
    this.ctkapaService.exportCtKapaExcel().subscribe({
      next: (response) => {
        // Menggunakan nama file yang sudah ditentukan di backend
        const filename = 'CTKAPA_DATA.xlsx'; // Nama file bisa dinamis jika diperlukan
        saveAs(response, filename); // Mengunduh file
      },
      error: (err) => {
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
    this.ctkapaService.getAllCtKapa().subscribe(
      (response: ApiResponse<CtKapa[]>) => {
        this.ctkapas = response.data;
        this.dataSource = new MatTableDataSource(this.ctkapas);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        // this.onChangePage(this.ctkapas.slice(0, this.pageSize));
      },
      (error) => {
        this.errorMessage = 'Failed to load Ct Kapa: ' + error.message;
      }
    );
  }

  onChangePage(pageOfItems: Array<any>) {
    this.pageOfItems = pageOfItems;
  }

  onSearchChange(): void {
    // Lakukan filter berdasarkan nama plant yang mengandung text pencarian (case-insensitive)
    const filteredPlants = this.ctkapas.filter((ctkapa) => ctkapa.machine.toLowerCase().includes(this.searchText.toLowerCase()) || ctkapa.id_CT_KAPA.toString().includes(this.searchText));

    // Tampilkan hasil filter pada halaman pertama
    this.onChangePage(filteredPlants.slice(0, this.pageSize));
  }

  resetSearch(): void {
    this.searchText = '';
    this.onChangePage(this.ctkapas.slice(0, this.pageSize));
  }

  updatePattern(): void {
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

  downloadTemplate() {
    const link = document.createElement('a');
    link.href = 'assets/Template Excel/Layout_CT_Kapa.xlsx';
    link.download = 'Layout_Master_CT_KAPA.xlsx';
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
      this.ctkapaService.uploadFileExcel(formData).subscribe(
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
}
