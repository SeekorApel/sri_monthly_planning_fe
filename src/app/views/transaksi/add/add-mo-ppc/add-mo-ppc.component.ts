import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MarketingOrder } from 'src/app/models/MarketingOrder';
import { MarketingOrderService } from 'src/app/services/transaksi/marketing order/marketing-order.service';
import Swal from 'sweetalert2';
import { DetailMarketingOrder } from 'src/app/models/DetailMarketingOrder';
import { ApiResponse } from 'src/app/response/Response';
import { ParsingNumberService } from 'src/app/utils/parsing-number/parsing-number.service';
import { NumberFormatService } from 'src/app/utils/number-format/number-format.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
declare var $: any;

@Component({
  selector: 'app-add-mo-ppc',
  templateUrl: './add-mo-ppc.component.html',
  styleUrls: ['./add-mo-ppc.component.scss'],
})
export class AddMoPpcComponent implements OnInit {
  //Variable Declaration
  capacityDb: string = '';
  lastIdMo: string = '';
  isDisable: boolean = true;
  isReadOnly: boolean = true;
  isInvalid: boolean = false;
  isSubmitted: boolean = false;
  formHeaderMo: FormGroup;
  isTableVisible: boolean = true;
  monthNames: string[] = ['', '', ''];
  searchText: string = '';
  marketingOrder: MarketingOrder = new MarketingOrder();
  headerMo: any[] = [];
  detailMarketingOrder: DetailMarketingOrder[];
  excelData: any[] = [];
  errorMessage: string | null = null;
  workDay: any[];

  //Error Message
  errorMessagesMinOrder: string[] = [];
  errorMessagesMachineType: string[] = [];

  //Pagination
  pageOfItems: Array<any>;
  pageSize: number = 5;
  totalPages: number = 5;
  headersColumns: string[] = ['no', 'category', 'partNumber', 'description', 'machineType', 'capacity', 'qtyPerMould', 'spareMould', 'mouldMonthlyPlan', 'qtyPerRak', 'minOrder', 'maxCap', 'status'];
  childHeadersColumns: string[] = ['maxCapMonth0', 'maxCapMonth1', 'maxCapMonth2', 'lockStatusM0', 'lockStatusM1', 'lockStatusM2'];
  rowData: string[] = ['no', 'category', 'partNumber', 'description', 'machineType', 'capacity', 'qtyPerMould', 'spareMould', 'mouldMonthlyPlan', 'qtyPerRak', 'minOrder', 'maxCapMonth0', 'maxCapMonth1', 'maxCapMonth2', 'lockStatusM0', 'lockStatusM1', 'lockStatusM2'];

