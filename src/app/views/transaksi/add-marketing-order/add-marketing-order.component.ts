import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';
import { MarketingOrder } from 'src/app/models/MarketingOrder';
import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-add-marketing-order',
  templateUrl: './add-marketing-order.component.html',
  styleUrls: ['./add-marketing-order.component.scss'],
})
export class AddMarketingOrderComponent implements OnInit {
  //Variable Declaration
  public isDisable: boolean = true;
  formHeaderMo: FormGroup;

  saveMarketingOrders: MarketingOrder[] = [];

  constructor(private router: Router, private fb: FormBuilder) {
    this.formHeaderMo = this.fb.group({
      date: ['', Validators.required],
      type: ['', Validators.required],
      revision: ['', []],
      month_1: ['', Validators.required],
      month_2: ['', []],
      month_3: ['', []],
      nwd_1: ['', Validators.required],
      nwd_2: ['', Validators.required],
      nwd_3: ['', Validators.required],
      tl_ot_wd_1: ['', [Validators.required, Validators.min(0)]],
      tt_ot_wd_1: ['', [Validators.required, Validators.min(0)]],
      tl_ot_wd_2: ['', [Validators.required, Validators.min(0)]],
      tt_ot_wd_2: ['', [Validators.required, Validators.min(0)]],
      tl_ot_wd_3: ['', [Validators.required, Validators.min(0)]],
      tt_ot_wd_3: ['', [Validators.required, Validators.min(0)]],
      total_tlwd_1: ['', []],
      total_ttwd_1: ['', []],
      total_tlwd_2: ['', []],
      total_ttwd_2: ['', []],
      total_tlwd_3: ['', []],
      total_ttwd_3: ['', []],
      max_tube_capa_1: ['', [Validators.required, Validators.min(0)]],
      max_tube_capa_2: ['', [Validators.required, Validators.min(0)]],
      max_tube_capa_3: ['', [Validators.required, Validators.min(0)]],
      max_capa_tl_1: ['', [Validators.required, Validators.min(0)]],
      max_capa_tt_1: ['', [Validators.required, Validators.min(0)]],
      max_capa_tl_2: ['', [Validators.required, Validators.min(0)]],
      max_capa_tt_2: ['', [Validators.required, Validators.min(0)]],
      max_capa_tl_3: ['', [Validators.required, Validators.min(0)]],
      max_capa_tt_3: ['', [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit(): void {
    this.disabledField();
    this.loadValueTotal();
    this.formHeaderMo.get('month_1')?.valueChanges.subscribe((value) => {
      this.calculateNextMonths(value);
    });
  }

  // Fungsi untuk mengatur bulan berikutnya
  calculateNextMonths(month1: string): void {
    if (month1) {
      const month1Date = new Date(month1 + '-01');

      const month2Date = new Date(month1Date);
      month2Date.setMonth(month1Date.getMonth() + 1); // Menambahkan 1 bulan

      const month3Date = new Date(month1Date);
      month3Date.setMonth(month1Date.getMonth() + 2); // Menambahkan 2 bulan

      // Set nilai pada month_2 dan month_3
      this.formHeaderMo.patchValue({
        month_2: this.formatDate(month2Date),
        month_3: this.formatDate(month3Date),
      });
    }
  }

  // Fungsi untuk format date ke YYYY-MM
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${year}-${month}`;
  }

  loadValueTotal() {
    const months = [1, 2, 3];

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

  disabledField() {
    this.formHeaderMo.get('total_tlwd_1').disable();
    this.formHeaderMo.get('total_ttwd_1').disable();
    this.formHeaderMo.get('total_tlwd_2').disable();
    this.formHeaderMo.get('total_ttwd_2').disable();
    this.formHeaderMo.get('total_tlwd_3').disable();
    this.formHeaderMo.get('total_ttwd_3').disable();
  }

  saveHeaderMo() {
    console.log(this.formHeaderMo.value);
  }

  navigateToViewMo() {
    this.router.navigate(['/transaksi/view-marketing-order']);
  }
}
