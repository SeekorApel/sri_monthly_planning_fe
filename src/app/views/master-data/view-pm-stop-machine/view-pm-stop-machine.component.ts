import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ApiResponse } from 'src/app/response/Response';
import Swal from 'sweetalert2';
import { saveAs } from 'file-saver';
declare var $: any;
import * as XLSX from 'xlsx';
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';
import { Curing_Machine } from 'src/app/models/Curing_Machine';
import { MachineTass } from 'src/app/models/machine-tass';
import { MachineTassService } from 'src/app/services/master-data/machine-tass/machine-tass.service';
import { MachineExtruding } from 'src/app/models/machine-extruding';
import { MachineExtrudingService } from 'src/app/services/master-data/machine-extruding/machine-extruding.service';

import { PMStopMachine } from 'src/app/models/pm-stop-machine';
import { PMStopMachineService } from 'src/app/services/master-data/PM_Stop_Machine/pm_stop_MACHINE.service';
import { CuringMachineService } from 'src/app/services/master-data/curing-machine/curing-machine.service';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-view-pm-stop-machine',
  templateUrl: './view-pm-stop-machine.component.html',
  styleUrls: ['./view-pm-stop-machine.component.scss'],
})
export class ViewPmStopMachineComponent implements OnInit {
  //Variable Declaration
  pmStopMachines: PMStopMachine[] = [];
  searchText: string = '';
  errorMessage: string | null = null;
  edtPmStopMachineObject: PMStopMachine = new PMStopMachine();
  AddPmStopMachineObject: PMStopMachine = new PMStopMachine();
  isEditMode: boolean = false;
  isAddMode: boolean = false;
  file: File | null = null;
  edtPmStopMachineFrom: FormGroup;
  AddPmStopMachineForm: FormGroup;
  public uomOptionData: Array<Select2OptionData>;
  public options: Options = {
    width: '100%',
    minimumResultsForSearch: 0,
  };
  minDate: string;
  curingMachines: Curing_Machine[];
  tassMachine: MachineTass[] = [];
  extrudingMachine: MachineExtruding[] = [];

