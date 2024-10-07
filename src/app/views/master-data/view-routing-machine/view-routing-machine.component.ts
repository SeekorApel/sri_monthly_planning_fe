import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoutingMachine } from 'src/app/models/RoutingMachine';
import { ApiResponse } from 'src/app/response/Response';
import { RoutingService } from 'src/app/services/master-data/routingMachine/routingMachine.service';
import Swal from 'sweetalert2';
declare var $: any;
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-view-routing-machine',
  templateUrl: './view-routing-machine.component.html',
  styleUrls: ['./view-routing-machine.component.scss'],
})
export class ViewRoutingMachineComponent implements OnInit {

  //Variable Declaration
  routingMachines: RoutingMachine[] = [];
  searchText: string = '';
  errorMessage: string | null = null;
  edtRoutingMachineObject: RoutingMachine = new RoutingMachine();
  isEditMode: boolean = false;
  file: File | null = null;
  editRoutingMachineForm: FormGroup;

  // Pagination
  pageOfItems: Array<any>;
  pageSize: number = 5;
  totalPages: number = 5;

  constructor(private RoutingMachineService: RoutingService, private fb: FormBuilder) { 
    this.editRoutingMachineForm = this.fb.group({
      CT_assy_ID: ['', Validators.required],
      WIP: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.getAllCtAssy();
  }

  getAllCtAssy(): void {
    this.RoutingMachineService.getAllCtAssy().subscribe(
      (response: ApiResponse<RoutingMachine[]>) => {
        this.routingMachines = response.data;
        this.onChangePage(this.routingMachines.slice(0, this.pageSize));
      },
      (error) => {
        this.errorMessage = 'Failed to load Ct Assy: ' + error.message;
      }
    );
  }

  onChangePage(pageOfItems: Array<any>) {
    this.pageOfItems = pageOfItems;
  }

  onSearchChange(): void {
    // Lakukan filter berdasarkan nama plant yang mengandung text pencarian (case-insensitive)
    const filteredPlants = this.routingMachines.filter(
      (routingMachine) =>
        routingMachine.CT_assy_ID
          .toString()
          .includes(this.searchText.toLowerCase()) ||
          routingMachine.wip.toString().includes(this.searchText)||
          routingMachine.description.toLowerCase().toString().includes(this.searchText) ||
          routingMachine.group_counter.toLowerCase().toString().includes(this.searchText) ||
          routingMachine.var_group_counter.toLowerCase().toString().includes(this.searchText) ||
          routingMachine.sequence.toString().includes(this.searchText) ||
          routingMachine.wct.toLowerCase().toString().includes(this.searchText) ||
          routingMachine.operation_short_text.toLowerCase().toString().includes(this.searchText) ||
          routingMachine.operation_unit.toLowerCase().toString().includes(this.searchText) ||
          routingMachine.base_quantity.toString().includes(this.searchText) ||
          routingMachine.standard_value_unit.toLowerCase().toString().includes(this.searchText) ||
          routingMachine.CT_sec_1.toString().includes(this.searchText) ||
          routingMachine.CT_hr_1000.toString().includes(this.searchText) ||
          routingMachine.WH_normal_shift_1.toString().includes(this.searchText) ||
          routingMachine.WH_normal_shift_2.toString().includes(this.searchText) ||
          routingMachine.WH_normal_shift_3.toString().includes(this.searchText) ||
          routingMachine.WH_shift_jumat.toString().includes(this.searchText) ||
          routingMachine.WH_total_normal_shift.toString().includes(this.searchText) ||
          routingMachine.WH_total_shift_jumat.toString().includes(this.searchText) ||
          routingMachine.allow_normal_shift_1.toString().includes(this.searchText) ||
          routingMachine.allow_normal_shift_2.toString().includes(this.searchText) ||
          routingMachine.allow_normal_shift_3.toString().includes(this.searchText) ||
          routingMachine.allow_total.toString().includes(this.searchText) ||
          routingMachine.OP_time_normal_shift_1.toString().includes(this.searchText) ||
          routingMachine.OP_time_normal_shift_1.toString().includes(this.searchText) ||
          routingMachine.OP_time_normal_shift_1.toString().includes(this.searchText) ||
          routingMachine.OP_time_shift_jumat.toString().includes(this.searchText) ||
          routingMachine.OP_time_total_normal_shift.toString().includes(this.searchText) ||
          routingMachine.OP_time_total_shift_jumat.toString().includes(this.searchText) ||
          routingMachine.kaps_normal_shift_1.toString().includes(this.searchText) ||
          routingMachine.kaps_normal_shift_2.toString().includes(this.searchText) ||
          routingMachine.kaps_normal_shift_3.toString().includes(this.searchText) ||
          routingMachine.kaps_shift_jumat.toString().includes(this.searchText) ||
          routingMachine.kaps_total_normal_shift.toString().includes(this.searchText) ||
          routingMachine.kaps_total_shift_jumat.toString().includes(this.searchText) ||
          routingMachine.waktu_total_CT_normal.toString().includes(this.searchText) ||
          routingMachine.waktu_total_CT_jumat.toString().includes(this.searchText) ||
          routingMachine.status.toString().includes(this.searchText)
    );

    // Tampilkan hasil filter pada halaman pertama
    this.onChangePage(filteredPlants.slice(0, this.pageSize));
  }

  resetSearch(): void {
    this.searchText = '';
    this.onChangePage(this.routingMachines.slice(0, this.pageSize));
  }

  updateCtAssy(): void {
    
    this.RoutingMachineService.updateCtAssy(this.edtRoutingMachineObject).subscribe(
      (response) => {
        // SweetAlert setelah update berhasil
        Swal.fire({
          title: 'Success!',
          text: 'Data plant successfully updated.',
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

  openModalEdit(idCtAssy: number): void {
    this.isEditMode = true;
    this.getPlantById(idCtAssy);
    $('#editModal').modal('show');
  }

  getPlantById(idCtAssy: number): void {
    this.RoutingMachineService.getCtAssyById(idCtAssy).subscribe(
      (response: ApiResponse<RoutingMachine>) => {
        this.edtRoutingMachineObject = response.data;
      },
      (error) => {
        this.errorMessage = 'Failed to load plants: ' + error.message;
      }
    );
  }

  deleteData(CtAssy: RoutingMachine): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This data plant will be deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.RoutingMachineService.deleteCtAssy(CtAssy).subscribe(
          (response) => {
            Swal.fire('Deleted!', 'Data plant has been deleted', 'success').then(() => {
              window.location.reload();
            });
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
    link.href = 'assets/Template Excel/Layout_Master_Setting.xlsx';
    link.download = 'Layout_Master_Setting.xlsx';
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
      this.RoutingMachineService.uploadFileExcel(formData).subscribe(
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
