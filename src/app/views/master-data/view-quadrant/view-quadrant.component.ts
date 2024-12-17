import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Quadrant } from 'src/app/models/quadrant';
import { ApiResponse } from 'src/app/response/Response';
import { QuadrantService } from 'src/app/services/master-data/quadrant/quadrant.service';
import Swal from 'sweetalert2';
declare var $: any;
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Building } from 'src/app/models/Building';
import { BuildingService } from 'src/app/services/master-data/building/building.service';

@Component({
  selector: 'app-view-quadrant',
  templateUrl: './view-quadrant.component.html',
  styleUrls: ['./view-quadrant.component.scss'],
})
export class ViewQuadrantComponent implements OnInit {
  //Variable Declaration
  quadrants: Quadrant[] = [];
  searchText: string = '';
  errorMessage: string | null = null;
  edtQuadrantObject: Quadrant = new Quadrant();
  isEditMode: boolean = false;
  file: File | null = null;
  editQuadrantForm: FormGroup;

  // Pagination
  pageOfItems: Array<any>;
  pageSize: number = 5;
  totalPages: number = 5;
  sortBuffer: Array<any>;
  displayedColumns: string[] = ['no', 'quadrant_ID', 'building_NAME','quadrant_NAME','status', 'action'];
  dataSource: MatTableDataSource<Quadrant>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public uomOptions: Array<Select2OptionData>;
  public options: Options = { width: '100%' };
  uom: any;
  building: Building[] = [];

  constructor(private quadrantService: QuadrantService, private fb: FormBuilder, private buildingService: BuildingService) {
    this.editQuadrantForm = this.fb.group({
      quadrantName: ['', Validators.required],
      buildingID: ['', Validators.required],
    });
    buildingService.getAllBuilding().subscribe(
      (response: ApiResponse<Building[]>) => {
        this.building = response.data;
        this.uomOptions = this.building.map((element) => ({
          id: element.building_ID.toString(), // Ensure the ID is a string
          text: element.building_NAME // Set the text to the plant name
        }));
      },
      (error) => {
        this.errorMessage = 'Failed to load building: ' + error.message;
      }
    );
  }

  getBuildingName(building_ID: number): string {
    const building = this.building.find(b => b.building_ID === building_ID);
    return building ? building.building_NAME : 'Unknown';
  }

  ngOnInit(): void {
    this.getAllQuadrant();
  }

  validateForm() {
    const quadrantControl = this.editQuadrantForm.get('quadrantName');

    if (quadrantControl?.hasError('required') && quadrantControl.touched) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Quadrant name is required!'
      });
    } else if (quadrantControl?.hasError('maxlength') && quadrantControl.touched) {
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Quadrant name must not exceed 255 characters!'
      });
    }
  }

  getAllQuadrant(): void {
    Swal.fire({
      title: 'Loading...',
      html: 'Please wait while fetching data Quadrant.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.quadrantService.getAllQuadrant().subscribe(
      (response: ApiResponse<Quadrant[]>) => {
        this.quadrants = response.data;
        Swal.close();
        
        this.quadrants = this.quadrants.map((quadrant) => {
          const matchedBuilding = this.building.find(
            (b) => b.building_ID === Number(quadrant.building_ID)
          );
  
          return {
            ...quadrant, // Salin semua properti quadrant
            building_NAME: matchedBuilding ? matchedBuilding.building_NAME : null // Tambahkan building_NAME jika ada kecocokan
          };
        });
        this.dataSource = new MatTableDataSource(this.quadrants);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.onChangePage(this.dataSource.data.slice(0, this.pageSize));
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
    this.dataSource.filter = this.searchText.trim().toLowerCase();
    // Lakukan filter berdasarkan nama plant yang mengandung text pencarian (case-insensitive)

  }

  resetSearch(): void {
    this.searchText = '';
    this.dataSource.filter = this.searchText.trim().toLowerCase();
    this.onChangePage(this.quadrants.slice(0, this.pageSize));
  }

  updateQuadrant(): void {
    this.quadrantService.updateQuadrant(this.edtQuadrantObject).subscribe(
      (response) => {
        // SweetAlert setelah update berhasil
        Swal.fire({
          title: 'Success!',
          text: 'Data quadrant successfully updated.',
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

  openModalEdit(idQuadrant: number): void {
    this.isEditMode = true;
    this.getQuadrantById(idQuadrant);
    $('#editModal').modal('show');
  }

  getQuadrantById(idQuadrant: number): void {
    this.quadrantService.getQuadrantById(idQuadrant).subscribe(
      (response: ApiResponse<Quadrant>) => {
        this.edtQuadrantObject = response.data;
      },
      (error) => {
        this.errorMessage = 'Failed to load quadrants: ' + error.message;
      }
    );
  }

  deleteData(quadrant: Quadrant): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This data quadrant will be deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.quadrantService.deleteQuadrant(quadrant).subscribe(
          (response) => {
            Swal.fire('Deleted!', 'Data quadrant has been deleted', 'success').then(() => {
              window.location.reload();
            });
          },
          (err) => {
            Swal.fire('Error!', 'Failed to delete the quadrant.', 'error');
          }
        );
      }
    });
  }

  activateData(quadrant: Quadrant): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This data quadrant will be Activated!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.quadrantService.activateQuadrant(quadrant).subscribe(
          (response) => {
            Swal.fire('Activated!', 'Data quadrant has been Activated', 'success').then(() => {
              window.location.reload();
            });
          },
          (err) => {
            Swal.fire('Error!', 'Failed to Activated the quadrant.', 'error');
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
    link.href = 'assets/Template Excel/Layout_Quadrant.xlsx';
    link.download = 'Layout_Quadrant.xlsx';
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
            html: 'Please wait while fetching data Quadrant.',
            allowOutsideClick: false,
            didOpen: () => {
              Swal.showLoading();
            },
          });
      const formData = new FormData();
      formData.append('file', this.file);
      // unggah file Excel
      this.quadrantService.uploadFileExcel(formData).subscribe(
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
      html: 'Please wait while fetching data Quadrant.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.quadrantService.exportQuadrantsExcel().subscribe({
      next: (response) => {
        Swal.close();
        // Menggunakan nama file yang sudah ditentukan di backend
        const filename = 'QUADRANT_DATA.xlsx'; // Nama file bisa dinamis jika diperlukan
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
      html: 'Please wait while fetching data Quadrant.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.quadrantService.templateQuadrantsExcel().subscribe({
      next: (response) => {
        Swal.close();
        // Menggunakan nama file yang sudah ditentukan di backend
        const filename = 'LAYOUT_QUADRANT.xlsx'; // Nama file bisa dinamis jika diperlukan
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