  // Pagination
  pageOfItems: Array<any>;
  pageSize: number = 5;
  totalPages: number = 5;
  displayedColumns: string[] = ['no', 'stop_MACHINE_ID', 'work_CENTER_TEXT', 'start_DATE', 'start_TIME', 'end_DATE', 'end_TIME', 'status', 'action'];
  dataSource: MatTableDataSource<PMStopMachine>;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private pmStopService: PMStopMachineService, private fb: FormBuilder, private curingMachineService: CuringMachineService, private tassMachineService: MachineTassService, private extrudingMachineService: MachineExtrudingService) {
    this.edtPmStopMachineFrom = this.fb.group(
      {
        work_CENTER_TEXTedit: ['', Validators.required],
        start_DATE: ['', Validators.required],
        start_TIME: ['', Validators.required],
        end_DATE: ['', Validators.required],
        end_TIME: ['', Validators.required],
      },
      {
        validators: [this.timeValidator], // Tambahkan validator khusus di sini
      }
    );
    this.AddPmStopMachineForm = this.fb.group(
      {
        work_CENTER_TEXTadd: ['', Validators.required],
        start_DATE: ['', Validators.required],
        start_TIME: ['', Validators.required],
        end_DATE: ['', Validators.required],
        end_TIME: ['', Validators.required],
      },
      {
        validators: [this.timeValidator, this.minStartDate, this.dateValidator], // Tambahkan validator khusus di sini
      }
    );
    curingMachineService.getAllMachineCuring().subscribe(
      (response: ApiResponse<Curing_Machine[]>) => {
        const curingOptions = response.data.map((element) => ({
          id: element.work_CENTER_TEXT, // Ensure the ID is a string
          text: element.work_CENTER_TEXT, // Set the text to the work center text
        }));

        tassMachineService.getAllMachineTass().subscribe(
          (response: ApiResponse<MachineTass[]>) => {
            const tassOptions = response.data.map((element) => ({
              id: element.id_MACHINE_TASS, // Ensure the ID is a string
              text: element.id_MACHINE_TASS, // Set the text to the machine ID
            }));

            extrudingMachineService.getAllMachineExtruding().subscribe(
              (response: ApiResponse<MachineExtruding[]>) => {
                const extrudingOptions = response.data.map((element) => ({
                  id: element.ID_machine_ext, // Ensure the ID is a string
                  text: element.type, // Set the text to the machine ID
                }));

                // Combine both options into uomOptions
                this.uomOptionData = [...curingOptions, ...tassOptions, ...extrudingOptions];
              },
              (error) => {
                this.errorMessage = 'Failed to load tass machine: ' + error.message;
              }
            );
          },
          (error) => {
            this.errorMessage = 'Failed to load tass machine: ' + error.message;
          }
        );
      },
      (error) => {
        this.errorMessage = 'Failed to load curing machine: ' + error.message;
      }
    );
    this.subscribeToFormChanges();
  }

  // Method untuk debug atau aksi pada perubahan input
  onDateChange(): void {
    const startDateControl = this.AddPmStopMachineForm.get('start_DATE');
    if (startDateControl?.hasError('invalidMinDate')) {
      console.error('Start date must not be earlier than today.');
    }
  }

  private timeValidator(control: AbstractControl): ValidationErrors | null {
    const startTime = control.get('start_TIME')?.value; // Format HH:mm
    const endTime = control.get('end_TIME')?.value; // Format HH:mm
    const startDate = control.get('start_DATE')?.value; // Format YYYY-MM-DD
    const endDate = control.get('end_DATE')?.value; // Format YYYY-MM-DD

    if (!startTime || !endTime || !startDate || !endDate) {
      return null; // Tidak ada cukup data untuk validasi
    }

    const now = new Date();
    const dateStart = new Date(startDate);
    const dateEnd = new Date(endDate);

    // Gabungkan startTime dengan startDate
    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const fullStartTime = new Date(dateStart);
    fullStartTime.setHours(startHours, startMinutes, 0, 0);

    // Validasi jika startTime kurang dari waktu sekarang
    if (fullStartTime < now) {
      console.log('Waktu sekarang: ', now);
      return { invalidStartTime: true };
    }

    // Validasi jika tanggal mulai dan akhir sama
    if (dateStart.getTime() === dateEnd.getTime()) {
      const [endHours, endMinutes] = endTime.split(':').map(Number);
      const fullEndTime = new Date(dateEnd);
      fullEndTime.setHours(endHours, endMinutes, 0, 0);

      if (fullStartTime >= fullEndTime) {
        return { invalidTimeRange: true }; // Error rentang waktu tidak valid
      }
    }

    return null; // Valid
  }

  ngOnInit(): void {
    this.getAllPmStopMachine();
  }
  formatedate(date: Date): string {
    const formattedDate = new Date(date).toLocaleDateString('en-CA');
    return formattedDate;
  }
  subscribeToFormChanges(): void {
    this.edtPmStopMachineFrom.get('start_TIME')?.valueChanges.subscribe(() => {
      this.edtPmStopMachineFrom.get('end_TIME')?.updateValueAndValidity({ onlySelf: true });
    });

    this.edtPmStopMachineFrom.get('start_DATE')?.valueChanges.subscribe(() => {
      this.edtPmStopMachineFrom.get('end_DATE')?.updateValueAndValidity({ onlySelf: true });
    });
  }
  private minStartDate(control: AbstractControl): ValidationErrors | null {
    const startDate = control.get('start_DATE')?.value;
    const today = new Date();
    const min = today.toISOString().split('T')[0];

    if (startDate < min) {
      return { invalidStartDate: true };
    }
    return null;
  }

  private dateValidator(control: AbstractControl): ValidationErrors | null {
    const startDate = control.get('start_DATE')?.value;
    const endDate = control.get('end_DATE')?.value;

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (start > end) {
        return { invalidDate: true };
      }
    }
    return null;
  }

  getAllPmStopMachine(): void {
    Swal.fire({
      title: 'Loading...',
      html: 'Please wait while fetching data PM Stop Machine.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.pmStopService.getAllPMStopMachine().subscribe(
      (response: ApiResponse<PMStopMachine[]>) => {
        Swal.close();
        this.pmStopMachines = response.data.map((Element) => {
          return {
            ...Element,
            formattedStartDate: new Date(Element.start_DATE).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-'),
            formattedEndDate: new Date(Element.end_DATE).toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-'),
          };
        });
        this.dataSource = new MatTableDataSource(this.pmStopMachines);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      },
      (error) => {
        Swal.close();
        Swal.fire('Error!', 'Failed to load PM Stop Machine.', 'error');
        this.errorMessage = 'Failed to load PM Stop Machine: ' + error.message;
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

  updatePMStopMachine(): void {
    this.pmStopService.updatePMStopMachine(this.edtPmStopMachineObject).subscribe(
      (response) => {
        // SweetAlert setelah update berhasil
        Swal.fire({
          title: 'Success!',
          text: 'Data PM Stop Machine successfully updated.',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then((result) => {
          if (result.isConfirmed) {
            $('#editModal').modal('hide');
            window.location.reload();
          }
        });
        console.log(this.edtPmStopMachineObject);
      },
      (err) => {
        Swal.fire('Error!', 'Error updating data.', 'error');
      }
    );
  }

  savePmStopMachine(): void {
    this.pmStopService.SavePMStopMachine(this.AddPmStopMachineObject).subscribe(
      (response) => {
        // SweetAlert setelah update berhasil
        Swal.fire({
          title: 'Success!',
          text: 'Data PM Stop Machine successfully Saved.',
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
        Swal.fire('Error!', 'Error Saving data.', 'error');
      }
    );
  }

  openModalEdit(work_CENTER_TEXT: number): void {
    this.isEditMode = true;
    this.getPmStopMachineById(work_CENTER_TEXT);
    $('#editModal').modal('show');

    $('#editModal').on('hidden.bs.modal', () => {
      this.resetEditForm();
    });
  }
  openModaldd(): void {
    this.isAddMode = true;
    $('#AddModal').modal('show');

    $('#AddModal').on('hidden.bs.modal', () => {
      this.resetEditForm();
    });
  }
  resetEditForm(): void {
    this.AddPmStopMachineForm.reset();
    this.edtPmStopMachineFrom.reset();
    this.isEditMode = false;
    this.isAddMode = false;
  }

  getPmStopMachineById(work_CENTER_TEXT: number): void {
    this.pmStopService.getPMStopMachineById(work_CENTER_TEXT).subscribe(
      (response: ApiResponse<PMStopMachine>) => {
        this.edtPmStopMachineObject = response.data;

        const formattedStartDate = this.formatedate(this.edtPmStopMachineObject.start_DATE);
        const formattedEndDate = this.formatedate(this.edtPmStopMachineObject.end_DATE);

        // Default nilai waktu ke null jika tidak ada
        const startTime = this.edtPmStopMachineObject.start_TIME || null;
        const endTime = this.edtPmStopMachineObject.end_TIME || null;
        // const wct = this.edtPmStopMachineObject.work_CENTER_TEXT || "null";

        this.edtPmStopMachineFrom.patchValue({
          // work_CENTER_TEXT: wct,
          start_DATE: formattedStartDate,
          end_DATE: formattedEndDate,
          start_TIME: startTime,
          end_TIME: endTime,
        });
      },
      (error) => {
        this.errorMessage = 'Failed to load PM Stop Machine: ' + error.message;
      }
    );
  }

  deleteData(pmStopMachine: PMStopMachine): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This data PM Stop Machine will be deleted!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        this.pmStopService.deletePmStopMachine(pmStopMachine).subscribe(
          (response) => {
            Swal.fire('Deleted!', 'Data pm stop machine has been deleted', 'success').then(() => {
              window.location.reload();
            });
          },
          (err) => {
            Swal.fire('Error!', 'Failed to delete the pm stop machine.', 'error');
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
        html: 'Please wait while saving PM Stop Machine Data.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      const formData = new FormData();
      formData.append('file', this.file);
      // unggah file Excel
      this.pmStopService.uploadFileExcel(formData).subscribe(
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
      html: 'Please wait while downloading PM Stop Machine Data.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.pmStopService.tamplateExcel().subscribe({
      next: (response) => {
        Swal.close();
        // Menggunakan nama file yang sudah ditentukan di backend
        const filename = 'PMSTOPMACHINE_DATA.xlsx'; // Nama file bisa dinamis jika diperlukan
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
      html: 'Please wait while downloading PM Stop Machine layout.',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
    this.pmStopService.tamplateExcel().subscribe({
      next: (response) => {
        Swal.close();
        // Menggunakan nama file yang sudah ditentukan di backend
        const filename = 'Layout_PMSTOPMACHINE.xlsx'; // Nama file bisa dinamis jika diperlukan
        saveAs(response, filename); // Mengunduh file
      },
      error: (err) => {
        Swal.close();
        Swal.fire('Error!', 'Error Downloading layout.', 'error');
        console.error('Download error:', err);
      },
    });
  }
  activateData(pm: PMStopMachine): void {
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
        this.pmStopService.activatePMStopMachine(pm).subscribe(
          (response) => {
            Swal.fire('Activated!', 'Data PM Stop Machine has been Activated', 'success').then(() => {
              window.location.reload();
            });
          },
          (err) => {
            Swal.fire('Error!', 'Failed to Activated the PM Stop Machine.', 'error');
          }
        );
      }
    });
  }
}
