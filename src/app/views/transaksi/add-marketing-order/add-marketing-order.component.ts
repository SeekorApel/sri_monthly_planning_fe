import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';

@Component({
  selector: 'app-add-marketing-order',
  templateUrl: './add-marketing-order.component.html',
  styleUrls: ['./add-marketing-order.component.scss']
})
export class AddMarketingOrderComponent implements OnInit {
  public isDisable: boolean = true;
  monthControl = new FormControl();
  monthControl2 = new FormControl({ value: '', disabled: this.isDisable });
  monthControl3 = new FormControl({ value: '', disabled: this.isDisable });
  public rows: any[] = [];
  public itemOptions: Array<Select2OptionData>;
  public options: Options = { width: '100%' };
  item: any;

  constructor(private router: Router) {
    this.itemOptions = [
      { id: '1171004076052', text: '1171004076052' },
      { id: '1170904046059', text: '1170904046059' },
      { id: '1171004046055', text: '1171004046055' },
      { id: '1021202087056', text: '1021202087056' },
      { id: '1023002087052', text: '1023002087052' }
    ];
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

  ngOnInit(): void {
  }

  // Menambah baris baru
  addRow() {
    const newRow = {
      kategori: '',
      item: '',
      deskripsi: '',
      typeMesin: '',
      kapasitas: '',
      qtyMould: '',
      qtyPerRak: '',
      minimalOrder: '',
      kapasitasMaksimum: '',
      stockAwal: '',
      salesForecast: '',
      marketingOrder: ''
    };
    this.rows.push(newRow);
  }

  // Menghapus baris berdasarkan index
  deleteRow(index: number) {
    this.rows.splice(index, 1);
  }

  // Menangani perubahan item yang dipilih
  onItemChange(row: any, selectedItem: string) {
    switch (selectedItem) {
      case '1171004076052':
        row.kategori = 'OEM TT';
        row.deskripsi = 'FED SET NR 80/90-17 FT 138 LR2';
        row.typeMesin = 'A/B';
        break;
      case '1170904046059':
        row.kategori = 'Kategori lain';
        row.deskripsi = 'Deskripsi lain';
        row.typeMesin = 'C/D';
        break;
      // Tambahkan case lain sesuai kebutuhan
      default:
        row.kategori = '';
        row.deskripsi = '';
        row.typeMesin = '';
    }
  }

  navigateToViewMo() {
    this.router.navigate(['/transaksi/view-marketing-order']);
  }
}
