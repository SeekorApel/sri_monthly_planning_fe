import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Tass_Size } from 'src/app/models/Tass_Size';
import { ApiResponse } from 'src/app/response/Response';
import { TassSizeService } from 'src/app/services/master-data/tass-size/tass-size.service';
import Swal from 'sweetalert2';
declare var $: any;
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MachineTassType } from 'src/app/models/machine-tass-type';
import { MachineTassTypeService } from 'src/app/services/master-data/machine-tass-type/machine-tass-type.service';
import { Size } from 'src/app/models/Size';
import { SizeService } from 'src/app/services/master-data/size/size.service';

@Component({
  selector: 'app-view-tass-size',
  templateUrl: './view-tass-size.component.html',
  styleUrls: ['./view-tass-size.component.scss']
})
export class ViewTassSizeComponent implements OnInit {

  //Variable Declaration
  tass_sizes: Tass_Size[] = [];
  searchText: string = '';
  errorMessage: string | null = null;
  edtTassSizeObject: Tass_Size = new Tass_Size();
  isEditMode: boolean = false;
  file: File | null = null;
  editTassSizeForm: FormGroup;

  // Pagination
  pageOfItems: Array<any>;
  pageSize: number = 5;
  totalPages: number = 5;
  sortBuffer: Array<any>;
  displayedColumns: string[] = ['no', 'tassize_ID', 'machinetasstype_NAME','size_NAME','capacity', 'status', 'action'];
  dataSource: MatTableDataSource<Tass_Size>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  public uomOptions: Array<Array<Select2OptionData>>;
  public options: Options = { width: '100%'
  };
  uom: any;
  machineTassType: MachineTassType[];
  size: Size[];

  constructor(private tass_sizeService: TassSizeService, private fb: FormBuilder, private machineTassTypeService: MachineTassTypeService, private sizeService: SizeService) { 
    this.editTassSizeForm = this.fb.group({
      machinetasstype_ID: ['', Validators.required],
      sizeid: ['', Validators.required],
      capacity: ['', Validators.required],
    });    
  }
  validateNumberInput(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);

