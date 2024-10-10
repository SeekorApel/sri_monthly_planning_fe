import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QDistance } from 'src/app/models/QDistance';
import { ApiResponse } from 'src/app/response/Response';
import { QDistanceService } from 'src/app/services/master-data/Qdistance/Qdistance.service';
import Swal from 'sweetalert2';
declare var $: any;
import * as XLSX from 'xlsx';

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

  // Pagination
  pageOfItems: Array<any>;
  pageSize: number = 5;
  totalPages: number = 5;

  constructor(private qdistanceService: QDistanceService, private fb: FormBuilder) { 
    this.editQDistancesForm = this.fb.group({
      quadrantID1: ['', Validators.required],
      quadrantID2: ['', Validators.required],
      distance: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getAllQuadrantDistance();
  }

  getAllQuadrantDistance(): void {
    this.qdistanceService.getAllQuadrantDistance().subscribe(
      (response: ApiResponse<QDistance[]>) => {
        this.qdistances = response.data;
        this.onChangePage(this.qdistances.slice(0, this.pageSize));
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
    // Lakukan filter berdasarkan nama plant yang mengandung text pencarian (case-insensitive)
    const filteredQDistances = this.qdistances.filter(
      (distance) =>
        distance.id_Q_DISTANCE.toString()
          .toLowerCase()
          .includes(this.searchText.toLowerCase()) ||
        distance.distance.toString().includes(this.searchText) ||
        distance.quadrant_ID_1.toString().includes(this.searchText)||
        distance.quadrant_ID_2.toString().includes(this.searchText)
    );

    // Tampilkan hasil filter pada halaman pertama
    this.onChangePage(filteredQDistances.slice(0, this.pageSize));
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
}
