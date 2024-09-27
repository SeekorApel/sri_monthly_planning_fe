import { Component, OnInit, ViewChild } from '@angular/core';
import { Plant } from 'src/app/models/Plant';
import { ApiResponse } from 'src/app/response/Response';
import { PlantService } from 'src/app/services/master-data/plant/plant.service';
import Swal from 'sweetalert2';
declare var $: any;
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-view-plant',
  templateUrl: './view-plant.component.html',
  styleUrls: ['./view-plant.component.scss'],
})
export class ViewPlantComponent implements OnInit {
  //Variable Declaration
  plants: Plant[] = [];
  searchText: string = '';
  errorMessage: string | null = null;
  edtPlanObject: Plant = new Plant();
  isEditMode: boolean = false;
  file: File | null = null;

  // Pagination
  pageOfItems: Array<any>;
  pageSize: number = 5;
  totalPages: number = 5;

  constructor(
    private plantService: PlantService // Inject PlantService
  ) {}

  ngOnInit(): void {
    this.getAllPlant();
  }

  getAllPlant(): void {
    this.plantService.getAllPlant().subscribe(
      (response: ApiResponse<Plant[]>) => {
        this.plants = response.data;
        this.onChangePage(this.plants.slice(0, this.pageSize));
      },
      (error) => {
        this.errorMessage = 'Failed to load plants: ' + error.message;
      }
    );
  }

  onChangePage(pageOfItems: Array<any>) {
    this.pageOfItems = pageOfItems;
  }

  onSearchChange(): void {
    // Lakukan filter berdasarkan nama plant yang mengandung text pencarian (case-insensitive)
    const filteredPlants = this.plants.filter(
      (plant) =>
        plant.plant_NAME
          .toLowerCase()
          .includes(this.searchText.toLowerCase()) ||
        plant.plant_ID.toString().includes(this.searchText)
    );

    // Tampilkan hasil filter pada halaman pertama
    this.onChangePage(filteredPlants.slice(0, this.pageSize));
  }

  resetSearch(): void {
    this.searchText = '';
    this.onChangePage(this.plants.slice(0, this.pageSize));
  }

  updatePlant(): void {
    this.plantService.updatePlant(this.edtPlanObject).subscribe(
      (response) => {
        // SweetAlert setelah update berhasil
        Swal.fire({
          title: 'Success!',
          text: 'Data Plant Berhasil di Update.',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then((result) => {
          if (result.isConfirmed) {
            // Refresh data plant setelah update
            this.getAllPlant();
            $('#editModal').modal('hide'); // Sembunyikan modal setelah update
          }
        });
      },
      (err) => {
        // SweetAlert ketika gagal
        Swal.fire(
          'Error!',
          'Terjadi Kesalahan dalam mengupdate data.',
          'error'
        );
        console.error('Error updating plant:', err);
      }
    );
  }

  openModalEdit(idPlant: number): void {
    this.isEditMode = true;
    this.getPlantById(idPlant);
    $('#editModal').modal('show');
  }

  getPlantById(idPlant: number): void {
    this.plantService.getPlantById(idPlant).subscribe(
      (response: ApiResponse<Plant>) => {
        this.edtPlanObject = response.data;
      },
      (error) => {
        this.errorMessage = 'Failed to load plants: ' + error.message;
      }
    );
  }

  deleteData(plant: Plant): void {
    Swal.fire({
      title: 'Apakah Anda yakin?',
      text: 'Data plant ini akan dihapus!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Ya',
      cancelButtonText: 'Batal',
    }).then((result) => {
      if (result.isConfirmed) {
        this.plantService.deletePlant(plant).subscribe(
          (response) => {
            Swal.fire('Terhapus!', 'Data plant telah dihapus.', 'success');
            this.getAllPlant();
          },
          (err) => {
            Swal.fire('Error!', 'Failed to delete the plant.', 'error');
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
    link.href = 'assets/Template Excel/Layout_Master_Plant.xlsx';
    link.download = 'Layout_Master_Plant.xlsx';
    link.click();
  }

  ReadExcel(event: any) {
    this.file = event.target.files[0];
    let fileReader = new FileReader();
    fileReader.readAsBinaryString(this.file as File);
    fileReader.onload = (e) => {
      var workbook = XLSX.read(fileReader.result, { type: 'binary' });
      var sheetName = workbook.SheetNames[0];
      var excelData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    };
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.file = input.files[0]; // Simpan file yang dipilih
    }
  }

  uploadFileExcel() {
    if (this.file) {
      const formData = new FormData();
      formData.append('file', this.file);
      // unggah file Excel
      this.plantService.uploadFileExcel(formData).subscribe(
        (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Berhasil!',
            text: 'File Excel berhasil diunggah.',
            confirmButtonText: 'OK',
          }).then(() => {
            this.getAllPlant();
          });
        },
        (error) => {
          console.error('Error uploading file', error);
          Swal.fire({
            icon: 'error',
            title: 'Gagal!',
            text: 'Terjadi kesalahan saat mengunggah file.',
            confirmButtonText: 'OK',
          });
        }
      );
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Peringatan!',
        text: 'Silakan pilih file untuk diunggah.',
        confirmButtonText: 'OK',
      });
    }
  }
}
