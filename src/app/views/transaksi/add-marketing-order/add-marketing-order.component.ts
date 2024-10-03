import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';
import { MarketingOrder } from 'src/app/models/MarketingOrder';
import { MarketingOrderService } from 'src/app/services/transaksi/marketing order/marketing-order.service';
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

  constructor(private router: Router, private fb: FormBuilder, private marketingOrder: MarketingOrderService) {
    this.formHeaderMo = this.fb.group({
      date: ['', Validators.required],
      type: ['', Validators.required],
      revision: ['', []],
      month_0: ['', Validators.required],
      month_1: ['', []],
      month_2: ['', []],
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
    this.formHeaderMo.get('month_0')?.valueChanges.subscribe((value) => {
      this.calculateNextMonths(value);
    });
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
    // Buat instance baru dari MarketingOrder
    const marketingOrder: MarketingOrder = new MarketingOrder();

    // Isi propertinya dengan nilai dari form
    marketingOrder.revision = this.formHeaderMo.get('revision')?.value;
    marketingOrder.date = this.formHeaderMo.get('date')?.value;
    marketingOrder.type = this.formHeaderMo.get('type')?.value;
    marketingOrder.month_0 = new Date(this.formHeaderMo.get('month_0')?.value);
    marketingOrder.month_1 = new Date(this.formHeaderMo.get('month_1')?.value);
    marketingOrder.month_2 = new Date(this.formHeaderMo.get('month_2')?.value);

    this.marketingOrder.saveMarketingOrder(marketingOrder).subscribe(
      (response) => {
        // SweetAlert setelah update berhasil
        Swal.fire({
          title: 'Success!',
          text: 'Data plant successfully updated.',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then((result) => {
          if (result.isConfirmed) {
            console.log(response.data);
            window.location.reload();
          }
        });
      },
      (err) => {
        Swal.fire('Error!', 'Error updating data.', 'error');
      }
    );
  }

  navigateToViewMo() {
    this.router.navigate(['/transaksi/view-marketing-order']);
  }
}
