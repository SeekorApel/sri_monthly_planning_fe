import { Component, OnInit } from '@angular/core';
import { Select2OptionData } from 'ng-select2';
import { Options } from 'select2';

@Component({
  selector: 'app-add-header-mo',
  templateUrl: './add-header-mo.component.html',
  styleUrls: ['./add-header-mo.component.scss']
})
export class AddHeaderMoComponent implements OnInit {

  public isDisable: boolean;
  public rows: any[] = [];
  public itemOptions: Array<Select2OptionData>;
  public options: Options = { width: '100%' };
  item: any;

  constructor() {
    this.isDisable = true;
    this.itemOptions = [
      { id: '1171004076052', text: '1171004076052' },
      { id: '1170904046059', text: '1170904046059' },
      { id: '1171004046055', text: '1171004046055' },
      { id: '1021202087056', text: '1021202087056' },
      { id: '1023002087052', text: '1023002087052' }
    ];
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
}
