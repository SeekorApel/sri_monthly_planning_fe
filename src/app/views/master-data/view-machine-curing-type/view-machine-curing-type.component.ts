import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MachineCuringType } from 'src/app/models/machine-curing-type';
import { ApiResponse } from 'src/app/response/Response';
import { MachineCuringTypeService } from 'src/app/services/master-data/machine-curing-type/machine-curing-type.service';
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver';
declare var $: any;
import * as XLSX from 'xlsx';
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';
import { Setting } from 'src/app/models/Setting';
import { SettingService } from 'src/app/services/master-data/setting/setting.service';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-view-machine-curing-type',
  templateUrl: './view-machine-curing-type.component.html',
  styleUrls: ['./view-machine-curing-type.component.scss'],
})
export class ViewMachineCuringTypeComponent implements OnInit {
  //Variable Declaration
  machineCuringTypes: MachineCuringType[] = [];
  searchText: string = '';
  errorMessage: string | null = null;
  edtMCTObject: MachineCuringType = new MachineCuringType();
  isEditMode: boolean = false;
  file: File | null = null;
  editMCTForm: FormGroup;
  public uomOptionData: Array<Select2OptionData>;
  public options: Options = {
    width: '100%',
    minimumResultsForSearch: 0,
  };
  settings: Setting[];

  // Pagination
  pageOfItems: Array<any>;
  pageSize: number = 5;
  totalPages: number = 5;
  displayedColumns: string[] = ['no', 'machinecuringtype_ID', 'setting_ID', 'description', 'cavity', 'status', 'action'];
  dataSource: MatTableDataSource<MachineCuringType>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private machineCuringTypeService: MachineCuringTypeService, private fb: FormBuilder, private settingService: SettingService) {
    this.editMCTForm = this.fb.group({
      description: ['', Validators.required],
      setting: ['', Validators.required],
      cavity: ['', Validators.required],
    });
    this.loadSetting();
  }
  validateNumberInput(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);

    // Kode ASCI 48 - 57 angka (0-9) yang bisa diketik
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  ngOnInit(): void {
    this.getAllMachineCuringType();
  }
  private loadSetting(): void {
    this.settingService.getAllSetting().subscribe(
      (response: ApiResponse<Setting[]>) => {
        this.settings = response.data;

        if (!this.uomOptionData) {
          this.uomOptionData = [];
        }

        this.uomOptionData = this.settings.map((element) => ({
          id: element.setting_ID.toString(), // Ensure the ID is a string
          text: element.setting_VALUE, // Set the text to the name (or other property)
        }));
      },
      (error) => {
        this.errorMessage = 'Failed to load Setting: ' + error.message;
      }
    );
  }

  getAllMachineCuringType(): void {
    Swal.fire({
      title: 'Loading...',
      html: 'Please wait while fetching data Machine Curing Type.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.machineCuringTypeService.getAllMCT().subscribe(
      (response: ApiResponse<MachineCuringType[]>) => {
        Swal.close();
        this.machineCuringTypes = response.data.map((curingT) => {
          const setting = this.settings.find((setting) => setting.setting_ID === curingT.setting_ID);
          return {
            ...curingT,
            setting_value: setting ? setting.setting_VALUE : 'Unknown',
          };
        });
        this.dataSource = new MatTableDataSource(this.machineCuringTypes);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      (error) => {
        Swal.fire('Error!', 'Failed to load Machine Curing Type.', 'error');
        this.errorMessage = 'Failed to load Machine Curing Type: ' + error.message;
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

  updateMCT(): void {
    this.machineCuringTypeService.updateMCT(this.edtMCTObject).subscribe(
      (response) => {
        // SweetAlert setelah update berhasil
        Swal.fire({
          title: 'Success!',
          text: 'Data Machine Curing Type successfully updated.',
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

  openModalEdit(idMCT: number): void {
    this.isEditMode = true;
    this.getMCTById(idMCT);
    $('#editModal').modal('show');
  }

  getMCTById(idMCT: number): void {
    this.machineCuringTypeService.getMctById(idMCT).subscribe(
      (response: ApiResponse<MachineCuringType>) => {
        this.edtMCTObject = response.data;
      },
      (error) => {
        this.errorMessage = 'Failed to load machine curing types: ' + error.message;
      }
    );
  }

  deleteData(Mct: MachineCuringType): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This data machine curing type will be deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.machineCuringTypeService.deleteMct(Mct).subscribe(
          (response) => {
            Swal.fire('Deleted!', 'Data machine curing type has been deleted', 'success').then(() => {
              window.location.reload();
            });
          },
          (err) => {
            Swal.fire('Error!', 'Failed to delete the machine curing type.', 'error');
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
        html: 'Please wait while Saving Machine Curing Type data.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const formData = new FormData();
      formData.append('file', this.file);
      // unggah file Excel
      this.machineCuringTypeService.uploadFileExcel(formData).subscribe(
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
      html: 'Please wait while downloading Machine Curing Type data.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.machineCuringTypeService.exportMctExcel().subscribe({
      next: (response) => {
        Swal.close();
        // Menggunakan nama file yang sudah ditentukan di backend
        const filename = 'MACHIECURINGTYPE_DATA.xlsx'; // Nama file bisa dinamis jika diperlukan
        saveAs(response, filename); // Mengunduh file
      },
      error: (err) => {
        Swal.close();
        Swal.fire('Error!', 'Error Downloading Data.', 'error');
        console.error('Download error:', err);
      },
    });
  }
  tamplateExcel(): void {
    Swal.fire({
      icon: 'info',
      title: 'Processing...',
      html: 'Please wait while downloading Machine Curing Type layout.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.machineCuringTypeService.tamplateMctExcel().subscribe({
      next: (response) => {
        Swal.close();
        // Menggunakan nama file yang sudah ditentukan di backend
        const filename = 'Layout_MACHIECURINGTYPEt.xlsx'; // Nama file bisa dinamis jika diperlukan
        saveAs(response, filename); // Mengunduh file
      },
      error: (err) => {
        Swal.close();
        Swal.fire('Error!', 'Error Downloading layout.', 'error');
        console.error('Download error:', err);
      },
    });
  }
  activateData(mct: MachineCuringType): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This data Machine Curing Type will be Activated!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.machineCuringTypeService.activateMct(mct).subscribe(
          (response) => {
            Swal.fire('Activated!', 'Data Machine Curing Type has been Activated', 'success').then(() => {
              window.location.reload();
            });
          },
          (err) => {
            Swal.fire('Error!', 'Failed to Activated the Machine Curing Type.', 'error');
          }
        );
      }
    });
  }
}