    // Kode ASCI 48 - 57 angka (0-9) yang bisa diketik
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }
  private async loadMachineTassType(): Promise<void> {
    try {
      const response: ApiResponse<MachineTassType[]> = await this.machineTassTypeService
        .getAllMachineTassType()
        .toPromise(); // Convert Observable to Promise
      this.machineTassType = response.data;
      if (!this.uomOptions) {
        this.uomOptions = [];
      }
      this.uomOptions[0] = this.machineTassType.map((element) => ({
        id: element.machinetasstype_ID, // Ensure the ID is a string
        text: element.machinetasstype_ID, // Set the text to the plant name
      }));
    } catch (error) {
      this.errorMessage = 'Failed to load Machine Tass Type: ' + error.message;
    }
  }
  
  private async loadSize(): Promise<void> {
    try {
      const response: ApiResponse<Size[]> = await this.sizeService
        .getAllSize()
        .toPromise(); // Convert Observable to Promise
      this.size = response.data;
      if (!this.uomOptions) {
        this.uomOptions = [];
      }
      this.uomOptions[1] = this.size.map((element) => ({
        id: element.size_ID, // Ensure the ID is a string
        text: element.size_ID, // Set the text to the name (or other property)
      }));
    } catch (error) {
      this.errorMessage = 'Failed to load size: ' + error.message;
    }
  }
  
  async ngOnInit() {
    await this.loadMachineTassType();
    await this.loadSize();
    this.getAllTassSize();
  }

  getAllTassSize(): void {
    Swal.fire({
      title: 'Loading...',
      html: 'Please wait while fetching data Tass Size.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.tass_sizeService.getAllTassSize().subscribe(
      (response: ApiResponse<Tass_Size[]>) => {
        this.tass_sizes = response.data;
        Swal.close();
        
        this.tass_sizes = this.tass_sizes.map((tassSize) => {
          const matchedMachineTassType = this.machineTassType?.find(
            (b) => b.machinetasstype_ID == (tassSize.machinetasstype_ID)
          );
          const matchedSize = this.size.find(
            (c) => c.size_ID == (tassSize.size_ID)
          );
  
          return {
            ...tassSize, // Salin semua properti quadrant
            machinetasstype_NAME: matchedMachineTassType ? matchedMachineTassType.machinetasstype_ID : null, // Tambahkan building_NAME jika ada kecocokan
            size_NAME: matchedSize ? matchedSize.size_ID : null // Tambahkan building_NAME jika ada kecocokan
          };
        });
        this.dataSource = new MatTableDataSource(this.tass_sizes);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.onChangePage(this.dataSource.data.slice(0, this.pageSize));
      },
      (error) => {
        this.errorMessage = 'Failed to load tass sizes: ' + error.message;
      }
    );
  }

  onChangePage(pageOfItems: Array<any>) {
    this.pageOfItems = pageOfItems;
  }

  onSearchChange(): void {
    this.dataSource.filter = this.searchText.trim().toLowerCase();
    // const filteredTassSizes = this.tass_sizes.filter(
    //   (tass_size) =>
    //     tass_size.machinetasstype_ID
    //       .toLowerCase()
    //       .includes(this.searchText.toLowerCase()) ||
    //     tass_size.tassize_ID.toString().includes(this.searchText)||
    //     tass_size.size_ID.toLowerCase().includes(this.searchText.toLowerCase())||
    //     tass_size.capacity.toString().includes(this.searchText.toLowerCase())
        
    // );

    // // Tampilkan hasil filter pada halaman pertama
    // this.onChangePage(filteredTassSizes.slice(0, this.pageSize));
  }

  resetSearch(): void {
    this.searchText = '';
    this.dataSource.filter = this.searchText.trim().toLowerCase();
  }

  updateTassSize(): void {
    const machineId = this.editTassSizeForm.get('machinetasstype_ID').value;
  console.log('Machine ID:', machineId);
    
    this.tass_sizeService.updateTassSize(this.edtTassSizeObject).subscribe(
      (response) => {
        // SweetAlert setelah update berhasil
        Swal.fire({
          title: 'Success!',
          text: 'Data tass size successfully updated.',
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

  getDescSize(size_ID: string): string {
    const size = this.size.find(b => b.size_ID == size_ID);
    return size ? size.description : 'Unknown';
  }

  openModalEdit(idTassSize: number): void {
    this.isEditMode = true;
    this.getTassSizeById(idTassSize);
    $('#editModal').modal('show');
  }

  getTassSizeById(idTassSize: number): void {
    this.tass_sizeService.getTassSizeById(idTassSize).subscribe(
      (response: ApiResponse<Tass_Size>) => {
        this.edtTassSizeObject = response.data;
      },
      (error) => {
        this.errorMessage = 'Failed to load tass sizes: ' + error.message;
      }
    );
  }

  deleteData(tass_size: Tass_Size): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This data tass size will be deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.tass_sizeService.deleteTassSize(tass_size).subscribe(
          (response) => {
            Swal.fire('Deleted!', 'Data tass size has been deleted', 'success').then(() => {
              window.location.reload();
            });
          },
          (err) => {
            Swal.fire('Error!', 'Failed to delete the tass size.', 'error');
          }
        );
      }
    });
  }

  activateData(tass_size: Tass_Size): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This data tass size will be Activated!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.tass_sizeService.activateTassSize(tass_size).subscribe(
          (response) => {
            Swal.fire('Activated!', 'Data tass size has been Activated', 'success').then(() => {
              window.location.reload();
            });
          },
          (err) => {
            Swal.fire('Error!', 'Failed to Activated the tass sizes.', 'error');
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
    link.href = 'assets/Template Excel/Layout_Tass_Size.xlsx';
    link.download = 'Layout_Tass_Size.xlsx';
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
    Swal.fire({
          title: 'Loading...',
          html: 'Please wait while fetching data Tass Size.',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });
    if (this.file) {
      const formData = new FormData();
      formData.append('file', this.file);
      // unggah file Excel
      this.tass_sizeService.uploadFileExcel(formData).subscribe(
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
      html: 'Please wait while fetching data Tass Size.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.tass_sizeService.exportTassSizesExcel().subscribe({
      next: (response) => {
        Swal.close();
        // Menggunakan nama file yang sudah ditentukan di backend
        const filename = 'TASS_SIZE_DATA.xlsx'; // Nama file bisa dinamis jika diperlukan
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
      html: 'Please wait while fetching data Tass Size.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.tass_sizeService.templateTassSizesExcel().subscribe({
      next: (response) => {
        Swal.close();
        // Menggunakan nama file yang sudah ditentukan di backend
        const filename = 'LAYOUT_TASS_SIZE.xlsx'; // Nama file bisa dinamis jika diperlukan
        saveAs(response, filename); // Mengunduh file
      },
      error: (err) => {
        console.error('Download error:', err);
      }
    });
  }
}
