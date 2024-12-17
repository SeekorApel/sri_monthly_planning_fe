import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Setting } from 'src/app/models/Setting';
import { ApiResponse } from 'src/app/response/Response';
import { SettingService } from 'src/app/services/master-data/setting/setting.service';
import Swal from 'sweetalert2';
declare var $: any;
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-view-setting',
  templateUrl: './view-setting.component.html',
  styleUrls: ['./view-setting.component.scss'],
})
export class ViewSettingComponent implements OnInit {

  //Variable Declaration
  settings: Setting[] = [];
  searchText: string = '';
  errorMessage: string | null = null;
  edtSettingObject: Setting = new Setting();
  isEditMode: boolean = false;
  file: File | null = null;
  editSettingForm: FormGroup;

  // Pagination
  pageOfItems: Array<any>;
  pageSize: number = 5;
  totalPages: number = 5;
  sortBuffer: Array<any>;
  displayedColumns: string[] = ['no', 'setting_ID', 'setting_KEY','setting_VALUE', 'description', 'status', 'action'];
  dataSource: MatTableDataSource<Setting>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private settingService: SettingService, private fb: FormBuilder) { 
    this.editSettingForm = this.fb.group({
      settingKEY: ['', Validators.required],
      settingVALUE: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getAllSetting();
  }

  normalizeDecimal(value: string | number): string {
    if (typeof value === 'number') {
      return value.toString().replace('.', ',');
    }
    return value.replace('.', ',');
  }  

  denormalizeDecimal(value: string | number): string {
  if (typeof value === 'string') {
    return value.replace(',', '.');
  }
    return value.toString();
  }

  getAllSetting(): void {
    Swal.fire({
      title: 'Loading...',
      html: 'Please wait while fetching data Setting.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.settingService.getAllSetting().subscribe(
      (response: ApiResponse<Setting[]>) => {
        this.settings = response.data.map(setting => ({
          ...setting,
          // Asumsikan 'amount' adalah field yang berisi nilai desimal
          setting_VALUE: this.normalizeDecimal(setting.setting_VALUE)
        }));
        Swal.close();
        this.dataSource = new MatTableDataSource(this.settings);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.onChangePage(this.dataSource.data.slice(0, this.pageSize));
      },
      (error) => {
        this.errorMessage = 'Failed to load settings: ' + error.message;
      }
    );
  }

  onChangePage(pageOfItems: Array<any>) {
    this.pageOfItems = pageOfItems;
  }

  onSearchChange(): void {
    this.dataSource.filter = this.searchText.trim().toLowerCase();
    // Lakukan filter berdasarkan nama plant yang mengandung text pencarian (case-insensitive)
    // const filteredPlants = this.settings.filter(
    //   (setting) =>
    //     setting.setting_KEY
    //       .toLowerCase()
    //       .includes(this.searchText.toLowerCase()) ||
    //     setting.setting_ID.toString().includes(this.searchText)||
    //     setting.setting_VALUE.toLowerCase().includes(this.searchText.toLowerCase()) ||
    //     setting.description.toLowerCase().includes(this.searchText.toLowerCase())
    // );

    // Tampilkan hasil filter pada halaman pertama
    // this.onChangePage(filteredPlants.slice(0, this.pageSize));
  }

  resetSearch(): void {
    this.searchText = '';
    this.dataSource.filter = this.searchText.trim().toLowerCase();
    this.onChangePage(this.settings.slice(0, this.pageSize));
  }

  updateSetting(): void {
    
    this.settingService.updateSetting(this.edtSettingObject).subscribe(
      (response) => {
        // SweetAlert setelah update berhasil
        Swal.fire({
          title: 'Success!',
          text: 'Data setting successfully updated.',
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

  openModalEdit(idSetting: number): void {
    this.isEditMode = true;
    this.getSettingById(idSetting);
    $('#editModal').modal('show');
  }

  getSettingById(idSetting: number): void {
    this.settingService.getSettingById(idSetting).subscribe(
      (response: ApiResponse<Setting>) => {
        this.edtSettingObject = response.data;
      },
      (error) => {
        this.errorMessage = 'Failed to load settings: ' + error.message;
      }
    );
  }

  deleteData(setting: Setting): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This data setting will be deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.settingService.deleteSetting(setting).subscribe(
          (response) => {
            Swal.fire('Deleted!', 'Data setting has been deleted', 'success').then(() => {
              window.location.reload();
            });
          },
          (err) => {
            Swal.fire('Error!', 'Failed to delete the setting.', 'error');
          }
        );
      }
    });
  }

  activateData(setting: Setting): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This data setting will be Activated!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.settingService.activateSetting(setting).subscribe(
          (response) => {
            Swal.fire('Activated!', 'Data setting has been Activated', 'success').then(() => {
              window.location.reload();
            });
          },
          (err) => {
            Swal.fire('Error!', 'Failed to Activated the setting.', 'error');
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
    link.href = 'assets/Template Excel/Layout_Setting.xlsx';
    link.download = 'Layout_Setting.xlsx';
    link.click();
  }


  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const fileName = file.name.toLowerCase();
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(reader.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });

        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: true });
        const formattedData = jsonData.map((row: any) => {
          for (const key in row) {
            if (typeof row[key] === 'number') {
              row[key] = row[key].toString(); // Konversi angka menjadi string
            }
          }
          return row;
        });
        console.log(formattedData);
    };

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
      html: 'Please wait while fetching data Setting.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.settingService.exportSettingsExcel().subscribe({
      next: (response) => {
        Swal.close();
        // Menggunakan nama file yang sudah ditentukan di backend
        const filename = 'SETTING_DATA.xlsx'; // Nama file bisa dinamis jika diperlukan
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
      html: 'Please wait while fetching data Setting.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.settingService.templateSettingsExcel().subscribe({
      next: (response) => {
        Swal.close();
        // Menggunakan nama file yang sudah ditentukan di backend
        const filename = 'LAYOUT_SETTING.xlsx'; // Nama file bisa dinamis jika diperlukan
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

  uploadFileExcel() {
    Swal.fire({
          title: 'Loading...',
          html: 'Please wait while fetching data Setting.',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
    if (this.file) {
      const formData = new FormData();
      formData.append('file', this.file);
      // unggah file Excel
      this.settingService.uploadFileExcel(formData).subscribe(
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
  };
}
