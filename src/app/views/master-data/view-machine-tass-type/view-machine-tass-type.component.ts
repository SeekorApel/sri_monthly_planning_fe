import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MachineTassType } from 'src/app/models/machine-tass-type';
import { ApiResponse } from 'src/app/response/Response';
import { MachineTassTypeService } from 'src/app/services/master-data/machine-tass-type/machine-tass-type.service';
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver';
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';
import { Setting } from 'src/app/models/Setting';
import { SettingService } from 'src/app/services/master-data/setting/setting.service';

declare var $: any;
import * as XLSX from 'xlsx';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-view-plant',
  templateUrl: './view-machine-tass-type.component.html',
  styleUrls: ['./view-machine-tass-type.component.scss'],
})
export class ViewMachineTassTypeComponent implements OnInit {
  //Variable Declaration
  mtt: MachineTassType[] = [];
  searchText: string = '';
  errorMessage: string | null = null;
  edtMachineTassTypeObject: MachineTassType = new MachineTassType();
  isEditMode: boolean = false;
  file: File | null = null;
  editMachineTassTypeForm: FormGroup;
  public uomOptionData: Array<Select2OptionData>;
  public options: Options = {
    width: '100%',
    minimumResultsForSearch: 0,
  };

  // Pagination
  pageOfItems: Array<any>;
  pageSize: number = 5;
  totalPages: number = 5;
  displayedColumns: string[] = ['no', 'machinetasstype_ID', 'setting_ID', 'description', 'status', 'action'];
  dataSource: MatTableDataSource<MachineTassType>;
  settings: Setting[];

  constructor(private mttService: MachineTassTypeService, private fb: FormBuilder, private settingService: SettingService) {
    this.editMachineTassTypeForm = this.fb.group({
      description: ['', Validators.required],
      setting: ['', Validators.required],
    });
    this.loadSetting();
  }
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    this.getAllMachineTassType();
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

  getAllMachineTassType(): void {
    Swal.fire({
      title: 'Loading...',
      html: 'Please wait while fetching data Machine Tass.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.mttService.getAllMachineTassType().subscribe(
      (response: ApiResponse<MachineTassType[]>) => {
        Swal.close();
        this.mtt = response.data.map((machineTassT) => {
          const setting = this.settings.find((setting) => setting.setting_ID === machineTassT.setting_ID);
          return {
            ...machineTassT,
            setting_value: setting ? setting.setting_VALUE : 'Unknown',
          };
        });
        this.dataSource = new MatTableDataSource(this.mtt);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      (error) => {
        Swal.close();
        Swal.fire('Error!', 'Failed to load Machine Tass Types.', 'error');
        this.errorMessage = 'Failed to load machine tass types: ' + error.message;
      }
    );
  }

  onChangePage(pageOfItems: Array<any>) {
    this.pageOfItems = pageOfItems;
  }
  activateData(mtt: MachineTassType): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This data machine tass type will be Activated!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.mttService.activateMachineTassType(mtt).subscribe(
          (response) => {
            Swal.fire('Activated!', 'Data machine tass type has been Activated', 'success').then(() => {
              window.location.reload();
            });
          },
          (err) => {
            Swal.fire('Error!', 'Failed to Activated the machine tass type.', 'error');
          }
        );
      }
    });
  }

  onSearchChange(): void {
    this.dataSource.filter = this.searchText.trim().toLowerCase();
  }

  resetSearch(): void {
    this.searchText = '';
    this.dataSource.filter = this.searchText.trim().toLowerCase();
  }

  updateMachineTassType(): void {
    this.mttService.updateMachineTassType(this.edtMachineTassTypeObject).subscribe(
      (response) => {
        // SweetAlert setelah update berhasil
        Swal.fire({
          title: 'Success!',
          text: 'Data Machine Tass Type successfully updated.',
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

  openModalEdit(idMachineTassType: number): void {
    this.isEditMode = true;
    this.getMachineTassById(idMachineTassType);
    $('#editModal').modal('show');
  }

  getMachineTassById(idMachineTassType: number): void {
    this.mttService.getMachineTassTypeById(idMachineTassType).subscribe(
      (response: ApiResponse<MachineTassType>) => {
        this.edtMachineTassTypeObject = response.data;
      },
      (error) => {
        this.errorMessage = 'Failed to load Machine Tass Types: ' + error.message;
      }
    );
  }

  deleteData(machinetasstype: MachineTassType): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This data machine tass type will be deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.mttService.deleteMachineTassType(machinetasstype).subscribe(
          (response) => {
            Swal.fire('Deleted!', 'Data Machine Tass Type has been deleted', 'success').then(() => {
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
        html: 'Please wait while Saving data Machine Tass Type.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const formData = new FormData();
      formData.append('file', this.file);
      // unggah file Excel
      this.mttService.uploadFileExcel(formData).subscribe(
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
      html: 'Please wait while downloading Machine Tass Type data.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.mttService.exportMachineTassTypeExcel().subscribe({
      next: (response) => {
        Swal.close();
        // Menggunakan nama file yang sudah ditentukan di backend
        const filename = 'MACHINETASSTYPE_DATA.xlsx'; // Nama file bisa dinamis jika diperlukan
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
      html: 'Please wait while downloading Machine Tass Type layout.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.mttService.tamplateMachineTassTypeExcel().subscribe({
      next: (response) => {
        Swal.close();
        // Menggunakan nama file yang sudah ditentukan di backend
        const filename = 'Layout_MACHINETASSTYPE.xlsx'; // Nama file bisa dinamis jika diperlukan
        saveAs(response, filename); // Mengunduh file
      },
      error: (err) => {
        Swal.close();
        Swal.fire('Error!', 'Error Downloading Layout.', 'error');
        console.error('Download error:', err);
      },
    });
  }
}
