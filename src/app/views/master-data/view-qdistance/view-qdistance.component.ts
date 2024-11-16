import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QDistance } from 'src/app/models/QDistance';
import { ApiResponse } from 'src/app/response/Response';
import { QDistanceService } from 'src/app/services/master-data/Qdistance/Qdistance.service';
import Swal from 'sweetalert2';
declare var $: any;
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';
import { Quadrant } from 'src/app/models/quadrant';
import { QuadrantService } from 'src/app/services/master-data/quadrant/quadrant.service';

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-view-qdistance',
  templateUrl: './view-qdistance.component.html',
  styleUrls: ['./view-qdistance.component.scss'],
})
export class ViewQDistanceComponent implements OnInit {
  //Variable Declaration
  qdistances: QDistance[] = [];
  searchText: string = '';
  errorMessage: string | null = null;
  edtQDistancesObject: QDistance = new QDistance();
  isEditMode: boolean = false;
  file: File | null = null;
  editQDistancesForm: FormGroup;
  public uomOptionData: Array<Select2OptionData>;
  public options: Options = {
    width: '100%',
    minimumResultsForSearch: 0,
  };
  quadrant: Quadrant[];

  // Pagination
  pageOfItems: Array<any>;
  pageSize: number = 5;
  totalPages: number = 5;

  displayedColumns: string[] = ['no', 'id_Q_DISTANCE', 'quadrant_ID_1', 'quadrant_ID_2', 'distance', 'status', 'action'];
  dataSource: MatTableDataSource<QDistance>;

  constructor(private qdistanceService: QDistanceService, private fb: FormBuilder, private quadrantService: QuadrantService) {
    this.editQDistancesForm = this.fb.group({
      quadrantID1: ['', Validators.required],
      quadrantID2: ['', Validators.required],
      distance: ['', Validators.required],
    });
    this.loadQdistance();
  }

  getQuadrantName(quadrantID: number): string {
    const quadrant = this.quadrant.find((b) => b.quadrant_ID === quadrantID);
    return quadrant ? quadrant.quadrant_NAME.toString() : 'Unknown';
  }

  ngOnInit(): void {
    this.getAllQuadrantDistance();
  }
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  private loadQdistance(): void {
    this.quadrantService.getAllQuadrant().subscribe(
      (response: ApiResponse<Quadrant[]>) => {
        this.quadrant = response.data;

        if (!this.uomOptionData) {
          this.uomOptionData = [];
        }

        this.uomOptionData = this.quadrant.map((element) => ({
          id: element.quadrant_ID.toString(), // Ensure the ID is a string
          text: element.quadrant_NAME, // Set the text to the name (or other property)
        }));
      },
      (error) => {
        this.errorMessage = 'Failed to load Quadrant: ' + error.message;
      }
    );
  }

  getAllQuadrantDistance(): void {
    this.qdistanceService.getAllQuadrantDistance().subscribe(
      (response: ApiResponse<QDistance[]>) => {
        this.qdistances = response.data;
        this.dataSource = new MatTableDataSource(this.qdistances);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        // this.onChangePage(this.qdistances.slice(0, this.pageSize));
      },
      (error) => {
        this.errorMessage = 'Failed to load quadrant distance: ' + error.message;
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
    this.onChangePage(this.qdistances.slice(0, this.pageSize));
  }

  updateQuadrantDistance(): void {
    this.qdistanceService.updateQuadrantDistance(this.edtQDistancesObject).subscribe(
      (response) => {
        // SweetAlert setelah update berhasil
        Swal.fire({
          title: 'Success!',
          text: 'Data quadrant distance successfully updated.',
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

  openModalEdit(idQDistance: number): void {
    this.isEditMode = true;
    this.getQuadrantDistanceById(idQDistance);
    $('#editModal').modal('show');
  }

  getQuadrantDistanceById(idQDistance: number): void {
    this.qdistanceService.getQuadrantDistanceById(idQDistance).subscribe(
      (response: ApiResponse<QDistance>) => {
        this.edtQDistancesObject = response.data;
      },
      (error) => {
        this.errorMessage = 'Failed to load quadrant distances: ' + error.message;
      }
    );
  }

  deleteData(qdistance: QDistance): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This data quadrant distance will be deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.qdistanceService.deleteQuadrantDistance(qdistance).subscribe(
          (response) => {
            Swal.fire('Deleted!', 'Data quadrant distance has been deleted', 'success').then(() => {
              window.location.reload();
            });
          },
          (err) => {
            Swal.fire('Error!', 'Failed to delete the quadrant distance.', 'error');
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
    link.href = 'assets/Template Excel/Layout_Quadrant_Distance.xlsx';
    link.download = 'Layout_Quadrant_Distance.xlsx';
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
      this.qdistanceService.uploadFileExcel(formData).subscribe(
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
  activateData(qdistance: QDistance): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This data quadrant distance will be Activated!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.qdistanceService.activateQuadrantDistance(qdistance).subscribe(
          (response) => {
            Swal.fire('Activated!', 'Data quadrant distance has been Activated', 'success').then(() => {
              window.location.reload();
            });
          },
          (err) => {
            Swal.fire('Error!', 'Failed to Activated the quadrant distance.', 'error');
          }
        );
      }
    });
  }
  downloadExcel(): void {
    this.qdistanceService.exportQuadrantDistancesExcel().subscribe({
      next: (response) => {
        // Menggunakan nama file yang sudah ditentukan di backend
        const filename = 'QUADRANT_DISTANCE_DATA.xlsx'; // Nama file bisa dinamis jika diperlukan
        saveAs(response, filename); // Mengunduh file
      },
      error: (err) => {
        console.error('Download error:', err);
      },
    });
  }
}