  dataSource: MatTableDataSource<DetailMarketingOrder>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private router: Router, private fb: FormBuilder, private moService: MarketingOrderService, private parsingNumberService: ParsingNumberService, private numberService: NumberFormatService) {
    this.formHeaderMo = this.fb.group({
      date: [new Date().toISOString().substring(0, 10)],
      type: [null, Validators.required],
      month_0: [null, Validators.required],
      month_1: [null, []],
      month_2: [null, []],
      nwt_0: [null, []],
      nwt_1: [null, []],
      nwt_2: [null, []],
      ot_wt_0: [null, []],
      ot_wt_1: [null, []],
      ot_wt_2: [null, []],
      total_wt_0: [null, []],
      total_wt_1: [null, []],
      total_wt_2: [null, []],
      nwd_0: [null, []],
      nwd_1: [null, []],
      nwd_2: [null, []],
      tl_ot_wd_0: [null, []],
      tt_ot_wd_0: [null, []],
      tl_ot_wd_1: [null, []],
      tt_ot_wd_1: [null, []],
      tl_ot_wd_2: [null, []],
      tt_ot_wd_2: [null, []],
      total_tlwd_0: [null, []],
      total_ttwd_0: [null, []],
      total_tlwd_1: [null, []],
      total_ttwd_1: [null, []],
      total_tlwd_2: [null, []],
      total_ttwd_2: [null, []],
      max_tube_capa_0: [null, [Validators.required]],
      max_tube_capa_1: [null, [Validators.required]],
      max_tube_capa_2: [null, [Validators.required]],
      max_capa_tl_0: [null, [Validators.required]],
      max_capa_tt_0: [null, [Validators.required]],
      max_capa_tl_1: [null, [Validators.required]],
      max_capa_tt_1: [null, [Validators.required]],
      max_capa_tl_2: [null, [Validators.required]],
      max_capa_tt_2: [null, [Validators.required]],
      note_order_tl_0: [null, []],
      note_order_tl_1: [null, []],
      note_order_tl_2: [null, []],
    });

    this.moService.getCapacity().subscribe(
      (response: ApiResponse<any>) => {
        this.capacityDb = response.data;
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load capacity ' + error.message,
          confirmButtonText: 'OK',
        });
      }
    );

    this.formHeaderMo.valueChanges.subscribe((values) => {
      this.updateMonthNames();
    });

    for (let i = 0; i <= 2; i++) {
      this.formHeaderMo.get(`nwt_${i}`)?.valueChanges.subscribe(() => this.calculateTotalTube(`nwt_${i}`));
      this.formHeaderMo.get(`ot_wt_${i}`)?.valueChanges.subscribe(() => this.calculateTotalTube(`ot_wt_${i}`));
    }
  }

  ngOnInit(): void {
    this.getLastIdMo();
    this.loadValueTotal();
    this.formHeaderMo.get('month_0')?.valueChanges.subscribe((value) => {
      this.calculateNextMonths(value);
    });
    this.subscribeToValueChanges('max_tube_capa_0');
    this.subscribeToValueChanges('max_capa_tl_0');
    this.subscribeToValueChanges('max_capa_tt_0');

    this.subscribeToValueChanges('max_tube_capa_1');
    this.subscribeToValueChanges('max_capa_tl_1');
    this.subscribeToValueChanges('max_capa_tt_1');

    this.subscribeToValueChanges('max_tube_capa_2');
    this.subscribeToValueChanges('max_capa_tl_2');
    this.subscribeToValueChanges('max_capa_tt_2');
  }

  getLastIdMo(): void {
    this.moService.getLastIdMo().subscribe(
      (response: ApiResponse<string>) => {
        this.lastIdMo = response.data;
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to load data: ' + error.message,
        });
      }
    );
  }

  formatSeparator(value: number): string {
    return this.numberService.formatSeparator(value);
  }

  formatDecimal(value: number): string {
    return this.numberService.formatDecimal(value);
  }

  onMinOrderChange(mo: any, value: string) {
    const numericValue = Number(value.replace(/\./g, '').replace(',', '.'));
    mo.minOrder = numericValue;
  }

  formatNumberMo(value: any): string {
    if (value == null || value === '') {
      return '';
    }
    return Number(value).toLocaleString('id-ID');
  }

  lockUpdate(partNumber: number, lockStatusField: string) {
    const data = this.detailMarketingOrder.find((dmo) => dmo.partNumber === partNumber);
    if (data) {
      Swal.fire({
        title: 'Confirmation',
        text: `Are you sure you want to ${data[lockStatusField] === 0 ? 'lock' : 'unlock'} this?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          // If confirmed, toggle the lock status
          if (lockStatusField === 'lockStatusM0') {
            data.lockStatusM0 = data.lockStatusM0 === 0 ? 1 : 0;
          } else if (lockStatusField === 'lockStatusM1') {
            data.lockStatusM1 = data.lockStatusM1 === 0 ? 1 : 0;
          } else if (lockStatusField === 'lockStatusM2') {
            data.lockStatusM2 = data.lockStatusM2 === 0 ? 1 : 0;
          } else {
            console.error(`Field ${lockStatusField} is not valid`);
          }
          Swal.fire('Success!', 'Status has been updated.', 'success');
        }
      });
    } else {
      // Show SweetAlert if part number is not found
      Swal.fire({
        title: 'Error',
        text: `Part number ${partNumber} not found.`,
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  }

  separatorNumber(num: number): string {
    return this.parsingNumberService.separatorTableView(num);
  }

  onSearchChange(): void {
    this.dataSource.filter = this.searchText.trim().toLowerCase();
  }

  resetSearch(): void {
    this.searchText = '';
    this.dataSource.filter = '';
  }

  onInputChange(event: any, controlName: string): void {
    const inputValue = event.target.value;
    const formattedValue = this.numberService.formatDecimal(inputValue); // Format input
    this.formHeaderMo.controls[controlName].setValue(formattedValue, { emitEvent: false }); // Update FormControl tanpa memicu event
  }

  calculateTotalTube(controlName: string): void {
    const match = controlName.match(/(\w+)_(\d+)/);
    if (match) {
      const baseName = match[1];
      const index = match[2];

      const nwtValue = this.formHeaderMo.get(`nwt_${index}`)?.value ? parseFloat(this.formHeaderMo.get(`nwt_${index}`)?.value.replace(',', '.')) : 0;

      const otValue = this.formHeaderMo.get(`ot_wt_${index}`)?.value ? parseFloat(this.formHeaderMo.get(`ot_wt_${index}`)?.value.replace(',', '.')) : 0;

      const total = nwtValue + otValue;
      const formattedTotal = total.toLocaleString('id-ID', { minimumFractionDigits: 2 });

      this.formHeaderMo.get(`total_wt_${index}`)?.setValue(formattedTotal, { emitEvent: false });
    }
  }

  onChangeWorkDay(): void {
    const month0 = this.formHeaderMo.get('month_0')?.value;
    const month1 = this.formHeaderMo.get('month_1')?.value;
    const month2 = this.formHeaderMo.get('month_2')?.value;
    const extractMonthYear = (monthYear: string) => {
      const [year, month] = monthYear.split('-'); // Pisahkan tahun dan bulan
      return { year: Number(year), month: Number(month) };
    };

    const { month: month1Val, year: year1Val } = extractMonthYear(month0);
    const { month: month2Val, year: year2Val } = extractMonthYear(month1);
    const { month: month3Val, year: year3Val } = extractMonthYear(month2);

    const varWd = {
      month1: month1Val,
      year1: year1Val,
      month2: month2Val,
      year2: year2Val,
      month3: month3Val,
      year3: year3Val,
    };
    this.getWorkDays(varWd);
  }

  getWorkDays(data: any) {
    this.moService.getWorkDay(data).subscribe(
      (response) => {
        if (response && response.data && response.data.length > 0) {
          let workDataM0 = response.data[0];
          let workDataM1 = response.data[1];
          let workDataM2 = response.data[2];

          this.formHeaderMo.patchValue({
            nwd_0: this.parsingNumberService.separatorAndDecimalView(workDataM0.wdNormalTire),
            nwt_0: this.parsingNumberService.separatorAndDecimalView(workDataM0.wdNormalTire),
            tl_ot_wd_0: this.parsingNumberService.separatorAndDecimalView(workDataM0.wdOtTl),
            tt_ot_wd_0: this.parsingNumberService.separatorAndDecimalView(workDataM0.wdOtTt),
            total_tlwd_0: this.parsingNumberService.separatorAndDecimalView(workDataM0.totalWdTl),
            total_ttwd_0: this.parsingNumberService.separatorAndDecimalView(workDataM0.totalWdTt),

            nwd_1: this.parsingNumberService.separatorAndDecimalView(workDataM1.wdNormalTire),
            nwt_1: this.parsingNumberService.separatorAndDecimalView(workDataM1.wdNormalTire),
            tl_ot_wd_1: this.parsingNumberService.separatorAndDecimalView(workDataM1.wdOtTl),
            tt_ot_wd_1: this.parsingNumberService.separatorAndDecimalView(workDataM1.wdOtTt),
            total_tlwd_1: this.parsingNumberService.separatorAndDecimalView(workDataM1.totalWdTl),
            total_ttwd_1: this.parsingNumberService.separatorAndDecimalView(workDataM1.totalWdTt),

            nwd_2: this.parsingNumberService.separatorAndDecimalView(workDataM2.wdNormalTire),
            nwt_2: this.parsingNumberService.separatorAndDecimalView(workDataM2.wdNormalTire),
            tl_ot_wd_2: this.parsingNumberService.separatorAndDecimalView(workDataM2.wdOtTl),
            tt_ot_wd_2: this.parsingNumberService.separatorAndDecimalView(workDataM2.wdOtTt),
            total_tlwd_2: this.parsingNumberService.separatorAndDecimalView(workDataM2.totalWdTl),
            total_ttwd_2: this.parsingNumberService.separatorAndDecimalView(workDataM2.totalWdTt),
          });
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'No Data',
            text: 'No work data found.',
          });
        }
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error Occurred',
          text: 'Unable to retrieve work data. Please try again.',
        });
        console.error('Error fetching work days:', error);
      }
    );
  }

  subscribeToValueChanges(controlName: string) {
    this.formHeaderMo.get(controlName)?.valueChanges.subscribe((value) => {
      this.formatInputValue(value, controlName);
    });
  }

  formatInputValue(value: string | null, controlName: string) {
    if (value) {
      const numericValue = value.replace(/[^0-9]/g, '');
      const formattedValue = new Intl.NumberFormat('id-ID').format(Number(numericValue));
      this.formHeaderMo.get(controlName)?.setValue(formattedValue, { emitEvent: false });
    }
  }

  parseFormattedValue(formattedValue: string | null): number | null {
    if (formattedValue && typeof formattedValue === 'string') {
      const numericString = formattedValue.replace(/\./g, '').replace(',', '.');
      return parseFloat(numericString);
    }
    return null;
  }

  formatNumber(value: number): string {
    if (value !== null && value !== undefined) {
      // Mengubah angka menjadi string
      let strValue = value.toString();

      // Memisahkan bagian desimal dan bagian bulat
      const parts = strValue.split('.');
      const integerPart = parts[0];
      const decimalPart = parts[1] ? ',' + parts[1] : '';

      // Menambahkan separator ribuan
      const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

      return formattedInteger + decimalPart;
    }
    return '';
  }

  // Fungsi untuk memperbarui array nama bulan
  updateMonthNames(): void {
    this.monthNames[0] = this.getMonthName(this.formHeaderMo.get('month_0')?.value);
    this.monthNames[1] = this.getMonthName(this.formHeaderMo.get('month_1')?.value);
    this.monthNames[2] = this.getMonthName(this.formHeaderMo.get('month_2')?.value);
  }

  // Fungsi untuk mengambil nama bulan dari inputan month
  getMonthName(monthValue: string): string {
    if (monthValue) {
      const date = new Date(monthValue + '-01'); // Format input 'yyyy-MM'
      return date.toLocaleString('default', { month: 'short' }).toUpperCase(); // Nama bulan singkat
    }
    return '';
  }

  // Fungsi untuk mengatur bulan berikutnya
  calculateNextMonths(month0: string): void {
    if (month0) {
      const month0Date = new Date(month0 + '-01');

      const month1Date = new Date(month0Date);
      month1Date.setMonth(month0Date.getMonth() + 1); // Menambahkan 1 bulan

      const month2Date = new Date(month0Date);
      month2Date.setMonth(month0Date.getMonth() + 2); // Menambahkan 2 bulan

      // Set nilai pada month_2 dan month_3
      this.formHeaderMo.patchValue({
        month_1: this.formatDate(month1Date),
        month_2: this.formatDate(month2Date),
      });
    }
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${year}-${month}`;
  }

  loadValueTotal() {
    const months = [0, 1, 2];

    months.forEach((month) => {
      this.formHeaderMo.get(`nwd_${month}`)?.valueChanges.subscribe(() => this.calculateTotal(month));
      this.formHeaderMo.get(`tl_ot_wd_${month}`)?.valueChanges.subscribe(() => this.calculateTotal(month));
      this.formHeaderMo.get(`tt_ot_wd_${month}`)?.valueChanges.subscribe(() => this.calculateTotal(month));
    });
  }

  calculateTotal(month: number): void {
    const nwd = this.formHeaderMo.get(`nwd_${month}`)?.value || 0;
    const tlOtWd = this.formHeaderMo.get(`tl_ot_wd_${month}`)?.value || 0;
    const ttOtWd = this.formHeaderMo.get(`tt_ot_wd_${month}`)?.value || 0;

    // Hitung total
    const totalTlWd = parseFloat(nwd) + parseFloat(tlOtWd);
    const totalTtWd = parseFloat(nwd) + parseFloat(ttOtWd);

    // Mengatur nilai dengan dua angka di belakang koma
    this.formHeaderMo.patchValue({ [`total_tlwd_${month}`]: totalTlWd.toFixed(2) });
    this.formHeaderMo.patchValue({ [`total_ttwd_${month}`]: totalTtWd.toFixed(2) });
  }

  showDetailMo() {
    if (this.formHeaderMo.invalid) {
      this.formHeaderMo.markAllAsTouched();
      return;
    }
    this.fillTheTableMo();
    this.isTableVisible = true;
  }

  fillTheTableMo(): void {
    let month0full = this.formHeaderMo.get('month_0').value;
    let month1full = this.formHeaderMo.get('month_1').value;
    let month2full = this.formHeaderMo.get('month_2').value;

    function formatToMMYYYY(dateString) {
      const [year, month] = dateString.split('-');
      return `${month}-${year}`;
    }

    month0full = formatToMMYYYY(month0full);
    month1full = formatToMMYYYY(month1full);
    month2full = formatToMMYYYY(month2full);

    const totalHKTL1form = parseFloat(this.formHeaderMo.get('total_tlwd_0').value.replace(',', '.')) || 0;
    const totalHKTL2form = parseFloat(this.formHeaderMo.get('total_tlwd_1').value.replace(',', '.')) || 0;
    const totalHKTL3form = parseFloat(this.formHeaderMo.get('total_tlwd_2').value.replace(',', '.')) || 0;
    const totalHKTT1from = parseFloat(this.formHeaderMo.get('total_ttwd_0').value.replace(',', '.')) || 0;
    const totalHKTT2form = parseFloat(this.formHeaderMo.get('total_ttwd_1').value.replace(',', '.')) || 0;
    const totalHKTT3form = parseFloat(this.formHeaderMo.get('total_ttwd_2').value.replace(',', '.')) || 0;
    const typeMoForm = this.formHeaderMo.get('type').value;

    let data = {
      monthYear0: month0full,
      monthYear1: month1full,
      monthYear2: month2full,
      totalHKTT1: totalHKTT1from.toString(),
      totalHKTT2: totalHKTT2form.toString(),
      totalHKTT3: totalHKTT3form.toString(),
      totalHKTL1: totalHKTL1form.toString(),
      totalHKTL2: totalHKTL2form.toString(),
      totalHKTL3: totalHKTL3form.toString(),
      productMerk: typeMoForm,
    };

    this.moService.getDetailMarketingOrder(data).subscribe(
      (response: ApiResponse<DetailMarketingOrder[]>) => {
        this.detailMarketingOrder = response.data;
        this.dataSource = new MatTableDataSource(this.detailMarketingOrder);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.detailMarketingOrder.forEach((item) => {
          item.lockStatusM0 = 0;
          item.lockStatusM1 = 0;
          item.lockStatusM2 = 0;
        });
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Failed to load detail Marketing Order',
          text: error.message,
          confirmButtonText: 'OK',
        });
      }
    );
  }

  saveAllMo() {
    this.isSubmitted = true;

    const hasInvalidMinOrderOrMachineType = this.detailMarketingOrder.some((item) => item.minOrder === null || item.machineType === null);

    if (hasInvalidMinOrderOrMachineType) {
      Swal.fire({
        title: 'Warning!',
        text: 'Please fill in all fields in the Marekting Order form.',
        icon: 'warning',
        confirmButtonText: 'OK',
      });
      return;
    }

    const month0 = this.formHeaderMo.get('month_0')?.value;
    const month1 = this.formHeaderMo.get('month_1')?.value;
    const month2 = this.formHeaderMo.get('month_2')?.value;
    const type = this.formHeaderMo.get('type')?.value;
    const extractMonthYear = (monthYear: string) => {
      const [year, month] = monthYear.split('-'); // Pisahkan tahun dan bulan
      return { year: Number(year), month: Number(month) };
    };

    const { month: month1Val, year: year1Val } = extractMonthYear(month0);
    const { month: month2Val, year: year2Val } = extractMonthYear(month1);
    const { month: month3Val, year: year3Val } = extractMonthYear(month2);

    const varWd = {
      month1: month1Val,
      year1: year1Val,
      month2: month2Val,
      year2: year2Val,
      month3: month3Val,
      year3: year3Val,
      type: type,
    };

    // Validate available months before proceeding
    this.validateAvailableMonths(varWd).then((isValid) => {
      if (!isValid) {
        return;
      }

      // Proceed with data preparation and saving if validation passes
      this.setDataSaveMo();

      const saveMo = {
        marketingOrder: this.marketingOrder,
        headerMarketingOrder: this.headerMo,
        detailMarketingOrder: this.detailMarketingOrder,
      };

      this.moService.saveMarketingOrderPPC(saveMo).subscribe(
        (response) => {
          Swal.fire({
            title: 'Success!',
            text: 'Data Marketing Order successfully Added.',
            icon: 'success',
            confirmButtonText: 'OK',
          }).then((result) => {
            if (result.isConfirmed) {
              this.navigateToViewMo();
            }
          });
        },
        (err) => {
          Swal.fire('Error!', 'Error insert data Marketing Order.', 'error');
        }
      );
    });
  }

  validateAvailableMonths(varWd): Promise<boolean> {
    return new Promise((resolve) => {
      this.moService.getAvaiableMonth(varWd).subscribe(
        (response) => {
          if (response.data === 0) {
            // Jika response.data adalah 0, maka validasi berhasil
            resolve(true); // Validation passed
          } else if (response.data === 1) {
            // Jika response.data adalah 1, tampilkan pesan kesalahan
            Swal.fire({
              title: 'Error',
              text: 'Marketing Order data for the same month and year already exists.',
              icon: 'error',
              confirmButtonText: 'OK',
            }).then((result) => {
              if (result.isConfirmed) {
                resolve(false);
              }
            });
          } else {
            resolve(false);
          }
        },
        (err) => {
          Swal.fire('Error!', 'Error getting available month validation.', 'error');
          resolve(false);
        }
      );
    });
  }

  setDataSaveMo() {
    // Set data Save MO
    this.marketingOrder.moId = this.lastIdMo;
    this.marketingOrder.dateValid = this.formHeaderMo.get('date')?.value;
    this.marketingOrder.type = this.formHeaderMo.get('type')?.value;
    this.marketingOrder.month0 = new Date(this.formHeaderMo.get('month_0')?.value);
    this.marketingOrder.month1 = new Date(this.formHeaderMo.get('month_1')?.value);
    this.marketingOrder.month2 = new Date(this.formHeaderMo.get('month_2')?.value);

    // Set data save Header Mo
    this.headerMo = [];
    for (let i = 0; i < 3; i++) {
      let otWdTubeValue = this.parseFormattedValue(this.formHeaderMo.get(`ot_wt_${i}`)?.value) ?? 0;
      this.headerMo.push({
        moId: this.lastIdMo,
        month: new Date(this.formHeaderMo.get(`month_${i}`)?.value),
        wdNormalTire: this.parseFormattedValue(this.formHeaderMo.get(`nwd_${i}`)?.value),
        wdNormalTube: this.parseFormattedValue(this.formHeaderMo.get(`nwt_${i}`)?.value),
        wdOtTube: otWdTubeValue,
        wdOtTl: this.parseFormattedValue(this.formHeaderMo.get(`tl_ot_wd_${i}`)?.value),
        wdOtTt: this.parseFormattedValue(this.formHeaderMo.get(`tt_ot_wd_${i}`)?.value),
        totalWdTube: this.parseFormattedValue(this.formHeaderMo.get(`total_wt_${i}`)?.value),
        totalWdTl: this.parseFormattedValue(this.formHeaderMo.get(`total_tlwd_${i}`)?.value),
        totalWdTt: this.parseFormattedValue(this.formHeaderMo.get(`total_ttwd_${i}`)?.value),
        maxCapTube: this.parseFormattedValue(this.formHeaderMo.get(`max_tube_capa_${i}`)?.value || ''),
        maxCapTl: this.parseFormattedValue(this.formHeaderMo.get(`max_capa_tl_${i}`)?.value || ''),
        maxCapTt: this.parseFormattedValue(this.formHeaderMo.get(`max_capa_tt_${i}`)?.value || ''),
        noteOrderTl: this.formHeaderMo.get(`note_order_tl_${i}`)?.value,
      });
    }

    // Set data save Detail Mo
    this.detailMarketingOrder.forEach((item) => {
      item.moId = this.lastIdMo;
      item.minOrder = Number(item.minOrder.toString().replace('.', ''));
    });
  }

  navigateToViewMo() {
    this.router.navigate(['/transaksi/view-mo-ppc']);
  }
}
