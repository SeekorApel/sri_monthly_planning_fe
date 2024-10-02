import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';
import Swal from 'sweetalert2';
declare var $: any;

@Component({
  selector: 'app-add-marketing-order',
  templateUrl: './add-marketing-order.component.html',
  styleUrls: ['./add-marketing-order.component.scss']
})
export class AddMarketingOrderComponent implements OnInit {

  //Variable Declaration
  public isDisable: boolean = true;
  monthControl = new FormControl();
  monthControl2 = new FormControl({ value: '', disabled: this.isDisable });
  monthControl3 = new FormControl({ value: '', disabled: this.isDisable });
  formHeaderMo: FormGroup;

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
      looping_1: ['', [Validators.required, Validators.min(0)]],
      looping_2: ['', [Validators.required, Validators.min(0)]],
      looping_3: ['', [Validators.required, Validators.min(0)]],
      m_airbag_1: ['', [Validators.required, Validators.min(0)]],
      m_airbag_2: ['', [Validators.required, Validators.min(0)]],
      m_airbag_3: ['', [Validators.required, Validators.min(0)]],
      fdr_tl_1: ['', [Validators.required, Validators.min(0)]],
      fdr_tt_1: ['', [Validators.required, Validators.min(0)]],
      fdr_tl_2: ['', [Validators.required, Validators.min(0)]],
      fdr_tt_2: ['', [Validators.required, Validators.min(0)]],
      fdr_tl_3: ['', [Validators.required, Validators.min(0)]],
      fdr_tt_3: ['', [Validators.required, Validators.min(0)]],
      total_mo_1: ['', []],
      total_mo_2: ['', []],
      total_mo_3: ['', []],
      p_fdr_tl_1: ['', [Validators.required, Validators.min(0)]],
      p_fdr_tt_1: ['', [Validators.required, Validators.min(0)]],
      p_fdr_tl_2: ['', [Validators.required, Validators.min(0)]],
      p_fdr_tt_2: ['', [Validators.required, Validators.min(0)]],
      p_fdr_tl_3: ['', [Validators.required, Validators.min(0)]],
      p_fdr_tt_3: ['', [Validators.required, Validators.min(0)]],
    });
  }



  ngOnInit(): void {
    this.disabledField();
    this.loadValueTotal();

  }

  loadValueTotal() {
    const months = [1, 2, 3];

    months.forEach(month => {
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
    this.formHeaderMo.get('month_2').disable();
    this.formHeaderMo.get('month_3').disable();
    this.formHeaderMo.get('total_tlwd_1').disable();
    this.formHeaderMo.get('total_ttwd_1').disable();
    this.formHeaderMo.get('total_tlwd_2').disable();
    this.formHeaderMo.get('total_ttwd_2').disable();
    this.formHeaderMo.get('total_tlwd_3').disable();
    this.formHeaderMo.get('total_ttwd_3').disable();
    this.formHeaderMo.get('total_mo_1').disable();
    this.formHeaderMo.get('total_mo_2').disable();
    this.formHeaderMo.get('total_mo_3').disable();
  }

  saveHeaderMo() {
    debugger;
    let objectSave = this.formHeaderMo.value;
  }

  onMonthChange(event: Event, monthIndex: number) {
    const selectedDate = (event.target as HTMLInputElement).value;

    if (monthIndex === 1 && selectedDate) {
      const [year, month] = selectedDate.split('-');
      const nextMonth1 = this.getNextMonth(year, month, 1);
      const nextMonth2 = this.getNextMonth(year, month, 2);

      // Update monthControl2 dan monthControl3 dengan bulan yang sesuai
      this.monthControl2.setValue(nextMonth1);
      this.monthControl3.setValue(nextMonth2);
    } else if (monthIndex === 1 && !selectedDate) {
      // Clear bulan 2 dan bulan 3 jika bulan 1 di-clear
      this.monthControl2.setValue('');
      this.monthControl3.setValue('');
    }
  }

  getNextMonth(year: string, month: string, increment: number): string {
    let newMonth = parseInt(month) + increment;
    let newYear = year;

    if (newMonth > 12) {
      newMonth = 1;
      newYear = (parseInt(year) + 1).toString();
    }

    return `${newYear}-${newMonth < 10 ? '0' + newMonth : newMonth}`;
  }


  navigateToViewMo() {
    this.router.navigate(['/transaksi/view-marketing-order']);
  }
}
